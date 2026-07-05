import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../shared/icon/icon';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'aos-more-page',
  imports: [RouterLink, Icon],
  template: `
    <div class="more-view">
      <h1>עוד</h1>

      <a class="menu-item card" routerLink="/more/philosophy">
        <aos-icon name="core" />
        <span>הפילוסופיה של AthleteOS</span>
      </a>

      <button class="menu-item card sign-out" (click)="signOut()">
        <aos-icon name="chevron" />
        <span>התנתקות</span>
      </button>
    </div>
  `,
  styles: `
    .more-view {
      padding: var(--space-3);
      padding-bottom: calc(var(--tabbar-height) + var(--space-4));

      h1 { font-size: 22px; margin: 0 0 var(--space-3); }
    }

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
  `,
})
export class MorePage {
  private readonly auth = inject(AuthService);

  signOut(): void {
    void this.auth.signOut();
  }
}
