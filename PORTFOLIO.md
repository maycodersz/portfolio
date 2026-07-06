# Maycoder Portfolio Handoff

This document is a project handoff for future LLM sessions. It is intentionally detailed and source-oriented so another agent can understand the full product, UI, UX, content model, routing, styling system, and implementation constraints without re-reading every file first.

## Project Identity

- Project name in `package.json`: `Maycoder`.
- Public brand shown in the UI: `Maycoder`.
- Owner/persona represented by the site: Aian Mhyco B. Nunez.
- Primary positioning: AI automation specialist, n8n builder, agentic AI systems developer, and full product builder for websites/mobile apps.
- Core offer from the hero: "Let's build your Automation / Website / Mobile App".
- Main conversion paths: view work, hire/get in touch, contact form, direct email/LinkedIn, social/tutorial links, CV download.
- Main content source: `src/content/portfolio.ts`. Most text, links, labels, stats, pricing, project case studies, automation project data, contact settings, and CV content live there.

## Tech Stack

- Framework/runtime: React 19 with Vite 8.
- Language: TypeScript 6.
- Styling: Tailwind CSS 4 via `@tailwindcss/vite`; global CSS tokens in `src/index.css`.
- Routing: React Router 7 using `createBrowserRouter`.
- Animation: `motion` / `motion/react` plus custom CSS keyframes.
- UI primitives: Radix Dialog, Radix Tooltip, Radix Slot, shadcn-style local components.
- Icons: `lucide-react`, `react-icons`, Simple Icons CDN through `src/lib/skillLogos.ts`.
- Class utilities: `clsx` and `tailwind-merge` via `cn()`.
- Package scripts:
  - `npm run dev`: starts Vite dev server.
  - `npm run build`: runs `tsc -b && vite build`.
  - `npm run lint`: runs ESLint.
  - `npm run preview`: previews the production build.

## Repository Shape

- `src/main.tsx`: React entrypoint. Wraps the app in `StrictMode`, `ThemeProvider`, `SiteCursorProvider`, and `RouterProvider`.
- `src/router.tsx`: route table.
- `src/App.tsx`: homepage section composition.
- `src/content/portfolio.ts`: all editable content and strongly typed data models.
- `src/index.css`: Tailwind import, theme tokens, global CSS variables, dark/light palettes, custom utilities, cursor suppression, keyframes, reduced-motion handling.
- `src/components`: primary UI sections and base UI.
- `src/components/ui`: shadcn/Radix-style primitives and custom navbar/link/button.
- `src/components/project`: project detail page showcase and bento case-study layout.
- `src/components/device`: reusable monitor/tablet/phone frames and placeholder screen.
- `src/components/cv`: CV page sections.
- `src/contexts`: theme and custom cursor state.
- `src/hooks`: viewport, scroll, animation, cursor, and count-up hooks.
- `src/utils`: helper functions and icon mapping.
- `src/lib`: Simple Icons lookup.
- `src/assets`: imported app images.
- `public`: public PDF CV, favicon, and icons SVG.

## Routes

- `/`: homepage portfolio experience.
- `/cv`: CV/resume page.
- `/work/:id`: project detail page for items in `portfolio.projects`.

Navigation uses a custom `Link` component in `src/components/ui/link.tsx`.

- External `http(s)` links render native anchors with `target="_blank"` and `rel="noopener noreferrer"`.
- `mailto:` links render native anchors.
- Hash-only links render native anchors.
- Same-origin path-with-hash links like `/#contact` call React Router navigation and are then handled by `RouteHashScroll`.
- Plain internal routes render React Router `Link`.

## App Providers And Shell

`src/main.tsx` provider order:

1. `ThemeProvider`
2. `SiteCursorProvider`
3. `RouterProvider`

`AppShell` wraps every main route. It sets full-height page layout, background/foreground CSS variables, `overflow-x-clip`, and includes:

- `ScrollToTopFab`
- `GlobalPaperPlaneCursor`

The `overflow-x-clip` on `main` is deliberate: it trims horizontal bleed without creating a scroll container that would break sticky children.

## Homepage Order

`src/App.tsx` renders the homepage in this exact order:

1. `RouteHashScroll`
2. `LoadingScreen`
3. `NavBar`
4. `HeroSplineSection` inside `#hero`
5. `SkillsShowcase`
6. `StatsSection`
7. `WorksSection` inside `#works`
8. `AutomationSection`
9. `PricingSection`
10. `ContactSection`

The `#hero`, `#works`, `#pricing`, and `#contact` IDs are important for navigation.

## Navigation UX

Component: `src/components/ui/navbar.tsx`.

