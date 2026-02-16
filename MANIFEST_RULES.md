# System Manifest Rules

## Registry Rules

1. Every project MUST include `SYSTEM_MANIFEST.json.md` at repo root.
2. Every project MUST be listed in `/system-manifests/MANIFEST_INDEX.json.md`.
3. SpeckKit reviews are not permitted without a manifest.
4. `MANIFEST_INDEX.json.md` is the authoritative registry.
5. Manifests are descriptive, not binding specifications.

## Shared Resources

6. The **Code Standards Catalog** (`/code-standards/`) provides reusable documentation templates. Agents auto-apply these by default.
7. The **UI Reference Catalog** (`/ui-references/`) provides reusable UI description models. Agents ask before loading these.
8. Agent behavior defaults are defined in `AGENT_BEHAVIOR_DEFAULTS.jsonc` at repo root.

## Consumer Project Setup

9. To connect any VS Code project to this registry, follow `SETUP_FOR_PROJECTS.md`.
10. Consumer projects MUST create `.github/copilot-instructions.md` and `SYSTEM_MANIFEST.json.md` as specified in the setup guide.
