import imgAutomationCalendar from '@/assets/projects/automation/project-5.png'
import imgAutomationEmailWatcher from '@/assets/projects/automation/project-6.1.png'
import imgAutomationEmailWatcherDigest from '@/assets/projects/automation/project-6.2.png'
import imgAutomationEmailWatcherSpam from '@/assets/projects/automation/project-6.3.png'
import imgAutomationEmail from '@/assets/projects/automation/project-4.png'
import imgAutomationJarvis from '@/assets/projects/automation/project-1.png'
import imgAutomationReceipt from '@/assets/projects/automation/project-2.png'
import imgAutomationReceiptDaily from '@/assets/projects/automation/project-2.1.png'
import imgAutomationReceiptWeekly from '@/assets/projects/automation/project-2.2.png'
import imgAutomationReceiptMonthly from '@/assets/projects/automation/project-2.3.png'
import imgAutomationSales from '@/assets/projects/automation/project-3.png'
import imgAutomationLeadQualifier from '@/assets/projects/automation/project-7.png'
import imgAutomationMeeting from '@/assets/projects/automation/project-8.png'
import imgAcademicHubDesktop from '@/assets/projects/web/academic-hub/desktop.png'
import imgAcademicHubPhone from '@/assets/projects/web/academic-hub/phone.png'
import imgAcademicHubTablet from '@/assets/projects/web/academic-hub/tablet.png'
/* Academic Hub case-study carousel (filenames sort 1…17; titles are editable in-page). */
import imgAhCaseStudy01 from '@/assets/projects/web/academic-hub/case-study/1.png'
import imgAhCaseStudy02 from '@/assets/projects/web/academic-hub/case-study/2.png'
import imgAhCaseStudy03 from '@/assets/projects/web/academic-hub/case-study/3.png'
import imgAhCaseStudy04 from '@/assets/projects/web/academic-hub/case-study/4.png'
import imgAhCaseStudy05 from '@/assets/projects/web/academic-hub/case-study/5.png'

export type NavbarItemKind = 'link' | 'cta'

export type NavbarItem = {
  id: string
  label: string
  href: string
  kind: NavbarItemKind
}

export type HeroCtaTone = 'secondary' | 'main'

export type HeroCta = {
  id: string
  label: string
  href: string
  tone: HeroCtaTone
}

/* ─── Project types ──────────────────────────────────────────────────────── */

export type ProjectKind = 'website' | 'mobile'

export type ProjectScreens = {
  desktop?: string
  tablet: string
  phone: string
}

export type ProjectLinkVariant = 'live' | 'github' | 'appstore'

export type ProjectLink = {
  label: string
  href: string
  variant: ProjectLinkVariant
}

export type TechStackCategory = {
  heading: string
  items: readonly string[]
}

export type ProjectFeature = {
  title: string
  description: string
}

export type CaseStudyResultMetric = {
  value: string
  label: string
}

export type CaseStudy = {
  overview: string
  problem: string
  solution: string
  results: string
  /** Large scannable figures shown above the results narrative (optional). */
  resultMetrics?: readonly CaseStudyResultMetric[]
}

/** Device showcase slide — `src` then `title` (caption + progress chips); optional `alt` overrides a11y. */
export type ProjectPageImage = {
  src: string
  title: string
  alt?: string
}

export type Project = {
  id: string
  title: string
  kind: ProjectKind
  description: string
  projectType: string
  duration: string
  highlight?: string
  screens: ProjectScreens
  /** When true, device frames show a “coming soon” placeholder instead of screen images. */
  screensUsePlaceholder?: boolean
  heroImage?: string
  links?: readonly ProjectLink[]
  techStack?: readonly TechStackCategory[]
  caseStudy?: CaseStudy
  pageImages?: readonly ProjectPageImage[]
  features?: readonly ProjectFeature[]
  /**
   * Up to six feature cards in a 2×3 grid beside the tech stack (icon + title + body).
   */
  bentoFeatureQuadrant?: readonly ProjectFeature[]
}

/* ─── Automation project types ───────────────────────────────────────────── */

export type AutomationCategory = 'all' | 'ai' | 'automation' | 'cron'

export type AutomationProjectLinkVariant = 'web' | 'mobile'

export type AutomationProjectLink =
  | {
      href: string
      variant: AutomationProjectLinkVariant
    }
  | null

export type AutomationProject = {
  id: string
  title: string
  categories: readonly Exclude<AutomationCategory, 'all'>[]
  description: string
  tags: readonly string[]
  image: string
  /** Extra workflow screenshots shown in the detail modal (main thumbnail stays on `image`). */
  galleryImages?: readonly string[]
  /** Stored data backends (Sheets, Postgres, Drive, etc.) — renders as chips like Tech stack */
  databases: readonly string[]
  link: AutomationProjectLink
}

