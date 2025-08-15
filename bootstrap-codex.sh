#!/usr/bin/env bash
set -euo pipefail

REPO="${1:-hivoltgdevelopment/meditrack-diabetes}"
MILESTONE_TITLE="M1: Live wiring + alerts"

command -v gh >/dev/null 2>&1 || { echo "❌ GitHub CLI not found. Install: https://cli.github.com/"; exit 1; }
gh auth status -h github.com >/dev/null || { echo "❌ Not authenticated. Run: gh auth login"; exit 1; }

# --- Labels (idempotent) ---
ensure_label () {
  local name="$1" color="$2" desc="$3"
  if ! gh label view "$name" -R "$REPO" >/dev/null 2>&1; then
    gh label create "$name" --color "$color" -d "$desc" -R "$REPO" >/dev/null || true
  else
    gh label edit "$name"   --color "$color" -d "$desc" -R "$REPO" >/dev/null || true
  fi
  echo "✔ Label: $name"
}
ensure_label feature         FFAB1A "New feature"
ensure_label enhancement     FFAB1A "Incremental improvement"
ensure_label bug             D73A4A "Something isn't working"
ensure_label chore           C5DEF5 "Maintenance / tooling"
ensure_label web             0E8A16 "Web dashboard"
ensure_label mobile          1F6FEB "Expo mobile app"
ensure_label supabase        5319E7 "DB / migrations / RLS"
ensure_label functions       6F42C1 "Edge Functions"
ensure_label notifications   7057FF "Email/Push"
ensure_label priority-high   EE0701 "Prioritized for MVP"
ensure_label good-first-issue 7057FF "Starter task"

# --- Milestone (idempotent) ---
MILESTONE_ID="$(gh api "/repos/$REPO/milestones" --jq ".[] | select(.title==\"$MILESTONE_TITLE\") | .number" || true)"
if [[ -z "${MILESTONE_ID}" ]]; then
  MILESTONE_ID="$(gh api \
    --method POST \
    -H "Accept: application/vnd.github+json" \
    "/repos/$REPO/milestones" \
    -f title="$MILESTONE_TITLE" \
    -f state='open' \
    -f description='Wire UI to Supabase, implement refill email + low-stock push, settings threshold, inventory adjust, green tests.' \
    --jq '.number')"
fi
echo "✔ Milestone: $MILESTONE_TITLE (#$MILESTONE_ID)"

new_issue () {
  local title="$1" labels="$2"
  shift 2
  local body
  body="$(cat -)"
  gh issue create -R "$REPO" -t "$title" -b "$body" --milestone "$MILESTONE_ID" $(printf -- '--label %s ' $labels) >/dev/null
  echo "➕ Issue: $title"
}

# 1
new_issue "feat(web): wire prescriptions list to Supabase" "feature web priority-high" <<'EOF'
**Goal**: Replace mock list with live `prescriptions` data.

**Tasks**
- select id,name,category,dosage,frequency,remaining_quantity from `prescriptions` (limit 100)
- Loading/empty states
- Error toast

**Acceptance**
- Items show from DB; refresh reflects inserts

**DoD**
- PR merged, basic test for query hook
EOF

# 2
new_issue "feat(web): persist Add Prescription form" "feature web priority-high" <<'EOF'
**Goal**: Insert rows to `prescriptions`.

**Tasks**
- Validate name (required), starting qty (>=0)
- Insert {name, category, dosage, frequency, remaining_quantity}
- Success toast + route back to Home

**Acceptance**
- Row appears on Home after insert

**DoD**
- Unit test for simple validator
EOF

# 3
new_issue "feat(web): save low-stock threshold to user_settings" "feature web supabase priority-high" <<'EOF'
**Goal**: Persist `low_stock_days_threshold` per user.

**Tasks**
- Upsert `user_settings` on change
- Load on mount
- Confirm RLS allows only owner access

**Acceptance**
- Threshold sticks across reload

**DoD**
- RLS confirmed for user row
EOF

# 4
new_issue "feat(web): show days remaining via v_prescription_days_remaining" "feature web supabase" <<'EOF'
**Goal**: Use server-side view rather than client calc.

**Tasks**
- Query `v_prescription_days_remaining`
- Badge when days_remaining <= threshold

**Acceptance**
- Values match SQL view; parity with mock

**DoD**
- E2E happy-path clickthrough
EOF

# 5
new_issue "feat(functions): wire send-refill-email + UI button" "feature functions notifications web priority-high" <<'EOF'
**Goal**: Call Edge Function via Resend.

**Tasks**
- Ensure `RESEND_*` envs set
- Invoke from button; success/error toast
- Template tweaks (subject/footer)

**Acceptance**
- Email received at test inbox

**DoD**
- Function logs show success
EOF

# 6
new_issue "feat(functions/mobile): send-low-stock-push + token registration" "feature functions notifications mobile priority-high" <<'EOF'
**Goal**: Register Expo push token and send push.

**Tasks**
- Mobile: call register on first load (store in `user_push_tokens`)
- Function envs: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- UI button calls function with user_id

**Acceptance**
- Device receives push

**DoD**
- Token present in `user_push_tokens`
EOF

# 7
new_issue "feat(web): inventory quantity adjust + history log" "feature web supabase" <<'EOF'
**Goal**: Adjust `remaining_quantity` and log changes.

**Tasks**
- Modal: +/- change with reason
- Update prescription qty
- Insert into `inventory_history` (qty, reason, ts)

**Acceptance**
- Home/Reminders update days remaining accordingly

**DoD**
- Simple unit test for diff math
EOF

# 8
new_issue "chore(web/mobile): loading spinners and error toasts" "chore web mobile" <<'EOF'
Add minimal UX polish for async actions across screens.
EOF

# 9
new_issue "feat(functions): cron low-stock notifier" "feature functions notifications supabase" <<'EOF'
**Goal**: Scheduled job selects users with days_remaining <= threshold and calls push function.

**Tasks**
- Create Supabase Scheduled job
- Test with mocked user

**Acceptance**
- Logs show scheduled runs; device receives push when due
EOF

echo
echo "✅ All set. Issues: https://github.com/$REPO/issues"

