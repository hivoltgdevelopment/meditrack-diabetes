# MANIFEST — MediTrack Diabetes

This document maps the repo structure, file purposes, and external values Codex (or any dev/CI) needs.

---

## Root
- **README.md** — Quickstart instructions for developers.
- **MANIFEST.md** — This file. Repo map + setup notes.
- **package.json** — Dependencies & npm scripts.
- **app.json** — Expo app config (bundle IDs, icons, splash).
- **eas.json** — Expo Application Services build profiles (dev/preview/internal/production).
- **tsconfig.json** — TypeScript config.
- **babel.config.js** — Babel config for Expo/React Native.
- **index.js** — Entry point for Expo.
- **.env.example** — Template for required environment vars.

## Source Code
- **App.tsx** — Main app navigator (Auth ↔ Dashboard ↔ RxForm).
- **src/lib/supabase.ts** — Supabase client, uses env vars.
- **src/lib/notify.ts** — Expo local notification helpers.
- **src/screens/Auth.tsx** — Sign In / Sign Up flow.
- **src/screens/Dashboard.tsx** — Lists prescriptions, schedule reminder, delete.
- **src/screens/RxForm.tsx** — Add/Edit prescription form.
- **src/services/rx.ts** — CRUD service calls to Supabase.
- **src/theme/tokens.ts** — Branding tokens (Health Blue palette, spacing, radii).

## Supabase
- **supabase/sql/schema.sql** — Database schema, RLS policies, triggers.
- **supabase/functions/send-refill-email/** — Edge Function stub for refill emails.
  - `index.ts` — Function code (logs call).
  - `deno.json` — Deno import map.

## Assets
- **assets/icon.png** — App icon.
- **assets/splash.png** — Splash screen background.
- **assets/adaptive-icon.png** — Android adaptive icon.
- (Replace with branded droplet logo assets as finalized.)

## CI/CD
- **.github/workflows/eas-build.yml** — GitHub Actions workflow for EAS builds.
- **CI_CD.md** — Explains secrets, build process, optional submit.
- **eas.json** — Profiles for development, preview, internal, production builds.

---

## Environment & Secrets

### Local Dev
Copy `.env.example` → `.env` with:
- `EXPO_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY`

### GitHub Actions (Secrets → Actions)
- `EXPO_TOKEN` — from `npx eas token:create`.
- `SUPABASE_URL` — project URL.
- `SUPABASE_ANON_KEY` — anon API key.

### Optional Submit
- `APPLE_ID`, `ASC_APP_ID`, `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_P8` for iOS TestFlight.
- `ANDROID_SERVICE_ACCOUNT_JSON` for Google Play.

---

## Acceptance Test
1. Sign up (email/password).
2. Add “Metformin 500 mg” with tomorrow’s refill date.
3. Confirm it shows on Dashboard.
4. Tap “Schedule reminder” → receive local notification.
5. Edit → dosage change persists.
6. Delete → entry disappears.
7. Log out/in → only your data visible.

---

**Note:** No PHI stored; schema is safe for demo/testing. Future: plug in Resend API in edge function for actual refill emails.
