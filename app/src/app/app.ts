import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { TabBar } from './shared/tab-bar/tab-bar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TabBar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly router = inject(Router);

  /** Hide tab bar on auth screen and (later) active-workout full-screen route. */
  readonly showTabBar = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => !e.urlAfterRedirects.startsWith('/auth') && !e.urlAfterRedirects.startsWith('/workout')),
      startWith(false),
    ),
    { initialValue: false },
  );
}
