# Task #001 — Project scaffolding and Docker setup

## 📖 Story

As a developer, I need to initialize the Mentorix monorepo with the full development stack, so that the team can start building features on a solid foundation.

---

## ✅ Technical Tasks

- [x] 🐳 Docker Compose with all services running (API, webapp, MongoDB, nginx, mongo-express)
- [x] 🔧 NestJS API with health endpoint and unit test
- [x] 🔧 Vue 3 webapp with Tailwind CSS, Vue Router, and Pinia
- [x] 📝 Git conventions documentation (commits, branches, PRs)
- [x] 🔧 CI workflows (lint + tests for API and webapp)
- [x] 📝 CLAUDE.md with project conventions
- [x] 🔧 TypeScript strict mode, no `any`
- [x] ✅ All linters and typecheck passing

---

## 🎯 Acceptance Criteria

- [x] All Docker services start without errors
- [x] `GET /api/v1/health` returns 200
- [x] Webapp renders at `http://localhost:5173`
- [x] Jest API test passes
- [x] ESLint and TypeScript check pass for both projects

---

## 🔗 References

- Stack: NestJS 10 · Vue 3.5 · MongoDB 7 · Tailwind CSS 3 · Pinia · Vue Router · Mongoose · Passport JWT · Swagger
- Global API prefix: `/api/v1`
- Swagger docs: `/api/docs`
- UI language: Spanish · Code language: English

---

## ⏱️ Time

### 📊 Estimates
- **Optimistic:** `45m`
- **Pessimistic:** `1h 30m`
- **Tracked:** `~55m`

### 📅 Sessions
```json
[
  { "date": "2026-04-08", "start": "20:00", "end": "20:55" }
]
```
