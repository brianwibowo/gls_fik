package handler

import (
	"errors"
	"net/http"
	"strings"
	"time"

	"gls_fik/backend/internal/config"
	"gls_fik/backend/internal/model"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type CreateUserRequest struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"omitempty,min=6,max=72"`
	Role     string `json:"role" binding:"required,oneof=user admin"`
}

type UpdateUserRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email" binding:"omitempty,email"`
	Password string `json:"password" binding:"omitempty,min=6,max=72"`
	Role     string `json:"role" binding:"omitempty,oneof=user admin"`
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
	req.Email = normalizedEmail(req.Email)
	if strings.TrimSpace(req.Name) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Nama wajib diisi"})
		return
	}
	var existing model.User
	err := config.DB.Where("email = ?", req.Email).First(&existing).Error
	if err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Email sudah digunakan oleh akun lain"})
		return
	}
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memeriksa akun"})
		return
	}

	// Google-only accounts have no usable password until an admin explicitly sets one.
	if req.Password == "" {
		req.Password = newID("google-only-")
	}
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengenkripsi kata sandi"})
		return
	}

	newUser := model.User{
		ID:        newID("usr-"),
		Name:      strings.TrimSpace(req.Name),
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

	updates := map[string]any{"updated_at": time.Now()}
	if req.Name != "" {
		updates["name"] = req.Name
	}
	if req.Email != "" {
		updates["email"] = normalizedEmail(req.Email)
	}
	if req.Role != "" {
		updates["role"] = req.Role
	}
	if req.Password != "" {
		hashed, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Kata sandi tidak valid"})
			return
		}
		updates["password"] = string(hashed)
	}

	result := config.DB.Model(&model.User{}).Where("id = ?", id).Updates(updates)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memperbarui pengguna"})
		return
	}
	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Pengguna tidak ditemukan"})
		return
	}
	if err := config.DB.First(&user, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil pengguna terbaru"})
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

	updates := map[string]any{"bio": req.Bio, "updated_at": time.Now()}
	if req.Name != "" {
		updates["name"] = req.Name
	}
	if req.Avatar != "" {
		updates["avatar"] = req.Avatar
	}
	result := config.DB.Model(&model.User{}).Where("id = ?", userID).Updates(updates)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile"})
		return
	}
	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	if err := config.DB.First(&user, "id = ?", userID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve updated profile"})
		return
	}

	c.JSON(http.StatusOK, user)
}
