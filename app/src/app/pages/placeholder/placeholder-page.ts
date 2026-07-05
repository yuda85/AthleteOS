import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'aos-placeholder-page',
  template: `
    <div class="placeholder">
      <h1>{{ title() }}</h1>
      <p>בבנייה — יגיע באפיק הבא.</p>
    </div>
  `,
  styles: `
    .placeholder {
      padding: var(--space-4);
      padding-bottom: calc(var(--tabbar-height) + var(--space-4));
      text-align: center;
      color: var(--color-text-muted);

      h1 { color: var(--color-text); font-size: 22px; }
    }
  `,
})
export class PlaceholderPage {
  private readonly route = inject(ActivatedRoute);
  readonly title = toSignal(this.route.data.pipe(map((d) => d['title'] as string)), {
    initialValue: '',
  });
}
