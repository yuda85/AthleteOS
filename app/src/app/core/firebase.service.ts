import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  memoryLocalCache,
  Firestore,
} from 'firebase/firestore';
import { firebaseConfig } from '../firebase.config';

function createFirestore(app: FirebaseApp): Firestore {
  try {
    return initializeFirestore(app, {
      localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
    });
  } catch {
    // IndexedDB unavailable (private mode, restricted browsers) — degrade to memory cache.
    return initializeFirestore(app, { localCache: memoryLocalCache() });
  }
}

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  readonly app: FirebaseApp = initializeApp(firebaseConfig);
  readonly auth: Auth = getAuth(this.app);
  readonly firestore: Firestore = createFirestore(this.app);
}
