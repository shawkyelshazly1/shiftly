# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
pnpm dev          # Start dev server on port 3000
pnpm build        # Production build
pnpm preview      # Preview production build
pnpm test         # Run tests with Vitest
```

## Technology Stack

### Frontend (this repo)
- **Framework:** React 19 + TanStack React Start (full-stack)
- **Routing:** TanStack Router (file-based)
- **State:** TanStack React Query for server state
- **Auth:** Better Auth (session-based with cookies)
- **Styling:** Tailwind CSS v4
- **Validation:** Zod schemas
- **UI Components:** Shadcn ui

### Backend (`../shiftly-api`)
- **Runtime:** Bun.js
- **Framework:** Hono (TypeScript-first web framework)
- **Database:** PostgreSQL + Drizzle ORM
- **Auth:** Better Auth (shared with frontend)

```bash
# Backend commands (run from shiftly-api/)
bun dev           # Start dev server
bun db:push       # Push schema to database
bun db:seed       # Seed default roles & permissions
bun db:studio     # Open Drizzle Studio
```

## Architecture

### File-Based Routing (`src/routes/`)

Routes use TanStack Router's file-based system with layout routes prefixed by underscore:

- `__root.tsx` - Root layout, hydrates session into context
- `_auth.tsx` - Public auth pages (login, reset-password), redirects authenticated users away
- `_authenticated.tsx` - Protected layout, requires authentication
- `_admin.tsx` - Admin layout, requires specific permissions
- `_manage.tsx` - Management area with role-based access

Route guards use `beforeLoad` hooks to check auth/permissions before rendering.

### Permission System

Permissions follow `"resource:action"` format with wildcard support:
- `"users:read"`, `"users:create"`, `"users:*"` (all user actions)
- `"*"` (superadmin - all permissions)

Key files:
- `src/constants/permissions.ts` - Permission constants (must stay in sync with backend)
- `src/utils/permissions.utils.ts` - `hasPermission()`, `hasAnyPermission()`, `hasAllPermissions()`
- `src/utils/routes.utils.ts` - `requirePermission()`, `requireAnyPermission()` for route guards
- `src/components/can.tsx` - `<Can>` component for conditional UI rendering

### Server Functions Pattern

All API calls use TanStack React Start's `createServerFn()`:

```typescript
export const createRole = createServerFn({ method: "POST" })
  .inputValidator((data: CreateRoleInput) => createRoleSchema.parse(data))
  .handler(async ({ data }) => {
    const request = getRequest();
    const response = await apiClient.post<Role>("/v1/roles", data, {
      headers: { cookie: request.headers.get("cookie") || "" },
    });
    return response.data;
  });
```

Query definitions live in `src/utils/queries/` with React Query options.

### API Client

`src/utils/api-client.ts` configures Axios with:
- Base URL from `VITE_SERVER_URL` environment variable
- Cookie credentials enabled
- Response interceptor that invalidates `["user-permissions"]` query on 403 errors

## Key Patterns

- **Route-level auth:** Use `beforeLoad` hook with `requirePermission()` or `requireAnyPermission()`
- **Component-level auth:** Use `<Can permission="resource:action">` wrapper
- **Data fetching:** Define query options in `src/utils/queries/`, use in hooks or route loaders
- **Forms:** React Hook Form + Zod resolver, schemas in `src/utils/schemas.ts`
- **Path alias:** `@/` resolves to `src/`
