package main

import (
	"net/http"
	"os"
	"strings"

	"gls_fik/backend/internal/config"
	"gls_fik/backend/internal/handler"
	"gls_fik/backend/internal/middleware"
	"gls_fik/backend/internal/seed"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	db := config.ConnectDatabase()
	config.MigrateDatabase(db)
	seed.SeedData(db)
	r := gin.Default()

	corsConfig := cors.DefaultConfig()
	allowedOrigins := []string{
		"http://localhost:3000",
		"http://127.0.0.1:3000",
		"https://gls-fik-unnes.vercel.app",
	}
	if envOrigin := os.Getenv("FRONTEND_URL"); envOrigin != "" {
		for _, o := range strings.Split(envOrigin, ",") {
			trimmed := strings.TrimSpace(o)
			if trimmed != "" {
				allowedOrigins = append(allowedOrigins, trimmed)
			}
		}
	}
	corsConfig.AllowOrigins = allowedOrigins
	corsConfig.AllowCredentials = true
	corsConfig.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}
	corsConfig.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	r.Use(cors.New(corsConfig))

	// Health Check
	r.GET("/api/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":   "ok",
			"database": "PostgreSQL Connected",
			"message":  "GLS FIK Backend API is ready!",
		})
	})

	// Public Routes
	r.POST("/api/auth/login", handler.Login)
	r.GET("/api/categories", handler.GetCategories)
	r.GET("/api/videos", handler.GetVideos)
	r.GET("/api/videos/:id", handler.GetVideoByID)

	// Protected Routes (User Login Required)
	authGroup := r.Group("/api", middleware.AuthMiddleware())
	{
		authGroup.GET("/auth/me", handler.Me)
	}

	// Protected Admin Routes (Role: admin Required)
	adminGroup := r.Group("/api", middleware.AuthMiddleware(), middleware.AdminOnly())
	{
		// Categories CRUD
		adminGroup.POST("/categories", handler.CreateCategory)
		adminGroup.PUT("/categories/:id", handler.UpdateCategory)
		adminGroup.DELETE("/categories/:id", handler.DeleteCategory)

		// Videos CRUD
		adminGroup.POST("/videos", handler.CreateVideo)
		adminGroup.PUT("/videos/:id", handler.UpdateVideo)
		adminGroup.DELETE("/videos/:id", handler.DeleteVideo)

		// Users CRUD
		adminGroup.GET("/users", handler.GetUsers)
		adminGroup.POST("/users", handler.CreateUser)
		adminGroup.PUT("/users/:id", handler.UpdateUser)
		adminGroup.DELETE("/users/:id", handler.DeleteUser)
	}

	r.Run(":8080")
}
