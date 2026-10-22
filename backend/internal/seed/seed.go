package seed

import (
	"log"
	"time"

	"gls_fik/backend/internal/model"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func SeedData(db *gorm.DB) {
	seedUsers(db)
	seedCategories(db)
	seedVideos(db)
	seedTechniques(db)
}

func hashPassword(password string) string {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Fatalf("Failed to hash password: %v", err)
	}
	return string(bytes)
}

func seedUsers(db *gorm.DB) {
	users := []model.User{
		{
			ID:        "admin-gcl",
			Name:      "GCL Administrator",
			Email:     "admin@gymnasticcomplevel.com",
			Password:  hashPassword("admin123"),
			Role:      "admin",
			Avatar:    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
			Bio:       "Head of Technical Curriculum & Competition Standards at GCL.",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		{
			ID:        "coach-david",
			Name:      "Coach David Chen",
			Email:     "coach@gymnasticcomplevel.com",
			Password:  hashPassword("coach123"),
			Role:      "coach",
			Avatar:    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
			Bio:       "National MAG Coach & FIG Certified Technical Evaluator with 14 years of coaching.",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		{
			ID:        "athlete-marcus",
			Name:      "Marcus Vance",
			Email:     "athlete@gymnasticcomplevel.com",
			Password:  hashPassword("athlete123"),
			Role:      "athlete",
			Avatar:    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
			Bio:       "Senior Men's Artistic Gymnastics competitor specializing in Floor and Still Rings.",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		{
			ID:        "athlete-liam",
			Name:      "Liam Parker",
			Email:     "athlete2@gymnasticcomplevel.com",
			Password:  hashPassword("athlete123"),
			Role:      "athlete",
			Avatar:    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
			Bio:       "Junior All-Around artistic gymnast currently mastering Level 2 apparatus routines.",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
	}

	for _, u := range users {
		var existing model.User
		if err := db.First(&existing, "email = ?", u.Email).Error; err != nil {
			db.Create(&u)
		} else {
			db.Model(&existing).Updates(map[string]interface{}{
				"role":   u.Role,
				"bio":    u.Bio,
				"avatar": u.Avatar,
			})
		}
	}
	log.Println("[SEED] User accounts (admin, coach, athletes) synchronized.")
}

func seedCategories(db *gorm.DB) {
	categories := []model.Category{
		{
			ID:          "cat-fx",
			Name:        "Floor Exercise (FX)",
			Description: "A combination of tumbling passes, acrobatics, balance holds, and rotational elements performed on a 12x12m spring floor.",
			Thumbnail:   "/images/apparatus-floor.webp",
			Order:       1,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "cat-ph",
			Name:        "Pommel Horse (PH)",
			Description: "Continuous circular and scissor leg routines executed smoothly across the length and handles of the pommel horse.",
			Thumbnail:   "/images/apparatus-pommel.webp",
			Order:       2,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "cat-sr",
			Name:        "Still Rings (SR)",
			Description: "Demonstrations of static strength, isometric holds, swings, and aerial dismounts suspended from dual cable rings.",
			Thumbnail:   "/images/apparatus-rings.webp",
			Order:       3,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "cat-vt",
			Name:        "Vault (VT)",
			Description: "Explosive dynamic propulsion launched from a sprint and springboard into flight over the vaulting table.",
			Thumbnail:   "/images/apparatus-vault.webp",
			Order:       4,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "cat-pb",
			Name:        "Parallel Bars (PB)",
			Description: "Fluid transition series combining swings, handstands, above-bar and below-bar release elements, and dismounts.",
			Thumbnail:   "/images/apparatus-bars.webp",
			Order:       5,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "cat-hb",
			Name:        "Horizontal Bar (HB)",
			Description: "High-velocity giants, pirouettes, bar releases, flight re-grasps, and stuck aerial landing dismounts.",
			Thumbnail:   "/images/apparatus-highbar.jpg",
			Order:       6,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
	}

	for _, c := range categories {
		var existing model.Category
		if err := db.First(&existing, "id = ?", c.ID).Error; err != nil {
			db.Create(&c)
		} else {
			db.Model(&existing).Updates(map[string]interface{}{
				"name":        c.Name,
				"description": c.Description,
				"thumbnail":   c.Thumbnail,
				"order":       c.Order,
			})
		}
	}
	log.Println("[SEED] 6 apparatus categories synchronized.")
}

func seedVideos(db *gorm.DB) {
	videos := []model.Video{
		// 1. Floor Exercise (FX)
		{
			ID:          "vid-fx-1",
			CategoryID:  "cat-fx",
			Title:       "Floor Exercise (FX) - Level 1 Foundation Routine",
			Description: "Level 1 Technical Curriculum Elements:\n• Starting Position\n• Single Leg Balance (Hold 2s)\n• Forward Roll\n• Handstand (Hold 2s)\n• Cartwheel\n• Bridge (Hold 2s)\n• Backward Roll\n• Standing Finish",
			DriveFileID: "12JG_YaH6ADE4xVqgskKQY-rx79Dht7KM",
			DriveLink:   "https://drive.google.com/file/d/12JG_YaH6ADE4xVqgskKQY-rx79Dht7KM/view?usp=share_link",
			Thumbnail:   "/images/apparatus-floor.webp",
			Duration:    "03:45",
			Level:       "Level 1 (Foundation)",
			EpisodeNum:  1,
			IsFree:      true,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "vid-fx-2",
			CategoryID:  "cat-fx",
			Title:       "Floor Exercise (FX) - Level 2 Intermediate Progression",
			Description: "Level 2 Technical Curriculum Elements:\n• Starting Position\n• Single Leg Balance (Hold 2s)\n• Forward Roll & Handstand (Hold 2s)\n• Cartwheel & Bridge\n• Backward Roll to Handstand\n• Round-off\n• Tiger Jump\n• Standing Finish",
			DriveFileID: "10pPKxlH8e6GKSI79bTbiCQ7d_YQP3xkD",
			DriveLink:   "https://drive.google.com/file/d/10pPKxlH8e6GKSI79bTbiCQ7d_YQP3xkD/view?usp=share_link",
			Thumbnail:   "/images/apparatus-floor.webp",
			Duration:    "04:12",
			Level:       "Level 2 (Intermediate)",
			EpisodeNum:  2,
			IsFree:      false,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "vid-fx-3",
			CategoryID:  "cat-fx",
			Title:       "Floor Exercise (FX) - Level 3 Advanced Competition Mastery",
			Description: "Level 3 Technical Curriculum Elements:\n• Starting Position & Single Leg Balance\n• Handstand & Cartwheel\n• Backward Roll to Handstand\n• Press Handstand\n• Tiger Jump & Round-off\n• Back Handspring\n• Standing Finish",
			DriveFileID: "1saHh0xfJRT3tuIKyByGCbAzsMnoa2HXI",
			DriveLink:   "https://drive.google.com/file/d/1saHh0xfJRT3tuIKyByGCbAzsMnoa2HXI/view?usp=share_link",
			Thumbnail:   "/images/apparatus-floor.webp",
			Duration:    "05:08",
			Level:       "Level 3 (Advanced)",
			EpisodeNum:  3,
			IsFree:      false,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		// 2. Pommel Horse (PH)
		{
			ID:          "vid-ph-1",
			CategoryID:  "cat-ph",
			Title:       "Pommel Horse (PH) - Level 1 Mushroom Circle Basics",
			Description: "Level 1 Technical Curriculum Elements:\n• Starting Position\n• Double Leg Circle (5 repetitions with pauses)\n• Standing Finish",
			DriveFileID: "1bWbwPWd0GQ_AiX9i4tQ-kFpBKX1mEiLv",
			DriveLink:   "https://drive.google.com/file/d/1bWbwPWd0GQ_AiX9i4tQ-kFpBKX1mEiLv/view?usp=share_link",
			Thumbnail:   "/images/apparatus-pommel.webp",
			Duration:    "03:30",
			Level:       "Level 1 (Foundation)",
			EpisodeNum:  1,
			IsFree:      true,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "vid-ph-2",
			CategoryID:  "cat-ph",
			Title:       "Pommel Horse (PH) - Level 2 Continuous Circle Drills",
			Description: "Level 2 Technical Curriculum Elements:\n• Starting Position\n• Continuous Double Leg Circle (5 consecutive circles)\n• Standing Finish",
			DriveFileID: "1V2mwHNlh2jbpzQz6XwFSvr_OOKb-Hsxk",
			DriveLink:   "https://drive.google.com/file/d/1V2mwHNlh2jbpzQz6XwFSvr_OOKb-Hsxk/view?usp=share_link",
			Thumbnail:   "/images/apparatus-pommel.webp",
			Duration:    "04:45",
			Level:       "Level 2 (Intermediate)",
			EpisodeNum:  2,
			IsFree:      false,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "vid-ph-3",
			CategoryID:  "cat-ph",
			Title:       "Pommel Horse (PH) - Level 3 Extended Circle Routine",
			Description: "Level 3 Technical Curriculum Elements:\n• Starting Position\n• Continuous Double Leg Circle (10 consecutive circles)\n• Standing Finish",
			DriveFileID: "1OSxlH3hgtuHZ4j25LihLlaKqZtZ5nBq4",
			DriveLink:   "https://drive.google.com/file/d/1OSxlH3hgtuHZ4j25LihLlaKqZtZ5nBq4/view?usp=share_link",
			Thumbnail:   "/images/apparatus-pommel.webp",
			Duration:    "04:15",
			Level:       "Level 3 (Advanced)",
			EpisodeNum:  3,
			IsFree:      false,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		// 3. Still Rings (SR)
		{
			ID:          "vid-sr-1",
			CategoryID:  "cat-sr",
			Title:       "Still Rings (SR) - Level 1 Hang & Strength Holds",
			Description: "Level 1 Technical Curriculum Elements:\n• Hang Position\n• Tuck Hang\n• L-Sit Preparation\n• Pike Position\n• Swing Forward-Backward\n• Dismount (Straight Jump)",
			DriveFileID: "1jQ5WvB3Xc0CNCBqv_remyZ70VFkB6qhJ",
			DriveLink:   "https://drive.google.com/file/d/1jQ5WvB3Xc0CNCBqv_remyZ70VFkB6qhJ/view?usp=share_link",
			Thumbnail:   "/images/apparatus-rings.webp",
			Duration:    "03:50",
			Level:       "Level 1 (Foundation)",
			EpisodeNum:  1,
			IsFree:      true,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "vid-sr-2",
			CategoryID:  "cat-sr",
			Title:       "Still Rings (SR) - Level 2 Inverted & Dynamic Swings",
			Description: "Level 2 Technical Curriculum Elements:\n• Hang Position & Tuck Hang\n• L-Sit Preparation\n• Inverted Hang\n• Inlocate\n• Swing Forward-Backward\n• Dismount (Straight Jump)",
			DriveFileID: "1ZEnFVQLnIVuIvNBIVC6H1KruGF-j5nfq",
			DriveLink:   "https://drive.google.com/file/d/1ZEnFVQLnIVuIvNBIVC6H1KruGF-j5nfq/view?usp=share_link",
			Thumbnail:   "/images/apparatus-rings.webp",
			Duration:    "05:10",
			Level:       "Level 2 (Intermediate)",
			EpisodeNum:  2,
			IsFree:      false,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "vid-sr-3",
			CategoryID:  "cat-sr",
			Title:       "Still Rings (SR) - Level 3 Advanced Inlocate & Support Holds",
			Description: "Level 3 Technical Curriculum Elements:\n• Hang Position & Tuck Hang\n• Support Hold (Assisted by coach)\n• L-Sit Preparation\n• Inverted Hang\n• Inlocate\n• Swing Forward-Backward\n• Dismount (Straight Jump)",
			DriveFileID: "1s9U5a8g5eP7r75xV3924qR5eD7cI5r6",
			DriveLink:   "https://drive.google.com/file/d/1s9U5a8g5eP7r75xV3924qR5eD7cI5r6/view?usp=share_link",
			Thumbnail:   "/images/apparatus-rings.webp",
			Duration:    "04:55",
			Level:       "Level 3 (Advanced)",
			EpisodeNum:  3,
			IsFree:      false,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		// 4. Vault (VT)
		{
			ID:          "vid-vt-1",
			CategoryID:  "cat-vt",
			Title:       "Vault (VT) - Level 1 Approach Run & Mat Landing",
			Description: "Level 1 Technical Curriculum Elements:\n• Starting Position\n• Controlled Run\n• Hurdle\n• Two-foot Take-off\n• Jump to Mat / Handstand to Flat Back\n• Controlled Landing",
			DriveFileID: "11T2OaK78t_jS0qU5nF_nB0rWvB6zT9uM",
			DriveLink:   "https://drive.google.com/file/d/11T2OaK78t_jS0qU5nF_nB0rWvB6zT9uM/view?usp=share_link",
			Thumbnail:   "/images/apparatus-vault.webp",
			Duration:    "03:15",
			Level:       "Level 1 (Foundation)",
			EpisodeNum:  1,
			IsFree:      true,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "vid-vt-2",
			CategoryID:  "cat-vt",
			Title:       "Vault (VT) - Level 2 Board Contact & Flat Back",
			Description: "Level 2 Technical Curriculum Elements:\n• Starting Position\n• Controlled Run\n• Hurdle\n• Board Contact\n• Hand Contact\n• Handstand Flat-back\n• Controlled Landing",
			DriveFileID: "1G9nO6eH5zP0p7eY9kR6rV7fA9bK2pL4",
			DriveLink:   "https://drive.google.com/file/d/1G9nO6eH5zP0p7eY9kR6rV7fA9bK2pL4/view?usp=share_link",
			Thumbnail:   "/images/apparatus-vault.webp",
			Duration:    "04:05",
			Level:       "Level 2 (Intermediate)",
			EpisodeNum:  2,
			IsFree:      false,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "vid-vt-3",
			CategoryID:  "cat-vt",
			Title:       "Vault (VT) - Level 3 Handspring Vault & Flight Execution",
			Description: "Level 3 Technical Curriculum Elements:\n• Starting Position\n• Controlled Run\n• Hurdle & Board Contact\n• Hand Contact & Block\n• Flight Phase\n• Handspring Vault\n• Controlled Landing",
			DriveFileID: "1zL7p9kG4mN8vC2xP0qR5eD7cI5r6sT9",
			DriveLink:   "https://drive.google.com/file/d/1zL7p9kG4mN8vC2xP0qR5eD7cI5r6sT9/view?usp=share_link",
			Thumbnail:   "/images/apparatus-vault.webp",
			Duration:    "05:20",
			Level:       "Level 3 (Advanced)",
			EpisodeNum:  3,
			IsFree:      false,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		// 5. Parallel Bars (PB)
		{
			ID:          "vid-pb-1",
			CategoryID:  "cat-pb",
			Title:       "Parallel Bars (PB) - Level 1 Support Holds & Basic Swings",
			Description: "Level 1 Technical Curriculum Elements:\n• Mount from box\n• Tuck Support (Hold 2s)\n• L-Sit (Hold 2s)\n• Basic Swing (3 repetitions)\n• Controlled Dismount",
			DriveFileID: "1kM8vC2xP0qR5eD7cI5r6sT9uV1wX3yZ",
			DriveLink:   "https://drive.google.com/file/d/1kM8vC2xP0qR5eD7cI5r6sT9uV1wX3yZ/view?usp=share_link",
			Thumbnail:   "/images/apparatus-bars.webp",
			Duration:    "04:00",
			Level:       "Level 1 (Foundation)",
			EpisodeNum:  1,
			IsFree:      true,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "vid-pb-2",
			CategoryID:  "cat-pb",
			Title:       "Parallel Bars (PB) - Level 2 Handstand Swings & Transition",
			Description: "Level 2 Technical Curriculum Elements:\n• Mount from box\n• Upper Arm Support to Straddle\n• L-Sit (Hold 2s)\n• Swing to Handstand\n• Controlled Dismount",
			DriveFileID: "15pQ7r9sT1uV3wX5yZ7aB9cD1eF3gH5",
			DriveLink:   "https://drive.google.com/file/d/15pQ7r9sT1uV3wX5yZ7aB9cD1eF3gH5/view?usp=share_link",
			Thumbnail:   "/images/apparatus-bars.webp",
			Duration:    "04:50",
			Level:       "Level 2 (Intermediate)",
			EpisodeNum:  2,
			IsFree:      false,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "vid-pb-3",
			CategoryID:  "cat-pb",
			Title:       "Parallel Bars (PB) - Level 3 Kip & Handstand Elements",
			Description: "Level 3 Technical Curriculum Elements:\n• Mount without box\n• Kip\n• L-Sit (Hold 2s)\n• Swing to Handstand\n• Controlled Dismount",
			DriveFileID: "1jK2lM3nO4pP5qR6sT7uV8wX9yZ0aB1",
			DriveLink:   "https://drive.google.com/file/d/1jK2lM3nO4pP5qR6sT7uV8wX9yZ0aB1/view?usp=share_link",
			Thumbnail:   "/images/apparatus-bars.webp",
			Duration:    "05:35",
			Level:       "Level 3 (Advanced)",
			EpisodeNum:  3,
			IsFree:      false,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		// 6. Horizontal Bar (HB)
		{
			ID:          "vid-hb-1",
			CategoryID:  "cat-hb",
			Title:       "Horizontal Bar (HB) - Level 1 Grip, Hang & Rhythm Swings",
			Description: "Level 1 Technical Curriculum Elements:\n• Safe Mount\n• Tuck Hang (Hold 2s)\n• L-Hang (Hold 2s)\n• Body Tension\n• Basic Swing (3 repetitions)\n• Controlled Dismount",
			DriveFileID: "1eG7n4q79j9V0qJ5vK8_8Wn9pL5mC3x",
			DriveLink:   "https://drive.google.com/file/d/1eG7n4q79j9V0qJ5vK8_8Wn9pL5mC3x/view?usp=share_link",
			Thumbnail:   "/images/apparatus-highbar.jpg",
			Duration:    "03:40",
			Level:       "Level 1 (Foundation)",
			EpisodeNum:  1,
			IsFree:      true,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "vid-hb-2",
			CategoryID:  "cat-hb",
			Title:       "Horizontal Bar (HB) - Level 2 Pull-Over & Glide Swings",
			Description: "Level 2 Technical Curriculum Elements:\n• Safe Mount\n• Tuck Hang (Hold 2s)\n• L-Hang (Hold 2s)\n• Pull Over (Coach assisted)\n• Glide to Basic Swing (3 repetitions)\n• Controlled Dismount",
			DriveFileID: "1BANvdbvr-0UVVoVoLqJN0Hy3MqEW69fQ",
			DriveLink:   "https://drive.google.com/file/d/1BANvdbvr-0UVVoVoLqJN0Hy3MqEW69fQ/view?usp=share_link",
			Thumbnail:   "/images/apparatus-highbar.jpg",
			Duration:    "05:05",
			Level:       "Level 2 (Intermediate)",
			EpisodeNum:  2,
			IsFree:      false,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "vid-hb-3",
			CategoryID:  "cat-hb",
			Title:       "Horizontal Bar (HB) - Level 3 Kip, Half-Turn & Dismount",
			Description: "Level 3 Technical Curriculum Elements:\n• Safe Mount\n• Tuck Hang (Hold 2s)\n• L-Hang (Hold 2s)\n• Kip\n• Glide to Basic Swing\n• Swing Forward Turn 180\n• Controlled Dismount",
			DriveFileID: "1SXsHg1lSSP184HLB5BcrI9ux34VMhgVb",
			DriveLink:   "https://drive.google.com/file/d/1SXsHg1lSSP184HLB5BcrI9ux34VMhgVb/view?usp=share_link",
			Thumbnail:   "/images/apparatus-highbar.jpg",
			Duration:    "04:40",
			Level:       "Level 3 (Advanced)",
			EpisodeNum:  3,
			IsFree:      false,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
	}

	for _, v := range videos {
		var existing model.Video
		if err := db.First(&existing, "id = ?", v.ID).Error; err != nil {
			db.Create(&v)
		} else {
			db.Model(&existing).Updates(map[string]interface{}{
				"title":       v.Title,
				"description": v.Description,
				"level":       v.Level,
			})
		}
	}
	log.Println("[SEED] 18 curriculum videos synchronized.")
}

func seedTechniques(db *gorm.DB) {
	techniques := []model.Technique{
		// Floor Exercise (FX) - Level 1
		{ID: "tech-fx-1-1", CategoryID: "cat-fx", Level: 1, Name: "Starting Position", Description: "Stand tall at the corner of the floor mat, arms presented, confident posture.", Order: 1},
		{ID: "tech-fx-1-2", CategoryID: "cat-fx", Level: 1, Name: "Single Leg Balance (Hold 2s)", Description: "Maintain single-leg upright balance with chest lifted and core engaged for at least 2 seconds.", Order: 2},
		{ID: "tech-fx-1-3", CategoryID: "cat-fx", Level: 1, Name: "Forward Roll", Description: "Execute a controlled forward tuck roll without using hands to push off the mat upon standing.", Order: 3},
		{ID: "tech-fx-1-4", CategoryID: "cat-fx", Level: 1, Name: "Handstand (Hold 2s)", Description: "Kick up into a vertical handstand hold, full shoulder elevation, tight body line for 2 seconds.", Order: 4},
		{ID: "tech-fx-1-5", CategoryID: "cat-fx", Level: 1, Name: "Cartwheel", Description: "Fluid lateral hand-hand-foot-foot rotation along a straight line with extended limbs.", Order: 5},
		{ID: "tech-fx-1-6", CategoryID: "cat-fx", Level: 1, Name: "Bridge (Hold 2s)", Description: "Push up from supine into an arched bridge with shoulders open over the wrists for 2 seconds.", Order: 6},
		{ID: "tech-fx-1-7", CategoryID: "cat-fx", Level: 1, Name: "Backward Roll", Description: "Smooth backward roll tucking knees to chest, protecting the neck, and landing on feet.", Order: 7},
		{ID: "tech-fx-1-8", CategoryID: "cat-fx", Level: 1, Name: "Standing Finish", Description: "Rebound up to a stable stand, arms held high, hold presentation pose.", Order: 8},

		// Floor Exercise (FX) - Level 2
		{ID: "tech-fx-2-1", CategoryID: "cat-fx", Level: 2, Name: "Starting Position", Description: "Official competition starting stance at the floor edge.", Order: 1},
		{ID: "tech-fx-2-2", CategoryID: "cat-fx", Level: 2, Name: "Single Leg Balance (Hold 2s)", Description: "Arabesque or scale balance hold on one leg with proper leg extension for 2 seconds.", Order: 2},
		{ID: "tech-fx-2-3", CategoryID: "cat-fx", Level: 2, Name: "Forward Roll", Description: "Forward roll with dynamic entry straight into standing alignment.", Order: 3},
		{ID: "tech-fx-2-4", CategoryID: "cat-fx", Level: 2, Name: "Handstand (Hold 2s)", Description: "Strict vertical handstand hold with pointed toes and neutral spine.", Order: 4},
		{ID: "tech-fx-2-5", CategoryID: "cat-fx", Level: 2, Name: "Cartwheel", Description: "High-paced cartwheel along the line with clean foot placement.", Order: 5},
		{ID: "tech-fx-2-6", CategoryID: "cat-fx", Level: 2, Name: "Bridge", Description: "Immediate bridge push-up with shoulders vertically over hands.", Order: 6},
		{ID: "tech-fx-2-7", CategoryID: "cat-fx", Level: 2, Name: "Backward to Handstand", Description: "Backward roll pushing straight into a brief extension toward handstand.", Order: 7},
		{ID: "tech-fx-2-8", CategoryID: "cat-fx", Level: 2, Name: "Round-off", Description: "Hurdle entry, hand snap, and explosive two-foot rebound turnaround.", Order: 8},
		{ID: "tech-fx-2-9", CategoryID: "cat-fx", Level: 2, Name: "Tiger Jump", Description: "Dynamic dive roll / tiger leap forward with high hip elevation.", Order: 9},
		{ID: "tech-fx-2-10", CategoryID: "cat-fx", Level: 2, Name: "Standing Finish", Description: "Controlled stuck finish pose with salute.", Order: 10},

		// Floor Exercise (FX) - Level 3
		{ID: "tech-fx-3-1", CategoryID: "cat-fx", Level: 3, Name: "Starting Position", Description: "Competition ready presentation at designated floor corner.", Order: 1},
		{ID: "tech-fx-3-2", CategoryID: "cat-fx", Level: 3, Name: "Single Leg Balance", Description: "Advanced high arabesque or needle scale hold.", Order: 2},
		{ID: "tech-fx-3-3", CategoryID: "cat-fx", Level: 3, Name: "Handstand", Description: "Precise handstand hold demonstrating complete balance control.", Order: 3},
		{ID: "tech-fx-3-4", CategoryID: "cat-fx", Level: 3, Name: "Cartwheel", Description: "Explosive competition cartwheel with clean extension.", Order: 4},
		{ID: "tech-fx-3-5", CategoryID: "cat-fx", Level: 3, Name: "Backward Roll to Handstand", Description: "Dynamic straight-arm backward roll pushing directly into handstand.", Order: 5},
		{ID: "tech-fx-3-6", CategoryID: "cat-fx", Level: 3, Name: "Press Handstand", Description: "Straight leg or straddle press to handstand from floor sit/stand.", Order: 6},
		{ID: "tech-fx-3-7", CategoryID: "cat-fx", Level: 3, Name: "Tiger Jump", Description: "High-elevation dive roll with ample flight phase.", Order: 7},
		{ID: "tech-fx-3-8", CategoryID: "cat-fx", Level: 3, Name: "Round-off", Description: "High velocity round-off generating maximum rebound power.", Order: 8},
		{ID: "tech-fx-3-9", CategoryID: "cat-fx", Level: 3, Name: "Back Handspring", Description: "Rapid backward tumbling flip landing on both feet with spring.", Order: 9},
		{ID: "tech-fx-3-10", CategoryID: "cat-fx", Level: 3, Name: "Standing Finish", Description: "Firm landing, arms raised, confident presentation.", Order: 10},

		// Pommel Horse (PH) - Level 1
		{ID: "tech-ph-1-1", CategoryID: "cat-ph", Level: 1, Name: "Starting Position", Description: "Firm grip on mushroom, body straight, core locked.", Order: 1},
		{ID: "tech-ph-1-2", CategoryID: "cat-ph", Level: 1, Name: "Double Leg Circle (5 repetitions with pauses)", Description: "Execute single circle rotations on mushroom with controlled stops, repeated 5 times.", Order: 2},
		{ID: "tech-ph-1-3", CategoryID: "cat-ph", Level: 1, Name: "Standing Finish", Description: "Clean dismount step and stable standing finish.", Order: 3},

		// Pommel Horse (PH) - Level 2
		{ID: "tech-ph-2-1", CategoryID: "cat-ph", Level: 2, Name: "Starting Position", Description: "Upright approach and entry grip on mushroom apparatus.", Order: 1},
		{ID: "tech-ph-2-2", CategoryID: "cat-ph", Level: 2, Name: "Continuous Double Leg Circle (5 consecutive)", Description: "Perform 5 continuous, uninterrupted double leg circles without touching the apparatus.", Order: 2},
		{ID: "tech-ph-2-3", CategoryID: "cat-ph", Level: 2, Name: "Standing Finish", Description: "Controlled exit to upright stance with presentation.", Order: 3},

		// Pommel Horse (PH) - Level 3
		{ID: "tech-ph-3-1", CategoryID: "cat-ph", Level: 3, Name: "Starting Position", Description: "Ready stance on pommel horse or mushroom.", Order: 1},
		{ID: "tech-ph-3-2", CategoryID: "cat-ph", Level: 3, Name: "Continuous Double Leg Circle (10 consecutive)", Description: "Execute 10 fluid, uninterrupted full-amplitude double leg circles.", Order: 2},
		{ID: "tech-ph-3-3", CategoryID: "cat-ph", Level: 3, Name: "Standing Finish", Description: "High swing dismount to stuck landing stance.", Order: 3},

		// Still Rings (SR) - Level 1
		{ID: "tech-sr-1-1", CategoryID: "cat-sr", Level: 1, Name: "Hang Position", Description: "Full arm hang with neutral grip and straight body line.", Order: 1},
		{ID: "tech-sr-1-2", CategoryID: "cat-sr", Level: 1, Name: "Tuck Hang", Description: "Knees drawn tightly to chest while maintaining still cables.", Order: 2},
		{ID: "tech-sr-1-3", CategoryID: "cat-sr", Level: 1, Name: "L-Sit Preparation", Description: "Raise straight legs horizontally or tuck variation with core active.", Order: 3},
		{ID: "tech-sr-1-4", CategoryID: "cat-sr", Level: 1, Name: "Pike Position", Description: "Pike body hang with straight knees and engaged lats.", Order: 4},
		{ID: "tech-sr-1-5", CategoryID: "cat-sr", Level: 1, Name: "Swing Forward-Backward", Description: "Controlled pendulum swings without cable shaking.", Order: 5},
		{ID: "tech-sr-1-6", CategoryID: "cat-sr", Level: 1, Name: "Dismount (Straight Jump)", Description: "Release swing at rear peak into a straight stuck landing.", Order: 6},

		// Still Rings (SR) - Level 2
		{ID: "tech-sr-2-1", CategoryID: "cat-sr", Level: 2, Name: "Hang Position", Description: "Clean straight hang with shoulder stabilization.", Order: 1},
		{ID: "tech-sr-2-2", CategoryID: "cat-sr", Level: 2, Name: "Tuck Hang", Description: "Strict tuck hang hold for 3 seconds.", Order: 2},
		{ID: "tech-sr-2-3", CategoryID: "cat-sr", Level: 2, Name: "L-Sit Preparation", Description: "90-degree L-hang or support hold preparation.", Order: 3},
		{ID: "tech-sr-2-4", CategoryID: "cat-sr", Level: 2, Name: "Inverted Hang", Description: "Smooth invert rotation holding body upside down vertically.", Order: 4},
		{ID: "tech-sr-2-5", CategoryID: "cat-sr", Level: 2, Name: "Inlocate", Description: "Shoulder rotation inward from inverted hang into back lever/hang.", Order: 5},
		{ID: "tech-sr-2-6", CategoryID: "cat-sr", Level: 2, Name: "Swing Forward-Backward", Description: "Rhythmic forward and backward swings with amplitude.", Order: 6},
		{ID: "tech-sr-2-7", CategoryID: "cat-sr", Level: 2, Name: "Dismount (Straight Jump)", Description: "Dynamic straight dismount with quiet, controlled landing.", Order: 7},

		// Still Rings (SR) - Level 3
		{ID: "tech-sr-3-1", CategoryID: "cat-sr", Level: 3, Name: "Hang Position", Description: "Initial stable hang.", Order: 1},
		{ID: "tech-sr-3-2", CategoryID: "cat-sr", Level: 3, Name: "Tuck Hang", Description: "High tuck compression hold.", Order: 2},
		{ID: "tech-sr-3-3", CategoryID: "cat-sr", Level: 3, Name: "Support Hold (Assisted by coach)", Description: "Straight arm support hold above the rings with turned-out rings.", Order: 3},
		{ID: "tech-sr-3-4", CategoryID: "cat-sr", Level: 3, Name: "L-Sit Preparation", Description: "L-sit support hold on rings.", Order: 4},
		{ID: "tech-sr-3-5", CategoryID: "cat-sr", Level: 3, Name: "Inverted Hang", Description: "Stable inverted hang with locked hips.", Order: 5},
		{ID: "tech-sr-3-6", CategoryID: "cat-sr", Level: 3, Name: "Inlocate", Description: "Dynamic inlocate through horizontal plane.", Order: 6},
		{ID: "tech-sr-3-7", CategoryID: "cat-sr", Level: 3, Name: "Swing Forward-Backward", Description: "High amplitude swings with locked elbows.", Order: 7},
		{ID: "tech-sr-3-8", CategoryID: "cat-sr", Level: 3, Name: "Dismount (Straight Jump)", Description: "High release dismount with solid stuck landing.", Order: 8},

		// Vault (VT) - Level 1
		{ID: "tech-vt-1-1", CategoryID: "cat-vt", Level: 1, Name: "Starting Position", Description: "Focus stance at the top of the runway.", Order: 1},
		{ID: "tech-vt-1-2", CategoryID: "cat-vt", Level: 1, Name: "Controlled Run", Description: "Accelerating sprint maintaining forward lean and cadence.", Order: 2},
		{ID: "tech-vt-1-3", CategoryID: "cat-vt", Level: 1, Name: "Hurdle", Description: "Low, explosive hurdle leap onto springboard.", Order: 3},
		{ID: "tech-vt-1-4", CategoryID: "cat-vt", Level: 1, Name: "Two-foot Take-off", Description: "Simultaneous two-foot strike on board sweet spot with upright bounce.", Order: 4},
		{ID: "tech-vt-1-5", CategoryID: "cat-vt", Level: 1, Name: "Jump to Mat / Handstand to Flat Back", Description: "Explosive jump onto stacked mats or handstand push to flat-back.", Order: 5},
		{ID: "tech-vt-1-6", CategoryID: "cat-vt", Level: 1, Name: "Controlled Landing", Description: "Absorb impact, stick landing with knees flexed, chest high.", Order: 6},

		// Vault (VT) - Level 2
		{ID: "tech-vt-2-1", CategoryID: "cat-vt", Level: 2, Name: "Starting Position", Description: "Runway check and focus.", Order: 1},
		{ID: "tech-vt-2-2", CategoryID: "cat-vt", Level: 2, Name: "Controlled Run", Description: "High-velocity acceleration runway sprint.", Order: 2},
		{ID: "tech-vt-2-3", CategoryID: "cat-vt", Level: 2, Name: "Hurdle", Description: "Fast hurdle step with quick board punch.", Order: 3},
		{ID: "tech-vt-2-4", CategoryID: "cat-vt", Level: 2, Name: "Board Contact", Description: "Springboard impact transferring horizontal speed to vertical height.", Order: 4},
		{ID: "tech-vt-2-5", CategoryID: "cat-vt", Level: 2, Name: "Hand Contact", Description: "Rapid hand plant on vault table with quick repulsion.", Order: 5},
		{ID: "tech-vt-2-6", CategoryID: "cat-vt", Level: 2, Name: "Handstand Flat-back", Description: "Drive through handstand plane onto mat stack.", Order: 6},
		{ID: "tech-vt-2-7", CategoryID: "cat-vt", Level: 2, Name: "Controlled Landing", Description: "Cushioned stuck landing with zero step.", Order: 7},

		// Vault (VT) - Level 3
		{ID: "tech-vt-3-1", CategoryID: "cat-vt", Level: 3, Name: "Starting Position", Description: "Full distance runway start.", Order: 1},
		{ID: "tech-vt-3-2", CategoryID: "cat-vt", Level: 3, Name: "Controlled Run", Description: "Maximum sprint velocity with optimal approach rhythm.", Order: 2},
		{ID: "tech-vt-3-3", CategoryID: "cat-vt", Level: 3, Name: "Hurdle", Description: "Aggressive hurdle punch into board.", Order: 3},
		{ID: "tech-vt-3-4", CategoryID: "cat-vt", Level: 3, Name: "Board Contact", Description: "Instantaneous rebound off board.", Order: 4},
		{ID: "tech-vt-3-5", CategoryID: "cat-vt", Level: 3, Name: "Hand Contact", Description: "Snap contact on vault table with shoulder extension.", Order: 5},
		{ID: "tech-vt-3-6", CategoryID: "cat-vt", Level: 3, Name: "Block", Description: "Explosive shoulder block sending athlete into high post-flight.", Order: 6},
		{ID: "tech-vt-3-7", CategoryID: "cat-vt", Level: 3, Name: "Flight", Description: "High trajectory second flight phase.", Order: 7},
		{ID: "tech-vt-3-8", CategoryID: "cat-vt", Level: 3, Name: "Handspring Vault", Description: "Complete handspring vault turnover.", Order: 8},
		{ID: "tech-vt-3-9", CategoryID: "cat-vt", Level: 3, Name: "Controlled Landing", Description: "Dead-stick competition landing.", Order: 9},

		// Parallel Bars (PB) - Level 1
		{ID: "tech-pb-1-1", CategoryID: "cat-pb", Level: 1, Name: "Mount from box", Description: "Mount onto bars with spring box assist to straight arm support.", Order: 1},
		{ID: "tech-pb-1-2", CategoryID: "cat-pb", Level: 1, Name: "Tuck Support (Hold 2s)", Description: "Straight arm support with knees tucked tightly for 2 seconds.", Order: 2},
		{ID: "tech-pb-1-3", CategoryID: "cat-pb", Level: 1, Name: "L-Sit (Hold 2s)", Description: "Full straight-leg L-sit hold above bar level for 2 seconds.", Order: 3},
		{ID: "tech-pb-1-4", CategoryID: "cat-pb", Level: 1, Name: "Basic Swing (3 repetitions)", Description: "Three rhythmic support swings forward and backward.", Order: 4},
		{ID: "tech-pb-1-5", CategoryID: "cat-pb", Level: 1, Name: "Controlled Dismount", Description: "Rear swing push-away dismount to clean floor landing.", Order: 5},

		// Parallel Bars (PB) - Level 2
		{ID: "tech-pb-2-1", CategoryID: "cat-pb", Level: 2, Name: "Mount from box", Description: "Clean mount entry to bars.", Order: 1},
		{ID: "tech-pb-2-2", CategoryID: "cat-pb", Level: 2, Name: "Upper Arm Support to Straddle", Description: "From upper arm hang, press up into straddle seat or support.", Order: 2},
		{ID: "tech-pb-2-3", CategoryID: "cat-pb", Level: 2, Name: "L-Sit (Hold 2s)", Description: "Strict L-sit parallel hold with straight knees for 2 seconds.", Order: 3},
		{ID: "tech-pb-2-4", CategoryID: "cat-pb", Level: 2, Name: "Swing to Handstand", Description: "Support swing driving hips up toward vertical handstand line.", Order: 4},
		{ID: "tech-pb-2-5", CategoryID: "cat-pb", Level: 2, Name: "Controlled Dismount", Description: "High lateral swing clearance dismount to stuck landing.", Order: 5},

		// Parallel Bars (PB) - Level 3
		{ID: "tech-pb-3-1", CategoryID: "cat-pb", Level: 3, Name: "Mount without box", Description: "Jump directly to support or glide kip mount without box assistance.", Order: 1},
		{ID: "tech-pb-3-2", CategoryID: "cat-pb", Level: 3, Name: "Kip", Description: "Glide kip from under bars up into straight-arm support.", Order: 2},
		{ID: "tech-pb-3-3", CategoryID: "cat-pb", Level: 3, Name: "L-Sit (Hold 2s)", Description: "Textbook horizontal L-sit hold for 2 seconds.", Order: 3},
		{ID: "tech-pb-3-4", CategoryID: "cat-pb", Level: 3, Name: "Swing to Handstand", Description: "Full swing extension hitting momentary handstand hold.", Order: 4},
		{ID: "tech-pb-3-5", CategoryID: "cat-pb", Level: 3, Name: "Controlled Dismount", Description: "High flank dismount or handstand push dismount with stuck landing.", Order: 5},

		// Horizontal Bar (HB) - Level 1
		{ID: "tech-hb-1-1", CategoryID: "cat-hb", Level: 1, Name: "Safe Mount", Description: "Approach and jump to overhand hang on bar.", Order: 1},
		{ID: "tech-hb-1-2", CategoryID: "cat-hb", Level: 1, Name: "Tuck Hang (Hold 2s)", Description: "Tuck hang with knees to chest for 2 seconds.", Order: 2},
		{ID: "tech-hb-1-3", CategoryID: "cat-hb", Level: 1, Name: "L-Hang (Hold 2s)", Description: "Straight leg L-hang hold for 2 seconds.", Order: 3},
		{ID: "tech-hb-1-4", CategoryID: "cat-hb", Level: 1, Name: "Body Tension", Description: "Hollow body arch-to-hollow tension drill on bar.", Order: 4},
		{ID: "tech-hb-1-5", CategoryID: "cat-hb", Level: 1, Name: "Basic Swing (3 repetitions)", Description: "Three continuous tap swings with good rhythm.", Order: 5},
		{ID: "tech-hb-1-6", CategoryID: "cat-hb", Level: 1, Name: "Controlled Dismount", Description: "Release at rear swing peak into balanced standing landing.", Order: 6},

		// Horizontal Bar (HB) - Level 2
		{ID: "tech-hb-2-1", CategoryID: "cat-hb", Level: 2, Name: "Safe Mount", Description: "High bar jump to overhand grip.", Order: 1},
		{ID: "tech-hb-2-2", CategoryID: "cat-hb", Level: 2, Name: "Tuck Hang (Hold 2s)", Description: "Controlled tuck hang hold for 2 seconds.", Order: 2},
		{ID: "tech-hb-2-3", CategoryID: "cat-hb", Level: 2, Name: "L-Hang (Hold 2s)", Description: "Horizontal 90-degree leg raise hold for 2 seconds.", Order: 3},
		{ID: "tech-hb-2-4", CategoryID: "cat-hb", Level: 2, Name: "Pull Over (Coach assisted)", Description: "Backward circle pull-over around bar into front support.", Order: 4},
		{ID: "tech-hb-2-5", CategoryID: "cat-hb", Level: 2, Name: "Glide to Basic Swing (3x)", Description: "Glide kip swing drill into 3 extended swings.", Order: 5},
		{ID: "tech-hb-2-6", CategoryID: "cat-hb", Level: 2, Name: "Controlled Dismount", Description: "Back swing release to clean landing.", Order: 6},

		// Horizontal Bar (HB) - Level 3
		{ID: "tech-hb-3-1", CategoryID: "cat-hb", Level: 3, Name: "Safe Mount", Description: "Competition bar mount jump.", Order: 1},
		{ID: "tech-hb-3-2", CategoryID: "cat-hb", Level: 3, Name: "Tuck Hang (Hold 2s)", Description: "Active compression tuck hang.", Order: 2},
		{ID: "tech-hb-3-3", CategoryID: "cat-hb", Level: 3, Name: "L-Hang (Hold 2s)", Description: "Strict toes-to-horizon L-hang hold.", Order: 3},
		{ID: "tech-hb-3-4", CategoryID: "cat-hb", Level: 3, Name: "Kip", Description: "Glide kip onto bar into front support.", Order: 4},
		{ID: "tech-hb-3-5", CategoryID: "cat-hb", Level: 3, Name: "Glide to Basic Swing", Description: "Deep glide transition into high swings.", Order: 5},
		{ID: "tech-hb-3-6", CategoryID: "cat-hb", Level: 3, Name: "Swing Forward Turn 180", Description: "Forward swing with 180-degree pirouette turn to reverse grip.", Order: 6},
		{ID: "tech-hb-3-7", CategoryID: "cat-hb", Level: 3, Name: "Controlled Dismount", Description: "High back-swing release dismount to stuck finish.", Order: 7},
	}

	for _, t := range techniques {
		var existing model.Technique
		if err := db.First(&existing, "id = ?", t.ID).Error; err != nil {
			db.Create(&t)
		} else {
			db.Model(&existing).Updates(map[string]interface{}{
				"name":        t.Name,
				"description": t.Description,
				"order":       t.Order,
				"level":       t.Level,
				"category_id": t.CategoryID,
			})
		}
	}
	log.Println("[SEED] All 6 apparatus curriculum technique checklist items synchronized.")
}
