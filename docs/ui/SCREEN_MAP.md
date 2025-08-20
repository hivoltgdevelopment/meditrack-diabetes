# MediTrack — Screen Map (V2, copy-locked)

Owner: Chris Harris • Implementer: Cody Rider (“Cody”)  
Scope: **Docs-only** UI reference. No app code changes.

## Global Patterns
- **Health skin:** deep blue background, white cards, bold headers, yellow primary CTAs.
- **Day row order:** `S M T W T F S` (today highlighted).
- **Date format:** `Tue, Aug 19, 2025`.
- **Units spacing:** `500 mg`, `15 g`, `10 pills`.
- **Titles:** Title Case. **Jam Detection**, **Refill & Inventory**, etc.
- **Footer encouragement:** short, positive line at the bottom of each screen.

## Primary Navigation (tabs)
Today • Meds • Smart Pill Box • Costs • More

---

## 1) Today’s Overview
**Purpose**: Show what to take now and what’s next, at a glance.  
**Primary components**: SPB day row (S M T W T F S), card with today’s compartments, current date, list of due meds.  
**Primary actions**: **Take Now**, **Snooze**, **Open Compartment**, **Verify with Photo**.  
**Footer**: `Right on time.`

---

## 2) Add Medication — Scan
**Purpose**: Fast add via barcode with suggestions.  
**Primary components**: Large viewfinder, “Align barcode” helper, suggestion chips.  
**Primary actions**: **Capture**, **Cancel**.  
**Footer**: `Nice work.`

---

## 3) Refill Request
**Purpose**: Compose and send a refill request (docs-only demo uses email).  
**Primary components**: Name of Med, Qty, SIG, Pharmacy, Prescriber, Last Fill Date; green “saved” banner.  
**Primary actions**: **Send Refill Request**, **Save Draft**.  
**Footer**: `Nice work.`

---

## 4) Smart Pill Box (Dashboard)
**Purpose**: Manage the connected Smart Pill Box (SPB).  
**Primary components**: Connection state, Battery %, Firmware; week map; hint: `Ask: “What are today’s meds?”`  
**Primary actions**: **OPEN**, **LIGHT**, **Find My Box**.  
**Footer**: `Nice work!`

---

## 5) Assign Compartments
**Purpose**: Map meds/time blocks to SPB compartments.  
**Primary components**: Week map; slot time label (e.g., `Tuesday, 2:00 PM`); draggable med chips.  
**Primary actions**: Drag & drop to assign; conflict validation message.  
**Footer**: `You’ve got this!`

---

## 6) Refill & Inventory
**Purpose**: Track counts, expirations, thresholds, and start refills.  
**Primary components**: Med cards with qty, expiration, threshold bar; `REFILL DUE` badge.  
**Primary actions**: **Request Refill** (or **Update Inventory** — pick one per design).  
**Footer**: `Nice work.`

---

## 7) CGM Dashboard
**Purpose**: Show current BG, trend, and a single clear action.  
**Primary components**: Large value with arrow, banded 24-hour graph.  
**Primary actions**: Contextual action (e.g., **Take 15 g carbs**).  
**Footer**: `Steady wins.`

---

## 8) Reports Hub
**Purpose**: Generate, preview, share, and download reports.  
**Tiles**: **CGM Data**, **Medication Log**, **Blood Pressure**, **Weight** (each with **Share** and **Download**).  
**Footer**: `Keep up the good work!`

---

## 9) Emergency Card
**Purpose**: One-tap access to critical info; printable/Wallet-ready.  
**Fields**:  
- **Chris Harris**  
- **Date of Birth** — `September 28, 1967`  
- **Conditions** — `Diabetes`  
- **Allergies** — `Dairy`  
- **Secondary Contact** — `Smokey Harris (Mobile 623-866-8137)`  
**Actions**: **Add Contact**  
**Footer**: `Nice work.`

---

## 10) Insurance Cost Tracker
**Purpose**: Monthly costs by medication and a clear total.  
**Rows**: Med name + “Insurance” + amount.  
**Total**: `Cost Per Month — $45`  
**Action**: **Add Medication**  
**Footer**: `Nice work.`

---

## Accessibility & States
- Text size: large by default; high-contrast option.  
- Voice: microphone affordance on SPB + hint copy.  
- Empty/disconnected states: “Pair Smart Pill Box”, “Reconnect CGM”, “No meds yet — Add Medication”.

> **Note**: UI strings are copy-locked per `COPY_DECK.md`. Use “Smart Pill Box” in UI; “SPB” is acceptable in docs only.
