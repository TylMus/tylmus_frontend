## Leaderboard Feature — Project Instructions

The leaderboard adds competitive tracking to Tylmus: players who complete the daily game can submit a nickname and see how they rank against others who played the same day. Submissions are one per player per day, and nicknames are filtered for profanity (English, Russian, Yakut). The leaderboard is accessible via a trophy icon in the header.

---

### How It Works

- After a player wins the game (finds all 4 categories), the leaderboard modal offers an input field for a nickname.
- Upon submission, the backend validates the nickname (length 2–12 chars, no profanity), checks that the player has not already submitted for the day, and records the entry in the SQLite database.
- The leaderboard modal displays all entries for the current day, sorted by fewest mistakes first, then by submission time (earlier is better). The player's own entry is highlighted.
- If the player has already submitted, the input form is hidden and their entry is shown in the list.

---

### Backend Components

#### Database Table (`leaderboard`)

Created automatically on startup by `leaderboard.init_leaderboard_table()`.

| Column       | Type      | Description                                      |
|--------------|-----------|--------------------------------------------------|
| id           | INTEGER   | Primary key, auto‑increment                      |
| game_date    | TEXT      | Date of the game (ISO format, e.g. `2026-03-06`)|
| user_hash    | TEXT      | Unique identifier from cookie                    |
| nickname     | TEXT      | User‑chosen nickname (2–12 chars, filtered)      |
| mistakes     | INTEGER   | Number of mistakes the player had in the game    |
| submitted_at | TIMESTAMP | Defaults to current timestamp                    |

Unique constraint on `(game_date, user_hash)` ensures one entry per player per day.

#### Profanity Filter (`profanity.py`)

- Contains sets of banned words in English, Russian, and Yakut.
- `contains_profanity(nickname: str) -> bool` returns `True` if any banned word appears as a whole word (regex word boundaries) in the nickname (case‑insensitive).
- Lists are minimal but can be extended as needed.

#### New Endpoints

| Method | Endpoint                       | Description                                                                 |
|--------|--------------------------------|-----------------------------------------------------------------------------|
| POST   | `/api/leaderboard/submit`      | Accepts `nickname` query param, validates, and inserts entry. Returns 200 on success, 400 on validation error, 409 if already submitted. |
| GET    | `/api/leaderboard/today`       | Returns `{ entries: [...], user_entry: {...} }` for the current day.        |

#### Integration with Existing Code

- In `main.py`, the startup event calls `leaderboard.init_leaderboard_table()`.
- Both endpoints use `user_hash` from the cookie (same as game progress).
- Mistakes count is taken from the user's progress cookie (the cookie already contains `mistakes`). The backend ensures the game is completed before accepting a submission.

---

### Frontend Components

#### Store (`gameStore.ts`)

New reactive state:
- `leaderboardEntries: ref<any[]>([])`
- `userLeaderboardEntry: ref<any | null>(null)`
- `loadingLeaderboard: ref(false)`

New actions:
- `async fetchLeaderboard()` – calls `GET /api/leaderboard/today`, populates entries and user_entry, falls back to empty array on error.
- `async refreshLeaderboard()` – alias for `fetchLeaderboard()` (used after submission).

#### Modal (`LeaderboardModal.vue`)

- Triggered by clicking the 🏆 icon in `GameHeader.vue`.
- Props: `show`, `gameDate`, `gameComplete`, `userEntry`, `entries`.
- Emits: `close`, `submitted`.
- Contains:
  - Submission form (visible only if `gameComplete && !userEntry`):
    - Input field (2–12 chars).
    - Submit button – sends `POST /api/leaderboard/submit?nickname=...`.
    - Error display.
  - Leaderboard list: shows rank, nickname, mistakes. Highlights the current user's row.
  - Footer note if user already submitted.
- Responsive design: input and button stack vertically on mobile, use smaller text.

#### Header (`GameHeader.vue`)

- Added a trophy button that emits `open-leaderboard` to `GameView.vue`.

#### Game View (`GameView.vue`)

- Imports `LeaderboardModal` and manages its visibility with `showLeaderboard` ref.
- Defines `openLeaderboard()` that sets `showLeaderboard = true` and calls `gameStore.fetchLeaderboard()`.
- Computed `gameDate` (extracted from `gameStore.gameDisplay` or current date).
- Passes `gameComplete` (`gameStore.foundCategories.length === 4`), `userLeaderboardEntry`, and `leaderboardEntries` to the modal.
- Handles `@submitted` by calling `gameStore.refreshLeaderboard()`.

---

### Deployment Notes

- **Backend**: The SQLite database file (`wordsdb.db`) will have the `leaderboard` table created automatically on first startup. No migration needed.
- **Frontend**: Ensure the nginx configuration proxies `/api/leaderboard` to the backend (already part of the general `/api/` proxy).
- **Environment**: No new environment variables required.

---

### Future Enhancements

- Add pagination if leaderboard grows large.
- Allow viewing previous days' leaderboards.
- Add a "share my rank" button.
- Implement nickname uniqueness across days (currently per‑day unique only via user_hash).