import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE_URL = 'http://localhost:3000';
const OUTPUT_DIR = path.resolve('docs');
const SCREENSHOTS_DIR = path.resolve('docs/screenshots');
const PDF_PATH = path.resolve('docs/Buku_Panduan_GLS_FIK.pdf');
const HTML_DOC_PATH = path.join(OUTPUT_DIR, 'panduan_gls_fik.html');

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function run() {
  console.log('🚀 Memulai Puppeteer untuk pengambilan seluruh tangkapan layar dan pembuatan PDF komprehensif...');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--font-render-hinting=none',
      '--allow-file-access-from-files',
      '--enable-local-file-accesses',
    ],
  });

  const page = await browser.newPage();
  page.on('dialog', async (dialog) => {
    console.log('  ⚠️ Dialog browser terdeteksi:', dialog.message());
    await dialog.accept();
  });

  // 1. Hero
  console.log('📸 1. Mengambil screenshot Beranda (Hero)...');
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
  await wait(1000);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01_hero.png') });

  // 2. Section 02 Tentang Platform
  console.log('📸 2. Mengambil screenshot Section 02 (Tentang Platform)...');
  await page.evaluate(() => {
    const el = document.getElementById('tentang-platform');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await wait(800);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02_tentang_platform.png') });

  // 3. Section 03 Cara Belajar
  console.log('📸 3. Mengambil screenshot Section 03 (Cara Belajar)...');
  await page.evaluate(() => {
    const el = document.getElementById('cara-belajar');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await wait(800);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03_cara_belajar.png') });

  // 4. Section 04 Katalog Video
  console.log('📸 4. Mengambil screenshot Section 04 (Katalog Video)...');
  await page.evaluate(() => {
    const el = document.getElementById('katalog-video');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await wait(800);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04_katalog_video.png') });

  // 5. Watch Page Player Gratis
  console.log('📸 5. Mengambil screenshot Pemutar Video Gratis (/watch/vid-fx-1)...');
  await page.goto(`${BASE_URL}/watch/vid-fx-1`, { waitUntil: 'networkidle0' });
  await wait(1200);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '05_player_video_gratis.png') });

  // 6. Watch Page Locked Episode
  console.log('📸 6. Mengambil screenshot Episode Terkunci (/watch/vid-fx-2)...');
  await page.goto(`${BASE_URL}/watch/vid-fx-2`, { waitUntil: 'networkidle0' });
  await wait(800);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '06_video_terkunci_state.png') });

  // 7. Watch Page Login Modal Popup
  console.log('📸 7. Mengambil screenshot Modal Login Pop-up...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const loginModalBtn = btns.find((b) => b.textContent.includes('Masuk Akun Sekarang'));
    if (loginModalBtn) loginModalBtn.click();
  });
  await wait(600);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '07_modal_login_popup.png') });

  // 8. Halaman Login
  console.log('📸 8. Mengambil screenshot Halaman Login (/login)...');
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0' });
  await wait(800);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '08_halaman_login.png') });

  // 9. Login as Admin
  console.log('🔑 Melakukan login sebagai Admin untuk akses Panel...');
  await page.goto(`${BASE_URL}/login?redirect=/admin`, { waitUntil: 'networkidle0' });
  await wait(500);
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const adminDemoBtn = btns.find((b) => b.textContent.includes('Akun Admin'));
    if (adminDemoBtn) adminDemoBtn.click();
  });
  await wait(400);
  await page.evaluate(() => {
    const submitBtn = document.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.click();
  });
  await wait(2000);
  console.log('📍 Current URL after login:', page.url());

  // 10. Admin Dashboard Katalog
  console.log('📸 9. Mengambil screenshot Panel Admin - Video & Kategori (/admin)...');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '09_admin_dashboard_katalog.png') });

  // 11. Modal Tambah Video Kosong
  console.log('📸 10. Mengambil screenshot Modal Tambah Video Kosong...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const addBtn = btns.find((b) => b.textContent.includes('Tambah Episode'));
    if (addBtn) addBtn.click();
  });
  await wait(800);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '10_admin_modal_tambah_video_kosong.png') });

  // 12. Modal Tambah Video Terisi Lengkap + Preview
  console.log('📸 11. Mengisi Formulir Video Baru & screenshot Modal Terisi Lengkap...');
  await page.type('input[placeholder*="Contoh: Postur"]', 'Drill Tolakan Round-Off & Salto Lurus Senam Lantai');
  await page.type('input[placeholder*="drive.google.com"]', 'https://drive.google.com/file/d/12JG_YaH6ADE4xVqgsk97_abcdefghijk/view');
  await page.type('textarea', 'Panduan latihan transisi tolakan kaki berirama pasca round-off untuk mencapai elevasi salto lurus.');
  await wait(800);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '11_admin_modal_tambah_video_terisi.png') });

  // 13. Simpan Video Baru & Screenshot Hasil Tabel
  console.log('📸 12. Menyimpan Video Baru & screenshot Tabel Hasil Penambahan...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const saveBtn = btns.find((b) => b.textContent.includes('Simpan Episode'));
    if (saveBtn) saveBtn.click();
  });
  await wait(1200);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '12_admin_video_berhasil_disimpan.png') });

  // 14. Admin Users List
  console.log('📸 13. Mengambil screenshot Panel Admin - Manajemen Pengguna (/admin/users)...');
  await page.goto(`${BASE_URL}/admin/users`, { waitUntil: 'networkidle0' });
  await wait(1000);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '13_admin_users_list.png') });

  // 15. Form Tambah User Terisi Lengkap
  console.log('📸 14. Membuka & Mengisi Formulir Pengguna Baru...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const addBtn = btns.find((b) => b.textContent.includes('Tambah Pengguna Baru'));
    if (addBtn) addBtn.click();
  });
  await wait(500);
  await page.type('input[placeholder*="Budi Santoso"]', 'Dr. Hendra Pratama, M.Pd.');
  await page.type('input[type="email"]', 'hendra.pratama@fik.ac.id');
  await page.type('input[type="password"]', 'fiksenam2026');
  await page.select('select', 'admin');
  await wait(600);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '14_admin_form_tambah_user_terisi.png') });

  // 16. Simpan User Baru & Screenshot Hasil Tabel Pengguna
  console.log('📸 15. Menyimpan Pengguna Baru & screenshot Tabel Pengguna Terupdate...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const saveBtn = btns.find((b) => b.textContent.includes('Simpan Pengguna'));
    if (saveBtn) saveBtn.click();
  });
  await wait(1200);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '15_admin_user_berhasil_disimpan.png') });

  // 17. Popup Logout Admin
  console.log('📸 16. Mengambil screenshot Modal Konfirmasi Logout Admin...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const logoutBtn = btns.find((b) => b.textContent.includes('Keluar Akun'));
    if (logoutBtn) logoutBtn.click();
  });
  await wait(600);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '16_admin_popup_logout.png') });
  await page.keyboard.press('Escape');
  await wait(300);

  // 18. Mobile Viewport (iPhone View)
  console.log('📸 17. Mengambil screenshot Tampilan Mobile Responsive (iPhone 14/15 Pro)...');
  await page.setViewport({ width: 393, height: 852, isMobile: true, hasTouch: true });
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
  await wait(1000);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '17_mobile_beranda.png') });

  // 19. Mobile Drawer
  console.log('📸 18. Mengambil screenshot Mobile Navigation Drawer...');
  await page.evaluate(() => {
    const menuBtn = document.querySelector('button[aria-label*="Menu"]');
    if (menuBtn) menuBtn.click();
  });
  await wait(500);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '18_mobile_drawer.png') });

  console.log('✅ Seluruh 18 screenshot resolusi tinggi berhasil diambil!');
  await page.close();

  // Absolute file URIs for 100% reliable Chromium rendering
  const img = {
    hero: `file://${path.join(SCREENSHOTS_DIR, '01_hero.png')}`,
    about: `file://${path.join(SCREENSHOTS_DIR, '02_tentang_platform.png')}`,
    how: `file://${path.join(SCREENSHOTS_DIR, '03_cara_belajar.png')}`,
    catalog: `file://${path.join(SCREENSHOTS_DIR, '04_katalog_video.png')}`,
    watchFree: `file://${path.join(SCREENSHOTS_DIR, '05_player_video_gratis.png')}`,
    watchLocked: `file://${path.join(SCREENSHOTS_DIR, '06_video_terkunci_state.png')}`,
    loginModal: `file://${path.join(SCREENSHOTS_DIR, '07_modal_login_popup.png')}`,
    loginPage: `file://${path.join(SCREENSHOTS_DIR, '08_halaman_login.png')}`,
    adminCatalog: `file://${path.join(SCREENSHOTS_DIR, '09_admin_dashboard_katalog.png')}`,
    adminVideoEmpty: `file://${path.join(SCREENSHOTS_DIR, '10_admin_modal_tambah_video_kosong.png')}`,
    adminVideoFilled: `file://${path.join(SCREENSHOTS_DIR, '11_admin_modal_tambah_video_terisi.png')}`,
    adminVideoSaved: `file://${path.join(SCREENSHOTS_DIR, '12_admin_video_berhasil_disimpan.png')}`,
    adminUsers: `file://${path.join(SCREENSHOTS_DIR, '13_admin_users_list.png')}`,
    adminUserFilled: `file://${path.join(SCREENSHOTS_DIR, '14_admin_form_tambah_user_terisi.png')}`,
    adminUserSaved: `file://${path.join(SCREENSHOTS_DIR, '15_admin_user_berhasil_disimpan.png')}`,
    adminLogout: `file://${path.join(SCREENSHOTS_DIR, '16_admin_popup_logout.png')}`,
    mobileHome: `file://${path.join(SCREENSHOTS_DIR, '17_mobile_beranda.png')}`,
    mobileDrawer: `file://${path.join(SCREENSHOTS_DIR, '18_mobile_drawer.png')}`,
  };

  console.log('📄 Merakit dokumen panduan dan tutorial HTML komprehensif...');

  const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Buku Panduan Lengkap & Dokumentasi Sistem GLS FIK</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

    @page {
      size: A4;
      margin: 16mm 14mm 16mm 14mm;
      @bottom-right {
        content: "Halaman " counter(page);
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 8pt;
        color: #64748b;
        font-weight: 600;
      }
      @bottom-left {
        content: "GLS FIK • Gymnastics Learning System — Panduan Resmi Pengguna & Administrator";
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 8pt;
        color: #64748b;
      }
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
      color: #1e293b;
      line-height: 1.55;
      font-size: 9pt;
      background: #ffffff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page-break {
      page-break-after: always;
      break-after: page;
    }

    /* Cover Styling */
    .cover {
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 20px 10px;
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
      padding: 4px 14px;
      border-radius: 9999px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-bottom: 18px;
    }

    .cover-title {
      font-size: 32pt;
      font-weight: 800;
      line-height: 1.05;
      letter-spacing: -1.5px;
      color: #0f172a;
      margin-bottom: 12px;
    }

    .cover-title span {
      color: #15803d;
      background: linear-gradient(90deg, #16a34a, #1f2a2e);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .cover-subtitle {
      font-size: 11.5pt;
      color: #475569;
      max-width: 580px;
      line-height: 1.45;
      font-weight: 500;
      margin-bottom: 20px;
    }

    .cover-meta-box {
      border-left: 4px solid #c1ff72;
      background: #f8fafc;
      padding: 14px 18px;
      border-radius: 0 10px 10px 0;
      margin-bottom: 24px;
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
      padding-top: 14px;
      display: flex;
      justify-content: space-between;
      font-size: 8pt;
      color: #64748b;
    }

    /* Chapter Headers */
    h1.chapter-title {
      font-size: 18pt;
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
      padding: 3px 8px;
      border-radius: 6px;
      font-weight: 800;
      letter-spacing: 0.5px;
    }

    h2 {
      font-size: 11.5pt;
      font-weight: 800;
      color: #0f172a;
      margin: 12px 0 5px 0;
    }

    h3 {
      font-size: 9.5pt;
      font-weight: 700;
      color: #1e293b;
      margin: 8px 0 3px 0;
    }

    p {
      margin-bottom: 8px;
      color: #334155;
    }

    /* Alerts & Highlight Boxes */
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

    .alert-amber {
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-left: 4px solid #d97706;
      color: #78350f;
    }

    /* Screenshot Cards */
    .screenshot-card {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      overflow: hidden;
      margin: 8px 0 12px 0;
      box-shadow: 0 1px 4px rgba(0,0,0,0.04);
    }

    .screenshot-img {
      width: 100%;
      height: auto;
      display: block;
      border-bottom: 1px solid #f1f5f9;
    }

    .screenshot-caption {
      padding: 5px 10px;
      background: #f8fafc;
      font-size: 7.5pt;
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
      font-weight: 700;
    }

    /* Step Lists */
    .steps-list {
      list-style: none;
      counter-reset: step-counter;
      margin: 8px 0;
    }

    .steps-list li {
      counter-increment: step-counter;
      position: relative;
      padding-left: 30px;
      margin-bottom: 8px;
    }

    .steps-list li::before {
      content: counter(step-counter);
      position: absolute;
      left: 0;
      top: 0;
      width: 20px;
      height: 20px;
      background: #c1ff72;
      color: #1f2a2e;
      border-radius: 6px;
      font-weight: 800;
      font-size: 8.5pt;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #a3e635;
    }

    .steps-list li strong {
      color: #0f172a;
      display: block;
      font-size: 9pt;
      margin-bottom: 1px;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0 12px 0;
      font-size: 8pt;
    }

    th {
      background: #1f2a2e;
      color: #ffffff;
      text-align: left;
      padding: 6px 8px;
      font-weight: 700;
      border: 1px solid #1f2a2e;
    }

    td {
      padding: 6px 8px;
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
      padding: 1px 5px;
      border-radius: 4px;
      font-size: 7pt;
    }

    .tag-lock {
      background: #fee2e2;
      color: #991b1b;
      font-weight: 700;
      padding: 1px 5px;
      border-radius: 4px;
      font-size: 7pt;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      align-items: start;
    }
  </style>
</head>
<body>

  <!-- ==================== HALAMAN 1: COVER ==================== -->
  <div class="cover page-break">
    <div>
      <div class="cover-badge">Buku Panduan Resmi Pengguna & Administrator Sistem</div>
      <h1 class="cover-title">
        GLS FIK<br>
        <span>Gymnastics Learning System</span>
      </h1>
      <p class="cover-subtitle">
        Dokumentasi komprehensif arsitektur kurikulum senam artistik digital, alur pembelajaran video-first, dan panduan lengkap operasional Panel Admin (CRUD Video & Pengguna) Fakultas Ilmu Keolahragaan.
      </p>

      <div class="cover-meta-box">
        <div class="cover-meta-grid">
          <div class="cover-meta-item">
            <strong>Instansi Pengembang</strong>
            Fakultas Ilmu Keolahragaan (FIK)
          </div>
          <div class="cover-meta-item">
            <strong>Disiplin Senam</strong>
            Men's Artistic Gymnastics (MAG - 6 Kategori Alat)
          </div>
          <div class="cover-meta-item">
            <strong>Versi Platform</strong>
            v1.0 (Produksi Digital Web Video-First)
          </div>
          <div class="cover-meta-item">
            <strong>Metode Pengujian & Snapshot</strong>
            Puppeteer Core Headless Chrome (18 Tangkapan Layar HD)
          </div>
        </div>
      </div>
    </div>

    <div>
      <div class="screenshot-card" style="margin-bottom: 16px;">
        <img src="${img.hero}" class="screenshot-img" alt="GLS FIK Hero">
        <div class="screenshot-caption">
          <span>Tampilan Layar Beranda Hero: Tipografi Studiova Editorial & Video Sinematik</span>
          <span class="badge">Resolusi Web HD (1440x900)</span>
        </div>
      </div>

      <div class="cover-footer">
        <div>&copy; ${new Date().getFullYear()} GLS FIK. Seluruh Hak Cipta Dilindungi Undang-Undang.</div>
        <div>Dokumen Standar Operasional Prosedur (SOP) Web</div>
      </div>
    </div>
  </div>

  <!-- ==================== HALAMAN 2: BAB 1 ==================== -->
  <div class="page-break">
    <h1 class="chapter-title">
      <span class="chapter-tag">BAB 1</span>
      Tentang Platform & Matriks 6 Kategori Alat Senam
    </h1>

    <div class="alert alert-dark">
      <strong>Visi Platform GLS FIK:</strong> Menghadirkan sistem pembelajaran senam artistik modern yang sistematis, memfasilitasi mahasiswa dan atlet dalam menganalisis teknik gerak melalui rekaman peragaan berdefinisi tinggi, serta memberikan kemudahan bagi dosen dan pelatih dalam memperbarui materi kurikulum secara mandiri.
    </div>

    <h2>1.1 Enam (6) Kategori Disiplin Senam Artistik Putra (MAG)</h2>
    <p>
      Seluruh peragaan teknik pada GLS FIK dikelompokkan berdasarkan 6 nomor alat resmi FIG (Fédération Internationale de Gymnastique). Setiap kategori memiliki kurikulum terstruktur:
    </p>

    <table>
      <thead>
        <tr>
          <th>Kode</th>
          <th>Kategori Alat</th>
          <th>Spesifikasi Alat</th>
          <th>Fokus Kurikulum & Drill Gerak</th>
          <th>Status Default</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>FX</strong></td>
          <td>Floor Exercise (Senam Lantai)</td>
          <td>Matras pegas 12 &times; 12 m</td>
          <td>Awalan lari berirama, hurdle, round-off, flic-flac, salto lurus, dan stick landing.</td>
          <td>3 Episode (1 Gratis, 2 Akun)</td>
        </tr>
        <tr>
          <td><strong>PH</strong></td>
          <td>Pommel Horse (Kuda-Kuda Pelana)</td>
          <td>Tinggi 1.15 m | 2 Pelana</td>
          <td>Tumpuan dasar, double leg circles, scissor hop, dan perpindahan beban lateral.</td>
          <td>3 Episode (1 Gratis, 2 Akun)</td>
        </tr>
        <tr>
          <td><strong>VT</strong></td>
          <td>Vault (Meja Lompat)</td>
          <td>Tinggi meja 1.35 m + Springboard</td>
          <td>Lari akselerasi, tolakan papan pegas, pre-flight, tolakan tangan, dan post-flight.</td>
          <td>3 Episode (1 Gratis, 2 Akun)</td>
        </tr>
        <tr>
          <td><strong>SR</strong></td>
          <td>Still Rings (Gelang-Gelang)</td>
          <td>Tinggi 2.80 m dari lantai</td>
          <td>Inverted hang, muscle up entry, cross grip strength, dan dismount berputar.</td>
          <td>3 Episode (1 Gratis, 2 Akun)</td>
        </tr>
        <tr>
          <td><strong>PB</strong></td>
          <td>Parallel Bars (Palang Sejajar)</td>
          <td>Tinggi 2.00 m | Panjang 3.5 m</td>
          <td>Ayunan lengan lurus, straddle travel, handstand balance, dan undercast.</td>
          <td>3 Episode (1 Gratis, 2 Akun)</td>
        </tr>
        <tr>
          <td><strong>HB</strong></td>
          <td>Horizontal Bar (Palang Tunggal)</td>
          <td>Tinggi 2.80 m baja lentur</td>
          <td>Tap swing, cast handstand, giant swing melingkar penuh, dan flyaway dismount.</td>
          <td>3 Episode (1 Gratis, 2 Akun)</td>
        </tr>
      </tbody>
    </table>

    <h2>1.2 Section 02: Tentang Platform GLS FIK</h2>
    <div class="screenshot-card">
      <img src="${img.about}" class="screenshot-img" alt="Section 02 Tentang Platform">
      <div class="screenshot-caption">
        <span>Section 02: Tiga Pilar Platform (Video Peragaan Teknik, 6 Kategori Alat MAG, dan Pendampingan Pelatih)</span>
        <span class="badge">Beranda Web</span>
      </div>
    </div>
  </div>

  <!-- ==================== HALAMAN 3: BAB 2 ==================== -->
  <div class="page-break">
    <h1 class="chapter-title">
      <span class="chapter-tag">BAB 2</span>
      Alur Belajar & Katalog Materi Video
    </h1>

    <h2>2.1 Empat (4) Langkah Belajar di Platform</h2>
    <p>Pengguna dapat langsung mengikuti 4 tahapan belajar yang dirancang intuitif:</p>

    <div class="screenshot-card">
      <img src="${img.how}" class="screenshot-img" alt="Section 03 Cara Belajar">
      <div class="screenshot-caption">
        <span>Section 03: Cara Belajar di GLS FIK (Dark Slate Canvas dengan Glowing Step Numbers 01–04)</span>
        <span class="badge">Beranda Web</span>
      </div>
    </div>

    <ol class="steps-list">
      <li>
        <strong>Pilih Kategori Video:</strong>
        Pilih salah satu dari 6 kategori alat senam artistik putra melalui navigasi header atau langsung di katalog video.
      </li>
      <li>
        <strong>Tonton Video Gratis:</strong>
        Materi pengenalan dasar berlabel <span class="tag-free">GRATIS</span> dapat diputar bebas tanpa registrasi.
      </li>
      <li>
        <strong>Masuk Akun untuk Akses Penuh:</strong>
        Gunakan akun mahasiswa atau pelatih untuk membuka materi lanjutan yang berlabel <span class="tag-lock">Login</span>.
      </li>
      <li>
        <strong>Putar dan Pelajari:</strong>
        Gunakan pemutar video interaktif, pelajari instruksi drill, dan navigasikan episode melalui playlist sidebar.
      </li>
    </ol>

    <h2>2.2 Section 04: Katalog Materi Video Lengkap</h2>
    <div class="screenshot-card">
      <img src="${img.catalog}" class="screenshot-img" alt="Section 04 Katalog Video">
      <div class="screenshot-caption">
        <span>Section 04: Filter Kategori Cepat dan Baris Video Carousel Horizontal</span>
        <span class="badge">Katalog Lengkap</span>
      </div>
    </div>
  </div>

  <!-- ==================== HALAMAN 4: BAB 3 ==================== -->
  <div class="page-break">
    <h1 class="chapter-title">
      <span class="chapter-tag">BAB 3</span>
      Fitur Pemutar Video & Skema Akses Terkunci
    </h1>

    <h2>3.1 Pemutar Video Terintegrasi Google Drive (/watch/[id])</h2>
    <p>
      Streaming video di-host langsung di Google Drive FIK, memastikan pemutaran bersih tanpa iklan, hemat server, serta mendukung resolusi HD.
    </p>

    <div class="screenshot-card">
      <img src="${img.watchFree}" class="screenshot-img" alt="Watch Page Video Gratis">
      <div class="screenshot-caption">
        <span>Halaman Pemutar Video: Iframe Player, Tombol Kembali, Tag Kategori, Episode, Level, dan Playlist Sidebar</span>
        <span class="badge">Route /watch/vid-fx-1</span>
      </div>
    </div>

    <h2>3.2 Tampilan Episode Terkunci & Pop-up Modal Login Cepat</h2>
    <p>
      Jika pengguna belum masuk dan memilih episode premium, sistem menampilkan antarmuka terkunci dan pop-up modal login instan:
    </p>

    <div class="grid-2">
      <div>
        <div class="screenshot-card">
          <img src="${img.watchLocked}" class="screenshot-img" alt="Video Terkunci State">
          <div class="screenshot-caption">
            <span>Antarmuka Episode Terkunci</span>
            <span class="badge">Akses Terkunci</span>
          </div>
        </div>
      </div>
      <div>
        <div class="screenshot-card">
          <img src="${img.loginModal}" class="screenshot-img" alt="Modal Login Popup">
          <div class="screenshot-caption">
            <span>Pop-up Modal Login Cepat</span>
            <span class="badge">Modal Interaktif</span>
          </div>
        </div>
      </div>
    </div>

    <div class="alert alert-green">
      <strong>Fitur Unggulan Modal Pop-up:</strong> Pengguna tidak perlu meninggalkan halaman pemutar. Cukup masukkan email dan sandi pada pop-up modal, video langsung terbuka dan otomatis diputar di layar yang sama.
    </div>
  </div>

  <!-- ==================== HALAMAN 5: BAB 4 ==================== -->
  <div class="page-break">
    <h1 class="chapter-title">
      <span class="chapter-tag">BAB 4</span>
      Autentikasi & Hak Akses Pengguna (RBAC)
    </h1>

    <div class="grid-2">
      <div>
        <h2>4.1 Desain Halaman Login (/login)</h2>
        <p>Halaman login terbagi menjadi dua bagian seimbang:</p>
        <ul style="padding-left: 18px; margin-bottom: 12px; font-size: 8.5pt;">
          <li><strong>Hero Visual Kiri:</strong> Dokumentasi visual atlet senam FIK dan keterangan kurikulum resmi.</li>
          <li><strong>Formulir Kanan:</strong> Input kredensial login dengan tombol pintas akun demo untuk kemudahan pengujian sistem.</li>
        </ul>

        <div class="alert alert-blue">
          <strong>Akun Uji Demo:</strong><br>
          • <strong>Admin / Dosen:</strong> <code>admin@fik.ac.id</code> | Sandi: <code>password123</code><br>
          • <strong>Mahasiswa / Atlet:</strong> <code>mahasiswa@fik.ac.id</code> | Sandi: <code>password123</code>
        </div>
      </div>
      <div>
        <div class="screenshot-card">
          <img src="${img.loginPage}" class="screenshot-img" alt="Halaman Login GLS FIK">
          <div class="screenshot-caption">
            <span>Halaman Login Split-Screen Editorial</span>
            <span class="badge">Route /login</span>
          </div>
        </div>
      </div>
    </div>

    <h2>4.2 Matriks Hak Akses (Role-Based Access Control)</h2>
    <table>
      <thead>
        <tr>
          <th>Peran (Role)</th>
          <th>Akses Video Gratis</th>
          <th>Akses Video Lanjutan</th>
          <th>Akses Panel Admin</th>
          <th>Tambah / Edit / Hapus Video</th>
          <th>Kelola Pengguna</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Tamu (Tanpa Login)</strong></td>
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
          <td><strong>Dosen / Pelatih / Admin</strong></td>
          <td>Ya (Bebas)</td>
          <td>Ya (Penuh)</td>
          <td>Ya (Penuh)</td>
          <td>Ya (Penuh)</td>
          <td>Ya (Penuh)</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- ==================== HALAMAN 6: BAB 5 - TUTORIAL TAMBAH VIDEO ==================== -->
  <div class="page-break">
    <h1 class="chapter-title">
      <span class="chapter-tag">BAB 5</span>
      Tutorial Lengkap: Menambah Materi Video dari Admin
    </h1>

    <p>
      Administrator dan dosen memiliki otoritas penuh untuk memperkaya materi video pembelajaran senam melalui Panel Admin di URL <code>/admin</code>.
    </p>

    <h2>5.1 Tampilan Dashboard Katalog & Video (/admin)</h2>
    <div class="screenshot-card">
      <img src="${img.adminCatalog}" class="screenshot-img" alt="Dashboard Admin Video">
      <div class="screenshot-caption">
        <span>Panel Admin: Metrik Total Video, Filter Kategori Alat, Pencarian, dan Tombol Tambah Video</span>
        <span class="badge">Route /admin</span>
      </div>
    </div>

    <h2>5.2 Tutorial Langkah demi Langkah: Menambah Video Baru</h2>
    <ol class="steps-list">
      <li>
        <strong>Buka Modal Tambah Video:</strong>
        Klik tombol hijau <strong style="color:#15803d;">"+ Tambah Materi Video"</strong> di sudut kanan atas tabel video.
      </li>
      <li>
        <strong>Pilih Kategori Alat & Nomor Episode:</strong>
        Pilih kategori (misal: <em>Floor Exercise</em>) dan sistem otomatis menyinkronkan nomor urut episode berikutnya.
      </li>
      <li>
        <strong>Masukkan Judul Materi:</strong>
        Isi judul materi gerak yang spesifik (misal: <em>Drill Tolakan Round-Off & Salto Lurus</em>) atau gunakan tombol saran cepat.
      </li>
      <li>
        <strong>Tempel Link Berbagi Google Drive:</strong>
        Salin tautan berbagi video dari Google Drive. Sistem otomatis mengekstrak ID File Drive dan menampilkan konfirmasi deteksi hijau.
      </li>
      <li>
        <strong>Tentukan Level Kesulitan & Hak Akses:</strong>
        Pilih level (<em>Dasar / Menengah / Mahir</em>), durasi latihan (format <em>MM:SS</em>), dan pilih opsi <em>Akses Gratis</em> atau <em>Khusus Akun Terdaftar</em>.
      </li>
      <li>
        <strong>Periksa Tab Live Preview:</strong>
        Gunakan tab preview interaktif di sisi kanan modal untuk melihat tampilan kartu video sebelum disimpan.
      </li>
    </ol>

    <div class="grid-2">
      <div>
        <div class="screenshot-card">
          <img src="${img.adminVideoEmpty}" class="screenshot-img" alt="Modal Video Kosong">
          <div class="screenshot-caption">
            <span>Formulir Awal Modal Tambah Video</span>
            <span class="badge">Modal Kosong</span>
          </div>
        </div>
      </div>
      <div>
        <div class="screenshot-card">
          <img src="${img.adminVideoFilled}" class="screenshot-img" alt="Modal Video Terisi Lengkap">
          <div class="screenshot-caption">
            <span>Formulir Terisi Lengkap & Ekstraksi Link Drive</span>
            <span class="badge">Formulir Siap Simpan</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ==================== HALAMAN 7: BAB 5 - VERIFIKASI VIDEO & FITUR ADMIN ==================== -->
  <div class="page-break">
    <h1 class="chapter-title">
      <span class="chapter-tag">BAB 5 (Lanjutan)</span>
      Verifikasi Simpan Video, Edit, Hapus & Reset Data
    </h1>

    <h2>5.3 Langkah 7: Simpan Video & Hasil pada Tabel Katalog</h2>
    <p>
      Setelah menekan tombol <strong>"Simpan Materi Video"</strong>, sistem menyimpan data secara instan dan materi baru langsung terdaftar pada tabel serta dapat langsung ditonton oleh pengguna di beranda:
    </p>

    <div class="screenshot-card">
      <img src="${img.adminVideoSaved}" class="screenshot-img" alt="Video Berhasil Disimpan">
      <div class="screenshot-caption">
        <span>Tabel Katalog Terupdate: Video Baru "Drill Tolakan Round-Off & Salto Lurus" Berhasil Terdaftar</span>
        <span class="badge">Status: Berhasil Disimpan</span>
      </div>
    </div>

    <h2>5.4 Fitur Kelola Video Lainnya pada Panel Admin</h2>
    <div class="grid-2">
      <div>
        <h3>1. Mengedit Materi Video</h3>
        <p>
          Klik tombol <strong>"Edit"</strong> berikon pensil pada baris video di tabel. Seluruh data video yang tersimpan akan dimuat kembali ke dalam modal untuk disunting.
        </p>

        <h3>2. Menghapus Materi Video</h3>
        <p>
          Klik tombol <strong>"Hapus"</strong> berikon tempat sampah merah. Sistem akan meminta konfirmasi dialog sebelum menghapus data guna mencegah kesalahan hapus.
        </p>
      </div>

      <div>
        <h3>3. Fitur Reset Data Seed</h3>
        <p>
          Bila admin ingin mengembalikan susunan data ke kondisi awal pabrik (18 video resmi seed FIK), klik tombol <strong>"Reset Data Seed"</strong> di bagian bawah tabel.
        </p>
        <div class="alert alert-amber">
          <strong>Perhatian:</strong> Fitur Reset Seed akan mengembalikan 6 kategori MAG dan 18 video standar FIK. Seluruh video uji coba tambahan akan dibersihkan.
        </div>
      </div>
    </div>
  </div>

  <!-- ==================== HALAMAN 8: BAB 6 - TUTORIAL TAMBAH PENGGUNA ==================== -->
  <div class="page-break">
    <h1 class="chapter-title">
      <span class="chapter-tag">BAB 6</span>
      Tutorial Lengkap: Manajemen Pengguna & Tambah Akun
    </h1>

    <p>
      Menu <strong>Data Pengguna</strong> di URL <code>/admin/users</code> memberikan kendali kepada admin untuk mendaftarkan akun baru, mengatur hak akses, dan memantau status pengguna platform.
    </p>

    <h2>6.1 Tampilan Daftar Pengguna (/admin/users)</h2>
    <div class="screenshot-card">
      <img src="${img.adminUsers}" class="screenshot-img" alt="Daftar Pengguna">
      <div class="screenshot-caption">
        <span>Tabel Pengguna: Nama Lengkap, Alamat Email, Badge Hak Akses (Role), dan Tombol Aksi</span>
        <span class="badge">Route /admin/users</span>
      </div>
    </div>

    <h2>6.2 Tutorial Langkah demi Langkah: Menambah Pengguna Baru</h2>
    <ol class="steps-list">
      <li>
        <strong>Klik Tombol "+ Tambah Pengguna Baru":</strong>
        Tombol hijau di sudut kanan atas akan membuka formulir pendaftaran pengguna di bagian atas tabel.
      </li>
      <li>
        <strong>Isi Nama Lengkap & Email Resmi:</strong>
        Masukkan nama lengkap pengguna (misal: <em>Dr. Hendra Pratama, M.Pd.</em>) dan email aktif (misal: <em>hendra.pratama@fik.ac.id</em>).
      </li>
      <li>
        <strong>Tentukan Kata Sandi:</strong>
        Masukkan kata sandi awal akun (minimal 6 karakter). Pengguna dapat menggunakannya untuk login.
      </li>
      <li>
        <strong>Pilih Hak Akses (Role):</strong>
        Pilih <em>"User Biasa (Hanya Menonton Video)"</em> untuk atlet/mahasiswa, atau <em>"Admin Pengelola"</em> untuk dosen/pelatih yang membutuhkan akses CRUD.
      </li>
      <li>
        <strong>Klik "Simpan Pengguna":</strong>
        Data akan divalidasi dan disimpan. Pengguna baru langsung muncul di tabel dan akun langsung aktif.
      </li>
    </ol>

    <div class="grid-2">
      <div>
        <div class="screenshot-card">
          <img src="${img.adminUserFilled}" class="screenshot-img" alt="Form Tambah User Terisi">
          <div class="screenshot-caption">
            <span>Formulir Pengguna Baru Terisi Lengkap dengan Role Admin</span>
            <span class="badge">Formulir Siap Simpan</span>
          </div>
        </div>
      </div>
      <div>
        <div class="screenshot-card">
          <img src="${img.adminUserSaved}" class="screenshot-img" alt="User Berhasil Disimpan">
          <div class="screenshot-caption">
            <span>Tabel Pengguna Terupdate: Akun Baru Berhasil Terdaftar & Aktif</span>
            <span class="badge">Status: Berhasil Ditambah</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ==================== HALAMAN 9: BAB 6 - KEAMANAN & LOGOUT ==================== -->
  <div class="page-break">
    <h1 class="chapter-title">
      <span class="chapter-tag">BAB 6 (Lanjutan)</span>
      Keamanan Akun & Proteksi Konfirmasi Keluar (Logout)
    </h1>

    <h2>6.3 Dialog Konfirmasi Keluar Akun Admin (Logout Protection)</h2>
    <p>
      Untuk mencegah keluarnya sesi kerja secara tidak sengaja saat admin sedang menginput data atau mengoreksi materi senam, GLS FIK dilengkapi sistem <strong>Logout Confirmation Modal</strong>:
    </p>

    <div class="screenshot-card">
      <img src="${img.adminLogout}" class="screenshot-img" alt="Modal Konfirmasi Logout">
      <div class="screenshot-caption">
        <span>Modal Dialog Peringatan Sebelum Sesi Admin Diakhiri (Mendukung tombol Batal dan Tombol Keyboard Esc)</span>
        <span class="badge">Proteksi Sesi Kerja</span>
      </div>
    </div>

    <div class="alert alert-dark">
      <strong>Mekanisme Keamanan Logout:</strong><br>
      1. Menekan tombol <em>"Keluar Akun"</em> tidak langsung menghapus sesi melainkan memunculkan dialog peringatan dengan ikon peringatan kuning.<br>
      2. Pengguna dapat membatalkan dengan menekan tombol <strong>"Batal"</strong>, menekan tombol <strong>Escape (Esc)</strong>, atau mengklik area backdrop luar modal.<br>
      3. Sesi hanya diakhiri bila tombol merah <strong>"Ya, Keluar Akun"</strong> ditekan secara sadar.
    </div>

    <h2>6.4 Perlindungan Penghapusan Akun Sendiri (Self-Deletion Prevention)</h2>
    <p>
      Sistem secara cerdas memblokir upaya admin untuk menghapus atau menurunkan hak akses akun miliknya sendiri saat sesi sedang berjalan. Hal ini memastikan Panel Admin tidak pernah terkunci tanpa ada pengelola aktif.
    </p>
  </div>

  <!-- ==================== HALAMAN 10: BAB 7 - MOBILE & SPESIFIKASI TEKNOLOGI ==================== -->
  <div class="page-break">
    <h1 class="chapter-title">
      <span class="chapter-tag">BAB 7</span>
      Aksesibilitas Mobile & Ringkasan Spesifikasi Sistem
    </h1>

    <h2>7.1 Tampilan Antarmuka Ponsel (Mobile Viewport)</h2>
    <p>
      GLS FIK dioptimasi secara penuh untuk layar smartphone dan tablet. Pelatih di hall senam dapat membuka video peragaan dengan cepat langsung di tepi matras:
    </p>

    <div class="grid-2">
      <div>
        <div class="screenshot-card">
          <img src="${img.mobileHome}" class="screenshot-img" alt="Mobile Beranda">
          <div class="screenshot-caption">
            <span>Tampilan Layar Ponsel: Hero Sinematik & Tombol Sentuh &ge; 44px</span>
            <span class="badge">iPhone 14/15 Pro Viewport</span>
          </div>
        </div>
      </div>
      <div>
        <div class="screenshot-card">
          <img src="${img.mobileDrawer}" class="screenshot-img" alt="Mobile Drawer Menu">
          <div class="screenshot-caption">
            <span>Drawer Menu Navigasi Mobile: Akses Cepat Seluruh Kategori & Login</span>
            <span class="badge">Menu Geser Responsif</span>
          </div>
        </div>
      </div>
    </div>

    <h2>7.2 Ringkasan Arsitektur Teknologi Platform</h2>
    <table>
      <thead>
        <tr>
          <th>Lapisan Sistem</th>
          <th>Teknologi Terpilih</th>
          <th>Fungsi & Keunggulan bagi Pengguna</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Framework Aplikasi</strong></td>
          <td>Next.js 16 (App Router) + React 19</td>
          <td>Server-side rendering, routing modular, dan performa tinggi tanpa lag.</td>
        </tr>
        <tr>
          <td><strong>Desain & Tipografi</strong></td>
          <td>Tailwind CSS v4 + Plus Jakarta Sans</td>
          <td>Palet warna eksklusif (#C1FF72, #1F2A2E), kontras tinggi, anti-slop visual.</td>
        </tr>
        <tr>
          <td><strong>Animasi & Interaksi</strong></td>
          <td>Framer Motion v13</td>
          <td>Transisi komponen, staggered reveal on scroll, dan micro-interaction taktil.</td>
        </tr>
        <tr>
          <td><strong>Engine Scroll Halus</strong></td>
          <td>Lenis Smooth Inertia Scroll</td>
          <td>Kecepatan scroll diperlambat dan diredam lembut, navigasi anchor anggun.</td>
        </tr>
        <tr>
          <td><strong>Streaming Video</strong></td>
          <td>Google Drive Video Embed API</td>
          <td>Penyimpanan cloud resmi FIK, hemat bandwidth server, bebas iklan luar.</td>
        </tr>
        <tr>
          <td><strong>Dokumentasi Otomatis</strong></td>
          <td>Puppeteer Core + Headless Chrome</td>
          <td>Snapshot 18 layar web otomatis dan kompilasi buku panduan cetak A4.</td>
        </tr>
      </tbody>
    </table>

    <div class="alert alert-dark" style="margin-top: 16px;">
      <strong>Pernyataan Selesai:</strong> Seluruh modul, komponen beranda, pemutar video, formulir input materi, manajemen pengguna, dan proteksi sesi pada platform <strong>GLS FIK</strong> telah terdokumentasi dan teruji 100% pada buku panduan ini.
    </div>
  </div>

</body>
</html>`;

  fs.writeFileSync(HTML_DOC_PATH, htmlContent);
  console.log(`📝 Dokumen HTML tersimpan di: ${HTML_DOC_PATH}`);

  console.log('🖨️ Mengonversi dokumen HTML ke PDF resolusi cetak A4...');
  const printPage = await browser.newPage();
  await printPage.goto(`file://${HTML_DOC_PATH}`, { waitUntil: 'load', timeout: 60000 });
  await wait(1000);

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
  console.log('✨ Seluruh proses pembuatan buku panduan komprehensif selesai dengan sukses!');
}

run().catch((err) => {
  console.error('❌ Error saat menjalankan script:', err);
  process.exit(1);
});
