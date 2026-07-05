// Small self-contained icon set (Lucide-style, 24x24, stroke-based). No external requests.
const ICONS = {
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
};

function iconSvg(key) {
  const body = ICONS[key] || ICONS.dumbbell;
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
}
