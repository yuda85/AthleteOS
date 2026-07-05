import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'aos-progress-bar',
  template: `
    <div class="track" role="progressbar" [attr.aria-valuenow]="percent()" aria-valuemin="0" aria-valuemax="100">
      <div class="fill" [style.width.%]="percent()"></div>
    </div>
  `,
  styles: `
    .track {
      height: 8px;
      border-radius: var(--radius-pill);
      background: var(--color-border);
      overflow: hidden;
    }
    .fill {
      height: 100%;
      border-radius: var(--radius-pill);
      background: var(--color-accent);
      transition: width 300ms ease-out;
    }
  `,
})
export class ProgressBar {
  readonly value = input.required<number>();
  readonly max = input.required<number>();

  readonly percent = computed(() => {
    const max = this.max();
    if (!max) return 0;
    return Math.min(100, Math.round((this.value() / max) * 100));
  });
}
