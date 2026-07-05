import { Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Icon } from '../../shared/icon/icon';
import { ProgressBar } from '../../shared/progress-bar/progress-bar';
import { RadarChart, RadarAxis } from '../../shared/charts/radar-chart';
import { AuthService } from '../../core/auth.service';
import { StatsService } from '../../core/stats.service';
import { ActiveWorkoutStore } from '../../core/active-workout.store';
import { PwaService } from '../../core/pwa.service';
import { PLAN_DAYS } from '../../data/plan.data';

@Component({
  selector: 'aos-dashboard-page',
  imports: [DatePipe, RouterLink, Icon, ProgressBar, RadarChart],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage {
  private readonly router = inject(Router);
  readonly auth = inject(AuthService);
  readonly stats = inject(StatsService);
  readonly workoutStore = inject(ActiveWorkoutStore);
  readonly pwa = inject(PwaService);

  readonly firstName = computed(
    () => this.auth.user()?.displayName?.split(' ')[0] ?? 'אתלט',
  );

  readonly today = PLAN_DAYS[new Date().getDay()];

  readonly radarAxes = computed<RadarAxis[]>(() =>
    this.stats.pillarScores().map((p) => ({
      label: p.title.replace(/\s*\(.*\)/, ''), // short Hebrew label
      value: p.score,
    })),
  );

  readonly anchorItems = computed(() => {
    const a = this.stats.weekAnchors();
    return [
      { label: 'אימוני כוח', done: a.strength, target: 3, icon: 'dumbbell' },
      { label: 'טיפוס', done: a.climb, target: 1, icon: 'climb' },
      { label: 'רכיבה', done: a.ride, target: 1, icon: 'bike' },
    ];
  });

  startToday(): void {
    if (this.workoutStore.isActive()) {
      void this.router.navigateByUrl('/workout');
    } else {
      void this.router.navigate(['/workout'], { queryParams: { day: this.today.id } });
    }
  }
}
