package handler

import (
	"errors"
	"io"
	"net/http"
	"net/url"
	"os"
	"regexp"
	"strconv"
	"strings"
	"unicode/utf8"

	"gls_fik/backend/internal/config"
	"gls_fik/backend/internal/model"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

func apiOrigin(c *gin.Context) string {
	origin := strings.TrimRight(os.Getenv("PUBLIC_API_URL"), "/")
	if origin == "" {
		scheme := "http"
		if c.Request.TLS != nil || c.GetHeader("X-Forwarded-Proto") == "https" {
			scheme = "https"
		}
		origin = scheme + "://" + c.Request.Host
	}
	return origin
}

func publicVideo(c *gin.Context, video model.Video, admin bool) model.Video {
	video.Thumbnail = apiOrigin(c) + "/api/videos/" + url.PathEscape(video.ID) + "/thumbnail?v=" + strconv.FormatInt(video.UpdatedAt.UnixNano(), 10)
	if !video.IsFree && !admin {
		video.DriveFileID = ""
		video.DriveLink = ""
	}
	if video.ChecklistItems == nil {
		video.ChecklistItems = []model.VideoChecklistItem{}
	}
	return video
}

func GetVideos(c *gin.Context) {
	videos := []model.Video{}
	query := config.DB.Preload("ChecklistItems", func(db *gorm.DB) *gorm.DB { return db.Order("video_checklist_items.order ASC") }).Order("episode_num ASC, id ASC")
	if categoryID := c.Query("categoryId"); categoryID != "" {
		query = query.Where("category_id = ?", categoryID)
	}
	if err := query.Find(&videos).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil video"})
		return
	}
	for i := range videos {
		videos[i] = publicVideo(c, videos[i], c.GetString("userRole") == "admin")
	}
	c.JSON(http.StatusOK, videos)
}

func GetVideoByID(c *gin.Context) {
	var video model.Video
	if err := config.DB.Preload("ChecklistItems", func(db *gorm.DB) *gorm.DB { return db.Order("video_checklist_items.order ASC") }).First(&video, "id = ?", c.Param("id")).Error; err != nil {
		videoLookupError(c, err)
		return
	}
	c.JSON(http.StatusOK, publicVideo(c, video, c.GetString("userRole") == "admin"))
}

func GetVideoThumbnail(c *gin.Context) {
	var video model.Video
	if err := config.DB.First(&video, "id = ?", c.Param("id")).Error; err != nil {
		videoLookupError(c, err)
		return
	}
	if video.DriveFileID == "" {
		c.Status(http.StatusNotFound)
		return
	}
	request, err := http.NewRequestWithContext(c.Request.Context(), http.MethodGet, "https://drive.google.com/thumbnail?id="+url.QueryEscape(video.DriveFileID)+"&sz=w960", nil)
	if err != nil {
		c.Status(http.StatusBadGateway)
		return
	}
	response, err := googleHTTPClient.Do(request)
	if err != nil {
		c.Status(http.StatusBadGateway)
		return
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusOK {
		c.Status(http.StatusNotFound)
		return
	}
	data, err := io.ReadAll(io.LimitReader(response.Body, 10*1024*1024+1))
	if err != nil || len(data) > 10*1024*1024 {
		c.Status(http.StatusBadGateway)
		return
	}
	contentType := http.DetectContentType(data)
	if contentType != "image/jpeg" && contentType != "image/png" && contentType != "image/webp" && contentType != "image/gif" {
		c.Status(http.StatusBadGateway)
		return
	}
	c.Header("Cache-Control", "public, max-age=3600")
	c.Header("X-Content-Type-Options", "nosniff")
	c.Data(http.StatusOK, contentType, data)
}

func GetVideoPlayback(c *gin.Context) {
	var video model.Video
	if err := config.DB.First(&video, "id = ?", c.Param("id")).Error; err != nil {
		videoLookupError(c, err)
		return
	}
	if !video.IsFree && c.GetString("userId") == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Masuk untuk menonton video ini"})
		return
	}
	if video.DriveFileID == "" {
		c.JSON(http.StatusNotFound, gin.H{"error": "Video belum tersedia"})
		return
	}
	c.Header("Cache-Control", "private, no-store")
	c.JSON(http.StatusOK, gin.H{"driveFileId": video.DriveFileID, "driveLink": video.DriveLink})
}

