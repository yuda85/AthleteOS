import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Icon } from '../../shared/icon/icon';
import { WorkoutSummaryHolder } from './workout-summary.holder';
import { AbilityService } from '../../core/ability.service';
import { PrEvent } from '../../core/session.service';
import { EXERCISES } from '../../data/exercises.data';
import { Milestone } from '../../models/models';

const exerciseById = new Map(EXERCISES.map((e) => [e.id, e]));

const PR_KIND_LABELS: Record<PrEvent['kind'], string> = {
  weight: 'משקל שיא',
  seconds: 'זמן שיא',
  rounds: 'סבבים שיא',
  distance: 'מרחק שיא',
};

@Component({
  selector: 'aos-summary-page',
  imports: [RouterLink, Icon],
  templateUrl: './summary-page.html',
  styleUrl: './summary-page.scss',
})
export class SummaryPage {
  private readonly router = inject(Router);
  readonly holder = inject(WorkoutSummaryHolder);
  readonly abilityService = inject(AbilityService);

  readonly data = this.holder.data;

  readonly durationLabel = computed(() => {
    const d = this.data();
    if (!d) return '';
    const total = Math.floor((d.session.endedAt - d.session.startedAt) / 1000);
    const h = Math.floor(total / 3600);
    const m = Math.round((total % 3600) / 60);
    return h > 0 ? `${h} שע' ${m} דק'` : `${m} דק'`;
  });

  readonly totalSets = computed(
    () => this.data()?.session.entries.reduce((sum, e) => sum + e.sets.length, 0) ?? 0,
  );

  /** Abilities touched in this session with their next unachieved milestone. */
  readonly milestoneCandidates = computed(() => {
    const d = this.data();
    if (!d) return [];
    const touched = new Set(d.session.entries.flatMap((e) => e.abilityIds));
    return this.abilityService
      .abilities()
      .filter((a) => touched.has(a.id))
      .map((a) => ({ ability: a, next: a.milestones.find((m) => !m.achieved) }))
      .filter((x): x is { ability: (typeof x)['ability']; next: Milestone } => !!x.next);
  });

  exerciseName(id: string): string {
    return exerciseById.get(id)?.name ?? id;
  }

  prLabel(pr: PrEvent): string {
    const value =
      pr.kind === 'seconds'
        ? `${Math.floor(pr.value / 60)}:${String(pr.value % 60).padStart(2, '0')}`
        : `${pr.value}`;
    return `${PR_KIND_LABELS[pr.kind]}: ${value}`;
  }

  async unlockMilestone(abilityId: string, milestoneId: string): Promise<void> {
    await this.abilityService.setMilestoneAchieved(abilityId, milestoneId, true);
  }

  async done(): Promise<void> {
    this.holder.clear();
    await this.router.navigateByUrl('/dashboard');
  }
}