- Sticky header at top with a centered frosted-glass rounded panel.
- Brand link: `Maycoder`, default `/#hero`.
- Desktop layout is a three-column grid: brand, centered section links, trailing theme toggle and CTA.
- Mobile uses a slide-in full-screen overlay dialog with animated links, theme toggle, and CTA.
- The menu locks `document.body.style.overflow` while open.
- Header background changes once `window.scrollY > 10`.
- Active state is calculated by comparing the current hash to nav item hash.
- Theme toggle uses `Sun`/`Moon` icons and aria labels.

Navbar content:

- CV -> `/cv`
- Work -> `/#works`
- Pricing -> `/#pricing`
- Hire Me -> `/#contact`

## Theme System

Theme context: `src/contexts/ThemeContext.tsx`.

- Theme values: `light` and `dark`.
- Storage key: `theme` in localStorage.
- Initial theme:
  - stored `light`/`dark` if present;
  - otherwise follows `prefers-color-scheme: light`, with dark as fallback.
- Applies `.dark` on `document.documentElement`.
- Uses `document.startViewTransition` when available; otherwise applies a `theme-transitioning` class for a 400ms CSS fallback.
- Reduced-motion users get instant theme swaps via CSS.

Visual tokens live in `src/index.css`.

- Brand anchor: `--brand: #7C4FE2`.
- Navbar height: `--navbar-height: 7.5rem`.
- Light background: `#f5f5f7`.
- Dark background: `#0d0b14`.
- Primary actions map to brand purple.
- Light theme intentionally uses purple/pink/black/white.
- Dark theme intentionally uses deep purple-charcoal, grays, purple, and white with no pink wash.
- `text-gradient-brand` maps to a vertical theme-specific brand gradient.
- Device frame tokens, glass tokens, stat-card gradients, CTA gradients, and works-info surface are all CSS variables.

## Cursor System

There are two custom cursor layers:

- `GlobalPaperPlaneCursor`: a site-wide paper-plane cursor using the `Send` icon, only on fine pointer devices.
- `CursorFollowButton` / `WithCursorFollow`: a portaled "View Work" pill cursor shown over project and automation card areas.

Important behavior:

- `@media (pointer: fine)` in `index.css` hides the native cursor for every element.
- `GlobalPaperPlaneCursor` returns `null` on coarse/touch pointers.
- `WithCursorFollow` suppresses the paper-plane cursor while its custom pill is active.
- `SiteCursorProvider` owns the `paperPlaneSuppressed` state.

## Loading Screen

Component: `src/components/LoadingScreen.tsx`.

- Preloads critical hero images:
  - `profile-dark.png`
  - `profile-light.png`
  - `alter-ego-dark.png`
  - `alter-ego-light.png`
- Has a maximum wait of 4000ms before allowing the site to continue.
- This exists to avoid a hero-image flash or missing portrait on first render.

## Hero Section

Component: `src/components/HeroSplineSection.tsx`.

Content from `portfolio.hero`:

- Headline prefix: `Let's build your`
- Rotating titles: `Automation`, `Website`, `Mobile App`
- Description: `I automate the Boring Stuff for E-Commerce & Marketing Teams using AI and n8n.I ship full products: web dashboards and mobile apps`
- CTAs:
  - `View Work ->` -> `/#works`, main/accent tone
  - `Get in Touch` -> `/#contact`, secondary tone
- Profile alt: `Photo of Maycoder`
- Alter ego alt: `Maycoder alter ego`

UX:

- Section begins above the navbar with negative top margin and compensating padding.
- Desktop layout: left copy, right portrait stage.
- Mobile/tablet hide the portrait stage (`lg` and up only).
- Hero heading has a fixed-width rotating slot so words do not resize the layout.
- Title rotates every 2600ms while hero is in view.
- Re-entering the hero resets the active rotating title to index 0.
- Mouse/fine-pointer users get a fog glow that follows the cursor across the section.
- Portrait hover reveals an "alter ego" image through a radial spotlight mask while cutting a matching hole in the profile image.
- Hover reveal is disabled on coarse pointers.
- Uses `useRevealOnView`, `useSectionAnimState`, `useScrollDirection`, `useIsMobileViewport`, and `useIsPointerFine`.
- Replays on desktop re-entry; mobile disables replay on re-enter.

## Skills Showcase

Component: `src/components/SkillsShowcase.tsx`.

Content from `portfolio.skillGroups`:

- AI Automation: n8n, OpenAI, OpenRouter, ElevenLabs, MCP, Webhooks, Telegram, Go High Level.
- Web Development: Next.js, React, TypeScript, Tailwind CSS, Vercel, Git, Python.
- Mobile Apps: React Native, Expo, TypeScript, ExpoSQL.
- Backend & Data: Supabase, PostgreSQL, Airtable, Pinecone, Google Cloud Vision.
- Footer note: `Open to integrating any other API or service your project needs.`

