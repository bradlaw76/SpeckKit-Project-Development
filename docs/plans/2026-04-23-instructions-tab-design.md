# Instructions Tab Design

**Date:** 2026-04-23  
**Status:** Approved

## Summary

Add a new **Instructions** nav tab to the SpeckKit dashboard surfacing the Spec Kit + Squad combined workflow. The tab contains two inner sub-tabs: a static **Reference** page and an interactive **Checklist** tracker.

## Section 1 — Navigation & Routing

- New `Instructions` nav link added between Standards and Setup:
  `Dashboard | Standards | Instructions | 🛠️ Setup`
- New route: `/instructions` → `Instructions.tsx`
- No changes to existing routes or pages

## Section 2 — Page Structure

`Instructions.tsx` renders a sub-tab bar at the top with two tabs:

### Reference Tab
Static, scrollable content in four sections:
1. **Overview** — "Spec Kit owns what, Squad owns who" summary + setup commands
2. **Pipeline phases** — Phase 1–4 tables and code blocks
3. **When to use each tool alone** — decision table
4. **Integration rules + Common mistakes** — two small tables

### Checklist Tab
- One collapsible card per pipeline phase (4 cards total)
- Checkboxes per card (see Section 3)
- State persisted in `localStorage` keyed by project name
- **Reset** button clears all progress for the current project key
- No backend required

## Section 3 — Checklist Items

### Phase 1: Specify
- [ ] Run `specify init`
- [ ] Run `squad init`
- [ ] Seed `.squad/decisions.md` from constitution principles
- [ ] Run `/speckit.specify`
- [ ] Run `/speckit.clarify`
- [ ] Run `/speckit.plan`
- [ ] Run `/speckit.tasks`

### Phase 2: Route
- [ ] Map task categories to agents in `.squad/routing.md`
- [ ] Identify dependency-free tasks for parallel execution
- [ ] Run `/speckit.taskstoissues`

### Phase 3: Execute
- [ ] Design Review ceremony completed (if 2+ agents on shared systems)
- [ ] Agents spawned for parallel task groups
- [ ] Decisions written to `.squad/decisions/inbox/`
- [ ] `squad watch` activated (Ralph polling)

### Phase 4: Validate
- [ ] Run `/speckit.checklist`
- [ ] Run `/speckit.analyze`
- [ ] Agent learnings confirmed in `.squad/agents/<name>/history.md`

## Files to Create / Modify

| Action | File |
|--------|------|
| Create | `dashboard/src/pages/Instructions.tsx` |
| Modify | `dashboard/src/App.tsx` — add route + nav link |

## Non-Goals
- No backend persistence (localStorage is sufficient)
- No editing of reference content from the UI
- No per-task notes or comments on checklist items
