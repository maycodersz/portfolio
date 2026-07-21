import type { LucideIcon } from 'lucide-react'
import {
  Bell,
  BellRing,
  Box,
  Boxes,
  CalendarCheck,
  Cloud,
  ContactRound,
  Container,
  Database,
  FileCode2,
  FileText,
  FileType2,
  GitBranch,
  GitFork,
  Globe,
  HardDrive,
  ImagePlus,
  KeyRound,
  Layers,
  LayoutTemplate,
  ListChecks,
  Mail,
  MapPinned,
  Package,
  Palette,
  PanelsTopLeft,
  Route,
  Server,
  Shield,
  ScanText,
  Smartphone,
  Sparkles,
  Terminal,
  Timer,
  Triangle,
  Webhook,
  Wind,
  Workflow,
  Zap,
} from 'lucide-react'

/**
 * Lucide fallbacks only when Simple Icons CDN has no slug (see `skillLogos.ts`).
 * Prefer adding slugs there for real brand glyphs on project/skills surfaces.
 */
const LABEL_ICON: Record<string, LucideIcon> = {
  Webhooks: Webhook,
  'Local file attachments': HardDrive,
  'Reminders APIs': Bell,
  'Local-first UX': Smartphone,
  'PDF & image capture': ImagePlus,
  shadcn: LayoutTemplate,
  Lucide: Sparkles,
  'TanStack React Query': Zap,
  Zod: Shield,
  'react-pdf': FileText,
  Resend: Mail,
  'next-themes': Palette,
  'Google Maps': MapPinned,
}

function iconByExactOrCaseInsensitive(label: string): LucideIcon | undefined {
  const trimmed = label.trim()
  if (LABEL_ICON[trimmed]) return LABEL_ICON[trimmed]
  const lower = trimmed.toLowerCase()
  for (const [key, Icon] of Object.entries(LABEL_ICON)) {
    if (key.toLowerCase() === lower) return Icon
  }
  return undefined
}

function iconByPattern(lower: string): LucideIcon {
  if (lower.includes('react native')) return Smartphone
  if (lower.includes('sqlite') || lower.includes('postgres') || lower.includes('supabase')) return Database
  if (
    lower.includes('react router') ||
    lower.includes('expo router') ||
    (lower.includes('router') && lower.includes('react'))
  ) {
    return Route
  }
  if (lower.includes('expo')) return Box
  if (lower.includes('oauth') || lower.includes('jwt') || lower.includes('sign-in') || lower.includes('auth')) {
    return KeyRound
  }
  if (lower.includes('tailwind')) return Wind
  if (lower.includes('typescript') || lower === 'ts' || lower.endsWith(' ts')) return FileType2
  if (lower.includes('react-pdf')) return FileText
  if (lower.includes('react')) return LayoutTemplate
  if (lower.includes('github')) return GitBranch
  if (lower.includes('vercel') || lower.includes('deploy')) return Triangle
  if (lower.includes('firebase') || lower.includes('fcm') || lower.includes('push')) return BellRing
  if (
    lower.includes('row level security') ||
    lower.includes('permissions policy') ||
    lower.includes(' rls ')
  ) {
    return Shield
  }
  if (lower.includes('edge function') || lower.includes('lambda') || lower.includes('worker')) return Zap
  if (lower.includes('reminder') || lower.includes('calendar')) return Timer
  if (lower.includes('pdf') || lower.includes('image capture') || lower.includes('photo')) return ImagePlus
  if (lower.includes('file') || lower.includes('attachment') || lower.includes('vault')) return HardDrive
  if (lower.includes('local-first') || lower.includes('on-device')) return Smartphone
  if (lower.includes('n8n') || lower.includes('workflow')) return Workflow
  if (lower === 'crm') return ContactRound
  if (lower.includes('pipeline')) return GitFork
  if (lower.includes('form')) return PanelsTopLeft
  if (lower.includes('task')) return ListChecks
  if (lower.includes('custom object')) return Boxes
  if (lower.includes('ai extraction')) return ScanText
  if (lower.includes('monthly close')) return CalendarCheck
  if (lower.includes('tanstack') || lower.includes('react query')) return Zap
  if (lower.includes('zod')) return Shield
  if (lower.includes('shadcn')) return LayoutTemplate
  if (lower.includes('lucide')) return Sparkles
  if (lower.includes('next-themes') || lower.includes('themes')) return Palette
  if (lower.includes('openai') || lower.includes('gpt') || lower.includes('llm')) return Sparkles
  if (lower.includes('python')) return Terminal
  if (lower.includes('node')) return FileCode2
  if (lower.includes('mail') || lower.includes('gmail') || lower.includes('resend')) return Mail
  if (lower.includes('docker') || lower.includes('container')) return Container
  if (lower.includes('npm') || lower.includes('pnpm') || lower.includes('package')) return Package
  if (lower.includes('markdown') || lower.includes('doc')) return FileText
  if (lower.includes('api') || lower.includes('backend') || lower.includes('server')) return Server
  if (lower.includes('cloud') || lower.includes('saas')) return Cloud
  if (lower.includes('tailwind') === false && lower.includes('css')) return Palette
  if (lower.includes('next')) return Globe
  return Layers
}

export function projectTechIcon(label: string): LucideIcon {
  return iconByExactOrCaseInsensitive(label) ?? iconByPattern(label.trim().toLowerCase())
}
