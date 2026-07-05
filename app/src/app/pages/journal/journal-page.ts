import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Icon } from '../../shared/icon/icon';
import { SessionService } from '../../core/session.service';
import { Session, SetEntry } from '../../models/models';
import { EXERCISES } from '../../data/exercises.data';
import { PLAN_DAYS } from '../../data/plan.data';

const exerciseById = new Map(EXERCISES.map((e) => [e.id, e]));
const dayById = new Map(PLAN_DAYS.map((d) => [d.id, d]));

@Component({
  selector: 'aos-journal-page',
  imports: [DatePipe, Icon],
  templateUrl: './journal-page.html',
  styleUrl: './journal-page.scss',
})
export class JournalPage {
  readonly sessions = inject(SessionService);
  readonly expanded = signal<string | null>(null);

  toggle(id: string): void {
    this.expanded.update((cur) => (cur === id ? null : id));
  }

  dayTitle(session: Session): string {
    if (!session.dayId) return 'אימון חופשי';
    const day = dayById.get(session.dayId);
    return day ? `${day.label} — ${day.title}` : 'אימון';
  }

  duration(session: Session): string {
    const total = Math.floor((session.endedAt - session.startedAt) / 1000);
    const h = Math.floor(total / 3600);
    const m = Math.round((total % 3600) / 60);
    return h > 0 ? `${h} שע' ${m} דק'` : `${m} דק'`;
  }

  exerciseName(id: string): string {
    return exerciseById.get(id)?.name ?? id;
  }

  setLabel(set: SetEntry): string {
    const parts: string[] = [];
    if (set.weight != null) parts.push(`${set.weight} ק"ג`);
    if (set.reps != null) parts.push(`× ${set.reps}`);
    if (set.seconds != null) {
      const m = Math.floor(set.seconds / 60);
      const s = set.seconds % 60;
      parts.push(m > 0 ? `${m} דק'${s ? ` ${s} שנ'` : ''}` : `${s} שנ'`);
    }
    if (set.rounds != null) parts.push(`${set.rounds} סבבים`);
    if (set.distanceKm != null) parts.push(`${set.distanceKm} ק"מ`);
    return parts.join(' ') || '—';
  }

  async deleteSession(session: Session): Promise<void> {
    if (!confirm('למחוק את האימון הזה מהיומן?')) return;
    await this.sessions.delete(session.id);
  }
}
