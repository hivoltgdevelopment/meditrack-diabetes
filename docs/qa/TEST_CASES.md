# MediTrack — Test Cases (key flows)

## Auth
- Create account → email verify (mock ok) → login success.
- Failed login (wrong pass) shows inline error.

## Push Tokens
- Token stored with user_id and platform; logout removes token.
- Token refresh updates existing row.

## Refill Email (Edge)
- Valid payload returns 200 + request_id.
- Invalid SIG → 400 with validation message.
- Network down → retry (3x with backoff) then fail gracefully.

## Health Integrations
- Permission denied state persists after relaunch.
- Reading older than 15 min shows "stale" tag.

## Wallet
- Pass created, stored URL, and can be re-downloaded.

## SPB
- BLE disconnected state → reconnect CTA; jam detection banner renders if flag set.
