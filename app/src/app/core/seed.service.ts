import { Injectable, inject } from '@angular/core';
import { doc, getDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { FirebaseService } from './firebase.service';
import { ABILITY_SEEDS } from '../data/abilities.data';

/**
 * One-time first-login seeding. Plan and exercise library are code-defined
 * constants (read-only in v1); only user-owned mutable data goes to Firestore.
 */
@Injectable({ providedIn: 'root' })
export class SeedService {
  private readonly fb = inject(FirebaseService);

  async ensureSeeded(uid: string, displayName: string): Promise<void> {
    const profileRef = doc(this.fb.firestore, `users/${uid}`);
    const profile = await getDoc(profileRef);
    if (profile.exists() && profile.data()?.['seeded']) return;

    const batch = writeBatch(this.fb.firestore);

    batch.set(profileRef, {
      displayName,
      units: 'kg',
      seeded: true,
      createdAt: serverTimestamp(),
    });

    for (const seed of ABILITY_SEEDS) {
      const abilityRef = doc(this.fb.firestore, `users/${uid}/abilities/${seed.ability.id}`);
      batch.set(abilityRef, seed.ability);

      for (const m of seed.milestones) {
        const msRef = doc(
          this.fb.firestore,
          `users/${uid}/abilities/${seed.ability.id}/milestones/${m.id}`,
        );
        batch.set(msRef, { ...m, achieved: false, achievedAt: null });
      }
    }

    await batch.commit();
  }
}
