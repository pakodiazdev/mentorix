# Branch Naming Convention

This guide establishes the naming convention for Git branches, ensuring consistency and traceability across the project.

---

## Branch Format

```
<type>/<issue>-<short-description>
```

### Components

- **Type**: A prefix that categorizes the purpose of the branch.
- **Issue Number**: The task/issue number from the tracker (zero-padded to 3 digits).
- **Short Description**: A brief, kebab-case description of the work (2-5 words).

---

## Branch Types

| Prefix      | Purpose                                  | Example                              |
| ----------- | ---------------------------------------- | ------------------------------------ |
| `feature/`  | New features or functionality            | `feature/002-group-attendance`       |
| `fix/`      | Bug fixes                                | `fix/015-login-redirect-loop`        |
| `hotfix/`   | Urgent production fixes                  | `hotfix/020-auth-token-expiry`       |
| `refactor/` | Code refactoring without behavior change | `refactor/010-auth-module-cleanup`   |
| `docs/`     | Documentation only                       | `docs/005-api-swagger-annotations`   |
| `test/`     | Adding or updating tests                 | `test/008-attendance-e2e-tests`      |
| `chore/`    | Maintenance, config, tooling             | `chore/003-upgrade-nestjs`           |

---

## Naming Rules

1. **Always use lowercase** — No uppercase letters.
2. **Use kebab-case** — Words separated by hyphens (`-`).
3. **Include issue number** — Zero-pad to 3 digits (e.g., `002` not `2`).
4. **Keep descriptions short** — 2-5 words maximum.
5. **Use English** — All branch names in English.
6. **No special characters** — Only alphanumeric and hyphens.
