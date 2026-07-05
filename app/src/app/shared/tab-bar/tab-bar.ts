import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface TabItem {
  path: string;
  label: string;
  icon: string; // inline SVG path data
}

@Component({
  selector: 'aos-tab-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './tab-bar.html',
  styleUrl: './tab-bar.scss',
})
export class TabBar {
  readonly tabs: TabItem[] = [
    { path: '/dashboard', label: 'דשבורד', icon: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z' },
    { path: '/plan', label: 'תוכנית', icon: 'M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z' },
    { path: '/skills', label: 'מיומנויות', icon: 'M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-4z' },
    { path: '/journal', label: 'יומן', icon: 'M4 4h16v2H4V4zm0 5h16v2H4V9zm0 5h10v2H4v-2zm0 5h16v2H4v-2z' },
    { path: '/more', label: 'עוד', icon: 'M6 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z' },
  ];
}
