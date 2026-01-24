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
- **Styling:** Tailwind CSS v4 with oklch color space
- **Validation:** Zod schemas
- **UI Components:** Shadcn UI
- **Tables:** TanStack React Table with custom DataTable component
- **Forms:** React Hook Form + Zod resolver

### Backend (`../shiftly-api`)
- **Runtime:** Bun.js
- **Framework:** Hono (TypeScript-first web framework)
- **Database:** PostgreSQL + Drizzle ORM
- **Auth:** Better Auth (shared with frontend)

```bash
# Backend commands (run from shiftly-api/)
bun run dev           # Start dev server
bun run db:generate   # Generate Drizzle migrations
bun run db:migrate    # Run migrations
bun run db:seed       # Seed default roles & permissions
bun run db:studio     # Open Drizzle Studio
```

## Architecture

### File-Based Routing (`src/routes/`)

Routes use TanStack Router's file-based system with layout routes prefixed by underscore:

- `__root.tsx` - Root layout with sidebar navigation
- `_auth.tsx` - Public auth pages (login, reset-password), redirects authenticated users away
- `_authenticated.tsx` - Protected layout, requires authentication
- `_authenticated/settings.tsx` - Settings layout with sub-navigation (Users, Roles, Teams)

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

### Custom Hooks
Located in `src/hooks/`:
- `usePermissions.ts` - Current user's permissions
- `useRoles.ts` / `useRolesPaginated.ts` - Role CRUD operations with pagination
- `useUsers.ts` / `useUsersPaginated.ts` - User CRUD operations with pagination
- `useUsersCount()` - Global user counts (total, verified) for stats display
- `useTeams.ts` / `useTeamsPaginated.ts` - Team management (CRUD, member add/remove)
- `useTeamsCount()` - Global team count for stats display
- `useInvitations.ts` - Invitation actions (resend, cancel) - actions moved to user row
- `useTableState.ts` - Table pagination, search, filter, and sort state management
- `useDebounce.ts` - Debounced value hook

#### useTableState Hook
Returns handlers for all table state operations:
```typescript
const {
  params,                  // Current query params
  handlePaginationChange,  // (page, pageSize) => void
  handleSearchChange,      // (search) => void
  handleSortChange,        // (sortBy, sortOrder) => void
  handleFilterChange,      // (key, value) => void
  resetParams,             // () => void
} = useTableState();
```

The `params` object includes filter fields like `roleId` and `teamId` that are sent to the backend.

### Data Table Component
Located in `src/components/ui/data-table/`:
- `DataTable` - Main table component with server-side pagination, filtering, and sorting support
- `DataTablePagination` - Pagination controls
- `DataTableToolbar` - Search input with debounce and filter dropdowns
- `DataTableColumnHeader` - Sortable column headers

Usage:
```typescript
<DataTable
  columns={columns}
  data={data}
  pagination={paginationMeta}
  onPaginationChange={handlePaginationChange}
  onSearchChange={handleSearchChange}
  onSortChange={handleSortChange}
  filters={filters}
  onFilterChange={handleFilterChange}
  isLoading={isLoading}
/>
```

#### DataTable Filters
Filters are configured using the `FilterConfig` type:
```typescript
type FilterConfig = {
  key: string;       // Query param key (e.g., "roleId")
  label: string;     // Display label (e.g., "Role")
  options: { value: string; label: string }[];
  value?: string;    // Current selected value
};
```

#### DataTable Sorting
Server-side sorting is enabled via the `onSortChange` callback. When a column header is clicked, the callback receives:
- `sortBy` - Column ID to sort by
- `sortOrder` - Either "asc" or "desc"

### Sidebar Navigation
Located in `src/components/sidebar/`:
- `AppSidebar` - Main sidebar with navigation items
- `SidebarProvider` / `useSidebar` - Sidebar state context
- `SidebarItem` - Navigation item with tooltip
- `SidebarSection` - Grouped navigation items
- `SidebarUser` - User profile dropdown

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
- **Tables:** Use DataTable component with `useTableState` hook for pagination
- **Path alias:** `@/` resolves to `src/`

### Pagination Pattern

Backend endpoints support pagination via query params:
```
GET /v1/users?page=1&pageSize=10&search=john&sortBy=name&sortOrder=asc
```

Response format:
```typescript
{
  data: T[],
  pagination: {
    page: number,
    pageSize: number,
    total: number,
    totalPages: number
  }
}
```

### Error Handling
- `src/utils/api-error.utils.ts` - Parse API errors, extract messages
- `src/utils/error-messages.ts` - User-friendly error messages by error code
- `src/types/api-error.types.ts` - Error response type definitions

### Type Definitions
Located in `src/types/`:
- `user.types.ts`, `role.types.ts`, `permission.types.ts`
- `team.types.ts`, `invitation.types.ts`
- `pagination.types.ts` - Pagination params and response types
- `api-error.types.ts`

## Brand & Theming

- **Colors:** Teal/Green palette using oklch color space (defined in `src/styles/app.css`)
- **Font:** Inter (Google Fonts)
- **Dark mode:** Supported via CSS variables
