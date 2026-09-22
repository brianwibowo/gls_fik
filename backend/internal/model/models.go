package model

import (
	"time"
)

// User merepresentasikan data akun (admin & mahasiswa/user)
type User struct {
	ID        string    `gorm:"primaryKey;type:varchar(64)" json:"id"`
	Name      string    `gorm:"type:varchar(128);not null" json:"name"`
	Email     string    `gorm:"uniqueIndex;type:varchar(128);not null" json:"email"`
	Password  string    `gorm:"type:varchar(255);not null" json:"-"` // json:"-" agar hash password tidak bocor ke frontend
	Role      string    `gorm:"type:varchar(32);default:'user'" json:"role"` // 'user' atau 'admin'
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// Category merepresentasikan 6 kategori alat senam MAG
type Category struct {
	ID          string    `gorm:"primaryKey;type:varchar(64)" json:"id"` // misal: 'cat-fx'
	Name        string    `gorm:"type:varchar(128);not null" json:"name"`
	Description string    `gorm:"type:text" json:"description"`
	Thumbnail   string    `gorm:"type:varchar(255)" json:"thumbnail"`
	Order       int       `gorm:"not null;default:0" json:"order"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
	Videos      []Video   `gorm:"foreignKey:CategoryID" json:"videos,omitempty"`
}

// Video merepresentasikan materi video latihan
type Video struct {
	ID          string    `gorm:"primaryKey;type:varchar(64)" json:"id"` // misal: 'vid-fx-1'
	CategoryID  string    `gorm:"type:varchar(64);index;not null" json:"categoryId"`
	Title       string    `gorm:"type:varchar(255);not null" json:"title"`
	Description string    `gorm:"type:text" json:"description"`
	DriveFileID string    `gorm:"type:varchar(128)" json:"driveFileId"`
	DriveLink   string    `gorm:"type:text" json:"driveLink"`
	Thumbnail   string    `gorm:"type:varchar(255)" json:"thumbnail"`
	Duration    string    `gorm:"type:varchar(32)" json:"duration"`
	Level       string    `gorm:"type:varchar(64)" json:"level"` // 'Dasar', 'Menengah', 'Mahir'
	EpisodeNum  int       `gorm:"default:1" json:"episodeNum"`
	IsFree      bool      `gorm:"default:false" json:"isFree"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}
