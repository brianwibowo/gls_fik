package seed

import (
	"log"
	"strings"

	"gls_fik/backend/internal/model"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

func seedVideoChecklists(db *gorm.DB) {
	var videos []model.Video
	if err := db.Where("checklist_initialized = false").Find(&videos).Error; err != nil {
		log.Fatalf("Gagal membaca checklist video: %v", err)
	}
	for _, video := range videos {
		err := db.Transaction(func(tx *gorm.DB) error {
			var current model.Video
			if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).First(&current, "id = ?", video.ID).Error; err != nil {
				return err
			}
			if current.ChecklistInitialized {
				return nil
			}
			level := 0
			switch strings.ToLower(strings.TrimSpace(current.Level)) {
			case "level 1", "foundation", "dasar", "1":
				level = 1
			case "level 2", "intermediate", "menengah", "2":
				level = 2
			case "level 3", "advanced", "mahir", "3":
				level = 3
			}
			if level > 0 {
				var techniques []model.Technique
				if err := tx.Where("category_id = ? AND level = ?", current.CategoryID, level).Order("techniques.order ASC").Find(&techniques).Error; err != nil {
					return err
				}
				for i, t := range techniques {
					item := model.VideoChecklistItem{VideoID: current.ID, ID: t.ID, Name: t.Name, Order: i}
					if err := tx.Clauses(clause.OnConflict{DoNothing: true}).Create(&item).Error; err != nil {
						return err
					}
				}
			}
			return tx.Model(&current).Update("checklist_initialized", true).Error
		})
		if err != nil {
			log.Fatalf("Gagal menyiapkan checklist video: %v", err)
		}
	}
}
