import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Icon } from '../../shared/icon/icon';
import { ProgressBar } from '../../shared/progress-bar/progress-bar';
import { VideoCard, detectPlatform } from '../../shared/video-card/video-card';
import { LineChart, ChartPoint } from '../../shared/charts/line-chart';
import { AbilityService } from '../../core/ability.service';
import { SessionService } from '../../core/session.service';
import { Milestone } from '../../models/models';
import { EXERCISES } from '../../data/exercises.data';

const abilityExercises = new Map<string, string[]>();
for (const ex of EXERCISES) {
  for (const abilityId of ex.abilityIds) {
    abilityExercises.set(abilityId, [...(abilityExercises.get(abilityId) ?? []), ex.id]);
  }
}

@Component({
  selector: 'aos-skill-detail-page',
  imports: [RouterLink, FormsModule, DatePipe, Icon, ProgressBar, VideoCard, LineChart],
  templateUrl: './skill-detail-page.html',
  styleUrl: './skill-detail-page.scss',
})
export class SkillDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly abilityService = inject(AbilityService);
  private readonly sessions = inject(SessionService);

  private readonly abilityId = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('id') ?? '')),
    { initialValue: '' },
  );

  readonly ability = computed(() =>
    this.abilityService.abilities().find((a) => a.id === this.abilityId()),
  );

  readonly level = computed(() => this.ability()?.milestones.filter((m) => m.achieved).length ?? 0);

  /** The first unachieved milestone — the current target. */
  readonly nextMilestone = computed(() => this.ability()?.milestones.find((m) => !m.achieved));

  /** History: best value per session for this ability's exercises, by its metric. */
  readonly historyPoints = computed<ChartPoint[]>(() => {
    const ability = this.ability();
    if (!ability) return [];
    const exerciseIds = new Set(abilityExercises.get(ability.id) ?? []);
    const points: ChartPoint[] = [];

    for (const session of this.sessions.sessions()) {
      let best = 0;
      for (const entry of session.entries) {
        if (!exerciseIds.has(entry.exerciseId)) continue;
        for (const set of entry.sets) {
          const value =
            ability.metricType === 'load'
              ? set.weight ?? 0
              : ability.metricType === 'rounds'
                ? set.rounds ?? 0
                : (set.seconds ?? 0) / 60; // hold/session → minutes
          if (value > best) best = value;
        }
      }
      if (best > 0) points.push({ x: session.startedAt, y: best });
    }
    return points;
  });

  readonly historyUnit = computed(() => {
    const metricType = this.ability()?.metricType;
    if (metricType === 'load') return 'ק"ג';
    if (metricType === 'rounds') return 'סבבים';
    return 'דקות';
  });

  /** Personal bests for this ability's exercises. */
  readonly prList = computed(() => {
    const ability = this.ability();
    if (!ability) return [];
    const exerciseIds = abilityExercises.get(ability.id) ?? [];
    const bests = this.sessions.bests();
    const exerciseName = new Map(EXERCISES.map((e) => [e.id, e.name]));
    const rows: { name: string; label: string }[] = [];

    for (const id of exerciseIds) {
      const best = bests.get(id);
      if (!best) continue;
      const parts: string[] = [];
      if (best.weight) parts.push(`${best.weight} ק"ג`);
      if (best.seconds) {
        const m = Math.floor(best.seconds / 60);
        const s = best.seconds % 60;
        parts.push(m > 0 ? `${m}:${String(s).padStart(2, '0')} דק'` : `${s} שנ'`);
      }
      if (best.rounds) parts.push(`${best.rounds} סבבים`);
      if (best.distance) parts.push(`${best.distance} ק"מ`);
      if (parts.length) rows.push({ name: exerciseName.get(id) ?? id, label: parts.join(' · ') });
    }
    return rows;
  });

  // Video form
  readonly showVideoForm = signal(false);
  videoUrl = '';
  videoTitle = '';

  // Milestone form
  readonly showMilestoneForm = signal(false);
  milestoneTitle = '';

  // Notes editing (debounced-on-blur)
  notesDraft: string | null = null;

  readonly confirmingMilestone = signal<Milestone | null>(null);

  async toggleMilestone(m: Milestone): Promise<void> {
    const ability = this.ability();
    if (!ability) return;
    if (!m.achieved) {
      this.confirmingMilestone.set(m);
    } else {
      await this.abilityService.setMilestoneAchieved(ability.id, m.id, false);
    }
  }

  async confirmMilestone(): Promise<void> {
    const ability = this.ability();
    const m = this.confirmingMilestone();
    if (!ability || !m) return;
    await this.abilityService.setMilestoneAchieved(ability.id, m.id, true);
    this.confirmingMilestone.set(null);
  }

  async addVideo(): Promise<void> {
    const ability = this.ability();
    const url = this.videoUrl.trim();
    if (!ability || !url) return;
    await this.abilityService.addVideo(ability.id, {
      url,
      platform: detectPlatform(url),
      title: this.videoTitle.trim() || 'סרטון הדרכה',
    });
    this.videoUrl = '';
    this.videoTitle = '';
    this.showVideoForm.set(false);
  }

  async removeVideo(url: string): Promise<void> {
    const ability = this.ability();
    if (!ability) return;
    await this.abilityService.removeVideo(ability.id, url);
  }

  async addMilestone(): Promise<void> {
    const ability = this.ability();
    const title = this.milestoneTitle.trim();
    if (!ability || !title) return;
    await this.abilityService.addMilestone(ability.id, title);
    this.milestoneTitle = '';
    this.showMilestoneForm.set(false);
  }

  async deleteMilestone(m: Milestone): Promise<void> {
    const ability = this.ability();
    if (!ability) return;
    await this.abilityService.deleteMilestone(ability.id, m.id);
  }

  async saveNotes(value: string): Promise<void> {
    const ability = this.ability();
    if (!ability || value === ability.notes) return;
    await this.abilityService.updateAbility(ability.id, { notes: value });
  }

  async deleteAbility(): Promise<void> {
    const ability = this.ability();
    if (!ability) return;
    if (!confirm(`למחוק את "${ability.name}" לצמיתות?`)) return;
    await this.abilityService.deleteAbility(ability.id);
    await this.router.navigateByUrl('/skills');
  }
}
