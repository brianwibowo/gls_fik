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
			Name:        "FX (Lantai)",
			Description: "Rangkaian akrobatik lari awalan, variasi salto, tumpuan, keseimbangan, dan stick landing di atas matras pegas.",
			Thumbnail:   "/images/apparatus-floor.webp",
			Order:       1,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "cat-ph",
			Name:        "PH (Jamur / Kuda Pelana)",
			Description: "Putaran melingkar kontinyu double leg circle bertumpu pada kedua tangan di atas alat jamur dan kuda pelana.",
			Thumbnail:   "/images/apparatus-pommel.webp",
			Order:       2,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "cat-sr",
			Name:        "SR (Gelang-Gelang)",
			Description: "Ujian kekuatan statis, posisi hang, inverted hang, inlocate, dan ayunan dinamis tanpa goyangan tali gelang.",
			Thumbnail:   "/images/apparatus-rings.webp",
			Order:       3,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "cat-vt",
			Name:        "Meja Lompat",
			Description: "Akselerasi lari terkontrol, tolakan papan pegas, kontak tangan, dan layangan tolakan pendaratan meja lompat.",
			Thumbnail:   "/images/apparatus-vault.webp",
			Order:       4,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "cat-pb",
			Name:        "Palang Sejajar",
			Description: "Kombinasi naik alat, tuck support, L-sit, ayunan dasar, upper arm support, kip, dan swing to handstand.",
			Thumbnail:   "/images/apparatus-bars.webp",
			Order:       5,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "cat-hb",
			Name:        "Palang Tunggal",
			Description: "Gerakan mount aman, gantungan tuck dan L-hang, ayunan dasar, pull over, kip, putaran 180 derajat, dan dismount.",
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
		// 1. FX (Lantai)
		{
			ID:          "vid-fx-1",
			CategoryID:  "cat-fx",
			Title:       "FX (Lantai) - Level 1",
			Description: "Kurikulum Level 1:\n• Starting Position\n• Single Leg Balance – tahan 2 detik\n• Forward Roll\n• Handstand – tahan 2 detik\n• Cartwheel\n• Bridge – tahan 2 detik\n• Backward Roll\n• Standing Finish",
			DriveFileID: "12JG_YaH6ADE4xVqgskKQY-rx79Dht7KM",
			DriveLink:   "https://drive.google.com/file/d/12JG_YaH6ADE4xVqgskKQY-rx79Dht7KM/view?usp=share_link",
			Thumbnail:   "/images/apparatus-floor.webp",
			Duration:    "03:45",
			Level:       "Level 1",
			EpisodeNum:  1,
			IsFree:      true,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "vid-fx-2",
			CategoryID:  "cat-fx",
			Title:       "FX (Lantai) - Level 2",
			Description: "Kurikulum Level 2:\n• Starting Position\n• Single Leg Balance – 2 detik\n• Forward Roll\n• Handstand – 2 detik\n• Cartwheel\n• Bridge\n• Backward to Handstand\n• Round-off\n• Tiger Jump\n• Standing Finish",
			DriveFileID: "10pPKxlH8e6GKSI79bTbiCQ7d_YQP3xkD",
			DriveLink:   "https://drive.google.com/file/d/10pPKxlH8e6GKSI79bTbiCQ7d_YQP3xkD/view?usp=share_link",
			Thumbnail:   "/images/apparatus-floor.webp",
			Duration:    "04:12",
			Level:       "Level 2",
			EpisodeNum:  2,
			IsFree:      false,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "vid-fx-3",
			CategoryID:  "cat-fx",
			Title:       "FX (Lantai) - Level 3",
			Description: "Kurikulum Level 3:\n• Starting Position\n• Single Leg Balance\n• Handstand\n• Cartwheel\n• Backward Roll to Handstand\n• Press Handstand\n• Tiger Jump\n• Round-off\n• Back Handspring\n• Standing Finish",
			DriveFileID: "1saHh0xfJRT3tuIKyByGCbAzsMnoa2HXI",
			DriveLink:   "https://drive.google.com/file/d/1saHh0xfJRT3tuIKyByGCbAzsMnoa2HXI/view?usp=share_link",
			Thumbnail:   "/images/apparatus-floor.webp",
			Duration:    "05:08",
			Level:       "Level 3",
			EpisodeNum:  3,
			IsFree:      false,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		// 2. PH (Jamur / Kuda Pelana)
		{
			ID:          "vid-ph-1",
			CategoryID:  "cat-ph",
			Title:       "PH (Jamur / Kuda Pelana) - Level 1",
			Description: "Kurikulum Level 1:\n• Starting Position\n• Double leg circle – 5 kali (Dilakukan 1 kali sirkel dan diulangi sebanyak 5 kali)\n• Standing Finish",
			DriveFileID: "1bWbwPWd0GQ_AiX9i4tQ-kFpBKX1mEiLv",
			DriveLink:   "https://drive.google.com/file/d/1bWbwPWd0GQ_AiX9i4tQ-kFpBKX1mEiLv/view?usp=share_link",
			Thumbnail:   "/images/apparatus-pommel.webp",
			Duration:    "03:30",
			Level:       "Level 1",
			EpisodeNum:  1,
			IsFree:      true,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "vid-ph-2",
			CategoryID:  "cat-ph",
			Title:       "PH (Jamur / Kuda Pelana) - Level 2",
			Description: "Kurikulum Level 2:\n• Starting Position\n• Double leg circle – 5 kali dilakukan secara langsung\n• Standing Finish",
			DriveFileID: "1V2mwHNlh2jbpzQz6XwFSvr_OOKb-Hsxk",
			DriveLink:   "https://drive.google.com/file/d/1V2mwHNlh2jbpzQz6XwFSvr_OOKb-Hsxk/view?usp=share_link",
			Thumbnail:   "/images/apparatus-pommel.webp",
			Duration:    "04:45",
			Level:       "Level 2",
			EpisodeNum:  2,
			IsFree:      false,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "vid-ph-3",
			CategoryID:  "cat-ph",
			Title:       "PH (Jamur / Kuda Pelana) - Level 3",
			Description: "Kurikulum Level 3:\n• Starting Position\n• Double leg circle – 10 kali dilakukan secara langsung\n• Standing Finish",
			DriveFileID: "1OSxlH3hgtuHZ4j25LihLlaKqZtZ5nBq4",
			DriveLink:   "https://drive.google.com/file/d/1OSxlH3hgtuHZ4j25LihLlaKqZtZ5nBq4/view?usp=share_link",
			Thumbnail:   "/images/apparatus-pommel.webp",
			Duration:    "04:15",
			Level:       "Level 3",
			EpisodeNum:  3,
			IsFree:      false,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		// 3. SR (Gelang-Gelang)
		{
			ID:          "vid-sr-1",
			CategoryID:  "cat-sr",
			Title:       "SR (Gelang-Gelang) - Level 1",
			Description: "Kurikulum Level 1:\n• Hang Position\n• Tuck Hang\n• L-Sit Preparation\n• Pike Position\n• Swing Forward–Backward\n• Dismount (Straight Jump)",
			DriveFileID: "1jQ5WvB3Xc0CNCBqv_remyZ70VFkB6qhJ",
			DriveLink:   "https://drive.google.com/file/d/1jQ5WvB3Xc0CNCBqv_remyZ70VFkB6qhJ/view?usp=share_link",
			Thumbnail:   "/images/apparatus-rings.webp",
			Duration:    "03:50",
			Level:       "Level 1",
			EpisodeNum:  1,
			IsFree:      true,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "vid-sr-2",
			CategoryID:  "cat-sr",
			Title:       "SR (Gelang-Gelang) - Level 2",
			Description: "Kurikulum Level 2:\n• Hang Position\n• Tuck Hang\n• L-Sit Preparation\n• Inverted Hang\n• Inlocate\n• Swing Forward–Backward\n• Dismount (Straight Jump)",
			DriveFileID: "1ZEnFVQLnIVuIvNBIVC6H1KruGF-j5nfq",
			DriveLink:   "https://drive.google.com/file/d/1ZEnFVQLnIVuIvNBIVC6H1KruGF-j5nfq/view?usp=share_link",
			Thumbnail:   "/images/apparatus-rings.webp",
			Duration:    "05:10",
			Level:       "Level 2",
			EpisodeNum:  2,
			IsFree:      false,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "vid-sr-3",
			CategoryID:  "cat-sr",
			Title:       "SR (Gelang-Gelang) - Level 3",
			Description: "Kurikulum Level 3:\n• Hang Position\n• Tuck Hang\n• Support Hold (Assistant by coach)\n• L-Sit Preparation\n• Inverted Hang\n• Inlocate\n• Swing Forward–Backward\n• Dismount (Straight Jump)",
			DriveFileID: "1SgYz3kwxfeKpJTHhCIBae9zVHbhmWl0D",
			DriveLink:   "https://drive.google.com/file/d/1SgYz3kwxfeKpJTHhCIBae9zVHbhmWl0D/view?usp=share_link",
			Thumbnail:   "/images/apparatus-rings.webp",
			Duration:    "04:55",
			Level:       "Level 3",
			EpisodeNum:  3,
			IsFree:      false,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		// 4. Meja Lompat
		{
			ID:          "vid-vt-1",
			CategoryID:  "cat-vt",
			Title:       "Meja Lompat - Level 1",
			Description: "Kurikulum Level 1:\nSkill 1:\n• Starting Position\n• Controlled Run\n• Hurdle\n• Two-foot Take-off\n• Jump to Mat\n• Controlled Landing\n\nSkill 2:\n• Handstand to Flat Back",
			DriveFileID: "1jBhnPPDZb_l21NPCsCZh_DBymNo8sy-x",
			DriveLink:   "https://drive.google.com/file/d/1jBhnPPDZb_l21NPCsCZh_DBymNo8sy-x/view?usp=share_link",
			Thumbnail:   "/images/apparatus-vault.webp",
			Duration:    "03:15",
			Level:       "Level 1",
			EpisodeNum:  1,
			IsFree:      true,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "vid-vt-2",
			CategoryID:  "cat-vt",
			Title:       "Meja Lompat - Level 2",
			Description: "Kurikulum Level 2:\nSkill 1:\n• Starting Position\n• Controlled Run\n• Hurdle\n• Board Contact\n• Hand Contact\n• Handstand Flat-back\n• Controlled Landing",
			DriveFileID: "1AQSqHJtOuUbcGDtsESAolbdJJggOwQog",
			DriveLink:   "https://drive.google.com/file/d/1AQSqHJtOuUbcGDtsESAolbdJJggOwQog/view?usp=share_link",
			Thumbnail:   "/images/apparatus-vault.webp",
			Duration:    "04:05",
			Level:       "Level 2",
			EpisodeNum:  2,
			IsFree:      false,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "vid-vt-3",
			CategoryID:  "cat-vt",
			Title:       "Meja Lompat - Level 3",
			Description: "Kurikulum Level 3:\nSkill 1:\n• Starting Position\n• Controlled Run\n• Hurdle\n• Board Contact\n• Hand Contact\n• Block\n• Flight\n• Handspring Vault\n• Controlled Landing",
			DriveFileID: "1OXqNUWjXE9UTn9kJ6qiaO92GqID00Q88",
			DriveLink:   "https://drive.google.com/file/d/1OXqNUWjXE9UTn9kJ6qiaO92GqID00Q88/view?usp=share_link",
			Thumbnail:   "/images/apparatus-vault.webp",
			Duration:    "05:20",
			Level:       "Level 3",
			EpisodeNum:  3,
			IsFree:      false,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		// 5. Palang Sejajar
		{
			ID:          "vid-pb-1",
			CategoryID:  "cat-pb",
			Title:       "Palang Sejajar - Level 1",
			Description: "Kurikulum Level 1:\n• Mount from box\n• Tuck Support – 2 sec\n• L sit – 2 sec\n• Basic Swing – 3 kali\n• Controlled Dismount",
			DriveFileID: "1FvXTZ4MqmqljRd4755-ypHuelNVELBg_",
			DriveLink:   "https://drive.google.com/file/d/1FvXTZ4MqmqljRd4755-ypHuelNVELBg_/view?usp=share_link",
			Thumbnail:   "/images/apparatus-bars.webp",
			Duration:    "04:00",
			Level:       "Level 1",
			EpisodeNum:  1,
			IsFree:      true,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "vid-pb-2",
			CategoryID:  "cat-pb",
			Title:       "Palang Sejajar - Level 2",
			Description: "Kurikulum Level 2:\n• Mount from box\n• From upper arm support to straddle\n• L sit – 2 sec\n• Swing to handstand\n• Controlled Dismount",
			DriveFileID: "1YNXqIPZmhA_AQzV-ALGDyZK0K4oBXPR2",
			DriveLink:   "https://drive.google.com/file/d/1YNXqIPZmhA_AQzV-ALGDyZK0K4oBXPR2/view?usp=share_link",
			Thumbnail:   "/images/apparatus-bars.webp",
			Duration:    "04:50",
			Level:       "Level 2",
			EpisodeNum:  2,
			IsFree:      false,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "vid-pb-3",
			CategoryID:  "cat-pb",
			Title:       "Palang Sejajar - Level 3",
			Description: "Kurikulum Level 3:\n• Mount without box\n• Kip\n• L-Sit – 2 sec\n• Swing to handstand\n• Controlled Dismount",
			DriveFileID: "1QMNvrTb2fqRn8vOZ5vTebeCNQUrL0x0v",
			DriveLink:   "https://drive.google.com/file/d/1QMNvrTb2fqRn8vOZ5vTebeCNQUrL0x0v/view?usp=share_link",
			Thumbnail:   "/images/apparatus-bars.webp",
			Duration:    "05:35",
			Level:       "Level 3",
			EpisodeNum:  3,
			IsFree:      false,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		// 6. Palang Tunggal
		{
			ID:          "vid-hb-1",
			CategoryID:  "cat-hb",
			Title:       "Palang Tunggal - Level 1",
			Description: "Kurikulum Level 1:\n• Safe Mount\n• Tuck Hang – 2 sec\n• L Hang – 2 sec\n• Body Tension\n• Basic Swing – 3x\n• Controlled Dismount",
			DriveFileID: "18pOQa_V3FKDNSSkiWMNzfdxxvgry9izS",
			DriveLink:   "https://drive.google.com/file/d/18pOQa_V3FKDNSSkiWMNzfdxxvgry9izS/view?usp=share_link",
			Thumbnail:   "/images/apparatus-highbar.jpg",
			Duration:    "03:40",
			Level:       "Level 1",
			EpisodeNum:  1,
			IsFree:      true,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "vid-hb-2",
			CategoryID:  "cat-hb",
			Title:       "Palang Tunggal - Level 2",
			Description: "Kurikulum Level 2:\n• Safe Mount\n• Tuck Hang – 2 detik\n• L Hang – 2 detik\n• Pull over – Assistant by coach\n• Glide to basic swing – 3x\n• Controlled Dismount",
			DriveFileID: "1BANvdbvr-0UVVoVoLqJN0Hy3MqEW69fQ",
			DriveLink:   "https://drive.google.com/file/d/1BANvdbvr-0UVVoVoLqJN0Hy3MqEW69fQ/view?usp=share_link",
			Thumbnail:   "/images/apparatus-highbar.jpg",
			Duration:    "05:05",
			Level:       "Level 2",
			EpisodeNum:  2,
			IsFree:      false,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "vid-hb-3",
			CategoryID:  "cat-hb",
			Title:       "Palang Tunggal - Level 3",
			Description: "Kurikulum Level 3:\n• Safe Mount\n• Tuck Hang – 2 detik\n• L Hang – 2 detik\n• Kip\n• Glide to basic swing\n• Swing Forward turn 180\n• Controlled Dismount",
			DriveFileID: "1SXsHg1lSSP184HLB5BcrI9ux34VMhgVb",
			DriveLink:   "https://drive.google.com/file/d/1SXsHg1lSSP184HLB5BcrI9ux34VMhgVb/view?usp=share_link",
			Thumbnail:   "/images/apparatus-highbar.jpg",
			Duration:    "04:40",
			Level:       "Level 3",
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
		{ID: "tech-fx-1-1", CategoryID: "cat-fx", Level: 1, Name: "Starting Position", Description: "Posisi berdiri tegak siap, pandangan fokus dan kedua lengan disajikan percaya diri.", Order: 1},
		{ID: "tech-fx-1-2", CategoryID: "cat-fx", Level: 1, Name: "Single Leg Balance – tahan 2 detik", Description: "Keseimbangan satu kaki tegak dengan dada tegap dan core stabil minimal 2 detik.", Order: 2},
		{ID: "tech-fx-1-3", CategoryID: "cat-fx", Level: 1, Name: "Forward Roll", Description: "Guling ke depan terkontrol posisi tuck tanpa bantuan tangan mendorong matras saat berdiri.", Order: 3},
		{ID: "tech-fx-1-4", CategoryID: "cat-fx", Level: 1, Name: "Handstand – tahan 2 detik", Description: "Kaki diangkat ke posisi handstand vertikal, bukaan bahu penuh, tahan selama 2 detik.", Order: 4},
		{ID: "tech-fx-1-5", CategoryID: "cat-fx", Level: 1, Name: "Cartwheel", Description: "Meroda lurus tangan-tangan-kaki-kaki secara ritmis dengan kaki terentang lurus.", Order: 5},
		{ID: "tech-fx-1-6", CategoryID: "cat-fx", Level: 1, Name: "Bridge – tahan 2 detik", Description: "Posisi kayang melengkung dari posisi tidur dengan bahu dibuka di atas pergelangan tangan selama 2 detik.", Order: 6},
		{ID: "tech-fx-1-7", CategoryID: "cat-fx", Level: 1, Name: "Backward Roll", Description: "Guling ke belakang melipat lutut ke dada, melindungi leher, dan mendarat di atas kedua telapak kaki.", Order: 7},
		{ID: "tech-fx-1-8", CategoryID: "cat-fx", Level: 1, Name: "Standing Finish", Description: "Selesai berdiri tegak seimbang dengan kedua lengan terangkat lurus memberi hormat.", Order: 8},

		// Floor Exercise (FX) - Level 2
		{ID: "tech-fx-2-1", CategoryID: "cat-fx", Level: 2, Name: "Starting Position", Description: "Posisi awal siap resmi di sudut matras senam lantai.", Order: 1},
		{ID: "tech-fx-2-2", CategoryID: "cat-fx", Level: 2, Name: "Single Leg Balance – 2 detik", Description: "Keseimbangan satu kaki terangkat lurus dengan kestabilan penuh selama 2 detik.", Order: 2},
		{ID: "tech-fx-2-3", CategoryID: "cat-fx", Level: 2, Name: "Forward Roll", Description: "Guling depan cepat dan langsung bangkit berdiri tegak lurus.", Order: 3},
		{ID: "tech-fx-2-4", CategoryID: "cat-fx", Level: 2, Name: "Handstand – 2 detik", Description: "Handstand vertikal garis lurus dengan ujung jari kaki pointed selama 2 detik.", Order: 4},
		{ID: "tech-fx-2-5", CategoryID: "cat-fx", Level: 2, Name: "Cartwheel", Description: "Meroda bertenaga di sepanjang garis lurus dengan pendaratan bersih.", Order: 5},
		{ID: "tech-fx-2-6", CategoryID: "cat-fx", Level: 2, Name: "Bridge", Description: "Dorongan kayang cepat dengan kelenturan bahu dan punggung.", Order: 6},
		{ID: "tech-fx-2-7", CategoryID: "cat-fx", Level: 2, Name: "Backward to Handstand", Description: "Guling belakang mendorong lurus ke atas menuju posisi handstand.", Order: 7},
		{ID: "tech-fx-2-8", CategoryID: "cat-fx", Level: 2, Name: "Round-off", Description: "Lompatan hurdle, entri tangan berputar, dan tolakan dua kaki berbalik arah.", Order: 8},
		{ID: "tech-fx-2-9", CategoryID: "cat-fx", Level: 2, Name: "Tiger Jump", Description: "Lompatan harimau (dive roll) dengan fase layangan di udara sebelum berguling.", Order: 9},
		{ID: "tech-fx-2-10", CategoryID: "cat-fx", Level: 2, Name: "Standing Finish", Description: "Pendaratan terkontrol dan pose berdiri sempurna.", Order: 10},

		// Floor Exercise (FX) - Level 3
		{ID: "tech-fx-3-1", CategoryID: "cat-fx", Level: 3, Name: "Starting Position", Description: "Posisi awal kompetisi di sudut matras lantai.", Order: 1},
		{ID: "tech-fx-3-2", CategoryID: "cat-fx", Level: 3, Name: "Single Leg Balance", Description: "Keseimbangan arabesque / scale satu kaki dengan ekstensi tinggi.", Order: 2},
		{ID: "tech-fx-3-3", CategoryID: "cat-fx", Level: 3, Name: "Handstand", Description: "Handstand sempurna menunjukkan penguasaan keseimbangan penuh.", Order: 3},
		{ID: "tech-fx-3-4", CategoryID: "cat-fx", Level: 3, Name: "Cartwheel", Description: "Meroda bertenaga dan bersih setara standar kompetisi.", Order: 4},
		{ID: "tech-fx-3-5", CategoryID: "cat-fx", Level: 3, Name: "Backward Roll to Handstand", Description: "Guling ke belakang dengan lengan lurus langsung menembus handstand vertikal.", Order: 5},
		{ID: "tech-fx-3-6", CategoryID: "cat-fx", Level: 3, Name: "Press Handstand", Description: "Press to handstand mengangkat beban tubuh dari lantai secara bertahap tanpa loncatan.", Order: 6},
		{ID: "tech-fx-3-7", CategoryID: "cat-fx", Level: 3, Name: "Tiger Jump", Description: "Tiger jump tinggi dengan fase layangan lebar sebelum roll halus.", Order: 7},
		{ID: "tech-fx-3-8", CategoryID: "cat-fx", Level: 3, Name: "Round-off", Description: "Round-off kecepatan tinggi menghasilkan tolakan vertikal maksimal.", Order: 8},
		{ID: "tech-fx-3-9", CategoryID: "cat-fx", Level: 3, Name: "Back Handspring", Description: "Flic-flac salto belakang memantul cepat dari kedua tangan ke kaki.", Order: 9},
		{ID: "tech-fx-3-10", CategoryID: "cat-fx", Level: 3, Name: "Standing Finish", Description: "Pendaratan mati tanpa geser (stick landing) dan salam penutup.", Order: 10},

		// Pommel Horse (PH) - Level 1
		{ID: "tech-ph-1-1", CategoryID: "cat-ph", Level: 1, Name: "Starting Position", Description: "Pegang alat jamur dengan kedua tangan, tubuh lurus dan core terkunci.", Order: 1},
		{ID: "tech-ph-1-2", CategoryID: "cat-ph", Level: 1, Name: "Double leg circle – 5 kali (Dilakukan 1 kali sirkel dan diulangi sebanyak 5 kali)", Description: "Putaran lingkaran dua kaki pada jamur dilakukan satu putaran lalu diulangi hingga 5 kali.", Order: 2},
		{ID: "tech-ph-1-3", CategoryID: "cat-ph", Level: 1, Name: "Standing Finish", Description: "Langkah turun terkontrol dan berdiri tegak seimbang.", Order: 3},

		// Pommel Horse (PH) - Level 2
		{ID: "tech-ph-2-1", CategoryID: "cat-ph", Level: 2, Name: "Starting Position", Description: "Posisi siap pegang alat jamur/kuda pelana.", Order: 1},
		{ID: "tech-ph-2-2", CategoryID: "cat-ph", Level: 2, Name: "Double leg circle – 5 kali dilakukan secara langsung", Description: "Putaran lingkaran dua kaki sebanyak 5 kali berturut-turut tanpa jeda/berhenti.", Order: 2},
		{ID: "tech-ph-2-3", CategoryID: "cat-ph", Level: 2, Name: "Standing Finish", Description: "Dismount ayunan turun ke posisi berdiri tegak rapi.", Order: 3},

		// Pommel Horse (PH) - Level 3
		{ID: "tech-ph-3-1", CategoryID: "cat-ph", Level: 3, Name: "Starting Position", Description: "Posisi awal siap pada kuda pelana / jamur.", Order: 1},
		{ID: "tech-ph-3-2", CategoryID: "cat-ph", Level: 3, Name: "Double leg circle – 10 kali dilakukan secara langsung", Description: "Putaran lingkaran dua kaki sebanyak 10 kali langsung tanpa henti dengan amplitude penuh.", Order: 2},
		{ID: "tech-ph-3-3", CategoryID: "cat-ph", Level: 3, Name: "Standing Finish", Description: "Dismount ayunan tinggi dan pendaratan kokoh.", Order: 3},

		// Still Rings (SR) - Level 1
		{ID: "tech-sr-1-1", CategoryID: "cat-sr", Level: 1, Name: "Hang Position", Description: "Gantungan lengan lurus vertikal dengan cengkeraman netral dan tali stabil.", Order: 1},
		{ID: "tech-sr-1-2", CategoryID: "cat-sr", Level: 1, Name: "Tuck Hang", Description: "Menggantung dengan kedua lutut ditekuk rapat ke arah dada.", Order: 2},
		{ID: "tech-sr-1-3", CategoryID: "cat-sr", Level: 1, Name: "L-Sit Preparation", Description: "Persiapan angkat kaki horizontal atau variasi tuck dengan core aktif.", Order: 3},
		{ID: "tech-sr-1-4", CategoryID: "cat-sr", Level: 1, Name: "Pike Position", Description: "Gantungan tubuh membungkuk (pike) dengan lutut lurus terkunci.", Order: 4},
		{ID: "tech-sr-1-5", CategoryID: "cat-sr", Level: 1, Name: "Swing Forward–Backward", Description: "Ayunan pendulum ke depan dan ke belakang secara berirama dan stabil.", Order: 5},
		{ID: "tech-sr-1-6", CategoryID: "cat-sr", Level: 1, Name: "Dismount (Straight Jump)", Description: "Lepas ayunan di puncak belakang dan mendarat lurus di atas matras.", Order: 6},

		// Still Rings (SR) - Level 2
		{ID: "tech-sr-2-1", CategoryID: "cat-sr", Level: 2, Name: "Hang Position", Description: "Gantungan lurus bersih dengan stabilitas bahu.", Order: 1},
		{ID: "tech-sr-2-2", CategoryID: "cat-sr", Level: 2, Name: "Tuck Hang", Description: "Gantungan tuck lutut ke dada dengan kontrol.", Order: 2},
		{ID: "tech-sr-2-3", CategoryID: "cat-sr", Level: 2, Name: "L-Sit Preparation", Description: "Posisi L-hang membentuk sudut 90 derajat dengan kaki lurus.", Order: 3},
		{ID: "tech-sr-2-4", CategoryID: "cat-sr", Level: 2, Name: "Inverted Hang", Description: "Rotasi menggantung terbalik dengan tubuh vertikal menghadap ke bawah.", Order: 4},
		{ID: "tech-sr-2-5", CategoryID: "cat-sr", Level: 2, Name: "Inlocate", Description: "Putaran bahu ke dalam dari posisi inverted hang menuju gantungan belakang.", Order: 5},
		{ID: "tech-sr-2-6", CategoryID: "cat-sr", Level: 2, Name: "Swing Forward–Backward", Description: "Ayunan dinamis depan-belakang dengan amplitude yang lebih tinggi.", Order: 6},
		{ID: "tech-sr-2-7", CategoryID: "cat-sr", Level: 2, Name: "Dismount (Straight Jump)", Description: "Dismount lompat lurus di puncak ayunan belakang dengan pendaratan tenang.", Order: 7},

		// Still Rings (SR) - Level 3
		{ID: "tech-sr-3-1", CategoryID: "cat-sr", Level: 3, Name: "Hang Position", Description: "Posisi gantungan awal yang kokoh.", Order: 1},
		{ID: "tech-sr-3-2", CategoryID: "cat-sr", Level: 3, Name: "Tuck Hang", Description: "Tuck hang kompresi tinggi.", Order: 2},
		{ID: "tech-sr-3-3", CategoryID: "cat-sr", Level: 3, Name: "Support Hold (Assistant by coach)", Description: "Tumpuan lengan lurus di atas gelang dengan bantuan pelatih dan gelang turn-out.", Order: 3},
		{ID: "tech-sr-3-4", CategoryID: "cat-sr", Level: 3, Name: "L-Sit Preparation", Description: "L-sit support hold di atas gelang-gelang.", Order: 4},
		{ID: "tech-sr-3-5", CategoryID: "cat-sr", Level: 3, Name: "Inverted Hang", Description: "Inverted hang stabil dengan pinggul lurus.", Order: 5},
		{ID: "tech-sr-3-6", CategoryID: "cat-sr", Level: 3, Name: "Inlocate", Description: "Inlocate dinamis melalui bidang horizontal secara mulus.", Order: 6},
		{ID: "tech-sr-3-7", CategoryID: "cat-sr", Level: 3, Name: "Swing Forward–Backward", Description: "Ayunan bertenaga tinggi dengan siku terkunci lurus.", Order: 7},
		{ID: "tech-sr-3-8", CategoryID: "cat-sr", Level: 3, Name: "Dismount (Straight Jump)", Description: "Pelepasan dismount ayunan tinggi dan stick landing mantap.", Order: 8},

		// Vault (VT) - Level 1
		{ID: "tech-vt-1-1", CategoryID: "cat-vt", Level: 1, Name: "Starting Position", Description: "Posisi berdiri siap di awal lintasan lari awalan (runway).", Order: 1},
		{ID: "tech-vt-1-2", CategoryID: "cat-vt", Level: 1, Name: "Controlled Run", Description: "Lari awalan akselerasi terkontrol menjaga ritme langkah teratur.", Order: 2},
		{ID: "tech-vt-1-3", CategoryID: "cat-vt", Level: 1, Name: "Hurdle", Description: "Lompatan hurdle pendek bertenaga menuju papan pegas (springboard).", Order: 3},
		{ID: "tech-vt-1-4", CategoryID: "cat-vt", Level: 1, Name: "Two-foot Take-off", Description: "Hantaman serentak dua telapak kaki di papan pegas menghasilkan tolakan vertikal.", Order: 4},
		{ID: "tech-vt-1-5", CategoryID: "cat-vt", Level: 1, Name: "Jump to Mat", Description: "Lompatan eksplosif ke atas tumpukan matras pendaratan.", Order: 5},
		{ID: "tech-vt-1-6", CategoryID: "cat-vt", Level: 1, Name: "Handstand to Flat Back", Description: "Dorongan handstand ke punggung rata di atas matras (Skill 2).", Order: 6},
		{ID: "tech-vt-1-7", CategoryID: "cat-vt", Level: 1, Name: "Controlled Landing", Description: "Meredam hentakan pendaratan dengan lutut fleksibel dan dada tegap.", Order: 7},

		// Vault (VT) - Level 2
		{ID: "tech-vt-2-1", CategoryID: "cat-vt", Level: 2, Name: "Starting Position", Description: "Pengecekan jarak awalan dan fokus di garis start.", Order: 1},
		{ID: "tech-vt-2-2", CategoryID: "cat-vt", Level: 2, Name: "Controlled Run", Description: "Lari awalan sprint cepat berkecepatan tinggi.", Order: 2},
		{ID: "tech-vt-2-3", CategoryID: "cat-vt", Level: 2, Name: "Hurdle", Description: "Langkah hurdle cepat menghujam papan pegas.", Order: 3},
		{ID: "tech-vt-2-4", CategoryID: "cat-vt", Level: 2, Name: "Board Contact", Description: "Hantaman papan pegas mengubah kecepatan horizontal menjadi daya lontar ke atas.", Order: 4},
		{ID: "tech-vt-2-5", CategoryID: "cat-vt", Level: 2, Name: "Hand Contact", Description: "Kontak telapak tangan cepat dan kuat pada meja lompat.", Order: 5},
		{ID: "tech-vt-2-6", CategoryID: "cat-vt", Level: 2, Name: "Handstand Flat-back", Description: "Melewati bidang handstand dan mendarat punggung rata di matras tinggi.", Order: 6},
		{ID: "tech-vt-2-7", CategoryID: "cat-vt", Level: 2, Name: "Controlled Landing", Description: "Pendaratan teredam aman tanpa melangkah.", Order: 7},

		// Vault (VT) - Level 3
		{ID: "tech-vt-3-1", CategoryID: "cat-vt", Level: 3, Name: "Starting Position", Description: "Posisi awal awalan lari kompetisi jarak penuh.", Order: 1},
		{ID: "tech-vt-3-2", CategoryID: "cat-vt", Level: 3, Name: "Controlled Run", Description: "Sprint kecepatan maksimal dengan ritme optimal menjelang papan.", Order: 2},
		{ID: "tech-vt-3-3", CategoryID: "cat-vt", Level: 3, Name: "Hurdle", Description: "Hurdle agresif menginjak papan pantul.", Order: 3},
		{ID: "tech-vt-3-4", CategoryID: "cat-vt", Level: 3, Name: "Board Contact", Description: "Rebound instan dari papan pegas.", Order: 4},
		{ID: "tech-vt-3-5", CategoryID: "cat-vt", Level: 3, Name: "Hand Contact", Description: "Sentuhan tangan kilat pada meja lompat dengan bahu terentang.", Order: 5},
		{ID: "tech-vt-3-6", CategoryID: "cat-vt", Level: 3, Name: "Block", Description: "Tolakan bahu eksplosif (blocking) melontarkan tubuh ke fase terbang tinggi.", Order: 6},
		{ID: "tech-vt-3-7", CategoryID: "cat-vt", Level: 3, Name: "Flight", Description: "Fase layangan kedua di udara dengan lintasan tinggi.", Order: 7},
		{ID: "tech-vt-3-8", CategoryID: "cat-vt", Level: 3, Name: "Handspring Vault", Description: "Putaran penuh handspring di atas meja lompat.", Order: 8},
		{ID: "tech-vt-3-9", CategoryID: "cat-vt", Level: 3, Name: "Controlled Landing", Description: "Pendaratan mati tanpa geser kaki (stick landing).", Order: 9},

		// Parallel Bars (PB) - Level 1
		{ID: "tech-pb-1-1", CategoryID: "cat-pb", Level: 1, Name: "Mount from box", Description: "Naik ke atas palang bantuan boks lompat ke tumpuan lengan lurus.", Order: 1},
		{ID: "tech-pb-1-2", CategoryID: "cat-pb", Level: 1, Name: "Tuck Support – 2 sec", Description: "Tumpuan lengan lurus dengan kedua lutut ditekuk rapat selama 2 detik.", Order: 2},
		{ID: "tech-pb-1-3", CategoryID: "cat-pb", Level: 1, Name: "L sit – 2 sec", Description: "Tumpuan duduk L dengan kaki lurus di atas palang selama 2 detik.", Order: 3},
		{ID: "tech-pb-1-4", CategoryID: "cat-pb", Level: 1, Name: "Basic Swing – 3 kali", Description: "Tiga kali ayunan tumpuan dasar ke depan dan belakang secara ritmis.", Order: 4},
		{ID: "tech-pb-1-5", CategoryID: "cat-pb", Level: 1, Name: "Controlled Dismount", Description: "Dismount dorongan ayunan belakang turun ke pendaratan bersih di lantai.", Order: 5},

		// Parallel Bars (PB) - Level 2
		{ID: "tech-pb-2-1", CategoryID: "cat-pb", Level: 2, Name: "Mount from box", Description: "Naik ke palang bantuan boks lompat dengan bersih.", Order: 1},
		{ID: "tech-pb-2-2", CategoryID: "cat-pb", Level: 2, Name: "From upper arm support to straddle", Description: "Dari tumpuan lengan atas menekan naik ke posisi straddle / tumpuan.", Order: 2},
		{ID: "tech-pb-2-3", CategoryID: "cat-pb", Level: 2, Name: "L sit – 2 sec", Description: "Tumpuan L-sit horizontal presisi dengan lutut lurus selama 2 detik.", Order: 3},
		{ID: "tech-pb-2-4", CategoryID: "cat-pb", Level: 2, Name: "Swing to handstand", Description: "Ayunan tumpuan mendorong pinggul naik menuju garis handstand vertikal.", Order: 4},
		{ID: "tech-pb-2-5", CategoryID: "cat-pb", Level: 2, Name: "Controlled Dismount", Description: "Dismount ayunan samping melintasi palang dengan pendaratan stabil.", Order: 5},

		// Parallel Bars (PB) - Level 3
		{ID: "tech-pb-3-1", CategoryID: "cat-pb", Level: 3, Name: "Mount without box", Description: "Lompat langsung naik ke tumpuan palang secara mandiri tanpa boks bantuan.", Order: 1},
		{ID: "tech-pb-3-2", CategoryID: "cat-pb", Level: 3, Name: "Kip", Description: "Gerakan kip luncuran dari bawah palang naik ke tumpuan lengan lurus.", Order: 2},
		{ID: "tech-pb-3-3", CategoryID: "cat-pb", Level: 3, Name: "L-Sit – 2 sec", Description: "Tumpuan L-sit horizontal sempurna selama 2 detik.", Order: 3},
		{ID: "tech-pb-3-4", CategoryID: "cat-pb", Level: 3, Name: "Swing to handstand", Description: "Ayunan ekstensi penuh mencapai posisi handstand sejenak.", Order: 4},
		{ID: "tech-pb-3-5", CategoryID: "cat-pb", Level: 3, Name: "Controlled Dismount", Description: "Dismount ayunan tinggi flank / handstand push dengan stick landing.", Order: 5},

		// Horizontal Bar (HB) - Level 1
		{ID: "tech-hb-1-1", CategoryID: "cat-hb", Level: 1, Name: "Safe Mount", Description: "Awalan pendekatan dan lompat ke gantungan pegangan atas pada palang.", Order: 1},
		{ID: "tech-hb-1-2", CategoryID: "cat-hb", Level: 1, Name: "Tuck Hang – 2 sec", Description: "Menggantung posisi tuck lutut ke dada selama 2 detik.", Order: 2},
		{ID: "tech-hb-1-3", CategoryID: "cat-hb", Level: 1, Name: "L Hang – 2 sec", Description: "Gantungan L-hang kaki lurus 90 derajat selama 2 detik.", Order: 3},
		{ID: "tech-hb-1-4", CategoryID: "cat-hb", Level: 1, Name: "Body Tension", Description: "Latihan ketegangan tubuh hollow-to-arch pada palang.", Order: 4},
		{ID: "tech-hb-1-5", CategoryID: "cat-hb", Level: 1, Name: "Basic Swing – 3x", Description: "Tiga kali ayunan berulang dengan ritme yang baik.", Order: 5},
		{ID: "tech-hb-1-6", CategoryID: "cat-hb", Level: 1, Name: "Controlled Dismount", Description: "Lepas di puncak ayunan belakang menuju pendaratan berdiri seimbang.", Order: 6},

		// Horizontal Bar (HB) - Level 2
		{ID: "tech-hb-2-1", CategoryID: "cat-hb", Level: 2, Name: "Safe Mount", Description: "Lompat naik ke palang dengan cengkeraman atas yang aman.", Order: 1},
		{ID: "tech-hb-2-2", CategoryID: "cat-hb", Level: 2, Name: "Tuck Hang – 2 detik", Description: "Gantungan tuck terkontrol selama 2 detik.", Order: 2},
		{ID: "tech-hb-2-3", CategoryID: "cat-hb", Level: 2, Name: "L Hang – 2 detik", Description: "Gantungan L-hang kaki terangkat horizontal selama 2 detik.", Order: 3},
		{ID: "tech-hb-2-4", CategoryID: "cat-hb", Level: 2, Name: "Pull over – Assistant by coach", Description: "Lingkaran putaran badan pull-over ke atas palang dengan bantuan pelatih.", Order: 4},
		{ID: "tech-hb-2-5", CategoryID: "cat-hb", Level: 2, Name: "Glide to basic swing – 3x", Description: "Luncuran glide berlanjut ke 3 kali ayunan ritmis.", Order: 5},
		{ID: "tech-hb-2-6", CategoryID: "cat-hb", Level: 2, Name: "Controlled Dismount", Description: "Lepas ayunan belakang menuju pendaratan bersih di matras.", Order: 6},

		// Horizontal Bar (HB) - Level 3
		{ID: "tech-hb-3-1", CategoryID: "cat-hb", Level: 3, Name: "Safe Mount", Description: "Lompat naik ke palang kompetisi tinggi.", Order: 1},
		{ID: "tech-hb-3-2", CategoryID: "cat-hb", Level: 3, Name: "Tuck Hang – 2 detik", Description: "Gantungan kompresi tuck aktif selama 2 detik.", Order: 2},
		{ID: "tech-hb-3-3", CategoryID: "cat-hb", Level: 3, Name: "L Hang – 2 detik", Description: "Gantungan L-hang horisontal tegas selama 2 detik.", Order: 3},
		{ID: "tech-hb-3-4", CategoryID: "cat-hb", Level: 3, Name: "Kip", Description: "Glide kip naik langsung ke tumpuan depan di atas palang.", Order: 4},
		{ID: "tech-hb-3-5", CategoryID: "cat-hb", Level: 3, Name: "Glide to basic swing", Description: "Transisi luncuran dalam menuju ayunan tinggi.", Order: 5},
		{ID: "tech-hb-3-6", CategoryID: "cat-hb", Level: 3, Name: "Swing Forward turn 180", Description: "Ayunan depan disertai putaran badan 180 derajat membalikkan pegangan.", Order: 6},
		{ID: "tech-hb-3-7", CategoryID: "cat-hb", Level: 3, Name: "Controlled Dismount", Description: "Dismount lepas ayunan tinggi dan stick landing mantap.", Order: 7},
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
