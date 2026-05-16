# OLFU Academic Hub — Portfolio case study reference

Single reference for **features** and **routes**. Derived from the codebase (`src/app`, APIs, and UI).

---

## 1. Feature inventory

### Marketing & legal (public)

- **Landing page** — hero, how it works, feature highlights, category list.
- **Terms**, **Privacy**, **Community guidelines** — static policy pages.
- **Login** — Google sign-in entry; **auth error** page for failed or wrong-domain sign-in.

### Authentication & access

- **Google OAuth** via Supabase Auth, with **school email domain** enforcement (`@student.fatima.edu.ph` by default; overridable for dev).
- **Protected areas** — dashboard, search, upload, files, profile, friends, leaderboard, rooms, notifications, admin, setup (enforced in `src/proxy.ts`).
- **Redirect behavior** — unauthenticated users sent to login with `next` return path; signed-in users on `/login` sent to dashboard.

### Onboarding & profile

- **First-time setup** (`/setup`) — full name, program (from database), year level; marks profile ready for uploads.
- **Public profile** (`/profile/[id]`) — program/college, year, XP and level, badges, upload list (others see approved only; owner sees all statuses).
- **Self-only XP log** — recent XP transactions on own profile.
- **Report user** — reporting from profile (report flow).
- **Edit profile** (`/profile/edit`) — update details and **avatar** (storage-backed).

### Study materials (core product)

- **Upload** (`/upload`) — submit study files with metadata (course, category, program, year, semester, etc.); **daily upload limits** and **moderation** (pending until approved).
- **Search** (`/search`) — library of **approved** files; **keyword** search; filters (**program, year, semester, category**); **sort** (relevance, newest, most downloaded, most helpful); **pagination**; **search analytics** (events tracked server-side); realtime refresh helper in UI.
- **File detail** (`/files/[id]`) — metadata, uploader, program context; **access rules** (approved public vs owner vs staff).
- **Preview** — PDF/image preview (API routes under `api/files/.../preview`).
- **Download** — tracked downloads with XP/stats; version-specific downloads.
- **Voting** — helpful / unhelpful with **hourly vote cap**.
- **Bookmarks** (`/bookmarks`) — save approved materials.
- **Edit file metadata** (owner) — dialog for correcting details where allowed.
- **Versioning** — upload new versions; **pending replacement** queue for staff; version history for owner/staff.

### Gamification & recognition

- **XP & levels** — thresholds and titles (e.g. Freshman Scholar → Fatima Scholar); shown on dashboard and profiles.
- **Badges** — earned for uploads, downloads, leaderboard placement, etc.; on dashboard and profile.
- **Leaderboard** (`/leaderboard`) — **all-time** (top ~100), **weekly** snapshot tab, **followings-only** tab.

### Social & requests

- **Followings** (`/friends`) — follow/friend request flow: **request**, **accept**, **decline**, **follow-back**; **pending incoming** badge in nav.
- **Notifications** (`/notifications`) — in-app feed; **mark read / clear read**; **browser push** opt-in (VAPID) with subscribe API.
- **File requests** (`/files/requests`) — students **request** materials; others **fulfill**; **cancel**; staff **approve fulfillment**; XP for helpers.

### Chat rooms

- **Room directory** (`/rooms`) — **program-scoped** visibility (plus global rooms); staff see broader set.
- **Room thread** (`/rooms/[slug]`) — messaging; **pinned messages**; **chat media** uploads; **announcement-style** rooms and **writer** lists (admin manages writers).

### Reporting & trust & safety

- **Report content / users** — report dialog on file and profile flows.
- **Staff moderation queue** (`/admin/queue`) — **pending uploads**, **pending file versions**, suspended uploaders where applicable.
- **Admin reports** (`/admin/reports`) — moderation/content reports.
- **Abuse reports** (`/admin/abuse-reports`) — abuse queue.
- **User sanctions** — **upload ban**, **chat restrictions**, **role** and **program** assignment (admin users and APIs).

### Administration (staff)

- **Admin home** (`/admin`).
- **Moderation nav** — Queue, Chat rooms, Programs, Users, Settings, Abuse reports, Reports; **moderators** see subset (queue, reports, abuse, users).
- **Chat room management** — list/create/edit rooms, soft-delete + restore, assign **writers** for announcement rooms.
- **Programs** — academic programs catalog.
- **Ops-style actions** — refresh computed file scores, leaderboard snapshot (admin APIs).

### UX & polish

- **Responsive layout** — primary nav + **mobile drawer**.
- **Dark / light theme**.
- **Alerts** — notifications link with unread count.
- **Branding** — OLFU / Academic Hub in metadata and nav.

### Technical surface (for an “architecture” blurb)

- **Next.js App Router** pages + **Route Handlers** under `src/app/api/**`.
- **Supabase** — Postgres + RLS, Auth, Storage (materials, avatars, chat media), RPCs where used for search/leaderboard/feeds.
- **Email** — Resend for notification mail.
- **Validation** — Zod on API bodies; typed database types.

---

## 2. Pages (routes)

All routes below come from `src/app/**/page.tsx` (30 pages). **Total: 30 page files.**

### Public

| URL | Description |
|-----|-------------|
| `/` | Landing / marketing |
| `/login` | Sign in |
| `/privacy` | Privacy |
| `/terms` | Terms |
| `/community-guidelines` | Community guidelines |
| `/auth/error` | Auth error (e.g. wrong domain) |

### Setup

| URL | Description |
|-----|-------------|
| `/setup` | First-time profile setup |

### Authenticated (student-facing)

| URL | Description |
|-----|-------------|
| `/dashboard` | Home dashboard |
| `/search` | Library search |
| `/upload` | Upload material |
| `/files/[id]` | File detail (dynamic `id`) |
| `/files/requests` | File request board |
| `/bookmarks` | Saved files |
| `/profile/[id]` | Public profile (dynamic user `id`) |
| `/profile/edit` | Edit own profile |
| `/friends` | Followings / requests |
| `/leaderboard` | Leaderboard (`?tab=weekly` / `?tab=friends` for other tabs) |
| `/rooms` | Chat room list |
| `/rooms/[slug]` | Room chat thread (dynamic `slug`) |
| `/notifications` | Notifications + push toggle |

### Admin / moderation

| URL | Description |
|-----|-------------|
| `/admin` | Admin entry |
| `/admin/queue` | Moderation queue |
| `/admin/rooms` | Manage chat rooms |
| `/admin/rooms/[id]/edit` | Edit a room |
| `/admin/rooms/[id]/writers` | Manage announcement writers |
| `/admin/programs` | Programs catalog |
| `/admin/users` | Users, roles, sanctions |
| `/admin/settings` | Admin settings / env overview |
| `/admin/reports` | Content / moderation reports |
| `/admin/abuse-reports` | Abuse reports |

### OAuth callback (not a visible page)

| Path | Description |
|------|-------------|
| `/auth/callback` | OAuth **route handler** (`route.ts`), not a `page.tsx` |

---

## 3. Tech stack (short)

| Area | Stack |
|------|--------|
| Framework | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS v4 |
| UI | Base UI, shadcn patterns, Lucide |
| Data / auth | Supabase (SSR + client) |
| Client cache | TanStack React Query |
| Validation | Zod |
| PDF | react-pdf |
| Email | Resend |
| Theme | next-themes (via `@teispace/next-themes`) |

---

*Generated for portfolio / case study use. Update this file if routes or features change materially.*
