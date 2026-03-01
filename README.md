# AuraSpear SOC Platform

A modern **Security Operations Center (SOC)** platform built with Next.js 16, React 19, and TypeScript 5. AuraSpear provides real-time security monitoring, alert management, threat hunting, threat intelligence, case management, and multi-tenant administration with RBAC.

## Tech Stack

| Category         | Technology                                              |
| ---------------- | ------------------------------------------------------- |
| Framework        | Next.js 16 (App Router, Turbopack)                      |
| Language         | TypeScript 5 (strict mode, all flags enabled)           |
| UI Library       | React 19                                                |
| Styling          | Tailwind CSS v4 + CSS-first theme variables             |
| Components       | shadcn/ui (Radix primitives) + custom common components |
| State Management | Zustand (global stores) + React Query (server state)    |
| Forms            | React Hook Form + Zod validation                        |
| HTTP Client      | Axios (pre-configured instance with interceptors)       |
| i18n             | next-intl (EN, AR, FR, DE, ES, IT)                      |
| Charts           | Recharts                                                |
| Icons            | Lucide React                                            |
| Notifications    | Sonner (toasts) + SweetAlert2 (confirmation dialogs)    |
| API Mocking      | MSW (Mock Service Worker)                               |
| Theming          | next-themes (light/dark mode via CSS variables)         |
| Linting          | ESLint 9 (flat config) with 7 plugins                   |
| Formatting       | Prettier + prettier-plugin-tailwindcss                  |
| Git Hooks        | Husky v9 + lint-staged                                  |

## Features

- **Dashboard** — Real-time KPIs, alert trends, MITRE ATT&CK stats, asset risk overview, pipeline health
- **Alerts** — Alert triage, severity-based filtering, AI-assisted investigation
- **Cases** — Case lifecycle management with linked alerts and evidence
- **Threat Hunting** — Interactive hunt sessions with natural language queries
- **Threat Intelligence** — IOC search, MISP event integration, correlation analysis
- **Connectors** — Integration management (Wazuh, Graylog, MISP, Shuffle, AWS Bedrock)
- **Admin** — Multi-tenant administration, system configuration, audit logs
- **Dark Mode** — Full dark/light theme support via CSS variables
- **RTL Support** — Bidirectional layout for Arabic and other RTL languages
- **RBAC** — Role-based access control (Admin, SOC Analyst, Viewer)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Auth routes (login, callback)
│   ├── (portal)/           # Protected routes (dashboard, alerts, cases, etc.)
│   │   ├── admin/          # Admin pages (system, tenant)
│   │   ├── alerts/         # Alert management
│   │   ├── cases/          # Case management
│   │   ├── connectors/     # Connector configuration
│   │   ├── dashboard/      # SOC dashboard
│   │   ├── hunt/           # Threat hunting
│   │   └── intel/          # Threat intelligence
│   ├── api/                # API route handlers
│   ├── globals.css         # Tailwind v4 theme + status classes
│   ├── layout.tsx          # Root layout
│   └── providers.tsx       # App providers (Query, Theme, i18n)
├── components/
│   ├── common/             # Reusable components (DataTable, PageHeader, Toast, etc.)
│   ├── ui/                 # shadcn/ui primitives (Button, Dialog, Input, etc.)
│   └── [domain]/           # Domain-specific components (alerts, cases, etc.)
├── enums/                  # All string enums (barrel export)
├── hooks/                  # Custom React hooks
├── i18n/                   # Translation files (en, ar, fr, de, es, it)
├── lib/                    # Utilities, API client, validation schemas
│   ├── api.ts              # Axios instance configuration
│   ├── api-error.ts        # Error handling utilities
│   ├── utils.ts            # General utilities (cn, formatDate, etc.)
│   ├── types/              # Connector types
│   └── validation/         # Zod schemas
├── mocks/                  # MSW mock handlers and data
├── services/               # API service modules
├── stores/                 # Zustand stores
│   ├── connectors.store.ts
│   ├── filter.store.ts
│   ├── hunt.store.ts
│   ├── notification.store.ts
│   ├── tenant.store.ts
│   └── ui.store.ts
└── types/                  # All TypeScript interfaces/types (barrel export)
```

## Getting Started

### Prerequisites

- **Node.js** >= 18.18
- **npm** >= 9

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd auraspear

# Install dependencies
npm install
```

