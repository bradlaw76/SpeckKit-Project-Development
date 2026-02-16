<!--
=============================================================================
DOCUMENT:     System Manifest Rules
FILE:         MANIFEST_RULES.md
VERSION:      1.1
AUTHOR:       bradlaw76
LAST UPDATED: 2026-02-16

-----------------------------------------------------------------------------
OVERVIEW
-----------------------------------------------------------------------------
Defines the 10 binding rules for the SpeckKit Manifest Registry — covering
project manifests, shared resources (code standards, UI references), agent
behavior defaults, and consumer project setup requirements.

-----------------------------------------------------------------------------
REGISTRY ROLE
-----------------------------------------------------------------------------
- Governance document — every project and agent must comply.
- Referenced by MANIFEST_INDEX.json.md and README.md.
- Rules are additive; new capabilities add new rules.

-----------------------------------------------------------------------------
CHANGELOG
-----------------------------------------------------------------------------
v1.1  2026-02-16  Expanded from 5 to 10 rules (code standards, UI refs,
                  agent behavior, consumer setup)
v1.0  2026-02-10  Initial version — 5 registry rules
=============================================================================
-->

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
