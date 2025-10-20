# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Byeku is a Next.js 15 application that generates haiku email signatures using OpenAI's API. Users authenticate via magic link and can generate haikus based on email body content with different tones (serene, funny, corporate).

## Development Commands

```bash
# Development server with Turbopack
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint

# Database migrations (Drizzle)
pnpm drizzle generate    # Generate migrations from schema
pnpm drizzle migrate     # Run migrations
pnpm drizzle studio      # Open Drizzle Studio (DB GUI)
```

## Architecture

### Database Schema Organization

The database schema is split into two files in `src/drizzle/`:

- `auth.ts` - Better Auth tables (user, session, account, verification)
- `app.ts` - Application-specific tables (currently placeholder)

Both schemas are merged in `src/lib/drizzle.ts` and exported as a single `db` instance using Neon serverless Postgres.

### Authentication Flow

- Better Auth with magic link plugin (no passwords)
- Server config: `src/lib/auth.ts` (includes nodemailer setup)
- Client config: `src/lib/client.ts` (React hooks)
- API routes: `src/app/api/auth/[...]` (catch-all for Better Auth endpoints)
- Flow: User submits email → magic link sent → user clicks link → redirected to verify page → authenticated

### API Routes

**Protected routes** require session validation:

```typescript
const session = await auth.api.getSession({ headers: request.headers })
if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
```

Current endpoints:

- `/api/auth/*` - Better Auth endpoints (login, logout, session)
- `/api/haiku` (POST) - Generate haiku from email body (protected)

### Code Style Conventions

- Minimal, functional code - no unnecessary abstractions
- Client components use `useState` for local state (no external state libraries)
- Forms follow pattern: loading state + error state + disabled button during loading
- Button text changes during loading (e.g., "Generate" → "Generating...")
- Use fragment syntax `<>` instead of wrapper divs
- Import path alias: `@/*` maps to `src/*`

### Environment Variables

Required:

- `DATABASE_URL` - Neon Postgres connection string
- `EMAIL_SERVER` - Nodemailer SMTP connection string
- `OPENAI_API_KEY` - OpenAI API key (loaded by OpenAI SDK)

### Known Issues

- `src/drizzle/app.ts` is a placeholder - needs actual application tables
- Auth emails hardcode "Oderum" branding (should be "Byeku")
- No haiku persistence (generated haikus not saved to database)
- Generator fetch missing `Content-Type: application/json` header
