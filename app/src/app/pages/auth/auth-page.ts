import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'aos-auth-page',
  templateUrl: './auth-page.html',
  styleUrl: './auth-page.scss',
})
export class AuthPage {
  private readonly auth = inject(AuthService);

  readonly busy = signal(false);
  readonly error = signal<string | null>(null);

  async signIn(): Promise<void> {
    this.busy.set(true);
    this.error.set(null);
    try {
      await this.auth.signInWithGoogle();
    } catch {
      this.error.set('ההתחברות נכשלה. נסה שוב.');
    } finally {
      this.busy.set(false);
    }
  }
}
