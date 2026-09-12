# Property explorer

A small Nuxt app that lists homes for sale from the Funda partner API and shows a detail page with photos and a map.

## How to run

```bash
npm install
cp .env.example .env
```

Add your Funda API key to `.env` as `NUXT_FUNDA_API_KEY`, then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Checks

```bash
npm run lint
npm run typecheck
npm test
npm run format
```

A Husky pre-commit hook runs lint, Prettier check, typecheck, and tests. The same checks plus a build run in GitHub Actions (`.github/workflows/ci.yml`).

## Deploying

Nuxt builds for Vercel out of the box; the only required setting is the `NUXT_FUNDA_API_KEY` environment variable. The key is read at runtime, so the build itself never needs it — the server fails fast on boot if it is missing.

## How it is built

- Two pages: listings (`/`) and listing detail (`/listings/[id]`)
- Server routes in `server/api` call Funda so the API key stays on the server, with an 8s timeout and short-lived `swr` caching so page views do not each hit Funda
- `server/funda` owns the upstream client and mappers, so Funda's Dutch field names never reach the UI; `shared/types` holds the contract between them
- Pages load data with `useFetch`, which runs on the server first (SSR)
- List page uses **Load more** via a `useListingsFeed` composable, and `keepalive` so those cards (and scroll) survive opening a listing
- Detail page: mosaic photo gallery with a fullscreen viewer, facts, and a MapLibre map
- Page metadata with `useSeoMeta` / `useHead`: titles suffixed with `· Property explorer`, plus a per-listing description and `og:image`
- Mobile-first plain CSS: tokens and shared classes in `app/assets/css/main.css`, everything else in scoped component blocks
- Vitest covers formatters, Funda mappers, and the mocked API client
