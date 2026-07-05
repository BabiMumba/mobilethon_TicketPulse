# TicketPulse Zambia

Mobile-first PWA for event discovery and ticketing in Zambia (Lusaka, Ndola, Kitwe, Livingstone).

Stack: Vite + React 18 + TypeScript + Tailwind CSS v3 + `lucide-react` + `react-router-dom`.

## Cursor Cloud specific instructions

Standard commands (see `package.json` scripts):

- `npm run dev` — Vite dev server on port `5173` (`host: true`, reachable on the VM). Use this for development.
- `npm run build` — runs `tsc -b` then `vite build`; use it as the type-check + production build gate.
- `npm run lint` — ESLint (flat config in `eslint.config.js`).

Non-obvious notes:

- **Backend is optional in dev.** The app runs fully without any backend: `src/lib/supabase.ts` creates a Supabase client only when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set (see `.env.example`). When they are absent, auth (`src/auth/`) and all repositories (`src/data/*Repository.ts`) transparently use a localStorage/in-memory **mock** backend. So `npm run dev` needs no secrets.
- **Demo auth:** in mock mode, register creates a local account; phone-OTP login and the checkout mobile-money authorization accept demo code `123456` (any 6 digits). These are stored in `localStorage` (`tp:auth:*`, `tp:tickets:*`, `tp:profile:*`).
- **Data access goes through the repository pattern** (`src/data/`), never directly to Supabase from components — each repo has both a mock and a Supabase implementation selected at import time.
- Restart the dev server after editing `tailwind.config.js` — theme/color changes there are not always picked up by the running Vite process via HMR.
- The `uipro` CLI referenced in some issues is not a real/available npm package; premium components are built by hand under `src/components/ui/`.
- The service worker (`public/sw.js`) is registered in **dev too** via `src/registerServiceWorker.ts`, so PWA/offline behavior can be tested against the Vite dev server. Verify in Chrome DevTools → Application → Service Workers / Cache Storage. Purchased tickets render offline from `localStorage` (independent of the SW cache).
- Service worker updates are subject to the usual lifecycle gotcha: after editing `public/sw.js`, an already-controlling worker may keep serving cached assets until all tabs close or you use DevTools "Update on reload" / "skipWaiting". Bump `VERSION` in `public/sw.js` to invalidate the **shell** cache.
- The ticket/QR cache (`tp-tickets`) is intentionally **unversioned** so purchased tickets survive app/shell updates and remain scannable offline at the gate. Do not delete it in the SW `activate` handler.
- App icons (`public/icons/icon-192.png`, `icon-512.png`) are generated one-off from `public/icons/icon.svg` using `sharp` (not a project dependency). If the SVG changes, regenerate them (e.g. `npx sharp` or a temporary `npm i --no-save sharp`).
