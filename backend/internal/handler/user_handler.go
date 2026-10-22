package handler

import (
	"fmt"
	"net/http"
	"time"

	"gls_fik/backend/internal/config"
	"gls_fik/backend/internal/model"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type CreateUserRequest struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	Role     string `json:"role" binding:"required"` // 'user' atau 'admin'
}

type UpdateUserRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"` // opsional
	Role     string `json:"role"`
}

// GetUsers menangani GET /api/users (Admin Only)
func GetUsers(c *gin.Context) {
	var users []model.User
	if err := config.DB.Order("created_at DESC").Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data pengguna"})
		return
	}
	c.JSON(http.StatusOK, users)
}

// CreateUser menangani POST /api/users (Admin Only)
func CreateUser(c *gin.Context) {
	var req CreateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Cek apakah email sudah terdaftar
	var existing model.User
	if err := config.DB.Where("email = ?", req.Email).First(&existing).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Email sudah digunakan oleh akun lain"})
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengenkripsi kata sandi"})
		return
	}

	newUser := model.User{
		ID:        fmt.Sprintf("user-%d", time.Now().Unix()),
		Name:      req.Name,
		Email:     req.Email,
		Password:  string(hashedPassword),
		Role:      req.Role,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if err := config.DB.Create(&newUser).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan pengguna baru"})
		return
	}

	c.JSON(http.StatusCreated, newUser)
}

// UpdateUser menangani PUT /api/users/:id (Admin Only)
func UpdateUser(c *gin.Context) {
	id := c.Param("id")
	var user model.User
	if err := config.DB.First(&user, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Pengguna tidak ditemukan"})
		return
	}

	var req UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if req.Name != "" {
		user.Name = req.Name
	}
	if req.Email != "" {
		user.Email = req.Email
	}
	if req.Role != "" {
		user.Role = req.Role
	}
	if req.Password != "" {
		hashed, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err == nil {
			user.Password = string(hashed)
		}
	}
	user.UpdatedAt = time.Now()

	if err := config.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memperbarui pengguna"})
		return
	}

	c.JSON(http.StatusOK, user)
}

// DeleteUser menangani DELETE /api/users/:id (Admin Only)
func DeleteUser(c *gin.Context) {
	id := c.Param("id")

	// Cegah admin menghapus dirinya sendiri
	currentUserID, _ := c.Get("userId")
	if currentUserID == id {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Tidak dapat menghapus akun Anda sendiri"})
		return
	}

	if err := config.DB.Delete(&model.User{}, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menghapus pengguna"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Pengguna berhasil dihapus"})
}

// ProfileResponse represents public user details for coaches and athletes
type ProfileResponse struct {
	ID             string `json:"id"`
	Name           string `json:"name"`
	Email          string `json:"email"`
	Role           string `json:"role"`
	Avatar         string `json:"avatar,omitempty"`
	Bio            string `json:"bio,omitempty"`
	CompletedCount int    `json:"completedCount,omitempty"`
	TotalCount     int    `json:"totalCount,omitempty"`
}

// GetProfiles handles GET /api/profiles (Public)
func GetProfiles(c *gin.Context) {
	var users []model.User
	if err := config.DB.Where("role IN ?", []string{"coach", "athlete", "admin"}).Order("role ASC, name ASC").Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve profiles"})
		return
	}

	var totalTechniques int64
	config.DB.Model(&model.Technique{}).Count(&totalTechniques)

	profiles := make([]ProfileResponse, len(users))
	for i, u := range users {
		var completedCount int64 = 0
		if u.Role == "athlete" {
			config.DB.Model(&model.AthleteProgress{}).Where("athlete_id = ? AND is_completed = true", u.ID).Count(&completedCount)
		}
		profiles[i] = ProfileResponse{
			ID:             u.ID,
			Name:           u.Name,
			Email:          u.Email,
			Role:           u.Role,
			Avatar:         u.Avatar,
			Bio:            u.Bio,
			CompletedCount: int(completedCount),
			TotalCount:     int(totalTechniques),
		}
	}

	c.JSON(http.StatusOK, profiles)
}

// UpdateProfileRequest payload for self profile updates
type UpdateProfileRequest struct {
	Name   string `json:"name"`
	Bio    string `json:"bio"`
	Avatar string `json:"avatar"`
}

// UpdateMyProfile handles PUT /api/auth/profile (Authenticated)
func UpdateMyProfile(c *gin.Context) {
	userID, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var user model.User
	if err := config.DB.First(&user, "id = ?", userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	var req UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if req.Name != "" {
		user.Name = req.Name
	}
	user.Bio = req.Bio
	if req.Avatar != "" {
		user.Avatar = req.Avatar
	}
	user.UpdatedAt = time.Now()

	if err := config.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile"})
		return
	}

	c.JSON(http.StatusOK, user)
}

