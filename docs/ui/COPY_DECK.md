# MediTrack — Copy Deck (V2, copy-locked)

Owner: Chris Harris • Implementer: Cody Rider (“Cody”)  
Scope: Final strings for mockups and documentation. Keep spelling/case exactly.

## Global Conventions
- **Day row**: `S M T W T F S`
- **Date format**: `Tue, Aug 19, 2025`
- **Units**: `500 mg`, `15 g`, `10 pills` (space before unit)
- **Titles**: Title Case (e.g., `Refill & Inventory`, `Jam Detection`)
- **Component labels**: Sentence case within cards unless it’s a title or button

## Encouragement Footers (rotate)
- `Right on time.`
- `Nice work.`
- `Nice work!`  *(exclamation allowed on SPB only)*
- `You’ve got this!`
- `Steady wins.`
- `Keep up the good work!`

---

## 1) Today’s Overview
**Title**: `Today’s Overview`  
**Helper (date under box)**: `Tue, Aug 19, 2025`  
**Med rows**:  
- `Metformin — Take 500 mg`  
- `Atorvastatin — Take 20 mg`  
**Buttons**: `Take Now` • `Snooze` • `Open Compartment` • `Verify with Photo`  
**Footer**: `Right on time.`

## 2) Add Medication — Scan
**Title**: `Add Medication`  
**Subtitle**: `Align barcode`  
**Suggestion chips**: `Amlodipine 5 mg` • `Metformin 500 mg`  
**Buttons**: `Capture` • `Cancel`  
**Footer**: `Nice work.`

## 3) Refill Request
**Title**: `Refill Request`  
**Banner (saved)**: `Refill request saved`  
**Fields**:  
- `Name of Med` → `Amlodipine`  
- `Qty` → `30 tablets`  
- `SIG` → `Take 1 tablet daily`  
- `Pharmacy` → `CVS Scottsdale`  
- `Prescriber` → `Dr. Lee`  
- `Last Fill Date` → `04/20/2024`  
**Buttons**: `Send Refill Request` • `Save Draft`  
**Footer**: `Nice work.`

## 4) Smart Pill Box (Dashboard)
**Title**: `Smart Pill Box`  
**Status**: `Connected`  
**Meta**: `Battery 100%` • `Firmware: 1.0.2`  
**Buttons**: `OPEN` • `LIGHT` • `Find My Box`  
**Hint**: `Ask: “What are today’s meds?”`  
**Section label**: `Jam Detection`  
**Footer**: `Nice work!`

## 5) Assign Compartments
**Title**: `Assign Compartments`  
**Instruction**: `Drag and drop meds into compartments`  
**Slot label example**: `Tuesday, 2:00 PM`  
**Med chips**:  
- `Amlodipine — 5 mg daily`  
- `Ventolin — 2 puffs as needed`  
**Conflict message**: `This slot already has meds scheduled.`  
**Footer**: `You’ve got this!`

## 6) Refill & Inventory
**Title**: `Refill & Inventory`  
**Med card examples**:  
- `Amlodipine` — `24 pills` — `Exp Aug 2024` — badge `REFILL DUE`  
- `Metformin` — `45 pills` — `Threshold 10 pills`  
**CTA**: `Request Refill`  *(or `Update Inventory` — choose one consistently)*  
**Footer**: `Nice work.`

## 7) CGM Dashboard
**Title**: `CGM Dashboard`  
**Reading**: `104 mg/dL` *(with trend arrow)*  
**Button (example)**: `Take 15 g carbs`  
**Footer**: `Steady wins.`

## 8) Reports Hub
**Title**: `Reports Hub`  
**Tiles**:  
- `CGM Data` — actions: `Share` • `Download`  
- `Medication Log` — actions: `Share` • `Download`  
- `Blood Pressure` — actions: `Share` • `Download`  
- `Weight` — actions: `Share` • `Download`  
**Footer**: `Keep up the good work!`

## 9) Emergency Card
**Title**: `Emergency Card`  
**Fields**:  
- `Chris Harris`  
- `Date of Birth` — `September 28, 1967`  
- `Conditions` — `Diabetes`  
- `Allergies` — `Dairy`  
- `Secondary Contact` — `Smokey Harris (Mobile 623-866-8137)`  
**Button**: `Add Contact`  
**Footer**: `Nice work.`

## 10) Insurance Cost Tracker
**Title**: `Insurance Cost Tracker`  
**Rows**:  
- `Amlodipine` — sublabel `Insurance` — amount `$10/mo`  
- `Metformin` — sublabel `Insurance` — amount `$20/mo`  
- `Ventolin` — sublabel `Insurance` — amount `$15/mo`  
**Total row**: `Cost Per Month` — `$45`  
**Button**: `Add Medication`  
**Footer**: `Nice work.`
