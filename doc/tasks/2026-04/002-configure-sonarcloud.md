# Task #002 — Configure SonarCloud for monorepo

## 📖 Story

As a developer, I need SonarCloud integrated into the CI pipeline for both API and Webapp projects, so that code quality and coverage are automatically tracked on every PR and push.

---

## ✅ Technical Tasks

- [x] 🔧 Create `sonar-project.properties` for API (`code/api/`)
- [x] 🔧 Create `sonar-project.properties` for Webapp (`code/webapp/`)
- [x] 🔧 Create GitHub Actions workflow for API SonarCloud analysis
- [x] 🔧 Create GitHub Actions workflow for Webapp SonarCloud analysis
- [x] 🔧 Add explicit `lcov` coverage reporter to API Jest config
- [x] 🌐 Create two SonarCloud projects (API + Webapp) in organization
- [x] 🔑 Configure `SONAR_TOKEN_API` and `SONAR_TOKEN_WEBAPP` secrets in GitHub

---

## 🎯 Acceptance Criteria

- [x] SonarCloud analysis runs on push to `main`/`develop` for both projects
- [x] SonarCloud analysis runs on PRs that modify `code/api/**` or `code/webapp/**`
- [x] Coverage reports (lcov) are sent to SonarCloud
- [x] Each sub-project has its own SonarCloud project with independent metrics

---

## 🔗 References

- SonarCloud organization: `jfcodiaz`
- API project key: `jfcodiaz_mentorix-api`
- Webapp project key: `jfcodiaz_mentorix-webapp`
- Action: `SonarSource/sonarqube-scan-action@v5`

---

## ⏱️ Time

### 📊 Estimates
- **Optimistic:** `20m`
- **Pessimistic:** `45m`
- **Tracked:** `~25m`

### 📅 Sessions
```json
[
  { "date": "2026-04-09", "start": "00:00", "end": "00:25" }
]
```