UX:

- Groups are chunked into pairs, producing two rows of two columns on medium and larger screens.
- Each group is a horizontal infinite marquee of logo chips.
- Chips use Simple Icons CDN where a slug exists, otherwise a Lucide fallback.
- Tooltips show the exact skill name.
- Clicking/tapping a chip locks the hover/active style and pauses the marquee; clicking outside clears it.
- Hover, focus, active, and selected states pause the marquee.
- Reduced motion disables marquee animation.
- Fade masks on left and right hide loop seams.
- CSS for chip color inversion lives in `index.css` to avoid Tailwind v4 dark/group-hover specificity issues.

## Stats Section

Component: `src/components/StatsSection.tsx`.

Content:

- Eyebrow: `By the numbers`
- Question: `Why do clients choose to work with me?`
- Stats:
  - `12+ Projects Built`
  - `30+ APIs & Tools Integrated`
  - `3 Platforms`

UX:

- Desktop section is full viewport height (`lg:min-h-dvh`).
- Two-column desktop layout: copy on the left, card deck on the right.
- Card deck uses a 4:5 aspect ratio and shared `CARD_DECK_STAGE_STYLE`.
- Only the front card is clickable; clicking rotates to the next stat.
- Pagination dots allow direct stat selection.
- Front card count animates with `useCountUp` only when the section is in view.
- Count duration changes based on whether it is initial scroll reveal or a later card click.
- Entrance animation uses `useScrollRevealGate` so card click interactions do not retrigger scroll reveal animation.

## Works Section

Component: `src/components/WorksSection.tsx`.

Content source: `portfolio.projects`.

Current projects:

1. `academic-hub`
   - Title: `OLFU Academic Hub`
   - Kind: website
   - Type: `EdTech, Web App`
   - Duration: `6 months - Pre-launch`
   - Highlight: `Feature-complete - polishing UX before public launch`
   - Link: private preview at `https://academy-hub-olfu.vercel.app`
2. `admino-mobile`
   - Title: `Admino - Life Admin App`
   - Kind: mobile
   - Type: `Utility App, Mobile App`
   - Duration: `Ongoing`
   - Uses placeholder screens in the UI despite mobile screenshots existing in `src/assets/projects/mobile/admino`.

UX:

- Renders one full-height project card section per project.
- Website projects show a 3-device cluster: monitor center, tablet right, phone left.
- Mobile projects show tablet and phone frames; placeholders render when `screensUsePlaceholder` is true.
- Device stage has perspective and hover tilts.
- Entire device stage is wrapped in `WithCursorFollow` and navigates to `/work/{project.id}`.
- Below each stage is an info bar with title, optional highlight, description, project type, and duration.
- Info bar is keyboard navigable with `role="button"`, `tabIndex=0`, Enter, and Space support.
- Mobile has a visible `View Work ->` button because hover cursor affordance is not available.

## Project Detail Pages

Route: `/work/:id`.

Component: `src/pages/ProjectPage.tsx`.

Behavior:

- Scrolls to top immediately on mount.
- Finds a matching project by `id` in `portfolio.projects`.
- If missing, shows not-found heading/message and a back button.
- If found, renders:
  - `NavBar`
  - fixed bottom-center back button (`Back to work`)
  - `ScrollDeviceShowcase`
  - `ProjectBentoGrid`

Project detail copy labels live in `portfolio.projectDetailPage`.

### Scroll Device Showcase

Component: `src/components/project/ScrollDeviceShowcase.tsx`.

- Builds slides from `project.pageImages` when available.
- If no page images:
  - website uses desktop fallback screen if present.
  - mobile uses phone fallback screen.
- If `screensUsePlaceholder` and project kind is mobile, uses a single placeholder slide.
- On mount, scrolls to the showcase top minus navbar height.
- Non-reduced-motion mode:
  - showcase min-height is `1 + slides.length * 0.5` viewports.
  - a sticky 100dvh stage stays centered while scroll progress selects active slide.
  - website slides render inside a flat monitor frame.
  - mobile slides render inside a flat phone frame.
  - numbered progress buttons jump to slide positions.
  - live region announces active screen.
- Reduced-motion mode:
  - no sticky scroll choreography.
  - shows the primary framed screen and a grid of all screenshots.

Academic Hub page images currently imported in `portfolio.ts`:

- Landing Page
- Dashboard
- Search
- File View
- Version Control

There are additional Academic Hub case-study image files numbered 6 through 17 in assets, but they are not currently imported or shown.

