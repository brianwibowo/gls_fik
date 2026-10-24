package handler

import (
	"bytes"
	"encoding/base64"
	"image"
	"image/png"
	"strings"
	"sync"
	"testing"

	"github.com/gin-gonic/gin"
	"gls_fik/backend/internal/config"
	"gls_fik/backend/internal/model"
	"gls_fik/backend/internal/seed"
)

func TestCategoryCRUDGeneratesIDsAppendsAndPreservesCover(t *testing.T) {
	db := integrationDB(t)
	_, admin := account(t, db, "admin", "admin")
	_, user := account(t, db, "user", "user")
	r := testRouter()
	db.Create(&model.Category{ID: "last", Name: "Terakhir", Order: 25})
	assertStatus(t, request(t, r, "POST", "/api/categories", user, gin.H{"name": "Forbidden"}), 403)
	assertStatus(t, request(t, r, "POST", "/api/categories", admin, gin.H{"name": " "}), 400)
	first := request(t, r, "POST", "/api/categories", admin, gin.H{"name": "Kategori tanpa sampul", "order": 1, "id": "", "thumbnail": "/images/apparatus-floor.webp"})
	assertStatus(t, first, 201)
	category := decode[model.Category](t, first)
	if category.ID == "" || category.Order != 26 || category.Thumbnail != "" {
		t.Fatalf("unexpected new category: %+v", category)
	}
	second := request(t, r, "POST", "/api/categories", admin, gin.H{"name": "Kategori berikut"})
	assertStatus(t, second, 201)
	if next := decode[model.Category](t, second); next.ID == category.ID || next.Order != 27 {
		t.Fatal("category needs unique ID and last position")
	}
	var imageBytes bytes.Buffer
	png.Encode(&imageBytes, image.NewRGBA(image.Rect(0, 0, 12, 8)))
	data := "data:image/png;base64," + base64.StdEncoding.EncodeToString(imageBytes.Bytes())
	edited := request(t, r, "PUT", "/api/categories/"+category.ID, admin, gin.H{"name": "Nama baru", "description": "Deskripsi", "coverData": data, "order": 999})
	assertStatus(t, edited, 200)
	saved := decode[model.Category](t, edited)
	if saved.ID != category.ID || saved.Order != 26 || !strings.Contains(saved.Thumbnail, "/api/categories/"+category.ID+"/cover?v=") {
		t.Fatalf("edit changed identity/order or lost cover: %+v", saved)
	}
	cover := request(t, r, "GET", "/api/categories/"+category.ID+"/cover", "", nil)
	assertStatus(t, cover, 200)
	if !bytes.Equal(cover.Body.Bytes(), imageBytes.Bytes()) || cover.Header().Get("Content-Type") != "image/png" {
		t.Fatal("cover mismatch")
	}
	assertStatus(t, request(t, r, "PUT", "/api/categories/"+category.ID, admin, gin.H{"name": "Tetap bersampul"}), 200)
	assertStatus(t, request(t, r, "GET", "/api/categories/"+category.ID+"/cover", "", nil), 200)
	assertStatus(t, request(t, r, "PUT", "/api/categories/"+category.ID, admin, gin.H{"name": "Tidak valid", "coverData": "data:image/webp;base64,PHNjcmlwdD4="}), 400)
	assertStatus(t, request(t, r, "PUT", "/api/categories/"+category.ID, admin, gin.H{"name": "Tanpa sampul", "coverData": ""}), 200)
	assertStatus(t, request(t, r, "GET", "/api/categories/"+category.ID+"/cover", "", nil), 404)
	assertStatus(t, request(t, r, "DELETE", "/api/categories/"+category.ID, admin, nil), 200)
	assertStatus(t, request(t, r, "PUT", "/api/categories/"+category.ID, admin, gin.H{"name": "Gone"}), 404)
	assertStatus(t, request(t, r, "DELETE", "/api/categories/"+category.ID, admin, nil), 404)
}

func TestConcurrentCategoriesHaveDistinctLastPositions(t *testing.T) {
	db := integrationDB(t)
	_, admin := account(t, db, "admin", "admin")
	r := testRouter()
	var wg sync.WaitGroup
	results := make(chan model.Category, 4)
	for i := 0; i < 4; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			response := request(t, r, "POST", "/api/categories", admin, gin.H{"name": "Bersamaan"})
			assertStatus(t, response, 201)
			results <- decode[model.Category](t, response)
		}()
	}
	wg.Wait()
	close(results)
	positions := map[int]bool{}
	for category := range results {
		if positions[category.Order] || category.ID == "" {
			t.Fatal("duplicate sequence or empty ID")
		}
		positions[category.Order] = true
	}
	if len(positions) != 4 {
		t.Fatal("lost category")
	}
}

