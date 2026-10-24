package handler

import (
	"bytes"
	"encoding/json"
	"fmt"
	"image"
	"image/png"
	"io"
	"net/http"
	"net/http/httptest"
	"net/url"
	"os"
	"strings"
	"sync"
	"testing"
	"time"

	"gls_fik/backend/internal/config"
	"gls_fik/backend/internal/middleware"
	"gls_fik/backend/internal/model"
	"gls_fik/backend/internal/seed"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func integrationDB(t *testing.T) *gorm.DB {
	t.Helper()
	dsn := os.Getenv("TEST_DATABASE_URL")
	if dsn == "" {
		t.Skip("set TEST_DATABASE_URL to run PostgreSQL integration tests")
	}
	base, err := gorm.Open(postgres.Open(dsn), &gorm.Config{Logger: logger.Default.LogMode(logger.Silent)})
	if err != nil {
		t.Fatal(err)
	}
	schema := "gcl_test_" + fmt.Sprint(time.Now().UnixNano())
	if err := base.Exec("CREATE SCHEMA " + schema).Error; err != nil {
		t.Fatal(err)
	}
	u, err := url.Parse(dsn)
	if err != nil {
		t.Fatal(err)
	}
	q := u.Query()
	q.Set("search_path", schema)
	u.RawQuery = q.Encode()
	db, err := gorm.Open(postgres.Open(u.String()), &gorm.Config{Logger: logger.Default.LogMode(logger.Silent)})
	if err != nil {
		t.Fatal(err)
	}
	config.DB = db
	t.Cleanup(func() {
		base.Exec("DROP SCHEMA " + schema + " CASCADE")
		sqlDB, _ := db.DB()
		sqlDB.Close()
		baseSQL, _ := base.DB()
		baseSQL.Close()
		config.DB = nil
	})
	config.MigrateDatabase(db)
	t.Setenv("JWT_SECRET", "gcl-test-only-secret")
	t.Setenv("GOOGLE_CLIENT_ID", "gcl-test-client")
	t.Setenv("ADMIN_EMAILS", "bootstrap@example.com")
	return db
}

func testRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.POST("/api/auth/google", GoogleLogin)
	r.POST("/api/auth/login", Login)
	r.GET("/api/categories", GetCategories)
	r.GET("/api/categories/:id/cover", GetCategoryCover)
	r.GET("/api/videos", middleware.OptionalAuth(), GetVideos)
	r.GET("/api/videos/:id", middleware.OptionalAuth(), GetVideoByID)
	r.GET("/api/videos/:id/playback", middleware.OptionalAuth(), GetVideoPlayback)
	r.GET("/api/videos/:id/thumbnail", GetVideoThumbnail)
	auth := r.Group("/api", middleware.AuthMiddleware())
	auth.PUT("/auth/profile", UpdateMyProfile)
	auth.GET("/videos/:id/tracker", GetPersonalVideoTracker)
	auth.PUT("/videos/:id/tracker/items/:itemId", UpdatePersonalVideoItem)
	auth.PUT("/videos/:id/tracker/note", UpdatePersonalVideoNote)
	auth.GET("/tracker", GetAthleteTechniqueTracker)
	auth.POST("/tracker/toggle", ToggleAthleteProgress)
	admin := auth.Group("", middleware.AdminOnly())
	admin.POST("/categories", CreateCategory)
	admin.PUT("/categories/:id", UpdateCategory)
	admin.DELETE("/categories/:id", DeleteCategory)
	admin.GET("/users", GetUsers)
	admin.POST("/users", CreateUser)
	admin.PUT("/users/:id", UpdateUser)
	admin.POST("/videos", CreateVideo)
	admin.PUT("/videos/:id", UpdateVideo)
	admin.DELETE("/videos/:id", DeleteVideo)
	return r
}

func request(t *testing.T, r http.Handler, method, path, token string, body any) *httptest.ResponseRecorder {
	t.Helper()
	var b io.Reader
	if body != nil {
		data, err := json.Marshal(body)
		if err != nil {
			t.Fatal(err)
		}
		b = bytes.NewReader(data)
	}
	req := httptest.NewRequest(method, path, b)
	req.Header.Set("Content-Type", "application/json")
	if token != "" {
		req.Header.Set("Authorization", "Bearer "+token)
	}
	response := httptest.NewRecorder()
	r.ServeHTTP(response, req)
	return response
}

