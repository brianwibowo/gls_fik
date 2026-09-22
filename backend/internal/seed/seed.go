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
}

func hashPassword(password string) string {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Fatalf("Gagal hashing password: %v", err)
	}
	return string(bytes)
}

func seedUsers(db *gorm.DB) {
	var count int64
	db.Model(&model.User{}).Count(&count)
	if count > 0 {
		return
	}

	users := []model.User{
		{
			ID:        "admin-1",
			Name:      "Admin GLS",
			Email:     "admin@gls.id",
			Password:  hashPassword("admin123"),
			Role:      "admin",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		{
			ID:        "user-1",
			Name:      "Alisha Rahma",
			Email:     "alisha@gls.id",
			Password:  hashPassword("user123"),
			Role:      "user",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
	}

	for _, u := range users {
		db.FirstOrCreate(&u, model.User{Email: u.Email})
	}
	log.Println("[SEED] Data pengguna (admin & user) berhasil diisi.")
}

func seedCategories(db *gorm.DB) {
	var count int64
	db.Model(&model.Category{}).Count(&count)
	if count > 0 {
		return
	}

	categories := []model.Category{
		{
			ID:          "cat-fx",
			Name:        "Floor Exercise (Senam Lantai)",
			Description: "Rangkaian gerakan akrobatik, putaran, dan kelenturan di atas matras pegas berukuran 12x12 meter.",
			Thumbnail:   "/images/apparatus-floor.webp",
			Order:       1,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "cat-ph",
			Name:        "Pommel Horse (Kuda-Kuda Pelana)",
			Description: "Rangkaian putaran melingkar satu dan dua kaki secara kontinyu di atas bodi kuda berpelana.",
			Thumbnail:   "/images/apparatus-pommel.webp",
			Order:       2,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "cat-sr",
			Name:        "Still Rings (Gelang-Gelang)",
			Description: "Ujian kekuatan statis dan ayunan dinamis pada dua gelang kabel tanpa getaran tali.",
			Thumbnail:   "/images/apparatus-rings.webp",
			Order:       3,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "cat-vt",
			Name:        "Vault (Meja Lompat)",
			Description: "Lompatan eksplosif melintasi meja lompat dengan fase lari cepat, tolakan pegas, dan pendaratan stabil.",
			Thumbnail:   "/images/apparatus-vault.webp",
			Order:       4,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "cat-pb",
			Name:        "Parallel Bars (Palang Sejajar)",
			Description: "Kombinasi ayunan, posisi tumpuan tangan, manuver di bawah palang, dan dismount pendaratan.",
			Thumbnail:   "/images/apparatus-bars.webp",
			Order:       5,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "cat-hb",
			Name:        "Horizontal Bar (Palang Tunggal)",
			Description: "Gerakan ayunan berkecepatan tinggi, giant swing terus-menerus, dan pelepasan pegangan salto spektakuler.",
			Thumbnail:   "/images/apparatus-highbar.jpg",
			Order:       6,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
	}

	for _, c := range categories {
		db.FirstOrCreate(&c, model.Category{ID: c.ID})
	}
	log.Println("[SEED] Data 6 kategori alat senam berhasil diisi.")
}

func seedVideos(db *gorm.DB) {
	var count int64
	db.Model(&model.Video{}).Count(&count)
	if count > 0 {
		return
	}

	videos := []model.Video{
		// 1. Floor Exercise
		{
			ID:          "vid-fx-1",
			CategoryID:  "cat-fx",
			Title:       "Postur, Tumpuan Kaki & Awalan Senam Lantai",
			Description: "Fondasi awal atlet senam artistik: koreksi postur tubuh lurus, tumpuan ujung kaki (toe point), serta ritme langkah akselerasi awalan.",
			DriveFileID: "12JG_YaH6ADE4xVqgskKQY-rx79Dht7KM",
			DriveLink:   "https://drive.google.com/file/d/12JG_YaH6ADE4xVqgskKQY-rx79Dht7KM/view?usp=share_link",
			Thumbnail:   "/images/apparatus-floor.webp",
			Duration:    "03:45",
			Level:       "Dasar",
			EpisodeNum:  1,
			IsFree:      true,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "vid-fx-2",
			CategoryID:  "cat-fx",
			Title:       "Rangkaian Eksekusi & Dinamika Rotasi FX",
			Description: "Pembahasan teknik tolakan tangan ke matras pegas, perpindahan momentum linier menjadi rotasi sudut, serta menjaga sumbu putar di udara.",
			DriveFileID: "10pPKxlH8e6GKSI79bTbiCQ7d_YQP3xkD",
			DriveLink:   "https://drive.google.com/file/d/10pPKxlH8e6GKSI79bTbiCQ7d_YQP3xkD/view?usp=share_link",
			Thumbnail:   "/images/apparatus-floor.webp",
			Duration:    "04:12",
			Level:       "Menengah",
			EpisodeNum:  2,
			IsFree:      false,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "vid-fx-3",
			CategoryID:  "cat-fx",
			Title:       "Koreksi Pendaratan (Stick Landing) Senam Lantai",
			Description: "Fase peredaman hentakan sendi lutut dan tumit saat menyentuh matras tanpa langkah ekstra, stabilitas inti tubuh, dan salam pendaratan.",
			DriveFileID: "1saHh0xfJRT3tuIKyByGCbAzsMnoa2HXI",
			DriveLink:   "https://drive.google.com/file/d/1saHh0xfJRT3tuIKyByGCbAzsMnoa2HXI/view?usp=share_link",
			Thumbnail:   "/images/apparatus-floor.webp",
			Duration:    "05:08",
			Level:       "Mahir",
			EpisodeNum:  3,
			IsFree:      false,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		// 2. Pommel Horse
		{
			ID:          "vid-ph-1",
			CategoryID:  "cat-ph",
			Title:       "Pengenalan Tumpuan & Ayunan Pelana (PH)",
			Description: "Dasar penguatan pergelangan tangan, posisi tumpuan telapak di atas bodi pelana, dan ayunan dasar satu kaki (single leg work).",
			DriveFileID: "1bWbwPWd0GQ_AiX9i4tQ-kFpBKX1mEiLv",
			DriveLink:   "https://drive.google.com/file/d/1bWbwPWd0GQ_AiX9i4tQ-kFpBKX1mEiLv/view?usp=share_link",
			Thumbnail:   "/images/apparatus-pommel.webp",
			Duration:    "03:30",
			Level:       "Dasar",
			EpisodeNum:  1,
			IsFree:      true,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "vid-ph-2",
			CategoryID:  "cat-ph",
			Title:       "Teknik Circle & Scissors Kuda-Kuda Pelana",
			Description: "Drill putaran dua kaki melingkar (double leg circles) kontinu, perpindahan tumpuan tangan ritmis, dan elevasi pinggul pada gerakan scissors.",
			DriveFileID: "1V2mwHNlh2jbpzQz6XwFSvr_OOKb-Hsxk",
			DriveLink:   "https://drive.google.com/file/d/1V2mwHNlh2jbpzQz6XwFSvr_OOKb-Hsxk/view?usp=share_link",
			Thumbnail:   "/images/apparatus-pommel.webp",
			Duration:    "04:45",
			Level:       "Menengah",
			EpisodeNum:  2,
			IsFree:      false,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "vid-ph-3",
			CategoryID:  "cat-ph",
			Title:       "Dismount & Kombinasi Rangkaian Pelana",
			Description: "Transisi rangkaian antar bagian pelana hingga gerakan pelepasan/pendaratan dismount handstand travel yang bersih.",
			DriveFileID: "1OSxlH3hgtuHZ4j25LihLlaKqZtZ5nBq4",
			DriveLink:   "https://drive.google.com/file/d/1OSxlH3hgtuHZ4j25LihLlaKqZtZ5nBq4/view?usp=share_link",
			Thumbnail:   "/images/apparatus-pommel.webp",
			Duration:    "04:15",
			Level:       "Mahir",
			EpisodeNum:  3,
			IsFree:      false,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		// 3. Still Rings
		{
			ID:          "vid-sr-1",
			CategoryID:  "cat-sr",
			Title:       "Grip, False Grip & Ayunan Dasar Gelang-Gelang",
			Description: "Teknik false grip untuk memudahkan transisi tumpuan di atas ring, ayunan lurus ritmis tanpa getaran kabel gantungan.",
			DriveFileID: "1jQ5WvB3Xc0CNCBqv_remyZ70VFkB6qhJ",
			DriveLink:   "https://drive.google.com/file/d/1jQ5WvB3Xc0CNCBqv_remyZ70VFkB6qhJ/view?usp=share_link",
			Thumbnail:   "/images/apparatus-rings.webp",
			Duration:    "03:50",
			Level:       "Dasar",
			EpisodeNum:  1,
			IsFree:      true,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "vid-sr-2",
			CategoryID:  "cat-sr",
			Title:       "Kekuatan Statis (Hold: L-Sit, Planche & Cross)",
			Description: "Penguncian bahu (turnout ring), aktivasi otot inti dan latissimus dorsi saat melakukan tahanan statis 2 detik sesuai standar FIG.",
			DriveFileID: "1ZEnFVQLnIVuIvNBIVC6H1KruGF-j5nfq",
			DriveLink:   "https://drive.google.com/file/d/1ZEnFVQLnIVuIvNBIVC6H1KruGF-j5nfq/view?usp=share_link",
			Thumbnail:   "/images/apparatus-rings.webp",
			Duration:    "05:10",
			Level:       "Menengah",
			EpisodeNum:  2,
			IsFree:      false,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "vid-sr-3",
			CategoryID:  "cat-sr",
			Title:       "Salto Dismount & Pendaratan Stabil Gelang-Gelang",
			Description: "Pelepasan pegangan ring saat puncak ayunan belakang untuk eksekusi salto ganda dan penyerapan hentakan kaki di matras.",
			DriveFileID: "1SgYz3kwxfeKpJTHhCIBae9zVHbhmWl0D",
			DriveLink:   "https://drive.google.com/file/d/1SgYz3kwxfeKpJTHhCIBae9zVHbhmWl0D/view?usp=share_link",
			Thumbnail:   "/images/apparatus-rings.webp",
			Duration:    "04:30",
			Level:       "Mahir",
			EpisodeNum:  3,
			IsFree:      false,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		// 4. Vault
		{
			ID:          "vid-vt-1",
			CategoryID:  "cat-vt",
			Title:       "Akselerasi Sprint 25m & Entri Papan Pegas",
			Description: "Membangun kecepatan lari maksimal yang stabil dan transisi hurdle loncatan ke papan pegas (springboard) dengan sudut kontak optimal.",
			DriveFileID: "1jBhnPPDZb_l21NPCsCZh_DBymNo8sy-x",
			DriveLink:   "https://drive.google.com/file/d/1jBhnPPDZb_l21NPCsCZh_DBymNo8sy-x/view?usp=share_link",
			Thumbnail:   "/images/apparatus-vault.webp",
			Duration:    "03:25",
			Level:       "Dasar",
			EpisodeNum:  1,
			IsFree:      true,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "vid-vt-2",
			CategoryID:  "cat-vt",
			Title:       "Fase Tolakan Bahu (Blocking) di Atas Meja Lompat",
			Description: "Koreksi kontak tangan secepat mungkin (<0.2 detik) pada permukaan meja lompat untuk menghasilkan daya tolak vertikal maksimal.",
			DriveFileID: "1AQSqHJtOuUbcGDtsESAolbdJJggOwQog",
			DriveLink:   "https://drive.google.com/file/d/1AQSqHJtOuUbcGDtsESAolbdJJggOwQog/view?usp=share_link",
			Thumbnail:   "/images/apparatus-vault.webp",
			Duration:    "04:05",
			Level:       "Menengah",
			EpisodeNum:  2,
			IsFree:      false,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "vid-vt-3",
			CategoryID:  "cat-vt",
			Title:       "Fase Layang Kedua (Post-Flight) & Stick Landing VT",
			Description: "Kontrol rotasi tubuh saat melayang di udara, spotting visual matras pendaratan, dan penguncian pendaratan tanpa langkah geser.",
			DriveFileID: "1OXqNUWjXE9UTn9kJ6qiaO92GqID00Q88",
			DriveLink:   "https://drive.google.com/file/d/1OXqNUWjXE9UTn9kJ6qiaO92GqID00Q88/view?usp=share_link",
			Thumbnail:   "/images/apparatus-vault.webp",
			Duration:    "04:55",
			Level:       "Mahir",
			EpisodeNum:  3,
			IsFree:      false,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		// 5. Parallel Bars
		{
			ID:          "vid-pb-1",
			CategoryID:  "cat-pb",
			Title:       "Tumpuan Lengan, Ayunan Bahu & Cast Palang Sejajar",
			Description: "Fondasi posisi tumpu lurus di antara dua palang, ayunan gantung dari bahu tanpa tekukan siku, serta gerakan cast awal.",
			DriveFileID: "1FvXTZ4MqmqljRd4755-ypHuelNVELBg_",
			DriveLink:   "https://drive.google.com/file/d/1FvXTZ4MqmqljRd4755-ypHuelNVELBg_/view?usp=share_link",
			Thumbnail:   "/images/apparatus-bars.webp",
			Duration:    "03:40",
			Level:       "Dasar",
			EpisodeNum:  1,
			IsFree:      true,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "vid-pb-2",
			CategoryID:  "cat-pb",
			Title:       "Handstand, Pirouette & Transisi Atas Palang Sejajar",
			Description: "Penguasaan handstand tegak di atas palang kayu, penguncian bahu, dan perpindahan ayunan melewati palang dengan aman.",
			DriveFileID: "1YNXqIPZmhA_AQzV-ALGDyZK0K4oBXPR2",
			DriveLink:   "https://drive.google.com/file/d/1YNXqIPZmhA_AQzV-ALGDyZK0K4oBXPR2/view?usp=share_link",
			Thumbnail:   "/images/apparatus-bars.webp",
			Duration:    "04:35",
			Level:       "Menengah",
			EpisodeNum:  2,
			IsFree:      false,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "vid-pb-3",
			CategoryID:  "cat-pb",
			Title:       "Variasi Dismount Salto & Evaluasi Palang Sejajar",
			Description: "Teknik ayunan kuat dari bawah palang menuju salto pendaratan di samping matras dengan kontrol postur sempurna.",
			DriveFileID: "1QMNvrTb2fqRn8vOZ5vTebeCNQUrL0x0v",
			DriveLink:   "https://drive.google.com/file/d/1QMNvrTb2fqRn8vOZ5vTebeCNQUrL0x0v/view?usp=share_link",
			Thumbnail:   "/images/apparatus-bars.webp",
			Duration:    "04:50",
			Level:       "Mahir",
			EpisodeNum:  3,
			IsFree:      false,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		// 6. Horizontal Bar
		{
			ID:          "vid-hb-1",
			CategoryID:  "cat-hb",
			Title:       "Grip, Tap Swing & Ayunan Irama Palang Tunggal (HB)",
			Description: "Penggunaan handgrip pelindung telapak tangan, pembentukan lengkungan arch-to-hollow saat ayunan tap swing di palang baja elastis.",
			DriveFileID: "18pOQa_V3FKDNSSkiWMNzfdxxvgry9izS",
			DriveLink:   "https://drive.google.com/file/d/18pOQa_V3FKDNSSkiWMNzfdxxvgry9izS/view?usp=share_link",
			Thumbnail:   "/images/apparatus-highbar.jpg",
			Duration:    "03:55",
			Level:       "Dasar",
			EpisodeNum:  1,
			IsFree:      true,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "vid-hb-2",
			CategoryID:  "cat-hb",
			Title:       "Putaran Raksasa (Giant Swing) & Transisi Pegangan",
			Description: "Pemanfaatan percepatan gravitasi pada rotasi penuh 360 derajat di sekitar palang, cast to handstand, dan perubahan posisi grip.",
			DriveFileID: "1BANvdbvr-0UVVoVoLqJN0Hy3MqEW69fQ",
			DriveLink:   "https://drive.google.com/file/d/1BANvdbvr-0UVVoVoLqJN0Hy3MqEW69fQ/view?usp=share_link",
			Thumbnail:   "/images/apparatus-highbar.jpg",
			Duration:    "05:05",
			Level:       "Menengah",
			EpisodeNum:  2,
			IsFree:      false,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          "vid-hb-3",
			CategoryID:  "cat-hb",
			Title:       "Release Move & Flyaway Salto Dismount HB",
			Description: "Momen krusial pelepasan pegangan tangan di puncak putaran untuk manuver layang dan pendaratan terfiksasi di matras tebal.",
			DriveFileID: "1SXsHg1lSSP184HLB5BcrI9ux34VMhgVb",
			DriveLink:   "https://drive.google.com/file/d/1SXsHg1lSSP184HLB5BcrI9ux34VMhgVb/view?usp=share_link",
			Thumbnail:   "/images/apparatus-highbar.jpg",
			Duration:    "04:40",
			Level:       "Mahir",
			EpisodeNum:  3,
			IsFree:      false,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
	}

	for _, v := range videos {
		db.FirstOrCreate(&v, model.Video{ID: v.ID})
	}
	log.Println("[SEED] Data 18 video pembelajaran berhasil diisi.")
}
