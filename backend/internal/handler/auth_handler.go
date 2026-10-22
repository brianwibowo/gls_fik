package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"gls_fik/backend/internal/config"
	"gls_fik/backend/internal/middleware"
	"gls_fik/backend/internal/model"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type AuthResponse struct {
	Token string     `json:"token"`
	User  model.User `json:"user"`
}

// Login menangani POST /api/auth/login
func Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format email atau password tidak valid"})
		return
	}

	var user model.User
	if err := config.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Email atau kata sandi salah"})
		return
	}

	// Verifikasi hash password dengan bcrypt
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Email atau kata sandi salah"})
		return
	}

	// Generate JWT Token
	token, err := middleware.GenerateToken(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membuat token autentikasi"})
		return
	}

	c.JSON(http.StatusOK, AuthResponse{
		Token: token,
		User:  user,
	})
}

// Me menangani GET /api/auth/me (Protected Endpoint)
func Me(c *gin.Context) {
	userID, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Tidak terautentikasi"})
		return
	}

	var user model.User
	if err := config.DB.First(&user, "id = ?", userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Pengguna tidak ditemukan"})
		return
	}

	c.JSON(http.StatusOK, user)
}

type GoogleLoginRequest struct {
	Credential string `json:"credential" binding:"required"`
}

type GoogleTokenInfo struct {
	Sub           string `json:"sub"`
	Aud           string `json:"aud"`
	Azp           string `json:"azp"`
	Email         string `json:"email"`
	EmailVerified any    `json:"email_verified"`
	Name          string `json:"name"`
	Picture       string `json:"picture"`
	GivenName     string `json:"given_name"`
	FamilyName    string `json:"family_name"`
	Error         string `json:"error"`
	ErrorDesc     string `json:"error_description"`
}

// GoogleLogin menangani autentikasi via Google OAuth (ID Token / Credential)
func GoogleLogin(c *gin.Context) {
	var req GoogleLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Credential token Google diperlukan"})
		return
	}

	// Verifikasi token ke endpoint tokeninfo resmi Google
	tokenURL := "https://oauth2.googleapis.com/tokeninfo?id_token=" + url.QueryEscape(req.Credential)
	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Get(tokenURL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menghubungi server verifikasi Google"})
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Token Google tidak valid atau telah kedaluwarsa"})
		return
	}

	var tokenInfo GoogleTokenInfo
	if err := json.NewDecoder(resp.Body).Decode(&tokenInfo); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membaca respons verifikasi Google"})
		return
	}

	if tokenInfo.Email == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Token Google tidak menyertakan email"})
		return
	}

	// Cek apakah email termasuk dalam daftar admin default (dari ENV ADMIN_EMAILS)
	adminEmailsEnv := os.Getenv("ADMIN_EMAILS")
	if adminEmailsEnv == "" {
		adminEmailsEnv = "admin@gls.id,admin@gymnasticcomplevel.com"
	}
	isAdminEmail := false
	for _, adminEmail := range strings.Split(adminEmailsEnv, ",") {
		if strings.EqualFold(strings.TrimSpace(adminEmail), strings.TrimSpace(tokenInfo.Email)) {
			isAdminEmail = true
			break
		}
	}

	var user model.User
	err = config.DB.Where("email = ?", tokenInfo.Email).First(&user).Error
	if err != nil {
		// Pengguna baru -> Otomatis daftarkan akun ke database
		role := "user"
		if isAdminEmail {
			role = "admin"
		}

		userName := tokenInfo.Name
		if userName == "" {
			userName = strings.Split(tokenInfo.Email, "@")[0]
		}

		user = model.User{
			ID:        fmt.Sprintf("usr-%d", time.Now().UnixNano()),
			Name:      userName,
			Email:     tokenInfo.Email,
			Password:  "oauth_google_verified",
			Role:      role,
			Avatar:    tokenInfo.Picture,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		}

		if err := config.DB.Create(&user).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan akun baru ke database"})
			return
		}
	} else {
		// Pengguna lama -> Update avatar, nama, atau promosi admin jika terdaftar di ADMIN_EMAILS
		updates := map[string]interface{}{
			"updated_at": time.Now(),
		}
		if tokenInfo.Picture != "" && user.Avatar != tokenInfo.Picture {
			updates["avatar"] = tokenInfo.Picture
			user.Avatar = tokenInfo.Picture
		}
		if tokenInfo.Name != "" && user.Name != tokenInfo.Name {
			updates["name"] = tokenInfo.Name
			user.Name = tokenInfo.Name
		}
		if isAdminEmail && user.Role != "admin" {
			updates["role"] = "admin"
			user.Role = "admin"
		}
		config.DB.Model(&user).Updates(updates)
	}

	// Terbitkan JWT Token sistem GLS FIK
	token, err := middleware.GenerateToken(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menerbitkan token autentikasi"})
		return
	}

	c.JSON(http.StatusOK, AuthResponse{
		Token: token,
		User:  user,
	})
}
