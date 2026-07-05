import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../shared/icon/icon';
import { AuthService } from '../../core/auth.service';
import { ExportService } from '../../core/export.service';

@Component({
  selector: 'aos-more-page',
  imports: [RouterLink, Icon],
  template: `
    <div class="more-view">
      <h1>עוד</h1>

      @if (auth.user(); as user) {
        <div class="profile card">
          @if (user.photoURL) {
            <img [src]="user.photoURL" alt="" class="avatar" referrerpolicy="no-referrer" />
          }
          <div>
            <div class="profile-name">{{ user.displayName }}</div>
            <div class="profile-email">{{ user.email }}</div>
          </div>
        </div>
      }

      <a class="menu-item card" routerLink="/more/philosophy">
        <aos-icon name="core" />
        <span>הפילוסופיה של AthleteOS</span>
      </a>

      <button class="menu-item card" (click)="export()">
        <aos-icon name="carry" />
        <span>{{ exported() ? 'הקובץ ירד ✓' : 'גיבוי נתונים (JSON)' }}</span>
      </button>

      <button class="menu-item card sign-out" (click)="signOut()">
        <aos-icon name="chevron" />
        <span>התנתקות</span>
      </button>

      <div class="version">AthleteOS v1.0</div>
    </div>
  `,
  styles: `
    .more-view {
      padding: var(--space-3);
      padding-bottom: calc(var(--tabbar-height) + var(--space-4));

      h1 { font-size: 22px; margin: 0 0 var(--space-3); }
    }

    .profile {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      margin-bottom: var(--space-3);
    }

    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
    }

    .profile-name { font-weight: 700; font-size: 15px; }
    .profile-email { font-size: 12.5px; color: var(--color-text-muted); }

    .menu-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      width: 100%;
      min-height: var(--touch-target);
      margin-bottom: var(--space-2);
      color: var(--color-text);
      text-decoration: none;
      font-size: 15px;
      font-weight: 600;
      text-align: start;

      aos-icon { width: 22px; height: 22px; color: var(--color-accent); }
    }

    .sign-out {
      color: var(--color-danger);
      aos-icon { color: var(--color-danger); }
    }

    .version {
      text-align: center;
      font-size: 12px;
      color: var(--color-text-muted);
      margin-top: var(--space-4);
    }
  `,
})
export class MorePage {
  readonly auth = inject(AuthService);
  private readonly exportService = inject(ExportService);
  readonly exported = signal(false);

  export(): void {
    this.exportService.exportJson();
    this.exported.set(true);
    setTimeout(() => this.exported.set(false), 3000);
  }

  signOut(): void {
    void this.auth.signOut();
  }
}
