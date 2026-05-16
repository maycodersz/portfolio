import type { LucideIcon } from 'lucide-react'
import {
  Bell,
  BellRing,
  Box,
  Cloud,
  Container,
  Database,
  FileCode2,
  FileText,
  FileType2,
  GitBranch,
  Globe,
  HardDrive,
  ImagePlus,
  KeyRound,
  Layers,
  LayoutTemplate,
  Mail,
  Package,
  Palette,
  Route,
  Server,
  Shield,
  Smartphone,
  Sparkles,
  Terminal,
  Timer,
  Triangle,
  Wind,
  Workflow,
  Zap,
} from 'lucide-react'

/**
 * Exact labels from `portfolio.projects[].techStack[].items` (and common aliases).
 * Add a row here whenever you add a new skill string so the icon stays predictable.
 */
const LABEL_ICON: Record<string, LucideIcon> = {
  // Academic Hub — Frontend
  React: LayoutTemplate,
  TypeScript: FileType2,
  'Tailwind CSS': Wind,
  'React Router': Route,
  // Academic Hub — Backend
  Supabase: Database,
  'Edge Functions': Zap,
  'PostgreSQL Row Level Security': Shield,
  // Academic Hub — Auth
  'Google OAuth': KeyRound,
  'Firebase Cloud Messaging': BellRing,
  // Academic Hub — DevOps
  Vercel: Triangle,
  'GitHub Actions': GitBranch,
  // Admino — Mobile
  'React Native': Smartphone,
  Expo: Box,
  'Expo Router': Route,
  // Admino — Data
  'Expo SQLite': Database,
  'Local file attachments': HardDrive,
  'Reminders APIs': Bell,
  // Admino — Experience
  'Local-first UX': Smartphone,
  'PDF & image capture': ImagePlus,
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

/** Fallback heuristics for labels not yet listed in `LABEL_ICON`. */
function iconByPattern(lower: string): LucideIcon {
  if (lower.includes('react native')) return Smartphone
  if (lower.includes('sqlite') || lower.includes('postgres') || lower.includes('supabase')) return Database
  if (lower.includes('expo router') || lower.includes('router')) return Route
  if (lower.includes('expo')) return Box
  if (lower.includes('oauth') || lower.includes('jwt') || lower.includes('sign-in') || lower.includes('auth')) {
    return KeyRound
  }
  if (lower.includes('tailwind')) return Wind
  if (lower.includes('typescript') || lower === 'ts' || lower.endsWith(' ts')) return FileType2
  if (lower.includes('react')) return LayoutTemplate
  if (lower.includes('github')) return GitBranch
  if (lower.includes('vercel') || lower.includes('deploy')) return Triangle
  if (lower.includes('firebase') || lower.includes('fcm') || lower.includes('push')) return BellRing
  if (lower.includes('edge function') || lower.includes('lambda') || lower.includes('worker')) return Zap
  if (lower.includes('reminder') || lower.includes('calendar')) return Timer
  if (lower.includes('pdf') || lower.includes('image capture') || lower.includes('photo')) return ImagePlus
  if (lower.includes('file') || lower.includes('attachment') || lower.includes('vault')) return HardDrive
  if (lower.includes('local-first') || lower.includes('on-device')) return Smartphone
  if (lower.includes('n8n') || lower.includes('workflow')) return Workflow
  if (lower.includes('openai') || lower.includes('gpt') || lower.includes('llm')) return Sparkles
  if (lower.includes('python')) return Terminal
  if (lower.includes('node')) return FileCode2
  if (lower.includes('mail') || lower.includes('gmail')) return Mail
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
