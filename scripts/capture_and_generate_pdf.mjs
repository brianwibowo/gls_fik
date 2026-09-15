import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE_URL = 'http://localhost:3000';
const OUTPUT_DIR = path.resolve('docs');
const SCREENSHOTS_DIR = path.resolve('docs/screenshots');
const PDF_PATH = path.resolve('docs/Buku_Panduan_GLS_FIK.pdf');

// Ensure output directories exist
fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

async function run() {
  console.log('🚀 Memulai Puppeteer untuk pengambilan screenshot dan pembuatan PDF...');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--font-render-hinting=none',
    ],
  });

  const page = await browser.newPage();

  // Helper wait
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  const neededFiles = [
    '01_hero.png', '02_tentang_platform.png', '03_cara_belajar.png', '04_katalog_video.png',
    '05_player_video_gratis.png', '06_video_terkunci_modal.png', '07_halaman_login.png',
    '08_admin_panel_katalog.png', '09_admin_modal_video.png', '10_admin_users.png',
    '11_admin_popup_logout.png', '12_mobile_beranda.png', '13_mobile_menu_drawer.png'
  ];
  const allScreenshotsExist = neededFiles.every(f => fs.existsSync(path.join(SCREENSHOTS_DIR, f)));

  if (!allScreenshotsExist) {
    const page = await browser.newPage();
    console.log('📸 1. Mengambil screenshot Beranda (Hero)...');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await wait(1000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01_hero.png') });

    console.log('📸 2. Mengambil screenshot Section 02 (Tentang Platform)...');
    await page.evaluate(() => {
      const el = document.getElementById('tentang-platform');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await wait(800);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02_tentang_platform.png') });

    console.log('📸 3. Mengambil screenshot Section 03 (Cara Belajar)...');
    await page.evaluate(() => {
      const el = document.getElementById('cara-belajar');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await wait(800);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03_cara_belajar.png') });

    console.log('📸 4. Mengambil screenshot Section 04 (Katalog Video)...');
    await page.evaluate(() => {
      const el = document.getElementById('katalog-video');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await wait(800);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04_katalog_video.png') });

    console.log('📸 5. Mengambil screenshot Pemutar Video Gratis (/watch/vid-fx-1)...');
    await page.goto(`${BASE_URL}/watch/vid-fx-1`, { waitUntil: 'networkidle0' });
    await wait(1200);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '05_player_video_gratis.png') });

    console.log('📸 6. Mengambil screenshot Video Terkunci & Pop-up Modal (/watch/vid-fx-2)...');
    await page.goto(`${BASE_URL}/watch/vid-fx-2`, { waitUntil: 'networkidle0' });
    await wait(800);
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const loginModalBtn = btns.find((b) => b.textContent.includes('Masuk Akun Sekarang'));
      if (loginModalBtn) loginModalBtn.click();
    });
    await wait(600);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '06_video_terkunci_modal.png') });

    console.log('📸 7. Mengambil screenshot Halaman Login (/login)...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0' });
    await wait(800);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '07_halaman_login.png') });

    console.log('🔑 Melakukan login sebagai Admin untuk akses Panel...');
    await page.evaluate(() => {
      const emailInput = document.querySelector('input[type="email"]');
      const passInput = document.querySelector('input[type="password"]');
      if (emailInput) {
        emailInput.value = 'admin@fik.ac.id';
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (passInput) {
        passInput.value = 'password123';
        passInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    await wait(300);
    await page.evaluate(() => {
      const submitBtn = document.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.click();
    });
    await wait(1500);

    console.log('📸 8. Mengambil screenshot Panel Admin - Video & Kategori (/admin)...');
    await page.goto(`${BASE_URL}/admin`, { waitUntil: 'networkidle0' });
    await wait(1000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '08_admin_panel_katalog.png') });

    console.log('📸 9. Mengambil screenshot Modal Tambah Video di Admin...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const addBtn = btns.find((b) => b.textContent.includes('Tambah Materi Video'));
      if (addBtn) addBtn.click();
    });
    await wait(600);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '09_admin_modal_video.png') });

    await page.keyboard.press('Escape');
    await wait(400);

    console.log('📸 10. Mengambil screenshot Panel Admin - Manajemen Pengguna (/admin/users)...');
    await page.goto(`${BASE_URL}/admin/users`, { waitUntil: 'networkidle0' });
    await wait(1000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '10_admin_users.png') });

    console.log('📸 11. Mengambil screenshot Modal Konfirmasi Logout Admin...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const logoutBtn = btns.find((b) => b.textContent.includes('Keluar Akun'));
      if (logoutBtn) logoutBtn.click();
    });
    await wait(600);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '11_admin_popup_logout.png') });

    await page.keyboard.press('Escape');
    await wait(300);

    console.log('📸 12. Mengambil screenshot Tampilan Mobile Responsive (iPhone 14/15 Pro)...');
    await page.setViewport({ width: 393, height: 852, isMobile: true, hasTouch: true });
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await wait(1000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '12_mobile_beranda.png') });

    await page.evaluate(() => {
      const menuBtn = document.querySelector('button[aria-label*="Menu"]');
      if (menuBtn) menuBtn.click();
    });
    await wait(500);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '13_mobile_menu_drawer.png') });

    console.log('✅ Seluruh screenshot berhasil diambil!');
    await page.close();
  } else {
    console.log('📸 Seluruh 13 screenshot layar sudah tersedia di direktori docs/screenshots/. Menggunakan berkas yang ada!');
  }

  // Use relative image paths to keep HTML lightweight and fast to render
  const img01 = './screenshots/01_hero.png';
  const img02 = './screenshots/02_tentang_platform.png';
  const img03 = './screenshots/03_cara_belajar.png';
  const img04 = './screenshots/04_katalog_video.png';
  const img05 = './screenshots/05_player_video_gratis.png';
  const img06 = './screenshots/06_video_terkunci_modal.png';
  const img07 = './screenshots/07_halaman_login.png';
  const img08 = './screenshots/08_admin_panel_katalog.png';
  const img09 = './screenshots/09_admin_modal_video.png';
  const img10 = './screenshots/10_admin_users.png';
  const img11 = './screenshots/11_admin_popup_logout.png';
  const img12 = './screenshots/12_mobile_beranda.png';
  const img13 = './screenshots/13_mobile_menu_drawer.png';

  console.log('📄 Merakit dokumen panduan dan tutorial HTML berstandar cetak...');

  const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Buku Panduan & Dokumentasi Sistem GLS FIK</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

    @page {
      size: A4;
      margin: 18mm 16mm 18mm 16mm;
      @bottom-right {
        content: counter(page);
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 8pt;
        color: #64748b;
      }
      @bottom-left {
        content: "GLS FIK • Gymnastics Learning System - Buku Panduan";
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 8pt;
        color: #64748b;
      }
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
      color: #1e293b;
      line-height: 1.55;
      font-size: 9.5pt;
      background: #ffffff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page-break {
      page-break-after: always;
      break-after: page;
    }

    /* Cover Page */
    .cover {
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 30px 10px;
      background: #ffffff;
    }

    .cover-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #c1ff72;
      color: #1f2a2e;
      font-weight: 800;
      font-size: 9pt;
      padding: 4px 12px;
      border-radius: 9999px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-bottom: 20px;
    }

    .cover-title {
      font-size: 34pt;
      font-weight: 800;
      line-height: 1.05;
      letter-spacing: -1.5px;
      color: #0f172a;
      margin-bottom: 12px;
    }

    .cover-title span {
      color: #15803d;
      background: linear-gradient(90deg, #15803d, #1f2a2e);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .cover-subtitle {
      font-size: 13pt;
      color: #475569;
      max-width: 520px;
      line-height: 1.4;
      font-weight: 500;
      margin-bottom: 24px;
    }

    .cover-meta-box {
      border-left: 4px solid #c1ff72;
      background: #f8fafc;
      padding: 14px 18px;
      border-radius: 0 10px 10px 0;
      margin-bottom: 30px;
    }

    .cover-meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      font-size: 8.5pt;
    }

    .cover-meta-item strong {
      color: #0f172a;
      display: block;
      margin-bottom: 2px;
      font-size: 9pt;
    }

    .cover-footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 16px;
      display: flex;
      justify-content: space-between;
      font-size: 8pt;
      color: #64748b;
    }

    /* Section Headings */
    h1.chapter-title {
      font-size: 19pt;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #0f172a;
      margin-bottom: 6px;
      padding-bottom: 6px;
      border-bottom: 2px solid #e2e8f0;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .chapter-tag {
      font-size: 8pt;
      background: #1f2a2e;
      color: #c1ff72;
      padding: 2px 8px;
      border-radius: 6px;
      font-weight: 800;
    }

    h2 {
      font-size: 12pt;
      font-weight: 700;
      color: #0f172a;
      margin: 14px 0 6px 0;
    }

    h3 {
      font-size: 10pt;
      font-weight: 700;
      color: #1e293b;
      margin: 10px 0 4px 0;
    }

    p {
      margin-bottom: 8px;
      color: #334155;
    }

    /* Callout & Alerts */
    .alert {
      padding: 10px 14px;
      border-radius: 8px;
      margin: 10px 0;
      font-size: 8.5pt;
      line-height: 1.45;
    }

    .alert-green {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-left: 4px solid #16a34a;
      color: #14532d;
    }

    .alert-dark {
      background: #1f2a2e;
      border: 1px solid #334155;
      border-left: 4px solid #c1ff72;
      color: #f8fafc;
    }
    .alert-dark strong {
      color: #c1ff72;
    }

    .alert-blue {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #475569;
      color: #1e293b;
    }

    /* Screenshots */
    .screenshot-card {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      overflow: hidden;
      margin: 10px 0 14px 0;
      box-shadow: 0 2px 6px rgba(0,0,0,0.04);
    }

    .screenshot-img {
      width: 100%;
      height: auto;
      display: block;
      border-bottom: 1px solid #f1f5f9;
    }

    .screenshot-caption {
      padding: 6px 12px;
      background: #f8fafc;
      font-size: 8pt;
      color: #475569;
      font-weight: 600;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .screenshot-caption span.badge {
      background: #e2e8f0;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 7pt;
      color: #0f172a;
    }

    /* Steps list */
    .steps-list {
      list-style: none;
      counter-reset: step-counter;
      margin: 10px 0;
    }

    .steps-list li {
      counter-increment: step-counter;
      position: relative;
      padding-left: 32px;
      margin-bottom: 10px;
    }

    .steps-list li::before {
      content: counter(step-counter);
      position: absolute;
      left: 0;
      top: 0;
      width: 22px;
      height: 22px;
      background: #c1ff72;
      color: #1f2a2e;
      border-radius: 6px;
      font-weight: 800;
      font-size: 9pt;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #a3e635;
    }

    .steps-list li strong {
      color: #0f172a;
      display: block;
      font-size: 9.5pt;
      margin-bottom: 2px;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0 14px 0;
      font-size: 8.5pt;
    }

    th {
      background: #1f2a2e;
      color: #ffffff;
      text-align: left;
      padding: 8px 10px;
      font-weight: 700;
      border: 1px solid #1f2a2e;
    }

    td {
      padding: 7px 10px;
      border: 1px solid #e2e8f0;
      color: #334155;
    }

    tr:nth-child(even) td {
      background: #f8fafc;
    }

    .tag-free {
      background: #dcfce7;
      color: #166534;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 7.5pt;
    }

    .tag-lock {
      background: #fee2e2;
      color: #991b1b;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 7.5pt;
    }

    /* Two column layout */
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      align-items: start;
    }
  </style>
