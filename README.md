# TaskFlow — Frontend

Production-ready task management dashboard built with **Next.js 15**, **TypeScript**, **TailwindCSS**, **ShadCN UI**, **Redux Toolkit**, **React Hook Form**, and **Zod**.

## Features

- Authentication (register, login, logout, protected routes, session persistence)
- Dashboard with task statistics
- Full task management (CRUD, search, filter, pagination, mark complete)
- Mobile-first responsive SaaS design
- Optimistic updates with Redux thunks
- Toast notifications, error boundaries, loading skeletons

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 15 App Router | Framework & routing |
| TypeScript | Type safety |
| TailwindCSS v4 | Styling |
| ShadCN UI (Radix) | Component library |
| Redux Toolkit | Server state & async thunks |
| React Hook Form + Zod | Form validation |
| Axios | HTTP client |
| Sonner | Toast notifications |

## Prerequisites

- Node.js >= 18
- Backend API running at `http://localhost:3000`

## Quick Start

```bash
cd FE
npm install
cp .env.local.example .env.local
npm run dev
```

Open [http://localhost:3001](http://localhost:3001)

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Pages

| Route | Description |
|-------|-------------|
| `/login` | User login |
| `/register` | User registration |
| `/dashboard` | Stats overview & recent tasks |
| `/tasks` | Task list with search, filter, pagination |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages & layouts
├── features/
│   ├── auth/               # Login & register forms, schemas
│   ├── dashboard/          # Dashboard page components
│   └── tasks/              # Task management components
├── components/
│   ├── common/             # Navbar, Sidebar, TaskCard, etc.
│   └── ui/                 # ShadCN UI primitives
├── services/               # API service classes
├── hooks/                  # Redux-connected hooks
├── store/                  # Redux slices & thunks
├── lib/                    # API client, auth storage, utils
├── types/                  # Shared TypeScript types
└── utils/                  # Helper utilities
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 3001 |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Architecture Notes

- **Server Components** used for page shells and metadata
- **Client Components** for interactivity (forms, queries, dialogs)
- **Middleware** protects `/dashboard` and `/tasks` routes via JWT cookie
- **Feature-first** organization with co-located schemas and components
- **Optimistic updates** on task mutations for instant UI feedback

## License

MIT
