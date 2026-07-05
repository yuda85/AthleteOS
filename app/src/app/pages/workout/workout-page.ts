import { Component, computed, inject, signal, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Icon } from '../../shared/icon/icon';
import { ActiveWorkoutStore } from '../../core/active-workout.store';
import { SessionService } from '../../core/session.service';
import { WorkoutSummaryHolder } from './workout-summary.holder';
import { EXERCISES } from '../../data/exercises.data';
import { Exercise, PlanDay, SetEntry } from '../../models/models';

const exerciseById = new Map(EXERCISES.map((e) => [e.id, e]));

interface SetDraft {
  weight?: number;
  reps?: number;
  minutes?: number;
  seconds?: number;
  rounds?: number;
  distanceKm?: number;
}

@Component({
  selector: 'aos-workout-page',
  imports: [FormsModule, Icon],
  templateUrl: './workout-page.html',
  styleUrl: './workout-page.scss',
})
export class WorkoutPage implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly sessions = inject(SessionService);
  private readonly summaryHolder = inject(WorkoutSummaryHolder);
  readonly store = inject(ActiveWorkoutStore);

  readonly exerciseLibrary = EXERCISES;
  readonly showAddExercise = signal(false);
  readonly finishing = signal(false);

  /** Per-exercise input drafts. */
  readonly drafts = new Map<string, SetDraft>();

  // Rest timer
  readonly restRemaining = signal(0);
  private restHandle: ReturnType<typeof setInterval> | null = null;
  readonly restOptions = [60, 90, 120, 180];

  constructor() {
    const dayParam = this.route.snapshot.queryParamMap.get('day') as PlanDay['id'] | null;
    if (!this.store.isActive()) {
      if (dayParam) {
        this.store.start(dayParam);
      } else {
        this.store.start(null);
      }
    }
  }

  ngOnDestroy(): void {
    this.clearRest();
  }

  readonly elapsed = computed(() => {
    const total = this.store.elapsedSeconds();
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    const mm = String(m).padStart(2, '0');
    const ss = String(s).padStart(2, '0');
    return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
  });

  exercise(id: string): Exercise | undefined {
    return exerciseById.get(id);
  }

  draft(exerciseId: string): SetDraft {
    let d = this.drafts.get(exerciseId);
    if (!d) {
      d = {};
      this.drafts.set(exerciseId, d);
    }
    return d;
  }

  addSet(exerciseId: string): void {
    const ex = this.exercise(exerciseId);
    const d = this.draft(exerciseId);
    if (!ex) return;

    const set: SetEntry = {};
    switch (ex.metricType) {
      case 'weightReps':
        if (!d.reps) return;
        set.reps = d.reps;
        if (d.weight) set.weight = d.weight;
        break;
      case 'time':
        if (!d.minutes && !d.seconds) return;
        set.seconds = (d.minutes ?? 0) * 60 + (d.seconds ?? 0);
        break;
      case 'rounds':
        if (!d.rounds) return;
        set.rounds = d.rounds;
        break;
      case 'session':
        if (!d.minutes && !d.distanceKm) return;
        if (d.minutes) set.seconds = d.minutes * 60;
        if (d.distanceKm) set.distanceKm = d.distanceKm;
        break;
    }
    this.store.addSet(exerciseId, set);
  }

  repeatLast(exerciseId: string): void {
    const entry = this.store.entries().find((e) => e.exerciseId === exerciseId);
    const last = entry?.sets.at(-1);
    if (last) this.store.addSet(exerciseId, { ...last });
  }

  setLabel(set: SetEntry): string {
    const parts: string[] = [];
    if (set.weight != null) parts.push(`${set.weight} ק"ג`);
    if (set.reps != null) parts.push(`× ${set.reps}`);
    if (set.seconds != null) {
      const m = Math.floor(set.seconds / 60);
      const s = set.seconds % 60;
      parts.push(m > 0 ? `${m} דק'${s ? ` ${s} שנ'` : ''}` : `${s} שנ'`);
    }
    if (set.rounds != null) parts.push(`${set.rounds} סבבים`);
    if (set.distanceKm != null) parts.push(`${set.distanceKm} ק"מ`);
    return parts.join(' ') || '—';
  }

  availableToAdd(): Exercise[] {
    const current = new Set(this.store.entries().map((e) => e.exerciseId));
    return this.exerciseLibrary.filter((e) => !current.has(e.id));
  }

  addExercise(id: string): void {
    this.store.addExercise(id);
    this.showAddExercise.set(false);
  }

  startRest(seconds: number): void {
    this.clearRest();
    this.restRemaining.set(seconds);
    this.restHandle = setInterval(() => {
      const next = this.restRemaining() - 1;
      this.restRemaining.set(next);
      if (next <= 0) {
        this.clearRest();
        try {
          navigator.vibrate?.([200, 100, 200]);
        } catch {
          // vibration unsupported
        }
      }
    }, 1000);
  }

  clearRest(): void {
    if (this.restHandle) {
      clearInterval(this.restHandle);
      this.restHandle = null;
    }
    this.restRemaining.set(0);
  }

  async finish(): Promise<void> {
    if (this.finishing()) return;
    this.finishing.set(true);
    try {
      const raw = this.store.finish();
      if (!raw) return;
      if (raw.entries.length === 0) {
        await this.router.navigateByUrl('/dashboard');
        return;
      }
      const prs = await this.sessions.save({ ...raw, notes: '' });
      this.summaryHolder.set({ session: raw, prs });
      await this.router.navigateByUrl('/workout/summary');
    } finally {
      this.finishing.set(false);
    }
  }

  async discard(): Promise<void> {
    if (!confirm('לבטל את האימון? הנתונים שנרשמו יימחקו.')) return;
    this.store.discard();
    await this.router.navigateByUrl('/plan');
  }
}
