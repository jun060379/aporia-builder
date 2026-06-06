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
- `skillRanks.js` — skill ranks F→EX with numeric values (F=1 … EX=100); also exports `SKILL_TRADITIONS` (`마술`…`특수`), `SKILL_SERIES` (`화력`…`특수`), `defaultSkill()`, and `makeEffect()`

### Budget system (`src/utils/calcBudget.js`)

`remaining = budget - calcStatCost - calcAbilityCost - calcProficiencyCost - calcSkillsCost`

Budget comes from `getLevelByNumber(level).budget` (65pt at Lv1, up to 230pt at Lv12).

### Skill formula system (`src/utils/calcSkill.js`)

Skill effects use a formula language: stat names, ability/proficiency names, `랭크`, `XdY` dice, `상태_X` / `스택_X` / `대상상태_X` / `대상스택_X` state/stack references, and DB variables (`현재체력`, `최대체력`, `현재체력비율`, `이면침식`, `일상점`). Key exports:

- `validateFormula(f)` — checks for disallowed tokens
- `validateFormulaStructure(f)` — checks structural issues (dangling operators, unbalanced parens)
- `previewFormula(f, stats, rank, dbOverrides, abilities, proficiencies)` — evaluates using `Function()` after substituting all variables; dice `XdY` become expected values `X*(Y+1)/2`
- `normalizeFormula(f)` — converts `×` → `*`
- `hasTargetReference(f)` — returns true if the formula uses `대상상태_` / `대상스택_` (requires a target to be specified at invocation)
- `getEffectWarnings(effect)` — validates a single effect object and returns warning strings

### Action calculation (`src/utils/calcAction.js`)

Each action has a `base` (stat × coefficient sum) and `mult` (ability/proficiency modifiers). The final dice count = `ceil(base * multiplier / 5)`, expected value = `diceCount * 3.5`.

### Condition syntax (`src/components/ConditionEditor.jsx`)

Skill/passive activation conditions: one condition per line. Supported forms: `상태:이름`, `!상태:이름`, `대상상태:이름`, `스택:이름`, `대상스택:이름`, comparisons like `이면침식 >= 6`, `현재체력 <= 10`, `현재체력비율 >= 50`. Unrecognized lines are flagged as manual-check items (not blocking).

### Skill and passive authoring (`src/components/SkillMaker.jsx`)

The default export `SkillMaker` is a tabbed component with two modes:

- **스킬 제작** — `SkillForm` sub-component. Builds character skills saved into `Builder` state. Formula block picker (`FormulaBlockModal`) and effect block picker (`EffectBlockModal`) provide structured input assistance.
- **패시브 제작** — `PassiveForm` sub-component. Builds passive rows for the `PASSIVE_SKILLS` Google Sheet and outputs a copyable 15-column TSV. Selecting a category card auto-sets defaults (trigger, effect code). Not saved to `Builder` state.

When `editingSkill` prop is provided, the tab switcher is hidden and the form locks to skill mode.

### Effect DSL

Skill and passive effects use a text DSL interpreted by Apps Script's `processSkillEffects`. Format:

```
상태부여 자신 집중 버프 enhance 수치:3 횟수:1
스택증가 자신 혈인 1 최대:5
```

`EffectBlockModal` builds these strings visually by selecting the effect type (`template`, `custom`, `statusRemove`, `stack`, `free`) and parameters. Confirmed effects are stored in the `effects[]` array on the skill object with `{ id, type, params, generatedText, confirmed }`.

### Admin tools (`src/pages/AdminPage.jsx`)

`AdminPage` has two views toggled internally:

- **review** — application list with approve/reject/revision workflow.
- **make** (tool tabs) — admin-only content authoring tools that bypass the application flow:
  - `PassiveMaker` (`src/components/PassiveMaker.jsx`) — simpler standalone passive TSV builder (older/lighter version of the `PassiveForm` inside `SkillMaker`).
  - `CommonSkillMaker` (`src/components/CommonSkillMaker.jsx`) — builds rows for the `COMMON_SKILLS` sheet. Uses `src/data/commonSkills.js` for type options (`COMMON_SKILL_TYPES`), target specs (`COMMON_TARGET_SPECS`), species options (`COMMON_SPECIES_OPTIONS`), faction list (`COMMON_SKILL_FACTIONS`), unlock levels, and TSV header order.

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

Google Apps Script that acts as the authoritative data-registration layer. It writes approved applications into named sheets (`BOT_DB`, `SKILL_DB`, `ENEMY_TEMPLATES`, `ENEMY_SKILLS`, `COMMON_SKILLS`, `PASSIVE_SKILLS`, etc.). Deployed via `clasp` (see `apps-script/.clasp.json`).

---

## Deployment & CI (IMPORTANT — read before assuming how to ship)

Everything deploys from a **push to `main`**. No local machine required.