### Project Bento Grid

Component: `src/components/project/ProjectBentoGrid.tsx`.

- Uses a three-column responsive bento grid.
- First tile is a large project overview with project type, duration, optional highlight.
- If project links exist, a links tile appears with variant-specific labels:
  - live -> `Live site`
  - github -> `Source code`
  - appstore -> `Download`
- Tech stack renders category headings and pills with brand logos/fallback icons.
- If `bentoFeatureQuadrant` has six items and tech stack exists, it renders a 2x3 feature grid beside the tech stack.
- Otherwise, legacy `features` render as individual feature tiles.
- Case-study problem and solution render as side-by-side tiles.
- Results render full width, optionally with metrics.
- Uses `motion` tiles unless reduced motion is preferred.

## Academic Hub Project Content

Description:

Academic Hub is a collaborative academic resource platform for Our Lady of Fatima University students. It combines moderated study uploads with XP, leaderboards, profiles, bookmarks, program rooms, and Google Sign-In limited to school email domains. It is described as feature-complete and in final polish before public release.

Tech stack:

- Framework: Next.js, React, TypeScript.
- Styling/UI: Tailwind CSS, shadcn, Lucide.
- Data/auth: Supabase, PostgreSQL, TanStack React Query.
- Quality/delivery: Zod, react-pdf, Resend, next-themes.
- DevOps: Vercel, Git.

Feature grid:

- Upload: study file submissions with rich metadata, daily upload limits, and moderation.
- Search: approved materials, keyword search, filters, sorts, pagination, search analytics, realtime refresh helper.
- Leaderboard: all-time rankings, weekly snapshot, followings-only view.
- Chatroom: program-scoped/global rooms, threaded messaging, pinned posts, media uploads, announcement rooms.
- Moderation: pending uploads/file versions, content/abuse reports, sanctions, roles, program assignment.
- Request: material requests, peer fulfillments, cancellations, staff approval, XP rewards.

Case study:

- Overview: internal-facing platform to consolidate study materials and community tooling.
- Problem: resources scattered across group chats and ad-hoc links; hard discovery, duplicate files, unreliable moderation, no contributor reward loop.
- Solution: moderated uploads, categories/reporting, bookmarks, file requests, moderation queues, XP/leaderboards, rooms, school-domain Google Sign-In.
- Results: all core flows built and tested internally; current focus is onboarding copy, performance, and launch checklist.
- Metrics: `6 Core modules`, `100% Feature-complete`, `Pre-launch Status`.

## Admino Project Content

Description:

Admino is a local-first mobile app for personal life admin: bills, renewals, subscriptions, medical tasks, IDs, and more. Users capture tasks with categories/action types, attach photos/PDFs, set due dates with local reminders, and browse Inbox, Timeline, and Vault views. Data stays fully on-device by default.

Tech stack:

- Mobile: React Native, Expo, TypeScript.
- Local database: Expo SQLite.
- Cloud database: Supabase, PostgreSQL.

Case study:

- Overview: built for busy people juggling renewals and paperwork.
- Problem: calendars blur personal/work items, spreadsheets go stale, many finance trackers over-index on syncing, and existing tools rarely model proof attachments/escalation paths cleanly.
- Solution: inbox, timeline, and vault views anchored on SQLite with on-device files, categories, local reminders, deterministic sorting, and explicit exports.
- Results: pilot feedback said capture was faster than spreadsheets and gave clearer confidence that sensitive PDFs stayed off cloud unless exported.

Feature tiles:

- Local-first storage
- Smart reminders
- Vault view
- Photo and PDF capture
- Timeline view

Current UI state:

- `screensUsePlaceholder: true`
- `screens.tablet` and `screens.phone` are empty strings.
- Existing Admino screenshots are present under `src/assets/projects/mobile/admino` but are not imported into `portfolio.ts`.

## Automation Section

Component: `src/components/AutomationSection.tsx`.

Section copy:

- Eyebrow: `Playground`
- Title: `Automation & AI Projects`
- Description: `n8n workflows, AI agents on Telegram, and integrations across Gmail, Calendar, spreadsheets, databases, and more.`

Filters:

- All
- AI
- Automation
- Cron

UX:

- Two-column desktop layout: copy/filters left, fan card carousel right.
- Carousel filters by category and resets active card through a keyed `CardDeckCarousel`.
- Fan slots: center, left, right, hidden.
- Center card opens `AutomationModal`.
- Left/right side cards are clickable to navigate carousel.
- Mobile has visible previous/next arrow buttons and a visible `View Work ->` button.
- Pagination dots are 44x44-ish touch targets.
- Card stage shares `CARD_DECK_STAGE_STYLE`.
- Empty filter state displays `No projects in this category.`
- Automation image area uses `object-cover object-top`.

