import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../shared/icon/icon';
import { ProgressBar } from '../../shared/progress-bar/progress-bar';
import { AbilityService } from '../../core/ability.service';
import { AddAbilityForm } from './add-ability-form';

@Component({
  selector: 'aos-skills-page',
  imports: [RouterLink, Icon, ProgressBar, AddAbilityForm],
  templateUrl: './skills-page.html',
  styleUrl: './skills-page.scss',
})
export class SkillsPage {
  readonly abilityService = inject(AbilityService);
  readonly showAddForm = signal(false);

  achievedCount(milestones: { achieved: boolean }[]): number {
    return milestones.filter((m) => m.achieved).length;
  }
}