func assertStatus(t *testing.T, res *httptest.ResponseRecorder, want int) {
	t.Helper()
	if res.Code != want {
		t.Fatalf("HTTP %d, want %d: %s", res.Code, want, res.Body.String())
	}
}

func decode[T any](t *testing.T, res *httptest.ResponseRecorder) T {
	t.Helper()
	var result T
	if err := json.Unmarshal(res.Body.Bytes(), &result); err != nil {
		t.Fatal(err)
	}
	return result
}

func account(t *testing.T, db *gorm.DB, id, role string) (model.User, string) {
	t.Helper()
	user := model.User{ID: id, Name: id, Email: id + "@example.com", Role: role}
	if err := db.Create(&user).Error; err != nil {
		t.Fatal(err)
	}
	token, err := middleware.GenerateToken(user)
	if err != nil {
		t.Fatal(err)
	}
	return user, token
}

func content(t *testing.T, db *gorm.DB) {
	t.Helper()
	category := model.Category{ID: "cat-test", Name: "Meja Lompat"}
	if err := db.Create(&category).Error; err != nil {
		t.Fatal(err)
	}
	for _, id := range []string{"locked", "free", "other"} {
		video := model.Video{ID: id, CategoryID: category.ID, Title: id, Level: "Level 1", DriveFileID: "private-drive-" + id, DriveLink: "https://drive.google.com/file/d/private-drive-" + id + "/view", IsFree: id == "free", ChecklistInitialized: true,
			ChecklistItems: []model.VideoChecklistItem{{ID: "start", Name: "Posisi awal", Order: 1}, {ID: "finish", Name: "Pendaratan", Order: 2}}}
		if err := db.Create(&video).Error; err != nil {
			t.Fatal(err)
		}
	}
}

type roundTripper func(*http.Request) (*http.Response, error)

func (f roundTripper) RoundTrip(r *http.Request) (*http.Response, error) { return f(r) }
func mockGoogle(t *testing.T, body string, status int) {
	t.Helper()
	previous := googleHTTPClient
	googleHTTPClient = &http.Client{Transport: roundTripper(func(r *http.Request) (*http.Response, error) {
		return &http.Response{StatusCode: status, Header: make(http.Header), Body: io.NopCloser(strings.NewReader(body))}, nil
	})}
	t.Cleanup(func() { googleHTTPClient = previous })
}

func TestGoogleLoginRegistersOnceAndPreservesAssignedRole(t *testing.T) {
	db := integrationDB(t)
	r := testRouter()
	mockGoogle(t, `{"sub":"google-id","aud":"gcl-test-client","email":" New@Example.com ","email_verified":"true","name":"Peserta"}`, 200)
	res := request(t, r, "POST", "/api/auth/google", "", gin.H{"credential": "verified"})
	assertStatus(t, res, 200)
	session := decode[AuthResponse](t, res)
	if session.User.Role != "user" || session.User.Email != "new@example.com" {
		t.Fatalf("wrong account: %+v", session.User)
	}
	_, adminToken := account(t, db, "admin", "admin")
	users := request(t, r, "GET", "/api/users", adminToken, nil)
	assertStatus(t, users, 200)
	if !strings.Contains(users.Body.String(), session.User.ID) {
		t.Fatal("new login absent from admin management")
	}
	promote := request(t, r, "PUT", "/api/users/"+session.User.ID, adminToken, gin.H{"role": "admin"})
	assertStatus(t, promote, 200)
	assertStatus(t, request(t, r, "GET", "/api/users", session.Token, nil), 200)
	var wg sync.WaitGroup
	results := make(chan int, 8)
	for i := 0; i < 8; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			body := strings.NewReader(`{"credential":"verified"}`)
			req := httptest.NewRequest("POST", "/api/auth/google", body)
			req.Header.Set("Content-Type", "application/json")
			res := httptest.NewRecorder()
			r.ServeHTTP(res, req)
			results <- res.Code
		}()
	}
	wg.Wait()
	close(results)
	for status := range results {
		if status != 200 {
			t.Fatalf("concurrent login HTTP %d", status)
		}
	}
	var count int64
	db.Model(&model.User{}).Where("email = ?", "new@example.com").Count(&count)
	if count != 1 {
		t.Fatalf("created %d accounts", count)
	}
	var saved model.User
	db.First(&saved, "id = ?", session.User.ID)
	if saved.Role != "admin" {
		t.Fatal("repeat login overwrote promotion")
	}
	assertStatus(t, request(t, r, "PUT", "/api/users/"+session.User.ID, adminToken, gin.H{"role": "user"}), 200)
	assertStatus(t, request(t, r, "GET", "/api/users", session.Token, nil), 403)
	db.Delete(&saved)
	assertStatus(t, request(t, r, "GET", "/api/videos/locked/tracker", session.Token, nil), 401)
}

