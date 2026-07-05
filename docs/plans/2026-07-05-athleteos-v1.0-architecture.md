# AthleteOS v1.0 — Architecture & Screens

**Date:** 2026-07-05
**Status:** Draft for approval
**Stack:** Angular 22 · Firebase (Auth + Firestore) · PWA · GitHub Pages

---

## 1. Vision

AthleteOS is not a workout tracker. It is an RPG character sheet for a real human body.
The core loop: **train → log → unlock milestones → level up abilities → become more capable**.

Design principle (locked): *Every feature reinforces the identity of becoming a better athlete, not completing workouts.* Progress is measured in unlocked capabilities (milestones), never in checkbox completion.

The system is centered on **Abilities (מיומנויות)**, not exercises. Exercises are the *means*; abilities are the *stats*. Every logged set feeds one or more abilities.

Language: **Hebrew, RTL**, with gaming terms inline where natural (XP, Level, PR).

---

## 2. Gamification Model

### 2.1 Abilities (Skills)

Two kinds, same data shape:

| Kind | Examples (v1 seed) | Metric style |
|---|---|---|
| **Skill** | עמידת ידיים (Handstand), קימה טורקית (TGU) | hold time / load |
| **Activity** | טיפוס (Climbing), רכיבת eMTB, שק אגרוף (Heavy Bag) | session time / rounds / distance |

New abilities can be added by the user at any time (name, icon, kind, metric type, milestones). Year-2 skills (Planche, Front Lever, Muscle-Up, L-Sit) are **not** seeded in v1 — added later via this mechanism.

### 2.2 Milestones → Levels

