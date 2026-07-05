import { describe, it, expect } from 'vitest';
import { weekKey, weeklyStreak, anchorsForSessions, weekComplete } from './stats.util';
import { Session } from '../models/models';

// Wed Jan 15 2025 12:00 local
const NOW = new Date(2025, 0, 15, 12).getTime();
const DAY = 24 * 3600 * 1000;

let counter = 0;
function session(startedAt: number, dayId: Session['dayId'], exerciseIds: string[] = []): Session {
  return {
    id: `s${counter++}`,
    startedAt,
    endedAt: startedAt + 3600 * 1000,
    dayId,
    entries: exerciseIds.map((id) => ({ exerciseId: id, abilityIds: [], sets: [{ reps: 5 }] })),
  };
}

/** Builds a complete anchor week (3 strength + climb + ride) anchored at the given week's Sunday. */
function completeWeek(sundayMs: number): Session[] {
  return [
    session(sundayMs + 10 * 3600 * 1000, 'sun'),
    session(sundayMs + 1 * DAY, 'mon'),
    session(sundayMs + 2 * DAY, 'tue', ['bouldering']),
    session(sundayMs + 3 * DAY, 'wed'),
    session(sundayMs + 1 * DAY + 18 * 3600 * 1000, null, ['emtb']),
  ];
}

function sundayOf(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d.getTime();
}

describe('weekKey', () => {
  it('maps any weekday to that week\'s Sunday', () => {
    const wed = new Date(2025, 0, 15).getTime(); // Wed
    const sun = new Date(2025, 0, 12).getTime(); // Sunday same week
    const sat = new Date(2025, 0, 18).getTime(); // Saturday same week
    expect(weekKey(wed)).toBe(weekKey(sun));
    expect(weekKey(sat)).toBe(weekKey(sun));
    expect(weekKey(sun)).toBe('2025-01-12');
  });

  it('rolls to previous week correctly across month boundary', () => {
    const sat = new Date(2025, 1, 1).getTime(); // Sat Feb 1 → week of Sun Jan 26
    expect(weekKey(sat)).toBe('2025-01-26');
  });
});

describe('anchors + completion', () => {
  it('counts strength days, climbing and riding', () => {
    const sunday = sundayOf(NOW);
    const anchors = anchorsForSessions(completeWeek(sunday));
    expect(anchors.strength).toBe(3);
    expect(anchors.climb).toBe(1);
    expect(anchors.ride).toBe(1);
    expect(weekComplete(anchors)).toBe(true);
  });

  it('incomplete without a ride', () => {
    const sunday = sundayOf(NOW);
    const sessions = completeWeek(sunday).filter(
      (s) => !s.entries.some((e) => e.exerciseId === 'emtb'),
    );
    expect(weekComplete(anchorsForSessions(sessions))).toBe(false);
  });
});

describe('weeklyStreak', () => {
  const thisSunday = sundayOf(NOW);
  const WEEK = 7 * DAY;

  it('zero with no sessions', () => {
    expect(weeklyStreak([], NOW)).toBe(0);
  });

  it('counts consecutive complete past weeks', () => {
    const sessions = [...completeWeek(thisSunday - WEEK), ...completeWeek(thisSunday - 2 * WEEK)];
    expect(weeklyStreak(sessions, NOW)).toBe(2);
  });

  it('incomplete current week does not break streak', () => {
    const sessions = [
      session(NOW - DAY, 'sun'), // partial current week
      ...completeWeek(thisSunday - WEEK),
    ];
    expect(weeklyStreak(sessions, NOW)).toBe(1);
  });

  it('complete current week extends streak', () => {
    const sessions = [...completeWeek(thisSunday), ...completeWeek(thisSunday - WEEK)];
    expect(weeklyStreak(sessions, NOW)).toBe(2);
  });

  it('gap week breaks streak', () => {
    const sessions = [
      ...completeWeek(thisSunday - WEEK),
      // gap at -2 weeks
      ...completeWeek(thisSunday - 3 * WEEK),
    ];
    expect(weeklyStreak(sessions, NOW)).toBe(1);
  });
});