func videoLookupError(c *gin.Context, err error) {
	if errors.Is(err, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusNotFound, gin.H{"error": "Video tidak ditemukan"})
	} else {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil video"})
	}
}

type videoRequest struct {
	ID             string                      `json:"id"`
	CategoryID     string                      `json:"categoryId"`
	Title          string                      `json:"title"`
	Description    string                      `json:"description"`
	DriveFileID    string                      `json:"driveFileId"`
	DriveLink      string                      `json:"driveLink"`
	Duration       string                      `json:"duration"`
	Level          string                      `json:"level"`
	EpisodeNum     int                         `json:"episodeNum"`
	IsFree         bool                        `json:"isFree"`
	ChecklistItems *[]model.VideoChecklistItem `json:"checklistItems"`
}

var validRecordID = regexp.MustCompile(`^[a-zA-Z0-9_-]{1,64}$`)
var validDuration = regexp.MustCompile(`^\d{1,3}:[0-5]\d(:[0-5]\d)?$`)

func (req videoRequest) validate() string {
	if strings.TrimSpace(req.Title) == "" || utf8.RuneCountInString(req.Title) > 255 {
		return "Judul wajib diisi, maksimal 255 karakter"
	}
	if req.CategoryID == "" {
		return "Kategori wajib dipilih"
	}
	if req.EpisodeNum < 0 || req.EpisodeNum > 9999 {
		return "Nomor episode harus antara 1 dan 9999"
	}
	if req.Duration != "" && !validDuration.MatchString(req.Duration) {
		return "Durasi harus berformat menit:detik atau jam:menit:detik"
	}
	if req.ID != "" && !validRecordID.MatchString(req.ID) {
		return "ID video tidak valid"
	}
	if utf8.RuneCountInString(req.Description) > 20000 {
		return "Deskripsi maksimal 20000 karakter"
	}
	if req.ChecklistItems != nil {
		if len(*req.ChecklistItems) > 100 {
			return "Checklist maksimal 100 item"
		}
		seen := map[string]bool{}
		for _, item := range *req.ChecklistItems {
			if strings.TrimSpace(item.Name) == "" || utf8.RuneCountInString(item.Name) > 500 {
				return "Nama checklist wajib diisi, maksimal 500 karakter"
			}
			if item.ID != "" && (!validRecordID.MatchString(item.ID) || seen[item.ID]) {
				return "ID checklist tidak valid atau duplikat"
			}
			if item.ID != "" {
				seen[item.ID] = true
			}
		}
	}
	return ""
}

func (req videoRequest) apply(video *model.Video) {
	video.CategoryID = req.CategoryID
	video.Title = strings.TrimSpace(req.Title)
	video.Description = req.Description
	video.DriveFileID = req.DriveFileID
	video.DriveLink = req.DriveLink
	video.Thumbnail = ""
	video.Duration = req.Duration
	video.Level = req.Level
	video.EpisodeNum = req.EpisodeNum
	if video.EpisodeNum == 0 {
		video.EpisodeNum = 1
	}
	video.IsFree = req.IsFree
}

func CreateVideo(c *gin.Context) {
	var req videoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Data video tidak valid"})
		return
	}
	if message := req.validate(); message != "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": message})
		return
	}
	video := model.Video{ID: req.ID}
	if video.ID == "" {
		video.ID = newID("vid-")
	}
	req.apply(&video)
	err := config.DB.Transaction(func(tx *gorm.DB) error {
		if err := checkCategory(tx, req.CategoryID); err != nil {
			return err
		}
		video.ChecklistInitialized = true
		if err := tx.Omit("ChecklistItems").Create(&video).Error; err != nil {
			return err
		}
		items := req.ChecklistItems
		if items == nil {
			defaults, err := curriculumChecklist(tx, video)
			if err != nil {
				return err
			}
			items = &defaults
		}
		return replaceChecklist(tx, &video, *items)
	})
	if err != nil {
		writeVideoError(c, err)
		return
	}
	c.JSON(http.StatusCreated, video)
}

var errCategoryMissing = errors.New("category not found")

func checkCategory(tx *gorm.DB, id string) error {
	var category model.Category
	err := tx.First(&category, "id = ?", id).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return errCategoryMissing
	}
	return err
}