## Automation Projects

Data source: `portfolio.automationProjects`.

1. Jarvis AI Agent
   - Categories: AI, Automation.
   - Tags: n8n, Telegram, Gmail, Google Calendar, Tavily.
   - Databases/storage: PostgreSQL, Google Sheets.
   - Description: Telegram personal AI assistant that gets contact details from Google Sheets, delegates to specialized sub-agents, searches the web, handles Gmail and Google Calendar through n8n, and persists memory in PostgreSQL.
2. Receipt Processor Bot
   - Categories: AI, Automation.
   - Tags: n8n, Telegram, OpenAI.
   - Databases/storage: Google Sheets, Google Drive.
   - Description: AI receipt/expense system via Telegram; extracts merchant, items, quantities, totals, stores structured records, archives receipt images, and generates daily/weekly/monthly spending reports.
   - Gallery images: daily, weekly, monthly report screenshots.
3. Sales Tracker Bot
   - Categories: AI, Automation.
   - Tags: n8n, Telegram, OpenAI, Google Sheets.
   - Databases/storage: PostgreSQL, Google Sheets.
   - Description: Telegram bot for sales/expense logging, handwritten record scanning with AI image recognition, reports, void/undo, and CSV export.
4. Email Agent
   - Categories: AI, Automation.
   - Tags: n8n, Gmail, OpenAI.
   - Databases/storage: PostgreSQL, Google Sheets.
   - Description: n8n AI automation for reading, summarizing, drafting, and organizing Gmail on command; webhook-triggered and memory-backed.
5. Calendar Agent
   - Categories: Automation.
   - Tags: n8n, Google Calendar.
   - Databases/storage: PostgreSQL, Google Sheets.
   - Description: specialized Google Calendar sub-agent for natural-language create/update/query/delete tasks.
6. Email Watcher
   - Categories: AI, Automation, Cron.
   - Tags: n8n, Gmail, Telegram, OpenRouter.
   - Databases/storage: Google Sheets.
   - Description: watches Gmail every minute, labels/classifies mail, logs to Sheets, sends Telegram alerts for high priority, sends 7 AM digest, and does scheduled spam cleanup.
   - Gallery images: digest and spam cleanup screenshots.
7. Contact Lead Qualifier
   - Categories: AI, Automation.
   - Tags: n8n, OpenRouter, Gmail, Telegram, Supabase, Apify.
   - Databases/storage: Google Sheets, Supabase.
   - Description: hooks into this portfolio contact form, classifies inquiries as hot/warm/cold, enriches business emails via Apify, drafts replies grounded in Supabase project library by service type, sends Gmail/Telegram follow-up for hot/warm leads, logs cold leads to Sheets.
8. Meeting Summarizer & Task Extractor
   - Categories: AI, Automation.
   - Tags: n8n, OpenRouter, Slack, Monday.com.
   - Databases/storage: Monday.com.
   - Description: client-demo n8n workflow that transcribes/summarizes meetings to Slack and extracts action items into Monday.com tasks.

All automation project `link` values are currently `null`, so the modal does not show an open-link CTA for them.

## Automation Modal

Component: `src/components/AutomationModal.tsx`.

- Built with local Radix Dialog wrapper.
- Shows a 16:9 image hero.
- If a project has `galleryImages`, the image hero becomes a carousel.
- Carousel supports left/right buttons and ArrowLeft/ArrowRight keyboard navigation.
- Uses `motion` slide animation unless reduced motion is preferred.
- Category chips render under the modal eyebrow.
- Tech stack and database sections render icon chips.
- Tag/database icons are resolved by substring mapping inside the modal.
- Link button appears only when `project.link` is non-null.

## Pricing Section

Component: `src/components/PricingSection.tsx`.

Section copy:

- Eyebrow: `Pricing`
- Title: `Pay for what you need`
- Disclaimer: `All prices are starting rates. Final quote depends on project scope.`
- CTA: `Have a custom project? Let's talk.` -> `/#contact`

Plans:

1. Website
   - Starting at `$149`
   - Inclusions: responsive pixel-perfect design; maintainable code; Supabase database; authentication and role management; SEO setup and Vercel deployment; 2 rounds of revisions.
2. Automation & AI
   - Starting at `$799`
   - Marked most popular.
   - Inclusions: n8n workflow; API/webhook integrations; AI pipeline using OpenAI/OpenRouter; CRM and marketing tool integrations; documentation and handoff; 2 rounds of revisions.
3. Mobile App
   - Starting at `$199`
   - Inclusions: iOS and Android; push notifications; Supabase auth/database; app store submission assistance; offline-ready architecture; 2 rounds of revisions.

