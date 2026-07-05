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
        data: { title: 'דשבורד' },
        loadComponent: () =>
          import('./pages/placeholder/placeholder-page').then((m) => m.PlaceholderPage),
      },
      {
        path: 'plan',
        loadComponent: () => import('./pages/plan/plan-page').then((m) => m.PlanPage),
      },
      {
        path: 'skills',
        data: { title: 'מיומנויות' },
        loadComponent: () =>
          import('./pages/placeholder/placeholder-page').then((m) => m.PlaceholderPage),
      },
      {
        path: 'journal',
        data: { title: 'יומן' },
        loadComponent: () =>
          import('./pages/placeholder/placeholder-page').then((m) => m.PlaceholderPage),
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
