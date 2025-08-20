# MediTrack — 15-Minute Smoke Test (RC)
Run on the latest RC build. Pass = no crashes, no blocking errors.

1) Auth
- Sign in → sign out → sign in. Expect: no spinner loops; home shows Today’s Overview.

2) Environment
- Hidden status (tap app logo 3x): shows Supabase URL, project ref, env OK.

3) Notifications
- Allow notifications.
- Trigger test push from dev menu. Expect: push arrives; tap opens Today.

4) Smart Pill Box
- Pair → "Connected", battery shows >0%.
- Tap LIGHT (box blinks) and OPEN Today (mock OK).
- Unpair → reconnect. Expect: reconnect within 5s.

5) Meds
- Mark Metformin 500 mg as "Take Now" → success toast → undo → snooze 10m.

6) Refill Email
- Request refill for Amlodipine. Expect: "Sent" status; audit entry visible.
- Airplane mode → request refill → user-friendly error message.

7) Health/CGM
- Deny permission → see "Connect CGM" card.
- Allow permission → reading shows value + trend; action tip visible.

8) Wallet Pass
- Create pass → Add to Wallet; QR fallback works if Wallet not supported.

9) Emergency Card
- Shows Chris Harris, Sep 28, 1967; Conditions: Diabetes; Allergies: Dairy; Secondary: Smokey Harris (Mobile 623-866-8137).

10) Visual & Copy
- Day row order S M T W T F S; footers present; Title Case; unit spacing (500 mg, 15 g).

Record failures with screenshot + step; file under Bug template.
