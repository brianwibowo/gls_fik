'use client';

import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  getVideos,
  getCategories,
  createVideo,
  updateVideo,
  deleteVideo,
  createCategory,
  updateCategory,
  deleteCategory,
  extractDriveFileId,
} from '@/lib/data';
import type { Video, Category } from '@/lib/types';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Video as VideoIcon,
  CheckCircle2,
  Layers,
  Lock,
  Unlock,
  Eye,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Search,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  Play,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';

function AdminVideoManagementContent() {
  const searchParams = useSearchParams();

  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [accessFilter, setAccessFilter] = useState<'all' | 'free' | 'locked'>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'default' | 'name-asc' | 'episodes-desc'>('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4); // Default minimal 4 langsung aktif
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Video Form Modal State
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [showDirtyConfirm, setShowDirtyConfirm] = useState(false);
  const [previewTab, setPreviewTab] = useState<'card' | 'player'>('card');
  const [videoForm, setVideoForm] = useState({
    categoryId: '',
    title: '',
    description: '',
    driveLink: '',
    duration: '04:00',
    level: 'Dasar',
    episodeNum: 1,
    isFree: false,
    thumbnail: '',
  });
  const [initialVideoForm, setInitialVideoForm] = useState<typeof videoForm | null>(null);

  // Category Form Modal State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const refreshData = useCallback(() => {
    const cats = getCategories();
    const vids = getVideos();
    setCategories(cats);
    setVideos(vids);
  }, []);

  // Track if video form is dirty (modified from initial state)
  const isVideoDirty = useMemo(() => {
    if (!initialVideoForm) return false;
    return (
      videoForm.categoryId !== initialVideoForm.categoryId ||
      videoForm.title !== initialVideoForm.title ||
      videoForm.description !== initialVideoForm.description ||
      videoForm.driveLink !== initialVideoForm.driveLink ||
      videoForm.duration !== initialVideoForm.duration ||
      videoForm.level !== initialVideoForm.level ||
      videoForm.episodeNum !== initialVideoForm.episodeNum ||
      videoForm.isFree !== initialVideoForm.isFree ||
      videoForm.thumbnail !== initialVideoForm.thumbnail
    );
  }, [videoForm, initialVideoForm]);

  // Open modal to add episode for a specific category
  const openAddEpisodeModal = useCallback((catId?: string) => {
    const cats = getCategories();
    const vids = getVideos();
    const targetCatId = catId || cats[0]?.id || 'cat-fx';
    const catVideos = vids.filter((v) => v.categoryId === targetCatId);
    const nextEpisodeNum = catVideos.length + 1;

    const matchedCat = cats.find((c) => c.id === targetCatId);
    const defaultThumbnail = matchedCat?.thumbnail || '/images/apparatus-floor.webp';

    const newForm = {
      categoryId: targetCatId,
      title: '',
      description: '',
      driveLink: '',
      duration: '04:00',
      level: nextEpisodeNum === 1 ? 'Dasar' : nextEpisodeNum === 2 ? 'Menengah' : 'Mahir',
      episodeNum: nextEpisodeNum,
      isFree: nextEpisodeNum === 1, // Episode 1 defaults to Free
      thumbnail: defaultThumbnail,
    };

    setEditingVideoId(null);
    setVideoForm(newForm);
    setInitialVideoForm(newForm);
    setShowVideoModal(true);
    setShowDirtyConfirm(false);
    setPreviewTab('card');
  }, []);

  useEffect(() => {
    refreshData();
    if (searchParams.get('action') === 'new') {
      openAddEpisodeModal();
    }
  }, [searchParams, refreshData, openAddEpisodeModal]);

  // Safe close requests that protect unsaved changes
  const handleRequestCloseVideoModal = () => {
    if (isVideoDirty) {
      setShowDirtyConfirm(true);
    } else {
      setShowVideoModal(false);
      setShowDirtyConfirm(false);
    }
  };

  const handleForceDiscardVideo = () => {
    setShowDirtyConfirm(false);
    setShowVideoModal(false);
    if (initialVideoForm) {
      setVideoForm(initialVideoForm);
    }
  };

  const handleResetVideoForm = () => {
    if (initialVideoForm) {
      setVideoForm(initialVideoForm);
      showToast('Form berhasil dikembalikan ke nilai awal.');
    }
  };

  // Keyboard accessibility: Escape closes modal with dirty protection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showDirtyConfirm) {
          setShowDirtyConfirm(false);
        } else if (showVideoModal) {
          if (isVideoDirty) {
            setShowDirtyConfirm(true);
          } else {
            setShowVideoModal(false);
          }
        } else if (showCategoryModal) {
          setShowCategoryModal(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showVideoModal, showCategoryModal, isVideoDirty, showDirtyConfirm]);

  const detectedDriveId = extractDriveFileId(videoForm.driveLink);

  const handleEditVideo = (v: Video) => {
    const editForm = {
      categoryId: v.categoryId,
      title: v.title,
      description: v.description,
      driveLink: v.driveLink,
      duration: v.duration,
      level: v.level,
      episodeNum: v.episodeNum,
      isFree: v.isFree,
      thumbnail: v.thumbnail,
    };
    setEditingVideoId(v.id);
    setVideoForm(editForm);
    setInitialVideoForm(editForm);
    setShowVideoModal(true);
    setShowDirtyConfirm(false);
    setPreviewTab('card');
  };

  // Dynamic category changer with smart defaults
  const handleCategoryChange = (newCatId: string) => {
    const matchedCat = categories.find((c) => c.id === newCatId);
    const catVideos = videos.filter((v) => v.categoryId === newCatId);
    const nextEpNum = editingVideoId ? videoForm.episodeNum : catVideos.length + 1;
    const newThumbnail = matchedCat?.thumbnail || '/images/apparatus-floor.webp';

    setVideoForm((prev) => ({
      ...prev,
      categoryId: newCatId,
      thumbnail: newThumbnail,
      episodeNum: nextEpNum,
      level: !editingVideoId
        ? nextEpNum === 1
          ? 'Dasar'
          : nextEpNum === 2
          ? 'Menengah'
          : 'Mahir'
        : prev.level,
      isFree: !editingVideoId ? nextEpNum === 1 : prev.isFree,
    }));
  };

  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!detectedDriveId) {
      alert('Mohon masukkan Link atau File ID Google Drive yang valid.');
      return;
    }

    const matchedCat = categories.find((c) => c.id === videoForm.categoryId);
    const chosenThumbnail =
      videoForm.thumbnail.trim() || matchedCat?.thumbnail || '/images/apparatus-floor.webp';

    const payload = {
      categoryId: videoForm.categoryId,
      title: videoForm.title.trim(),
      description: videoForm.description.trim() || 'Drill latihan teknik gerakan.',
      driveFileId: detectedDriveId,
      driveLink: videoForm.driveLink.startsWith('http')
        ? videoForm.driveLink
        : `https://drive.google.com/file/d/${detectedDriveId}/view`,
      duration: videoForm.duration.trim() || '04:00',
      level: videoForm.level,
      episodeNum: Number(videoForm.episodeNum) || 1,
      isFree: Boolean(videoForm.isFree),
      thumbnail: chosenThumbnail,
    };

    if (editingVideoId) {
      updateVideo(editingVideoId, payload);
      showToast(`Episode "${payload.title}" berhasil diperbarui.`);
    } else {
      createVideo(payload);
      showToast(`Episode "${payload.title}" berhasil ditambahkan.`);
    }

    refreshData();
    setShowVideoModal(false);
  };

  const handleDeleteVideo = (id: string, title: string) => {
    if (!confirm(`Hapus episode "${title}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    deleteVideo(id);
    refreshData();
    showToast(`Episode "${title}" telah dihapus.`);
  };

  // Instant one-click toggle for Free vs Requires Login
  const handleToggleFreeAccess = (video: Video) => {
    const nextState = !video.isFree;
    updateVideo(video.id, { isFree: nextState });
    refreshData();
    showToast(
      `Akses video "${video.title}" diubah: ${nextState ? 'GRATIS (Semua Orang)' : 'BUTUH LOGIN (Khusus Akun)'}.`
    );
  };

  // Category Management
  const openAddCategoryModal = () => {
    setEditingCategoryId(null);
    setCategoryForm({
      name: '',
      description: '',
    });
    setShowCategoryModal(true);
  };

  const openEditCategoryModal = (cat: Category) => {
    setEditingCategoryId(cat.id);
    setCategoryForm({
      name: cat.name,
      description: cat.description,
    });
    setShowCategoryModal(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return;

    if (editingCategoryId) {
      updateCategory(editingCategoryId, {
        name: categoryForm.name.trim(),
        description: categoryForm.description.trim(),
      });
      showToast(`Kategori "${categoryForm.name}" berhasil diperbarui.`);
    } else {
      createCategory({
        name: categoryForm.name.trim(),
        description: categoryForm.description.trim() || `Materi dan drill teknik ${categoryForm.name.trim()}.`,
        thumbnail: '/images/apparatus-floor.webp',
        order: categories.length + 1,
      });
      showToast(`Kategori baru "${categoryForm.name}" berhasil ditambahkan.`);
    }

    refreshData();
    setShowCategoryModal(false);
  };

  const handleDeleteCategory = (cat: Category) => {
    const count = videos.filter((v) => v.categoryId === cat.id).length;
    const confirmMsg =
      count > 0
        ? `Hapus kategori "${cat.name}" beserta ${count} episode video di dalamnya? Tindakan ini tidak dapat dibatalkan!`
        : `Hapus kategori "${cat.name}"?`;

    if (!confirm(confirmMsg)) return;
    deleteCategory(cat.id);
    refreshData();
    showToast(`Kategori "${cat.name}" telah dihapus.`);
  };

  // Collapse / Expand toggle
  const toggleCategoryCollapse = (catId: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  // Clean Indonesian display name helper
  const getCategoryTitle = (catName: string) => {
    return catName;
  };

  // Filter categories based on search, access status, and difficulty level
  const query = searchQuery.toLowerCase().trim();
  const filteredCategories = categories
    .filter((cat) => {
      const catVideos = videos.filter((v) => v.categoryId === cat.id);

      // 1. Search Query Filter
      if (query) {
        const matchCat =
          cat.name.toLowerCase().includes(query) ||
          cat.description.toLowerCase().includes(query);
        const hasMatchingVideo = catVideos.some(
          (v) =>
            v.title.toLowerCase().includes(query) ||
            v.description.toLowerCase().includes(query)
        );
        if (!matchCat && !hasMatchingVideo) return false;
      }

      // 2. Access Filter (Gratis vs Butuh Login)
      if (accessFilter === 'free') {
        const hasFree = catVideos.some((v) => v.isFree);
        if (!hasFree) return false;
      } else if (accessFilter === 'locked') {
        const hasLocked = catVideos.some((v) => !v.isFree);
        if (!hasLocked) return false;
      }

      // 3. Level Filter (Dasar / Menengah / Mahir)
      if (levelFilter !== 'all') {
        const hasLevel = catVideos.some(
          (v) => v.level.toLowerCase() === levelFilter.toLowerCase()
        );
        if (!hasLevel) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'episodes-desc') {
        const countA = videos.filter((v) => v.categoryId === a.id).length;
        const countB = videos.filter((v) => v.categoryId === b.id).length;
        return countB - countA;
      }
      // default: official FIG apparatus curriculum order
      return a.order - b.order;
    });

  // Pagination calculation (minimal 4 categories per page)
  const totalItems = filteredCategories.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

  const isFilterActive =
    searchQuery.trim() !== '' ||
    accessFilter !== 'all' ||
    levelFilter !== 'all' ||
    sortBy !== 'default';

  const resetAllFilters = () => {
    setSearchQuery('');
    setAccessFilter('all');
    setLevelFilter('all');
    setSortBy('default');
    setCurrentPage(1);
  };

  const totalFreeCount = videos.filter((v) => v.isFree).length;
  const totalLockedCount = videos.filter((v) => !v.isFree).length;

  return (
    <div className="p-3.5 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full text-slate-900">
      {/* Header panel */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-5 sm:pb-6 mb-5 sm:mb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c1ff72]/30 border border-[#a8ed4b]/80 text-[#1f2a2e] text-xs font-black uppercase tracking-wider mb-2">
            <span>Kurikulum Terpadu</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Video Materi Per Kategori
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Semua episode dikelompokkan rapi dalam kategori materi senam masing-masing. Tambah episode baru,
            tentukan urutan latihan, dan atur akses gratis atau butuh login secara instan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          <button
            type="button"
            onClick={openAddCategoryModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1F2A2E] hover:bg-black text-white text-xs sm:text-sm font-black shadow-sm transition-all cursor-pointer hover:shadow-md min-h-[42px] active:scale-95"
          >
            <Plus className="w-4 h-4 text-[#C1FF72] stroke-[2.5]" />
            <span>Tambah Kategori</span>
          </button>
        </div>
      </div>

      {/* Statistics overview - 2x2 on mobile and tablet, 4x1 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 mb-5 sm:mb-6">
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Kategori</p>
            <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">{categories.length}</p>
          </div>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
            <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Episode</p>
            <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">{videos.length}</p>
          </div>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#c1ff72]/40 flex items-center justify-center text-[#1f2a2e] shrink-0">
            <VideoIcon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider">Akses Gratis</p>
            <p className="text-xl sm:text-2xl font-black text-emerald-600 mt-0.5">{totalFreeCount}</p>
          </div>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
            <Unlock className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider">Butuh Login</p>
            <p className="text-xl sm:text-2xl font-black text-amber-700 mt-0.5">{totalLockedCount}</p>
          </div>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
            <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
      </div>

      {/* Search and filter toolbar */}
      <div className="mb-5 sm:mb-6 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Box - 16px font on mobile prevents iOS zoom */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari kategori atau judul episode video..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-800 transition-colors"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* 1. Filter Akses: Semua / Gratis / Butuh Login */}
            <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/80 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  setAccessFilter('all');
                  setCurrentPage(1);
                }}
                className={`flex-1 sm:flex-initial min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  accessFilter === 'all'
                    ? 'bg-white text-[#1F2A2E] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua ({categories.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setAccessFilter('free');
                  setCurrentPage(1);
                }}
                className={`flex-1 sm:flex-initial min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  accessFilter === 'free'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-emerald-700'
                }`}
              >
                Gratis ({totalFreeCount})
              </button>
              <button
                type="button"
                onClick={() => {
                  setAccessFilter('locked');
                  setCurrentPage(1);
                }}
                className={`flex-1 sm:flex-initial min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  accessFilter === 'locked'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-amber-700'
                }`}
              >
                Login ({totalLockedCount})
              </button>
            </div>

            {/* 2. Filter Level */}
            <select
              value={levelFilter}
              onChange={(e) => {
                setLevelFilter(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter Level Materi"
              className="flex-1 sm:flex-initial min-h-[38px] px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-base sm:text-xs font-bold text-slate-700 focus:outline-none focus:border-slate-800 cursor-pointer shadow-xs"
            >
              <option value="all">Semua Level</option>
              <option value="Dasar">Level Dasar</option>
              <option value="Menengah">Level Menengah</option>
              <option value="Mahir">Level Mahir</option>
            </select>

            {/* 3. Urutkan (Sort) */}
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as 'default' | 'name-asc' | 'episodes-desc');
                setCurrentPage(1);
              }}
              aria-label="Urutkan Kategori"
              className="flex-1 sm:flex-initial min-h-[38px] px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-base sm:text-xs font-bold text-slate-700 focus:outline-none focus:border-slate-800 cursor-pointer shadow-xs"
            >
              <option value="default">Urutan Kurikulum (FIG)</option>
              <option value="name-asc">Nama Kategori (A-Z)</option>
              <option value="episodes-desc">Episode Terbanyak</option>
            </select>

            {/* 4. Tombol Reset Filter */}
            {isFilterActive && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 text-xs font-bold transition-colors cursor-pointer"
                title="Reset filter"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* Filter Summary Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <p>
            Ditemukan <span className="font-bold text-slate-800">{totalItems}</span> kategori materi
            {isFilterActive && ' (dengan filter aktif)'}
          </p>
          <p className="font-medium">
            Halaman {validCurrentPage} dari {totalPages}
          </p>
        </div>
      </div>

      {/* Category curriculum cards */}
      <div className="space-y-6">
        {paginatedCategories.map((cat) => {
          const catVideos = videos
            .filter((v) => v.categoryId === cat.id)
            .filter((v) => {
              if (!query) return true;
              return (
                v.title.toLowerCase().includes(query) ||
                v.description.toLowerCase().includes(query) ||
                cat.name.toLowerCase().includes(query)
              );
            })
            .sort((a, b) => a.episodeNum - b.episodeNum);

          const isCollapsed = Boolean(collapsedCategories[cat.id]);
          const freeCount = catVideos.filter((v) => v.isFree).length;
          const lockedCount = catVideos.filter((v) => !v.isFree).length;

          return (
            <div
              key={cat.id}
              className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden transition-all"
            >
              {/* Card Header (Kategori Senam) */}
              <div className="p-3.5 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 bg-[#C1FF72] border-b border-[#a8ed4b]/80">
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
                  {/* Thumbnail / Alat Image */}
                  <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-slate-900 border-2 border-white/80 shrink-0 shadow-sm">
                    <Image
                      src={cat.thumbnail || '/images/apparatus-floor.webp'}
                      alt={cat.name}
                      fill
                      className="object-cover object-center"
                      sizes="64px"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                      <h2 className="text-base sm:text-xl font-black text-[#1F2A2E] tracking-tight truncate">
                        {getCategoryTitle(cat.name)}
                      </h2>
                      <span className="px-2 py-0.5 rounded-full bg-white/90 border border-black/10 text-[#1F2A2E] text-[11px] sm:text-xs font-bold shadow-xs">
                        {catVideos.length} Episode
                      </span>
                      {freeCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-[#1F2A2E] text-[#C1FF72] text-[10px] sm:text-[11px] font-black shadow-xs">
                          {freeCount} Gratis
                        </span>
                      )}
                      {lockedCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-white/90 border border-amber-300 text-amber-900 text-[10px] sm:text-[11px] font-bold shadow-xs">
                          {lockedCount} Login
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#1F2A2E]/80 font-medium line-clamp-1 max-w-xl">
                      {cat.description}
                    </p>
                  </div>
                </div>

                {/* Header Action Buttons: Reflow to full width on mobile with >=40px touch areas */}
                <div className="flex items-center justify-between md:justify-end gap-2 shrink-0 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-black/10">
                  <button
                    type="button"
                    onClick={() => openAddEpisodeModal(cat.id)}
                    className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1F2A2E] hover:bg-black text-white hover:text-[#C1FF72] font-black text-xs sm:text-sm border border-[#1F2A2E] shadow-sm transition-all cursor-pointer hover:shadow-md min-h-[40px] active:scale-95"
                    title={`Tambah episode baru untuk ${cat.name}`}
                  >
                    <Plus className="w-4 h-4 text-[#C1FF72] stroke-[2.5]" />
                    <span>Tambah Episode</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditCategoryModal(cat)}
                      className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl bg-white/90 hover:bg-white text-[#1F2A2E] border border-black/10 text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center justify-center active:scale-95"
                      title="Edit judul atau deskripsi kategori ini"
                      aria-label={`Edit kategori ${cat.name}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    {/* Only allow deleting custom categories (leave standard 6 intact) */}
                    {!['cat-fx', 'cat-ph', 'cat-sr', 'cat-vt', 'cat-pb', 'cat-hb'].includes(cat.id) && (
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat)}
                        className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl bg-white/90 hover:bg-red-50 text-red-600 border border-red-200 text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center justify-center active:scale-95"
                        title="Hapus kategori ini"
                        aria-label={`Hapus kategori ${cat.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleCategoryCollapse(cat.id)}
                      className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl bg-white/90 hover:bg-white text-[#1F2A2E] border border-black/10 transition-colors cursor-pointer shadow-xs flex items-center justify-center active:scale-95"
                      title={isCollapsed ? 'Buka daftar episode' : 'Tutup daftar episode'}
                      aria-label={isCollapsed ? 'Buka daftar episode' : 'Tutup daftar episode'}
                    >
                      {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Body: Episode List */}
              {!isCollapsed && (
                <div className="divide-y divide-slate-100">
                  {catVideos.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                      <VideoIcon className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p className="text-sm font-semibold text-slate-700">
                        Belum ada episode di kategori ini.
                      </p>
                      <p className="text-xs text-slate-500 mt-1 mb-4">
                        Tambahkan video latihan dari Google Drive untuk mulai menyusun materi.
                      </p>
                      <button
                        type="button"
                        onClick={() => openAddEpisodeModal(cat.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#c1ff72] hover:bg-[#b0f555] text-[#1f2a2e] font-black text-xs border border-[#a8ed4b] shadow-sm cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Episode Pertama</span>
                      </button>
                    </div>
                  ) : (
                    catVideos.map((video) => (
                      <div
                        key={video.id}
                        className="p-3.5 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 hover:bg-slate-50/70 transition-colors"
                      >
                        {/* Left: Thumbnail & Episode Details */}
                        <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                          {/* Episode Badge & Thumbnail */}
                          <div className="relative w-22 sm:w-28 h-15 sm:h-18 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200 shadow-sm">
                            <Image
                              src={video.thumbnail}
                              alt={video.title}
                              fill
                              className="object-cover object-center"
                              sizes="112px"
                            />
                            <div className="absolute top-1 left-1">
                              <span className="px-1.5 py-0.5 rounded bg-black/85 text-[10px] font-black text-white">
                                EP {video.episodeNum}
                              </span>
                            </div>
                            <div className="absolute bottom-1 right-1">
                              <span className="px-1.5 py-0.5 rounded bg-black/85 text-[9px] font-mono text-slate-200">
                                {video.duration}
                              </span>
                            </div>
                          </div>

                          {/* Info */}
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] sm:text-[11px] font-bold border border-slate-200">
                                Level {video.level}
                              </span>

                              <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono">
                                ID: {video.driveFileId.slice(0, 10)}...
                              </span>
                            </div>

                            <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                              {video.title}
                            </h3>

                            <p className="text-xs text-slate-500 mt-0.5 sm:mt-1 line-clamp-1 max-w-xl">
                              {video.description}
                            </p>
                          </div>
                        </div>

                        {/* Right: Quick Access Toggle & Action Buttons */}
                        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 shrink-0 w-full lg:w-auto pt-2.5 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                          {/* Access status toggle */}
                          <button
                            type="button"
                            onClick={() => handleToggleFreeAccess(video)}
                            className={`min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border shadow-sm active:scale-95 ${
                              video.isFree
                                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300 ring-1 ring-emerald-400/30'
                                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300 ring-1 ring-amber-400/30'
                            }`}
                            title="Klik untuk mengubah hak akses video ini"
                          >
                            {video.isFree ? (
                              <>
                                <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                                <span>GRATIS</span>
                                <span className="text-[10px] text-emerald-700/80 font-normal hidden sm:inline">
                                  (Publik)
                                </span>
                              </>
                            ) : (
                              <>
                                <Lock className="w-3.5 h-3.5 text-amber-600" />
                                <span>BUTUH LOGIN</span>
                                <span className="text-[10px] text-amber-800/80 font-normal hidden sm:inline">
                                  (Atlet)
                                </span>
                              </>
                            )}
                          </button>

                          <div className="flex items-center gap-1.5">
                            {/* Preview Link */}
                            <Link
                              href={`/watch/${video.id}`}
                              target="_blank"
                              className="w-10 h-10 min-w-[38px] min-h-[38px] rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors flex items-center justify-center active:scale-95"
                              title="Tonton Pratinjau Video (Tab Baru)"
                              aria-label={`Pratinjau video ${video.title}`}
                            >
                              <Eye className="w-4 h-4" />
                            </Link>

                            {/* Edit Button */}
                            <button
                              type="button"
                              onClick={() => handleEditVideo(video)}
                              className="min-h-[38px] inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-colors cursor-pointer active:scale-95"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleDeleteVideo(video.id, video.title)}
                              className="min-h-[38px] inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold transition-colors cursor-pointer active:scale-95"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Hapus</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filteredCategories.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
            <Search className="w-8 h-8 mx-auto mb-2 text-slate-400 opacity-60" />
            <p className="text-base font-bold text-slate-800">
              Tidak ada kategori yang sesuai dengan filter atau pencarian Anda.
            </p>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Coba gunakan kata kunci lain atau setel ulang filter pencarian.
            </p>
            <button
              type="button"
              onClick={resetAllFilters}
              className="px-5 py-2.5 rounded-xl bg-[#1F2A2E] hover:bg-black text-white text-xs font-black cursor-pointer transition-all shadow-sm"
            >
              Reset Semua Filter
            </button>
          </div>
        )}
      </div>

      {/* Pagination controls */}
      {filteredCategories.length > 0 && (
        <div className="mt-6 sm:mt-8 bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3.5 sm:gap-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 sm:gap-3 text-xs text-slate-600 w-full sm:w-auto">
            <span className="font-bold text-slate-800">
              Menampilkan {totalItems === 0 ? 0 : startIndex + 1}–{endIndex} dari {totalItems} Kategori
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5">
              <span>Tampilkan:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                aria-label="Pilih jumlah item per halaman"
                className="min-h-[36px] px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 cursor-pointer shadow-xs focus:outline-none focus:border-slate-800"
              >
                <option value={4}>4 per halaman</option>
                <option value={6}>6 per halaman</option>
                <option value={8}>8 per halaman</option>
                <option value={12}>12 per halaman</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={validCurrentPage <= 1}
              className="min-h-[38px] inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-xs active:scale-95"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Sebelumnya</span>
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-9 h-9 min-w-[36px] min-h-[36px] rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center active:scale-95 ${
                    validCurrentPage === pageNum
                      ? 'bg-[#1F2A2E] text-[#C1FF72] shadow-sm'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={validCurrentPage >= totalPages}
              className="min-h-[38px] inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-xs active:scale-95"
            >
              <span>Selanjutnya</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Video episode modal - Highly Informative, Intuitive & Dual-Pane */}
      {showVideoModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) handleRequestCloseVideoModal();
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 lg:p-6 bg-black/65 backdrop-blur-xs overflow-y-auto"
        >
          <div className="bg-white border border-slate-200 rounded-3xl max-w-5xl w-full max-h-[92dvh] flex flex-col shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-100 bg-slate-50/80 shrink-0">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#c1ff72] flex items-center justify-center text-[#1f2a2e] font-black shrink-0 shadow-sm border border-[#a8ed4b]">
                  <VideoIcon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base sm:text-lg font-black text-slate-900 truncate">
                      {editingVideoId ? 'Edit Episode Video' : 'Tambah Episode Video Baru'}
                    </h2>
                    {/* Dirty State Indicator Badge */}
                    {isVideoDirty ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] sm:text-[11px] font-bold shrink-0 animate-pulse">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        <span>Ada Perubahan Belum Disimpan</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[10px] sm:text-[11px] font-semibold shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Form Bersih & Tersinkron</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-500 truncate mt-0.5">
                    {editingVideoId
                      ? `Memperbarui materi episode #${videoForm.episodeNum} • Pantau pratinjau langsung di sebelah kanan`
                      : 'Lengkapi data latihan senam dan uji pemutaran Google Drive secara langsung sebelum disimpan.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRequestCloseVideoModal}
                className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors flex items-center justify-center cursor-pointer active:scale-95"
                aria-label="Tutup dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Responsive Dual Pane (Form Controls + Live Preview) */}
            <form onSubmit={handleSaveVideo} className="flex-1 flex flex-col overflow-hidden">
              <div className="overflow-y-auto p-4 sm:p-6 lg:p-7 flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                  {/* Left Column: Form Fields (7 cols) */}
                  <div className="lg:col-span-7 space-y-4 sm:space-y-5">
                    {/* Field Group 1: Kategori & Nomor Episode */}
                    <div className="bg-slate-50/70 p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-slate-600" />
                          <span>Kategori & Urutan Episode</span>
                        </label>
                        <span className="text-[11px] text-slate-500 font-medium">
                          Otomatis menyinkronkan nomor urut
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <div className="sm:col-span-2">
                          <select
                            value={videoForm.categoryId}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            aria-label="Pilih Kategori Senam"
                            className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-base sm:text-xs font-bold focus:outline-none focus:border-slate-800 shadow-xs"
                          >
                            {categories.map((c) => {
                              const count = videos.filter((v) => v.categoryId === c.id).length;
                              return (
                                <option key={c.id} value={c.id}>
                                  {c.name} ({count} Episode)
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        <div>
                          <div className="relative flex items-center">
                            <button
                              type="button"
                              onClick={() =>
                                setVideoForm((prev) => ({
                                  ...prev,
                                  episodeNum: Math.max(1, prev.episodeNum - 1),
                                }))
                              }
                              className="absolute left-1 w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center cursor-pointer active:scale-90"
                              title="Kurangi nomor episode"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              required
                              value={videoForm.episodeNum}
                              onChange={(e) =>
                                setVideoForm({ ...videoForm, episodeNum: Number(e.target.value) })
                              }
                              placeholder="Episode"
                              aria-label="Nomor Episode"
                              className="w-full min-h-[42px] px-8 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-center text-base sm:text-xs font-black focus:outline-none focus:border-slate-800 shadow-xs"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setVideoForm((prev) => ({
                                  ...prev,
                                  episodeNum: prev.episodeNum + 1,
                                }))
                              }
                              className="absolute right-1 w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center cursor-pointer active:scale-90"
                              title="Tambah nomor episode"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Field Group 2: Judul Episode */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                          Judul Materi Episode
                        </label>
                        <span className="text-[11px] text-slate-400">
                          Gunakan judul yang jelas dan spesifik
                        </span>
                      </div>
                      <input
                        type="text"
                        required
                        value={videoForm.title}
                        onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                        placeholder="Contoh: Postur, Tumpuan Kaki & Awalan Senam Lantai"
                        className="w-full min-h-[42px] px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-base sm:text-sm font-semibold focus:outline-none focus:bg-white focus:border-slate-800 shadow-xs"
                      />

                      {/* Quick Title Suggestion Chips */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        <span className="text-[11px] font-bold text-slate-400">Saran Cepat:</span>
                        {['Postur & Awalan', 'Drill Tolakan & Repetisi', 'Transisi & Salto', 'Stick Landing & Evaluasi'].map(
                          (suggestion) => (
                            <button
                              type="button"
                              key={suggestion}
                              onClick={() => setVideoForm({ ...videoForm, title: suggestion })}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer active:scale-95"
                            >
                              + {suggestion}
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    {/* Field Group 3: Link Google Drive */}
                    <div className="bg-slate-50/70 p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                          Link Berbagi Google Drive / File ID
                        </label>
                        {detectedDriveId && (
                          <a
                            href={`https://drive.google.com/file/d/${detectedDriveId}/view`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-800 font-bold"
                          >
                            <span>Buka di Google Drive</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      <input
                        type="text"
                        required
                        value={videoForm.driveLink}
                        onChange={(e) => setVideoForm({ ...videoForm, driveLink: e.target.value })}
                        placeholder="Tempel link: https://drive.google.com/file/d/12JG_YaH6ADE4xVqgsk.../view"
                        className="w-full min-h-[42px] px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-base sm:text-xs font-mono focus:outline-none focus:border-slate-800 shadow-xs"
                      />

                      {/* Drive Extraction Feedback Card */}
                      {detectedDriveId ? (
                        <div className="flex items-start gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <p className="font-bold">
                              ID File Terdeteksi: <code className="font-mono bg-emerald-100/80 px-1 rounded">{detectedDriveId}</code>
                            </p>
                            <p className="text-[11px] text-emerald-800 mt-0.5">
                              Pastikan akses Google Drive diatur ke: <strong>&quot;Siapa saja yang memiliki link dapat melihat&quot;</strong>.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs">
                          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                          <p className="text-[11px] text-amber-800 leading-relaxed">
                            Buka video di Google Drive &gt; Klik <strong>Bagikan (Share)</strong> &gt; Ubah Akses Umum ke <strong>Siapa saja yang memiliki link</strong> &gt; Salin tautan dan tempel di sini.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Field Group 4: Hak Akses Episode (Interactive Explanatory Cards) */}
                    <div>
                      <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
                        Hak Akses Episode
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {/* Option 1: Gratis */}
                        <button
                          type="button"
                          onClick={() => setVideoForm({ ...videoForm, isFree: true })}
                          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 active:scale-98 ${
                            videoForm.isFree
                              ? 'bg-emerald-50/90 border-emerald-400 ring-2 ring-emerald-500/20 shadow-xs'
                              : 'bg-white border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                              videoForm.isFree
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            <Unlock className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-black text-slate-900">GRATIS (Publik)</span>
                              {videoForm.isFree && (
                                <span className="px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-800 text-[9px] font-black">
                                  AKTIF
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                              Bisa ditonton langsung oleh siapa saja tanpa perlu masuk akun. Direkomendasikan untuk Episode 1.
                            </p>
                          </div>
                        </button>

                        {/* Option 2: Butuh Login */}
                        <button
                          type="button"
                          onClick={() => setVideoForm({ ...videoForm, isFree: false })}
                          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 active:scale-98 ${
                            !videoForm.isFree
                              ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-500/20 shadow-xs'
                              : 'bg-white border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                              !videoForm.isFree
                                ? 'bg-amber-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            <Lock className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-black text-slate-900">BUTUH LOGIN</span>
                              {!videoForm.isFree && (
                                <span className="px-1.5 py-0.2 rounded bg-amber-200 text-amber-800 text-[9px] font-black">
                                  AKTIF
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                              Khusus atlet, pelatih, atau mahasiswa FIK yang telah memiliki akun terdaftar di GLS.
                            </p>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Field Group 5: Tingkat Latihan & Durasi Video */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* Tingkat Latihan Selector */}
                      <div>
                        <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                          Tingkat Latihan
                        </label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {[
                            { key: 'Dasar', label: 'Dasar', sub: 'Pemula' },
                            { key: 'Menengah', label: 'Menengah', sub: 'Teknik' },
                            { key: 'Mahir', label: 'Mahir', sub: 'FIG/Salto' },
                          ].map((lvl) => (
                            <button
                              type="button"
                              key={lvl.key}
                              onClick={() => setVideoForm({ ...videoForm, level: lvl.key })}
                              className={`py-2 px-1.5 rounded-xl border text-center transition-all cursor-pointer active:scale-95 ${
                                videoForm.level === lvl.key
                                  ? 'bg-[#1F2A2E] text-white border-[#1F2A2E] shadow-xs'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              <div className="text-xs font-black">{lvl.label}</div>
                              <div
                                className={`text-[10px] ${
                                  videoForm.level === lvl.key ? 'text-[#c1ff72]' : 'text-slate-400'
                                }`}
                              >
                                {lvl.sub}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Durasi Video with Quick Presets */}
                      <div>
                        <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                          Durasi Video (MM:SS)
                        </label>
                        <input
                          type="text"
                          value={videoForm.duration}
                          onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                          placeholder="04:00"
                          className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-base sm:text-sm font-bold focus:outline-none focus:bg-white focus:border-slate-800 shadow-xs"
                        />
                        <div className="flex items-center gap-1 mt-1.5">
                          <span className="text-[10px] text-slate-400 font-medium">Preset:</span>
                          {['03:00', '03:45', '04:15', '05:00'].map((preset) => (
                            <button
                              type="button"
                              key={preset}
                              onClick={() => setVideoForm({ ...videoForm, duration: preset })}
                              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700 cursor-pointer"
                            >
                              {preset}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Field Group 6: Catatan Gerakan */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                          Catatan Gerakan & Panduan Latihan
                        </label>
                        <span className="text-[11px] text-slate-400">Instruksi untuk atlet</span>
                      </div>
                      <textarea
                        rows={3}
                        value={videoForm.description}
                        onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                        placeholder="Contoh: Fokuskan pandangan ke depan, dorong panggul ke atas, kunci siku saat tumpuan, serta lenturkan lutut saat stick landing untuk meredam beban pendaratan..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-base sm:text-xs leading-relaxed focus:outline-none focus:bg-white focus:border-slate-800 shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Right Column: Interactive Live Preview & Player Tester (5 cols) */}
                  <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-0">
                    <div className="bg-slate-900 rounded-3xl p-4 sm:p-5 text-white border border-slate-800 shadow-xl space-y-4">
                      {/* Preview Header & Tabs */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-[#c1ff72] text-[#1f2a2e] flex items-center justify-center font-black">
                            <Sparkles className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-black text-white uppercase tracking-wider">
                            Live Preview
                          </span>
                        </div>

                        {/* Switcher Tab */}
                        <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl">
                          <button
                            type="button"
                            onClick={() => setPreviewTab('card')}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              previewTab === 'card'
                                ? 'bg-[#c1ff72] text-[#1f2a2e] shadow-xs'
                                : 'text-slate-300 hover:text-white'
                            }`}
                          >
                            Kartu
                          </button>
                          <button
                            type="button"
                            onClick={() => setPreviewTab('player')}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              previewTab === 'player'
                                ? 'bg-[#c1ff72] text-[#1f2a2e] shadow-xs'
                                : 'text-slate-300 hover:text-white'
                            }`}
                          >
                            Uji Putar
                          </button>
                        </div>
                      </div>

                      {/* Tab 1: Live Video Card representation */}
                      {previewTab === 'card' && (
                        <div className="space-y-3">
                          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-white/10 shadow-lg">
                            {/* Thumbnail */}
                            <div className="relative w-full aspect-video bg-slate-900">
                              <Image
                                src={
                                  videoForm.thumbnail ||
                                  categories.find((c) => c.id === videoForm.categoryId)?.thumbnail ||
                                  '/images/apparatus-floor.webp'
                                }
                                alt="Thumbnail Preview"
                                fill
                                className="object-cover"
                                sizes="360px"
                              />

                              {/* Overlays */}
                              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                                <span className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-black text-[#c1ff72]">
                                  EP {videoForm.episodeNum}
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-[10px] font-bold text-white">
                                  Level {videoForm.level}
                                </span>
                              </div>

                              <div className="absolute bottom-2.5 right-2.5">
                                <span className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-mono font-bold text-slate-200">
                                  {videoForm.duration}
                                </span>
                              </div>

                              {/* Play Icon overlay */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-lg">
                                  <Play className="w-5 h-5 fill-white ml-0.5" />
                                </div>
                              </div>
                            </div>

                            {/* Card Content info */}
                            <div className="p-3.5 space-y-2 bg-slate-900/90">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-[#c1ff72] uppercase tracking-wider">
                                  {categories.find((c) => c.id === videoForm.categoryId)?.name.split(' ')[0] ||
                                    'SENAM'}
                                </span>
                                {videoForm.isFree ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-black text-[#c1ff72]">
                                    <Unlock className="w-3 h-3" /> GRATIS
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400">
                                    <Lock className="w-3 h-3" /> LOGIN KHUSUS
                                  </span>
                                )}
                              </div>

                              <h4 className="text-sm font-bold text-white leading-snug line-clamp-2">
                                {videoForm.title.trim() || 'Judul Episode Latihan Akan Muncul Di Sini'}
                              </h4>

                              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                                {videoForm.description.trim() ||
                                  'Catatan gerakan dan panduan teknik akan ditampilkan kepada siswa dan atlet.'}
                              </p>
                            </div>
                          </div>

                          <p className="text-[11px] text-slate-400 text-center">
                            Pratinjau tampilan kartu di katalog materi web depan.
                          </p>
                        </div>
                      )}

                      {/* Tab 2: Test Play Google Drive embed directly */}
                      {previewTab === 'player' && (
                        <div className="space-y-3">
                          {detectedDriveId ? (
                            <div className="space-y-2.5">
                              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-inner">
                                <iframe
                                  src={`https://drive.google.com/file/d/${detectedDriveId}/preview`}
                                  className="w-full h-full border-0"
                                  allow="autoplay; fullscreen"
                                  allowFullScreen
                                  title="Uji Putar Google Drive"
                                />
                              </div>
                              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1">
                                <div className="flex items-center gap-1.5 text-[#c1ff72] font-bold">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Pemutar Iframe Google Drive Aktif</span>
                                </div>
                                <p className="text-[11px] text-slate-300">
                                  Klik tombol play di atas untuk memastikan izin video Anda dapat diputar oleh publik tanpa eror akses.
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="py-12 px-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-2">
                              <VideoIcon className="w-8 h-8 text-slate-500 mx-auto" />
                              <p className="text-xs font-bold text-slate-300">
                                Link Google Drive Belum Diisi
                              </p>
                              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                                Masukkan link berbagi Google Drive di kolom sebelah kiri untuk menguji pemutar video di sini.
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Quick specs pill */}
                      <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                          <span className="text-slate-400 block">Durasi:</span>
                          <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-[#c1ff72]" />
                            {videoForm.duration}
                          </span>
                        </div>
                        <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                          <span className="text-slate-400 block">Tingkat:</span>
                          <span className="font-bold text-white mt-0.5 block">
                            Level {videoForm.level}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer: Dirty Action + Primary Actions */}
              <div className="px-4 sm:px-6 lg:px-7 py-3.5 border-t border-slate-100 bg-slate-50/90 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
                {/* Left: Dirty Action Revert Button */}
                <div className="flex items-center gap-2">
                  {isVideoDirty ? (
                    <button
                      type="button"
                      onClick={handleResetVideoForm}
                      className="min-h-[38px] inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-xs"
                      title="Kembalikan semua nilai ke kondisi awal"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                      <span>Kembalikan Data Semula</span>
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Semua perubahan tersinkron</span>
                    </span>
                  )}
                </div>

                {/* Right: Cancel & Save Buttons */}
                <div className="flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={handleRequestCloseVideoModal}
                    className="min-h-[42px] px-5 py-2 rounded-xl bg-slate-200/80 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-colors cursor-pointer active:scale-95"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="min-h-[42px] inline-flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-[#c1ff72] hover:bg-[#b0f555] text-[#1f2a2e] font-black text-xs sm:text-sm border border-[#a8ed4b] shadow-md transition-all cursor-pointer active:scale-95"
                  >
                    <Save className="w-4 h-4 stroke-[2.5]" />
                    <span>{editingVideoId ? 'Simpan Perubahan Episode' : 'Simpan Episode Baru'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dirty Action Exit Confirmation Dialog */}
      {showDirtyConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 sm:p-6 border border-slate-200 shadow-2xl animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center mb-3.5 shadow-xs">
              <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="text-base font-black text-slate-900 leading-tight">
              Buang Perubahan yang Belum Disimpan?
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Anda telah mengubah data episode video ini. Jika Anda menutup form sekarang, seluruh input yang baru saja dimasukkan akan dibatalkan.
            </p>
            <div className="flex items-center justify-end gap-2.5 mt-5 pt-3.5 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowDirtyConfirm(false)}
                className="min-h-[38px] px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer active:scale-95"
              >
                Lanjut Mengedit
              </button>
              <button
                type="button"
                onClick={handleForceDiscardVideo}
                className="min-h-[38px] inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer shadow-sm active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Buang Perubahan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category modal - Compact */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full max-h-[90dvh] overflow-y-auto p-4 sm:p-5 shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 font-black shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-900 leading-tight">
                    {editingCategoryId ? 'Edit Kategori Senam' : 'Tambah Kategori Baru'}
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Wadah pengelompokan episode latihan.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
                className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center cursor-pointer active:scale-95"
                aria-label="Tutup dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Nama Kategori Senam
                </label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="Contoh: Balok Keseimbangan (Balance Beam)"
                  className="w-full min-h-[40px] px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-base sm:text-sm font-semibold focus:outline-none focus:bg-white focus:border-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Deskripsi Kategori
                </label>
                <textarea
                  rows={2}
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  placeholder="Contoh: Rangkaian manuver keseimbangan, putaran..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-base sm:text-xs focus:outline-none focus:bg-white focus:border-slate-800"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="min-h-[42px] px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-center active:scale-95"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="min-h-[42px] inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#c1ff72] hover:bg-[#b0f555] text-[#1f2a2e] font-black text-xs sm:text-sm border border-[#a8ed4b] shadow-xs transition-all cursor-pointer active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Kategori</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-800 max-w-md">
            <CheckCircle2 className="w-5 h-5 text-[#c1ff72] shrink-0" />
            <p className="text-xs sm:text-sm font-semibold text-slate-100">{toastMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-500">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold">Memuat kurikulum video...</p>
        </div>
      }
    >
      <AdminVideoManagementContent />
    </Suspense>
  );
}
