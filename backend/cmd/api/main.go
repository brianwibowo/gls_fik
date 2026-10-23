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
		"https://gymnasticcomplevel.com",
		"https://www.gymnasticcomplevel.com",
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
			"message":  "Gymnastics Competition Level (GCL) API is ready!",
		})
	})

	// Public Routes
	r.POST("/api/auth/login", handler.Login)
	r.POST("/api/auth/google", handler.GoogleLogin)
	r.GET("/api/categories", handler.GetCategories)
	r.GET("/api/videos", middleware.OptionalAuth(), handler.GetVideos)
	r.GET("/api/videos/:id", middleware.OptionalAuth(), handler.GetVideoByID)
	r.GET("/api/videos/:id/playback", middleware.OptionalAuth(), handler.GetVideoPlayback)
	r.GET("/api/videos/:id/thumbnail", handler.GetVideoThumbnail)
	r.GET("/api/techniques", handler.GetTechniques)
	r.GET("/api/profiles", handler.GetProfiles)

	// Protected Routes (User Login Required: athlete, coach, admin)
	authGroup := r.Group("/api", middleware.AuthMiddleware())
	{
		authGroup.GET("/auth/me", handler.Me)
		authGroup.PUT("/auth/profile", handler.UpdateMyProfile)
		authGroup.GET("/tracker", handler.GetAthleteTechniqueTracker)
		authGroup.POST("/tracker/toggle", handler.ToggleAthleteProgress)
		authGroup.GET("/videos/:id/tracker", handler.GetPersonalVideoTracker)
		authGroup.PUT("/videos/:id/tracker/items/:itemId", handler.UpdatePersonalVideoItem)
		authGroup.PUT("/videos/:id/tracker/note", handler.UpdatePersonalVideoNote)
	}

	// Coach or Admin Routes (Evaluations & feedback)
	coachGroup := r.Group("/api", middleware.AuthMiddleware(), middleware.CoachOrAdminOnly())
	{
		coachGroup.POST("/tracker/evaluations", handler.SaveTechniqueEvaluation)
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

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	r.Run(":" + port)
}
