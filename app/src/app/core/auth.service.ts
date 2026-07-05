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

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly fb = inject(FirebaseService);
  private readonly router = inject(Router);

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
        resolve();
      });
      void unsubscribe;
    });
  }

  async signInWithGoogle(): Promise<void> {
    await signInWithPopup(this.fb.auth, new GoogleAuthProvider());
    await this.router.navigateByUrl('/dashboard');
  }

  async signOut(): Promise<void> {
    await signOut(this.fb.auth);
    await this.router.navigateByUrl('/auth');
  }
}
