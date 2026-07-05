import { Injectable, inject, signal } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
}

const INSTALL_HINT_DISMISSED_KEY = 'aos-install-hint-dismissed';

@Injectable({ providedIn: 'root' })
export class PwaService {
  private readonly swUpdate = inject(SwUpdate, { optional: true });

  readonly updateAvailable = signal(false);
  readonly canInstall = signal(false);

  private installPrompt: BeforeInstallPromptEvent | null = null;

  constructor() {
    if (this.swUpdate?.isEnabled) {
      this.swUpdate.versionUpdates
        .pipe(filter((e): e is VersionReadyEvent => e.type === 'VERSION_READY'))
        .subscribe(() => this.updateAvailable.set(true));
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.installPrompt = e as BeforeInstallPromptEvent;
      const dismissed = localStorage.getItem(INSTALL_HINT_DISMISSED_KEY);
      if (!dismissed) this.canInstall.set(true);
    });
  }

  async install(): Promise<void> {
    await this.installPrompt?.prompt();
    this.canInstall.set(false);
  }

  dismissInstallHint(): void {
    this.canInstall.set(false);
    try {
      localStorage.setItem(INSTALL_HINT_DISMISSED_KEY, '1');
    } catch {
      // storage unavailable — hint just reappears next session
    }
  }

  reloadForUpdate(): void {
    location.reload();
  }
}
