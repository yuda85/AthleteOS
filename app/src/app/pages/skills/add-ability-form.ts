import { Component, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Icon } from '../../shared/icon/icon';
import { AbilityService } from '../../core/ability.service';
import { AbilityKind, AbilityMetricType, Pillar } from '../../models/models';
import { PILLARS } from '../../data/philosophy.data';

const ICON_CHOICES = [
  'skillHandstand', 'skillTgu', 'pull', 'push', 'squat', 'core', 'carry',
  'power', 'mobility', 'grip', 'climb', 'bike', 'flow', 'walk', 'dumbbell', 'trophy',
];

@Component({
  selector: 'aos-add-ability-form',
  imports: [FormsModule, Icon],
  templateUrl: './add-ability-form.html',
  styleUrl: './add-ability-form.scss',
})
export class AddAbilityForm {
  private readonly abilityService = inject(AbilityService);

  readonly closed = output<void>();

  readonly iconChoices = ICON_CHOICES;
  readonly pillarChoices = PILLARS;

  name = '';
  kind: AbilityKind = 'skill';
  metricType: AbilityMetricType = 'hold';
  icon = ICON_CHOICES[0];
  readonly selectedPillars = signal<Set<Pillar>>(new Set());
  milestonesText = '';

  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  togglePillar(key: string): void {
    this.selectedPillars.update((prev) => {
      const next = new Set(prev);
      const pillar = key as Pillar;
      if (next.has(pillar)) next.delete(pillar);
      else if (next.size < 3) next.add(pillar);
      return next;
    });
  }

  async save(): Promise<void> {
    const name = this.name.trim();
    if (!name) {
      this.error.set('שם חובה');
      return;
    }
    this.saving.set(true);
    this.error.set(null);

    const id = `ability-${Date.now()}`;
    const milestones = this.milestonesText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((title, i) => ({ id: `${id}-ms-${i}`, title, order: i }));

    try {
      await this.abilityService.createAbility(
        {
          id,
          name,
          icon: this.icon,
          kind: this.kind,
          metricType: this.metricType,
          pillars: [...this.selectedPillars()],
          videos: [],
          notes: '',
          order: this.abilityService.abilities().length,
        },
        milestones,
      );
      this.closed.emit();
    } catch {
      this.error.set('השמירה נכשלה. נסה שוב.');
    } finally {
      this.saving.set(false);
    }
  }
}
