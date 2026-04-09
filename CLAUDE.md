# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mentorix is a school group attendance management system. **This is a monorepo** with the following structure:
- **NestJS API** (`code/api/`) — Backend with Mongoose, Passport JWT, Swagger
- **Vue 3 Webapp** (`code/webapp/`) — Frontend SPA with Vue Router, Pinia, Tailwind CSS
- **Documentation** (`doc/`) — Architecture, conventions, task tracking

**Language rule:** All code, database, technical documentation, and commits are in **English**. The user interface (UI labels, messages, placeholders) is in **Spanish**.

## Development Commands

### Docker Development (Recommended)

This monorepo runs inside Docker containers. Each sub-project maps to a container:

| Sub-project     | Container          | Port  |
| --------------- | ------------------ | ----- |
| API (NestJS)    | `mentorix_api`     | 3000  |
| Webapp (Vue 3)  | `mentorix_webapp`  | 5174  |
| MongoDB         | `mentorix_mongo`   | 27017 |
| Nginx           | `mentorix_nginx`   | 8880  |
| Mongo Express   | `mentorix_mongo_express` | 8081 |

```bash
# Start full stack
make up
# or: docker compose up --build -d

# Stop all containers
make down

# View logs
make logs

# Run API tests
make api-test
docker exec -it mentorix_api npm run test

# Run API E2E tests
docker exec -it mentorix_api npm run test:e2e

# Run webapp tests
make webapp-test
docker exec -it mentorix_webapp npm run test
```

### API Only

```bash
cd code/api
npm run start:dev      # NestJS dev server with watch
npm run lint           # ESLint
npm run typecheck      # TypeScript check
npm run test           # Jest unit tests
npm run test:cov       # With coverage
npm run test:e2e       # E2E tests
```

### Webapp Only

```bash
cd code/webapp
npm run dev            # Vite dev server at http://localhost:5174
npm run build          # Production build
npm run lint           # ESLint
npm run typecheck      # TypeScript check (vue-tsc)
npm run test           # Vitest
npm run test:cov       # With coverage
```

## Architecture

### API Structure (NestJS)

The API uses modular NestJS architecture:

```
src/
├── main.ts              # Bootstrap, global prefix /api/v1
├── app.module.ts         # Root module (Mongoose, Config)
├── health/               # Health check module
│   ├── health.module.ts
│   ├── health.controller.ts
│   └── health.controller.spec.ts
├── modules/              # Feature modules (future)
│   ├── auth/
│   ├── groups/
│   ├── students/
│   └── attendance/
```

**Key patterns:**
- Global prefix: `/api/v1`
- Validation via `class-validator` + `ValidationPipe` (whitelist + transform)
- Swagger docs at `/api/docs`
- MongoDB with Mongoose (`@nestjs/mongoose`)
- JWT auth with Passport (`@nestjs/passport`)
- Path aliases via `@/` for absolute imports

### Webapp Structure (Vue 3)

Vue Router with Pinia state management:

```
src/
├── main.ts              # App bootstrap (Pinia, Router, CSS)
├── App.vue              # Root component
├── router/              # Vue Router configuration
├── views/               # Route page components
├── components/          # Reusable UI components
├── composables/         # Vue composables (useXxx)
├── stores/              # Pinia stores
├── services/            # API service functions
├── lib/                 # Utilities (api-client.ts)
├── types/               # TypeScript type definitions
└── assets/              # CSS, images
```

**Key patterns:**
- Pinia for state management
- Axios client with automatic token injection (`lib/api-client.ts`)
- Vue Router with `createWebHistory`
- Tailwind CSS for styling
- Path aliases via `@/` for absolute imports

## Conventions

### Pre-commit Checks (mandatory — always run before committing)

**Before every commit, run the linters and fix all errors. Never commit with lint failures.**

```bash
# API — ESLint + TypeScript
docker exec -it mentorix_api bash -c "npm run lint && npm run typecheck"

# Webapp — ESLint + TypeScript
docker exec -it mentorix_webapp bash -c "npm run lint && npm run typecheck"
```

**Rules:**
- A commit must not be created if `npm run lint` or `npm run typecheck` report errors
- If linters cannot run (e.g. containers are down), fix manually before committing

---

### Commit Messages (mandatory — always follow this exactly)

Full convention reference: `doc/conventions/git/commits.md`

**Format — every field is required:**
```
:emoji [#issue] - short description :emoji

- :emoji Activity 1
- :emoji Activity 2
- :emoji Activity 3
```

**Rules:**
- Subject line: `emoji [#NNN] - description emoji` — the dash (` - `) between issue and description is mandatory
- Each bullet in the body **must start with an emoji** — plain `- text` is not allowed
- Issue number is always 3 digits zero-padded: `#001`, `#030`, not `#1` or `#30`
- Description is concise (imperative mood), never a sentence ending in period
- Final ornamental emoji on the subject line is required

**Emoji types:**
- ✨ feat — new feature
- 🐛 fix — bug fix
- 📚 docs — documentation
- 🎨 style — formatting, no logic change
- 🔨 refactor — code restructure
- 🚀 perf — performance improvement
- ✅ test — adding/updating tests
- 🔧 chore — config, tooling, maintenance

---

### DateTime Standard (mandatory)

- **Database**: Always UTC
- **API input**: ISO 8601 with offset. Backend normalizes to UTC
- **API output**: ISO 8601 UTC
- **Frontend display**: Convert UTC to local time for display

---

### TypeScript Strict Typing (mandatory — no `any`)

**Never use `any` in TypeScript code. Always use specific types or `unknown`.**

See `doc/conventions/frontend/typescript-typing.md` for detailed patterns.

---

### UI Language

All user-facing text (labels, messages, placeholders, headings) must be in **Spanish**. All code (variable names, function names, comments, documentation) must be in **English**.

```vue
<!-- ✅ Correct -->
<h1>Gestión de Asistencia</h1>
<label>Nombre del estudiante</label>
<button>Guardar</button>

<!-- ❌ Wrong -->
<h1>Attendance Management</h1>
```

```ts
// ✅ Correct — code in English
function getStudentList(): Student[] { ... }

// ❌ Wrong — code in Spanish
function obtenerListaEstudiantes(): Estudiante[] { ... }
```
