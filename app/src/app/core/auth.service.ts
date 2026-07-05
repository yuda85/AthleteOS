import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { FirebaseService } from './firebase.service';
import { SeedService } from './seed.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly fb = inject(FirebaseService);
  private readonly router = inject(Router);
  private readonly seed = inject(SeedService);

  /** undefined = auth state not yet resolved, null = signed out */
  private readonly userState = signal<User | null | undefined>(undefined);

  readonly user = computed(() => this.userState() ?? null);
  readonly isResolved = computed(() => this.userState() !== undefined);
  readonly isSignedIn = computed(() => !!this.userState());

  /** Resolves once the initial auth state is known (used by the guard). */
  readonly ready: Promise<void>;

  constructor() {
    this.ready = new Promise<void>((resolve) => {
      const unsubscribe = onAuthStateChanged(this.fb.auth, (user) => {
        this.userState.set(user);
        if (user) {
          // Covers restored sessions that predate seeding (no-op when already seeded).
          void this.seed.ensureSeeded(user.uid, user.displayName ?? 'אתלט').catch(() => {});
        }
        resolve();
      });
      void unsubscribe;
    });
  }

  async signInWithGoogle(): Promise<void> {
    const cred = await signInWithPopup(this.fb.auth, new GoogleAuthProvider());
    await this.seed.ensureSeeded(cred.user.uid, cred.user.displayName ?? 'אתלט');
    await this.router.navigateByUrl('/dashboard');
  }

  async signOut(): Promise<void> {
    await signOut(this.fb.auth);
    await this.router.navigateByUrl('/auth');
  }
}
