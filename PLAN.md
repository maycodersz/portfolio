# Plan: Build the /cv page for portfolio-remastered

## Context

The portfolio site currently has a "CV" navbar link pointing to `/#cv`, which scrolls to the StatsSection (a metrics section — not a real CV). The user wants a **dedicated /cv page** that presents their full resume in the portfolio's futuristic glass-card style, with a downloadable PDF button. This page will be a standalone route, matching the pattern of the existing `/work/:id` project detail page.

## Resume data source

The user's resume PDF (`D:\Downloads\resume.pdf`) contains:
- **Name**: Aian Mhyco B. Nunez — AI Automation Specialist · n8n · Agentic AI Systems
- **Contact**: Caloocan City, Philippines | +63 950 159 3599 | nunez.aianmhyco.bernardino@gmail.com | LinkedIn | GitHub
- **Professional Summary**: AI Automation Specialist and CS student, n8n workflows, multi-agent systems, Claude/OpenAI/Gemini integrations
- **Technical Skills**: 5 categories (Automation, AI/LLM, Programming, Databases, Tools & Platforms)
- **Projects**: Jarvis AI Agent, Meeting Automation, Sales Tracker & Receipt Processor, OLFU Academic Hub
- **Certifications**: 2 Stanford/DeepLearning.AI Coursera certs (Mar & Apr 2026)
- **Education**: BS Computer Science @ OLFU (2024–2028, GWA 1.24, Dean's List) + SHS STEM (Graduated 2024)
- **Awards**: Python Champion & Arduino 2nd Place — both CCS Week 2025, OLFU
- **Experience**: Placeholder — "Open to opportunities"

---

## Implementation steps

### 1. Add CV types and content to `src/content/portfolio.ts`

Add after existing `StatItem` type (~line 192):
- `CvSkillCategory` — `{ category: string; items: readonly string[] }`
- `CvProject` — `{ id, title, year, techStack, bullets, portfolioHref? }`
- `CvCertification` — `{ title, issuer, date }`
- `CvEducation` — `{ degree, institution, period, details? }`
- `CvAward` — `{ title, event, date }`
- `CvContactInfo` — email, phone, location, linkedin/github/portfolio links
- `CvContent` — aggregates all above + section labels, download href, back link, experience placeholder text

Add a `cv` key to the `portfolio` const with all resume content populated. Key values:
- `downloadHref: '/Aian_Mhyco_Nunez_CV.pdf'`
- `experiencePlaceholder`: "Currently a student actively building real-world projects and seeking remote opportunities. Open to freelance, internship, or contract roles in AI automation and full-stack development."
- Projects link to existing portfolio entries: Academic Hub → `/work/academic-hub`, automation projects → `/#automation`

### 2. Update navbar CV link

In `portfolio.ts`, change:
```
{ id: 'nav-cv', label: 'CV', href: '/#cv', kind: 'link' }
→
{ id: 'nav-cv', label: 'CV', href: '/cv', kind: 'link' }
```

### 3. Remove `id="cv"` from StatsSection

In `src/components/StatsSection.tsx`, remove `id="cv"` from the `<section>` element. The stats section is not the CV — it shouldn't carry that anchor.

### 4. Place the resume PDF

Copy `D:\Downloads\resume.pdf` → `public/Aian_Mhyco_Nunez_CV.pdf`

### 5. Create CV section components in `src/components/cv/`

**`CvSectionShell.tsx`** — Reusable wrapper for all CV sections. Takes `title` (section heading) + `children`. Uses `useRevealOnView` + `useSectionAnimState` for scroll-triggered entrance animations. Glass card surface matching the existing pattern: `bg-background dark:bg-white/[0.04] dark:backdrop-blur-sm`.

**7 section components** (each receives data via `portfolio.cv`):
| Component | Content | Visual notes |
|---|---|---|
| `CvSummarySection` | Professional summary text + contact info chips | Contact as icon+text chips (Mail, Phone, MapPin from Lucide; FaLinkedinIn, FaGithub from react-icons) |
| `CvExperienceSection` | Placeholder message + "Get in touch" CTA | Dashed-border accent card with Briefcase icon, link to `/#contact` |
| `CvSkillsSection` | 5 skill categories in grid | 2-col grid on desktop, 1-col mobile. Category heading + inline pills |
| `CvProjectsSection` | 4 projects with bullets + tech stack | Glass cards, title+year header, bullet list, optional "View project" link button |
| `CvEducationSection` | 2 education entries | Timeline-style with vertical line on left. Degree bold, institution, period, details |
| `CvCertificationsSection` | 2 certifications | Compact cards: title bold, issuer, date |
| `CvAwardsSection` | 2 awards | Cards with Trophy icon from Lucide. Title, event, date |

### 6. Create `src/pages/CvPage.tsx`

Follows `ProjectPage.tsx` pattern exactly:
- `<AppShell>` → `<NavBar />` → content
- Floating "Back to portfolio" button at bottom-center (same markup as ProjectPage)
- Page header: gradient text name (`text-gradient-brand`), subtitle, Download CV button (`accent` variant + Download icon)
- Content area: `max-w-4xl mx-auto px-[8%] md:px-[10%]` with `space-y-12`
- Renders all 7 section components in order
- Bottom padding for floating button clearance

### 7. Add route to `src/router.tsx`

```tsx
import CvPage from '@/pages/CvPage'
// ...
{ path: '/cv', element: <CvPage /> },
```

### 8. (Optional) Add subtle entrance animation to `src/index.css`

```css
@keyframes cv-section-in {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
```
With `prefers-reduced-motion` and `pointer: coarse` overrides following existing patterns. The existing `animate-stats-support-in` animation is also reusable if preferred.

---

## Files to modify

| File | Change |
|---|---|
| `src/content/portfolio.ts` | Add CV types + `cv` data block + update navbar href |
| `src/router.tsx` | Add `/cv` route |
| `src/components/StatsSection.tsx` | Remove `id="cv"` |
| `src/index.css` | Optional: add `cv-section-in` animation |

## Files to create

| File | Purpose |
|---|---|
| `public/Aian_Mhyco_Nunez_CV.pdf` | Downloadable resume |
| `src/pages/CvPage.tsx` | Page component |
| `src/components/cv/CvSectionShell.tsx` | Shared section wrapper |
| `src/components/cv/CvSummarySection.tsx` | Professional summary + contact |
| `src/components/cv/CvExperienceSection.tsx` | Placeholder experience |
| `src/components/cv/CvSkillsSection.tsx` | Technical skills grid |
| `src/components/cv/CvProjectsSection.tsx` | Projects with links |
| `src/components/cv/CvEducationSection.tsx` | Education timeline |
| `src/components/cv/CvCertificationsSection.tsx` | Certifications list |
| `src/components/cv/CvAwardsSection.tsx` | Awards with icons |

## Existing code to reuse

- **AppShell** (`src/components/AppShell.tsx`) — page layout wrapper
- **NavBar** (`src/components/ui/navbar.tsx`) — shared header
- **Button** (`src/components/ui/button.tsx`) — `accent` for download, `accentSecondary` for back
- **Link** (`src/components/ui/link.tsx`) — handles both route and hash navigation
- **useRevealOnView** (`src/hooks/useRevealOnView.ts`) — scroll-triggered reveal
- **useSectionAnimState** (`src/hooks/useSectionAnimState.ts`) — animation state machine
- **useScrollDirection** (`src/hooks/useScrollDirection.ts`) — suppress upward-scroll animations
- **cn()** (`src/utils/cn.ts`) — class merging utility
- Glass card surface class: `bg-background dark:bg-white/[0.04] dark:backdrop-blur-sm`
- Brand gradient text class: `text-gradient-brand`

## Verification

1. `npm run dev` → navigate to `/cv` — all 7 sections render correctly
2. Click "Download CV" — PDF downloads
3. Click "Back to portfolio" floating button — returns to homepage
4. From homepage, click navbar "CV" — navigates to `/cv` page
5. From `/cv`, click navbar "Work" or "Pricing" — returns to homepage at correct section
6. Toggle dark/light mode on `/cv` — all sections adapt correctly
7. Resize to mobile — layout stacks to single column, navbar shows hamburger
8. Scroll through sections — entrance animations trigger on each section