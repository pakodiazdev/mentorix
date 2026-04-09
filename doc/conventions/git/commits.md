# Commit Nomenclature Guide

This guide details the commit nomenclature adopted, inspired by the [Conventional Commits](https://www.conventionalcommits.org) standard. The incorporation of emojis not only simplifies and makes the process more attractive and fun but also maintains the advantages of the original convention with clear visual integration.

## Commit Format

Each commit follows this general format:

```
:emoji [#issue] - description :emoji

- :emoji Activity 1
- :emoji Activity 2
- :emoji Activity 3
```

### Components

- **Initial Emoji**: Represents the type of commit, making the commits visually distinctive and easily identifiable.
- **Issue Number**: Enclosed in brackets, preceded by `#`, zero-padded to 3 digits (e.g., `#001`, `#030`).
- **Dash**: Mandatory separator (` - `) between issue and description.
- **Description**: Concise imperative mood summary, no period at end.
- **Ornamental Final Emoji**: A decorative element related to the content of the commit.
- **Body Bullets**: Each activity must start with an emoji — plain `- text` is not allowed.

---

## Types of Commit and Corresponding Emojis

- ✨ - New features, equivalent to `feat`.
- 🐛 - Bug fixes, equivalent to `fix`.
- 📚 - Documentation, equivalent to `docs`.
- 🎨 - Style changes that do not affect the meaning of the code, equivalent to `style`.
- 🔨 - Code refactorizations, equivalent to `refactor`.
- 🚀 - Performance improvements, equivalent to `perf`.
- ✅ - Adding tests, equivalent to `test`.
- 🔧 - Configuration changes or minor tasks, equivalent to `chore`.

---

## Example of Commit Message

```
✨ [#001] - Implement project scaffolding 🏗️

- 🐳 Created Docker setup with NestJS, Vue 3, MongoDB
- 📁 Initialized NestJS API with health endpoint
- 🎨 Created Vue 3 webapp with Tailwind CSS
- 📚 Added project conventions documentation
```

---

## Traceability Tags (User Story & Requirements)

When a commit addresses a specific **user story** or **functional requirement**, include traceability tags in the commit body right after the subject line, before the activity list.

```
✨ [#016] - Implement group attendance tracking 📋

Story: MX-002 · As a teacher, I want to track attendance for my groups
Refs:  RF-01 · Register daily attendance per group

- 🗂️ Created attendance module structure
- 📦 Added AttendanceSchema with Mongoose
- 🧪 Implemented unit tests
```

**Language rule:** Always use the **English** version of the text. Commits are written in English.