func TestLegacyEmptyCategoryIDIsRepairedWithChildren(t *testing.T) {
	db := integrationDB(t)
	db.Create(&model.Category{ID: "", Name: "Kategori lama", Thumbnail: "/images/apparatus-floor.webp"})
	db.Create(&model.Category{ID: "last", Name: "Sebelum", Order: 6})
	db.Create(&model.Video{ID: "old", CategoryID: "", Title: "Video lama"})
	db.Create(&model.Technique{ID: "tech-old", CategoryID: "", Name: "Teknik lama"})
	if err := config.RepairCategoryIDs(db); err != nil {
		t.Fatal(err)
	}
	var category model.Category
	if err := db.Where("name = ?", "Kategori lama").First(&category).Error; err != nil {
		t.Fatal(err)
	}
	if category.ID == "" || category.Order != 7 || category.Thumbnail != "" {
		t.Fatalf("invalid recovery: %+v", category)
	}
	var video model.Video
	db.First(&video, "id = ?", "old")
	var technique model.Technique
	db.First(&technique, "id = ?", "tech-old")
	if video.CategoryID != category.ID || technique.CategoryID != category.ID {
		t.Fatal("recovery lost child relationship")
	}
	if err := config.RepairCategoryIDs(db); err != nil {
		t.Fatal(err)
	}
	var count int64
	db.Model(&model.Category{}).Count(&count)
	if count != 2 {
		t.Fatal("repair is not idempotent")
	}
}

func TestEpisodeCreateEditDeleteAndCategoryCascadePersistAfterStartup(t *testing.T) {
	db := integrationDB(t)
	seed.SeedData(db)
	_, admin := account(t, db, "admin", "admin")
	_, user := account(t, db, "learner", "user")
	r := testRouter()
	body := gin.H{"categoryId": "cat-vt", "title": "Episode khusus", "description": "Isi video", "driveFileId": "matching-drive-id", "driveLink": "https://drive.google.com/file/d/matching-drive-id/view", "episodeNum": 4, "level": "Level 2", "duration": "04:35", "isFree": true, "thumbnail": "https://example.com/ignored.jpg", "checklistItems": []gin.H{{"name": "Awalan"}}}
	response := request(t, r, "POST", "/api/videos", admin, body)
	assertStatus(t, response, 201)
	video := decode[model.Video](t, response)
	if video.ID == "" || video.Duration != "04:35" || !video.IsFree || video.Thumbnail != "" {
		t.Fatal("episode fields not saved")
	}
	body["duration"] = "00:99"
	assertStatus(t, request(t, r, "PUT", "/api/videos/"+video.ID, admin, body), 400)
	body["duration"] = "01:02:03"
	body["isFree"] = false
	body["level"] = "Level 3"
	body["title"] = "Diubah"
	body["episodeNum"] = 5
	body["checklistItems"] = video.ChecklistItems
	assertStatus(t, request(t, r, "PUT", "/api/videos/"+video.ID, admin, body), 200)
	reloaded := decode[model.Video](t, request(t, r, "GET", "/api/videos/"+video.ID, admin, nil))
	if reloaded.Duration != "01:02:03" || reloaded.IsFree || reloaded.EpisodeNum != 5 || reloaded.Level != "Level 3" || !strings.Contains(reloaded.Thumbnail, "/api/videos/"+video.ID+"/thumbnail") {
		t.Fatal("edit did not persist across GET")
	}
	itemID := reloaded.ChecklistItems[0].ID
	assertStatus(t, request(t, r, "PUT", "/api/videos/"+video.ID+"/tracker/items/"+itemID, user, gin.H{"status": "review", "note": "catatan"}), 200)
	assertStatus(t, request(t, r, "PUT", "/api/videos/"+video.ID+"/tracker/note", user, gin.H{"note": "catatan pribadi"}), 200)
	assertStatus(t, request(t, r, "DELETE", "/api/videos/"+video.ID, user, nil), 403)
	assertStatus(t, request(t, r, "DELETE", "/api/videos/"+video.ID, admin, nil), 200)
	assertStatus(t, request(t, r, "GET", "/api/videos/"+video.ID, admin, nil), 404)
	for _, table := range []any{&model.VideoChecklistItem{}, &model.PersonalVideoProgress{}, &model.PersonalVideoNote{}} {
		var count int64
		db.Model(table).Where("video_id = ?", video.ID).Count(&count)
		if count != 0 {
			t.Fatal("deleted episode left personal data")
		}
	}
	assertStatus(t, request(t, r, "DELETE", "/api/videos/vid-vt-1", admin, nil), 200)
	assertStatus(t, request(t, r, "DELETE", "/api/categories/cat-ph", admin, nil), 200)
	seed.SeedData(db)
	assertStatus(t, request(t, r, "GET", "/api/videos/vid-vt-1", admin, nil), 404)
	var categories int64
	db.Model(&model.Category{}).Where("id = ?", "cat-ph").Count(&categories)
	var related int64
	db.Model(&model.Video{}).Where("category_id = ?", "cat-ph").Count(&related)
	var techniques int64
	db.Model(&model.Technique{}).Where("category_id = ?", "cat-ph").Count(&techniques)
	if categories != 0 || related != 0 || techniques != 0 {
		t.Fatal("deleted category resurrected or left child rows")
	}
}

func TestExistingCurriculumIsNotRefilledOnFirstSeedMarkerMigration(t *testing.T) {
	db := integrationDB(t)
	content(t, db)
	if err := db.Where("id = ?", "free").Delete(&model.Video{}).Error; err != nil {
		t.Fatal(err)
	}
	seed.SeedData(db)
	var categories, videos, deleted, marker int64
	db.Model(&model.Category{}).Count(&categories)
	db.Model(&model.Video{}).Count(&videos)
	db.Model(&model.Video{}).Where("id = ?", "free").Count(&deleted)
	db.Model(&model.SeedState{}).Count(&marker)
	if categories != 1 || videos != 2 || deleted != 0 || marker != 1 {
		t.Fatal("existing curriculum was refilled on migration")
	}
}
