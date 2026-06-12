# TaskFlow — Frontend

Production-ready **Task Management Dashboard** built with Next.js 15, TypeScript, TailwindCSS, ShadCN UI, Redux Toolkit, React Hook Form, and Zod.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Complete Source Code Structure](#complete-source-code-structure)
4. [Architecture Decisions](#architecture-decisions)
5. [Assumptions](#assumptions)
6. [Environment Setup](#environment-setup)
7. [Running the Application](#running-the-application)
8. [Pages & Features](#pages--features)
9. [Testing](#testing)
10. [Deployment](#deployment)

---

## Project Overview

TaskFlow is a SaaS-style task management dashboard that connects to the TaskFlow Backend API. Users can:

- **Register and login** with JWT-based session persistence
- **View dashboard metrics** — total, completed, pending tasks, completion percentage
- **Manage tasks** — create, edit, delete, mark complete, search, filter, and paginate
- **Use on any device** — mobile-first responsive design

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 15 (App Router) | React framework, routing, SSR/SSG |
| TypeScript 5 | Type safety |
| TailwindCSS v4 | Utility-first styling |
| ShadCN UI (Radix) | Accessible component primitives |
| Redux Toolkit | Global state & async API thunks |
| React Hook Form | Form state management |
| Zod | Client-side form validation |
| Axios | HTTP client with interceptors |
| Sonner | Toast notifications |
| Jest + React Testing Library | Unit & component tests |

---

## Complete Source Code Structure

```
FE/
├── __tests__/
│   ├── auth/
│   │   ├── login-form.test.tsx
│   │   └── register-form.test.tsx
│   ├── tasks/
│   │   └── task-hooks.test.tsx
│   └── lib/
│       └── token-utils.test.ts
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Public auth routes
│   │   │   ├── layout.tsx
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (dashboard)/              # Protected routes
│   │   │   ├── layout.tsx            # Sidebar + Navbar layout
│   │   │   ├── dashboard/page.tsx
│   │   │   └── tasks/page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx                # Root layout + providers
│   │   └── page.tsx                  # Redirect to /dashboard
│   ├── components/
│   │   ├── common/                   # Reusable app components
│   │   │   ├── navbar.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   ├── search-bar.tsx
│   │   │   ├── pagination.tsx
│   │   │   ├── task-card.tsx
│   │   │   ├── task-table.tsx
│   │   │   ├── dashboard-stats.tsx
│   │   │   ├── empty-state.tsx
│   │   │   ├── confirm-dialog.tsx
│   │   │   └── error-boundary.tsx
│   │   ├── ui/                       # ShadCN UI primitives
│   │   │   ├── button.tsx, input.tsx, card.tsx, dialog.tsx
│   │   │   ├── select.tsx, badge.tsx, skeleton.tsx, etc.
│   │   └── providers/
│   │       ├── app-providers.tsx     # Redux + Error boundary + Toasts
│   │       └── auth-session-provider.tsx
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/           # LoginForm, RegisterForm
│   │   │   └── schemas/                # Zod auth schemas
│   │   ├── dashboard/
│   │   │   └── components/             # DashboardContent
│   │   └── tasks/
│   │       ├── components/             # TasksPageContent, TaskFormDialog
│   │       └── schemas/                # Zod task form schema
│   ├── hooks/
│   │   ├── use-auth.ts                 # Login, register, logout hooks
│   │   ├── use-tasks.ts                # Task CRUD & list hooks
│   │   ├── use-dashboard.ts            # Dashboard stats hook
│   │   └── use-debounce.ts             # Search debounce utility
│   ├── services/
│   │   ├── auth.service.ts             # Auth API calls
│   │   ├── task.service.ts             # Task API calls
│   │   └── dashboard.service.ts        # Dashboard API calls
│   ├── store/
│   │   ├── index.ts                    # Redux store configuration
│   │   ├── hooks.ts                    # Typed useAppDispatch/Selector
│   │   └── slices/
│   │       ├── authSlice.ts
│   │       ├── tasksSlice.ts
│   │       └── dashboardSlice.ts
│   ├── lib/
│   │   ├── api-client.ts               # Axios instance + interceptors
│   │   ├── auth-storage.ts             # JWT localStorage + cookie
│   │   ├── token-utils.ts              # JWT expiry helpers
│   │   ├── constants.ts
│   │   └── utils.ts                    # cn(), formatDate()
│   ├── types/
│   │   └── index.ts                    # Shared TypeScript interfaces
│   ├── utils/
│   │   └── task-status.ts              # Status labels & badge variants
│   └── middleware.ts                   # Route protection (JWT cookie)
├── .env.example
├── jest.config.js
├── jest.setup.ts
├── next.config.ts
├── vercel.json                       # Vercel deployment config
├── package.json
├── tsconfig.json
└── README.md
```

---

## Architecture Decisions

### 1. Feature-First Organization

UI code is grouped by **business domain** (`auth`, `dashboard`, `tasks`) rather than by file type. Each feature contains its components, schemas, and related logic. Shared UI lives in `components/common/` and `components/ui/`.

### 2. Redux Toolkit for Server State

API data is managed with **Redux Toolkit async thunks** instead of TanStack Query:

| Slice | Responsibility |
|-------|----------------|
| `authSlice` | User session, login/register/logout thunks |
| `tasksSlice` | Task list cache (keyed by query params), CRUD thunks |
| `dashboardSlice` | Dashboard statistics |

Hooks (`useTasks`, `useAuth`, etc.) wrap Redux dispatch/select to keep components clean.

### 3. Service Layer Pattern

API calls are isolated in **service classes** (`auth.service.ts`, `task.service.ts`). Components and slices never call Axios directly — they go through services, making the API layer easy to mock in tests.

### 4. Server vs Client Components

| Type | Used For |
|------|----------|
| **Server Components** | Page shells, metadata, static layouts |
| **Client Components** | Forms, Redux hooks, dialogs, interactive UI |

Interactive features are marked `'use client'` and loaded with `dynamic()` where beneficial (e.g. `TaskFormDialog`).

### 5. Authentication Flow

```
Register/Login → JWT stored in localStorage + cookie
                → Redux auth state updated
                → Middleware reads cookie for route protection
                → Axios interceptor attaches Bearer token
                → AuthSessionProvider checks expiry every 60s
                → 401 response → auto logout & redirect to /login
```

### 6. Route Protection (Dual Layer)

1. **Next.js Middleware** — checks `accessToken` cookie; redirects unauthenticated users from `/dashboard` and `/tasks`
2. **AuthSessionProvider** — client-side JWT expiry validation and session refresh logic

### 7. Responsive UI Strategy

- **Desktop:** sidebar navigation + data table for tasks
- **Mobile:** collapsible drawer menu + card layout for tasks
- **Shared:** SearchBar, Pagination, EmptyState, ConfirmDialog, loading skeletons

### 8. Error Handling

- **Error Boundary** — catches React render errors with retry UI
- **Axios interceptor** — global 401 handling and API error toasts
- **Empty states** — meaningful UI when no tasks match filters
- **Sonner toasts** — success/error feedback on mutations

---

## Assumptions

| # | Assumption | Rationale |
|---|------------|-----------|
| 1 | **Backend API is deployed separately** | Frontend only consumes REST API via `NEXT_PUBLIC_API_URL` |
| 2 | **JWT stored in localStorage + cookie** | localStorage for Axios; cookie for Next.js middleware |
| 3 | **Single user session per browser** | No multi-tab sync; logout clears all auth state |
| 4 | **English UI only** | No i18n/localization implemented |
| 5 | **No offline support** | Requires active network connection to backend |
| 6 | **Task list refetch on mutation** | Redux `invalidated` flag triggers refetch after create/update/delete |
| 7 | **Dashboard stats from dedicated API** | `GET /api/dashboard/stats` rather than client-side aggregation |
| 8 | **Default page size is 10 tasks** | Configurable via `DEFAULT_PAGE_SIZE` constant |
| 9 | **Frontend runs on port 3001 locally** | Avoids conflict with backend on port 9000 |
| 10 | **CORS configured on backend** | Frontend origin must be in backend `CORS_ORIGIN` |

---

## Environment Setup

### Prerequisites

- **Node.js** 18+ (20 recommended)
- **npm** 9+
- **Backend API** running (see Backend README)

### Step 1 — Clone & Install

```bash
git clone <repository-url>
cd FE          # or your frontend repo root
npm install
```

### Step 2 — Environment Variables

```bash
cp .env.example .env.local
```

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | **Yes** | Backend API base URL | `http://localhost:9000` |

> Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

### Step 3 — Ensure Backend is Running

The frontend requires the backend API. Start it first:

```bash
# In backend directory
npm run dev
# Verify: curl http://localhost:9000/health
```

---

## Running the Application

```bash
# Development (http://localhost:3001)
npm run dev

# Type check
npm run typecheck

# Run tests
npm test

# Production build
npm run build
npm start
```

Open **http://localhost:3001**

---

## Pages & Features

| Route | Access | Description |
|-------|--------|-------------|
| `/login` | Public | Email/password login |
| `/register` | Public | New account registration |
| `/dashboard` | Protected | Stats cards, progress bar, recent tasks |
| `/tasks` | Protected | Full task list with search, filter, pagination, CRUD |

### Task List Features

- **Search** — debounced title search (400ms)
- **Filter** — by status (`pending`, `in_progress`, `completed`, `cancelled`)
- **Pagination** — configurable page size (default 10)
- **Sort** — by `createdAt` ascending or descending
- **Actions** — create, edit, delete, mark complete (dropdown menu)

### Reusable Components

`Navbar`, `Sidebar`, `Header`, `SearchBar`, `Pagination`, `TaskCard`, `TaskTable`, `DashboardStats`, `EmptyState`, `ConfirmDialog`, `ErrorBoundary`

---

## Testing

```bash
npm test              # Run all tests
npm run test:coverage # With coverage
```

| Test File | Coverage |
|-----------|----------|
| `login-form.test.tsx` | Login form render, validation, submit |
| `register-form.test.tsx` | Register form render, submit |
| `task-hooks.test.tsx` | Redux task fetch with search/filter params |
| `token-utils.test.ts` | JWT decode and expiry detection |

---

## Deployment

### Vercel (Recommended)

1. Import GitHub repo on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `FE` (if monorepo) or repo root
3. Add environment variable:

```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

4. Deploy

### Important

- Update backend `CORS_ORIGIN` to your Vercel URL after deploy
- Use `npm start` for self-hosted production (port 3001)

See `vercel.json` for Vercel configuration.

---

## Connecting Frontend to Backend

```
┌─────────────────────┐         ┌─────────────────────┐
│  Frontend (Vercel)  │  HTTPS  │  Backend (Render)   │
│  Next.js :3001      │ ──────► │  Express  :9000     │
└─────────────────────┘         └─────────────────────┘
```

| Environment | Frontend URL | Backend URL |
|-------------|-------------|-------------|
| Local | `http://localhost:3001` | `http://localhost:9000` |
| Production | `https://app.vercel.app` | `https://api.onrender.com` |

---

## License

MIT