func TestGoogleRejectsWrongAudienceUnverifiedEmailAndDatabaseFailure(t *testing.T) {
	db := integrationDB(t)
	r := testRouter()
	for _, body := range []string{
		`{"sub":"id","aud":"attacker-client","email":"a@example.com","email_verified":true}`,
		`{"sub":"id","aud":"gcl-test-client","email":"a@example.com","email_verified":false}`,
		`{"aud":"gcl-test-client","email":"a@example.com","email_verified":true}`,
	} {
		mockGoogle(t, body, 200)
		assertStatus(t, request(t, r, "POST", "/api/auth/google", "", gin.H{"credential": "x"}), 401)
	}
	var count int64
	db.Model(&model.User{}).Count(&count)
	if count != 0 {
		t.Fatal("invalid Google identity persisted")
	}
	mockGoogle(t, `{"sub":"id","aud":"gcl-test-client","email":"a@example.com","email_verified":true}`, 200)
	if err := db.Exec("DROP TABLE users").Error; err != nil {
		t.Fatal(err)
	}
	assertStatus(t, request(t, r, "POST", "/api/auth/google", "", gin.H{"credential": "x"}), 500)
}

func TestBootstrapAdminIsOnlyAssignedOnCreation(t *testing.T) {
	db := integrationDB(t)
	r := testRouter()
	mockGoogle(t, `{"sub":"id","aud":"gcl-test-client","email":"BOOTSTRAP@example.com","email_verified":true}`, 200)
	res := request(t, r, "POST", "/api/auth/google", "", gin.H{"credential": "x"})
	assertStatus(t, res, 200)
	session := decode[AuthResponse](t, res)
	if session.User.Role != "admin" {
		t.Fatal("bootstrap admin not created")
	}
	db.Model(&model.User{}).Where("id = ?", session.User.ID).Update("role", "user")
	res = request(t, r, "POST", "/api/auth/google", "", gin.H{"credential": "x"})
	assertStatus(t, res, 200)
	if decode[AuthResponse](t, res).User.Role != "user" {
		t.Fatal("login undid explicit demotion")
	}
}

func TestPlaybackAndMetadataAccess(t *testing.T) {
	db := integrationDB(t)
	content(t, db)
	_, userToken := account(t, db, "alice", "user")
	_, adminToken := account(t, db, "admin", "admin")
	r := testRouter()
	for _, token := range []string{"", userToken} {
		res := request(t, r, "GET", "/api/videos/locked", token, nil)
		assertStatus(t, res, 200)
		video := decode[model.Video](t, res)
		if video.DriveFileID != "" || video.DriveLink != "" || strings.Contains(video.Thumbnail, "private-drive") {
			t.Fatal("private source leaked")
		}
		thumbnailURL, err := url.Parse(video.Thumbnail)
		if err != nil || thumbnailURL.Path != "/api/videos/locked/thumbnail" || thumbnailURL.Query().Get("v") == "" {
			t.Fatalf("missing video thumbnail proxy: %s", video.Thumbnail)
		}
	}
	res := request(t, r, "GET", "/api/videos/locked", adminToken, nil)
	assertStatus(t, res, 200)
	if decode[model.Video](t, res).DriveFileID == "" {
		t.Fatal("admin cannot edit source")
	}
	assertStatus(t, request(t, r, "GET", "/api/videos/locked/playback", "", nil), 401)
	assertStatus(t, request(t, r, "GET", "/api/videos/locked/playback", userToken, nil), 200)
	assertStatus(t, request(t, r, "GET", "/api/videos/free/playback", "", nil), 200)
	assertStatus(t, request(t, r, "GET", "/api/videos/locked/tracker", "", nil), 401)
	bad := jwt.NewWithClaims(jwt.SigningMethodHS512, &middleware.Claims{UserID: "admin", Role: "admin", RegisteredClaims: jwt.RegisteredClaims{Issuer: "gls-fik-backend", ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour))}})
	badToken, _ := bad.SignedString([]byte("gcl-test-only-secret"))
	assertStatus(t, request(t, r, "GET", "/api/users", badToken, nil), 401)
}

