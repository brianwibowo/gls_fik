package middleware

import (
	"errors"
	"net/http"
	"os"
	"strings"
	"time"

	"gls_fik/backend/internal/config"
	"gls_fik/backend/internal/model"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"gorm.io/gorm"
)

type Claims struct {
	UserID string `json:"userId"`
	Email  string `json:"email"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

func GenerateToken(user model.User) (string, error) {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return "", errors.New("JWT_SECRET belum dikonfigurasi")
	}
	claims := &Claims{UserID: user.ID, Email: user.Email, Role: user.Role, RegisteredClaims: jwt.RegisteredClaims{
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(7 * 24 * time.Hour)),
		IssuedAt:  jwt.NewNumericDate(time.Now()), Issuer: "gls-fik-backend",
	}}
	return jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte(secret))
}

func AuthMiddleware() gin.HandlerFunc { return authenticate(false) }
func OptionalAuth() gin.HandlerFunc   { return authenticate(true) }

func authenticate(optional bool) gin.HandlerFunc {
	return func(c *gin.Context) {
		header := c.GetHeader("Authorization")
		if optional && header == "" {
			c.Next()
			return
		}
		parts := strings.Fields(header)
		if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Silakan masuk untuk mengakses materi ini"})
			return
		}
		secret := os.Getenv("JWT_SECRET")
		if secret == "" || config.DB == nil {
			c.AbortWithStatusJSON(http.StatusServiceUnavailable, gin.H{"error": "Layanan autentikasi belum tersedia"})
			return
		}
		claims := &Claims{}
		token, err := jwt.ParseWithClaims(parts[1], claims, func(token *jwt.Token) (any, error) { return []byte(secret), nil },
			jwt.WithValidMethods([]string{"HS256"}), jwt.WithExpirationRequired(), jwt.WithIssuer("gls-fik-backend"))
		if err != nil || !token.Valid || claims.UserID == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Sesi berakhir. Silakan masuk kembali"})
			return
		}
		var user model.User
		if err := config.DB.First(&user, "id = ?", claims.UserID).Error; err != nil {
			status, message := http.StatusInternalServerError, "Gagal memeriksa akun"
			if errors.Is(err, gorm.ErrRecordNotFound) {
				status, message = http.StatusUnauthorized, "Akun tidak ditemukan. Silakan masuk kembali"
			}
			c.AbortWithStatusJSON(status, gin.H{"error": message})
			return
		}
		// Role changes take effect on the next request, including existing sessions.
		c.Set("userId", user.ID)
		c.Set("userEmail", user.Email)
		c.Set("userRole", user.Role)
		c.Set("role", user.Role)
		c.Next()
	}
}

func AdminOnly() gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.GetString("userRole") != "admin" {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Akses admin diperlukan"})
			return
		}
		c.Next()
	}
}

func CoachOrAdminOnly() gin.HandlerFunc {
	return func(c *gin.Context) {
		role := c.GetString("userRole")
		if role != "admin" && role != "coach" {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Akses pelatih atau admin diperlukan"})
			return
		}
		c.Next()
	}
}
