# Pull Request Convention

This guide establishes the format for PR titles and descriptions.

---

## PR Title Format

```
:emoji [#issue] - Short description
```

### Title Examples

```
✨ [#002] - Group attendance tracking API + Frontend
🐛 [#015] - Fix duplicate student validation on creation
🔨 [#010] - Refactor auth module to use Pinia store
```

---

## PR Description Template

```markdown
## 📋 Summary

Brief description of what this PR accomplishes (1-3 sentences).

---

## 🚀 Commits

1. **abc1234** ✨ Commit message 1
2. **def5678** 🔨 Commit message 2

---

## ✅ What's Included

### Backend (NestJS)

- Bullet points describing API changes
- New endpoints, schemas, modules

### Frontend (Vue 3)

- UI components added/modified
- New views, composables, services

---

## ⚠️ Breaking Changes (if any)

- Description of breaking changes

---

## 🧪 Testing

- [ ] Unit tests pass
- [ ] E2E tests pass (if applicable)
- [ ] Manual testing completed

---

## 🔗 References

- **Task**: #NNN
```

---

## Navigability Rule

Every PR must be self-contained: a reviewer should understand **what changed and why** without leaving the PR page.
