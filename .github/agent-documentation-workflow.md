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
- **QA List**: Question & Answer format with categories
  - Format: `## [Category] Question` → `**Answer**: ...`
  - Categories: `[API]`, `[UI]`, `[Architecture]`, `[Testing]`, etc.
- **Open Questions**: Open issues to be resolved in future discussions
  - Format: `- [ ] Issue description (context, impact, options)`
- **Task List**: Development tasks linked to GitHub Issues
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

#### Specifications Available

- **`architecture.md`**: System architecture, technology stack, and layer responsibilities
  - **Reference when**: Adding new features, creating new composables/stores/repositories
  - **Key info**: Directory structure, design patterns, timezone handling, i18n strategy

- **`data-model.md`**: Supabase schema, table definitions, RLS policies, migrations
  - **Reference when**: Working with database operations, verifying type definitions, planning schema changes
  - **Key info**: 5 tables (auth.users, user_settings, drink_labels, drinks, drink_counters), foreign keys, indexes

- **`repository-api.md`**: Repository pattern implementation, CRUD APIs, error handling strategy
  - **Reference when**: Implementing `store/data/` stores, verifying data access methods
  - **Key info**: 4 repositories (Drinks, DrinkLabels, DrinkCounters, UserSettings), method specifications, error handling

- **`state-management.md`**: Pinia store design, global/data/presentation layer responsibilities
  - **Reference when**: Implementing stores, confirming state management strategy
  - **Key info**: Store layout (3-tier architecture), `storeToRefs()` usage, toast message timing

- **`features.md`**: User feature specifications, page structure, UI flows, cross-cutting features
  - **Reference when**: Adding new pages, confirming user flows, understanding feature requirements
  - **Key info**: 8 page specifications (login, home, drinks management, labels management, data analysis, settings), auth flow, error handling flow

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

## 🏗️ Implementation Guidelines

### Store Implementation Pattern

**Responsibility Separation**: Strictly separate Data Stores and Page Stores

#### Data Stores (`store/data/`)
```ts
// Simple CRUD + repository calls
const fetchDrinks = async () => {
  try {
    drinks.value = await $drinksRepository.fetchAll()
  } catch (error) {
    // Simply rethrow (no toast message)
    throw error
  }
}

// Expose state as readonly
return {
  drinks: readonly(drinks),
  fetchDrinks,
}
```

**Rules**:
- ✅ Call repositories directly
- ✅ Rethrow errors as-is
- ✅ Do not display toast messages
- ✅ Expose state as `readonly()`
- ❌ No combining multiple stores
- ❌ No business logic or aggregation

#### Page Stores (`store/pages/`)
```ts
// Combine multiple data stores + error handling + toast display
const fetchData = async () => {
  try {
    showLoading()
    await drinksStore.fetchDrinks()
    // Data aggregation and transformation
  } catch (error) {
    if (error instanceof CustomError) {
      showDangerToast(error.getMessage())
    }
    logger.error('Failed to fetch', { module: 'indexStore' }, error)
  } finally {
    hideLoading()
  }
}
```

**Rules**:
- ✅ Combine multiple data stores
- ✅ Catch errors and display toast
- ✅ Implement aggregation and transformation logic
- ✅ Record logging
- ✅ Manage loading state
- ❌ No direct repository calls
- ❌ No rethrow without error handling

### Error Handling Layer Diagram

```
Component
    ↓ (call store action)
Page Store ← Display toast, log errors
    ↓ (call data store)
Data Store ← Simply rethrow
    ↓ (call repository)
Repository ← Throw CustomError
    ↓
Supabase API
```

**Each Layer's Responsibility**:

1. **Repository** (`app/utils/api/`)
   - Catch Supabase errors
   - Convert to `CustomError` and throw
   - Messages for developers (English)

2. **Data Store** (`store/data/`)
   - Simply rethrow errors
   - No processing (delegate to Page Store)

3. **Page Store** (`store/pages/`)
   - Catch errors
   - Notify users with `showDangerToast()`
   - Log errors with `logger.error()`
   - Reset UI state if needed

4. **Component** (`app/components/`)
   - Call Page Store action
   - Receive user notification via store
   - No direct error handling needed

**Toast Types**:
```ts
showSuccessToast('Operation successful')      // Green
showInfoToast('Information message')          // Blue
showWarningToast('Warning message')           // Yellow
showDangerToast('Error occurred')             // Red
```

**Example**: Delete drink
```ts
// Page Store: deleteAction
const deleteDrink = async (id: number, name: string) => {
  try {
    showLoading()
    await drinksStore.deleteDrink(id)
    showSuccessToast(
      t(LOCALE_DRINKS_DELETE_SUCCESS, { name })
    )
    await fetchDrinks()  // Reload
  } catch (error) {
    if (error instanceof CustomError) {
      showDangerToast(error.getMessage())
    }
    logger.error('Failed to delete drink', 
      { module: 'drinksStore', drinkId: id }, 
      error
    )
  } finally {
    hideLoading()
  }
}
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