func TestPersonalTrackerPersistsAndSeparatesUsersAndVideos(t *testing.T) {
	db := integrationDB(t)
	content(t, db)
	_, alice := account(t, db, "alice", "user")
	_, bob := account(t, db, "bob", "user")
	r := testRouter()
	res := request(t, r, "PUT", "/api/videos/locked/tracker/items/start", alice, gin.H{"status": "understood", "note": "Sudah paham", "userId": "bob"})
	assertStatus(t, res, 200)
	assertStatus(t, request(t, r, "PUT", "/api/videos/locked/tracker/note", alice, gin.H{"note": "Ulangi pendaratan"}), 200)
	res = request(t, r, "GET", "/api/videos/locked/tracker", alice, nil)
	assertStatus(t, res, 200)
	tracker := decode[PersonalTrackerResponse](t, res)
	if tracker.UnderstoodCount != 1 || tracker.PendingCount != 1 || tracker.Percentage != 50 || tracker.PersonalNote != "Ulangi pendaratan" || tracker.Items[0].Note != "Sudah paham" {
		t.Fatalf("progress did not persist: %+v", tracker)
	}
	for _, target := range []struct{ token, path string }{{bob, "/api/videos/locked/tracker"}, {alice, "/api/videos/other/tracker"}} {
		res = request(t, r, "GET", target.path, target.token, nil)
		assertStatus(t, res, 200)
		if progress := decode[PersonalTrackerResponse](t, res); progress.UnderstoodCount != 0 || progress.PersonalNote != "" {
			t.Fatal("progress leaked across account/video")
		}
	}
	assertStatus(t, request(t, r, "PUT", "/api/videos/locked/tracker/items/start", alice, gin.H{"status": "mastered"}), 400)
	assertStatus(t, request(t, r, "PUT", "/api/videos/locked/tracker/items/missing", alice, gin.H{"status": "review"}), 404)
	assertStatus(t, request(t, r, "PUT", "/api/videos/locked/tracker/note", alice, gin.H{"note": strings.Repeat("a", 2001)}), 400)
	assertStatus(t, request(t, r, "GET", "/api/tracker?athleteId=bob", alice, nil), 403)
	assertStatus(t, request(t, r, "POST", "/api/tracker/toggle", alice, gin.H{"athleteId": "bob", "techniqueId": "start"}), 403)
	assertStatus(t, request(t, r, "PUT", "/api/videos/locked/tracker/items/start", alice, gin.H{"status": "pending", "note": ""}), 200)
	assertStatus(t, request(t, r, "PUT", "/api/videos/locked/tracker/note", alice, gin.H{"note": ""}), 200)
	res = request(t, r, "GET", "/api/videos/locked/tracker", alice, nil)
	if progress := decode[PersonalTrackerResponse](t, res); progress.PendingCount != 2 || progress.PersonalNote != "" || progress.Items[0].Note != "" {
		t.Fatal("cleared progress did not persist")
	}
}

