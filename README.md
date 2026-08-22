# ✈️ GlobeTrotter — Personalized Travel Planning

> Dream it. Plan it. Share it.
> A complete multi-city travel planning application built for the GlobeTrotter hackathon.

![stack](https://img.shields.io/badge/Next.js-15-black) ![prisma](https://img.shields.io/badge/Prisma-6-2D3748) ![db](https://img.shields.io/badge/SQLite-dev-003B57)

## What it does

GlobeTrotter is an end-to-end travel planning platform: users **create multi-city trips**, build
day-by-day **itineraries** with stops and activities, get **automatic cost estimates & budget
alerts**, visualize plans on **calendars and timelines**, and **share trips** publicly or copy
community trips into their own account.

## Screens (all 13 from the spec)

| # | Screen | Route |
|---|--------|-------|
| 1 | Login / Signup / Forgot password | `/login` · `/signup` · `/forgot` |
| 2 | Dashboard — welcome, trips, trending cities, budget highlights | `/dashboard` |
| 3 | Create Trip (name, dates, description, cover, budget) | `/trips/new` |
| 4 | My Trips — cards with view/edit/delete | `/trips` |
| 5 | Itinerary Builder — add stops, dates, reorder cities, assign activities | `/trips/[id]/builder` |
| 6 | Itinerary View — day-wise or grouped-by-city, activity time & cost | `/trips/[id]/itinerary` |
| 7 | City Search — search, country/region filters, save, add to trip | `/cities` |
| 8 | Activity Search — type/cost/duration filters, quick view, add to trip | `/activities` |
| 9 | Trip Budget & Cost Breakdown — donut + bar charts, over-budget alerts | `/trips/[id]/budget` |
| 10 | Trip Calendar / Timeline — month grid, drag activities between days, quick time edit | `/trips/[id]/calendar` |
| 11 | Shared / Public Itinerary — public URL, read-only, Copy Trip, social share | `/share/[token]` |
| 12 | Profile / Settings — edit profile, language, saved destinations, delete account | `/profile` |
| 13 | Admin / Analytics — users, trips, top cities & activities, user management | `/admin` |

## Tech stack

- **Next.js 15** (App Router, TypeScript, server components + client islands)
- **Prisma 6 + SQLite** — relational models: `User`, `City`, `Activity`, `Trip`, `Stop`, `StopActivity`
- **Auth**: JWT (HS256, `jose`) in an httpOnly cookie, bcryptjs password hashing
- **Cost engine** (`src/lib/estimates.ts`): per-person daily rates (stay/meals/local transport)
  scaled by each city's cost index (1–5), plus inter-city travel estimated from haversine distance
  (train < 500 km, flight beyond), plus activity costs → per-day totals, donut/bar charts,
  over-budget day detection vs. `budget ÷ days`
- **Charts**: hand-rolled SVG (donut + per-day bars), drawn-in on mount — zero chart dependencies
- **Drag & drop**: native HTML5 DnD for moving activities between calendar days

## Design & motion

- **Real photography** for all 31 cities (`public/images/cities/`), with automatic
  color/emoji-tile fallback when a photo is missing or fails to load
- **Typography**: Inter (body) + Plus Jakarta Sans (display), self-served via Google Fonts
- **Motion system** (`src/app/globals.css` + `src/components/Anim.tsx`):
  - route-change page transitions (`PageTransition`)
  - scroll-triggered reveals with stagger (`Reveal`)
  - counting-up stat numbers (`CountUp`)
  - Ken Burns photo breathing on heroes, hover zoom on photo tiles
  - lift/press micro-interactions on cards, buttons, chips, calendar cells, activity rows
  - animated donut (draws in) and per-day bars (grow with stagger), pulsing drag targets
  - `prefers-reduced-motion` respected throughout

## Run it

```bash
npm install            # also runs prisma generate (postinstall)
npx prisma db push     # create the SQLite schema
node prisma/seed.js    # 31 cities, 135 activities, demo + admin users, sample public trip
npm run dev            # http://localhost:3000
```

### Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Traveler (with a public 10-day India trip) | `demo@globetrotter.app` | `demo123` |
| Admin (analytics dashboard) | `admin@globetrotter.app` | `admin123` |

Public demo trip: **`/share/india-explorer`**

## API overview

| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/auth/signup` · `/login` · `/forgot` · `/logout` | Auth |
| GET | `/api/trips/mine` | User's trips (id+name) |
| POST | `/api/trips` | Create trip |
| PATCH/DELETE | `/api/trips/[id]` | Update / delete trip |
| POST | `/api/trips/[id]/share` | Toggle public, mint/rotate share token |
| POST | `/api/trips/[id]/copy` | Deep-copy a trip (used by "Copy Trip") |
| POST | `/api/stops` | Add a stop (city + dates) |
| PATCH/DELETE | `/api/stops/[id]` | Edit dates/notes, reorder (`sequence`), delete |
| POST | `/api/stops/for-activity` | Attach activity to a trip (auto-creates the stop if missing) |
| POST | `/api/stop-activities` | Assign activity to a stop-day |
| PATCH/DELETE | `/api/stop-activities/[id]` | Move day / change time / remove |
| POST | `/api/cities/[id]/save` | Toggle saved destination |
| PATCH/DELETE | `/api/profile` | Update profile / delete account |
| DELETE | `/api/admin/users` | Admin removes a user |

## Data model (relational)

```
User 1─N Trip 1─N Stop 1─N StopActivity N─1 Activity
                          │                  │
                          └──── N─1 City ◄───
User N─N City (saved destinations)
```

`StopActivity` snapshots the per-person `cost` at assignment time; day placement is
`dayOffset` relative to the stop's arrival plus an optional `startTime`.

## Project layout

```
prisma/           schema.prisma + seed.js (31 cities, 135 activities, demo data)
src/lib/          db · auth (JWT cookies) · dates · estimates (cost engine) · data (queries)
src/components/   client islands: builder, calendar, itinerary, city/activity search, charts…
src/app/          app-router pages + /api route handlers
```

## Notes & demo-mode shortcuts

- Cost figures are **estimates per person** (clearly labelled in the UI), not live prices.
- "Forgot password" is a demo stub (no email service) — it reports success without revealing
  whether the account exists.
- Cover images use a URL field; emoji + gradient are the built-in fallback so the demo looks
  good with zero external assets.
- Language preference is stored and shown, full i18n is out of scope.