export type AutomationCategoryFilter = {
  id: AutomationCategory
  label: string
}

/* ─── Pricing types ──────────────────────────────────────────────────────── */

export type PricingPlan = {
  id: string
  title: string
  startingPrice: string
  inclusions: string[]
  isPopular?: boolean
}

/* ─── Contact types ──────────────────────────────────────────────────────── */

export type ContactProjectTypeId = 'web-dev' | 'mobile-app' | 'automation'

export type ContactProjectTypeOption = {
  id: ContactProjectTypeId
  label: string
  messagePlaceholder: string
}

export type ContactSocialPlatform = 'facebook' | 'instagram' | 'tiktok' | 'youtube'

export type ContactMethodPlatform = 'gmail' | 'linkedin'

export type SocialLink = {
  id: string
  label: string
  href: string
  platform: ContactSocialPlatform
}

export type ContactMethod = {
  id: string
  label: string
  value: string
  href: string
  platform: ContactMethodPlatform
}

export type ContactFormRateLimitConfig = {
  minIntervalSeconds: number
  maxSubmissionsPerHour: number
  rateLimitedMessage: string
  rateLimitedRetryMessage: string
}

/* ─── Stats types ────────────────────────────────────────────────────────── */

export type StatItem = {
  id: string
  value: number
  suffix: string
  label: string
  icon: string
}

/* ─── CV types ──────────────────────────────────────────────────────────── */

export type CvSkillCategory = {
  category: string
  items: readonly string[]
}

export type CvProject = {
  id: string
  title: string
  year: string
  techStack: string
  bullets: readonly string[]
  /** Portfolio route for "View project" link. Omit if no detail page exists. */
  portfolioHref?: string
}

export type CvCertification = {
  title: string
  issuer: string
  date: string
}

export type CvEducation = {
  degree: string
  institution: string
  period: string
  details?: string
}

export type CvAward = {
  title: string
  event: string
  date: string
}

export type CvContactInfo = {
  email: string
  phone: string
  location: string
  linkedin: { label: string; href: string }
  github: { label: string; href: string }
  portfolio: { label: string; href: string }
}

export type CvContent = {
  pageTitle: string
  subtitle: string
  professionalSummary: string
  contact: CvContactInfo
  skills: readonly CvSkillCategory[]
  projects: readonly CvProject[]
  certifications: readonly CvCertification[]
  education: readonly CvEducation[]
  awards: readonly CvAward[]
  experiencePlaceholder: string
  downloadLabel: string
  downloadHref: string
  backLabel: string
  backHref: string
  sectionLabels: {
    summary: string
    experience: string
    skills: string
    projects: string
    education: string
    certifications: string
    awards: string
  }
}

/** Resolve display label for a non-`all` automation category from `portfolio.automation.categoryFilters`. */
export function automationCategoryLabel(
  categoryFilters: readonly AutomationCategoryFilter[],
  id: Exclude<AutomationCategory, 'all'>,
): string {
  const row = categoryFilters.find((f) => f.id === id)
  return row?.label ?? id
}

/* ─── Content ────────────────────────────────────────────────────────────── */

