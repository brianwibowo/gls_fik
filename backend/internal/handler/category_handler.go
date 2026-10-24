package handler

import (
	"encoding/base64"
	"errors"
	"net/http"
	"strings"
	"time"
	"unicode/utf8"

	"github.com/gin-gonic/gin"
	"gls_fik/backend/internal/config"
	"gls_fik/backend/internal/model"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

func GetCategories(c *gin.Context) {
	categories := []model.Category{}
	if err := config.DB.Omit("CoverData").Order("categories.order ASC, created_at ASC, id ASC").Find(&categories).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data kategori"})
		return
	}
	c.JSON(http.StatusOK, categories)
}

type categoryRequest struct {
	Name        string  `json:"name"`
	Description string  `json:"description"`
	CoverData   *string `json:"coverData"`
}

func (req categoryRequest) apply(category *model.Category) error {
	if strings.TrimSpace(req.Name) == "" || utf8.RuneCountInString(req.Name) > 128 {
		return errors.New("Nama kategori wajib diisi, maksimal 128 karakter")
	}
	if utf8.RuneCountInString(req.Description) > 20000 {
		return errors.New("Deskripsi maksimal 20000 karakter")
	}
	category.Name = strings.TrimSpace(req.Name)
	category.Description = strings.TrimSpace(req.Description)
	if req.CoverData != nil {
		if *req.CoverData == "" {
			category.Thumbnail, category.CoverType, category.CoverData = "", "", nil
			return nil
		}
		encoded := strings.SplitN(*req.CoverData, ",", 2)
		if len(encoded) != 2 || len(encoded[1]) > 700000 {
			return errors.New("Sampul gambar maksimal 512 KB setelah diperkecil")
		}
		data, err := base64.StdEncoding.DecodeString(encoded[1])
		if err != nil || len(data) == 0 || len(data) > 512*1024 {
			return errors.New("Data sampul tidak valid atau terlalu besar")
		}
		mime := http.DetectContentType(data)
		if mime != "image/webp" && mime != "image/jpeg" && mime != "image/png" && mime != "image/gif" {
			return errors.New("Sampul harus berupa gambar WebP, JPG, PNG, atau GIF")
		}
		category.CoverData, category.CoverType = data, mime
	}
	return nil
}

func setCategoryCoverURL(c *gin.Context, category *model.Category) {
	if len(category.CoverData) > 0 {
		category.Thumbnail = apiOrigin(c) + "/api/categories/" + category.ID + "/cover?v=" + category.UpdatedAt.UTC().Format("20060102150405.000000000")
	}
}

func CreateCategory(c *gin.Context) {
	c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, 900000)
	var req categoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Data kategori tidak valid atau sampul terlalu besar"})
		return
	}
	category := model.Category{ID: newID("cat-"), UpdatedAt: time.Now()}
	if err := req.apply(&category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	setCategoryCoverURL(c, &category)
	err := config.DB.Transaction(func(tx *gorm.DB) error {
		// Serialize appends so simultaneous creations each receive the next position.
		if err := tx.Exec("LOCK TABLE categories IN SHARE ROW EXCLUSIVE MODE").Error; err != nil {
			return err
		}
		var last int
		if err := tx.Model(&model.Category{}).Select("COALESCE(MAX(\"order\"), 0)").Scan(&last).Error; err != nil {
			return err
		}
		category.Order = last + 1
		return tx.Omit("Videos").Create(&category).Error
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menambahkan kategori"})
		return
	}
	c.JSON(http.StatusCreated, category)
}

func UpdateCategory(c *gin.Context) {
	c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, 900000)
	var req categoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Data kategori tidak valid atau sampul terlalu besar"})
		return
	}
	var category model.Category
	var validationError error
	err := config.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).First(&category, "id = ?", c.Param("id")).Error; err != nil {
			return err
		}
		if validationError = req.apply(&category); validationError != nil {
			return validationError
		}
		category.UpdatedAt = time.Now()
		setCategoryCoverURL(c, &category)
		return tx.Omit("Videos").Save(&category).Error
	})
	if validationError != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": validationError.Error()})
		return
	}
	if err != nil {
		categoryError(c, err, "Gagal memperbarui kategori")
		return
	}
	c.JSON(http.StatusOK, category)
}

func DeleteCategory(c *gin.Context) {
	err := config.DB.Transaction(func(tx *gorm.DB) error {
		var category model.Category
		if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).First(&category, "id = ?", c.Param("id")).Error; err != nil {
			return err
		}
		var videos []model.Video
		if err := tx.Where("category_id = ?", category.ID).Find(&videos).Error; err != nil {
			return err
		}
		for _, video := range videos {
			if err := deleteVideoData(tx, video.ID); err != nil {
				return err
			}
		}
		var techniques []model.Technique
		if err := tx.Where("category_id = ?", category.ID).Find(&techniques).Error; err != nil {
			return err
		}
		for _, technique := range techniques {
			for _, table := range []any{&model.AthleteProgress{}, &model.TechniqueEvaluation{}} {
				if err := tx.Where("technique_id = ?", technique.ID).Delete(table).Error; err != nil {
					return err
				}
			}
		}
		if err := tx.Where("category_id = ?", category.ID).Delete(&model.Technique{}).Error; err != nil {
			return err
		}
		return tx.Delete(&category).Error
	})
	if err != nil {
		categoryError(c, err, "Gagal menghapus kategori")
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Kategori berhasil dihapus"})
}

func categoryError(c *gin.Context, err error, message string) {
	if errors.Is(err, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusNotFound, gin.H{"error": "Kategori tidak ditemukan. Muat ulang daftar kategori."})
		return
	}
	c.JSON(http.StatusInternalServerError, gin.H{"error": message})
}

func GetCategoryCover(c *gin.Context) {
	var category model.Category
	if err := config.DB.Select("id", "cover_data", "cover_type").First(&category, "id = ?", c.Param("id")).Error; err != nil {
		categoryError(c, err, "Sampul gagal dimuat")
		return
	}
	if len(category.CoverData) == 0 {
		c.Status(http.StatusNotFound)
		return
	}
	c.Header("Cache-Control", "public, max-age=3600")
	c.Header("X-Content-Type-Options", "nosniff")
	c.Data(http.StatusOK, category.CoverType, category.CoverData)
}