UX:

- Full viewport-height section.
- Three-card grid on desktop.
- Popular plan uses gradient border shell, scaled emphasis, and "Most Popular" badge.
- Cards have hover lift and active press.
- Entrance animations stagger by card index.

## Contact Section

Component: `src/components/ContactSection.tsx`.

Section copy:

- Eyebrow: `Contact`
- Title: `Get in Touch`
- Description: `Have a project in mind? I'd love to hear about it.`
- Webhook URL currently embedded in content: `https://n8n.maycoder.uk/webhook-test/e5fe5d21-128b-4fc4-960e-344d1d803108`

Form fields:

- Name
- Email
- Project type radio pills
- Message

Default initial project type: `automation`.

Project type options:

- Web dev
- Mobile app
- Automation

Submission behavior:

- Validates only that name, email, project type, and message are non-empty.
- Checks client-side rate limiting before POST.
- POSTs JSON `{ name, email, projectType, message }` to the configured webhook.
- On success, records submission timestamp, opens success dialog, and resets form when the dialog closes.
- On failure, opens error dialog.
- Submit button is disabled while sending.
- There is a content string for invalid email and an `isValidEmail()` utility, but `ContactSection` does not currently call it.

Rate limiting:

- Utility: `src/utils/contactRateLimit.ts`.
- Storage key: `maycoder-contact-submissions`.
- Minimum interval: 60 seconds.
- Maximum submissions per hour: 5.
- Storage failures fail open.
- Error template supports `{seconds}` replacement.

Direct methods:

- Email: `nunez.aianmhyco.bernardino@gmail.com`
- LinkedIn: `Aian Mhyco Nunez`

Social/tutorial links:

- Facebook: `https://www.facebook.com/profile.php?id=61588914774614`
- Instagram: `https://www.instagram.com/maycoder.ai.automation/?hl=en`
- TikTok: `https://www.tiktok.com/@maycoder.ai.automation`
- YouTube: `https://www.youtube.com/@maycoder.ai.automation.n8n`

UX:

- Left column has copy and form.
- Right column has direct contact tiles and social tiles.
- Brand icons use gradient SVG fills defined in hidden `svg defs`.
- Success and error states use Radix Dialog with lucide status icons.

## CV Page

Route: `/cv`.

Component: `src/pages/CvPage.tsx`.

Behavior:

- Scrolls to top immediately on mount.
- Uses `AppShell` and `NavBar`.
- Fixed bottom-center back button to `/`.
- Mobile/tablet layout is a vertical stack.
- Desktop layout is a bento-like grid with two columns (`5fr 7fr`).

Desktop CV order:

1. Profile card | Summary/contact
2. Technical skills full width
3. Education | Experience
4. Projects full width
5. Certifications | Awards

Mobile/tablet order:

1. Profile card
2. Summary
3. Experience
4. Skills
5. Projects
6. Education
7. Certifications
8. Awards

Profile content:

- Name: `Aian Mhyco B. Nunez`
- Subtitle: `AI Automation Specialist - n8n - Agentic AI Systems`
- Download CV link: `/Aian_Mhyco_Nunez_CV.pdf`
- Profile image: `src/assets/cv/profile.png`

Professional summary:

AI Automation Specialist and Computer Science student with hands-on experience building production-grade n8n workflows, multi-agent AI systems, and API integrations from scratch. Proficient in integrating Claude, OpenAI, and Gemini into real automation pipelines, including Telegram multi-agent system with PostgreSQL memory and meeting-to-task automation. Seeking remote opportunities designing and building intelligent automation systems.

CV contact:

- Email: `nunez.aianmhyco.bernardino@gmail.com`
- Phone: `+63 950 159 3599`
- Location: `Caloocan City, Philippines`
- LinkedIn: same LinkedIn profile as contact section.
- GitHub: `https://github.com/maycodersz`
- Portfolio: `https://maycoder.vercel.app`

CV skill categories:

- Automation & Integration: n8n, multi-agent orchestration, webhook triggers, sub-agents, API nodes, REST APIs, webhooks.
- AI / LLM Integration: Claude API, OpenAI API, OpenRouter, Google Gemini, Ollama, prompt engineering.
- Programming: Python, JavaScript, TypeScript, Java, C, React, HTML, CSS, Tailwind CSS.
- Databases: PostgreSQL, Supabase, MySQL.
- Tools & Platforms: Google Workspace, Gmail API, Calendar API, Sheets, Drive, Slack, Monday.com, Notion, Telegram, Git.

CV projects:

