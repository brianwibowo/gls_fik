'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/lib/auth';
import { apiGetProfiles, apiUpdateMyProfile } from '@/lib/api';
import type { UserProfile } from '@/lib/types';
import {
  User as UserIcon,
  Award,
  CheckCircle2,
  TrendingUp,
  Shield,
  Edit3,
  Save,
  Check,
  ExternalLink,
} from 'lucide-react';

export default function ProfilesPage() {
  const { user, isLoggedIn, isReady } = useAuth();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'coach' | 'athlete'>('all');

  // Self-profile editing state
  const [isEditing, setIsEditing] = useState(false);
  const [bioInput, setBioInput] = useState('');
  const [avatarInput, setAvatarInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [savingSelf, setSavingSelf] = useState(false);
  const [selfSaved, setSelfSaved] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchProfiles() {
      try {
        const data = await apiGetProfiles();
        if (isMounted) {
          setProfiles(data);
        }
      } catch (err) {
        console.error('Failed to load profiles:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchProfiles();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (user) {
      setBioInput(user.bio || '');
      setAvatarInput(user.avatar || '');
      setNameInput(user.name || '');
    }
  }, [user]);

  const handleSaveSelf = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSelf(true);
    try {
      await apiUpdateMyProfile({
        name: nameInput,
        bio: bioInput,
        avatar: avatarInput,
      });
      setSelfSaved(true);
      setIsEditing(false);
      // Reload profiles
      const refreshed = await apiGetProfiles();
      setProfiles(refreshed);
      setTimeout(() => setSelfSaved(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSavingSelf(false);
    }
  };

  const filteredProfiles = profiles.filter((p) => {
    if (activeTab === 'all') return true;
    return p.role === activeTab;
  });

  const coaches = profiles.filter((p) => p.role === 'coach' || p.role === 'admin');
  const athletes = profiles.filter((p) => p.role === 'athlete');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#c1ff72]/20 text-[#c1ff72] border border-[#c1ff72]/40 text-xs font-bold uppercase tracking-wider">
                Roster &amp; Profiles
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Coaching Staff &amp; Athlete Roster
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Official technical directory for certified coaches and competitive gymnasts. Review personal bios, assigned apparatus roles, and real-time skill completion percentages.
            </p>
          </div>

          {/* Tab Filter */}
          <div className="flex items-center gap-2 bg-[#141b1e] p-1.5 rounded-2xl border border-white/10 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#c1ff72] text-[#1f2a2e] shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              All ({profiles.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('coach')}
              className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'coach'
                  ? 'bg-[#c1ff72] text-[#1f2a2e] shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Coaches ({coaches.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('athlete')}
              className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'athlete'
                  ? 'bg-[#c1ff72] text-[#1f2a2e] shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Athletes ({athletes.length})
            </button>
          </div>
        </div>

        {/* Logged In User Profile Summary Card */}
        {isLoggedIn && user && (
          <div className="bg-[#121721] border border-[#243044] rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle,rgba(193,255,114,0.08)_0%,transparent_70%)] pointer-events-none blur-3xl -z-0" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-[#1f2a2e] border-2 border-[#c1ff72]/40 shrink-0">
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-black text-2xl text-[#c1ff72]">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-white">{user.name}</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#c1ff72]/20 text-[#c1ff72] border border-[#c1ff72]/30">
                      {user.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{user.email}</p>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl">
                    {user.bio || 'No personal bio added yet. Click edit profile to add your credentials or goals.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="min-h-[44px] px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer border border-white/15"
                >
                  <Edit3 className="w-4 h-4 text-[#c1ff72]" />
                  <span>{isEditing ? 'Cancel Edit' : 'Edit My Profile'}</span>
                </button>
              </div>
            </div>

            {/* Profile Edit Drawer Form */}
            {isEditing && (
              <form onSubmit={handleSaveSelf} className="mt-6 pt-6 border-t border-white/10 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      required
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#141a24] border border-[#2c3b52] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-[#c1ff72]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Avatar Image URL</label>
                    <input
                      type="url"
                      value={avatarInput}
                      onChange={(e) => setAvatarInput(e.target.value)}
                      placeholder="https://..."
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#141a24] border border-[#2c3b52] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-[#c1ff72]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Biography &amp; Specialties</label>
                  <textarea
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    rows={2}
                    placeholder="Describe your gymnastics experience, apparatus specialties, or coaching credentials..."
                    className="w-full p-3 rounded-xl bg-[#141a24] border border-[#2c3b52] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-[#c1ff72]"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={savingSelf}
                    className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#c1ff72] hover:bg-[#b0f555] text-[#1f2a2e] font-black text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {savingSelf ? (
                      <span>Saving Changes...</span>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Profile</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {selfSaved && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Profile updated successfully!</span>
              </div>
            )}
          </div>
        )}

        {/* Profiles Grid */}
        {loading ? (
          <div className="py-20 flex items-center justify-center text-xs text-slate-400 gap-2">
            <div className="w-5 h-5 border-2 border-slate-600 border-t-[#c1ff72] rounded-full animate-spin" />
            <span>Loading roster directory...</span>
          </div>
        ) : filteredProfiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((p) => {
              const isAthlete = p.role === 'athlete';
              const completionPercent =
                p.totalCount && p.totalCount > 0 && p.completedCount !== undefined
                  ? Math.round((p.completedCount / p.totalCount) * 100)
                  : 0;

              return (
                <div
                  key={p.id}
                  className="bg-[#141b1e] border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:border-[#c1ff72]/40 hover:bg-[#182124] transition-all shadow-sm hover:shadow-xl group"
                >
                  <div className="space-y-4">
                    {/* User Header */}
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-[#1f2a2e] border border-white/10 shrink-0">
                        {p.avatar ? (
                          <Image
                            src={p.avatar}
                            alt={p.name}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-black text-xl text-[#c1ff72]">
                            {p.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h3 className="text-base font-bold text-white truncate leading-tight">
                            {p.name}
                          </h3>
                        </div>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-white/10 text-[#c1ff72] border border-white/10">
                          {p.role}
                        </span>
                        <p className="text-[11px] text-slate-400 mt-1 truncate">{p.email}</p>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {p.bio || 'Official registered profile in the Gymnastics Competition Level technical system.'}
                    </p>

                    {/* Athlete Progress Metric */}
                    {isAthlete && p.totalCount !== undefined && p.totalCount > 0 && (
                      <div className="p-3.5 rounded-2xl bg-[#0e1315] border border-white/5 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-400">Technique Mastery:</span>
                          <span className="font-black text-[#c1ff72]">
                            {p.completedCount} / {p.totalCount} ({completionPercent}%)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#c1ff72] transition-all duration-500"
                            style={{ width: `${completionPercent}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer Link */}
                  <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-semibold">
                      {isAthlete ? 'Competitor Profile' : 'Technical Coach'}
                    </span>
                    <Link
                      href="/#katalog-video"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#c1ff72] hover:underline"
                    >
                      <span>Apparatus Curriculum</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center text-xs text-slate-400">
            No profiles found in this category.
          </div>
        )}
      </main>
    </div>
  );
}
