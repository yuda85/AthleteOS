import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Icon } from '../../shared/icon/icon';
import { ProgressBar } from '../../shared/progress-bar/progress-bar';
import { VideoCard, detectPlatform } from '../../shared/video-card/video-card';
import { AbilityService } from '../../core/ability.service';
import { Milestone } from '../../models/models';

@Component({
  selector: 'aos-skill-detail-page',
  imports: [RouterLink, FormsModule, DatePipe, Icon, ProgressBar, VideoCard],
  templateUrl: './skill-detail-page.html',
  styleUrl: './skill-detail-page.scss',
})
export class SkillDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly abilityService = inject(AbilityService);

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
