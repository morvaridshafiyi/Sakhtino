# Construction Management SaaS

Production-ready Construction Management SaaS built with **Next.js 15**, **React 19**, **TypeScript**, **Tailwind CSS**, **Shadcn/ui-style components**, **Prisma**, **PostgreSQL**, **Auth.js**, **React Hook Form + Zod**, **TanStack Query**, **Recharts**, and **Docker**.

## Features

- Mobile-first RTL Persian UI with dark/light mode
- Role-based access control (Super Admin, Building Manager, Accountant, Project Supervisor)
- Dashboard with charts and KPI cards
- Project, finance, workers, contractors, materials management
- PDF/Excel report exports
- Notifications and activity audit logs
- Advanced SEO (metadata, OG, Twitter cards, sitemap, robots, JSON-LD)

## Project Structure

```
src/
├── app/                    # App Router pages & API routes
│   ├── (dashboard)/        # Protected dashboard routes
│   ├── api/                # REST API endpoints
│   ├── login/              # Authentication
│   ├── layout.tsx          # Root layout (RTL, SEO)
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── ui/                 # Shadcn-style UI primitives
│   ├── layout/             # Sidebar, header, shell
│   └── dashboard/          # Charts, stat cards
├── features/               # Feature-based business logic
│   ├── dashboard/
│   ├── projects/
│   ├── finance/
│   ├── workers/
│   ├── contractors/
│   ├── materials/
│   ├── notifications/
│   └── reports/
├── hooks/                  # Custom React hooks
├── lib/                    # Auth, RBAC, Prisma, validations, SEO
└── middleware.ts           # Auth protection
prisma/
├── schema.prisma           # Database schema
└── seed.ts                 # Demo data
```

## Database ERD Overview

```
User ──┬── Project (manager)
       ├── Notification
       ├── ActivityLog
       └── ProjectNote

Project ──┬── ProjectDocument / Image / Timeline
          ├── Income / Expense / Invoice
          ├── MaterialPurchase
          ├── WorkerProject (M:N Worker)
          └── ContractorProject (M:N Contractor)

Worker ──┬── Attendance / Salary / WorkerDocument
         └── WorkerProject

Contractor ──┬── Contract / ContractorPayment
             └── ContractorProject

Material ─── MaterialPurchase ─── Supplier

Invoice ─── Payment ─── ContractorPayment / Salary
Debt (standalone)
```

### Key Relationships

| Entity | Relations |
|--------|-----------|
| **User** | Manages projects, receives notifications, writes activity logs |
| **Project** | Central hub linking finance, workers, contractors, materials |
| **Worker** | Attendance, salaries, project assignments |
| **Contractor** | Contracts, payments, project assignments |
| **Material** | Inventory with purchases linked to suppliers and projects |
| **Invoice/Payment** | Financial tracking with debt management |

## Quick Start

### Prerequisites

- Node.js 20.19+ (or 22.12+)
- PostgreSQL 16+
- npm

### Local Development

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env

# 3. Start PostgreSQL (Docker)
docker compose up postgres -d

# 4. Push schema & seed
npm run db:push
npm run db:seed

# 5. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Demo login:** `admin@construction.local` / `admin123`

## Docker Deployment

```bash
# Build and run full stack
docker compose up --build

# Run migrations inside container
docker compose exec app npx prisma db push
docker compose exec app npm run db:seed
```

## Production Deployment (Vercel + Neon/Supabase)

1. Create PostgreSQL database (Neon, Supabase, or RDS)
2. Set environment variables:
   - `DATABASE_URL`
   - `AUTH_SECRET` (generate with `openssl rand -base64 32`)
   - `AUTH_URL` / `NEXT_PUBLIC_APP_URL`
3. Deploy to Vercel:
   ```bash
   npx vercel --prod
   ```
4. Run migrations:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/auth/[...nextauth]` | Auth.js handlers |
| GET | `/api/dashboard` | Dashboard stats & charts |
| GET/POST/PATCH | `/api/projects` | List/create/archive projects |
| GET/PUT | `/api/projects/[id]` | Project detail/update |
| GET/POST | `/api/finance` | Finance overview & transactions |
| GET/POST | `/api/workers` | Workers CRUD |
| GET/POST | `/api/contractors` | Contractors CRUD |
| GET/POST | `/api/materials` | Materials & suppliers |
| GET/PATCH | `/api/notifications` | Notifications |

## Security

- JWT session-based authentication (Auth.js)
- RBAC permission checks on API routes
- Zod input validation
- In-memory rate limiting (upgrade to Redis/Upstash in production)
- Activity audit logging
- CSRF protection via Auth.js built-in mechanisms

## Roles & Permissions

| Permission | Super Admin | Building Manager | Accountant | Project Supervisor |
|------------|:-----------:|:----------------:|:----------:|:------------------:|
| Users | ✅ | ❌ | ❌ | ❌ |
| Projects (write) | ✅ | ✅ | ❌ | ✅ |
| Finance (write) | ✅ | ❌ | ✅ | ❌ |
| Workers | ✅ | ✅ | Read | ✅ |
| Reports/Export | ✅ | ✅ | ✅ | ❌ |

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run db:push      # Push schema to DB
npm run db:migrate   # Create migration
npm run db:seed      # Seed demo data
npm run db:studio    # Prisma Studio
npm run lint         # ESLint
npm run format       # Prettier
```

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** React 19, Tailwind CSS 4, Radix UI
- **Database:** PostgreSQL + Prisma ORM 5
- **Auth:** Auth.js (NextAuth v5)
- **Forms:** React Hook Form + Zod
- **Data Fetching:** TanStack Query + Server Components
- **Charts:** Recharts
- **Reports:** jsPDF, xlsx

## License

MIT
