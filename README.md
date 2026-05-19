# Maycoder — Portfolio

A personal portfolio website built with React, TypeScript, and Tailwind CSS. Showcases web development, mobile app, and automation projects with smooth animations, a dark/light theme, and responsive layouts.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| Language | TypeScript 6 |
| Styling | Tailwind CSS 4 |
| Animation | Motion (Framer Motion) |
| Routing | React Router 7 |
| UI Primitives | Radix UI (Dialog, Tooltip, Slot) |
| Icons | Lucide React, React Icons |
| Components | shadcn/ui |

## Getting Started

### Prerequisites

- Node.js 18+
- npm / pnpm / yarn

### Install & Run

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── assets/          # Images and static assets
├── components/      # Reusable UI components
│   ├── ui/          # Base UI primitives (button, dialog, navbar…)
│   ├── device/      # Device frame components
│   └── project/     # Project showcase components
├── content/
│   └── portfolio.ts # All editable content lives here
├── contexts/        # React context providers (theme, cursor)
├── hooks/           # Custom React hooks
├── lib/             # Utility libraries
├── pages/           # Route-level page components
└── utils/           # Helper functions
```

## Customization

All site content — headings, project details, pricing, stats, contact links — is centralized in a single file:

```
src/content/portfolio.ts
```

Edit that file to update any text, add projects, or change links without touching component code.

## Environment Variables

Create a `.env.local` file at the root for any environment-specific values (not committed to git):

```bash
# Example — add your own as needed
VITE_CONTACT_EMAIL=your@email.com
```

## License

MIT
