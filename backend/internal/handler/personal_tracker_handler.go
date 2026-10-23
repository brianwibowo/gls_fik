package handler

import (
	"net/http"
	"unicode/utf8"

	"gls_fik/backend/internal/config"
	"gls_fik/backend/internal/model"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type PersonalTrackerItem struct {
	ID     string `json:"id"`
	Name   string `json:"name"`
	Status string `json:"status"`
	Note   string `json:"note"`
}

type PersonalTrackerResponse struct {
	VideoID         string                `json:"videoId"`
	Items           []PersonalTrackerItem `json:"items"`
	PersonalNote    string                `json:"personalNote"`
	TotalCount      int                   `json:"totalCount"`
	UnderstoodCount int                   `json:"understoodCount"`
	ReviewCount     int                   `json:"reviewCount"`
	PendingCount    int                   `json:"pendingCount"`
	Percentage      float64               `json:"percentage"`
}

func GetPersonalVideoTracker(c *gin.Context) {
	videoID, userID := c.Param("id"), c.GetString("userId")
	var video model.Video
	if err := config.DB.Preload("ChecklistItems", func(db *gorm.DB) *gorm.DB { return db.Order("video_checklist_items.order ASC") }).First(&video, "id = ?", videoID).Error; err != nil {
		videoLookupError(c, err)
		return
	}
	var progress []model.PersonalVideoProgress
	if err := config.DB.Where("user_id = ? AND video_id = ?", userID, videoID).Find(&progress).Error; err != nil {
		trackerError(c)
		return
	}
	var notes []model.PersonalVideoNote
	if err := config.DB.Where("user_id = ? AND video_id = ?", userID, videoID).Find(&notes).Error; err != nil {
		trackerError(c)
		return
	}
	byID := map[string]model.PersonalVideoProgress{}
	for _, p := range progress {
		byID[p.ItemID] = p
	}
	response := PersonalTrackerResponse{VideoID: videoID, Items: []PersonalTrackerItem{}, TotalCount: len(video.ChecklistItems)}
	if len(notes) > 0 {
		response.PersonalNote = notes[0].Note
	}
	for _, definition := range video.ChecklistItems {
		p := byID[definition.ID]
		if p.Status == "" {
			p.Status = "pending"
		}
		response.Items = append(response.Items, PersonalTrackerItem{ID: definition.ID, Name: definition.Name, Status: p.Status, Note: p.Note})
		switch p.Status {
		case "understood":
			response.UnderstoodCount++
		case "review":
			response.ReviewCount++
		default:
			response.PendingCount++
		}
	}
	if response.TotalCount > 0 {
		response.Percentage = float64(response.UnderstoodCount) * 100 / float64(response.TotalCount)
	}
	c.Header("Cache-Control", "private, no-store")
	c.JSON(http.StatusOK, response)
}

func trackerError(c *gin.Context) {
	c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan atau mengambil progres pribadi"})
}

type personalItemRequest struct {
	Status string `json:"status"`
	Note   string `json:"note"`
}

func UpdatePersonalVideoItem(c *gin.Context) {
	var req personalItemRequest
	if err := c.ShouldBindJSON(&req); err != nil || (req.Status != "pending" && req.Status != "review" && req.Status != "understood") || utf8.RuneCountInString(req.Note) > 2000 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Status harus pending, review, atau understood. Catatan maksimal 2000 karakter"})
		return
	}
	var item model.VideoChecklistItem
	var progress model.PersonalVideoProgress
	err := config.DB.Transaction(func(tx *gorm.DB) error {
		// Share the video lock with admin checklist edits so removed items cannot be recreated by a concurrent save.
		var video model.Video
		if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).First(&video, "id = ?", c.Param("id")).Error; err != nil {
			return err
		}
		if err := tx.First(&item, "video_id = ? AND id = ?", video.ID, c.Param("itemId")).Error; err != nil {
			return err
		}
		progress = model.PersonalVideoProgress{UserID: c.GetString("userId"), VideoID: video.ID, ItemID: item.ID, Status: req.Status, Note: req.Note}
		return tx.Clauses(clause.OnConflict{Columns: []clause.Column{{Name: "user_id"}, {Name: "video_id"}, {Name: "item_id"}}, DoUpdates: clause.AssignmentColumns([]string{"status", "note", "updated_at"})}).Create(&progress).Error
	})
	if err != nil {
		videoLookupError(c, err)
		return
	}
	c.JSON(http.StatusOK, PersonalTrackerItem{ID: item.ID, Name: item.Name, Status: progress.Status, Note: progress.Note})
}

func UpdatePersonalVideoNote(c *gin.Context) {
	var req struct {
		Note string `json:"note"`
	}
	if err := c.ShouldBindJSON(&req); err != nil || utf8.RuneCountInString(req.Note) > 2000 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Catatan maksimal 2000 karakter"})
		return
	}
	err := config.DB.Transaction(func(tx *gorm.DB) error {
		var video model.Video
		if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).First(&video, "id = ?", c.Param("id")).Error; err != nil {
			return err
		}
		note := model.PersonalVideoNote{UserID: c.GetString("userId"), VideoID: video.ID, Note: req.Note}
		return tx.Clauses(clause.OnConflict{Columns: []clause.Column{{Name: "user_id"}, {Name: "video_id"}}, DoUpdates: clause.AssignmentColumns([]string{"note", "updated_at"})}).Create(&note).Error
	})
	if err != nil {
		videoLookupError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"note": req.Note})
}
