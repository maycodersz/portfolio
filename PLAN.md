# PLAN.md - Portfolio Website Grouped System Case Study Upgrade

## Purpose

This plan is for Codex working inside the existing Maycoder portfolio repository.

The goal is to remove the pricing-focused homepage experience and route visitors toward a stronger grouped system case study: the AccountingOps Automation System, a realistic GoHighLevel + n8n demo for accounting/bookkeeping operations.

The website should position Maycoder as a business automation specialist who can design, build, and explain complete CRM/operations systems, not only isolated workflows.

## Source of Truth

Use the existing repo and `PORTFOLIO.md` as technical handoff context.

Important repo facts:

- Project brand: `Maycoder`.
- Owner/persona: `Aian Mhyco B. Nunez`.
- Main content file: `src/content/portfolio.ts`.
- Homepage composition: `src/App.tsx`.
- Generic project detail route: `/work/:id`, driven by `portfolio.projects`.
- Automation cards are driven by `portfolio.automationProjects`.
- Pricing code/data must be preserved for later possible use.

## Strategic Decision

Do not add a Systems section to the landing page.

Instead:

- Remove Pricing from the homepage.
- Keep the landing page focused: Hero, Skills, Stats, Works, Automation Playground, Contact.
- Make `Systems` in the navbar open `/work/accountingops-automation-system`.
- Let automation cards route to the same system page through `systemHref`.
- The modal remains available in code, but the current automation library should route to the grouped system page.

Reason:

- Fixed pricing weakens the offer because GHL/n8n work varies widely in scope.
- A grouped system case study is stronger proof because it shows business process design.
- Multiple small automation cards can belong to one larger system and should not require separate pages unless they truly need one.

## Target Homepage Architecture

Current pricing must not render.

Target order in `src/App.tsx`:

```tsx
<RouteHashScroll />
<LoadingScreen />
<NavBar />
<section id="hero">
  <HeroSplineSection />
</section>
<SkillsShowcase />
<StatsSection />
<section id="works">
  <WorksSection />
</section>
<AutomationSection />
<ContactSection />
```

Navigation target:

```txt
CV -> /cv
Work -> /#works
Systems -> /work/accountingops-automation-system
Hire Me -> /#contact
```

Do not create or depend on a `#systems` landing anchor.

## Implementation Changes

### Pricing Preservation

- Remove the `PricingSection` import/render from `src/App.tsx`.
- Keep `src/components/PricingSection.tsx`.
- Keep `portfolio.pricing`.

### AccountingOps Project Page

Add `accountingops-automation-system` to `portfolio.projects` so the existing route `/work/:id` renders it.

Use route-only behavior:

- Add `showInWorks?: boolean` to the `Project` type.
- Set `showInWorks: false` on AccountingOps.
- Filter `WorksSection` with `project.showInWorks !== false`.

This keeps the system page available without adding a new homepage Works card.

### Automation Group Routing

Add `systemHref?: string` to `AutomationProject`.

Update `AutomationSection` View Work behavior:

```txt
If project.systemHref exists -> navigate(project.systemHref)
Else -> open AutomationModal
```

Set every current automation project to:

```ts
systemHref: '/work/accountingops-automation-system'
```

This preserves a fallback modal path for future automation projects that do not belong to a grouped system.

### Remove Old Systems Section Work

- Remove `SystemsSection` from `src/App.tsx`.
- Delete `src/components/SystemsSection.tsx` if unused.
- Remove stale `portfolio.systems`, `BusinessSystemCaseStudy`, and `SystemsContent` if unused.

## AccountingOps Content Requirements

Positioning:

```txt
A realistic portfolio demo system built to show how an accounting/bookkeeping firm could automate intake, document processing, review routing, and monthly close tracking using GoHighLevel and n8n.
```

Project metadata:

```txt
Title: AccountingOps Automation System
Type: GHL CRM, n8n Automation, Accounting Operations
Duration: Portfolio demo - completed core system
Highlight: Full CRM operations demo for accounting/bookkeeping workflows
```

Description:

```txt
AccountingOps is a GoHighLevel and n8n automation system built to model how an accounting/bookkeeping firm can handle inquiries, discovery, onboarding, document collection, AI-assisted document processing, review requests, and monthly close tracking in one connected CRM workflow.
```

Problem:

```txt
Accounting and bookkeeping teams often manage new inquiries, client discovery, document collection, invoice/receipt review, exceptions, and monthly close work across disconnected forms, inboxes, spreadsheets, and manual reminders. This makes it hard to know which clients are ready, which documents are missing, which items need human review, and what needs to happen next.
```

Solution:

```txt
I designed a realistic GHL subaccount with a structured Accounting Sales Pipeline, custom objects for Documents, Invoices, Review Requests, and Monthly Close records, public and internal forms, smart operational views, email snippets, owner notifications, and workflows that move records through the process. n8n connects to GHL through webhooks for AI document classification and extraction, returning structured status, confidence, and review signals.
```

Results:

```txt
The system turns scattered accounting operations into a visible workflow: new inquiries enter the pipeline automatically, discovery notes route the opportunity to the right next step, submitted documents become trackable records, low-confidence or exception items can create review requests, and monthly close progress can be monitored through structured status fields instead of manual follow-up.
```

Metrics:

```txt
5 Core Forms
4 Custom Objects
8+ GHL Workflows
GHL + n8n Integration
```

Feature modules:

- Client Intake
- Discovery Routing
- Document Submission
- AI Document Processing
- Review Requests
- Monthly Close Tracking

Technical areas:

- CRM & Operations: GoHighLevel, pipelines, custom objects, smart lists.
- Automation: n8n, webhooks, workflow builder.
- AI & Data Processing: OpenAI/OpenRouter, document classification, structured extraction.
- Business Process: accounting intake, document collection, review routing, monthly close tracking.

## Public Copy Rules

Use client-friendly language.

Avoid:

- Fake live-client claims.
- Guaranteed savings or revenue claims.
- Saying `fully automated accounting`.
- Overpromising unsupported GHL behavior.
- Exposing private GHL subaccount links.

Prefer:

- `demo system`
- `realistic operations workflow`
- `human review for exceptions`
- `structured intake`
- `document tracking`
- `monthly close visibility`
- `AI-assisted document processing`
- `CRM operations system`

## Verification Requirements

Run:

```bash
npx eslint src\App.tsx src\components\AutomationSection.tsx src\components\WorksSection.tsx src\content\portfolio.ts
npm run build
```

Manual QA:

- `/` renders without Pricing.
- `/` renders without a Systems section.
- Navbar Systems opens `/work/accountingops-automation-system`.
- Automation View Work opens `/work/accountingops-automation-system`.
- The modal fallback remains available for future automation projects without `systemHref`.
- `/work/accountingops-automation-system` shows Problem, Solution, Results, metrics, and GHL/n8n system details.
- Existing `/work/academic-hub` and `/work/admino-mobile` still render.
- `src/components/PricingSection.tsx` and `portfolio.pricing` are still present.

## Future Improvements

- Add real screenshots of GHL objects, forms, smart lists, and n8n workflows.
- Add a Loom walkthrough link.
- Add a downloadable PDF case study.
- Add full case-study routes for additional grouped systems.
- Add project filtering for Systems, Web, Mobile, and Automation.
