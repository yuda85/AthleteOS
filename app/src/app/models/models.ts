// Core domain models — mirror the Firestore shapes in docs/plans/2026-07-05-athleteos-v1.0-architecture.md §4.

export type AbilityKind = 'skill' | 'activity';

/** How an ability's key metric is measured. */
export type AbilityMetricType = 'hold' | 'load' | 'session' | 'rounds';

/** How an exercise is logged during a workout. */
export type ExerciseMetricType = 'weightReps' | 'time' | 'rounds' | 'session';

export type ExerciseCategory =
  | 'Skill'
  | 'Strength'
  | 'Core'
  | 'Carry'
  | 'Accessory'
  | 'Power'
  | 'Mobility'
  | 'Activity';

export type ExerciseTier = 'primary' | 'secondary' | 'optional';

export type Pillar =
  | 'skill'
  | 'strength'
  | 'staticStrength'
  | 'core'
  | 'power'
  | 'movement'
  | 'grip'
  | 'conditioning'
  | 'mobility'
  | 'resilience';

export interface VideoRef {
  url: string;
  platform: 'youtube' | 'instagram' | 'tiktok' | 'other';
  title: string;
}

export interface Milestone {
  id: string;
  title: string;
  order: number;
  achieved: boolean;
  achievedAt: number | null; // epoch ms
}

export interface Ability {
  id: string;
  name: string;
  icon: string;
  kind: AbilityKind;
  metricType: AbilityMetricType;
  pillars: Pillar[];
  videos: VideoRef[];
  notes: string;
  order: number;
}

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  tier?: ExerciseTier;
  icon: string;
  metricType: ExerciseMetricType;
  abilityIds: string[];
}

export interface PlanItem {
  exerciseId: string;
  sets?: string;
  reps?: string;
  rest?: string;
  note?: string;
  tier?: ExerciseTier;
}

export interface PlanSection {
  category: ExerciseCategory;
  items: PlanItem[];
}

export interface PlanDay {
  id: 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';
  label: string;
  title: string;
  targetTime?: string;
  focus?: string;
  sections: PlanSection[];
  /** JS Date.getDay() index, 0 = Sunday. */
  dayIndex: number;
}

export interface SetEntry {
  weight?: number;
  reps?: number;
  seconds?: number;
  rounds?: number;
  distanceKm?: number;
}

export interface SessionEntry {
  exerciseId: string;
  abilityIds: string[];
  sets: SetEntry[];
  note?: string;
}

export interface Session {
  id: string;
  startedAt: number;
  endedAt: number;
  dayId: PlanDay['id'] | null;
  entries: SessionEntry[];
  notes?: string;
}

export interface PrRecord {
  exerciseId: string;
  best: SetEntry;
  sessionId: string;
  date: number;
}
