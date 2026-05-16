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
  tablet?: string
  phone?: string
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
}

/* ─── Automation project types ───────────────────────────────────────────── */

export type AutomationCategory = 'all' | 'ai' | 'automation' | 'crm' | 'marketing' | 'analytics'

export type AutomationProject = {
  id: string
  title: string
  category: Exclude<AutomationCategory, 'all'>
  description: string
  tags: string[]
  image?: string
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

/* ─── Stats types ────────────────────────────────────────────────────────── */

export type StatItem = {
  id: string
  value: number
  suffix: string
  label: string
  icon: string
}

/* ─── Content ────────────────────────────────────────────────────────────── */

export const portfolio = {
  hero: {
    headlineBefore: "Let's build your",
    rotatingTitles: ['Website', 'Mobile App', 'Automation'] as const,
    description:
      'I ship full products: web dashboards, mobile apps, and bots that tie tools, data, and AI into one pipeline',
    profileAlt: 'Photo of Maycoder',
    alterEgoAlt: 'Maycoder alter ego',
    ctas: [
      { id: 'hero-view-work', label: 'View Work ->', href: '/#works', tone: 'main' },
      { id: 'hero-get-in-touch', label: 'Get in Touch', href: '/#contact', tone: 'secondary' },
    ] as const satisfies Readonly<HeroCta[]>,
  },

  navbar: {
    brandName: 'Maycoder',
    brandHref: '/',
    items: [
      { id: 'nav-cv', label: 'CV', href: '/#cv', kind: 'link' },
      { id: 'nav-work', label: 'Work', href: '/#works', kind: 'link' },
      { id: 'nav-pricing', label: 'Pricing', href: '/#pricing', kind: 'link' },
      { id: 'nav-hire', label: 'Hire Me', href: '/#contact', kind: 'cta' },
    ] as const satisfies Readonly<NavbarItem[]>,
  },

  stats: {
    sectionAriaLabel: 'Impact statistics',
    eyebrow: 'By the numbers',
    sectionQuestion: "Why do clients choose to work with me?",
    /** Dot pagination beneath stat cards (`aria-label` prefix). */
    paginationGoToCardPrefix: 'Show stat card',
    items: [
      { id: 'projects',  value: 12, suffix: '+', label: 'Projects Built',          icon: 'Layers'   },
      { id: 'apis',      value: 30, suffix: '+', label: 'APIs & Tools Integrated', icon: 'Plug'     },
      { id: 'platforms', value: 8,  suffix: '',  label: 'Platforms',               icon: 'Monitor'  },
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
        startingPrice: '$350',
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
        id: 'mobile-app',
        title: 'Mobile App',
        startingPrice: '$500',
        isPopular: true,
        inclusions: [
          'iOS & Android',
          'Push notifications setup',
          'Supabase auth & database',
          'App store submission assistance',
          'Offline-ready architecture',
          '2 round of revisions',
        ],
      },
      {
        id: 'automation',
        title: 'Automation & AI',
        startingPrice: '$1500',
        inclusions: [
          'n8n workflow',
          'API / webhook integrations',
          'AI pipeline (OpenAI / OpenRouter)',
          'CRM & marketing tool integrations',
          'Full documentation + handoff',
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
    webhookUrl: 'https://your-n8n-webhook-url-here',
    methodsHeading: 'Direct',
    socialHeading: 'Tutorials & social',
    form: {
      nameLabel: 'Name',
      namePlaceholder: 'John Doe',
      emailLabel: 'Email',
      emailPlaceholder: 'johndoe@example.com',
      projectTypeLabel: 'What do you need?',
      messageLabel: 'Message',
      messagePlaceholder: 'Tell me about your project…',
      submitLabel: 'Send Message',
      submittingLabel: 'Sending…',
      modalCloseLabel: 'Continue',
      successTitle: 'Message sent!',
      successMessage: "I'll get back to you as soon as possible.",
      errorTitle: 'Something went wrong',
      errorMessage: 'Please try again or reach me directly by email.',
      validationMessage: 'Please fill in your name, email, pick a project type, and add a message.',
      projectTypeOptions: [
        { id: 'web-dev', label: 'Web dev' },
        { id: 'mobile-app', label: 'Mobile app' },
        { id: 'automation', label: 'Automation' },
      ] as const satisfies Readonly<ContactProjectTypeOption[]>,
    },
    methods: [
      {
        id: 'email',
        label: 'Email',
        value: 'your@gmail.com',
        href: 'mailto:your@gmail.com',
        platform: 'gmail',
      },
      {
        id: 'linkedin',
        label: 'LinkedIn',
        value: '/in/yourhandle',
        href: 'https://linkedin.com/in/yourhandle',
        platform: 'linkedin',
      },
    ] as const satisfies Readonly<ContactMethod[]>,
    socials: [
      { id: 'facebook', label: 'Facebook', href: 'https://facebook.com/yourpage', platform: 'facebook' },
      { id: 'instagram', label: 'Instagram', href: 'https://instagram.com/yourhandle', platform: 'instagram' },
      { id: 'tiktok', label: 'TikTok', href: 'https://tiktok.com/@yourhandle', platform: 'tiktok' },
      { id: 'youtube', label: 'YouTube', href: 'https://youtube.com/@yourchannel', platform: 'youtube' },
    ] as const satisfies Readonly<SocialLink[]>,
  },

  projectDetailPage: {
    eyebrow: 'Project',
    caseStudyPendingMessage: 'Full case study coming soon.',
    slugFallbackHeading: 'Project',
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
  },

  automation: {
    sectionAriaLabel: 'Automation Projects',
    eyebrow: 'Playground',
    title: 'Automation & AI Projects',
    description:
      'A curated archive of automation workflows, AI pipelines, CRM integrations, and marketing tools built across client engagements.',
    categoryFilterAriaLabel: 'Filter by category',
    emptyCategoryMessage: 'No projects in this category.',
    carouselViewportHeightPx: 340,
    viewWorkCursorLabel: 'View Work',
    categoryFilters: [
      { id: 'all', label: 'All' },
      { id: 'ai', label: 'AI' },
      { id: 'automation', label: 'Automation' },
      { id: 'crm', label: 'CRM' },
      { id: 'marketing', label: 'Marketing' },
      { id: 'analytics', label: 'Analytics' },
    ] as const satisfies Readonly<AutomationCategoryFilter[]>,
    carouselAria: {
      previous: 'Previous',
      next: 'Next',
      goToCardPrefix: 'Go to card',
    },
  },

  automationModal: {
    fallbackTitle: 'Project',
    eyebrow: 'Case Study',
    pendingBody: 'Full details coming soon.',
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

  projects: [
    {
      id: 'academic-hub',
      title: 'Academic Hub',
      kind: 'website',
      description:
        'A student-built resource hub for Our Lady of Fatima University — reviewers, notes, leaderboards, and study rooms in one platform.',
      projectType: 'EdTech, Web App',
      duration: '6 Months',
      highlight: '200+ students onboarded in the first month',
      screens: {
        desktop: undefined,
        tablet: undefined,
        phone: undefined,
      },
    },
    {
      id: 'admino-mobile',
      title: 'Admino',
      kind: 'mobile',
      description: 'Description here.',
      projectType: 'Utility App, Mobile App',
      duration: '1 Month',
      highlight: 'Highlight here.',
      screens: {
        tablet: undefined,
        phone: undefined,
      },
    },
  ] as const satisfies Readonly<Project[]>,

  automationProjects: [
    {
      id: 'ai-assistant',
      title: 'AI Jarvis 1',
      category: 'ai',
      description: 'Description here.',
      tags: ['OpenAI', 'n8n', 'PostgreSQL', 'Telegram', 'Supabase'],
    },
    {
      id: 'ai-assistant',
      title: 'AI Jarvis 2',
      category: 'ai',
      description: 'Description here.',
      tags: ['OpenAI', 'n8n', 'PostgreSQL', 'Telegram', 'Supabase'],
    },
    {
      id: 'ai-assistant',
      title: 'AI Jarvis 3',
      category: 'ai',
      description: 'Description here.',
      tags: ['OpenAI', 'n8n', 'PostgreSQL', 'Telegram', 'Supabase'],
    },
  ] as const satisfies Readonly<AutomationProject[]>,
} as const

export type Portfolio = typeof portfolio
