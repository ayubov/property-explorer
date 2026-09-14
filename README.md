# Property explorer

A Nuxt app that lists homes for sale from the Funda API, with a detail page showing photos and a map.

Live: [funda.ayubov.com](https://funda.ayubov.com)

## Getting started

```bash
npm install
cp .env.example .env
```

Put your Funda key in `.env` as `NUXT_FUNDA_API_KEY`, then run `npm run dev` and open [localhost:3000](http://localhost:3000).

## Checks

```bash
npm run lint
npm run typecheck
npm test
npm run format
```

These run on every commit through Husky, and in CI together with a build.

## How it works

- Two pages: the list (`/`) and a listing (`/listings/[id]`)
- Both are server-rendered with `useFetch`
- Funda is called from `server/api` routes with an 8 second timeout, so the key never reaches the browser
- `server/funda` turns Funda's Dutch fields into the types in `shared/types`
- The list loads more pages on demand and keeps its cards when you come back from a listing
- Titles, descriptions and share images come from `useSeoMeta`
- Plain CSS, mobile first: tokens in `app/assets/css/main.css`, the rest scoped to components
- Vitest covers the pure logic: formatters, mappers, and the API client

## Deployment

Runs on Vercel. The only setting it needs is `NUXT_FUNDA_API_KEY`.

- The key is read at runtime only, so builds and CI never need it, and the server stops on boot if it is missing
- Listing pages are cached for 10 minutes and refreshed in the background
- The list is not cached: its pages come from a live feed, so a cached page could skip listings

## Further improvements

- Search and filters on the list page
- A map view of the results, not just the single listing
- The page number in the URL, so a list page can be shared and survives a refresh
- Dutch translations; the listings are Dutch but the interface is English only
- Smaller images for mobile with `@nuxt/image`
- Tests for components and API routes
- Retry failed Funda requests instead of showing an error right away
- Error tracking and web vitals
- JSON-LD on listing pages

## Time spent

About 6 hours.
