package handler

import (
	"net/http"

	"gls_fik/backend/internal/config"
	"gls_fik/backend/internal/model"

	"github.com/gin-gonic/gin"
)

// GetVideos menangani request GET /api/videos
// Mendukung filter opsional via query param: /api/videos?categoryId=cat-fx
func GetVideos(c *gin.Context) {
	var videos []model.Video
	query := config.DB.Order("episode_num ASC")

	// Ambil query parameter "?categoryId=..." jika ada di URL
	categoryID := c.Query("categoryId")
	if categoryID != "" {
		query = query.Where("category_id = ?", categoryID)
	}

	if err := query.Find(&videos).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Gagal mengambil data video",
		})
		return
	}

	c.JSON(http.StatusOK, videos)
}

// GetVideoByID menangani request GET /api/videos/:id
// Mengambil detail satu video berdasarkan ID untuk player /watch/[id]
func GetVideoByID(c *gin.Context) {
	// Ambil parameter URL ":id" (misal: vid-fx-1)
	id := c.Param("id")
	var video model.Video

	// Query GORM: SELECT * FROM videos WHERE id = ? LIMIT 1
	if err := config.DB.First(&video, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Video tidak ditemukan",
		})
		return
	}

	c.JSON(http.StatusOK, video)
}

// CreateVideo menangani POST /api/videos (Admin Only)
func CreateVideo(c *gin.Context) {
	var video model.Video
	if err := c.ShouldBindJSON(&video); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := config.DB.Create(&video).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menambahkan video"})
		return
	}

	c.JSON(http.StatusCreated, video)
}

// UpdateVideo menangani PUT /api/videos/:id (Admin Only)
func UpdateVideo(c *gin.Context) {
	id := c.Param("id")
	var video model.Video

	if err := config.DB.First(&video, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Video tidak ditemukan"})
		return
	}

	if err := c.ShouldBindJSON(&video); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	video.ID = id
	if err := config.DB.Save(&video).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memperbarui video"})
		return
	}

	c.JSON(http.StatusOK, video)
}

// DeleteVideo menangani DELETE /api/videos/:id (Admin Only)
func DeleteVideo(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&model.Video{}, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menghapus video"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Video berhasil dihapus"})
}