- Jarvis AI Agent - Multi-Agent Automation System, 2025.
- Meeting Automation - Google Meet to Slack and Monday.com, 2025.
- Sales Tracker & Receipt Processor Bots, 2025.
- OLFU Academic Hub, 2024.

Education:

- Bachelor of Science in Computer Science, Our Lady of Fatima University, 2024-2028, GWA 1.24, Dean's List.
- Senior High School - STEM Strand, Our Lady of Fatima University, graduated 2024.

Certifications:

- Advanced Learning Algorithms, DeepLearning.AI & Stanford University (Coursera), Apr 2026.
- Supervised Machine Learning: Regression & Classification, DeepLearning.AI & Stanford (Coursera), Mar 2026.

Awards:

- Champion - Python Programming Competition, CCS Week, OLFU, 2025.
- 2nd Place - ADET Arduino Competition, CCS Week, OLFU, 2025.

Experience:

- Placeholder states the owner is currently a student actively building real-world projects and seeking remote freelance, internship, or contract roles in AI automation and full-stack development.
- Includes a `Get in touch` button to `/#contact`.

## Base UI Components

### Button

File: `src/components/ui/button.tsx`.

- Uses `class-variance-authority`.
- Supports `asChild` via Radix Slot.
- Variants:
  - `default`
  - `accent`
  - `accentSecondary`
  - `destructive`
  - `outline`
  - `secondary`
  - `ghost`
  - `link`
- Sizes:
  - `default`
  - `sm`
  - `lg`
  - `icon`
- Design language: liquid glass, purple brand gradients, glossy dark-mode surfaces, bouncy hover transitions, press states.
- Exports CTA/cursor surface class constants used by cursor follow pill.

### Dialog, Sheet, Tooltip

- Local wrappers around Radix primitives.
- Dialog powers contact result modals and automation detail modal.
- Tooltip powers skill chips.
- Sheet exists but is not used by the main route at the time of this handoff.

### Device Frames

File: `src/components/device/DeviceFrames.tsx`.

- `MonitorFrame`, `TabletFrame`, and `PhoneFrame` support either `src` image or child content.
- Frames use CSS device tokens from `index.css`.
- Non-flat frames have 3D hover tilt.
- Flat mode disables tilt for project-detail sticky showcase.
- Animation classes:
  - monitor: rise from below
  - tablet: enter from right
  - phone: enter from left
- `DeviceScreenPlaceholder` shows a phone icon and label, currently `Coming Soon`.

## Hooks And Animation Model

- `useInView`: IntersectionObserver returning `[ref, isInView]`; resets to false when leaving viewport.
- `useRevealOnView`: IntersectionObserver plus `revealKey`; increments when entering view so CSS animations can replay.
- `useSectionAnimState`: locks section state at viewport entry:
  - entered while scrolling down -> `animating`
  - entered while scrolling up -> `visible`
  - not in viewport -> `hidden`
- `useScrollDirection`: tracks scroll direction with 2px delta threshold.
- `useScrollRevealGate`: arms a short true window after entering view; used to keep scroll entrance animations separate from later UI actions.
- `useCountUp`: requestAnimationFrame count-up with cubic ease-out and reduced-motion shortcut.
- `useCursorFollow`: tracks viewport coordinates while pointer is inside a container.
- `usePrefersReducedMotion`: watches OS reduced motion preference.
- `useIsPointerFine`: detects fine pointer devices.
- `useIsMobileViewport`: detects below-lg viewport.

Global CSS animations:

- `hero-roll-down`
- `hero-fade-left`
- `skill-marquee`
- `device-rise`
- `device-enter-right`
- `device-enter-left`
- `stat-pop-in`
- `stat-content-rise`
- `stats-eyebrow-in`
- `stats-headline-in`
- `stats-support-in`
- `stat-finish-glow`

Reduced-motion CSS disables or simplifies major animations and ensures content remains visible.

Coarse-pointer CSS shortens animation durations to make touch devices feel less laggy.

## Assets

Hero:

- `src/assets/hero/profile-dark.png`
- `src/assets/hero/profile-light.png`
- `src/assets/hero/profile-light1.png` (present but not imported in current code)
- `src/assets/hero/alter-ego-dark.png`
- `src/assets/hero/alter-ego-light.png`

CV:

- `src/assets/cv/profile.png`
- `public/Aian_Mhyco_Nunez_CV.pdf`

Academic Hub:

- `src/assets/projects/web/academic-hub/desktop.png`
- `src/assets/projects/web/academic-hub/tablet.png`
- `src/assets/projects/web/academic-hub/phone.png`
- `src/assets/projects/web/academic-hub/case-study/1.png` through `17.png`
- Current content imports only `1.png` through `5.png` from the case-study folder.