### Development

```bash
# Start development server with Turbopack
npm run dev

# Start with Node.js inspector for debugging
npm run dev:debug
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production

```bash
# Build for production
npm run build

# Start production server
npm start

# Start with explicit NODE_ENV=production
npm run start:prod
```

## Available Scripts

| Script                    | Description                                    |
| ------------------------- | ---------------------------------------------- |
| `npm run dev`             | Start dev server with Turbopack                |
| `npm run dev:debug`       | Start dev server with Node.js inspector        |
| `npm run build`           | Create optimized production build              |
| `npm start`               | Start production server                        |
| `npm run start:prod`      | Start production server with explicit NODE_ENV |
| `npm run lint`            | Run ESLint on all files                        |
| `npm run lint:strict`     | Run ESLint with zero warnings allowed          |
| `npm run lint:fix`        | Run ESLint with auto-fix                       |
| `npm run format`          | Format all files with Prettier                 |
| `npm run format:check`    | Check formatting without writing               |
| `npm run typecheck`       | Run TypeScript compiler checks                 |
| `npm run typecheck:watch` | Run TypeScript checks in watch mode            |
| `npm run validate`        | Run typecheck + lint:strict + format:check     |
| `npm run validate:fix`    | Run lint:fix + format (auto-fix all)           |
| `npm run lint-report-all` | Generate JSON lint report for all files        |
| `npm run lint-report-ts`  | Generate JSON lint report for TypeScript files |
| `npm run lint-report-js`  | Generate JSON lint report for JavaScript files |

## Code Quality

### ESLint Configuration

ESLint 9 flat config with maximum strictness. **7 plugins** are configured:

1. **eslint-config-next** (core-web-vitals + typescript) — Next.js, React, React Hooks, JSX-A11y
2. **eslint-plugin-unicorn** — Modern JS best practices (30+ rules)
3. **eslint-plugin-import-x** — Import ordering, no duplicates, no cycles
4. **eslint-plugin-security** — ReDoS detection, injection sinks, timing attacks, bidi characters

**80+ rules** enforced across categories: TypeScript strict, code quality, clean code, bug prevention, security, React/JSX, accessibility, imports, and modern JS patterns.

### Prettier Configuration

| Setting        | Value                            |
| -------------- | -------------------------------- |
| Semicolons     | No                               |
| Quotes         | Single                           |
| Print width    | 100                              |
| Tab width      | 2                                |
| Trailing comma | ES5                              |
| Arrow parens   | Avoid                            |
| Plugin         | tailwindcss (auto-sorts classes) |

### TypeScript Configuration

All strict flags enabled including `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, and `useUnknownInCatchVariables`.

### Git Hooks

Pre-commit hooks via Husky v9 + lint-staged:

- **TypeScript/JavaScript files**: ESLint + TypeScript type checking
- **All supported files**: Prettier formatting

## Theming

The app uses CSS custom properties for theme-aware colors that switch automatically between light and dark modes. Status/severity colors are defined as utility classes:

- `text-status-success`, `bg-status-success`, `border-status-success`
- `text-status-warning`, `bg-status-warning`, `border-status-warning`
- `text-status-error`, `bg-status-error`, `border-status-error`
- `text-status-info`, `bg-status-info`, `border-status-info`
- `text-status-neutral`, `bg-status-neutral`, `border-status-neutral`

**Never use static Tailwind color classes** (e.g., `text-red-600`, `bg-green-100`) for semantic colors. Use the status class system instead.

## API Mocking

MSW (Mock Service Worker) is configured for development. Mock handlers are organized by domain in `src/mocks/handlers/`. The service worker file is at `public/mockServiceWorker.js`.

## Internationalization

Translations are managed via `next-intl` with support for 6 languages:

- English (`en.json`)
- Arabic (`ar.json`) — with full RTL support
- French (`fr.json`)
- German (`de.json`)
- Spanish (`es.json`)
- Italian (`it.json`)

All user-facing text must use the `t()` function. Never hardcode strings.

## Contributing

1. Create a feature branch from `main`
2. Follow the coding standards in `CLAUDE.md`
3. Ensure `npm run validate` passes (typecheck + lint:strict + format:check)
4. Pre-commit hooks will automatically check your staged files
5. Submit a pull request

## License

Private project. All rights reserved.
