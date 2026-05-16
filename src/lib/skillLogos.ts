/**
 * Simple Icons CDN: https://cdn.simpleicons.org/{slug}/000000
 * Slugs match https://simpleicons.org (lowercase hyphenation).
 */

/** Canonical labels keyed exactly as stored in portfolio (chip text). */
export const SKILL_SIMPLE_ICON_SLUG: Partial<Record<string, string>> = {
  HTML: 'html5',
  CSS: 'css3',
  JavaScript: 'javascript',
  TypeScript: 'typescript',
  React: 'react',
  'Next.js': 'nextdotjs',
  'Tailwind CSS': 'tailwindcss',
  'React Router': 'reactrouter',
  'React Native': 'reactnative',
  Expo: 'expo',
  'Expo Router': 'expo',
  'Expo SQLite': 'sqlite',
  ExpoSQL: 'sqlite',
  n8n: 'n8n',
  OpenAI: 'openai',
  OpenRouter: 'openrouter',
  ElevenLabs: 'elevenlabs',
  'Google Cloud Vision': 'googlecloud',
  Supabase: 'supabase',
  PostgreSQL: 'postgresql',
  Airtable: 'airtable',
  Pinecone: 'pinecone',
  Python: 'python',
  Java: 'java',
  C: 'c',
  Telegram: 'telegram',
  Messenger: 'messenger',
  Gmail: 'gmail',
  'Google Sheets': 'googlesheets',
  'Google Calendar': 'googlecalendar',
  'Google Drive': 'googledrive',
  'Google OAuth': 'google',
  Vercel: 'vercel',
  Git: 'git',
  'GitHub Actions': 'githubactions',
  'Firebase Cloud Messaging': 'firebase',
  MCP: 'modelcontextprotocol',
  /** Portfolio chip labels — slugs match Simple Icons */
  shadcn: 'shadcnui',
  Lucide: 'lucide',
  'TanStack React Query': 'reactquery',
  Zod: 'zod',
  Resend: 'resend',
}

/**
 * Extra lowercase phrases → slug (legacy copy, long labels, or alternate wording).
 * Prefer adding a canonical row to `SKILL_SIMPLE_ICON_SLUG` when the chip label is stable.
 */
const SKILL_ICON_SLUG_ALIASES: Record<string, string> = {
  'postgresql row level security': 'postgresql',
  'edge functions': 'supabase',
  'google sign-in': 'google',
  oauth: 'google',
  'tanstack react query': 'reactquery',
}

function slugFromCatalog(trimmed: string): string | undefined {
  const cat = SKILL_SIMPLE_ICON_SLUG as Record<string, string | undefined>
  const direct = cat[trimmed]
  if (direct) return direct
  const lower = trimmed.toLowerCase()
  const alias = SKILL_ICON_SLUG_ALIASES[lower]
  if (alias) return alias
  for (const [label, slug] of Object.entries(cat)) {
    if (slug && label.toLowerCase() === lower) return slug
  }
  return undefined
}

/** Returns Simple Icons slug or null when no CDN asset is defined (use Lucide fallback). */
export function resolveSkillBrandSlug(label: string): string | null {
  const slug = slugFromCatalog(label.trim())
  return slug ?? null
}

export function skillIconUrl(label: string): string | null {
  const slug = resolveSkillBrandSlug(label)
  if (!slug) return null
  return `https://cdn.simpleicons.org/${slug}/000000`
}
