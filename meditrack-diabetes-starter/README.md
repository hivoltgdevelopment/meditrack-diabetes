
# MediTrack Diabetes — Vertical Slice Starter

An Expo + Supabase starter focused on one end-to-end flow: sign in → add a prescription → see it on the dashboard → schedule a local reminder.

## Quickstart

1) **Supabase**
   - Create a new project at supabase.com.
   - In the SQL Editor, run the SQL from `supabase/sql/schema.sql`.
   - (Optional) Deploy the stub function:
     ```bash
     supabase functions deploy send-refill-email
     ```

2) **Local env**
   - Copy `.env.example` to `.env` and set your values.
   - Install deps:
     ```bash
     npm install
     ```
   - Start:
     ```bash
     npx expo start
     ```

3) **Test path**
   - Sign up (email/password).
   - Add "Metformin 500 mg" with a `next_refill_date` of tomorrow (YYYY-MM-DD).
   - Tap **Schedule reminder** and confirm a local notification fires.

## Notes
- Data isolation uses Supabase RLS.
- Local notifications are a v1 loop; server emails are stubbed for later.
- Theme is a lightweight "Health Blue" token set.
