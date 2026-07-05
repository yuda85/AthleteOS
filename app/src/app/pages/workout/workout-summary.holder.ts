import { Injectable, signal } from '@angular/core';
import { PlanDay, SessionEntry } from '../../models/models';
import { PrEvent } from '../../core/session.service';

export interface WorkoutSummaryData {
  session: {
    startedAt: number;
    endedAt: number;
    dayId: PlanDay['id'] | null;
    entries: SessionEntry[];
  };
  prs: PrEvent[];
}

/** Hands the just-finished session from the workout screen to the summary screen. */
@Injectable({ providedIn: 'root' })
export class WorkoutSummaryHolder {
  readonly data = signal<WorkoutSummaryData | null>(null);

  set(data: WorkoutSummaryData): void {
    this.data.set(data);
  }

  clear(): void {
    this.data.set(null);
  }
}
