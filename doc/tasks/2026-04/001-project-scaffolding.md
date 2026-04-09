# Task #001 — Project scaffolding and Docker setup

## Description

Initialize the Mentorix monorepo with the full development stack: NestJS API + Vue 3 Webapp + MongoDB, following established development conventions.

## Acceptance Criteria

- [x] Docker Compose with all services running (API, webapp, MongoDB, nginx, mongo-express)
- [x] NestJS API with health endpoint and unit test
- [x] Vue 3 webapp with Tailwind CSS, Vue Router, and Pinia
- [x] Git conventions documentation (commits, branches, PRs)
- [x] CI workflows (lint + tests for API and webapp)
- [x] CLAUDE.md with project conventions
- [x] TypeScript strict mode, no `any`
- [x] All linters and typecheck passing

## Technical Notes

- Stack: NestJS 10 · Vue 3.5 · MongoDB 7 · Tailwind CSS 3 · Pinia · Vue Router · Mongoose · Passport JWT · Swagger
- Global API prefix: `/api/v1`
- Swagger docs: `/api/docs`
- UI language: Spanish · Code language: English

## Time Tracking

| Phase     | Estimated | Actual |
| --------- | --------- | ------ |
| Research  | 15 min    | 15 min |
| Implement | 30 min    | 25 min |
| Test      | 10 min    | 10 min |
| Review    | 5 min     | 5 min  |
| **Total** | **60 min**| **55 min** |
