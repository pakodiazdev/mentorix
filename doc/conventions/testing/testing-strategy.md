# Testing Strategy

## Test Pyramid

```
         ╱  E2E (Cypress)  ╲       ← Happy path only
        ╱  Component (Vitest) ╲    ← Vue component behavior
       ╱     Unit (Jest/Vitest)  ╲ ← Business logic, services
```

### Backend (NestJS — Jest)

- **Unit tests**: Services, guards, pipes, interceptors
- **E2E tests**: Full HTTP request lifecycle (controllers + database)
- Run: `npm run test` / `npm run test:e2e`

### Frontend (Vue 3 — Vitest)

- **Unit tests**: Composables, utility functions, stores
- **Component tests**: Vue components with `@vue/test-utils`
- Run: `npm run test` / `npm run test:cov`

### E2E (Cypress — future)

- Happy path only — errors and edge cases in unit/component tests
- Run against the full Docker stack

---

## Coverage Requirements

- **Minimum 80%** on new code (backend + frontend)
- Coverage reports generated with `--coverage` flag

---

## Naming Convention

- Test files: `*.spec.ts` (backend) / `*.test.ts` (frontend)
- Describe blocks match the class/function name
- Test names use `should + expected behavior`
