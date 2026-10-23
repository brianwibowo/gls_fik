'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useAuth } from '@/lib/auth';
import {
  apiGetLearningTracker,
  apiUpdateLearningItem,
  apiUpdateLearningNote,
  getAuthToken,
} from '@/lib/api';
import type { LearningItem, LearningStatus, LearningTrackerData } from '@/lib/types';
import styles from './LearningTracker.module.css';

interface LearningTrackerProps {
  videoId: string;
  onLogin: () => void;
}

type SaveState = 'pending' | 'saving' | 'saved' | 'error';
type SaveKey = 'note' | `item:${string}`;

const statusLabels: Record<LearningStatus, string> = {
  pending: 'Belum dipelajari',
  review: 'Perlu diulang',
  understood: 'Sudah dipahami',
};

export function LearningTracker({ videoId, onLogin }: LearningTrackerProps) {
  const { isReady, isLoggedIn, user } = useAuth();
  const sessionToken = getAuthToken();

  if (!isReady) {
    return <p className={styles.feedback} role="status">Menyiapkan progres pribadi...</p>;
  }

  if (!isLoggedIn || !user || !sessionToken) {
    return (
      <section className={styles.guest} aria-label="Checklist belajar pribadi">
        <div>
          <h2>Checklist belajar</h2>
          <p>Masuk untuk menandai materi yang sudah kamu pahami dan menyimpan catatan pribadi.</p>
        </div>
        <button type="button" className={styles.primaryButton} onClick={onLogin}>
          Masuk untuk mencatat progres
        </button>
      </section>
    );
  }

  return <PersonalTracker key={`${user.id}:${videoId}:${sessionToken}`} videoId={videoId} sessionToken={sessionToken} />;
}

