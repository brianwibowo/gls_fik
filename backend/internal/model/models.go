package model

import (
	"time"
)

// User represents accounts (coach/admin and athletes)
type User struct {
	ID        string    `gorm:"primaryKey;type:varchar(64)" json:"id"`
	Name      string    `gorm:"type:varchar(128);not null" json:"name"`
	Email     string    `gorm:"uniqueIndex;type:varchar(128);not null" json:"email"`
	Password  string    `gorm:"type:varchar(255)" json:"-"` // Omitted in JSON responses
	Role      string    `gorm:"type:varchar(32);default:'user'" json:"role"` // 'user' or 'admin'
	Avatar    string    `gorm:"type:varchar(255)" json:"avatar,omitempty"`
	Bio       string    `gorm:"type:text" json:"bio,omitempty"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// Category represents the 6 artistic gymnastics MAG apparatus
type Category struct {
	ID          string    `gorm:"primaryKey;type:varchar(64)" json:"id"` // e.g., 'cat-fx'
	Name        string    `gorm:"type:varchar(128);not null" json:"name"`
	Description string    `gorm:"type:text" json:"description"`
	Thumbnail   string    `gorm:"type:varchar(255)" json:"thumbnail"`
	Order       int       `gorm:"not null;default:0" json:"order"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
	Videos      []Video   `gorm:"foreignKey:CategoryID" json:"videos,omitempty"`
}

// Video represents an apparatus technique demonstration video
type Video struct {
	ID          string    `gorm:"primaryKey;type:varchar(64)" json:"id"` // e.g., 'vid-fx-1'
	CategoryID  string    `gorm:"type:varchar(64);index;not null" json:"categoryId"`
	Title       string    `gorm:"type:varchar(255);not null" json:"title"`
	Description string    `gorm:"type:text" json:"description"`
	DriveFileID string    `gorm:"type:varchar(128)" json:"driveFileId"`
	DriveLink   string    `gorm:"type:text" json:"driveLink"`
	Thumbnail   string    `gorm:"type:varchar(255)" json:"thumbnail"`
	Duration    string    `gorm:"type:varchar(32)" json:"duration"`
	Level       string    `gorm:"type:varchar(64)" json:"level"` // 'Foundation', 'Intermediate', 'Advanced' (or Level 1/2/3)
	EpisodeNum  int       `gorm:"default:1" json:"episodeNum"`
	IsFree      bool      `gorm:"default:false" json:"isFree"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// Technique represents a curriculum skill/movement item for an apparatus level
type Technique struct {
	ID          string    `gorm:"primaryKey;type:varchar(64)" json:"id"` // e.g., 'tech-fx-1-1'
	CategoryID  string    `gorm:"type:varchar(64);index;not null" json:"categoryId"`
	Level       int       `gorm:"not null;default:1" json:"level"` // 1, 2, or 3
	Name        string    `gorm:"type:varchar(255);not null" json:"name"`
	Description string    `gorm:"type:text" json:"description,omitempty"`
	Order       int       `gorm:"not null;default:0" json:"order"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// AthleteProgress records an athlete's completion of a specific technique
type AthleteProgress struct {
	ID          string    `gorm:"primaryKey;type:varchar(64)" json:"id"`
	AthleteID   string    `gorm:"type:varchar(64);index;not null" json:"athleteId"`
	TechniqueID string    `gorm:"type:varchar(64);index;not null" json:"techniqueId"`
	IsCompleted bool      `gorm:"default:false" json:"isCompleted"`
	CompletedAt *time.Time `json:"completedAt,omitempty"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// TechniqueEvaluation stores coaching notes and status per technique for an athlete
type TechniqueEvaluation struct {
	ID          string    `gorm:"primaryKey;type:varchar(64)" json:"id"`
	AthleteID   string    `gorm:"type:varchar(64);index;not null" json:"athleteId"`
	TechniqueID string    `gorm:"type:varchar(64);index;not null" json:"techniqueId"`
	CoachID     string    `gorm:"type:varchar(64);not null" json:"coachId"`
	CoachName   string    `gorm:"type:varchar(128)" json:"coachName,omitempty"`
	Notes       string    `gorm:"type:text" json:"notes"`
	Score       string    `gorm:"type:varchar(32)" json:"score,omitempty"` // e.g., 'Mastered', 'Needs Work', 'Developing'
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}
