# test-quality-019

## Features
- Accessible single-page portfolio layout
- Responsive hero section and contact form
- Admin contacts list page
- Health check endpoint
- Prisma-backed SQLite storage
- Toast notifications and reusable UI components

## Tech Stack
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Prisma ORM (SQLite)
- Jest + React Testing Library
- Playwright (E2E)

## Prerequisites
- Node.js 18+
- npm

## Quick Start
```bash
./install.sh
# or
./install.ps1
```
Then start the dev server:
```bash
npm run dev
```

## Environment Variables
See `.env.example`:
- `DATABASE_URL`
- `JWT_SECRET`
- `NEXT_PUBLIC_API_URL`

## Project Structure
```
src/
  app/                # App Router pages and layout
  components/         # Reusable UI and layout components
  lib/                # Utilities and shared logic
  providers/          # Context providers
  types/              # Shared types
prisma/               # Prisma schema and seed
```

## API Endpoints
- `GET /api/health` - Health check
- `POST /api/contact` - Submit contact message
- `GET /api/contact` - List contact messages (admin)
- `GET /api/site-profile` - Fetch hero/profile content
- `PUT /api/site-profile` - Update hero/profile content (admin)

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build production app
- `npm run start` - Start production server
- `npm run lint` - Lint code
- `npm run test` - Run Jest tests
- `npm run test:e2e` - Run Playwright tests

## Testing
- Unit/Component: `npm run test`
- E2E: `npm run test:e2e`

## Notes
- Admin endpoints can be protected by API key or JWT.
- Update `.env` for production secrets.
