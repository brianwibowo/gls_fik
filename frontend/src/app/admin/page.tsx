'use client';

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Plus, Pencil, Trash2, X, Eye, ChevronDown, ChevronUp, Info, Clock } from 'lucide-react';
import { apiCreateCategory, apiCreateVideo, apiDeleteCategory, apiDeleteVideo, apiGetCategories, apiGetVideos, apiUpdateCategory, apiUpdateVideo } from '@/lib/api';
import { extractDriveFileId } from '@/lib/utils';
import { videoLevelLabel } from '@/lib/video-level';
import { prepareCategoryCover } from '@/lib/category-cover';
import { CategoryCover } from '@/components/CategoryCover';
import { VideoThumbnail } from '@/components/VideoThumbnail';
import type { Category, Video } from '@/lib/types';
import styles from './page.module.css';

const emptyEpisode = { categoryId: '', title: '', description: '', driveLink: '', duration: '', level: 'Level 1', episodeNum: 1, isFree: false, checklistText: '' };
type EpisodeForm = typeof emptyEpisode;
type CategoryForm = { id: string | null; name: string; description: string; thumbnail: string; coverData?: string };

function Modal({ title, onClose, children, wide = false }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => { dialog?.close(); };
  }, []);
  return <dialog ref={ref} className={`${styles.dialog} ${wide ? styles.wide : ''}`} aria-labelledby="editor-title" onCancel={event => { event.preventDefault(); onClose(); }}>
    <header className={styles.modalHeader}><h2 id="editor-title">{title}</h2><button type="button" className={styles.iconButton} aria-label="Tutup formulir" onClick={onClose}><X size={20} /></button></header>
    {children}
  </dialog>;
}

