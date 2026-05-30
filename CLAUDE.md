# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # dev server at http://localhost:5000
npm run build    # production build
npm run preview  # preview production build locally
```

No test suite. There is no linter configured beyond standard Vite/React defaults.

## Architecture Overview

This is a React + Vite + Tailwind CSS single-page app for building characters in the **Aporia ORPG/TRPG** system. It has a Supabase backend for auth/database and a Vercel serverless function that bridges to a Google Apps Script webhook for spreadsheet registration.

### Route → Page mapping (`src/App.jsx`)

| Route | Page | Auth required |
|---|---|---|
| `/` | `Hub` | No |
| `/builder` | `Builder` | No (works offline) |
| `/enemy` | `EnemyPage` | Yes |
| `/my` | `MyPage` | Yes |
| `/admin` | `AdminPage` | Yes + `role=admin` |

### Builder (`src/Builder.jsx`)

The main character builder. All state lives in one component and **auto-saves to `localStorage` (`aporia-builder-save-v1`)** on every change. State: `char`, `stats`, `abilities`, `proficiencies`, `skills`.

Layout: left panel (캐릭터 / 기능·숙련 / 스킬 tabs) + right panel (요약 / 액션표 / 신청텍스트 / 저장 tabs).

### Game data (`src/data/`)

Static lookup tables for the game rules — never fetched, always imported:

- `stats.js` — 5 stats (근력/민첩/내구/감각/지능), grades E→S with cost and numeric value
- `abilities.js` — 12 abilities (무기술…화술), levels 0–5 with costs `[0,2,5,10,18,30]`
- `proficiencies.js` — proficiency names and costs
- `levels.js` — level table (Lv1–12), each level has an `exp` threshold and a `budget` in points
- `skillRanks.js` — skill ranks F→EX with point costs; also exports `defaultSkill()` and `makeEffect()`

### Budget system (`src/utils/calcBudget.js`)

`remaining = budget - calcStatCost - calcAbilityCost - calcProficiencyCost - calcSkillsCost`

Budget comes from `getLevelByNumber(level).budget` (65pt at Lv1, up to 230pt at Lv12).

### Skill formula system (`src/utils/calcSkill.js`)

Skill effects use a formula language: stat names, ability/proficiency names, `랭크`, `XdY` dice, `상태_X` / `스택_X` / `대상상태_X` / `대상스택_X` state/stack references, and DB variables (`현재체력`, `최대체력`, `이면침식`, `일상점`). Key exports:

- `validateFormula(f)` — checks for disallowed tokens
- `previewFormula(f, stats, rank, dbOverrides, abilities, proficiencies)` — evaluates using `Function()` after substituting all variables; dice `XdY` become expected values `X*(Y+1)/2`
- `normalizeFormula(f)` — converts `×` → `*`

### Action calculation (`src/utils/calcAction.js`)

Each action has a `base` (stat × coefficient sum) and `mult` (ability/proficiency modifiers). The final dice count = `ceil(base * multiplier / 5)`, expected value = `diceCount * 3.5`.

### Condition syntax (`src/components/ConditionEditor.jsx`)

Skill activation conditions: one condition per line. Supported forms: `상태:이름`, `!상태:이름`, `대상상태:이름`, `스택:이름`, `대상스택:이름`, comparisons like `이면침식 >= 6`, `현재체력 <= 10`. Unrecognized lines are flagged as manual-check items (not blocking).

### Auth (`src/auth/AuthContext.jsx`)

`AuthProvider` exposes `{ user, profile, loading, profileLoading, isAdmin, signIn, signUp, signOut, refreshProfile }`.

- `loading` — true only during initial `getSession()`. Gates nothing after that.
- `profileLoading` — true while the `profiles` row is being fetched after login. **Admin gates must wait for this to be `false`** before reading `isAdmin`.
- `isAdmin` — derived as `profile?.role === 'admin'`.
- All Supabase calls are wrapped with `withTimeout()` (`src/lib/withTimeout.js`) to prevent indefinite hangs.

### Application submission flow

1. User submits → `createApplication()` inserts a row into Supabase `applications` table (types: `character_data`, `enemy_template`, `enemy_skill`; statuses: `pending` → `approved` / `rejected` / `needs_revision`).
2. Admin reviews in `AdminPage`. Non-approval status changes call `updateApplicationStatus()` directly.
3. **Approval** calls the Vercel serverless function `POST /api/approve-application` with the user's JWT.
4. The serverless function (`api/approve-application.js`) verifies admin role via `SUPABASE_SERVICE_ROLE_KEY`, then calls the Apps Script webhook (`APPS_SCRIPT_WEBHOOK_URL` + `APPS_SCRIPT_WEBHOOK_SECRET`).
5. Apps Script writes data to the Google Sheets database and returns `{ ok: true, registeredType, registeredKey }`.
6. Only after Apps Script succeeds does the function update Supabase status to `approved`.

### Environment variables

See `.env.example`. For local dev you only need the two client-side vars:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

The server-side vars (`SUPABASE_SERVICE_ROLE_KEY`, `APPS_SCRIPT_WEBHOOK_URL`, `APPS_SCRIPT_WEBHOOK_SECRET`) are only needed for the approval API route and are set in Vercel. The builder itself works without Supabase configured (auth features are disabled, a console warning is emitted).

### Apps Script (`apps-script/`)

Google Apps Script that acts as the authoritative data-registration layer. It writes approved applications into named sheets (`BOT_DB`, `SKILL_DB`, `ENEMY_TEMPLATES`, `ENEMY_SKILLS`, `COMMON_SKILLS`, `PASSIVE_SKILLS`, etc.). Deployed separately via `clasp` (see `apps-script/.clasp.json`).
