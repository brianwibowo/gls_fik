package handler

import (
	"net/http"

	"gls_fik/backend/internal/config"
	"gls_fik/backend/internal/model"

	"github.com/gin-gonic/gin"
)

// GetCategories menangani request GET /api/categories
// Mengambil semua kategori dari database, diurutkan berdasarkan field order
func GetCategories(c *gin.Context) {
	var categories []model.Category

	// Query GORM: SELECT * FROM categories ORDER BY categories.order ASC
	if err := config.DB.Order("categories.order ASC").Find(&categories).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Gagal mengambil data kategori",
		})
		return
	}

	// Mengembalikan response HTTP 200 dengan array kategori dalam format JSON
	c.JSON(http.StatusOK, categories)
}

// CreateCategory menangani POST /api/categories (Admin Only)
func CreateCategory(c *gin.Context) {
	var category model.Category
	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := config.DB.Create(&category).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menambahkan kategori"})
		return
	}

	c.JSON(http.StatusCreated, category)
}

// UpdateCategory menangani PUT /api/categories/:id (Admin Only)
func UpdateCategory(c *gin.Context) {
	id := c.Param("id")
	var category model.Category

	if err := config.DB.First(&category, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Kategori tidak ditemukan"})
		return
	}

	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	category.ID = id
	if err := config.DB.Save(&category).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memperbarui kategori"})
		return
	}

	c.JSON(http.StatusOK, category)
}

// DeleteCategory menangani DELETE /api/categories/:id (Admin Only)
func DeleteCategory(c *gin.Context) {
	id := c.Param("id")

	// Hapus video yang terkait dengan kategori ini terlebih dahulu
	config.DB.Where("category_id = ?", id).Delete(&model.Video{})

	if err := config.DB.Delete(&model.Category{}, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menghapus kategori"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Kategori berhasil dihapus"})
}
