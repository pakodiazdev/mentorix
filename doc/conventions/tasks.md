# Task Template

## Task Format

```markdown
# Task #NNN — Title

## Description
Brief description of the task.

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Technical Notes
Implementation details, constraints, or references.

## Time Tracking
| Phase     | Estimated | Actual |
| --------- | --------- | ------ |
| Research  |           |        |
| Implement |           |        |
| Test      |           |        |
| Review    |           |        |
| **Total** |           |        |
```

## Task Numbering

- Tasks are numbered sequentially with 3-digit zero-padding: `#001`, `#002`, etc.
- Each task corresponds to a GitHub issue with the same number.
- Task files are stored by month: `doc/tasks/YYYY-MM/NNN-task-name.md`

## Task Lifecycle

1. **Backlog** → `doc/tasks/backlog/`
2. **In Progress** → `doc/tasks/YYYY-MM/`
3. **Done** — Tracked via GitHub issue close + PR merge