func curriculumChecklist(tx *gorm.DB, video model.Video) ([]model.VideoChecklistItem, error) {
	level := curriculumLevel(video.Level)
	items := []model.VideoChecklistItem{}
	if level == 0 {
		return items, nil
	}
	var techniques []model.Technique
	if err := tx.Where("category_id = ? AND level = ?", video.CategoryID, level).Order("techniques.order ASC").Find(&techniques).Error; err != nil {
		return nil, err
	}
	for i, t := range techniques {
		items = append(items, model.VideoChecklistItem{VideoID: video.ID, ID: t.ID, Name: t.Name, Order: i})
	}
	return items, nil
}

func curriculumLevel(level string) int {
	switch strings.ToLower(strings.TrimSpace(level)) {
	case "level 1", "foundation", "dasar", "1":
		return 1
	case "level 2", "intermediate", "menengah", "2":
		return 2
	case "level 3", "advanced", "mahir", "3":
		return 3
	}
	return 0
}

func replaceChecklist(tx *gorm.DB, video *model.Video, items []model.VideoChecklistItem) error {
	ids := make([]string, 0, len(items))
	for i := range items {
		if items[i].ID == "" {
			items[i].ID = newID("item-")
		}
		items[i].VideoID = video.ID
		items[i].Order = i
		items[i].Name = strings.TrimSpace(items[i].Name)
		ids = append(ids, items[i].ID)
	}
	remove := tx.Where("video_id = ?", video.ID)
	progress := tx.Where("video_id = ?", video.ID)
	if len(ids) > 0 {
		remove = remove.Where("id NOT IN ?", ids)
		progress = progress.Where("item_id NOT IN ?", ids)
	}
	if err := progress.Delete(&model.PersonalVideoProgress{}).Error; err != nil {
		return err
	}
	if err := remove.Delete(&model.VideoChecklistItem{}).Error; err != nil {
		return err
	}
	if len(items) > 0 {
		if err := tx.Clauses(clause.OnConflict{Columns: []clause.Column{{Name: "video_id"}, {Name: "id"}}, DoUpdates: clause.AssignmentColumns([]string{"name", "order"})}).Create(&items).Error; err != nil {
			return err
		}
	}
	video.ChecklistItems = items
	return nil
}

func writeVideoError(c *gin.Context, err error) {
	if errors.Is(err, errCategoryMissing) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Kategori tidak ditemukan"})
		return
	}
	if errors.Is(err, gorm.ErrRecordNotFound) {
		videoLookupError(c, err)
		return
	}
	c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan video"})
}

func UpdateVideo(c *gin.Context) {
	var req videoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Data video tidak valid"})
		return
	}
	if message := req.validate(); message != "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": message})
		return
	}
	var video model.Video
	err := config.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).First(&video, "id = ?", c.Param("id")).Error; err != nil {
			return err
		}
		if err := checkCategory(tx, req.CategoryID); err != nil {
			return err
		}
		req.apply(&video)
		video.ChecklistInitialized = true
		if err := tx.Omit("ChecklistItems").Save(&video).Error; err != nil {
			return err
		}
		if req.ChecklistItems != nil {
			return replaceChecklist(tx, &video, *req.ChecklistItems)
		}
		return tx.Where("video_id = ?", video.ID).Order("video_checklist_items.order ASC").Find(&video.ChecklistItems).Error
	})
	if err != nil {
		writeVideoError(c, err)
		return
	}
	c.JSON(http.StatusOK, video)
}

func deleteVideoData(tx *gorm.DB, id string) error {
	var video model.Video
	if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).First(&video, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil
		}
		return err
	}
	if err := tx.Where("video_id = ?", id).Delete(&model.PersonalVideoProgress{}).Error; err != nil {
		return err
	}
	if err := tx.Where("video_id = ?", id).Delete(&model.PersonalVideoNote{}).Error; err != nil {
		return err
	}
	if err := tx.Where("video_id = ?", id).Delete(&model.VideoChecklistItem{}).Error; err != nil {
		return err
	}
	return tx.Delete(&model.Video{}, "id = ?", id).Error
}

func DeleteVideo(c *gin.Context) {
	err := config.DB.Transaction(func(tx *gorm.DB) error { return deleteVideoData(tx, c.Param("id")) })
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menghapus video"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Video berhasil dihapus"})
}