export const portfolio = {
  hero: {
    headlineBefore: "Let's build your",
    rotatingTitles: ['Automation', 'Website', 'Mobile App'] as const,
    description:
      'I automate the Boring Stuff for E-Commerce & Marketing Teams using AI and n8n.I ship full products: web dashboards and mobile apps',
    profileAlt: 'Photo of Maycoder',
    alterEgoAlt: 'Maycoder alter ego',
    ctas: [
      { id: 'hero-view-work', label: 'View Work ->', href: '/#works', tone: 'main' },
      { id: 'hero-get-in-touch', label: 'Get in Touch', href: '/#contact', tone: 'secondary' },
    ] as const satisfies Readonly<HeroCta[]>,
  },

  navbar: {
    brandName: 'Maycoder',
    brandHref: '/#hero',
    items: [
      { id: 'nav-cv', label: 'CV', href: '/cv', kind: 'link' },
      { id: 'nav-work', label: 'Work', href: '/#works', kind: 'link' },
      { id: 'nav-pricing', label: 'Pricing', href: '/#pricing', kind: 'link' },
      { id: 'nav-hire', label: 'Hire Me', href: '/#contact', kind: 'cta' },
    ] as const satisfies Readonly<NavbarItem[]>,
  },

  scrollToTopFab: {
    ariaLabel: 'Back to top of page',
  },

  stats: {
    sectionAriaLabel: 'Impact statistics',
    eyebrow: 'By the numbers',
    sectionQuestion: "Why do clients choose to work with me?",
    /** Dot pagination beneath stat cards (`aria-label` prefix). */
    paginationGoToCardPrefix: 'Show stat card',
    items: [
      { id: 'projects', value: 12, suffix: '+', label: 'Projects Built', icon: 'Layers' },
      { id: 'apis', value: 30, suffix: '+', label: 'APIs & Tools Integrated', icon: 'Plug' },
      { id: 'platforms', value: 3, suffix: '', label: 'Platforms', icon: 'Monitor' },
    ] as const satisfies Readonly<StatItem[]>,
  },

  skillShowcase: {
    sectionAriaLabel: 'Technologies and tools',
  },

  pricing: {
    sectionAriaLabel: 'Pricing',
    eyebrow: 'Pricing',
    title: 'Pay for what you need',
    disclaimer: 'All prices are starting rates. Final quote depends on project scope.',
    ctaLabel: "Have a custom project? Let's talk.",
    ctaHref: '/#contact',
    startingAtLabel: 'Starting at',
    negotiableNote: 'Negotiable based on scope & complexity',
    includedHeading: "What's included",
    popularBadgeLabel: 'Most Popular',
    plans: [
      {
        id: 'web-dev',
        title: 'Website',
        startingPrice: '$149',
        inclusions: [
          'Responsive, pixel-perfect design',
          'Maintainable Code',
          'Supabase database',
          'Authentication & role management',
          'SEO setup + Vercel deployment',
          '2 round of revisions',
        ],
      },
      {
        id: 'automation',
        title: 'Automation & AI',
        startingPrice: '$799',
        isPopular: true,
        inclusions: [
          'n8n workflow',
          'API / webhook integrations',
          'AI pipeline (OpenAI / OpenRouter)',
          'CRM & marketing tool integrations',
          'Full documentation + handoff',
          '2 round of revisions',
        ],
      },
      {
        id: 'mobile-app',
        title: 'Mobile App',
        startingPrice: '$199',
        inclusions: [
          'iOS & Android',
          'Push notifications setup',
          'Supabase auth & database',
          'App store submission assistance',
          'Offline-ready architecture',
          '2 round of revisions',
        ],
      },
    ] as const satisfies Readonly<PricingPlan[]>,
  },

  contact: {
    sectionAriaLabel: 'Contact',
    eyebrow: 'Contact',
    title: 'Get in Touch',
    description: "Have a project in mind? I'd love to hear about it.",
    webhookUrl:
      'https://n8n.maycoder.uk/webhook/e5fe5d21-128b-4fc4-960e-344d1d803108',
    methodsHeading: 'Direct',
    socialHeading: 'Tutorials & social',
    form: {
      nameLabel: 'Name',
      namePlaceholder: 'John Doe',
      emailLabel: 'Email',
      emailPlaceholder: 'johndoe@example.com',
      projectTypeLabel: 'What do you need?',
      messageLabel: 'Message',
      messagePlaceholderDefault: 'Tell me about your project…',
      submitLabel: 'Send Message',
      submittingLabel: 'Sending…',
      modalCloseLabel: 'Continue',
      successTitle: 'Message sent!',
      successMessage: "I'll get back to you as soon as possible.",
      errorTitle: 'Something went wrong',
      errorMessage: 'Please try again or reach me directly by email.',
      validationMessage: 'Please fill in your name, email, pick a project type, and add a message.',
      emailValidationMessage: 'Please enter a valid email address.',
      webhookNotConfiguredMessage: 'This contact channel is not configured yet. Please email me directly.',
      minIntervalSeconds: 60,
      maxSubmissionsPerHour: 5,
      rateLimitedMessage:
        "You're sending messages too quickly. Please wait a moment and try again.",
      rateLimitedRetryMessage: 'Please wait {seconds} seconds before sending another message.',
      projectTypeOptions: [
        {
          id: 'web-dev',
          label: 'Web dev',
          messagePlaceholder:
            'Describe your website — pages, features, timeline, and any design references you have in mind…',
        },
        {
          id: 'mobile-app',
          label: 'Mobile app',
          messagePlaceholder:
            'Tell me about your app idea — platforms (iOS/Android), core features, and who it’s for…',
        },
        {
          id: 'automation',
          label: 'Automation',
          messagePlaceholder:
            'What should be automated? Which tools you use (Shopify, Gmail, CRM, etc.) and the outcome you want…',
        },
      ] as const satisfies Readonly<ContactProjectTypeOption[]>,
    },
    methods: [
      {
        id: 'email',
        label: 'Email',
        value: 'nunez.aianmhyco.bernardino@gmail.com',
        href: 'mailto:nunez.aianmhyco.bernardino@gmail.com',
        platform: 'gmail',
      },
      {
        id: 'linkedin',
        label: 'LinkedIn',
        value: 'Aian Mhyco Nunez',
        href: 'https://www.linkedin.com/in/aian-mhyco-nu%C3%B1ez-16b21a39b/',
        platform: 'linkedin',
      },
    ] as const satisfies Readonly<ContactMethod[]>,
    socials: [
      { id: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61588914774614', platform: 'facebook' },
      {
        id: 'instagram',
        label: 'Instagram',
        href: 'https://www.instagram.com/maycoder.ai.automation/?hl=en',
        platform: 'instagram',
      },
      { id: 'tiktok', label: 'TikTok', href: 'https://www.tiktok.com/@maycoder.ai.automation', platform: 'tiktok' },
      {
        id: 'youtube',
        label: 'YouTube',
        href: 'https://www.youtube.com/@maycoder.ai.automation.n8n',
        platform: 'youtube',
      },
    ] as const satisfies Readonly<SocialLink[]>,
  },

  projectDetailPage: {
    eyebrow: 'Project',
    caseStudyPendingMessage: 'Full case study coming soon.',
    slugFallbackHeading: 'Project',
    backLabel: 'Back to work',
    backHref: '/#works',
    overviewHeading: 'Overview',
    problemHeading: 'The problem',
    solutionHeading: 'The solution',
    resultsHeading: 'Results & impact',
    techStackHeading: 'Tech stack',
    screenshotsHeading: 'Screenshots',
    featuresHeading: 'Key features',
    featureGridHeading: 'Features',
    bentoGridAriaLabel: 'Project overview and case study',
    showcaseProgressAriaLabelPrefix: 'Current screen:',
    showcaseJumpToSlideLabel: 'Go to screenshot',
    showcaseReducedMotionHint: 'All screens are shown below. Scroll-linked animation is reduced when reduced motion is on.',
    visitLiveLabel: 'Live site',
    visitGithubLabel: 'Source code',
    visitAppstoreLabel: 'Download',
    linksHeading: 'Links',
    notFoundHeading: 'Project not found',
    notFoundMessage: 'This project does not exist or the link may be outdated.',
  },

  devicePlaceholder: {
    label: 'Coming Soon',
  },

  works: {
    viewWorkCursorLabel: 'View Work',
    metaProjectTypeLabel: 'Project Type',
    metaDurationLabel: 'Duration',
    devicePreviewAlt: {
      desktop: 'Desktop preview',
      tablet: 'Tablet preview',
      phone: 'Phone preview',
    } as const,
  },

  projectShowcase: {
    sectionAriaLabel: 'Featured project',
    screens: {
      desktop: imgAcademicHubDesktop,
      tablet: imgAcademicHubTablet,
      phone: imgAcademicHubPhone,
    },
  },

  automation: {
    sectionAriaLabel: 'Automation Projects',
    eyebrow: 'Playground',
    title: 'Automation & AI Projects',
    description:
      'n8n workflows, AI agents on Telegram, and integrations across Gmail, Calendar, spreadsheets, databases, and more.',
    categoryFilterAriaLabel: 'Filter by category',
    emptyCategoryMessage: 'No projects in this category.',
    carouselViewportHeightPx: 340,
    viewWorkCursorLabel: 'View Work',
    categoryFilters: [
      { id: 'all', label: 'All' },
      { id: 'ai', label: 'AI' },
      { id: 'automation', label: 'Automation' },
      { id: 'cron', label: 'Cron' },
    ] as const satisfies Readonly<AutomationCategoryFilter[]>,
    carouselAria: {
      previous: 'Previous',
      next: 'Next',
      goToCardPrefix: 'Go to card',
    },
  },

  automationModal: {
    fallbackTitle: 'Project',
    eyebrow: 'Automation workflow',
    techStackHeading: 'Tech stack',
    databaseHeading: 'Data storage',
    openLinkLabelWeb: 'Open live site',
    openLinkLabelMobile: 'Open app link',
    imageAltFallback: 'Workflow screenshot',
    previousImage: 'Previous image',
    nextImage: 'Next image',
  },

  skillGroups: [
    {
      name: 'AI Automation',
      items: [
        'n8n',
        'OpenAI',
        'OpenRouter',
        'ElevenLabs',
        'MCP',
        'Webhooks',
        'Telegram',
        'Go High Level',
      ],
    },
    {
      name: 'Web Development',
      items: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Vercel', 'Git', 'Python'],
    },
    {
      name: 'Mobile Apps',
      items: ['React Native', 'Expo', 'TypeScript', 'ExpoSQL'],
    },
    {
      name: 'Backend & Data',
      items: ['Supabase', 'PostgreSQL', 'Airtable', 'Pinecone', 'Google Cloud Vision'],
    },
  ] as const,

  skillsNote: 'Open to integrating any other API or service your project needs.',

  cv: {
    pageTitle: 'Aian Mhyco B. Nunez',
    subtitle: 'AI Automation Specialist · n8n · Agentic AI Systems',
    professionalSummary:
      'AI Automation Specialist and Computer Science student with hands-on experience building production-grade n8n workflows, multi-agent AI systems, and API integrations from scratch. Proficient in integrating Claude, OpenAI, and Gemini into real automation pipelines — including a Telegram-based multi-agent system with persistent PostgreSQL memory and a fully automated meeting-to-task workflow. Capable of delivering end-to-end automations independently, often within a single day. Actively seeking remote opportunities where I can design and build intelligent automation systems that eliminate manual work.',
    contact: {
      email: 'nunez.aianmhyco.bernardino@gmail.com',
      phone: '+63 950 159 3599',
      location: 'Caloocan City, Philippines',
      linkedin: {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/aian-mhyco-nu%C3%B1ez-16b21a39b/',
      },
      github: {
        label: 'GitHub',
        href: 'https://github.com/maycodersz',
      },
      portfolio: {
        label: 'maycoder.vercel.app',
        href: 'https://maycoder.vercel.app',
      },
    },
    skills: [
      {
        category: 'Automation & Integration',
        items: ['n8n', 'Multi-agent orchestration', 'Webhook triggers', 'Sub-agents', 'API nodes', 'REST APIs', 'Webhooks'],
      },
      {
        category: 'AI / LLM Integration',
        items: ['Claude API', 'OpenAI API', 'OpenRouter', 'Google Gemini', 'Ollama', 'Prompt engineering'],
      },
      {
        category: 'Programming',
        items: ['Python', 'JavaScript', 'TypeScript', 'Java', 'C', 'React', 'HTML', 'CSS', 'Tailwind CSS'],
      },
      {
        category: 'Databases',
        items: ['PostgreSQL', 'Supabase', 'MySQL'],
      },
      {
        category: 'Tools & Platforms',
        items: ['Google Workspace', 'Gmail API', 'Calendar API', 'Sheets', 'Drive', 'Slack', 'Monday.com', 'Notion', 'Telegram', 'Git'],
      },
    ],
    projects: [
      {
        id: 'cv-jarvis',
        title: 'Jarvis AI Agent — Multi-Agent Automation System',
        year: '2025',
        techStack: 'n8n, Claude API, OpenAI, Telegram, PostgreSQL, Google Workspace, ElevenLabs',
        bullets: [
          'Architected a multi-agent AI system on Telegram using n8n, orchestrating specialized sub-agents for Gmail (read, draft, send, summarize) and Google Calendar (create, update, delete events) via natural language commands.',
          'Integrated Claude API for intelligent task routing, PostgreSQL for persistent conversation memory, Google Sheets for contact lookup, and ElevenLabs for voice responses — built entirely from scratch.',
        ],
        portfolioHref: '/#automation',
      },
      {
        id: 'cv-meeting',
        title: 'Meeting Automation — Google Meet → Slack & Monday.com',
        year: '2025',
        techStack: 'n8n, OpenAI API, Google Drive, Slack API, Monday.com',
        bullets: [
          'Built a dual-pipeline n8n automation that processes Google Meet recordings automatically: one pipeline generates AI meeting summaries posted to Slack; the other extracts action items and creates Monday.com tasks — zero manual effort.',
        ],
        portfolioHref: '/#automation',
      },
      {
        id: 'cv-bots',
        title: 'Sales Tracker & Receipt Processor Bots',
        year: '2025',
        techStack: 'n8n, Telegram Bot API, OpenAI Vision, Google Sheets API, Google Drive API',
        bullets: [
          'Developed two production Telegram bots: one uses AI image recognition to digitize handwritten sales records and generate financial reports with CSV export; the other auto-extracts receipt data via AI vision and logs to Google Sheets and Drive.',
        ],
        portfolioHref: '/#automation',
      },
      {
        id: 'cv-academic-hub',
        title: 'OLFU Academic Hub',
        year: '2024',
        techStack: 'React, TypeScript, Supabase, PostgreSQL, Google OAuth',
        bullets: [
          'Built a full-stack academic platform from scratch with XP gamification, leaderboards, program rooms, and Google Sign-In restricted to school email domains.',
        ],
        portfolioHref: '/work/academic-hub',
      },
    ],
    certifications: [
      {
        title: 'Advanced Learning Algorithms',
        issuer: 'DeepLearning.AI & Stanford University (Coursera)',
        date: 'Apr 2026',
      },
      {
        title: 'Supervised Machine Learning: Regression & Classification',
        issuer: 'DeepLearning.AI & Stanford (Coursera)',
        date: 'Mar 2026',
      },
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'Our Lady of Fatima University',
        period: '2024 – 2028',
        details: 'GWA: 1.24 | Dean\'s List (2nd Year, 1st Semester)',
      },
      {
        degree: 'Senior High School — STEM Strand',
        institution: 'Our Lady of Fatima University',
        period: 'Graduated 2024',
      },
    ],
    awards: [
      {
        title: 'Champion — Python Programming Competition',
        event: 'CCS Week, OLFU',
        date: '2025',
      },
      {
        title: '2nd Place — ADET Arduino Competition',
        event: 'CCS Week, OLFU',
        date: '2025',
      },
    ],
    experiencePlaceholder:
      'Currently a student actively building real-world projects and seeking remote opportunities. Open to freelance, internship, or contract roles in AI automation and full-stack development.',
    downloadLabel: 'Download CV',
    downloadHref: '/Aian_Mhyco_Nunez_CV.pdf',
    backLabel: 'Back to portfolio',
    backHref: '/',
    sectionLabels: {
      summary: 'Professional Summary',
      experience: 'Experience',
      skills: 'Technical Skills',
      projects: 'Projects',
      education: 'Education',
      certifications: 'Certifications',
      awards: 'Awards',
    },
  } satisfies CvContent,

  projects: [
    {
      id: 'academic-hub',
      title: 'OLFU Academic Hub',
      kind: 'website',
      description:
        'A collaborative academic resource platform for Our Lady of Fatima University students. It combines moderated study uploads with XP, leaderboards, profiles, bookmarks, program rooms, and Google Sign-In limited to school email domains. Feature-complete and ready for rollout — currently in final polish before public release.',
      projectType: 'EdTech, Web App',
      duration: '6 months · Pre-launch',
      highlight: 'Feature-complete — polishing UX before public launch',
      screens: {
        desktop: imgAcademicHubDesktop,
        tablet: imgAcademicHubTablet,
        phone: imgAcademicHubPhone,
      },
      heroImage: imgAcademicHubDesktop,
      links: [
        { label: 'Private preview', href: 'https://academy-hub-olfu.vercel.app', variant: 'live' },
      ],
      techStack: [
        {
          heading: 'Framework',
          items: ['Next.js', 'React', 'TypeScript'],
        },
        {
          heading: 'Styling & UI',
          items: ['Tailwind CSS', 'shadcn', 'Lucide'],
        },
        {
          heading: 'Data & auth',
          items: ['Supabase', 'PostgreSQL', 'TanStack React Query'],
        },
        {
          heading: 'Quality & delivery',
          items: ['Zod', 'react-pdf', 'Resend', 'next-themes'],
        },
        {
          heading: 'DevOps',
          items: ['Vercel', 'Git'],
        },
      ],
      bentoFeatureQuadrant: [
        {
          title: 'Upload',
          description:
            'Submit study files with rich metadata (course, category, program, year, semester, and more). Daily upload limits and a moderation path keep new items pending until staff approve.',
        },
        {
          title: 'Search',
          description:
            'Browse the library of approved materials with keyword search, filters (program, year, semester, category), sorts, and pagination—plus server-side search analytics and a realtime refresh helper in the UI.',
        },
        {
          title: 'Leaderboard',
          description:
            'All-time rankings (top ~100), a weekly snapshot tab, and a followings-only view so recognition stays visible without overwhelming the feed.',
        },
        {
          title: 'Chatroom',
          description:
            'Program-scoped room directory (plus global rooms), threaded messaging with pinned posts, chat media uploads, and announcement-style rooms with admin-managed writer lists.',
        },
        {
          title: 'Moderation',
          description:
            'Staff queue for pending uploads and file versions, content and abuse report pipelines, and user sanctions (upload bans, chat restrictions, roles, and program assignment).',
        },
        {
          title: 'Request',
          description:
            'Students post material requests; peers fulfill them; cancellations and staff approval of fulfillments are tracked, with XP rewards for helpers.',
        },
      ],
      caseStudy: {
        overview:
          'OLFU Academic Hub is an internal-facing platform aimed at consolidating study materials and community tooling for Fatima University students. The goal was to replace scattered chats and folders with something structured, moderated, and easy to onboard new cohorts. The build is complete but not yet publicly released.',
        problem:
          'Study resources lived across group chats and ad-hoc links, which made discovery hard—especially during exam season. Volunteers could not reliably moderate uploads, duplicate files were common, and there was no clear progress loop to reward consistent contributors.',
        solution:
          'We introduced a moderated upload pipeline with material categories and reporting, bookmarks and file-request flows tied to moderation queues, XP and leaderboards to encourage uploads, rooms for focused discussion, and Google Sign-In limited to validated school domains.',
        results:
          'All core flows are built and tested internally — upload, search, moderation, XP, leaderboards, chatrooms, and file requests. The current focus is a final pass on onboarding copy, performance, and the launch checklist before opening to students.',
        resultMetrics: [
          { value: '6', label: 'Core modules' },
          { value: '100%', label: 'Feature-complete' },
          { value: 'Pre-launch', label: 'Status' },
        ],
      },
      pageImages: [
        { src: imgAhCaseStudy01, title: 'Landing Page' },
        { src: imgAhCaseStudy02, title: 'Dashboard' },
        { src: imgAhCaseStudy03, title: 'Search' },
        { src: imgAhCaseStudy04, title: 'File View' },
        { src: imgAhCaseStudy05, title: 'Version Control' },
      ],
    },
    {
      id: 'admino-mobile',
      title: 'Admino — Life Admin App',
      kind: 'mobile',
      description:
        'A local-first mobile app for personal life admin — bills, renewals, subscriptions, medical tasks, IDs, and more. Capture tasks with categories and action types, attach photos or PDFs as proof, set due dates with local reminders, and browse everything from Inbox, Timeline, and Vault views. Data stays fully on-device.',
      projectType: 'Utility App, Mobile App',
      duration: 'Ongoing',
      highlight: '',
      screensUsePlaceholder: true,
      screens: {
        tablet: '',
        phone: '',
      },
      links: [],
      techStack: [
        {
          heading: 'Mobile',
          items: ['React Native', 'Expo', 'TypeScript'],
        },
        {
          heading: 'Local Database',
          items: ['Expo SQLite'],
        },
        {
          heading: 'Cloud Database',
          items: ['Supabase', 'PostgreSQL'],
        },
      ],
      caseStudy: {
        overview:
          'Admino is designed for busy people juggling renewals and paperwork: everything from passports to subscriptions. The premise is capturing tasks quickly—often with attachments—without sending personal data through a third-party dashboard.',
        problem:
          'Calendar apps blur personal and work items, spreadsheets go stale quickly, and many “finance” trackers over-index on syncing which users do not want for sensitive proofs. Existing tools rarely model proof attachments and escalation paths cleanly.',
        solution:
          'We built inbox, timeline, and vault views anchored on SQLite with files stored on-device, plus categories and reminders for due dates that stay local-only. Screens reduce cognitive load—one capture flow, deterministic sorting, predictable exports when the user chooses to share.',
        results:
          'Pilot feedback highlighted faster capture time vs. spreadsheets and clearer confidence that sensitive PDFs stayed off the cloud unless explicitly exported.',
      },
      features: [
        { title: 'Local-first storage', description: 'SQLite and on-device files keep proofs and reminders under your control by default.' },
        { title: 'Smart reminders', description: 'Due dates funnel into familiar OS reminder surfaces without shipping data upstream.' },
        { title: 'Vault view', description: 'Dedicated surface for IDs and sensitive documents with quick scan-in and attachment links.' },
        { title: 'Photo & PDF capture', description: 'Capture proof in-line with tasks so evidence stays next to the commitment.' },
        { title: 'Timeline view', description: 'Chronological scan of what is due and what changed so nothing slips between apps.' },
      ],
    },
  ] satisfies Readonly<Project[]>,

  automationProjects: [
    {
      id: 'automation-jarvis',
      title: 'Jarvis AI Agent',
      categories: ['ai', 'automation'],
      description:
        'A personal AI assistant on Telegram that gets the contact details from Google Sheets and delegates tasks to specialized sub-agents, and searches the web for information. The Email Agent handles all Gmail operations, while the Calendar Agent manages Google Calendar events — all orchestrated through n8n with PostgreSQL for persistent memory.',
      tags: ['n8n', 'Telegram', 'Gmail', 'Google Calendar', 'Tavily'],
      image: imgAutomationJarvis,
      databases: ['PostgreSQL', 'Google Sheets'],
      link: null,
    },
    {
      id: 'automation-receipt-bot',
      title: 'Receipt Processor Bot',
      categories: ['ai', 'automation'],
      description:
        'A complete AI-powered receipt and expense management system. Users submit receipt photos through Telegram, where AI extracts merchant information, purchased items, quantities, totals, and expense data automatically. The workflow stores structured records in Google Sheets, archives receipt images in Google Drive, and generates automated daily, weekly, and monthly spending reports.',
      tags: ['n8n', 'Telegram', 'OpenAI'],
      image: imgAutomationReceipt,
      galleryImages: [imgAutomationReceiptDaily, imgAutomationReceiptWeekly, imgAutomationReceiptMonthly],
      databases: ['Google Sheets', 'Google Drive'],
      link: null,
    },
    {
      id: 'automation-sales-tracker',
      title: 'Sales Tracker Bot',
      categories: ['ai', 'automation'],
      description:
        'A feature-rich Telegram bot for small business management. Log sales and expenses instantly, scan handwritten records with AI image recognition, and pull daily, weekly, monthly, or custom-range financial reports. Includes void/undo support and CSV export.',
      tags: ['n8n', 'Telegram', 'OpenAI', 'Google Sheets'],
      image: imgAutomationSales,
      databases: ['PostgreSQL', 'Google Sheets'],
      link: null,
    },
    {
      id: 'automation-email-agent',
      title: 'Email Agent',
      categories: ['ai', 'automation'],
      description:
        'An AI-powered n8n automation that handles all Gmail tasks — reading, summarizing, drafting, and organizing emails on command. Uses PostgreSQL for conversation memory and Google Sheets as a lightweight log, triggered via webhook.',
      tags: ['n8n', 'Gmail', 'OpenAI'],
      image: imgAutomationEmail,
      databases: ['PostgreSQL', 'Google Sheets'],
      link: null,
    },
    {
      id: 'automation-calendar-agent',
      title: 'Calendar Agent',
      categories: ['automation'],
      description:
        'A dedicated n8n automation agent for Google Calendar management — create, update, query, and delete events on behalf of the user through natural language. Pairs with the Jarvis AI Agent as a specialized sub-agent for scheduling tasks.',
      tags: ['n8n', 'Google Calendar'],
      image: imgAutomationCalendar,
      databases: ['PostgreSQL', 'Google Sheets'],
      link: null,
    },
    {
      id: 'automation-email-watcher',
      title: 'Email Watcher',
      categories: ['ai', 'automation', 'cron'],
      description:
        'Watches Gmail every minute—labels mail, classifies with OpenRouter, logs to Sheets, and pings Telegram on high priority. Includes a 7 AM digest and scheduled spam cleanup.',
      tags: ['n8n', 'Gmail', 'Telegram', 'OpenRouter'],
      image: imgAutomationEmailWatcher,
      galleryImages: [imgAutomationEmailWatcherDigest, imgAutomationEmailWatcherSpam],
      databases: ['Google Sheets'],
      link: null,
    },
    {
      id: 'automation-lead-qualifier',
      title: 'Contact Lead Qualifier',
      categories: ['ai', 'automation'],
      description:
        'Hooks into this portfolio’s contact form: classifies each inquiry as hot, warm, or cold, enriches business emails via Apify, and drafts a reply grounded in your Supabase project library by service type (web, automation, or mobile). Hot and warm leads get a Gmail follow-up plus a Telegram ping; cold leads are logged to Sheets only.',
      tags: ['n8n', 'OpenRouter', 'Gmail', 'Telegram', 'Supabase', 'Apify'],
      image: imgAutomationLeadQualifier,
      databases: ['Google Sheets', 'Supabase'],
      link: null,
    },
    {
      id: 'automation-meeting',
      title: 'Meeting Summarizer & Task Extractor',
      categories: ['ai', 'automation'],
      description:
        'An n8n AI workflow built as a client demo — automatically transcribes and summarizes team meetings, then posts the summary with the meeting date directly to a Slack channel. It also extracts every action item and to-do from the discussion and pushes them as tasks into Monday.com, so the team immediately sees their pending work without any manual note-taking.',
      tags: ['n8n', 'OpenRouter', 'Slack', 'Monday.com'],
      image: imgAutomationMeeting,
      databases: ['Monday.com'],
      link: null,
    },
  ] satisfies readonly AutomationProject[],
} as const

export type Portfolio = typeof portfolio
