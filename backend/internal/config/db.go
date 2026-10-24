package config

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"log"
	"os"

	"gls_fik/backend/internal/model"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() *gorm.DB {
	// Ambil konfigurasi dari Environment Variable, atau gunakan default lokal
	host := getEnv("DB_HOST", "localhost")
	user := getEnv("DB_USER", "mymac") // ganti jika user postgres Anda berbeda
	password := getEnv("DB_PASSWORD", "")
	dbname := getEnv("DB_NAME", "gls_fik_db")
	port := getEnv("DB_PORT", "5432")

	var dsn string
	if password != "" {
		dsn = fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable&TimeZone=Asia/Jakarta", user, password, host, port, dbname)
	} else {
		dsn = fmt.Sprintf("postgres://%s@%s:%s/%s?sslmode=disable&TimeZone=Asia/Jakarta", user, host, port, dbname)
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Gagal terhubung ke database PostgreSQL: %v", err)
	}

	log.Println("Berhasil terhubung ke database PostgreSQL!")
	DB = db
	return db
}

func MigrateDatabase(db *gorm.DB) {
	err := db.AutoMigrate(
		&model.SeedState{},
		&model.User{},
		&model.Category{},
		&model.Video{},
		&model.Technique{},
		&model.AthleteProgress{},
		&model.TechniqueEvaluation{},
		&model.VideoChecklistItem{},
		&model.PersonalVideoProgress{},
		&model.PersonalVideoNote{},
	)
	if err != nil {
		log.Fatalf("Gagal auto-migrate tabel: %v", err)
	}
	if err := db.Exec("UPDATE users SET email = lower(trim(email)) WHERE email <> lower(trim(email))").Error; err != nil {
		log.Fatalf("Gagal menormalkan email pengguna: %v", err)
	}
	if err := RepairCategoryIDs(db); err != nil {
		log.Fatalf("Gagal memperbaiki ID kategori: %v", err)
	}
	log.Println("Berhasil migrasi tabel: users, categories, videos, techniques, athlete_progress, technique_evaluations")
}

// Older category creation allowed an empty primary key; copy the parent before moving its children.
func RepairCategoryIDs(db *gorm.DB) error {
	return db.Transaction(func(tx *gorm.DB) error {
		var categories []model.Category
		if err := tx.Where("id = ?", "").Find(&categories).Error; err != nil {
			return err
		}
		for _, category := range categories {
			var random [16]byte
			if _, err := rand.Read(random[:]); err != nil {
				return err
			}
			category.ID = "cat-" + hex.EncodeToString(random[:])
			var last int
			if err := tx.Model(&model.Category{}).Select("COALESCE(MAX(\"order\"), 0)").Scan(&last).Error; err != nil {
				return err
			}
			category.Order = last + 1
			if category.Thumbnail == "/images/apparatus-floor.webp" {
				category.Thumbnail = ""
			}
			if err := tx.Omit("Videos").Create(&category).Error; err != nil {
				return err
			}
			for _, table := range []any{&model.Video{}, &model.Technique{}} {
				if err := tx.Model(table).Where("category_id = ?", "").Update("category_id", category.ID).Error; err != nil {
					return err
				}
			}
			if err := tx.Where("id = ?", "").Delete(&model.Category{}).Error; err != nil {
				return err
			}
		}
		return nil
	})
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
