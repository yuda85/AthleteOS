import { Component, computed, input } from '@angular/core';

export interface ChartPoint {
  x: number; // epoch ms
  y: number;
}

/** Minimal SVG line chart — RTL-safe, theme-safe, no dependencies. */
@Component({
  selector: 'aos-line-chart',
  template: `
    @if (points().length >= 2) {
      <svg [attr.viewBox]="'0 0 ' + W + ' ' + H" preserveAspectRatio="none" dir="ltr">
        <polyline class="line" [attr.points]="polyline()" />
        @for (p of scaled(); track p.x) {
          <circle class="dot" [attr.cx]="p.x" [attr.cy]="p.y" r="3" />
        }
      </svg>
      <div class="labels" dir="ltr">
        <span>{{ minLabel() }}</span>
        <span>{{ maxLabel() }}</span>
      </div>
    } @else {
      <p class="chart-empty">אין מספיק נתונים לגרף עדיין — המשך לתעד אימונים.</p>
    }
  `,
  styles: `
    :host { display: block; }
    svg {
      width: 100%;
      height: 120px;
      display: block;
    }
    .line {
      fill: none;
      stroke: var(--color-accent);
      stroke-width: 2;
      stroke-linejoin: round;
      stroke-linecap: round;
    }
    .dot { fill: var(--color-accent); }
    .labels {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: var(--color-text-muted);
      margin-top: 4px;
    }
    .chart-empty {
      font-size: 12.5px;
      color: var(--color-text-muted);
      text-align: center;
      padding: var(--space-3) 0;
      margin: 0;
    }
  `,
})
export class LineChart {
  readonly points = input.required<ChartPoint[]>();
  readonly unit = input<string>('');

  readonly W = 300;
  readonly H = 110;
  private readonly PAD = 8;

  readonly scaled = computed(() => {
    const pts = [...this.points()].sort((a, b) => a.x - b.x);
    if (pts.length < 2) return [];
    const xs = pts.map((p) => p.x);
    const ys = pts.map((p) => p.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const spanX = maxX - minX || 1;
    const spanY = maxY - minY || 1;
    return pts.map((p) => ({
      x: this.PAD + ((p.x - minX) / spanX) * (this.W - 2 * this.PAD),
      y: this.H - this.PAD - ((p.y - minY) / spanY) * (this.H - 2 * this.PAD),
    }));
  });

  readonly polyline = computed(() =>
    this.scaled()
      .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
      .join(' '),
  );

  readonly minLabel = computed(() => {
    const pts = this.points();
    return pts.length ? new Date(Math.min(...pts.map((p) => p.x))).toLocaleDateString('he-IL') : '';
  });

  readonly maxLabel = computed(() => {
    const pts = this.points();
    return pts.length ? new Date(Math.max(...pts.map((p) => p.x))).toLocaleDateString('he-IL') : '';
  });
}