function AdminVideoManagement() {
  const params = useSearchParams();
  const openedFromURL = useRef(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [notice, setNotice] = useState('');
  const [actionError, setActionError] = useState('');
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState('');
  const [access, setAccess] = useState('all');
  const [level, setLevel] = useState('all');
  const [sort, setSort] = useState('order');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [categoryForm, setCategoryForm] = useState<CategoryForm | null>(null);
  const [initialCategory, setInitialCategory] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [readingImage, setReadingImage] = useState(false);
  const imageRequest = useRef(0);
  const [episodeForm, setEpisodeForm] = useState<EpisodeForm | null>(null);
  const [initialEpisode, setInitialEpisode] = useState('');
  const [editingEpisode, setEditingEpisode] = useState<Video | null>(null);
  const [episodeError, setEpisodeError] = useState('');
  const [previewPlayer, setPreviewPlayer] = useState(false);
  const [showAccessHelp, setShowAccessHelp] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setLoadError('');
    try {
      const [cats, vids] = await Promise.all([apiGetCategories(), apiGetVideos()]);
      setCategories(cats); setVideos(vids);
    } catch (error) { setLoadError(error instanceof Error ? error.message : 'Materi gagal dimuat.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    if (!notice) return;
    const timeout = setTimeout(() => setNotice(''), 6000);
    return () => clearTimeout(timeout);
  }, [notice]);

  const nextEpisode = useCallback((categoryId: string, exceptId?: string) => Math.max(0, ...videos.filter(video => video.categoryId === categoryId && video.id !== exceptId).map(video => video.episodeNum)) + 1, [videos]);
  const addEpisode = useCallback((categoryId: string) => {
    const episodeNum = nextEpisode(categoryId);
    const form = { ...emptyEpisode, categoryId, episodeNum, level: `Level ${Math.min(episodeNum, 3)}`, isFree: episodeNum === 1 };
    setEpisodeForm(form); setInitialEpisode(JSON.stringify(form)); setEditingEpisode(null); setEpisodeError(''); setPreviewPlayer(false); setShowAccessHelp(false);
  }, [nextEpisode]);
  useEffect(() => {
    if (params.get('action') === 'new' && categories.length > 0 && !openedFromURL.current) {
      openedFromURL.current = true; addEpisode(categories[0].id);
    }
  }, [params, categories, addEpisode]);

  function editEpisode(video: Video) {
    const form = { categoryId: video.categoryId, title: video.title, description: video.description, driveLink: video.driveLink || video.driveFileId, duration: video.duration, level: videoLevelLabel(video.level), episodeNum: video.episodeNum, isFree: video.isFree, checklistText: (video.checklistItems || []).map(item => item.name).join('\n') };
    setEpisodeForm(form); setInitialEpisode(JSON.stringify(form)); setEditingEpisode(video); setEpisodeError(''); setPreviewPlayer(false); setShowAccessHelp(false);
  }
  function openCategory(category?: Category) {
    const form = { id: category?.id ?? null, name: category?.name || '', description: category?.description || '', thumbnail: category?.thumbnail || '' };
    setCategoryForm(form); setInitialCategory(JSON.stringify(form)); setCategoryError('');
  }
  function closeCategory() {
    if (busy) return;
    if (JSON.stringify(categoryForm) !== initialCategory && !confirm('Tutup formulir dan buang perubahan kategori yang belum disimpan?')) return;
    imageRequest.current++; setCategoryForm(null); setReadingImage(false);
  }
  function closeEpisode() {
    if (busy) return;
    if (JSON.stringify(episodeForm) !== initialEpisode && !confirm('Tutup formulir dan buang perubahan episode yang belum disimpan?')) return;
    setEpisodeForm(null);
  }
  async function chooseCover(file?: File) {
    if (!file) return;
    const request = ++imageRequest.current;
    setReadingImage(true); setCategoryError('');
    try {
      const data = await prepareCategoryCover(file);
      if (request === imageRequest.current) setCategoryForm(form => form ? { ...form, coverData: data, thumbnail: data } : null);
    } catch (error) { if (request === imageRequest.current) setCategoryError(error instanceof Error ? error.message : 'Gambar gagal dibaca.'); }
    finally { if (request === imageRequest.current) setReadingImage(false); }
  }
  async function saveCategory(event: FormEvent) {
    event.preventDefault();
    if (!categoryForm || busy || readingImage) return;
    setBusy(true); setCategoryError('');
    const payload = { name: categoryForm.name.trim(), description: categoryForm.description.trim(), coverData: categoryForm.coverData };
    try {
      const saved = categoryForm.id !== null ? await apiUpdateCategory(categoryForm.id, payload) : await apiCreateCategory(payload);
      if (categoryForm.id === null) {
        setCategories(current => [...current, saved]); setQuery(''); setAccess('all'); setLevel('all'); setSort('order'); setPage(Math.ceil((categories.length + 1) / pageSize));
      } else setCategories(current => current.map(category => category.id === saved.id ? saved : category));
      setNotice(categoryForm.id !== null ? 'Kategori berhasil diperbarui.' : 'Kategori ditambahkan pada urutan terakhir.');
      setCategoryForm(null);
    } catch (error) { setCategoryError(error instanceof Error ? error.message : 'Kategori gagal disimpan.'); }
    finally { setBusy(false); }
  }
  async function saveEpisode(event: FormEvent) {
    event.preventDefault();
    if (!episodeForm || busy) return;
    setEpisodeError('');
    const driveFileId = extractDriveFileId(episodeForm.driveLink.trim());
    if (!/^[a-zA-Z0-9_-]{10,}$/.test(driveFileId)) { setEpisodeError('Masukkan tautan atau ID video Google Drive yang valid.'); return; }
    if (!episodeForm.title.trim() || !episodeForm.description.trim()) { setEpisodeError('Judul dan deskripsi wajib diisi sesuai isi video.'); return; }
    if (!/^\d{1,3}:[0-5]\d(:[0-5]\d)?$/.test(episodeForm.duration.trim())) { setEpisodeError('Isi durasi dalam format menit:detik, misalnya 04:30, atau jam:menit:detik.'); return; }
    if (videos.some(video => video.id !== editingEpisode?.id && video.categoryId === episodeForm.categoryId && video.episodeNum === episodeForm.episodeNum)) { setEpisodeError('Nomor episode sudah dipakai dalam kategori ini. Pilih nomor lain.'); return; }
    const names = episodeForm.checklistText.split('\n').map(name => name.trim()).filter(Boolean);
    if (names.length > 100 || names.some(name => name.length > 500) || new Set(names).size !== names.length) { setEpisodeError('Checklist maksimal 100 poin berbeda, masing-masing maksimal 500 karakter.'); return; }
    const items = [...(editingEpisode?.checklistItems || [])];
    const checklistItems = names.map(name => {
      const index = items.findIndex(item => item.name.trim() === name);
      return index < 0 ? { id: '', name } : items.splice(index, 1)[0];
    });
    const payload = { ...episodeForm, title: episodeForm.title.trim(), description: episodeForm.description.trim(), duration: episodeForm.duration.trim(), driveFileId, driveLink: `https://drive.google.com/file/d/${driveFileId}/view`, thumbnail: '', checklistItems };
    setBusy(true);
    try {
      const saved = editingEpisode ? await apiUpdateVideo(editingEpisode.id, payload) : await apiCreateVideo(payload);
      setVideos(current => editingEpisode ? current.map(video => video.id === saved.id ? saved : video) : [...current, saved]);
      setNotice(editingEpisode ? 'Episode berhasil diperbarui.' : 'Episode berhasil ditambahkan.'); setEpisodeForm(null);
    } catch (error) { setEpisodeError(error instanceof Error ? error.message : 'Episode gagal disimpan.'); }
    finally { setBusy(false); }
  }
  async function removeCategory(category: Category) {
    const count = videos.filter(video => video.categoryId === category.id).length;
    if (busy || !confirm(`Hapus kategori “${category.name}”${count ? ` beserta ${count} episode dan progres belajar terkait` : ''}? Tindakan ini tidak dapat dibatalkan.`)) return;
    setBusy(true); setActionError('');
    try {
      await apiDeleteCategory(category.id); setCategories(current => current.filter(item => item.id !== category.id)); setVideos(current => current.filter(video => video.categoryId !== category.id)); setNotice('Kategori berhasil dihapus.');
    } catch (error) { setActionError(error instanceof Error ? error.message : 'Kategori gagal dihapus.'); }
    finally { setBusy(false); }
  }
  async function removeEpisode(video: Video) {
    if (busy || !confirm(`Hapus episode “${video.title}” dan progres belajar terkait? Tindakan ini tidak dapat dibatalkan.`)) return;
    setBusy(true); setActionError('');
    try { await apiDeleteVideo(video.id); setVideos(current => current.filter(item => item.id !== video.id)); setNotice('Episode berhasil dihapus.'); }
    catch (error) { setActionError(error instanceof Error ? error.message : 'Episode gagal dihapus.'); }
    finally { setBusy(false); }
  }

  const matchingVideos = useMemo(() => videos.filter(video => (access === 'all' || video.isFree === (access === 'free')) && (level === 'all' || videoLevelLabel(video.level) === level)), [videos, access, level]);
  const text = query.toLowerCase().trim();
  const filtered = categories.filter(category => {
    const matches = matchingVideos.filter(video => video.categoryId === category.id);
    return (access === 'all' && level === 'all' || matches.length > 0) && (!text || `${category.name} ${category.description}`.toLowerCase().includes(text) || matches.some(video => `${video.title} ${video.description}`.toLowerCase().includes(text)));
  }).sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name) : sort === 'episodes' ? videos.filter(video => video.categoryId === b.id).length - videos.filter(video => video.categoryId === a.id).length : a.order - b.order);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pages);
  const driveID = episodeForm ? extractDriveFileId(episodeForm.driveLink.trim()) : '';
  const validDriveID = /^[a-zA-Z0-9_-]{10,}$/.test(driveID) ? driveID : '';
  const selectedCategory = categories.find(category => category.id === episodeForm?.categoryId);
  const changeEpisode = <K extends keyof EpisodeForm>(key: K, value: EpisodeForm[K]) => setEpisodeForm(form => form ? { ...form, [key]: value } : null);

  return <div className={styles.page}>
    <header className={styles.heading}><div><p className={styles.eyebrow}>Kurikulum GCL</p><h1>Kelola materi belajar</h1><p>Atur kategori, episode, dan level latihan senam.</p></div><button className={styles.primary} onClick={() => openCategory()} disabled={busy}><Plus size={18} />Tambah kategori</button></header>
    <dl className={styles.stats}>{[[categories.length, 'Kategori'], [videos.length, 'Episode'], [videos.filter(video => video.isFree).length, 'Akses gratis'], [videos.filter(video => !video.isFree).length, 'Khusus anggota']].map(([value, label]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    {notice && <p className={styles.notice} role="status">{notice}</p>}
    {actionError && <div className={styles.error} role="alert">{actionError}<button type="button" onClick={() => setActionError('')}>Tutup pesan</button></div>}
    <div className={styles.filters}>
      <label className={styles.search}>Cari materi<input type="search" placeholder="Nama kategori atau judul episode" value={query} onChange={event => { setQuery(event.target.value); setPage(1); }} /></label>
      <label>Akses<select value={access} onChange={event => { setAccess(event.target.value); setPage(1); }}><option value="all">Semua akses</option><option value="free">Gratis</option><option value="members">Khusus anggota</option></select></label>
      <label>Level<select value={level} onChange={event => { setLevel(event.target.value); setPage(1); }}><option value="all">Semua level</option>{['Level 1', 'Level 2', 'Level 3'].map(value => <option key={value}>{value}</option>)}</select></label>
      <label>Urutan<select value={sort} onChange={event => { setSort(event.target.value); setPage(1); }}><option value="order">Urutan kategori</option><option value="name">Nama A–Z</option><option value="episodes">Episode terbanyak</option></select></label>
      {(query || access !== 'all' || level !== 'all' || sort !== 'order') && <button type="button" className={styles.secondary} onClick={() => { setQuery(''); setAccess('all'); setLevel('all'); setSort('order'); setPage(1); }}>Hapus filter</button>}
    </div>
    {loading ? <p role="status" className={styles.empty}>Memuat kategori dan episode…</p> : loadError ? <div role="alert" className={styles.error}><p>{loadError}</p><button onClick={load} className={styles.secondary}>Coba lagi</button></div> : <>
      <p className={styles.result}>{filtered.length} kategori • Halaman {currentPage} dari {pages}</p>
      {filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize).map(category => {
        const episodes = matchingVideos.filter(video => video.categoryId === category.id && (!text || `${category.name} ${category.description} ${video.title} ${video.description}`.toLowerCase().includes(text))).sort((a, b) => a.episodeNum - b.episodeNum);
        const total = videos.filter(video => video.categoryId === category.id).length;
        return <section key={category.id} className={styles.category} aria-label={`Kategori ${category.name}`}>
          <header className={styles.categoryHeader}>
            <div className={styles.categoryInfo}><div className={styles.cover}><CategoryCover src={category.thumbnail} name={category.name} /></div><div><h2>{category.name}</h2><p>{total} episode</p>{category.description && <p className={styles.categoryDescription}>{category.description}</p>}</div></div>
            <div className={styles.actions}><button className={styles.dark} disabled={busy} onClick={() => addEpisode(category.id)}><Plus size={17} />Tambah episode</button><button className={styles.iconButton} aria-label={`Edit kategori ${category.name}`} disabled={busy} onClick={() => openCategory(category)}><Pencil size={18} /></button><button className={`${styles.iconButton} ${styles.danger}`} aria-label={`Hapus kategori ${category.name}`} disabled={busy} onClick={() => removeCategory(category)}><Trash2 size={18} /></button><button className={styles.iconButton} aria-expanded={!collapsed[category.id]} aria-controls={`episodes-${category.id}`} aria-label={`${collapsed[category.id] ? 'Buka' : 'Tutup'} daftar episode ${category.name}`} onClick={() => setCollapsed(current => ({ ...current, [category.id]: !current[category.id] }))}>{collapsed[category.id] ? <ChevronDown size={18} /> : <ChevronUp size={18} />}</button></div>
          </header>
          {!collapsed[category.id] && <div id={`episodes-${category.id}`}>
            {episodes.length === 0 ? <div className={styles.empty}><p>{total ? 'Tidak ada episode yang sesuai filter.' : 'Belum ada episode dalam kategori ini.'}</p>{!total && <><p>Tambahkan video materi dari Google Drive.</p><button className={styles.secondary} onClick={() => addEpisode(category.id)}>Tambah episode pertama</button></>}</div> : episodes.map(video => <article key={video.id} className={styles.episode} aria-label={`Episode ${video.episodeNum}: ${video.title}`}>
              <div className={styles.episodeImage}><VideoThumbnail video={video} sizes="160px" /><span>EP {video.episodeNum}</span></div>
              <div className={styles.episodeInfo}><p className={styles.metadata}>{videoLevelLabel(video.level)}<span><Clock size={14} />{video.duration || 'Durasi belum diisi'}</span><span>{video.isFree ? 'Gratis' : 'Khusus anggota'}</span></p><h3>{video.title}</h3><p>{video.description}</p></div>
              <div className={styles.actions}><Link className={styles.iconButton} href={`/watch/${encodeURIComponent(video.id)}`} target="_blank" aria-label={`Lihat episode ${video.title}`}><Eye size={18} /></Link><button className={styles.secondary} disabled={busy} onClick={() => editEpisode(video)}><Pencil size={16} />Edit</button><button className={`${styles.secondary} ${styles.danger}`} disabled={busy} onClick={() => removeEpisode(video)}><Trash2 size={16} />Hapus</button></div>
            </article>)}
          </div>}
        </section>;
      })}
      {filtered.length === 0 && <div className={styles.empty}><p>{categories.length ? 'Tidak ada materi yang sesuai filter.' : 'Belum ada kategori. Tambahkan kategori pertama untuk mulai mengisi materi.'}</p></div>}
      <footer className={styles.pagination}><label>Kategori per halaman<select value={pageSize} onChange={event => { setPageSize(Number(event.target.value)); setPage(1); }}>{[4, 8, 12, 24].map(value => <option key={value} value={value}>{value}</option>)}</select></label><div className={styles.actions}><button className={styles.secondary} disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Sebelumnya</button><span>{currentPage} / {pages}</span><button className={styles.secondary} disabled={currentPage === pages} onClick={() => setPage(currentPage + 1)}>Berikutnya</button></div></footer>
    </>}

    {categoryForm && <Modal title={categoryForm.id !== null ? 'Edit kategori' : 'Tambah kategori'} onClose={closeCategory}>
      <form onSubmit={saveCategory}>
        <fieldset disabled={busy} className={styles.categoryFields}>
          <label htmlFor="category-name">Nama kategori<input id="category-name" required maxLength={128} value={categoryForm.name} onChange={event => setCategoryForm({ ...categoryForm, name: event.target.value })} /></label>
          <label htmlFor="category-description">Deskripsi <span className={styles.optional}>(opsional)</span><textarea id="category-description" rows={3} maxLength={20000} value={categoryForm.description} onChange={event => setCategoryForm({ ...categoryForm, description: event.target.value })} /></label>
          <div className={styles.upload}><div className={styles.uploadPreview}><CategoryCover src={categoryForm.thumbnail} name={categoryForm.name || 'kategori'} /></div><div><label htmlFor="category-cover">Sampul kategori <span className={styles.optional}>(opsional)</span><input id="category-cover" type="file" accept="image/*" disabled={readingImage} onChange={event => { void chooseCover(event.target.files?.[0]); event.target.value = ''; }} aria-describedby="cover-help" /></label><p id="cover-help" className={styles.hint}>Pilih gambar dari perangkat. Sistem memperkecil dan mengubahnya ke WebP. Tanpa sampul, kategori menampilkan tanda tanya.</p>{categoryForm.thumbnail && <button type="button" className={styles.textButton} onClick={() => { imageRequest.current++; setReadingImage(false); setCategoryForm({ ...categoryForm, thumbnail: '', coverData: '' }); }}>Hapus sampul</button>}</div></div>
          {readingImage && <p role="status">Menyiapkan gambar…</p>}
          {categoryForm.id === null && <p className={styles.hint}>Kategori baru ditambahkan pada urutan terakhir.</p>}
          {categoryError && <p role="alert" className={styles.error}>{categoryError}</p>}
        </fieldset>
        <footer className={styles.modalFooter}><button type="button" disabled={busy} className={styles.secondary} onClick={closeCategory}>Batal</button><button type="submit" disabled={busy || readingImage} className={styles.primary}>{busy ? 'Menyimpan…' : categoryForm.id !== null ? 'Simpan perubahan' : 'Tambah kategori'}</button></footer>
      </form>
    </Modal>}

    {episodeForm && <Modal title={editingEpisode ? 'Edit episode / level' : 'Tambah episode / level'} onClose={closeEpisode} wide>
      <form onSubmit={saveEpisode}>
        <div className={styles.editorGrid}>
          <fieldset disabled={busy} className={styles.fields}>
            <div className={styles.context}><label htmlFor="episode-category">Kategori<select id="episode-category" value={episodeForm.categoryId} required onChange={event => { const categoryId = event.target.value; const episodeNum = nextEpisode(categoryId, editingEpisode?.id); setEpisodeForm({ ...episodeForm, categoryId, episodeNum, ...(!editingEpisode ? { level: `Level ${Math.min(episodeNum, 3)}` } : {}) }); }}>{categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label><p className={styles.hint}>Kategori mengikuti tombol Tambah episode yang dipilih. Nomor berikutnya dihitung dari episode dalam kategori tersebut.</p>
              <div className={styles.pair}><label htmlFor="episode-number">Nomor episode<input id="episode-number" type="number" min={1} max={9999} required value={episodeForm.episodeNum} onChange={event => changeEpisode('episodeNum', Number(event.target.value))} /></label><label htmlFor="episode-level">Level<select id="episode-level" value={episodeForm.level} onChange={event => changeEpisode('level', event.target.value)}>{Array.from(new Set(['Level 1', 'Level 2', 'Level 3', episodeForm.level])).map(value => <option key={value}>{value}</option>)}</select></label></div>
            </div>
            <label htmlFor="episode-title">Judul episode<input id="episode-title" required maxLength={255} value={episodeForm.title} onChange={event => changeEpisode('title', event.target.value)} placeholder="Contoh: Teknik pendaratan lompat meja" /></label>
            <label htmlFor="episode-drive">Tautan / ID video Google Drive<input id="episode-drive" required value={episodeForm.driveLink} onChange={event => changeEpisode('driveLink', event.target.value)} placeholder="https://drive.google.com/file/d/…/view" aria-describedby="drive-help" /></label><p id="drive-help" className={styles.hint}>Di Google Drive, pilih Bagikan → Akses umum → Siapa saja yang memiliki link. Sampul diambil otomatis dari video ini; jika belum tersedia, sistem menampilkan penanda sampul kosong.</p>
            <div className={styles.pair}>
              <label htmlFor="episode-duration">
                <span className={styles.fieldLabel}>Durasi video</span>
                <input id="episode-duration" required value={episodeForm.duration} onChange={event => changeEpisode('duration', event.target.value)} placeholder="04:30" inputMode="text" aria-describedby="duration-help" />
                <span id="duration-help" className={styles.hint}>Menit:detik atau jam:menit:detik.</span>
              </label>
              <div>
                <div className={styles.accessLabel}>
                  <label htmlFor="episode-access">Akses video</label>
                  <span className={styles.tooltip}>
                    <button type="button" aria-label="Penjelasan akses video" aria-expanded={showAccessHelp} aria-describedby="access-help" onClick={() => setShowAccessHelp(!showAccessHelp)}><Info size={18} /></button>
                    <span id="access-help" role="tooltip" className={showAccessHelp ? styles.tooltipOpen : ''}>Gratis: dapat ditonton tanpa login. Khusus anggota: dapat ditonton semua pengguna yang sudah login.</span>
                  </span>
                </div>
                <select id="episode-access" value={episodeForm.isFree ? 'free' : 'members'} onChange={event => changeEpisode('isFree', event.target.value === 'free')}><option value="free">Gratis</option><option value="members">Khusus anggota</option></select>
              </div>
            </div>
            <label htmlFor="episode-description">Deskripsi video<textarea id="episode-description" required rows={4} maxLength={20000} value={episodeForm.description} onChange={event => changeEpisode('description', event.target.value)} /></label>
            <label htmlFor="episode-checklist">Checklist materi <span className={styles.optional}>(opsional)</span><textarea id="episode-checklist" rows={5} value={episodeForm.checklistText} onChange={event => changeEpisode('checklistText', event.target.value)} aria-describedby="checklist-help" /></label><p id="checklist-help" className={styles.hint}>Satu poin per baris, maksimal 100 poin. Poin dengan teks yang sama mempertahankan progres pengguna, termasuk setelah diurutkan ulang. Mengubah teks membuat poin baru.</p>
          </fieldset>
          <aside className={styles.preview} aria-label="Pratinjau episode"><h3>Pratinjau episode</h3><div className={styles.tabs}><button type="button" aria-pressed={!previewPlayer} onClick={() => setPreviewPlayer(false)}>Kartu video</button><button type="button" aria-pressed={previewPlayer} onClick={() => setPreviewPlayer(true)}>Uji putar</button></div>
            {previewPlayer ? validDriveID ? <iframe title="Uji putar video Google Drive" src={`https://drive.google.com/file/d/${validDriveID}/preview`} allow="autoplay; fullscreen" allowFullScreen /> : <div className={styles.previewEmpty}>Masukkan tautan video untuk menguji pemutar.</div> : <div className={styles.previewImage}><VideoThumbnail key={validDriveID} video={{ title: episodeForm.title || 'episode baru', thumbnail: '', driveFileId: validDriveID }} sizes="420px" /><span>EP {episodeForm.episodeNum} • {episodeForm.level}</span></div>}
            <div className={styles.previewContent}><p className={styles.metadata}>{selectedCategory?.name}<span>{episodeForm.isFree ? 'Gratis' : 'Khusus anggota'}</span></p><h3>{episodeForm.title.trim() || 'Judul episode'}</h3><p>{episodeForm.description.trim() || 'Deskripsi video akan tampil di sini.'}</p><p className={styles.metadata}><Clock size={15} />{episodeForm.duration || 'Durasi belum diisi'}</p></div>
          </aside>
        </div>
        <footer className={styles.modalFooter}>{episodeError && <div role="alert" className={styles.error}>{episodeError}</div>}<p>{busy ? 'Sedang menyimpan ke server…' : 'Perubahan disimpan setelah menekan tombol simpan.'}</p><button type="button" disabled={busy} className={styles.secondary} onClick={() => { if (confirm('Kembalikan seluruh isian ke nilai saat formulir dibuka?')) { setEpisodeForm(JSON.parse(initialEpisode)); setEpisodeError(''); } }}>Atur ulang</button><button type="button" disabled={busy} className={styles.secondary} onClick={closeEpisode}>Batal</button><button type="submit" disabled={busy} className={styles.primary}>{busy ? 'Menyimpan…' : editingEpisode ? 'Simpan perubahan' : 'Simpan episode'}</button></footer>
      </form>
    </Modal>}
  </div>;
}

export default function AdminPage() {
  return <Suspense fallback={<p className="p-6">Memuat pengelolaan materi…</p>}><AdminVideoManagement /></Suspense>;
}
