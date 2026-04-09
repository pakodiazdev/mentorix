# 📑 Instructions: How to Fill Task Template

Use the following structure to describe and track each task.
Replace placeholders with actual task details.

---

## 1. Title
- Format: **Short, action-oriented, with emoji**.
  Example:
  - `# 🐳 Initialize basic monorepo structure`
  - `# 🔒 Add authentication middleware`

---

## 2. Story
- Write in **user story format**:
  ```
  As a [role], I need [action/goal], so that [benefit].
  ```
- Keep it short and clear.
  Example:
  > As a developer, I need to set up a monorepo so that future modules can be versioned and maintained consistently.

---

## 3. Technical Tasks
- List **technical steps** as checklist items.
- Use `[ ]` for pending, `[x]` for done.
- Prefix with relevant emoji if useful:
  - 📂 for folder/file actions
  - 🔧 for implementation
  - 🧪 for testing
  - 📝 for documentation
- Example:
  ```
  - [ ] 📂 Create repository
  - [ ] 🗂️ Initialize folder structure
  - [ ] 🔧 Configure CI/CD pipeline
  ```

---

## 4. Time Tracking

### Estimates
- Define three values in hours:
  - **Optimistic:** minimum time if everything goes well.
  - **Pessimistic:** maximum time if issues appear.
  - **Tracked:** actual time spent.

### Sessions
- Log working sessions in JSON format:
  ```json
  [
    { "date": "YYYY-MM-DD", "start": "HH:MM", "end": "HH:MM" }
  ]
  ```
- Add multiple objects for multiple sessions.

---

## 5. Task Numbering

- Tasks are numbered sequentially with 3-digit zero-padding: `#001`, `#002`, etc.
- Each task corresponds to a GitHub issue with the same number.
- Task files are stored by month: `doc/tasks/YYYY-MM/NNN-task-name.md`

---

## 6. Task Lifecycle

1. **Backlog** → `doc/tasks/backlog/`
2. **In Progress** → `doc/tasks/YYYY-MM/`
3. **Done** — Tracked via GitHub issue close + PR merge

---

## ✅ Example (for reference)

```markdown
# 🛡️ Implement authentication middleware

## 📖 Story
As a developer, I need to add authentication middleware so that only authorized users can access protected routes.

---

## ✅ Technical Tasks
- [x] 🔧 Create middleware file
- [ ] 📝 Write unit tests
- [ ] 📂 Register middleware in project config

---

## ⏱️ Time

### 📊 Estimates
- **Optimistic:** `2h`
- **Pessimistic:** `5h`
- **Tracked:** `3h 30m`

### 📅 Sessions
```json
[
  { "date": "2025-09-28", "start": "10:00", "end": "11:30" },
  { "date": "2025-09-28", "start": "14:00", "end": "16:00" }
]
```
```
