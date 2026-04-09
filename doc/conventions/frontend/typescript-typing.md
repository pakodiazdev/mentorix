# TypeScript Strict Typing Convention

**Never use `any` in TypeScript code. Always use specific types or `unknown`.**

---

## Rules

```ts
// ✅ Correct — use specific types or unknown
onError: (error: unknown) => {
  console.error('Operation failed', error)
}

// For array callbacks, import and use the actual type:
import type { Student } from '@/types/student'
students.map((s: Student) => s.name)

// For dynamic objects where shape is truly unknown:
const meta: Record<string, unknown> = {}

// ❌ Wrong — avoid any
onError: (error: any) => { ... }
items.map((item: any) => item.name)
const data: any = response
```

---

## Common Patterns

| Scenario               | Type to use                          |
| ---------------------- | ------------------------------------ |
| Error in catch/onError | `unknown` + type guard               |
| Array callback         | Import specific type from `@/types/` |
| Event handler value    | `string \| number` or specific union |
| API response data      | Define interface in `@/types/`       |
| JSON meta fields       | `Record<string, unknown>`            |

---

## PR Requirement

Reviewers must reject any code containing `any`. Run `npm run lint` to catch violations.
