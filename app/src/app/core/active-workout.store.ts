import { Injectable, computed, signal } from '@angular/core';
import { PlanDay, SessionEntry, SetEntry } from '../models/models';
import { EXERCISES } from '../data/exercises.data';
import { PLAN_DAYS } from '../data/plan.data';

const STORAGE_KEY = 'aos-active-workout';

interface ActiveWorkoutState {
  startedAt: number;
  dayId: PlanDay['id'] | null;
  /** Accumulated paused milliseconds. */
  pausedMs: number;
  /** When non-null — currently paused since this timestamp. */
  pausedAt: number | null;
  entries: SessionEntry[];
}

const exerciseById = new Map(EXERCISES.map((e) => [e.id, e]));

/**
 * Live workout session state. Mirrored to localStorage on every mutation so a
 * refresh or accidental tab close never loses a session in progress.
 */
@Injectable({ providedIn: 'root' })
export class ActiveWorkoutStore {
  private readonly state = signal<ActiveWorkoutState | null>(this.restore());

  /** Ticks every second while a session is live (drives the timer display). */
  private readonly tick = signal(0);
  private tickHandle: ReturnType<typeof setInterval> | null = null;

  readonly isActive = computed(() => this.state() !== null);
  readonly isPaused = computed(() => this.state()?.pausedAt != null);
  readonly dayId = computed(() => this.state()?.dayId ?? null);
  readonly entries = computed(() => this.state()?.entries ?? []);

  readonly day = computed(() => {
    const id = this.dayId();
    return id ? PLAN_DAYS.find((d) => d.id === id) ?? null : null;
  });

  readonly elapsedSeconds = computed(() => {
    this.tick();
    const s = this.state();
    if (!s) return 0;
    const pausedNow = s.pausedAt ? Date.now() - s.pausedAt : 0;
    return Math.max(0, Math.floor((Date.now() - s.startedAt - s.pausedMs - pausedNow) / 1000));
  });

  constructor() {
    if (this.state()) this.startTicking();
  }

  start(dayId: PlanDay['id'] | null): void {
    const day = dayId ? PLAN_DAYS.find((d) => d.id === dayId) : null;
    const entries: SessionEntry[] =
      day?.sections.flatMap((section) =>
        section.items.map((item) => ({
          exerciseId: item.exerciseId,
          abilityIds: exerciseById.get(item.exerciseId)?.abilityIds ?? [],
          sets: [],
        })),
      ) ?? [];

    // A plan day can repeat an exercise (e.g. handstand as warmup); dedupe keeps one card each.
    const seen = new Set<string>();
    const deduped = entries.filter((e) =>
      seen.has(e.exerciseId) ? false : (seen.add(e.exerciseId), true),
    );

    this.update({
      startedAt: Date.now(),
      dayId,
      pausedMs: 0,
      pausedAt: null,
      entries: deduped,
    });
    this.startTicking();
  }

  pause(): void {
    const s = this.state();
    if (!s || s.pausedAt) return;
    this.update({ ...s, pausedAt: Date.now() });
  }

  resume(): void {
    const s = this.state();
    if (!s || !s.pausedAt) return;
    this.update({ ...s, pausedMs: s.pausedMs + (Date.now() - s.pausedAt), pausedAt: null });
  }

  addSet(exerciseId: string, set: SetEntry): void {
    const s = this.state();
    if (!s) return;
    this.update({
      ...s,
      entries: s.entries.map((e) =>
        e.exerciseId === exerciseId ? { ...e, sets: [...e.sets, set] } : e,
      ),
    });
  }

  removeSet(exerciseId: string, index: number): void {
    const s = this.state();
    if (!s) return;
    this.update({
      ...s,
      entries: s.entries.map((e) =>
        e.exerciseId === exerciseId ? { ...e, sets: e.sets.filter((_, i) => i !== index) } : e,
      ),
    });
  }

  addExercise(exerciseId: string): void {
    const s = this.state();
    if (!s || s.entries.some((e) => e.exerciseId === exerciseId)) return;
    this.update({
      ...s,
      entries: [
        ...s.entries,
        {
          exerciseId,
          abilityIds: exerciseById.get(exerciseId)?.abilityIds ?? [],
          sets: [],
        },
      ],
    });
  }

  removeExercise(exerciseId: string): void {
    const s = this.state();
    if (!s) return;
    this.update({ ...s, entries: s.entries.filter((e) => e.exerciseId !== exerciseId) });
  }

  /** Returns the finished session raw data and clears the store. */
  finish(): { startedAt: number; endedAt: number; dayId: PlanDay['id'] | null; entries: SessionEntry[] } | null {
    const s = this.state();
    if (!s) return null;
    const result = {
      startedAt: s.startedAt,
      endedAt: Date.now(),
      dayId: s.dayId,
      entries: s.entries.filter((e) => e.sets.length > 0),
    };
    this.update(null);
    this.stopTicking();
    return result;
  }

  discard(): void {
    this.update(null);
    this.stopTicking();
  }

  private update(next: ActiveWorkoutState | null): void {
    this.state.set(next);
    try {
      if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Storage unavailable — session still lives in memory.
    }
  }

  private restore(): ActiveWorkoutState | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as ActiveWorkoutState) : null;
    } catch {
      return null;
    }
  }

  private startTicking(): void {
    if (this.tickHandle) return;
    this.tickHandle = setInterval(() => this.tick.update((t) => t + 1), 1000);
  }

  private stopTicking(): void {
    if (this.tickHandle) {
      clearInterval(this.tickHandle);
      this.tickHandle = null;
    }
  }
}