Chosen model: **milestone-driven leveling** (objective, measurable — matches the Protocol's "explicit measurable capabilities" ethos).

- Each ability has an **ordered milestone ladder**, e.g. Handstand:
  `10 שנ' על קיר → 30 שנ' על קיר → 5 שנ' חופשי → 15 שנ' חופשי → 30 שנ' חופשי`
- Checking a milestone (with date) = the ability **levels up**.
- Ability progress bar = milestones completed / total defined.
- Milestones are user-editable per ability (add rungs as the ladder extends).

### 2.3 Athlete Level & Stats

- **Athlete Level** = total milestones achieved across all abilities (simple, honest, additive).
- **Stat radar (10 pillars)** on the dashboard: each ability maps to 1–3 pillars (Skill, Strength, Static Strength, Core, Power, Movement, Grip, Conditioning, Mobility, Resilience). Pillar score = milestone completion % of abilities mapped to it. The radar visually fills as the athlete becomes more complete — the Architecture PDF's "complete athlete" decagon, made live.
- **Streak**: consecutive weeks in which all weekly anchors were done (3 strength + 1 climb + 1 eMTB per Protocol). Weeks, not days — matches the system's own success rule.

### 2.4 PRs (שיאים)

Auto-derived from logs per exercise/ability: heaviest weight×reps, longest hold, longest hang, most rounds. PR events flagged in session summary.

---

## 3. Screens (v1.0)

Navigation: bottom tab bar, 5 tabs — **דשבורד · תוכנית · מיומנויות · יומן · עוד**.
Active Workout is a full-screen route on top (no tab bar while training).

### S1. כניסה (Auth)
- Google sign-in via Firebase Auth. Logo + tagline splash.
- Auth guard on everything else. No anonymous mode in v1.

### S2. דשבורד (Dashboard / Character Sheet) — home tab
- Header: athlete name, **Athlete Level**, XP-style bar (progress toward next milestone anywhere in the system).
- **Pillar radar chart** (10 pillars, live scores).
- Weekly anchors widget: 3 strength / 1 climb / 1 ride — done/remaining this week + current streak (weeks).
- "האימון של היום" card → jumps to today's plan / starts workout.
- Recent unlocks: last milestones achieved + recent PRs.

### S3. תוכנית (Weekly Plan)
- The POC's 7-day view: day pills, exercise tables, categories, tiers.
- Read-only in v1 (plan editing is v2).
- Primary CTA on each training day: **התחל אימון** → S5.

### S4. מיומנויות (Skills Hub)
- Card grid: icon, name, level, progress bar, kind badge (skill/activity).
- FAB: **הוסף מיומנות** — form: name, icon, kind, metric type, pillar mapping, initial milestones.

### S4a. דשבורד מיומנות (Skill Detail) — per ability
- Hero: level, progress bar, milestone ladder (checked/next/locked rungs; check = date-stamped level-up).
- **סרטוני הדרכה**: user-added video links — YouTube (embedded player), Instagram/TikTok (thumbnail link-out cards; IG embedding is unreliable, don't fight it). Add/remove videos.
- History: chart of the ability's key metric over time (hold seconds, load, session hours) + PR list.
- Notes field (cues, coaching reminders).

### S5. אימון פעיל (Active Workout) — full screen
- Started from a plan day (or free session).
- Session timer (start/pause/stop — user controls it entirely).
- Exercise list from the day's plan; per exercise, log by its metric type:
  - **Strength**: sets — weight × reps (+ quick "same as last time" repeat).
  - **Timed**: duration (handstand practice, hangs, deep squat).
  - **Rounds**: count + round length (heavy bag).
  - **Session**: total time / distance (climbing, eMTB).
- Rest timer between sets (optional, per-exercise default).
- Exercises can be skipped or added ad-hoc during session.
- Stop → S6.

### S6. סיכום אימון (Session Summary)
- Totals: duration, volume, exercises done.
- PR flags ("שיא חדש!").
- Milestone prompt: if a logged result touches a defined milestone (e.g. 30s handstand logged) → "milestone unlocked?" confirm → level-up moment (the dopamine hit).
- Save → Firestore, land on dashboard.

### S7. יומן (Journal / History)
- Reverse-chronological session list (date, day-type, duration, PR badges).
- Tap → session detail (full log, editable after the fact).

### S8. עוד (More)
- **פילוסופיה** — POC's philosophy page (5 principles, 10 pillars, daily chain).
- **הגדרות** — profile, units (kg), sign out, data export (JSON download from Firestore — belt-and-suspenders even with cloud persistence).

Screen count: 8 top-level + 2 sub-screens. v1 cut line: no achievements engine beyond milestones, no plan editor, no social, no notifications.

---

## 4. Data Model (Firestore)

All user data under `/users/{uid}/…` — single-owner security rules, zero shared data in v1.

```
/users/{uid}
  profile: { displayName, createdAt, units: 'kg' }

  /abilities/{abilityId}
    name, icon, kind: 'skill'|'activity'
    metricType: 'hold'|'load'|'session'|'rounds'
    pillars: string[]            // maps to 1-3 of the 10 pillars
    videos: [{ url, platform: 'youtube'|'instagram'|'tiktok'|'other', title }]
    notes: string
    order: number

    /milestones/{milestoneId}
      title, order, achieved: bool, achievedAt: timestamp|null

  /exercises/{exerciseId}        // exercise library (seeded from POC data)
    name, category, tier, icon
    metricType: 'weightReps'|'time'|'rounds'|'session'
    abilityIds: string[]         // ability-centered: which stats this feeds

  /plan/{dayId}                  // seeded from POC data.js, read-only in v1
    label, title, targetTime, focus
    sections: [{ category, items: [{ exerciseId, sets, reps, rest, note, tier }] }]

  /sessions/{sessionId}
    startedAt, endedAt, dayId|null, notes
    entries: [{
      exerciseId, abilityIds,
      sets: [{ weight?, reps?, seconds?, rounds?, distanceKm? }]
    }]

  /prs/{exerciseId}              // derived cache, recomputed on session save
    best: { weight?, reps?, seconds?, rounds? }, sessionId, date
```

Derived values (athlete level, pillar scores, streak) are **computed client-side from milestones/sessions** — not stored, no sync bugs.

Firestore offline persistence ON → the PWA works mid-workout in a basement gym, syncs later.

---

## 5. Technical Architecture

### Angular 22
- Standalone components, **signals** everywhere, zoneless change detection.
- `@angular/fire` for Auth + Firestore.
- Lazy-loaded feature routes: `auth`, `dashboard`, `plan`, `skills`, `workout`, `journal`, `more`.
- Core services: `AuthService`, `AbilityService`, `PlanService`, `SessionService`, `PrService`, `ActiveWorkoutStore` (signal store — survives route changes; persisted to `localStorage` so an accidental refresh never kills a live session).
- Charts: custom SVG components (radar + line/bar). No chart library — small, RTL-safe, theme-safe.
- Design system: port POC tokens (navy/sky-blue palette, IBM Plex Sans Hebrew, flat touch-first components, dark mode via `prefers-color-scheme`).

### PWA
- `@angular/pwa` service worker: app-shell precache, runtime cache for Firestore/fonts.
- Manifest: name AthleteOS, logo-derived icons (192/512 + maskable), `dir: rtl`, `lang: he`, standalone display, theme color `#0D2B4E`.
- Install prompt hint on dashboard (once).

### GitHub Pages deploy
- Build with `--base-href /<repo>/`.
- SPA fallback: copy `index.html` → `404.html` in deploy step (GH Pages trick, keeps clean URLs — no hash routing).
- Deploy via `angular-cli-ghpages` or GitHub Action on push to `main`.
- Firebase config is public-safe (client keys); security lives in Firestore rules (`request.auth.uid == uid` path guard).

### Seed strategy
- First login with empty Firestore → one-time seed: plan (from POC data), exercise library, 5 abilities (Handstand, TGU, Climbing, eMTB, Heavy Bag) with starter milestone ladders.

---

## 6. Build Order (epics)

1. **Foundation** — workspace, PWA, Firebase wiring, auth, tab shell, design tokens, deploy pipeline to GH Pages (deploy from day one).
2. **Content** — seed data, Plan screen (port POC), Philosophy screen.
3. **Abilities** — Skills Hub, Skill Detail, milestones, videos, add-ability flow.
4. **Training loop** — Active Workout, logging, Session Summary, Journal, PRs.
5. **Character** — Dashboard: athlete level, radar, anchors widget, streak, recent unlocks.
6. **Polish** — offline hardening, export JSON, install prompt, empty states.

Each epic ends deployed and usable.

---

## 7. Open Questions (non-blocking, defaults chosen)

- **Rest timer sound/vibration**: default ON vibration, no sound (gym-friendly). 
- **Week boundary for anchors/streak**: Sunday-start (matches Protocol).
- **Units**: kg only in v1.

---

## 8. Out of Scope for v1.0 (explicit)

Achievements/badges engine beyond milestones · plan editor · exercise ratings (★ dimensions — data model ready via exercise fields, UI later) · social/sharing · coach mode · notifications/reminders · multi-language · Apple/Google fit integrations.
