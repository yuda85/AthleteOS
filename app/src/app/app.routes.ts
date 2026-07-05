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
        data: { title: 'תוכנית' },
        loadComponent: () =>
          import('./pages/placeholder/placeholder-page').then((m) => m.PlaceholderPage),
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
        data: { title: 'עוד' },
        loadComponent: () =>
          import('./pages/placeholder/placeholder-page').then((m) => m.PlaceholderPage),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
