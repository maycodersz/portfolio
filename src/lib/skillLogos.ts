/**
 * Simple Icons CDN: https://cdn.simpleicons.org/{slug}/FFFFFF
 * Slugs must match https://simpleicons.org (lowercase, no spaces).
 */
export const SKILL_SIMPLE_ICON_SLUG: Partial<Record<string, string>> = {
  HTML: 'html5',
  CSS: 'css3',
  JavaScript: 'javascript',
  TypeScript: 'typescript',
  React: 'react',
  'Next.js': 'nextdotjs',
  'Tailwind CSS': 'tailwindcss',
  'React Native': 'reactnative',
  Expo: 'expo',
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
  'Go High Level': 'gohighlevel',
  Vercel: 'vercel',
  Git: 'git',
  /** Local / SQLite-style store used with Expo */
  ExpoSQL: 'sqlite',
  /** May not exist on CDN for every version — component falls back to Lucide */
  Webhooks: 'webhooks',
  MCP: 'modelcontextprotocol',
}

export function skillIconUrl(skillName: string): string | null {
  const slug = SKILL_SIMPLE_ICON_SLUG[skillName]
  if (!slug) return null
  return `https://cdn.simpleicons.org/${slug}/000000`
}
