import { Injectable, inject } from '@angular/core';
import { AbilityService } from './ability.service';
import { SessionService } from './session.service';
import { AuthService } from './auth.service';

/** Belt-and-suspenders backup: dump all user data to a downloadable JSON file. */
@Injectable({ providedIn: 'root' })
export class ExportService {
  private readonly abilities = inject(AbilityService);
  private readonly sessions = inject(SessionService);
  private readonly auth = inject(AuthService);

  exportJson(): void {
    const payload = {
      exportedAt: new Date().toISOString(),
      user: this.auth.user()?.email ?? null,
      abilities: this.abilities.abilities(),
      sessions: this.sessions.sessions(),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `athleteos-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