func TestAdminChecklistEditsKeepStableProgressAndValidate(t *testing.T) {
	db := integrationDB(t)
	content(t, db)
	_, alice := account(t, db, "alice", "user")
	_, admin := account(t, db, "admin", "admin")
	r := testRouter()
	assertStatus(t, request(t, r, "PUT", "/api/videos/locked/tracker/items/start", alice, gin.H{"status": "understood", "note": "saved"}), 200)
	body := gin.H{"categoryId": "cat-test", "title": "Diubah admin", "description": "Deskripsi nyata", "thumbnail": "https://example.com/still.jpg", "isFree": false, "driveFileId": "new-source", "level": "Level 1", "checklistItems": []gin.H{{"id": "finish", "name": "Selesai"}, {"id": "start", "name": "Awal baru"}, {"id": "", "name": "Gerakan tambahan"}}}
	assertStatus(t, request(t, r, "PUT", "/api/videos/locked", alice, body), 403)
	res := request(t, r, "PUT", "/api/videos/locked", admin, body)
	assertStatus(t, res, 200)
	video := decode[model.Video](t, res)
	if len(video.ChecklistItems) != 3 || video.ChecklistItems[2].ID == "" {
		t.Fatal("new item needs stable ID")
	}
	res = request(t, r, "GET", "/api/videos/locked/tracker", alice, nil)
	tracker := decode[PersonalTrackerResponse](t, res)
	if tracker.Items[1].ID != "start" || tracker.Items[1].Status != "understood" || tracker.Items[1].Name != "Awal baru" {
		t.Fatal("rename/reorder lost personal progress")
	}
	body["checklistItems"] = []gin.H{{"id": "finish", "name": "Selesai"}}
	assertStatus(t, request(t, r, "PUT", "/api/videos/locked", admin, body), 200)
	var stale int64
	db.Model(&model.PersonalVideoProgress{}).Where("video_id = ?", "locked").Count(&stale)
	if stale != 0 {
		t.Fatal("removed checklist progress retained")
	}
	body["checklistItems"] = []gin.H{{"id": "duplicate", "name": "a"}, {"id": "duplicate", "name": "b"}}
	assertStatus(t, request(t, r, "PUT", "/api/videos/locked", admin, body), 400)
}

func TestSeedDoesNotOverwriteAdminMetadataOrChecklist(t *testing.T) {
	db := integrationDB(t)
	seed.SeedData(db)
	var freshChecklist []model.VideoChecklistItem
	if err := db.Where("video_id = ?", "vid-vt-1").Order("video_checklist_items.order ASC").Find(&freshChecklist).Error; err != nil {
		t.Fatal(err)
	}
	if len(freshChecklist) != 7 || freshChecklist[5].ID != "tech-vt-1-7" || freshChecklist[6].ID != "tech-vt-1-6" {
		t.Fatal("fresh Level 1 vault checklist order mismatches video description")
	}
	custom := model.Video{ID: "existing-dasar", CategoryID: "cat-vt", Title: "Materi lama", Level: "Dasar"}
	if err := db.Create(&custom).Error; err != nil {
		t.Fatal(err)
	}
	db.Model(&model.Video{}).Where("id = ?", "vid-vt-1").Updates(map[string]any{"title": "Judul admin", "description": "Deskripsi admin", "thumbnail": "https://example.com/frame.jpg"})
	db.Model(&model.VideoChecklistItem{}).Where("video_id = ? AND id = ?", "vid-vt-1", "tech-vt-1-1").Update("name", "Checklist admin")
	seed.SeedData(db)
	var customChecklist []model.VideoChecklistItem
	if err := db.Where("video_id = ?", custom.ID).Find(&customChecklist).Error; err != nil {
		t.Fatal(err)
	}
	if len(customChecklist) != 7 {
		t.Fatal("existing Indonesian level alias did not initialize curriculum")
	}
	var video model.Video
	db.Preload("ChecklistItems").First(&video, "id = ?", "vid-vt-1")
	if video.Title != "Judul admin" || video.Description != "Deskripsi admin" || video.Thumbnail != "https://example.com/frame.jpg" {
		t.Fatal("startup overwrote admin video edits")
	}
	found := false
	for _, item := range video.ChecklistItems {
		if item.ID == "tech-vt-1-1" {
			found = true
			if item.Name != "Checklist admin" {
				t.Fatal("startup overwrote checklist")
			}
		}
	}
	if !found {
		t.Fatal("curriculum was not seeded per video")
	}
	var users int64
	db.Model(&model.User{}).Count(&users)
	if users != 0 {
		t.Fatal("startup created demo accounts")
	}
}

