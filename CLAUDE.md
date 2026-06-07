# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Family budget planning app — Nx monorepo with an Angular 21 frontend and NestJS 11 backend sharing TypeScript types.

## Commands

```bash
# Dev
npm run start:web        # Angular dev server → http://localhost:4200
npm run start:api        # NestJS dev server → http://localhost:3000

# Nx (prefer these)
npx nx serve web
npx nx serve api
npx nx run-many --target=build --all
npx nx run-many --target=test --all
npx nx affected --target=test   # only changed projects

# Database
docker-compose up -d             # start PostgreSQL on :5432
npx prisma migrate dev           # run from apps/api/
npx prisma studio                # GUI for database browsing
npx prisma generate              # regenerate Prisma client after schema changes
```

## Stack

| Layer | Technology |
|---|---|
| Monorepo | Nx 22 |
| Frontend | Angular 21 (signals, no NgRx) |
| UI | Angular Material 21 |
| Charts | Apache ECharts via ngx-echarts |
| Backend | NestJS 11 |
| Database | PostgreSQL 16 (Docker) |
| ORM | Prisma 6 (schema in `apps/api/prisma/`) |
| Auth | JWT — access token (15 min) + refresh token (7 days, httpOnly cookie) |

## Repo Structure

```
apps/
  web/          Angular 20 app
  api/          NestJS app (Prisma lives here)
libs/
  shared-types/ DTOs, enums, interfaces imported by both apps
docker-compose.yml
.env.example    → copy to .env before running api
```

## Architecture

### Shared types
`libs/shared-types` is the source of truth for all request/response DTOs and enums (`TransactionType`, `CategoryType`, etc.). Both `web` and `api` import from `@budget-hub/shared-types`.

### Auth flow
1. `POST /auth/login` returns `accessToken` in body; `refreshToken` set as httpOnly cookie
2. Angular `JwtInterceptor` attaches `Authorization: Bearer <token>` to every request
3. On 401, interceptor calls `POST /auth/refresh` (cookie sent automatically), gets a new access token, retries the original request
4. `POST /auth/logout` clears the cookie server-side

### Data scoping
Every authenticated API query is scoped to `user.householdId`. No cross-household data leakage is possible by design — guards extract the household from the JWT, not from request params.

### Angular state
Signals-based services only — no NgRx. Each feature (`transactions`, `budgets`, `dashboard`) owns a signal-based service with `effect()` for side effects.

### NestJS module order (dependency graph)
`PrismaModule` → `AuthModule` → `UsersModule` → `HouseholdsModule` → `CategoriesModule` → `TransactionsModule` → `BudgetsModule` → `DashboardModule`

## Environment

Copy `.env.example` to `.env` in the repo root (or `apps/api/`) before running the API. Key vars:
- `DATABASE_URL` — Prisma connection string
- `JWT_SECRET` — must be set; any change invalidates all existing tokens
- `CORS_ORIGIN` — set to Angular dev server URL (`http://localhost:4200`)
