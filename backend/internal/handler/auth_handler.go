package handler

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"errors"
	"net/http"
	"net/mail"
	"net/url"
	"os"
	"strings"
	"time"

	"gls_fik/backend/internal/config"
	"gls_fik/backend/internal/middleware"
	"gls_fik/backend/internal/model"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type AuthResponse struct {
	Token string     `json:"token"`
	User  model.User `json:"user"`
}

func newID(prefix string) string {
	var random [16]byte
	if _, err := rand.Read(random[:]); err != nil {
		panic(err)
	}
	return prefix + hex.EncodeToString(random[:])
}

func normalizedEmail(email string) string { return strings.ToLower(strings.TrimSpace(email)) }

func isLegacySeedCredential(userID, password string) bool {
	// Existing installations may still contain these formerly seeded password hashes.
	switch userID {
	case "admin-gcl":
		return password == "admin123"
	case "coach-david":
		return password == "coach123"
	case "athlete-marcus", "athlete-liam":
		return password == "athlete123"
	}
	return false
}

func Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format email atau kata sandi tidak valid"})
		return
	}
	var user model.User
	err := config.DB.Where("email = ?", normalizedEmail(req.Email)).First(&user).Error
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memeriksa akun"})
		return
	}
	if err != nil || isLegacySeedCredential(user.ID, req.Password) || bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)) != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Email atau kata sandi salah"})
		return
	}
	respondWithSession(c, user)
}

func respondWithSession(c *gin.Context, user model.User) {
	token, err := middleware.GenerateToken(user)
	if err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Layanan autentikasi belum dikonfigurasi"})
		return
	}
	c.JSON(http.StatusOK, AuthResponse{Token: token, User: user})
}

func Me(c *gin.Context) {
	var user model.User
	if err := config.DB.First(&user, "id = ?", c.GetString("userId")).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil akun"})
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
	Email         string `json:"email"`
	EmailVerified any    `json:"email_verified"`
	Name          string `json:"name"`
	Picture       string `json:"picture"`
}

var googleHTTPClient = &http.Client{Timeout: 10 * time.Second}

func verifiedGoogleIdentity(info GoogleTokenInfo, clientID string) bool {
	verified := info.EmailVerified == true || info.EmailVerified == "true"
	email := normalizedEmail(info.Email)
	parsed, err := mail.ParseAddress(email)
	return clientID != "" && info.Aud == clientID && info.Sub != "" && verified && err == nil && parsed.Address == email
}

func initialGoogleRole(email string) string {
	for _, adminEmail := range strings.Split(os.Getenv("ADMIN_EMAILS"), ",") {
		if normalizedEmail(adminEmail) == email {
			return "admin"
		}
	}
	return "user"
}

func GoogleLogin(c *gin.Context) {
	var req GoogleLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Credential Google diperlukan"})
		return
	}
	clientID := strings.TrimSpace(os.Getenv("GOOGLE_CLIENT_ID"))
	if clientID == "" || os.Getenv("JWT_SECRET") == "" {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Layanan login Google belum dikonfigurasi"})
		return
	}
	request, err := http.NewRequestWithContext(c.Request.Context(), http.MethodGet, "https://oauth2.googleapis.com/tokeninfo?id_token="+url.QueryEscape(req.Credential), nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyiapkan verifikasi Google"})
		return
	}
	resp, err := googleHTTPClient.Do(request)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"error": "Gagal menghubungi verifikasi Google"})
		return
	}
	defer resp.Body.Close()
	var info GoogleTokenInfo
	if resp.StatusCode != http.StatusOK || json.NewDecoder(resp.Body).Decode(&info) != nil || !verifiedGoogleIdentity(info, clientID) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Identitas Google tidak valid atau email belum diverifikasi"})
		return
	}
	email := normalizedEmail(info.Email)
	name := strings.TrimSpace(info.Name)
	if name == "" {
		name = strings.Split(email, "@")[0]
	}
	user := model.User{ID: newID("usr-"), Name: name, Email: email, Avatar: info.Picture, Role: initialGoogleRole(email)}
	// Never overwrite a role assigned by an admin when an account signs in again.
	err = config.DB.Clauses(clause.OnConflict{Columns: []clause.Column{{Name: "email"}}, DoUpdates: clause.Assignments(map[string]any{"name": name, "avatar": info.Picture, "updated_at": time.Now()})}).Create(&user).Error
	var stored model.User
	if err == nil {
		err = config.DB.Where("email = ?", email).First(&stored).Error
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan akun. Silakan coba lagi"})
		return
	}
	respondWithSession(c, stored)
}
