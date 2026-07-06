# PHASES.md - Step-by-Step Build Phases for Codex

## Overview

Main goal:

```txt
Remove Pricing from homepage -> Add AccountingOps grouped system case study -> Route grouped automation projects to that case study -> Update navigation and docs.
```

Important preservation rule:

```txt
Keep src/components/PricingSection.tsx and portfolio.pricing unless a later cleanup explicitly asks to remove them.
```

## Phase 0 - Inspect Current Repo Before Editing

### Goal

Understand the current React/Vite/TypeScript structure before changing files.

### Files to inspect

```txt
src/App.tsx
src/content/portfolio.ts
src/components/ui/navbar.tsx
src/pages/ProjectPage.tsx
src/components/project/ProjectBentoGrid.tsx
src/components/project/ScrollDeviceShowcase.tsx
src/components/AutomationSection.tsx
src/components/AutomationModal.tsx
src/components/PricingSection.tsx
src/router.tsx
src/utils/projectTechIcon.tsx
src/lib/skillLogos.ts
```

### Acceptance criteria

- Confirm how pricing is rendered and remove only the homepage render.
- Confirm `portfolio.projects` powers `/work/:id`.
- Confirm automation cards currently open `AutomationModal`.
- Confirm how to keep a project route available while hiding it from `WorksSection`.

## Phase 1 - Remove Pricing From Homepage

### Goal

Stop showing pricing publicly without deleting pricing code/data.

### Tasks

1. Remove the `PricingSection` import from `src/App.tsx`.
2. Remove the `<PricingSection />` render call.
3. Keep `src/components/PricingSection.tsx`.
4. Keep `portfolio.pricing`.

### Acceptance criteria

- Homepage no longer renders pricing.
- App compiles without unused pricing imports.
- No other homepage section disappears.

## Phase 2 - Update Navigation

### Goal

Replace the old Pricing navigation with a Systems link that opens the grouped case-study page.

### Tasks

1. Update navbar content source from:

```txt
Pricing -> /#pricing
```

to:

```txt
Systems -> /work/accountingops-automation-system
```

2. Keep existing items:

```txt
CV -> /cv
Work -> /#works
Hire Me -> /#contact
```

### Acceptance criteria

- Desktop and mobile nav show Systems, not Pricing.
- No public navbar link points to `#pricing` or `#systems`.
- Systems opens `/work/accountingops-automation-system`.

## Phase 3 - Add AccountingOps Route-Only Project Data

### Goal

Create a full grouped system page using the existing `/work/:id` project detail route.

### Tasks

1. Add a `showInWorks?: boolean` field to the `Project` type.
2. Add an AccountingOps project item to `portfolio.projects` with:
   - `id: 'accountingops-automation-system'`
   - demo-system positioning
   - GHL/n8n/accounting operations project type
   - Problem / Solution / Results case study
   - result metrics for forms, custom objects, workflows, and GHL+n8n integration
   - tech stack categories for CRM, automation, AI/data processing, and business process
   - six feature modules: Client Intake, Discovery Routing, Document Submission, AI Document Processing, Review Requests, Monthly Close Tracking
3. Set `showInWorks: false` so the system page does not create a new homepage Works card.
4. Filter `WorksSection` with `project.showInWorks !== false`.

### Acceptance criteria

- `/work/accountingops-automation-system` resolves through the existing project route.
- AccountingOps does not render as a homepage Works card.
- Existing project pages still render.
- Copy clearly says this is a realistic portfolio demo system, not a live client deployment.

## Phase 4 - Route Grouped Automation Projects

### Goal

Let all current automation cards open the shared system page while preserving the modal as a fallback for future ungrouped automations.

### Tasks

1. Add an optional `systemHref?: string` field to `AutomationProject`.
2. Update `AutomationSection` View Work behavior:
   - If `project.systemHref` exists, navigate to that route.
   - Otherwise, open the existing `AutomationModal`.
3. Add `systemHref: '/work/accountingops-automation-system'` to every current automation project.
4. Do not invent separate routes for individual automation projects.

### Acceptance criteria

- Automation cards navigate to `/work/accountingops-automation-system`.
- Future automation cards without `systemHref` still open the modal.
- Mobile View Work button follows the same behavior as desktop card click.

## Phase 5 - Remove Old Landing Systems UI

### Goal

Remove the previously planned homepage Systems section.

### Tasks

1. Remove any `SystemsSection` import/render from `src/App.tsx`.
2. Remove `src/components/SystemsSection.tsx` if it is unused.
3. Remove stale `portfolio.systems` data and `BusinessSystemCaseStudy`/`SystemsContent` types if nothing imports them.
4. Keep AccountingOps content inside `portfolio.projects`.

### Acceptance criteria

- Landing page order is:

```txt
Hero
Skills
Stats
Works
Automation Playground
Contact
```

- No `#systems` anchor is required.
- No dead `SystemsSection` reference remains.

## Phase 6 - Optional Hero and Contact Refinement

Do not block the grouped routing work on these.

Optional hero positioning:

```txt
I build AI automation systems for service businesses using n8n, GoHighLevel, APIs, and custom dashboards.
```

Contact form warning:

```txt
Do not change submitted projectType values unless the n8n webhook can handle them.
```

## Phase 7 - QA and Verification

### Commands

```bash
npx eslint src\App.tsx src\components\AutomationSection.tsx src\components\WorksSection.tsx src\content\portfolio.ts
npm run build
```

### Manual QA checklist

- Homepage loads from `/`.
- Homepage shows no Pricing section.
- Homepage shows no Systems section.
- Navbar Systems opens `/work/accountingops-automation-system`.
- Automation card View Work opens `/work/accountingops-automation-system`.
- Modal fallback remains available for future automation projects without `systemHref`.
- `/work/accountingops-automation-system` shows Problem, Solution, Results, metrics, GHL/n8n details, and demo-system positioning.
- Existing `/work/academic-hub` and `/work/admino-mobile` still render.
- Pricing file and pricing data remain preserved.

## Future Improvements

- Add real GHL and n8n screenshots when available.
- Add a Loom walkthrough link.
- Add full case-study routes for other grouped systems if needed.
- Add project filtering for Systems, Web, Mobile, and Automation.
