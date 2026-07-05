import { Component, computed, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { inject } from '@angular/core';

// Icon path data ported from poc/icons.js — Lucide-style 24x24 stroke icons.
const ICON_PATHS: Record<string, string> = {
  skillHandstand: '<path d="M12 3 2 21h20L12 3z"/><circle cx="12" cy="8" r="1.5"/>',
  skillTgu: '<path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 3v6h-6"/>',
  pull: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="m8 10 4 4 4-4"/>',
  push: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="m8 14 4-4 4 4"/>',
  squat: '<path d="M12 3v14"/><path d="m6 13 6 6 6-6"/>',
  core: '<path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-4z"/>',
  carry: '<path d="m21 8-9-5-9 5 9 5 9-5Z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>',
  power: '<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/>',
  mobility: '<path d="M3 8h11a3 3 0 1 0-3-3"/><path d="M3 16h15a3 3 0 1 1-3 3"/>',
  grip: '<path d="M8 12V5a1.5 1.5 0 0 1 3 0v6"/><path d="M11 11V3.5a1.5 1.5 0 0 1 3 0V11"/><path d="M14 11V5a1.5 1.5 0 0 1 3 0v8"/><path d="M8 12v-1a1.5 1.5 0 0 0-3 0v3c0 3.5 2.5 6.5 7 6.5s7-2 7-6v-3"/>',
  climb: '<path d="M3 20 9 8l4 6 3-4 5 10H3Z"/>',
  bike: '<circle cx="6" cy="17" r="3.2"/><circle cx="18" cy="17" r="3.2"/><path d="M6 17 10 8h4l3 5"/><path d="M9 8h4"/><path d="M9.5 17h5.5l-2-5"/>',
  flow: '<path d="M8.5 8a4 4 0 1 0 0 8 6 6 0 0 0 4-1.5A6 6 0 0 0 16.5 16a4 4 0 1 0 0-8 6 6 0 0 0-4 1.5A6 6 0 0 0 8.5 8Z"/>',
  walk: '<path d="M13 4a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"/><path d="M11 22l1-6-2-2 1-5 3-1 2 3h3"/><path d="M9 22l2-5"/>',
  rest: '<path d="M21 12.5A8.5 8.5 0 1 1 11.5 3a7 7 0 0 0 9.5 9.5Z"/>',
  foamroll: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.5"/>',
  dumbbell: '<path d="M6 7v10"/><path d="M18 7v10"/><path d="M3 10v4"/><path d="M21 10v4"/><path d="M6 12h12"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
  play: '<path d="m6 4 14 8-14 8V4Z"/>',
  pause: '<rect x="5" y="4" width="4" height="16" rx="1"/><rect x="15" y="4" width="4" height="16" rx="1"/>',
  stop: '<rect x="5" y="5" width="14" height="14" rx="2"/>',
  trash: '<path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>',
  edit: '<path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z"/>',
  video: '<path d="m22 8-6 4 6 4V8Z"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
  chevron: '<path d="m15 18-6-6 6-6"/>',
  trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
};

@Component({
  selector: 'aos-icon',
  template: `<svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    [innerHTML]="paths()"
    aria-hidden="true"
  ></svg>`,
  styles: `
    :host { display: inline-flex; }
    svg { width: 100%; height: 100%; }
  `,
})
export class Icon {
  private readonly sanitizer = inject(DomSanitizer);
  readonly name = input.required<string>();

  readonly paths = computed<SafeHtml>(() =>
    this.sanitizer.bypassSecurityTrustHtml(ICON_PATHS[this.name()] ?? ICON_PATHS['dumbbell']),
  );
}
