import { Injectable, computed, inject } from '@angular/core';
import { AbilityService } from './ability.service';
import { SessionService } from './session.service';
import { anchorsForSessions, weekKey, weeklyStreak } from './stats.util';
import { Pillar } from '../models/models';
import { PILLARS } from '../data/philosophy.data';

export interface PillarScore {
  key: Pillar;
  title: string;
  /** 0..1 — milestone completion across abilities mapped to this pillar. */
  score: number;
}

export interface RecentUnlock {
  abilityId: string;
  abilityName: string;
  milestoneTitle: string;
  achievedAt: number;
}

@Injectable({ providedIn: 'root' })
export class StatsService {
  private readonly abilities = inject(AbilityService);
  private readonly sessions = inject(SessionService);

  /** Athlete Level = total milestones achieved across all abilities. */
  readonly athleteLevel = computed(() =>
    this.abilities
      .abilities()
      .reduce((sum, a) => sum + a.milestones.filter((m) => m.achieved).length, 0),
  );

  readonly totalMilestones = computed(() =>
    this.abilities.abilities().reduce((sum, a) => sum + a.milestones.length, 0),
  );

  readonly pillarScores = computed<PillarScore[]>(() => {
    const abilities = this.abilities.abilities();
    return PILLARS.map((p) => {
      const mapped = abilities.filter((a) => a.pillars.includes(p.key as Pillar));
      const total = mapped.reduce((s, a) => s + a.milestones.length, 0);
      const achieved = mapped.reduce(
        (s, a) => s + a.milestones.filter((m) => m.achieved).length,
        0,
      );
      return {
        key: p.key as Pillar,
        title: p.title,
        score: total > 0 ? achieved / total : 0,
      };
    });
  });

  readonly weekAnchors = computed(() => {
    const now = Date.now();
    const currentWeek = weekKey(now);
    const thisWeek = this.sessions.sessions().filter((s) => weekKey(s.startedAt) === currentWeek);
    return anchorsForSessions(thisWeek);
  });

  readonly streak = computed(() => weeklyStreak(this.sessions.sessions(), Date.now()));

  readonly recentUnlocks = computed<RecentUnlock[]>(() =>
    this.abilities
      .abilities()
      .flatMap((a) =>
        a.milestones
          .filter((m) => m.achieved && m.achievedAt)
          .map((m) => ({
            abilityId: a.id,
            abilityName: a.name,
            milestoneTitle: m.title,
            achievedAt: m.achievedAt!,
          })),
      )
      .sort((x, y) => y.achievedAt - x.achievedAt)
      .slice(0, 5),
  );
}