</head>
<body>

  <!-- ==================== COVER PAGE ==================== -->
  <div class="cover page-break">
    <div>
      <div class="cover-badge">Buku Panduan Pengguna & Pengelola Sistem</div>
      <h1 class="cover-title">
        GLS FIK<br>
        <span>Gymnastics Learning System</span>
      </h1>
      <p class="cover-subtitle">
        Panduan komprehensif, arsitektur kurikulum video-first, alur pembelajaran atlet & mahasiswa, serta operasional panel administrasi digital Fakultas Ilmu Keolahragaan.
      </p>

      <div class="cover-meta-box">
        <div class="cover-meta-grid">
          <div class="cover-meta-item">
            <strong>Instansi / Fakultas</strong>
            Fakultas Ilmu Keolahragaan (FIK)
          </div>
          <div class="cover-meta-item">
            <strong>Disiplin Senam</strong>
            Men's Artistic Gymnastics (MAG - 6 Kategori Alat)
          </div>
          <div class="cover-meta-item">
            <strong>Versi Platform</strong>
            v1.0 (Produksi Digital Web)
          </div>
          <div class="cover-meta-item">
            <strong>Dibuat Otomatis Menggunakan</strong>
            Puppeteer Engine + Next.js Headless Snapshot
          </div>
        </div>
      </div>
    </div>

    <div>
      <div class="screenshot-card" style="margin-bottom: 20px;">
        <img src="${img01}" class="screenshot-img" alt="GLS FIK Hero">
        <div class="screenshot-caption">
          <span>Tampilan Layar Utama (Hero Cinematic Editorial)</span>
          <span class="badge">Resolusi Web HD</span>
        </div>
      </div>

      <div class="cover-footer">
        <div>&copy; ${new Date().getFullYear()} GLS FIK. Seluruh Hak Cipta Dilindungi Undang-Undang.</div>
        <div>Dokumen Resmi Panduan Operasional Web</div>
      </div>
    </div>
  </div>

  <!-- ==================== DAFTAR ISI & PENDAHULUAN ==================== -->
  <div class="page-break">
    <h1 class="chapter-title">
      <span class="chapter-tag">BAB 1</span>
      Tentang Platform & Visi GLS FIK
    </h1>

    <div class="alert alert-dark">
      <strong>Visi GLS FIK:</strong> Mentransformasi metode evaluasi dan pembelajaran gerak senam artistik tradisional menjadi kurikulum visual terstruktur berbasis video berdefinisi tinggi yang dapat diakses secara fleksibel oleh dosen, pelatih, atlet, dan mahasiswa.
    </div>

    <h2>1.1 Latar Belakang & Masalah Pembelajaran Senam</h2>
    <p>
      Pembelajaran senam artistik menuntut pemahaman mendalam terhadap biomekanika gerak, urutan awalan (<em>hurdle</em>), titik tolakan, hingga pendaratan aman (<em>stick landing</em>). Seringkali mahasiswa atau atlet kesulitan mereview kesalahan gerak hanya dari penjelasan lisan di hall senam. 
    </p>
    <p>
      <strong>Gymnastics Learning System (GLS FIK)</strong> hadir sebagai platform pembelajaran digital <em>video-first</em> yang dirancang khusus untuk memetakan gerakan latihan langkah demi langkah, membedakan materi pengenalan terbuka (gratis) dan materi drill spesifik lanjutan (akun terdaftar).
    </p>

    <h2>1.2 Enam (6) Kategori Disiplin Senam Artistik Putra (MAG)</h2>
    <p>Seluruh materi dalam platform GLS FIK diklasifikasikan ke dalam 6 kategori alat internasional resmi FIG (Fédération Internationale de Gymnastique):</p>

    <table>
      <thead>
        <tr>
          <th>Kode</th>
          <th>Nama Kategori Alat</th>
          <th>Fokus Utama Gerak & Kurikulum</th>
          <th>Jumlah Episode Seed</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>FX</strong></td>
          <td>Senam Lantai (Floor Exercise)</td>
          <td>Awalan lari berirama, round-off, flic-flac, salto akrobatik, dan stick landing.</td>
          <td>3 Episode (1 Gratis, 2 Akun)</td>
        </tr>
        <tr>
          <td><strong>PH</strong></td>
          <td>Kuda-Kuda Pelana (Pommel Horse)</td>
          <td>Tumpuan dasar, double leg circles, scissor hop, dan pemindahan beban lateral.</td>
          <td>3 Episode (1 Gratis, 2 Akun)</td>
        </tr>
        <tr>
          <td><strong>VT</strong></td>
          <td>Meja Lompat (Vault)</td>
          <td>Lari akselerasi, tolakan springboard dinamis, pre-flight, dan dorongan meja.</td>
          <td>3 Episode (1 Gratis, 2 Akun)</td>
        </tr>
        <tr>
          <td><strong>SR</strong></td>
          <td>Gelang-Gelang (Still Rings)</td>
          <td>Inverted hang, muscle up entry, cross grip strength, dan dismount berputar.</td>
          <td>3 Episode (1 Gratis, 2 Akun)</td>
        </tr>
        <tr>
          <td><strong>PB</strong></td>
          <td>Palang Sejajar (Parallel Bars)</td>
          <td>Ayunan lengan lurus, straddle travel, handstand balance, dan undercast.</td>
          <td>3 Episode (1 Gratis, 2 Akun)</td>
        </tr>
        <tr>
          <td><strong>HB</strong></td>
          <td>Palang Tunggal (Horizontal Bar)</td>
          <td>Tap swing, cast handstand, giant swing melingkar penuh, dan flyaway dismount.</td>
          <td>3 Episode (1 Gratis, 2 Akun)</td>
        </tr>
      </tbody>
    </table>

    <h2>1.3 Tangkapan Layar Beranda & Profil Platform</h2>
    <div class="screenshot-card">
      <img src="${img02}" class="screenshot-img" alt="Section Tentang Platform">
      <div class="screenshot-caption">
        <span>Section 02: Tentang Platform GLS FIK (3 Pilar: Video Peragaan, 6 Kategori Alat, Pendampingan Pelatih)</span>
        <span class="badge">Halaman Beranda</span>
      </div>
    </div>
  </div>

  <!-- ==================== BAB 2: CARA BELAJAR & PANDUAN PENGGUNA ==================== -->
  <div class="page-break">
    <h1 class="chapter-title">
      <span class="chapter-tag">BAB 2</span>
      Alur & Panduan Pengguna (Atlet, Pelatih, Mahasiswa)
    </h1>

    <p>
      GLS FIK dirancang dengan antarmuka yang ramah pengguna, responsif di ponsel maupun laptop, serta memiliki pembagian hak akses yang jelas antara pengunjung umum dan pengguna berakun.
    </p>

    <h2>2.1 Empat (4) Langkah Belajar di Platform</h2>
    <ol class="steps-list">
      <li>
        <strong>Pilih Kategori Alat Melalui Header atau Katalog</strong>
        Gunakan menu navigasi atas (Senam Lantai, Kuda Pelana, Meja Lompat, atau dropdown Lainnya) untuk langsung membuka video pertama dari alat yang ingin dipelajari, atau gulir ke bawah ke Section 04.
      </li>
      <li>
        <strong>Tonton Video Bertanda GRATIS</strong>
        Setiap kategori alat menyediakan video peragaan dasar yang berlabel <span class="tag-free">GRATIS</span>. Video ini dapat diputar langsung tanpa perlu registrasi atau login terlebih dahulu.
      </li>
      <li>
        <strong>Masuk Akun untuk Membuka Video Spesifik & Lanjutan</strong>
        Video episode 2 dan 3 ditandai dengan badge <span class="tag-lock">Login</span>. Klik video tersebut atau gunakan tombol <em>Login Admin/Akun</em> untuk membuka seluruh akses materi.
      </li>
      <li>
        <strong>Gunakan Pemutar Interaktif & Playlist Sidebar</strong>
        Di halaman pemutar video, pengguna dapat mempelajari deskripsi drill, level kesulitan, serta langsung melompat antar episode menggunakan sidebar di sebelah kanan.
      </li>
    </ol>

    <div class="screenshot-card">
      <img src="${img03}" class="screenshot-img" alt="Section Cara Belajar">
      <div class="screenshot-caption">
        <span>Section 03: Cara Belajar di GLS FIK (Dark Slate High-Contrast Canvas)</span>
        <span class="badge">Halaman Beranda</span>
      </div>
    </div>

    <h2>2.2 Katalog Materi Video Lengkap</h2>
    <div class="screenshot-card">
      <img src="${img04}" class="screenshot-img" alt="Section Katalog Video">
      <div class="screenshot-caption">
        <span>Section 04: Katalog Materi Video dengan Quick Filter Kategori & Horizontal Swipe Carousel</span>
        <span class="badge">Halaman Beranda</span>
      </div>
    </div>
  </div>

  <!-- ==================== BAB 3: FITUR PEMUTAR VIDEO & AKSES KONTEN ==================== -->
  <div class="page-break">
    <h1 class="chapter-title">
      <span class="chapter-tag">BAB 3</span>
      Fitur Pemutar Video & Skema Akses Terkunci
    </h1>

    <h2>3.1 Pemutar Video Terintegrasi Google Drive (/watch/[id])</h2>
    <p>
      GLS FIK mengintegrasikan streaming video berkecepatan tinggi langsung dari Google Drive storage FIK, bebas dari iklan pihak ketiga, dengan kontrol resolusi otomatis dan pemutaran responsif.
    </p>

    <div class="screenshot-card">
      <img src="${img05}" class="screenshot-img" alt="Watch Page Player">
      <div class="screenshot-caption">
        <span>Halaman Pemutar Video: Embed Google Drive, Tag Kategori, Episode, Level Kesulitan, dan Playlist</span>
        <span class="badge">Route /watch/vid-fx-1</span>
      </div>
    </div>

    <h2>3.2 Tampilan Episode Terkunci & Modal Login Pop-up Cepat</h2>
    <p>
      Bila pengguna belum masuk dan mencoba memutar materi premium, sistem tidak menolak secara kasar melainkan menampilkan <em>Locked Card State</em> berlatar gradasi gelap elegan beserta tombol pembuka modal login langsung tanpa harus berpindah halaman.
    </p>

    <div class="screenshot-card">
      <img src="${img06}" class="screenshot-img" alt="Video Terkunci Modal">
      <div class="screenshot-caption">
        <span>State Video Terkunci & Pop-up Modal Login Cepat Tanpa Kehilangan Halaman Pemutar</span>
        <span class="badge">Pop-up Interaktif</span>
      </div>
    </div>

    <div class="alert alert-green">
      <strong>Keunggulan Pop-up Login Cepat:</strong> Saat atlet sedang menonton playlist dan mengklik episode terkunci, mereka cukup memasukkan akun di pop-up modal. Setelah sukses, modal langsung tertutup dan video yang dimaksud langsung terputar otomatis tanpa reload halaman.
    </div>
  </div>

  <!-- ==================== BAB 4: AUTENTIKASI & HALAMAN MASUK ==================== -->
  <div class="page-break">
    <h1 class="chapter-title">
      <span class="chapter-tag">BAB 4</span>
      Autentikasi Akun & Halaman Login
    </h1>

    <div class="grid-2">
      <div>
        <h2>4.1 Desain Halaman Login (/login)</h2>
        <p>
          Halaman login dirancang dengan layout <em>split-screen editorial</em>:
        </p>
        <ul style="padding-left: 18px; margin-bottom: 12px; font-size: 9pt; color: #334155;">
          <li><strong>Sisi Kiri (Visual Hero):</strong> Menampilkan visual foto aksi senam FIK resolusi tinggi dengan teks kurikulum penunjang.</li>
          <li><strong>Sisi Kanan (Formulir Masuk):</strong> Form autentikasi email & sandi dengan tombol aksi cepat akun demo untuk mempermudah demonstrasi sistem.</li>
        </ul>

        <div class="alert alert-blue">
          <strong>Daftar Akun Pengujian Demo:</strong><br>
          • <strong>Admin / Dosen:</strong> <code>admin@fik.ac.id</code> | Sandi: <code>password123</code><br>
          • <strong>Mahasiswa / Atlet:</strong> <code>mahasiswa@fik.ac.id</code> | Sandi: <code>password123</code>
        </div>
      </div>

      <div>
        <div class="screenshot-card">
          <img src="${img07}" class="screenshot-img" alt="Halaman Login GLS FIK">
          <div class="screenshot-caption">
            <span>Tampilan Antarmuka Halaman Login Split Screen</span>
            <span class="badge">Route /login</span>
          </div>
        </div>
      </div>
    </div>

    <h2>4.2 Hak Akses Berdasarkan Peran (Role-Based Access Control)</h2>
    <table>
      <thead>
        <tr>
          <th>Peran (Role)</th>
          <th>Tonton Video Gratis</th>
          <th>Tonton Video Premium</th>
          <th>Akses Panel Admin</th>
          <th>Tambah / Hapus Materi Video</th>
          <th>Kelola Pengguna</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Publik (Tamu)</strong></td>
          <td>Ya (Bebas)</td>
          <td>Tidak (Terkunci)</td>
          <td>Tidak</td>
          <td>Tidak</td>
          <td>Tidak</td>
        </tr>
        <tr>
          <td><strong>Mahasiswa / Atlet</strong></td>
          <td>Ya (Bebas)</td>
          <td>Ya (Penuh)</td>
          <td>Tidak</td>
          <td>Tidak</td>
          <td>Tidak</td>
        </tr>
        <tr>
          <td><strong>Pelatih / Dosen / Admin</strong></td>
          <td>Ya (Bebas)</td>
          <td>Ya (Penuh)</td>
          <td>Ya (Penuh)</td>
          <td>Ya (Penuh)</td>
          <td>Ya (Penuh)</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- ==================== BAB 5: PANEL ADMIN - MANAJEMEN VIDEO & KATEGORI ==================== -->
  <div class="page-break">
    <h1 class="chapter-title">
      <span class="chapter-tag">BAB 5</span>
      Panel Admin: Manajemen Video & Kategori Alat
    </h1>

    <p>
      Dosen dan administrator memiliki kendali penuh terhadap seluruh isi perpustakaan video melalui Panel Admin di URL <code>/admin</code>.
    </p>

    <h2>5.1 Dashboard Manajemen Video (/admin)</h2>
    <div class="screenshot-card">
      <img src="${img08}" class="screenshot-img" alt="Dashboard Admin Video">
      <div class="screenshot-caption">
        <span>Panel Admin: Ringkasan Metrik, Filter Kategori Alat, Fitur Pencarian Video, dan Tombol Tambah</span>
        <span class="badge">Route /admin</span>
      </div>
    </div>

    <h2>5.2 Formulir Tambah & Edit Materi Video</h2>
    <div class="grid-2">
      <div>
        <p>Ketika mengklik tombol <strong>"+ Tambah Materi Video"</strong>, modal pop-up interaktif akan muncul. Administrator cukup mengisikan informasi:</p>
        <ol class="steps-list">
          <li><strong>Pilih Kategori Alat:</strong> Dropdown otomatis membaca daftar kategori aktif.</li>
          <li><strong>Nomor Episode:</strong> Urutan episode dalam kategori alat tersebut.</li>
          <li><strong>Judul & Deskripsi:</strong> Penjelasan teknis mengenai gerak yang diperagakan.</li>
          <li><strong>ID Berkas Google Drive:</strong> Cukup salin ID file dari link berbagi Google Drive.</li>
          <li><strong>Level & Durasi:</strong> Misal Level <em>Dasar / Menengah / Mahir</em> dan durasi <em>MM:SS</em>.</li>
          <li><strong>Status Akses:</strong> Centang opsi <em>"Video Gratis untuk Tamu"</em> bila ingin dibuka untuk publik.</li>
        </ol>
      </div>
      <div>
        <div class="screenshot-card">
          <img src="${img09}" class="screenshot-img" alt="Modal Tambah Video">
          <div class="screenshot-caption">
            <span>Modal Formulir Penambahan Video Pembelajaran</span>
            <span class="badge">Modal Interaktif</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ==================== BAB 6: PANEL ADMIN - MANAJEMEN PENGGUNA & KEAMANAN ==================== -->
  <div class="page-break">
    <h1 class="chapter-title">
      <span class="chapter-tag">BAB 6</span>
      Panel Admin: Pengguna, Keamanan & Konfirmasi Keluar
    </h1>

    <h2>6.1 Manajemen Pengguna & Akun Mahasiswa (/admin/users)</h2>
    <p>
      Halaman <code>/admin/users</code> memungkinkan administrator menambahkan akun mahasiswa baru, mengatur peran (Admin, Dosen, Pelatih, Mahasiswa), mengaktifkan/menonaktifkan akun, atau mereset kata sandi pengguna.
    </p>

    <div class="screenshot-card">
      <img src="${img10}" class="screenshot-img" alt="Manajemen Pengguna Admin">
      <div class="screenshot-caption">
        <span>Tabel Pengguna: Nama, Email, Peran (Badge Warna), Status Akun, dan Aksi Pengelolaan</span>
        <span class="badge">Route /admin/users</span>
      </div>
    </div>

    <h2>6.2 Dialog Konfirmasi Pop-up Saat Keluar Akun (Logout Protection)</h2>
    <p>
      Untuk mencegah insiden keluarnya akun admin saat sedang menginput materi atau mengoreksi kurikulum, GLS FIK dilengkapi modal peringatan konfirmasi sebelum sesi diakhiri.
    </p>

    <div class="screenshot-card">
      <img src="${img11}" class="screenshot-img" alt="Popup Konfirmasi Logout">
      <div class="screenshot-caption">
        <span>Dialog Peringatan Konfirmasi Sebelum Mengakhiri Sesi Admin (Dapat ditutup dengan tombol Batal atau tombol Esc)</span>
        <span class="badge">Keamanan Admin</span>
      </div>
    </div>
  </div>

  <!-- ==================== BAB 7: TAMPILAN RESPONSIF MOBILE & PENUTUP ==================== -->
  <div class="page-break">
    <h1 class="chapter-title">
      <span class="chapter-tag">BAB 7</span>
      Aksesibilitas Mobile & Ringkasan Spesifikasi
    </h1>

    <p>
      GLS FIK dibangun dengan prinsip <em>Mobile-First Responsive Design</em>. Seluruh tombol sentuh memiliki area minimal 44x44 pixel sesuai standar aksesibilitas manusia (WCAG), memastikan pelatih di lapangan dapat mengoperasikan platform lewat tablet maupun smartphone dengan nyaman.
    </p>

    <div class="grid-2">
      <div>
        <div class="screenshot-card">
          <img src="${img12}" class="screenshot-img" alt="Mobile Beranda">
          <div class="screenshot-caption">
            <span>Tampilan Layar Ponsel (Mobile Viewport)</span>
            <span class="badge">393 x 852 px</span>
          </div>
        </div>
      </div>
      <div>
        <div class="screenshot-card">
          <img src="${img13}" class="screenshot-img" alt="Mobile Menu Drawer">
          <div class="screenshot-caption">
            <span>Drawer Menu Navigasi & Kategori Alat Mobile</span>
            <span class="badge">Menu Cepat</span>
          </div>
        </div>
      </div>
    </div>

    <h2>7.1 Ringkasan Arsitektur Teknologi Platform</h2>
    <table>
      <thead>
        <tr>
          <th>Komponen Sistem</th>
          <th>Teknologi / Library yang Digunakan</th>
          <th>Fungsi & Keunggulan</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Framework Inti</strong></td>
          <td>Next.js 16 (App Router) + React 19</td>
          <td>Server-side rendering, routing modular, dan performa tinggi.</td>
        </tr>
        <tr>
          <td><strong>Gaya & Desain</strong></td>
          <td>Tailwind CSS v4 + Vanilla CSS Tokens</td>
          <td>Palet warna eksklusif (#C1FF72, #1F2A2E), kontras tinggi, anti-slop.</td>
        </tr>
        <tr>
          <td><strong>Animasi & Motion</strong></td>
          <td>Framer Motion v13</td>
          <td>Transisi komponen, staggered reveal on scroll, micro-interaction.</td>
        </tr>
        <tr>
          <td><strong>Engine Scroll Halus</strong></td>
          <td>Lenis Smooth Scroll</td>
          <td>Kecepatan scroll diperlambat, inersia mewah, perlindungan carousel.</td>
        </tr>
        <tr>
          <td><strong>Streaming Video</strong></td>
          <td>Google Drive Iframe Streaming API</td>
          <td>Penyimpanan cloud resmi FIK, hemat bandwidth server, tanpa iklan.</td>
        </tr>
        <tr>
          <td><strong>PDF Generation</strong></td>
          <td>Puppeteer Core + Headless Chrome Engine</td>
          <td>Snapshot otomatis seluruh layar dan kompilasi dokumen panduan A4.</td>
        </tr>
      </tbody>
    </table>

    <div class="alert alert-dark" style="margin-top: 20px;">
      <strong>Catatan Operasional:</strong> Dokumen panduan ini digenerasikan secara otomatis oleh Puppeteer Engine pada <strong>${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>. Seluruh materi dan akun pada platform dapat dikembangkan secara berkelanjutan oleh pengelola Fakultas Ilmu Keolahragaan.
    </div>
  </div>

</body>
</html>`;

  const docPath = path.join(OUTPUT_DIR, 'panduan_gls_fik.html');
  fs.writeFileSync(docPath, htmlContent);
  console.log(`📝 Dokumen HTML tersimpan di: ${docPath}`);

  console.log('🖨️ Mengonversi dokumen HTML ke PDF resolusi cetak A4...');
  const printPage = await browser.newPage();
  await printPage.goto(`file://${docPath}`, { waitUntil: 'load', timeout: 60000 });
  await wait(800);

  await printPage.pdf({
    path: PDF_PATH,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '12mm',
      bottom: '12mm',
      left: '12mm',
      right: '12mm',
    },
    displayHeaderFooter: false,
  });

  console.log(`🎉 PDF Berhasil dibuat di: ${PDF_PATH}`);
  const stats = fs.statSync(PDF_PATH);
  console.log(`📊 Ukuran file PDF: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

  await printPage.close();
  await browser.close();
  console.log('✨ Seluruh proses Puppeteer selesai dengan sukses!');
}

run().catch((err) => {
  console.error('❌ Error saat menjalankan Puppeteer script:', err);
  process.exit(1);
});
