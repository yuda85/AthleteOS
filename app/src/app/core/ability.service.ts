import { Injectable, inject, signal, effect } from '@angular/core';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Unsubscribe,
} from 'firebase/firestore';
import { FirebaseService } from './firebase.service';
import { AuthService } from './auth.service';
import { Ability, Milestone, VideoRef } from '../models/models';

export interface AbilityWithMilestones extends Ability {
  milestones: Milestone[];
}

@Injectable({ providedIn: 'root' })
export class AbilityService {
  private readonly fb = inject(FirebaseService);
  private readonly auth = inject(AuthService);

  private abilityUnsub: Unsubscribe | null = null;
  private milestoneUnsubs = new Map<string, Unsubscribe>();

  private readonly abilitiesRaw = signal<Ability[]>([]);
  private readonly milestonesByAbility = signal<Record<string, Milestone[]>>({});

  readonly loaded = signal(false);

  readonly abilities = signal<AbilityWithMilestones[]>([]);

  constructor() {
    effect(() => {
      const user = this.auth.user();
      this.teardown();
      if (user) this.listen(user.uid);
    });

    effect(() => {
      const abilities = this.abilitiesRaw();
      const milestones = this.milestonesByAbility();
      this.abilities.set(
        abilities.map((a) => ({
          ...a,
          milestones: [...(milestones[a.id] ?? [])].sort((x, y) => x.order - y.order),
        })),
      );
    });
  }

  private uid(): string {
    const user = this.auth.user();
    if (!user) throw new Error('Not signed in');
    return user.uid;
  }

  private listen(uid: string): void {
    const abilitiesRef = query(
      collection(this.fb.firestore, `users/${uid}/abilities`),
      orderBy('order'),
    );

    this.abilityUnsub = onSnapshot(abilitiesRef, (snap) => {
      const list = snap.docs.map((d) => ({ ...(d.data() as Ability), id: d.id }));
      this.abilitiesRaw.set(list);
      this.loaded.set(true);

      // Attach a milestone listener per ability; detach removed ones.
      const liveIds = new Set(list.map((a) => a.id));
      for (const [id, unsub] of this.milestoneUnsubs) {
        if (!liveIds.has(id)) {
          unsub();
          this.milestoneUnsubs.delete(id);
        }
      }
      for (const ability of list) {
        if (this.milestoneUnsubs.has(ability.id)) continue;
        const msRef = collection(
          this.fb.firestore,
          `users/${uid}/abilities/${ability.id}/milestones`,
        );
        this.milestoneUnsubs.set(
          ability.id,
          onSnapshot(msRef, (msSnap) => {
            const ms = msSnap.docs.map((d) => ({ ...(d.data() as Milestone), id: d.id }));
            this.milestonesByAbility.update((prev) => ({ ...prev, [ability.id]: ms }));
          }),
        );
      }
    });
  }

  private teardown(): void {
    this.abilityUnsub?.();
    this.abilityUnsub = null;
    for (const unsub of this.milestoneUnsubs.values()) unsub();
    this.milestoneUnsubs.clear();
    this.abilitiesRaw.set([]);
    this.milestonesByAbility.set({});
    this.loaded.set(false);
  }

  ability(id: string): AbilityWithMilestones | undefined {
    return this.abilities().find((a) => a.id === id);
  }

  async createAbility(ability: Ability, milestones: Omit<Milestone, 'achieved' | 'achievedAt'>[]): Promise<void> {
    const uid = this.uid();
    await setDoc(doc(this.fb.firestore, `users/${uid}/abilities/${ability.id}`), ability);
    for (const m of milestones) {
      await setDoc(
        doc(this.fb.firestore, `users/${uid}/abilities/${ability.id}/milestones/${m.id}`),
        { ...m, achieved: false, achievedAt: null },
      );
    }
  }

  async updateAbility(id: string, patch: Partial<Ability>): Promise<void> {
    await updateDoc(doc(this.fb.firestore, `users/${this.uid()}/abilities/${id}`), patch);
  }

  async deleteAbility(id: string): Promise<void> {
    const uid = this.uid();
    const ms = this.ability(id)?.milestones ?? [];
    for (const m of ms) {
      await deleteDoc(doc(this.fb.firestore, `users/${uid}/abilities/${id}/milestones/${m.id}`));
    }
    await deleteDoc(doc(this.fb.firestore, `users/${uid}/abilities/${id}`));
  }

  async setMilestoneAchieved(abilityId: string, milestoneId: string, achieved: boolean): Promise<void> {
    await updateDoc(
      doc(this.fb.firestore, `users/${this.uid()}/abilities/${abilityId}/milestones/${milestoneId}`),
      { achieved, achievedAt: achieved ? Date.now() : null },
    );
  }

  async addMilestone(abilityId: string, title: string): Promise<void> {
    const existing = this.ability(abilityId)?.milestones ?? [];
    const id = `ms-${Date.now()}`;
    await setDoc(
      doc(this.fb.firestore, `users/${this.uid()}/abilities/${abilityId}/milestones/${id}`),
      { id, title, order: existing.length, achieved: false, achievedAt: null },
    );
  }

  async deleteMilestone(abilityId: string, milestoneId: string): Promise<void> {
    await deleteDoc(
      doc(this.fb.firestore, `users/${this.uid()}/abilities/${abilityId}/milestones/${milestoneId}`),
    );
  }

  async addVideo(abilityId: string, video: VideoRef): Promise<void> {
    const ability = this.ability(abilityId);
    if (!ability) return;
    await this.updateAbility(abilityId, { videos: [...ability.videos, video] });
  }

  async removeVideo(abilityId: string, url: string): Promise<void> {
    const ability = this.ability(abilityId);
    if (!ability) return;
    await this.updateAbility(abilityId, { videos: ability.videos.filter((v) => v.url !== url) });
  }
}
