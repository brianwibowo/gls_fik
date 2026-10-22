package handler

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"gls_fik/backend/internal/config"
	"gls_fik/backend/internal/model"

	"github.com/gin-gonic/gin"
)

// GetTechniques retrieves techniques with optional categoryId and level query parameters
func GetTechniques(c *gin.Context) {
	var techniques []model.Technique
	query := config.DB.Order("level ASC, techniques.order ASC")

	if categoryID := c.Query("categoryId"); categoryID != "" {
		query = query.Where("category_id = ?", categoryID)
	}

	if levelStr := c.Query("level"); levelStr != "" {
		if level, err := strconv.Atoi(levelStr); err == nil {
			query = query.Where("level = ?", level)
		}
	}

	if err := query.Find(&techniques).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch curriculum techniques"})
		return
	}

	c.JSON(http.StatusOK, techniques)
}

// ProgressItem represents a technique bundled with completion status and evaluation note
type ProgressItem struct {
	Technique  model.Technique            `json:"technique"`
	IsComplete bool                       `json:"isCompleted"`
	Evaluation *model.TechniqueEvaluation `json:"evaluation,omitempty"`
}

// GetAthleteTechniqueTracker returns all techniques for an apparatus & level with an athlete's progress & notes
func GetAthleteTechniqueTracker(c *gin.Context) {
	athleteID := c.Query("athleteId")
	if athleteID == "" {
		// Default to authenticated user ID from token
		if currentUserID, exists := c.Get("userId"); exists {
			athleteID = currentUserID.(string)
		}
	}

	if athleteID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "athleteId is required"})
		return
	}

	categoryID := c.Query("categoryId")
	levelStr := c.Query("level")

	var techniques []model.Technique
	tQuery := config.DB.Order("level ASC, techniques.order ASC")
	if categoryID != "" {
		tQuery = tQuery.Where("category_id = ?", categoryID)
	}
	if levelStr != "" {
		if lvl, err := strconv.Atoi(levelStr); err == nil {
			tQuery = tQuery.Where("level = ?", lvl)
		}
	}
	tQuery.Find(&techniques)

	// Fetch athlete progress records
	var progressList []model.AthleteProgress
	config.DB.Where("athlete_id = ?", athleteID).Find(&progressList)
	progressMap := make(map[string]bool)
	for _, p := range progressList {
		progressMap[p.TechniqueID] = p.IsCompleted
	}

	// Fetch athlete evaluation notes
	var evalList []model.TechniqueEvaluation
	config.DB.Where("athlete_id = ?", athleteID).Find(&evalList)
	evalMap := make(map[string]model.TechniqueEvaluation)
	for _, e := range evalList {
		evalMap[e.TechniqueID] = e
	}

	completedCount := 0
	items := make([]ProgressItem, len(techniques))
	for i, t := range techniques {
		isDone := progressMap[t.ID]
		if isDone {
			completedCount++
		}
		var evalPtr *model.TechniqueEvaluation
		if ev, exists := evalMap[t.ID]; exists {
			evalCopy := ev
			evalPtr = &evalCopy
		}

		items[i] = ProgressItem{
			Technique:  t,
			IsComplete: isDone,
			Evaluation: evalPtr,
		}
	}

	percentage := 0.0
	if len(techniques) > 0 {
		percentage = float64(completedCount) / float64(len(techniques)) * 100.0
	}

	c.JSON(http.StatusOK, gin.H{
		"athleteId":       athleteID,
		"totalTechniques": len(techniques),
		"completedCount":  completedCount,
		"percentage":      percentage,
		"items":           items,
	})
}

// ToggleProgressRequest payload
type ToggleProgressRequest struct {
	AthleteID   string `json:"athleteId"`
	TechniqueID string `json:"techniqueId" binding:"required"`
	IsCompleted bool   `json:"isCompleted"`
}

// ToggleAthleteProgress allows an athlete or coach to mark a technique completed/uncompleted
func ToggleAthleteProgress(c *gin.Context) {
	currentUserID, _ := c.Get("userId")
	currentUserRole, _ := c.Get("role")

	var req ToggleProgressRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	targetAthleteID := req.AthleteID
	if targetAthleteID == "" || currentUserRole == "athlete" {
		targetAthleteID = currentUserID.(string)
	}

	var progress model.AthleteProgress
	err := config.DB.Where("athlete_id = ? AND technique_id = ?", targetAthleteID, req.TechniqueID).First(&progress).Error

	now := time.Now()
	if err != nil {
		progress = model.AthleteProgress{
			ID:          fmt.Sprintf("prog-%d", time.Now().UnixNano()),
			AthleteID:   targetAthleteID,
			TechniqueID: req.TechniqueID,
			IsCompleted: req.IsCompleted,
			CreatedAt:   now,
			UpdatedAt:   now,
		}
		if req.IsCompleted {
			progress.CompletedAt = &now
		}
		if err := config.DB.Create(&progress).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create progress record"})
			return
		}
	} else {
		progress.IsCompleted = req.IsCompleted
		progress.UpdatedAt = now
		if req.IsCompleted {
			progress.CompletedAt = &now
		} else {
			progress.CompletedAt = nil
		}
		if err := config.DB.Save(&progress).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update progress"})
			return
		}
	}

	c.JSON(http.StatusOK, progress)
}

// SaveEvaluationRequest payload
type SaveEvaluationRequest struct {
	AthleteID   string `json:"athleteId" binding:"required"`
	TechniqueID string `json:"techniqueId" binding:"required"`
	Notes       string `json:"notes"`
	Score       string `json:"score"`
}

// SaveTechniqueEvaluation allows coaches/admins to write evaluation notes per technique for an athlete
func SaveTechniqueEvaluation(c *gin.Context) {
	coachID, _ := c.Get("userId")
	var coachUser model.User
	config.DB.First(&coachUser, "id = ?", coachID)

	var req SaveEvaluationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var evaluation model.TechniqueEvaluation
	err := config.DB.Where("athlete_id = ? AND technique_id = ?", req.AthleteID, req.TechniqueID).First(&evaluation).Error

	now := time.Now()
	if err != nil {
		evaluation = model.TechniqueEvaluation{
			ID:          fmt.Sprintf("eval-%d", time.Now().UnixNano()),
			AthleteID:   req.AthleteID,
			TechniqueID: req.TechniqueID,
			CoachID:     coachID.(string),
			CoachName:   coachUser.Name,
			Notes:       req.Notes,
			Score:       req.Score,
			CreatedAt:   now,
			UpdatedAt:   now,
		}
		if err := config.DB.Create(&evaluation).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save evaluation note"})
			return
		}
	} else {
		evaluation.CoachID = coachID.(string)
		evaluation.CoachName = coachUser.Name
		evaluation.Notes = req.Notes
		evaluation.Score = req.Score
		evaluation.UpdatedAt = now
		if err := config.DB.Save(&evaluation).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update evaluation note"})
			return
		}
	}

	c.JSON(http.StatusOK, evaluation)
}
