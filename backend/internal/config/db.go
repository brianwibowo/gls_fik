package config

import (
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
		&model.User{},
		&model.Category{},
		&model.Video{},
	)
	if err != nil {
		log.Fatalf("Gagal auto-migrate tabel: %v", err)
	}
	log.Println("Berhasil migrasi tabel: users, categories, videos")
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