function PersonalTracker({ videoId, sessionToken }: { videoId: string; sessionToken: string }) {
  const headingId = useId();
  const [tracker, setTracker] = useState<LearningTrackerData | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [reload, setReload] = useState(0);
  const [writes, setWrites] = useState<Partial<Record<SaveKey, SaveState>>>({});
  const drafts = useRef<LearningTrackerData | null>(null);
  const saved = useRef(new Map<SaveKey, string>());
  const timers = useRef(new Map<SaveKey, ReturnType<typeof setTimeout>>());
  const running = useRef(new Set<SaveKey>());
  const active = useRef(false);

  useEffect(() => {
    if (getAuthToken() !== sessionToken) return;
    let cancelled = false;
    active.current = true;

    apiGetLearningTracker(videoId)
      .then((data) => {
        if (cancelled || getAuthToken() !== sessionToken) return;
        drafts.current = data;
        saved.current.set('note', JSON.stringify(data.personalNote));
        data.items.forEach((item) => {
          saved.current.set(`item:${item.id}`, JSON.stringify({ status: item.status, note: item.note }));
        });
        setTracker(data);
      })
      .catch(() => {
        if (!cancelled && getAuthToken() === sessionToken) setLoadError(true);
      });

    const pendingTimers = timers.current;
    return () => {
      cancelled = true;
      active.current = false;
      pendingTimers.forEach(clearTimeout);
      pendingTimers.clear();
    };
  }, [videoId, reload, sessionToken]);

  useEffect(() => {
    function protectUnsavedChanges(event: BeforeUnloadEvent) {
      if (!drafts.current) return;
      const hasUnsavedChanges = Array.from(saved.current).some(([key, value]) => {
        const draft = drafts.current!;
        if (key === 'note') return JSON.stringify(draft.personalNote) !== value;
        const item = draft.items.find((entry) => `item:${entry.id}` === key);
        return item && JSON.stringify({ status: item.status, note: item.note }) !== value;
      });
      if (hasUnsavedChanges) event.preventDefault();
    }

    window.addEventListener('beforeunload', protectUnsavedChanges);
    return () => window.removeEventListener('beforeunload', protectUnsavedChanges);
  }, []);

  async function flush(key: SaveKey) {
    const timer = timers.current.get(key);
    if (timer) clearTimeout(timer);
    timers.current.delete(key);
    if (!active.current || getAuthToken() !== sessionToken || running.current.has(key) || !drafts.current) return;

    running.current.add(key);
    setWrites((current) => ({ ...current, [key]: 'saving' }));

    try {
      // Send each item's latest status and note together, in request order.
      while (active.current && getAuthToken() === sessionToken && drafts.current) {
        const item = key === 'note'
          ? null
          : drafts.current.items.find((entry) => `item:${entry.id}` === key);
        if (key !== 'note' && !item) break;
        const payload = item ? { status: item.status, note: item.note } : drafts.current.personalNote;
        const snapshot = JSON.stringify(payload);
        if (saved.current.get(key) === snapshot) break;

        if (item) {
          await apiUpdateLearningItem(videoId, item.id, payload as Pick<LearningItem, 'status' | 'note'>);
        } else {
          await apiUpdateLearningNote(videoId, payload as string);
        }
        if (!active.current || getAuthToken() !== sessionToken) return;
        saved.current.set(key, snapshot);
      }

      if (active.current && getAuthToken() === sessionToken) setWrites((current) => ({ ...current, [key]: 'saved' }));
    } catch {
      if (active.current && getAuthToken() === sessionToken) setWrites((current) => ({ ...current, [key]: 'error' }));
    } finally {
      running.current.delete(key);
    }
  }

  function schedule(key: SaveKey, immediate = false) {
    const timer = timers.current.get(key);
    if (timer) clearTimeout(timer);
    setWrites((current) => ({ ...current, [key]: 'pending' }));
    if (immediate) {
      void flush(key);
    } else {
      timers.current.set(key, setTimeout(() => void flush(key), 500));
    }
  }

  function updateItem(id: string, change: Partial<Pick<LearningItem, 'status' | 'note'>>) {
    if (!drafts.current) return;
    const next = {
      ...drafts.current,
      items: drafts.current.items.map((item) => item.id === id ? { ...item, ...change } : item),
    };
    drafts.current = next;
    setTracker(next);
    schedule(`item:${id}`, change.status !== undefined);
  }

  function updatePersonalNote(note: string) {
    if (!drafts.current) return;
    const next = { ...drafts.current, personalNote: note };
    drafts.current = next;
    setTracker(next);
    schedule('note');
  }

  if (!tracker) {
    return (
      <section className={styles.feedback} aria-label="Checklist belajar pribadi">
        <h2>Checklist belajar</h2>
        {loadError ? (
          <div role="alert">
            <p>Progres pribadi belum berhasil dimuat. Periksa koneksi lalu coba lagi.</p>
            <button type="button" className={styles.secondaryButton} onClick={() => {
              setLoadError(false);
              setReload((value) => value + 1);
            }}>Muat ulang progres</button>
          </div>
        ) : <p role="status">Memuat progres pribadi...</p>}
      </section>
    );
  }

  const total = tracker.items.length;
  const understood = tracker.items.filter((item) => item.status === 'understood').length;
  const review = tracker.items.filter((item) => item.status === 'review').length;
  const pending = total - understood - review;
  const percentage = total ? Math.round(understood / total * 100) : 0;
  const nextReview = tracker.items.find((item) => item.status === 'review');
  const nextPending = tracker.items.find((item) => item.status === 'pending');
  const failedKeys = (Object.keys(writes) as SaveKey[]).filter((key) => writes[key] === 'error');
  const isSaving = Object.values(writes).some((state) => state === 'pending' || state === 'saving');
  const saveLabel = failedKeys.length ? 'Ada perubahan belum tersimpan' : isSaving ? 'Menyimpan...' : 'Tersimpan';

  return (
    <section className={styles.workspace} aria-labelledby={`${headingId}-checklist`}>
      <div className={styles.checklist}>
        <div className={styles.sectionHeading}>
          <h2 id={`${headingId}-checklist`}>Checklist belajar</h2>
          <span className={styles.saveState} role="status">{saveLabel}</span>
        </div>
        <p className={styles.helper}>Tandai bagian yang sudah kamu pahami. Progres ini milik akunmu.</p>

        {failedKeys.length > 0 && (
          <div className={styles.saveError} role="alert">
            <p>Sebagian perubahan belum tersimpan. Checklist dan catatanmu masih tersedia di halaman ini.</p>
            <button type="button" className={styles.secondaryButton} onClick={() => {
              failedKeys.forEach((key) => void flush(key));
            }}>Coba simpan lagi</button>
          </div>
        )}

        {total > 0 ? (
          <ol className={styles.items}>
            {tracker.items.map((item, index) => {
              const statusId = `${headingId}-status-${index}`;
              const noteId = `${headingId}-note-${index}`;
              return (
                <li key={item.id}>
                  <div className={styles.itemMain}>
                    <span className={styles.itemNumber} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                    <label htmlFor={statusId} className={styles.itemName}>{item.name}</label>
                    <select
                      id={statusId}
                      className={styles.statusControl}
                      aria-label={`Status ${item.name}`}
                      value={item.status}
                      onChange={(event) => updateItem(item.id, { status: event.target.value as LearningStatus })}
                    >
                      {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                  </div>
                  <details className={styles.itemNotes}>
                    <summary aria-label={`Catatan untuk ${item.name}`}>{item.note ? 'Lihat catatan' : 'Tambah catatan'}</summary>
                    <label className={styles.noteLabel} htmlFor={noteId}>Catatan untuk {item.name}</label>
                    <textarea
                      id={noteId}
                      rows={2}
                      maxLength={2000}
                      value={item.note}
                      placeholder="Apa yang ingin kamu ingat dari bagian ini?"
                      onChange={(event) => updateItem(item.id, { note: event.target.value })}
                      onBlur={() => void flush(`item:${item.id}`)}
                    />
                  </details>
                </li>
              );
            })}
          </ol>
        ) : (
          <p className={styles.empty}>Checklist materi ini belum tersedia. Kamu tetap bisa menyimpan catatan pribadi untuk video ini.</p>
        )}
      </div>

      <aside className={styles.summary} aria-labelledby={`${headingId}-summary`}>
        <h2 id={`${headingId}-summary`}>Hasil analisis belajar</h2>
        {total > 0 ? (
          <>
            <div className={styles.progressHeading}>
              <strong>{percentage}%</strong>
              <span>{understood} dari {total} bagian dipahami</span>
            </div>
            <div
              className={styles.track}
              role="progressbar"
              aria-label="Bagian materi yang dipahami"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percentage}
              aria-valuetext={`${understood} dari ${total} bagian dipahami`}
            ><span style={{ width: `${percentage}%` }} /></div>
            <dl className={styles.totals}>
              <div><dt>Sudah dipahami</dt><dd>{understood}</dd></div>
              <div><dt>Perlu diulang</dt><dd>{review}</dd></div>
              <div><dt>Belum dipelajari</dt><dd>{pending}</dd></div>
            </dl>
            <div className={styles.next}>
              <h3>Fokus berikutnya</h3>
              <p>{nextReview ? `Ulangi ${nextReview.name}.` : nextPending ? `Pelajari ${nextPending.name}.` : 'Semua bagian pada video ini sudah kamu tandai dipahami.'}</p>
            </div>
          </>
        ) : <p className={styles.summaryEmpty}>Ringkasan akan tersedia setelah checklist materi ditambahkan.</p>}
        <label className={styles.noteLabel} htmlFor={`${headingId}-personal-note`}>Catatan pribadi</label>
        <textarea
          id={`${headingId}-personal-note`}
          rows={3}
          maxLength={2000}
          value={tracker.personalNote}
          placeholder="Bagian mana yang ingin kamu pelajari lagi?"
          onChange={(event) => updatePersonalNote(event.target.value)}
          onBlur={() => void flush('note')}
        />
        <p className={styles.caption}>Ringkasan dari checklist yang kamu isi, bukan penilaian otomatis gerakan.</p>
      </aside>
    </section>
  );
}