func TestAutomaticThumbnailVersionChangesWithVideoUpdate(t *testing.T) {
	db := integrationDB(t)
	content(t, db)
	r := testRouter()
	before := request(t, r, "GET", "/api/videos/locked", "", nil)
	assertStatus(t, before, 200)
	oldURL := decode[model.Video](t, before).Thumbnail
	updatedAt := time.Unix(1700000000, 123456000).UTC()
	if err := db.Model(&model.Video{}).Where("id = ?", "locked").Updates(map[string]any{"drive_file_id": "replacement-drive", "updated_at": updatedAt}).Error; err != nil {
		t.Fatal(err)
	}
	after := request(t, r, "GET", "/api/videos/locked", "", nil)
	assertStatus(t, after, 200)
	newURL := decode[model.Video](t, after).Thumbnail
	parsed, err := url.Parse(newURL)
	if err != nil {
		t.Fatal(err)
	}
	if newURL == oldURL || parsed.Query().Get("v") != fmt.Sprint(updatedAt.UnixNano()) {
		t.Fatal("thumbnail version did not change with video source update")
	}
}

func TestCurriculumLevelAliases(t *testing.T) {
	for level, aliases := range map[int][]string{1: {"Level 1", "Foundation", "Dasar"}, 2: {"Level 2", "Intermediate", "Menengah"}, 3: {"Level 3", "Advanced", "Mahir"}} {
		for _, alias := range aliases {
			if actual := curriculumLevel(alias); actual != level {
				t.Errorf("%s = %d, want %d", alias, actual, level)
			}
		}
	}
}

func TestThumbnailUsesMatchingVideoWithoutExposingDriveSource(t *testing.T) {
	db := integrationDB(t)
	content(t, db)
	r := testRouter()
	var encoded bytes.Buffer
	if err := png.Encode(&encoded, image.NewRGBA(image.Rect(0, 0, 1, 1))); err != nil {
		t.Fatal(err)
	}
	previous := googleHTTPClient
	googleHTTPClient = &http.Client{Transport: roundTripper(func(req *http.Request) (*http.Response, error) {
		if req.URL.Query().Get("id") != "private-drive-locked" {
			t.Errorf("thumbnail belongs to wrong video: %s", req.URL.Path)
		}
		return &http.Response{StatusCode: 200, Header: http.Header{"Location": []string{"https://drive.google.com/private-drive-locked"}}, Body: io.NopCloser(bytes.NewReader(encoded.Bytes()))}, nil
	})}
	t.Cleanup(func() { googleHTTPClient = previous })
	res := request(t, r, "GET", "/api/videos/locked/thumbnail", "", nil)
	assertStatus(t, res, 200)
	if !bytes.Equal(res.Body.Bytes(), encoded.Bytes()) || res.Header().Get("Content-Type") != "image/png" || res.Header().Get("Location") != "" {
		t.Fatal("thumbnail proxy returned incorrect image or exposed source header")
	}
}

func TestAdminCreatedGoogleAccountHasNoSharedPassword(t *testing.T) {
	db := integrationDB(t)
	_, admin := account(t, db, "admin", "admin")
	r := testRouter()
	res := request(t, r, "POST", "/api/users", admin, gin.H{"name": "New participant", "email": "New@Example.com", "role": "user"})
	assertStatus(t, res, 201)
	user := decode[model.User](t, res)
	var stored model.User
	if err := db.First(&stored, "id = ?", user.ID).Error; err != nil {
		t.Fatal(err)
	}
	if stored.Email != "new@example.com" || stored.Password == "" || strings.Contains(res.Body.String(), "password") {
		t.Fatal("incorrect Google-only account")
	}
	assertStatus(t, request(t, r, "POST", "/api/users", admin, gin.H{"name": "Bad role", "email": "other@example.com", "role": "coach"}), 400)
}

