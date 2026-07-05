import { Injectable, computed, effect, inject, signal } from '@angular/core';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  limit,
  setDoc,
  Unsubscribe,
} from 'firebase/firestore';
import { FirebaseService } from './firebase.service';
import { AuthService } from './auth.service';
import { Session, SetEntry } from '../models/models';

export interface PrEvent {
  exerciseId: string;
  kind: 'weight' | 'seconds' | 'rounds' | 'distance';
  value: number;
  previous: number | null;
}

function setScore(set: SetEntry): { weight?: number; seconds?: number; rounds?: number; distance?: number } {
  return {
    weight: set.weight,
    seconds: set.seconds,
    rounds: set.rounds,
    distance: set.distanceKm,
  };
}

/**
 * Sessions live in Firestore; PRs are derived client-side from the loaded
 * session history (single source of truth, no cache-sync bugs).
 */
@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly fb = inject(FirebaseService);
  private readonly auth = inject(AuthService);

  private unsub: Unsubscribe | null = null;

  readonly sessions = signal<Session[]>([]);
  readonly loaded = signal(false);

  /** exerciseId -> best values across all loaded sessions. */
  readonly bests = computed(() => {
    const map = new Map<string, { weight: number; seconds: number; rounds: number; distance: number }>();
    for (const session of this.sessions()) {
      for (const entry of session.entries) {
        const best = map.get(entry.exerciseId) ?? { weight: 0, seconds: 0, rounds: 0, distance: 0 };
        for (const set of entry.sets) {
          const s = setScore(set);
          if (s.weight && s.weight > best.weight) best.weight = s.weight;
          if (s.seconds && s.seconds > best.seconds) best.seconds = s.seconds;
          if (s.rounds && s.rounds > best.rounds) best.rounds = s.rounds;
          if (s.distance && s.distance > best.distance) best.distance = s.distance;
        }
        map.set(entry.exerciseId, best);
      }
    }
    return map;
  });

  constructor() {
    effect(() => {
      const user = this.auth.user();
      this.unsub?.();
      this.unsub = null;
      this.sessions.set([]);
      this.loaded.set(false);
      if (!user) return;

      const q = query(
        collection(this.fb.firestore, `users/${user.uid}/sessions`),
        orderBy('startedAt', 'desc'),
        limit(200),
      );
      this.unsub = onSnapshot(q, (snap) => {
        this.sessions.set(snap.docs.map((d) => ({ ...(d.data() as Session), id: d.id })));
        this.loaded.set(true);
      });
    });
  }

  private uid(): string {
    const user = this.auth.user();
    if (!user) throw new Error('Not signed in');
    return user.uid;
  }

  /**
   * Detect PRs of `session` against history EXCLUDING it, then persist.
   * Returns the PR events for the summary screen.
   */
  async save(session: Omit<Session, 'id'>): Promise<PrEvent[]> {
    const prs = this.detectPrs(session);
    const id = `session-${session.startedAt}`;
    await setDoc(doc(this.fb.firestore, `users/${this.uid()}/sessions/${id}`), {
      ...session,
      id,
    });
    return prs;
  }

  async delete(sessionId: string): Promise<void> {
    await deleteDoc(doc(this.fb.firestore, `users/${this.uid()}/sessions/${sessionId}`));
  }

  private detectPrs(session: Omit<Session, 'id'>): PrEvent[] {
    const bests = this.bests();
    const events: PrEvent[] = [];

    for (const entry of session.entries) {
      const best = bests.get(entry.exerciseId) ?? { weight: 0, seconds: 0, rounds: 0, distance: 0 };
      let maxWeight = 0, maxSeconds = 0, maxRounds = 0, maxDistance = 0;
      for (const set of entry.sets) {
        maxWeight = Math.max(maxWeight, set.weight ?? 0);
        maxSeconds = Math.max(maxSeconds, set.seconds ?? 0);
        maxRounds = Math.max(maxRounds, set.rounds ?? 0);
        maxDistance = Math.max(maxDistance, set.distanceKm ?? 0);
      }
      if (maxWeight > best.weight && maxWeight > 0)
        events.push({ exerciseId: entry.exerciseId, kind: 'weight', value: maxWeight, previous: best.weight || null });
      if (maxSeconds > best.seconds && maxSeconds > 0)
        events.push({ exerciseId: entry.exerciseId, kind: 'seconds', value: maxSeconds, previous: best.seconds || null });
      if (maxRounds > best.rounds && maxRounds > 0)
        events.push({ exerciseId: entry.exerciseId, kind: 'rounds', value: maxRounds, previous: best.rounds || null });
      if (maxDistance > best.distance && maxDistance > 0)
        events.push({ exerciseId: entry.exerciseId, kind: 'distance', value: maxDistance, previous: best.distance || null });
    }
    return events;
  }
}