- **Web (React)** → **Vercel auto-deploys** on every push to `main`. Nothing else to do.
- **Bot (`apps-script/Code.js`)** → GitHub Action **`.github/workflows/clasp-deploy.yml`** runs `clasp push --force` whenever `apps-script/**` changes on `main` (auth via the `CLASPRC_JSON` repo secret; clasp pinned to **3.x** to match the token format). A local `.git/hooks/post-commit` may ALSO push from a dev machine — harmless overlap, but never rely on it; the Action is the source of truth.
- **`@claude` on GitHub** → **`.github/workflows/claude.yml`** runs Claude Code in Actions when an issue/PR/comment contains `@claude` (auth: `CLAUDE_CODE_OAUTH_TOKEN` secret + the Claude GitHub App installed on the repo). This is the cloud/mobile path.

To verify a change shipped: confirm the relevant workflow run is green in the Actions tab. `clasp push` alone deploys the bot (the webhook is served from the HEAD deployment).

## Working conventions (apply these on every change)

1. **Keep the builder UI in sync with Apps Script.** If you change a bot rule/format in `apps-script/Code.js`, update the matching authoring UI in the **same commit** — skill/passive makers (`SkillMaker.jsx`, `PassiveMaker.jsx`), item maker (`ItemMakerPage.jsx`), enemy makers, `src/lib/enemyText.js`. The web builder must never let users author something the bot rejects, and vice versa.
2. **Active/passive effect parity.** Active skills and passives share the same effect DSL via `processSkillEffects`. Setting/modifier effects (판정/피해/회복 보정) must actually apply on the bot side AND be authorable in the builder (conditions + set-effects). When extending one, extend the other.
3. **Discord bot is a SEPARATE repo** (`git@github.com:jun060379/discord-bot.git`, discord.js). This repo has no bot code. The bot renders interactive UI for `!인벤토리` only; **all other `!commands` are forwarded verbatim** to this Apps Script `doGet` `?q=` endpoint. Inventory/character data is served as JSON (`?api=inventory`, `?api=mychar`). So new text commands work without touching the bot repo, but new interactive (button) UI needs the bot repo too.
4. **Some game numbers live in Sheets, not code.** Action coefficients (e.g. 저항 = 내구×0.75 + 지능×0.75) are in `src/data/actions.js` for the **web**, but the **bot** reads them from the `ACTION_COMPONENTS` sheet. Changing one does not change the other — update both (the sheet edit is manual, by the operator).
5. **Action 보정/장비 → final value.** In `actionCheck` / `rollActionValueForCharacter`, command modifiers (`+N`/`-N`/`*N`) and equipment bonuses are added to the **rolled final value**, not folded into the pre-dice coefficient. (Stat/power/skill checks already worked this way.)
6. **Effect DSL nuances.** `수치:*N` (or `×N`) means a **multiplicative** modifier (판정값 ×N); plain numbers / coefficient expressions are **additive**. Passive `효과` column rows may be `조건 => 효과` (arrow-gated set-effects).

## Subsystems added recently (pointers; details in code/git history)

- **Enemy passives & status** — `PASSIVE_SKILLS` 소유타입 supports `enemy`/`template` (besides global/character/faction/species). Enemies flow through the same damage/heal/trigger pipeline as PCs. Enemy status/stack keys are normalized to a **canonical alias** (`alias → name → enemy_id`) via `enemyCanonicalAlias` / `_canonStatusTarget` so STATUS_DB writes and combat/passive reads agree. Enemy skills (`enemySkillUse`) and PC→enemy effects apply real statuses.
- **Economy** — currency `은화` is a **BOT_DB column** (auto-ensured); quickslots are BOT_DB columns `퀵슬롯1~3`; shop catalog is the **`SHOP_DB`** sheet (joined to `ITEM_DB`). Commands: `!은화` (GM grant/deduct, multi-target), `!교환` (instant transfer of items or 은화), `!퀵슬롯1~3` + dynamic `!<아이템명>` (consume a quickslotted item). Web: **`/shop`** (`src/pages/ShopPage.jsx`) for player purchase + admin shop management; quickslot assignment in `MyCharacterPage.jsx`. APIs: `/api/my-character` actions `buy`/`quickslot`, `/api/shop-register` (admin). Helpers in `Code.js`: `ensureEconomySheets`, `addSilver`, `getShopList`, `_addToInventory`, `useInventoryItemByName`.

## Sheets the operator maintains (not auto-created from code unless noted)

`BOT_DB` (adds `은화`, `퀵슬롯1~3` auto if missing), `ACTION_COMPONENTS` (action coefficients — manual), `STAT_SCALE`, `RANK_SCALE`, `LEVEL_TABLE`, `ITEM_DB`/`INVENTORY_DB`/`EQUIPMENT_DB`/`SHOP_DB` (auto), `STATUS_DB`/`STACK_DB`, `NICKNAME_DB`. Most are auto-created by their `ensure*Sheets()` helpers; coefficient/scale tables are seeded by the operator.