func TestLegacySeedPasswordsAreRejectedWhileGoogleAndChangedPasswordsWork(t *testing.T) {
	db := integrationDB(t)
	r := testRouter()
	fixtures := []struct{ id, email, role, password string }{
		{"admin-gcl", "admin@gymnasticcomplevel.com", "admin", "admin123"},
		{"coach-david", "coach@gymnasticcomplevel.com", "coach", "coach123"},
		{"athlete-marcus", "athlete@gymnasticcomplevel.com", "athlete", "athlete123"},
		{"athlete-liam", "athlete2@gymnasticcomplevel.com", "athlete", "athlete123"},
	}
	for _, fixture := range fixtures {
		hash, err := bcrypt.GenerateFromPassword([]byte(fixture.password), bcrypt.MinCost)
		if err != nil {
			t.Fatal(err)
		}
		user := model.User{ID: fixture.id, Name: fixture.id, Email: fixture.email, Role: fixture.role, Password: string(hash)}
		if err := db.Create(&user).Error; err != nil {
			t.Fatal(err)
		}
		res := request(t, r, "POST", "/api/auth/login", "", gin.H{"email": fixture.email, "password": fixture.password})
		assertStatus(t, res, 401)
		if decode[map[string]string](t, res)["error"] != "Email atau kata sandi salah" {
			t.Fatal("legacy rejection exposes account details")
		}
	}
	mockGoogle(t, `{"sub":"verified-admin","aud":"gcl-test-client","email":"admin@gymnasticcomplevel.com","email_verified":true}`, 200)
	res := request(t, r, "POST", "/api/auth/google", "", gin.H{"credential": "verified"})
	assertStatus(t, res, 200)
	session := decode[AuthResponse](t, res)
	if session.User.ID != "admin-gcl" || session.User.Role != "admin" {
		t.Fatal("verified Google access to existing admin was changed")
	}
	assertStatus(t, request(t, r, "PUT", "/api/users/admin-gcl", session.Token, gin.H{"password": "ExplicitAdminChangedPassword2026"}), 200)
	assertStatus(t, request(t, r, "POST", "/api/auth/login", "", gin.H{"email": "admin@gymnasticcomplevel.com", "password": "ExplicitAdminChangedPassword2026"}), 200)
	var count int64
	db.Model(&model.User{}).Count(&count)
	if count != 4 {
		t.Fatal("legacy guard changed or removed account rows")
	}
}

func TestProfileUpdateCannotRestoreConcurrentAdminDemotion(t *testing.T) {
	db := integrationDB(t)
	user, token := account(t, db, "profile-admin", "admin")
	r := testRouter()
	triggered := false
	callback := "test:demotion_before_profile_update"
	if err := db.Callback().Update().Before("gorm:update").Register(callback, func(tx *gorm.DB) {
		if triggered || tx.Statement.Table != "users" {
			return
		}
		triggered = true
		if err := db.Model(&model.User{}).Where("id = ?", user.ID).Update("role", "user").Error; err != nil {
			t.Error(err)
		}
	}); err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { db.Callback().Update().Remove(callback) })
	res := request(t, r, "PUT", "/api/auth/profile", token, gin.H{"name": "Updated profile", "bio": "Personal note", "role": "admin", "email": "injected@example.com", "password": "injected-password"})
	assertStatus(t, res, 200)
	current := decode[model.User](t, res)
	if !triggered || current.Role != "user" || current.Email != user.Email || current.Name != "Updated profile" {
		t.Fatal("profile restored stale role or accepted protected fields")
	}
	var stored model.User
	if err := db.First(&stored, "id = ?", user.ID).Error; err != nil {
		t.Fatal(err)
	}
	if stored.Role != "user" || stored.Password != "" {
		t.Fatal("profile persisted protected fields")
	}
	assertStatus(t, request(t, r, "GET", "/api/users", token, nil), 403)
}

func TestAdminRoleUpdatePreservesConcurrentPersonalProfileChanges(t *testing.T) {
	db := integrationDB(t)
	_, admin := account(t, db, "assigning-admin", "admin")
	user, _ := account(t, db, "target-user", "user")
	r := testRouter()
	triggered := false
	callback := "test:profile_before_role_update"
	if err := db.Callback().Update().Before("gorm:update").Register(callback, func(tx *gorm.DB) {
		if triggered || tx.Statement.Table != "users" {
			return
		}
		triggered = true
		if err := db.Model(&model.User{}).Where("id = ?", user.ID).Updates(map[string]any{"name": "Concurrent name", "bio": "Concurrent bio", "avatar": "https://example.com/current.jpg"}).Error; err != nil {
			t.Error(err)
		}
	}); err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { db.Callback().Update().Remove(callback) })
	res := request(t, r, "PUT", "/api/users/"+user.ID, admin, gin.H{"role": "admin"})
	assertStatus(t, res, 200)
	current := decode[model.User](t, res)
	if !triggered || current.Role != "admin" || current.Name != "Concurrent name" || current.Bio != "Concurrent bio" || current.Avatar != "https://example.com/current.jpg" {
		t.Fatal("role update overwrote unrelated profile changes")
	}
}
