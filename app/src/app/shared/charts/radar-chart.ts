import { Component, computed, input } from '@angular/core';

export interface RadarAxis {
  label: string;
  /** 0..1 */
  value: number;
}

/** SVG radar (spider) chart — theme-safe, dependency-free. */
@Component({
  selector: 'aos-radar-chart',
  template: `
    <svg [attr.viewBox]="'0 0 ' + SIZE + ' ' + SIZE" dir="ltr">
      <!-- grid rings -->
      @for (ring of rings; track ring) {
        <polygon class="ring" [attr.points]="ringPoints(ring)" />
      }
      <!-- spokes -->
      @for (p of axisPoints(); track p.label) {
        <line class="spoke" [attr.x1]="C" [attr.y1]="C" [attr.x2]="p.x" [attr.y2]="p.y" />
      }
      <!-- data -->
      <polygon class="data" [attr.points]="dataPoints()" />
      <!-- labels -->
      @for (p of labelPoints(); track p.label) {
        <text
          class="label"
          [attr.x]="p.x"
          [attr.y]="p.y"
          [attr.text-anchor]="p.anchor"
          dominant-baseline="middle"
        >
          {{ p.label }}
        </text>
      }
    </svg>
  `,
  styles: `
    :host { display: block; }
    svg { width: 100%; height: auto; display: block; }
    .ring {
      fill: none;
      stroke: var(--color-border);
      stroke-width: 1;
    }
    .spoke {
      stroke: var(--color-border);
      stroke-width: 1;
    }
    .data {
      fill: color-mix(in srgb, var(--color-accent) 35%, transparent);
      stroke: var(--color-accent);
      stroke-width: 2;
      stroke-linejoin: round;
    }
    .label {
      font-size: 9px;
      fill: var(--color-text-muted);
      font-weight: 600;
    }
  `,
})
export class RadarChart {
  readonly axes = input.required<RadarAxis[]>();

  readonly SIZE = 320;
  readonly C = 160;
  private readonly R = 105;
  readonly rings = [0.25, 0.5, 0.75, 1];

  private point(index: number, radius: number): { x: number; y: number } {
    const n = this.axes().length;
    const angle = (Math.PI * 2 * index) / n - Math.PI / 2;
    return {
      x: this.C + radius * Math.cos(angle),
      y: this.C + radius * Math.sin(angle),
    };
  }

  ringPoints(scale: number): string {
    return this.axes()
      .map((_, i) => {
        const p = this.point(i, this.R * scale);
        return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
      })
      .join(' ');
  }

  readonly axisPoints = computed(() =>
    this.axes().map((a, i) => ({ label: a.label, ...this.point(i, this.R) })),
  );

  readonly dataPoints = computed(() =>
    this.axes()
      .map((a, i) => {
        const p = this.point(i, Math.max(0.04, a.value) * this.R);
        return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
      })
      .join(' '),
  );

  readonly labelPoints = computed(() =>
    this.axes().map((a, i) => {
      const p = this.point(i, this.R + 18);
      const dx = p.x - this.C;
      const anchor = Math.abs(dx) < 20 ? 'middle' : dx > 0 ? 'start' : 'end';
      return { label: a.label, x: p.x, y: p.y, anchor };
    }),
  );
}
