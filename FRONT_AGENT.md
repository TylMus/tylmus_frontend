## ТылМус (Tylmus) — frontend instructions

Vue 3 + TypeScript SPA built with **Vite**. **Pinia** holds game and leaderboard state. **Vue Router** wires the single main view. **Tailwind CSS 3** (with PostCSS) drives layout and styling via `src/style.css` (`@tailwind` layers, Montserrat). **Axios** calls the FastAPI backend with `withCredentials: true` for cookie-based progress. **Element Plus** appears in `package.json` but is not registered in `src/main.ts`; the UI is Tailwind + local components.

### Project structure

Paths are relative to the repo root **`tylmus_frontend/`** (not `frontend/`).

```
tylmus_frontend/
├── src/
│   ├── api/
│   │   └── gameApi.ts              # Axios client + game / daily / leaderboard methods
│   ├── components/
│   │   ├── AboutSection.vue
│   │   ├── BackgroundOrnaments.vue
│   │   ├── CategoryBlock.vue
│   │   ├── CountdownTimer.vue
│   │   ├── FooterSection.vue
│   │   ├── GameControls.vue
│   │   ├── GameHeader.vue           # Trophy opens leaderboard
│   │   ├── GameHistory.vue
│   │   ├── GameOverModal.vue
│   │   ├── InstructionsSection.vue
│   │   ├── LeaderboardModal.vue    # Daily leaderboard + nickname submit
│   │   ├── NotificationPopup.vue   # In-game messages and share toast
│   │   ├── ShareButton.vue
│   │   └── WordCard.vue
│   ├── router/
│   │   └── index.ts
│   ├── stores/
│   │   ├── gameStore.ts             # Main Pinia store (game + leaderboard + history)
│   │   └── counter.ts               # Scaffold / unused for the game
│   ├── types/
│   │   └── game.ts
│   ├── views/
│   │   └── GameView.vue             # Shell: header, grid, modals, sections
│   ├── __tests__/
│   │   └── App.spec.ts              # Vitest (no `test` script in package.json yet)
│   ├── App.vue
│   ├── main.ts
│   └── style.css
├── public/
├── index.html
├── package.json
├── vite.config.ts                   # `@` -> `src`; dev server port 3000; `/api` proxy optional (commented)
├── Dockerfile                       # node:18-alpine build → nginx:alpine
├── nginx.conf                       # SPA + `/api/` reverse proxy; listen **3000**
└── FRONT_AGENT.md / LEADERBOARD.md
```

### Code style

- **Vue 3 Composition API** with `<script setup lang="ts">`.
- Follow the **Vue style guide** (priority A and B rules).
- **File naming:** `PascalCase` for components, `camelCase` for modules and stores.
- **TypeScript:** strict; shared shapes in `types/game.ts`.
- **Pinia:** `defineStore` with `ref` / `computed` and explicit return of state and actions.
- **Tailwind:** utility-first; global tweaks in `style.css` under `@layer base` where needed.
- **Imports:** Vue core, then third-party, then `@/` aliases, then relative components and types.

### State management

- **`gameStore.ts`:** words, categories, mistakes, game-over flags, daily info, word colors, attempt history, play session timing (`playStartedAt` / `playSessionPromise`), and leaderboard lists plus `fetchLeaderboard` / `refreshLeaderboard`.
- **Persistence:** attempt history (and the current Yakutsk calendar day key) in **localStorage** so reloads keep the day’s log; server state remains authoritative for the puzzle and cookies.

### API communication

- **`gameApi.ts`** creates an Axios instance with a **fixed `baseURL`** pointing at the deployed backend host (see file). `withCredentials: true` sends cookies. For local development you can point `baseURL` at `http://localhost:8000` or enable the commented **`vite.config.ts` `server.proxy`** for `/api`.
- Leaderboard submit uses **`POST /api/leaderboard/submit`** with **`params: { nickname }`** (query string), implemented as `submitLeaderboardNickname`.
- Errors surface through **`NotificationPopup`** and store-driven `showMessage` / `messageText` (not a separate `MessageAlert` component).

### Deployment

- **Dockerfile:** build stage runs `npm ci` and `npm run build`; runtime image is **nginx:alpine** with **`nginx.conf`** copied to `/etc/nginx/nginx.conf`, static files from `dist/` into `/usr/share/nginx/html`, **`EXPOSE 3000`**.
- **`nginx.conf`:** `listen 3000`; `location /api/` proxies to the configured backend HTTPS origin; `try_files` for SPA routing on `/`.

### Related docs

- **`LEADERBOARD.md`** — end-to-end leaderboard behavior (frontend + backend contract).
