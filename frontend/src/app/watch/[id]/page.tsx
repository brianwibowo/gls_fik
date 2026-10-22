'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/lib/auth';
import {
  apiGetVideoById,
  apiGetVideos,
  apiGetCategories,
  apiGetTracker,
  apiToggleProgress,
  apiSaveEvaluation,
  apiGetProfiles,
} from '@/lib/api';
import type { Video, Category, ProgressTrackerResponse, ProgressItem, UserProfile } from '@/lib/types';
import { LoginModal } from '@/components/LoginModal';
import {
  Play,
  ArrowLeft,
  Clock,
  Lock,
  Layers,
  CheckCircle,
  Circle,
  MessageSquare,
  Award,
  Save,
  Check,
  User as UserIcon,
} from 'lucide-react';

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoggedIn, isReady } = useAuth();
  const [video, setVideo] = useState<Video | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [siblingVideos, setSiblingVideos] = useState<Video[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Tracker state
  const [trackerData, setTrackerData] = useState<ProgressTrackerResponse | null>(null);
  const [trackerLoading, setTrackerLoading] = useState(false);
  const [savingEvaluation, setSavingEvaluation] = useState<string | null>(null);
  const [evalNotesState, setEvalNotesState] = useState<Record<string, { notes: string; score: string }>>({});
  const [saveSuccessMap, setSaveSuccessMap] = useState<Record<string, boolean>>({});

  // Coach viewing athlete selector
  const [athletesList, setAthletesList] = useState<UserProfile[]>([]);
  const [selectedAthleteId, setSelectedAthleteId] = useState<string>('');

  const videoId = params.id as string;

  // Extract numerical level (e.g., "Level 1" -> 1)
  const getLevelNumber = (levelStr?: string): number => {
    if (!levelStr) return 1;
    if (levelStr.includes('1') || levelStr.toLowerCase().includes('dasar') || levelStr.toLowerCase().includes('foundation')) return 1;
    if (levelStr.includes('2') || levelStr.toLowerCase().includes('menengah') || levelStr.toLowerCase().includes('intermediate')) return 2;
    if (levelStr.includes('3') || levelStr.toLowerCase().includes('mahir') || levelStr.toLowerCase().includes('advanced')) return 3;
    return 1;
  };

  const loadTracker = useCallback(async (catId: string, lvl: number, athleteId?: string) => {
    setTrackerLoading(true);
    try {
      const data = await apiGetTracker(athleteId, catId, lvl);
      setTrackerData(data);
      // Initialize local evaluation inputs
      const initialNotes: Record<string, { notes: string; score: string }> = {};
      data.items.forEach((item) => {
        initialNotes[item.technique.id] = {
          notes: item.evaluation?.notes || '',
          score: item.evaluation?.score || 'Developing',
        };
      });
      setEvalNotesState(initialNotes);
    } catch (err) {
      console.error('Failed to load technique tracker:', err);
    } finally {
      setTrackerLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function fetchWatchData() {
      try {
        const vid = await apiGetVideoById(videoId);
        if (!isMounted) return;
        setVideo(vid);
        setNotFound(false);

        const [cats, siblings, profiles] = await Promise.all([
          apiGetCategories(),
          apiGetVideos(vid.categoryId),
          apiGetProfiles().catch(() => []),
        ]);
        if (!isMounted) return;

        const matchedCat = cats.find((c) => c.id === vid.categoryId);
        setCategory(matchedCat || null);
        setSiblingVideos(siblings);

        const athletes = profiles.filter((p) => p.role === 'athlete');
        setAthletesList(athletes);

        // Determine default target athlete
        let targetAthlete = '';
        if (user?.role === 'athlete') {
          targetAthlete = user.id;
        } else if (athletes.length > 0) {
          targetAthlete = athletes[0].id;
        }
        setSelectedAthleteId(targetAthlete);

        // Fetch tracker
        const lvlNum = getLevelNumber(vid.level);
        await loadTracker(vid.categoryId, lvlNum, targetAthlete);
      } catch (err) {
        console.error('Video fetch error:', err);
        if (isMounted) {
          setNotFound(true);
        }
      }
    }
    fetchWatchData();
    return () => {
      isMounted = false;
    };
  }, [videoId, user, loadTracker]);

  // Handle athlete change by coach
  const handleAthleteChange = async (newAthleteId: string) => {
    setSelectedAthleteId(newAthleteId);
    if (video) {
      const lvlNum = getLevelNumber(video.level);
      await loadTracker(video.categoryId, lvlNum, newAthleteId);
    }
  };

  // Toggle progress checkbox
  const handleToggle = async (item: ProgressItem) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    const newStatus = !item.isCompleted;

    // Optimistic UI update
    if (trackerData) {
      const updatedItems = trackerData.items.map((i) =>
        i.technique.id === item.technique.id ? { ...i, isCompleted: newStatus } : i
      );
      const newCompletedCount = updatedItems.filter((i) => i.isCompleted).length;
      const newPercentage = updatedItems.length > 0 ? (newCompletedCount / updatedItems.length) * 100 : 0;
      setTrackerData({
        ...trackerData,
        items: updatedItems,
        completedCount: newCompletedCount,
        percentage: newPercentage,
      });
    }

    try {
      await apiToggleProgress(item.technique.id, newStatus, selectedAthleteId || user?.id);
    } catch (err) {
      console.error('Failed to toggle technique progress:', err);
      // Revert if error
      if (video) {
        loadTracker(video.categoryId, getLevelNumber(video.level), selectedAthleteId);
      }
    }
  };

  // Save coach evaluation notes
  const handleSaveEvaluation = async (techniqueId: string) => {
    if (!selectedAthleteId) return;
    setSavingEvaluation(techniqueId);
    const evalData = evalNotesState[techniqueId] || { notes: '', score: 'Developing' };
    try {
      const saved = await apiSaveEvaluation({
        athleteId: selectedAthleteId,
        techniqueId,
        notes: evalData.notes,
        score: evalData.score,
      });

      // Update tracker data in memory
      if (trackerData) {
        setTrackerData({
          ...trackerData,
          items: trackerData.items.map((i) =>
            i.technique.id === techniqueId ? { ...i, evaluation: saved } : i
          ),
        });
      }

      setSaveSuccessMap((prev) => ({ ...prev, [techniqueId]: true }));
      setTimeout(() => {
        setSaveSuccessMap((prev) => ({ ...prev, [techniqueId]: false }));
      }, 3000);
    } catch (err) {
      console.error('Failed to save evaluation note:', err);
    } finally {
      setSavingEvaluation(null);
    }
  };

  if (!isReady) return null;

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 px-4">
          <h1 className="text-2xl font-bold text-white mb-2">Video Not Found</h1>
          <p className="text-sm text-slate-400 mb-6">The video routine you requested does not exist or may have been updated.</p>
          <Link href="/" className="px-5 py-2.5 rounded-xl bg-[#c1ff72] text-[#1f2a2e] text-sm font-bold hover:bg-[#b0f555] transition-colors">
            Return to Curriculum
          </Link>
        </div>
      </div>
    );
  }

  if (!video) return null;

  const handlePlayEpisode = (ep: Video) => {
    router.push(`/watch/${ep.id}`);
  };

  const isCoachOrAdmin = user?.role === 'coach' || user?.role === 'admin';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
        {/* Top bar: Back link + Video title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 bg-[#121721] border border-[#243044] rounded-2xl px-3.5 sm:px-4 py-3 shadow-lg">
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-200 hover:text-white font-bold group transition-all shrink-0 bg-white/5 hover:bg-white/10 px-3.5 py-2 min-h-[44px] rounded-xl border border-white/10 hover:border-[#c1ff72]/40 active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#c1ff72]" />
              <span>Back to Curriculum</span>
            </Link>

            <span className="text-slate-600 hidden sm:inline font-bold">|</span>

            <div className="flex items-center gap-2 min-w-0 flex-1">
              {category && (
                <span className="px-2 py-0.5 rounded-lg bg-[#c1ff72]/15 border border-[#c1ff72]/30 text-[#c1ff72] text-[11px] sm:text-xs font-black shrink-0 uppercase tracking-wide">
                  {category.name.split('(')[0].trim()}
                </span>
              )}
              <h1 className="text-xs sm:text-base font-bold text-white truncate" title={video.title}>
                {video.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-center text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 font-bold">
              Episode {video.episodeNum}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#c1ff72] text-[#1f2a2e] font-black shadow-sm">
              {video.level}
            </span>
          </div>
        </div>

        {/* Video Player */}
        {video.isFree || isLoggedIn ? (
          <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 ring-1 ring-white/5">
            <iframe
              src={`https://drive.google.com/file/d/${video.driveFileId}/preview`}
              className="w-full h-full border-0"
              allow="autoplay; fullscreen"
              allowFullScreen
              title={video.title}
            />
          </div>
        ) : (
          <div className="relative w-full min-h-[340px] sm:min-h-0 sm:aspect-video bg-gradient-to-br from-[#12161f] via-[#0d1017] to-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 ring-1 ring-white/5 flex flex-col items-center justify-center p-5 sm:p-6 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-[#c1ff72]/15 border border-[#c1ff72]/40 flex items-center justify-center text-[#c1ff72] mb-3 sm:mb-4 shadow-[0_0_20px_rgba(193,255,114,0.15)]">
              <Lock className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] sm:text-xs font-bold mb-2.5 sm:mb-3">
              <span>Registered Account Required</span>
            </div>

            <h2 className="text-lg sm:text-2xl font-black text-white max-w-lg mb-2 leading-tight">
              Sign In to Access Full Routine &amp; Checklist Tracker
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-md mb-5 sm:mb-6 leading-relaxed">
              Sign in with your athlete or coach account to watch this competition breakdown and log technical mastery.
            </p>

            <button
              type="button"
              onClick={() => setShowLoginModal(true)}
              className="px-5 sm:px-6 py-3 min-h-[44px] rounded-xl bg-[#c1ff72] hover:bg-[#b0f555] text-[#1f2a2e] font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer inline-flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 border border-[#a8ed4b]"
            >
              <Lock className="w-4 h-4 stroke-[2.5]" />
              <span>Sign In to Unlock Routine</span>
            </button>
          </div>
        )}

        {/* Video info & Playlists row */}
        <div className="mt-8 flex flex-col lg:flex-row lg:items-start gap-8">
          {/* Left: Video description & Details */}
          <div className="flex-1 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                {category && (
                  <span className="px-2.5 py-1 rounded-lg bg-[#c1ff72]/15 border border-[#c1ff72]/30 text-[#c1ff72] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3 h-3" />
                    {category.name}
                  </span>
                )}
                <span className="px-2 py-0.5 rounded bg-white/10 text-[11px] font-semibold text-slate-300">
                  {video.level}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {video.duration}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Episode {video.episodeNum}: {video.title}
              </h1>

              <div className="mt-4 p-4 rounded-2xl bg-[#141b1e] border border-white/10 text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {video.description}
              </div>
            </div>

            {/* ── Section 12 & 13: Interactive Checklist Tracker & Evaluation Notes ── */}
            <div className="bg-[#121721] border border-[#243044] rounded-3xl p-5 sm:p-7 shadow-xl space-y-6">
              {/* Tracker Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Award className="w-5 h-5 text-[#c1ff72]" />
                    <h2 className="text-lg sm:text-xl font-black text-white">
                      Technique Checklist &amp; Mastery Tracker
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400">
                    Itemized standards for this routine. Check off mastered techniques to update completion percentage.
                  </p>
                </div>

                {/* Coach: Athlete Selector */}
                {isCoachOrAdmin && athletesList.length > 0 && (
                  <div className="flex items-center gap-2 bg-[#1b2330] border border-[#2c3b52] rounded-xl px-3 py-1.5">
                    <UserIcon className="w-3.5 h-3.5 text-[#c1ff72]" />
                    <span className="text-xs font-semibold text-slate-300">Review Athlete:</span>
                    <select
                      value={selectedAthleteId}
                      onChange={(e) => handleAthleteChange(e.target.value)}
                      className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
                    >
                      {athletesList.map((ath) => (
                        <option key={ath.id} value={ath.id} className="bg-[#141a24] text-white">
                          {ath.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Progress Bar & Percentage Metric */}
              {trackerData && (
                <div className="bg-[#17202d] border border-white/10 rounded-2xl p-4 sm:p-5">
                  <div className="flex items-center justify-between text-xs sm:text-sm mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">Routine Completion:</span>
                      <span className="text-xs text-[#c1ff72] font-semibold">
                        {trackerData.completedCount} of {trackerData.totalTechniques} techniques completed
                      </span>
                    </div>
                    <span className="font-black text-base sm:text-lg text-[#c1ff72]">
                      {Math.round(trackerData.percentage)}%
                    </span>
                  </div>

                  {/* Progress Bar Track */}
                  <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden relative">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#8be034] to-[#c1ff72] transition-all duration-500"
                      style={{ width: `${trackerData.percentage}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Technique Items Checklist */}
              {trackerLoading ? (
                <div className="py-8 flex items-center justify-center text-xs text-slate-400 gap-2">
                  <div className="w-4 h-4 border-2 border-slate-600 border-t-[#c1ff72] rounded-full animate-spin" />
                  <span>Loading technique checklist...</span>
                </div>
              ) : trackerData && trackerData.items.length > 0 ? (
                <div className="space-y-4">
                  {trackerData.items.map((item) => {
                    const technique = item.technique;
                    const evalState = evalNotesState[technique.id] || {
                      notes: item.evaluation?.notes || '',
                      score: item.evaluation?.score || 'Developing',
                    };
                    const isSaving = savingEvaluation === technique.id;
                    const isSaved = saveSuccessMap[technique.id];

                    return (
                      <div
                        key={technique.id}
                        className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                          item.isCompleted
                            ? 'bg-[#152028] border-[#c1ff72]/30'
                            : 'bg-[#171f2a] border-white/10'
                        }`}
                      >
                        {/* Technique Item Row */}
                        <div className="flex items-start gap-3.5">
                          <button
                            type="button"
                            onClick={() => handleToggle(item)}
                            className="mt-0.5 shrink-0 text-slate-400 hover:text-[#c1ff72] transition-colors cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
                            aria-label={`Toggle completion for ${technique.name}`}
                          >
                            {item.isCompleted ? (
                              <CheckCircle className="w-6 h-6 text-[#c1ff72] fill-[#c1ff72]/20" />
                            ) : (
                              <Circle className="w-6 h-6 text-slate-500 hover:text-white" />
                            )}
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <h3
                                className={`text-sm sm:text-base font-bold transition-colors ${
                                  item.isCompleted ? 'text-white' : 'text-slate-200'
                                }`}
                              >
                                {technique.order}. {technique.name}
                              </h3>

                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                  item.isCompleted
                                    ? 'bg-[#c1ff72]/20 text-[#c1ff72] border border-[#c1ff72]/40'
                                    : 'bg-white/10 text-slate-400'
                                }`}
                              >
                                {item.isCompleted ? 'Completed' : 'Pending'}
                              </span>
                            </div>

                            {technique.description && (
                              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                {technique.description}
                              </p>
                            )}

                            {/* Existing Coach Evaluation Note Display */}
                            {item.evaluation?.notes && (
                              <div className="mt-3 p-3 rounded-xl bg-[#1b2533] border border-[#2b3c54] space-y-1">
                                <div className="flex items-center justify-between text-[11px]">
                                  <div className="flex items-center gap-1.5 font-bold text-[#c1ff72]">
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    <span>
                                      Coach Evaluation ({item.evaluation.coachName || 'Coach'}):
                                    </span>
                                  </div>
                                  {item.evaluation.score && (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#c1ff72]/15 text-[#c1ff72]">
                                      {item.evaluation.score}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-200 leading-relaxed italic">
                                  &ldquo;{item.evaluation.notes}&rdquo;
                                </p>
                              </div>
                            )}

                            {/* Coach / Admin Evaluation Editor */}
                            {isCoachOrAdmin && (
                              <div className="mt-3 pt-3 border-t border-white/10 space-y-2.5">
                                <div className="flex items-center justify-between">
                                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <span>Coach Evaluation Column</span>
                                  </label>

                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[11px] text-slate-400">Rating:</span>
                                    <select
                                      value={evalState.score}
                                      onChange={(e) =>
                                        setEvalNotesState((prev) => ({
                                          ...prev,
                                          [technique.id]: {
                                            ...evalState,
                                            score: e.target.value,
                                          },
                                        }))
                                      }
                                      className="bg-[#141a24] text-xs font-semibold text-white border border-[#2c3b52] rounded-lg px-2 py-1 focus:outline-none"
                                    >
                                      <option value="Mastered">Mastered</option>
                                      <option value="Developing">Developing</option>
                                      <option value="Needs Work">Needs Work</option>
                                    </select>
                                  </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2">
                                  <textarea
                                    value={evalState.notes}
                                    onChange={(e) =>
                                      setEvalNotesState((prev) => ({
                                        ...prev,
                                        [technique.id]: {
                                          ...evalState,
                                          notes: e.target.value,
                                        },
                                      }))
                                    }
                                    placeholder="Enter biomechanical notes, body alignment, landing stick..."
                                    rows={2}
                                    className="flex-1 min-h-[50px] p-2.5 rounded-xl bg-[#141a24] border border-[#273549] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-[#c1ff72]"
                                  />

                                  <button
                                    type="button"
                                    onClick={() => handleSaveEvaluation(technique.id)}
                                    disabled={isSaving}
                                    className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[#c1ff72] hover:bg-[#b0f555] text-[#1f2a2e] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                                  >
                                    {isSaving ? (
                                      <span>Saving...</span>
                                    ) : isSaved ? (
                                      <>
                                        <Check className="w-3.5 h-3.5" />
                                        <span>Saved</span>
                                      </>
                                    ) : (
                                      <>
                                        <Save className="w-3.5 h-3.5" />
                                        <span>Save Note</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-[#17202d] border border-white/10 text-center text-xs text-slate-400">
                  Technique checklists are being populated for this apparatus.
                </div>
              )}
            </div>
          </div>

          {/* Right: Sibling Episodes list */}
          <div className="lg:w-96 shrink-0">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Play className="w-4 h-4 text-[#c1ff72] fill-[#c1ff72]" />
              Apparatus Routines
            </h3>

            <div className="space-y-3">
              {siblingVideos.map((ep) => {
                const isCurrent = ep.id === video.id;
                const canWatch = ep.isFree || isLoggedIn;

                return (
                  <button
                    key={ep.id}
                    onClick={() => {
                      if (canWatch) {
                        handlePlayEpisode(ep);
                      } else {
                        setShowLoginModal(true);
                      }
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center gap-4 cursor-pointer min-h-[44px] ${
                      isCurrent
                        ? 'bg-[#c1ff72]/10 border-[#c1ff72]/40 ring-1 ring-[#c1ff72]/20'
                        : 'bg-[#141414] border-white/5 hover:border-white/20 hover:bg-[#1a1a1a]'
                    }`}
                  >
                    {/* Episode thumbnail */}
                    <div className="relative w-24 h-14 rounded-lg overflow-hidden bg-[#111] shrink-0">
                      <Image
                        src={ep.thumbnail}
                        alt={ep.title}
                        fill
                        className="object-cover object-center"
                        sizes="96px"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        {canWatch ? (
                          <Play className={`w-5 h-5 ${isCurrent ? 'text-[#c1ff72] fill-[#c1ff72]' : 'text-white/80 fill-white/80'}`} />
                        ) : (
                          <Lock className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                      {isCurrent && (
                        <div className="absolute bottom-0 inset-x-0 h-1 bg-[#c1ff72]" />
                      )}
                    </div>

                    {/* Episode info */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold ${isCurrent ? 'text-[#c1ff72]' : 'text-white'} truncate`}>
                        EP {ep.episodeNum}. {ep.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-500">{ep.duration}</span>
                        {ep.isFree && (
                          <span className="text-[10px] font-bold text-[#c1ff72]">FREE</span>
                        )}
                        {!ep.isFree && !isLoggedIn && (
                          <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
                            <Lock className="w-2.5 h-2.5" /> Sign In
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Pop-up Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Access Locked Routine"
        subtitle={`Episode "${video.title}" requires an authenticated athlete or coach account on GCL.`}
      />
    </div>
  );
}
