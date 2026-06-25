## Leaderboard — project instructions

**ТылМус (Tylmus)** is a daily word-grouping puzzle (four categories, sixteen words). The **leaderboard** lets players who finished today’s puzzle submit a **nickname** and compare **score** (fewer points is better) with others for the same **calendar day in Yakutsk time (UTC+9)**—aligned with the backend’s `timezone_yakt` and the store’s `getYakutskDateString()` for local history.

The leaderboard opens from the **trophy** control in `GameHeader.vue` (tooltip: «Таблица лидеров»). On a **win**, if the user has **not** yet submitted today, `GameView.vue` can **auto-open** the leaderboard once (`autoOpenedLeaderboardForThisGame`) before the usual game-over share flow.

---

### User flow

- After all **four** categories are found, the modal can show a **nickname** form (if there is no `user_entry` yet).
- The player may **Отправить** (submit), **Пропустить** (close without submitting), or after already being on the board use **К результату** (`proceed`) to continue to the win / share modal.
- **GET** loads today’s rows; the current user’s row is highlighted when **`entry.nickname === userEntry.nickname`**.
- **Ranking:** lower **`points`** wins; ties favor an **earlier submit** (`submitted_at` on the server—see backend ordering).

---

### Backend (reference for the frontend)

#### Table `leaderboard`

Created on startup via backend `leaderboard.init_leaderboard_table()` (SQLite `wordsdb.db` in the Python app).

| Column | Type | Role |
|--------|------|------|
| id | INTEGER | Primary key |
| game_date | TEXT | Yakutsk calendar date `YYYY-MM-DD` |
| user_hash | TEXT | Stable id from cookie |
| nickname | TEXT | 2–12 chars after filters |
| mistakes | INTEGER | Mistake count at submit |
| duration_seconds | INTEGER | Server-derived elapsed seconds from `started_at` |
| points | INTEGER | `max(0, duration_seconds * (mistakes + 1))` |
| submitted_at | TIMESTAMP | Server time at insert |

Unique on **`(game_date, user_hash)`** — one submission per player per day.

#### Profanity

`profanity.contains_profanity` (word-boundary, case-insensitive) covers **English, Russian, and Yakut** word lists.

#### HTTP API

| Method | Path | Notes |
|--------|------|--------|
| POST | `/api/leaderboard/submit` | Query param **`nickname`**. Validates length, profanity, same Yakutsk day, **four** categories found, and not already submitted. Success **200**; validation / duplicate / wrong state **400** with Russian `error` text in JSON. |
| GET | `/api/leaderboard/today` | JSON **`{ entries, user_entry }`** for Yakutsk “today”. |

---

### Frontend implementation

#### API (`src/api/gameApi.ts`)

- **`getTodayLeaderboard()`** → `GET /api/leaderboard/today`.
- **`submitLeaderboardNickname(nickname)`** → `POST /api/leaderboard/submit` with **`params: { nickname }`**.

#### Store (`src/stores/gameStore.ts`)

- State: **`leaderboardEntries`**, **`userLeaderboardEntry`**, **`loadingLeaderboard`**.
- **`fetchLeaderboard`**: fills entries and `user_entry`, clears both on failure.
- **`refreshLeaderboard`**: awaits **`fetchLeaderboard`** again (e.g. after submit).

#### Modal (`src/components/LeaderboardModal.vue`)

- **Props:** `show`, `gameDate`, `gameComplete`, `userEntry`, `entries`, `currentPoints`, `projectedRank`.
- **Emits:** `close`, `submitted`, **`proceed`** (to game-over / share after already on the board).
- **Nickname rules (client):** trim length 2–12; regex **`^[А-Яа-яЁё0-9 _.-]+$`** (Cyrillic-first; digits and a few punctuation chars allowed). Server still enforces length + profanity; Cyrillic-only is **not** enforced in `routes_leaderboard.py`, so other characters could theoretically be accepted if the UI were bypassed.
- **Preview score:** copy explains seconds × **`(mistakes + 1)`**; **`projectedRank`** counts existing entries with **`points <= currentPoints`** and adds one (approximate rank if submitting now).

#### Game shell (`src/views/GameView.vue`)

- **`gameDate`**: first **whitespace-separated token** of **`gameStore.gameDisplay`**, else ISO `YYYY-MM-DD`—used as the small date line in the modal header (Russian label prefix, not necessarily a raw ISO date).
- **`currentPoints` / `currentDurationSeconds`:** use **`playStartedAt`** (server play session) and **`gameFinishedAt`** (set when `gameOver` becomes true) so the preview matches the server timer philosophy.
- **`openLeaderboard`:** shows modal and **`await gameStore.fetchLeaderboard()`**.
- **`handleLeaderboardSubmitted`:** **`refreshLeaderboard`**, closes modal, re-opens **`GameOverModal`** when `gameOver` is true.
- **`goToWinShareModal`:** handles **`@proceed`** from the modal.

---

### Deployment

- **Backend:** `leaderboard` table is created automatically; no separate migration file required for a fresh DB.
- **Frontend container:** `nginx.conf` already proxies **`/api/`** (including leaderboard routes) to the backend host configured in that file.

---

### Possible enhancements

- Paginate very large daily boards.
- Browse previous Yakutsk days in the UI.
- “Share my rank” deep link.
- Stricter server-side nickname alphabet to match the modal’s Cyrillic rule.
