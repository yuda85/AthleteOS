// Pure stat calculations — kept framework-free for unit testing.
import { Session, PlanDay } from '../models/models';

/** Sunday-start week key (YYYY-MM-DD of that week's Sunday), local time. */
export function weekKey(timestamp: number): string {
  const d = new Date(timestamp);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay()); // back to Sunday
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export interface WeekAnchors {
  strength: number; // sessions on sun/wed + mon strength day
  climb: number;
  ride: number;
}

const STRENGTH_DAYS: (PlanDay['id'] | null)[] = ['sun', 'mon', 'wed'];

export function anchorsForSessions(sessions: Session[]): WeekAnchors {
  const anchors: WeekAnchors = { strength: 0, climb: 0, ride: 0 };
  for (const s of sessions) {
    if (STRENGTH_DAYS.includes(s.dayId)) anchors.strength++;
    const exercises = s.entries.map((e) => e.exerciseId);
    if (s.dayId === 'tue' || exercises.includes('bouldering')) anchors.climb++;
    if (exercises.includes('emtb')) anchors.ride++;
  }
  return anchors;
}

export function weekComplete(anchors: WeekAnchors): boolean {
  return anchors.strength >= 3 && anchors.climb >= 1 && anchors.ride >= 1;
}

/**
 * Streak in completed consecutive weeks, counting back from the previous week.
 * The current (in-progress) week extends the streak if already complete, but an
 * incomplete current week does not break it.
 */
export function weeklyStreak(sessions: Session[], now: number): number {
  const byWeek = new Map<string, Session[]>();
  for (const s of sessions) {
    const key = weekKey(s.startedAt);
    byWeek.set(key, [...(byWeek.get(key) ?? []), s]);
  }

  const WEEK_MS = 7 * 24 * 3600 * 1000;
  let streak = 0;

  const currentKey = weekKey(now);
  const currentComplete = weekComplete(anchorsForSessions(byWeek.get(currentKey) ?? []));
  if (currentComplete) streak++;

  // Walk backwards week by week starting from last week.
  for (let i = 1; ; i++) {
    const key = weekKey(now - i * WEEK_MS);
    const complete = weekComplete(anchorsForSessions(byWeek.get(key) ?? []));
    if (!complete) break;
    streak++;
  }

  return streak;
}
