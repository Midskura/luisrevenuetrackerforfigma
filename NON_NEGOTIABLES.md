# Non-Negotiables

## Founder-Ready Principles (Pinned)
1) Market-fit first — the system must work for real estate businesses that monetize units over time (installment sales, rent-to-own, and contractual rentals), not just one client.
2) Reduce risk, don’t relocate it — faster actions must never make costly mistakes easier.
3) Nothing disappears — every transaction, action, and change must be reconstructible.
4) No silent changes — all meaningful state changes must be intentional, visible, and attributable.
5) Expose reality early — dashboards must surface risk before problems become irreversible.

If any feature violates one of these:
- it doesn’t ship
- or it gets deleted

## Expanded Rationale (Source Notes)

### Non-Negotiable #1 — Built for the Market, Not for a Client
**Refined rule:** The system must fit the default workflows of unit-based real estate businesses that monetize over time (installment sales, rent-to-own, contractual rentals), not the quirks of any single developer.

**Includes:**
- Condominium developers
- Townhouse / apartment operators (sale or rental)
- Construction firms selling units over time

**Reminder:** EL Construction is a reference, not the template.

**What this means:**
- Onboarding and setup are first-class features, not afterthoughts.
- Core concepts (projects, units, buyers, schedules, penalties) must be configurable, optional where appropriate, and sensible by default.
- You are not building a “payment tracker.” You are building a lifecycle system that survives different developers’ rules.

**Design implications:**
- No hard-coded assumptions about payment frequency, penalty rules, unit types, or reservation logic.
- If a workflow only works because you explained it verbally, it’s broken.

**Violation test:** “Could a different developer with similar business size but different rules onboard without code changes?”

If no, the system is wrong—even if it works for Elliot.

---

### Non-Negotiable #2 — The System Must Reduce Risk, Not Shift It
**Refined rule:** Every feature must make mistakes harder, not just actions faster. Speed is secondary. Safety is primary.

A system that approves payments quickly but allows silent mistakes is worse than Excel.

**What this means:**
- Never optimize for fewer clicks or faster approvals without adding friction, confirmation, and visibility.
- You are not helping admins “do more.” You are helping owners sleep better.

**Design implications:**
- Double approval or clear confirmation for irreversible actions.
- Clear separation between recording, approving, and correcting.
- No destructive action without context.

**Violation test:** “Can a tired admin accidentally cause financial damage without noticing?”

If yes, the feature is invalid.

---

### Non-Negotiable #3 — Nothing Ever Disappears
**Refined rule:** The system must always allow reconstruction of the truth: what happened, when, and by whom.

Not “current state.” Not “latest balance.”

**What this means:**
- No silent edits.
- No overwritten values.
- No “just update the balance.”
- No magic recalculations without trace.
- Everything must be explainable.

**Design implications:**
- Append-only logs for payments, approvals, edits, and status changes.
- Every derived number must be traceable back to raw events.
- History is not optional or hidden.

**Violation test:** “If there is a dispute 6 months from now, can I reconstruct the exact sequence of events?”

If no, the system failed—even if the numbers look right.

---

### Non-Negotiable #4 — No Silent State Changes
**Refined rule:** Any meaningful change must be intentional, visible, and attributable.

If something changes:
- someone caused it
- the system recorded it
- it’s reviewable

This protects you legally, operationally, and psychologically.

**Violation test:** “Did something change without a human explicitly doing something?”

If yes, it’s broken.

---

### Non-Negotiable #5 — Owners See Reality, Not Comfort
**Refined rule:** Dashboards must surface risk early, even if it’s uncomfortable. You are not building a “status” dashboard. You are building a warning system.

**Design implications:**
- Green only when truly healthy.
- Yellow early.
- Red before it’s irreversible.
- No hiding bad news behind averages.

**Violation test:** “Could an owner think things are fine when they’re not?”

If yes, the dashboard is lying.

---

## Decision Rule
If any feature violates a non-negotiable, it doesn’t ship—or it gets deleted.

This is how you regain control without knowing every line of code.
