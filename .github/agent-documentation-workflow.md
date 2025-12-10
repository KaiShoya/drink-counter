# 📋 Documentation & Task Management

## Directory Structure

This project uses `.agent/` directory for agent-driven documentation management:

```
.agent/
  ├── docs/       # Working documents (QA, tasks, open questions)
  └── specs/      # Source of truth for specifications
```

**Important**: If `.agent/` directory doesn't exist in a project, create it automatically when needed.

## 📝 Documentation Guidelines

### `.agent/docs/` - Working Documents

Use this directory for:
- **QA リスト**: Question & Answer format with categories
  - Format: `## [Category] Question` → `**Answer**: ...`
  - Categories: `[API]`, `[UI]`, `[Architecture]`, `[Testing]`, etc.
- **未決定事項**: Open issues to be resolved in future discussions
  - Format: `- [ ] Issue description (context, impact, options)`
- **タスクリスト**: Development tasks linked to GitHub Issues
  - Format: `- [ ] Task description #issue_number`

**Recommended QA Format**:
```markdown
## [Category] Question Title

**Question**: Detailed question description

**Answer**: Answer with rationale

**Decided on**: YYYY-MM-DD
**Related**: #issue_number (if applicable)
```

### `.agent/specs/` - Specifications (Source of Truth)

This directory contains finalized specifications that represent the **current state** of the system.

**Scope**: Architecture, API design, data models, business logic, and system-wide specifications.

**Not Included**: Component-level and screen-level specifications are managed in custom `<spec>` blocks within component files.

**Critical Rule**: When code changes, `.agent/specs/` MUST be updated accordingly.

## 🔄 Workflow

### During Chat Interactions

1. **Clarify requirements** through Q&A in the conversation
2. **Document decisions** in `.agent/docs/` at natural breakpoints
3. **Update specs** in `.agent/specs/` when decisions are finalized
4. **Link to GitHub Issues** for task tracking

### When Making Code Changes

**ALWAYS follow this sequence**:

1. ✅ Implement the code change
2. ✅ Update relevant `.agent/specs/` files
3. ✅ Mention the spec update in commit message
4. ✅ (For PRs) Include spec changes in the PR description

**Example commit message**:
```
feat: add drink filtering by date range

- Implement filter logic in DrinksRepository
- Update UI components
- Update .agent/specs/drinks-api.md with new endpoint
```

### PR Review Checklist

When creating or reviewing PRs, verify:

- [ ] Code changes are implemented
- [ ] Tests are added/updated
- [ ] `.agent/specs/` is updated if specifications changed
- [ ] Related GitHub Issues are linked
- [ ] Documentation in `.agent/docs/` is updated if needed

## 🤖 Copilot Behavior

### Automatic Spec Update Prompts

When you detect code changes that affect specifications:

1. **Proactively suggest** spec updates
2. **Show a diff** of what needs to be updated
3. **Ask for confirmation** before updating

**Example prompt**:
```
コードを変更しました。以下の仕様ファイルも更新が必要です:

.agent/specs/drinks-api.md:
- [ ] Add new `filterByDateRange` parameter
- [ ] Update response schema

更新しますか?
```

### PR Creation Support

When code changes are ready for PR:

1. **Check** if `.agent/specs/` needs updates
2. **Generate** PR description including:
   - Summary of changes
   - Link to related specs
   - Checklist for reviewers
3. **Verify** GitHub Issue links

### Documentation Maintenance

- **Auto-detect** when discussions resolve open questions in `.agent/docs/`
- **Suggest** moving resolved items to `.agent/specs/`
- **Keep** QA list organized by categories

## 📌 Integration with GitHub Issues

- Tasks in `.agent/docs/` should reference GitHub Issues: `#123`
- Use GitHub Issue templates for consistency
- Update issue status when tasks are completed
- Link PRs to issues automatically: `Closes #123`

## 🎯 Best Practices

1. **Single Source of Truth**: `.agent/specs/` is always up-to-date
2. **Document Why, Not What**: Focus on rationale and context
3. **Keep Docs Lightweight**: Avoid duplicating information
4. **Link, Don't Copy**: Reference existing docs when possible
5. **Version Context**: Include dates and issue numbers for traceability

## 🚨 Common Mistakes to Avoid

- ❌ Updating code without updating specs
- ❌ Creating specs without real implementation
- ❌ Duplicating information across multiple files
- ❌ Forgetting to link GitHub Issues
- ❌ Leaving resolved questions in `.agent/docs/` indefinitely