Automation:

- `src/assets/projects/automation/project-1.png` through `project-8.png`, plus gallery variants:
  - `project-2.1.png`
  - `project-2.2.png`
  - `project-2.3.png`
  - `project-6.1.png`
  - `project-6.2.png`
  - `project-6.3.png`

Admino:

- `src/assets/projects/mobile/admino/phone.png`
- `src/assets/projects/mobile/admino/tablet.png`
- `src/assets/projects/mobile/admino/case-study/1.png`
- These are present but not imported or displayed because Admino currently uses placeholders.

Public:

- `public/favicon.svg`
- `public/icons.svg`

## Icon Strategy

- Skill and tech logos first try Simple Icons CDN: `https://cdn.simpleicons.org/{slug}/000000`.
- Slugs live in `src/lib/skillLogos.ts`.
- `BrandSkillLogo` falls back to `projectTechIcon` when no Simple Icons slug exists or the image fails to load.
- `projectTechIcon` maps exact labels and substring patterns to Lucide icons.
- Skill marquee chips use CSS classes `.skill-chip-icon` and `.skill-chip-fallback`.
- Project tech pills use `.tech-pill-simpleicon`.
- Dark mode inverts black Simple Icons to white by default; hover states invert according to gradient backgrounds.

## Accessibility Notes

- Sections use `aria-label` from content where provided.
- Navbar mobile overlay uses `role="dialog"` and `aria-modal="true"`.
- Theme toggles have explicit aria labels.
- Skill chips use buttons with `aria-label` and `aria-pressed`, plus tooltips.
- Work info bar uses keyboard-accessible pseudo-button behavior.
- Project detail showcase has live region updates and labeled slide-jump buttons.
- Contact form labels are associated with inputs.
- Dialogs use Radix primitives.
- Reduced motion is respected in CSS, project showcase, count-up, and modal carousel.
- Custom cursor only applies on fine pointers; touch devices keep native cursor affordance.

## Known Caveats And Follow-Up Context

- Contact form has `emailValidationMessage` content and `src/utils/isValidEmail.ts`, but the form currently does not validate email format before POSTing.
- The contact webhook URL is hard-coded in `portfolio.ts` and points to a `webhook-test` n8n endpoint. For production, verify whether this should become an environment variable or production webhook.
- Hero description has no space after `n8n.` in the source string: `n8n.I ship...`.
- Admino assets exist but Admino project data currently uses placeholders instead of imported screens.
- Academic Hub has case-study images 6-17 present but only images 1-5 are imported into the page carousel.
- `ProjectShowcaseSection.tsx` exists but is not rendered in `App.tsx`; current featured-project display is through `WorksSection`.
- `sheet.tsx` exists but is not currently used by the main app flow.
- There are no tests in the repo. Verification is currently build/lint/manual browser review.

## Editing Guidance For Future LLMs

- Prefer editing `src/content/portfolio.ts` for copy, links, pricing, stats, projects, automation entries, contact details, and CV content.
- Preserve homepage section order unless explicitly asked to change it.
- Preserve ID anchors `hero`, `works`, `pricing`, and `contact` because nav/hash scrolling depends on them.
- Preserve `AppShell` as the common shell for homepage, CV, and project pages so scroll-to-top FAB and custom cursor remain global.
- When adding project detail pages, add data to `portfolio.projects`; the `/work/:id` route is already generic.
- When adding automation projects, add to `portfolio.automationProjects`; the section and modal are data-driven.
- When adding skills or tech labels, update `src/lib/skillLogos.ts` first if a Simple Icons slug exists, and `src/utils/projectTechIcon.tsx` only for fallbacks.
- Respect reduced-motion behavior when introducing new animation.
- Keep image alt text meaningful; use content fields or title-derived labels.
- Use `Button` and `Link` primitives rather than raw elements when possible so the existing visual and routing behavior stays consistent.
- Be careful with the custom cursor system: interactive zones using `WithCursorFollow` should suppress `GlobalPaperPlaneCursor` while active.
- Do not create nested cards inside cards; the project bento grid explicitly uses flat category lists inside tech tiles.
- For UI verification, check at mobile, tablet, laptop, and desktop widths because many layouts switch at `lg`.

## Analysis Snapshot

During this handoff pass, graphify corpus detection found:

- 109 supported files.
- 62 code files.
- 2 document files.
- 1 PDF.
- 44 images.
- 0 sensitive files skipped.

Deterministic graphify AST extraction found:

- 314 code nodes.
- 876 edges.

Semantic graph extraction was not run because the available subagent tool is restricted to cases where the user explicitly asks for subagents. This document is therefore based on direct source inspection plus deterministic structure extraction.
