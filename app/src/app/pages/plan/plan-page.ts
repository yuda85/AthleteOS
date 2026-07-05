import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Icon } from '../../shared/icon/icon';
import { ActiveWorkoutStore } from '../../core/active-workout.store';
import { PLAN_DAYS, SYSTEM_RULE } from '../../data/plan.data';
import { EXERCISES } from '../../data/exercises.data';
import { Exercise, ExerciseCategory, ExerciseTier, PlanItem } from '../../models/models';

const CATEGORY_META: Record<ExerciseCategory, { label: string; cssVar: string }> = {
  Skill: { label: 'מיומנות', cssVar: 'var(--cat-skill)' },
  Strength: { label: 'כוח', cssVar: 'var(--cat-strength)' },
  Core: { label: 'ליבה', cssVar: 'var(--cat-core)' },
  Carry: { label: 'נשיאה', cssVar: 'var(--cat-carry)' },
  Accessory: { label: 'עזר', cssVar: 'var(--cat-core)' },
  Power: { label: 'כוח מתפרץ', cssVar: 'var(--cat-power)' },
  Mobility: { label: 'תנועתיות', cssVar: 'var(--cat-mobility)' },
  Activity: { label: 'פעילות', cssVar: 'var(--cat-mobility)' },
};

const TIER_LABELS: Record<ExerciseTier, string> = {
  primary: 'ראשי',
  secondary: 'משני',
  optional: 'אופציונלי',
};

const exerciseById = new Map(EXERCISES.map((e) => [e.id, e]));

@Component({
  selector: 'aos-plan-page',
  imports: [Icon],
  templateUrl: './plan-page.html',
  styleUrl: './plan-page.scss',
})
export class PlanPage {
  private readonly router = inject(Router);
  private readonly workoutStore = inject(ActiveWorkoutStore);

  readonly days = PLAN_DAYS;
  readonly systemRule = SYSTEM_RULE;
  readonly todayIndex = new Date().getDay();
  readonly selectedIndex = signal(this.todayIndex);

  readonly workoutActive = this.workoutStore.isActive;

  startWorkout(): void {
    void this.router.navigate(['/workout'], { queryParams: { day: this.selectedDay().id } });
  }

  resumeWorkout(): void {
    void this.router.navigateByUrl('/workout');
  }

  readonly selectedDay = computed(() => this.days[this.selectedIndex()]);

  /** Non-anchor days show the "days are not anchors" system rule. */
  readonly showRule = computed(() =>
    ['tue', 'thu', 'fri', 'sat', 'mon'].includes(this.selectedDay().id),
  );

  categoryMeta(category: ExerciseCategory) {
    return CATEGORY_META[category];
  }

  tierLabel(tier: ExerciseTier | undefined): string | null {
    return tier ? TIER_LABELS[tier] : null;
  }

  exercise(item: PlanItem): Exercise | undefined {
    return exerciseById.get(item.exerciseId);
  }

  selectDay(i: number): void {
    this.selectedIndex.set(i);
  }
}
