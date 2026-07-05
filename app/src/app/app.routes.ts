import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./pages/auth/auth-page').then((m) => m.AuthPage),
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard-page').then((m) => m.DashboardPage),
      },
      {
        path: 'plan',
        loadComponent: () => import('./pages/plan/plan-page').then((m) => m.PlanPage),
      },
      {
        path: 'skills',
        loadComponent: () => import('./pages/skills/skills-page').then((m) => m.SkillsPage),
      },
      {
        path: 'skills/:id',
        loadComponent: () =>
          import('./pages/skills/skill-detail-page').then((m) => m.SkillDetailPage),
      },
      {
        path: 'journal',
        loadComponent: () => import('./pages/journal/journal-page').then((m) => m.JournalPage),
      },
      {
        path: 'workout',
        loadComponent: () => import('./pages/workout/workout-page').then((m) => m.WorkoutPage),
      },
      {
        path: 'workout/summary',
        loadComponent: () => import('./pages/workout/summary-page').then((m) => m.SummaryPage),
      },
      {
        path: 'more',
        loadComponent: () => import('./pages/more/more-page').then((m) => m.MorePage),
      },
      {
        path: 'more/philosophy',
        loadComponent: () =>
          import('./pages/more/philosophy-page').then((m) => m.PhilosophyPage),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
