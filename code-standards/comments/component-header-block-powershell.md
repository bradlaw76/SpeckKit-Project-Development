<#
=============================================================================
DOCUMENT:     Component Header Comment Block — PowerShell Variant
FILE:         code-standards/comments/component-header-block-powershell.md
VERSION:      1.0
AUTHOR:       bradlaw76
LAST UPDATED: 2026-07-19

-----------------------------------------------------------------------------
OVERVIEW
-----------------------------------------------------------------------------
The standard structured comment header template for PowerShell script files
in any SpeckKit-governed project. Mirrors the same sections as the HTML
component-header-block but uses native PowerShell <# #> block comment syntax.

-----------------------------------------------------------------------------
REGISTRY ROLE
-----------------------------------------------------------------------------
- Language-specific variant of component-header-block for .ps1 / .psm1 files.
- Agents MUST use this variant (not the HTML block) for PowerShell files.
- Agent behavior: defaultApply = true (apply without asking).

-----------------------------------------------------------------------------
CHANGELOG
-----------------------------------------------------------------------------
v1.0  2026-07-19  Initial version — PowerShell variant of component-header-block
=============================================================================
#>

# Component Header Comment Block — PowerShell Variant

**Standard:** SpeckKit Code Standards
**ID:** `component-header-block-powershell`
**Version:** 1.0
**Created:** 2026-07-19

---

## Purpose

This is the **PowerShell-native comment header block** for `.ps1` and `.psm1` files in a SpeckKit-governed project. It uses PowerShell `<# #>` block comment syntax and mirrors the same structural sections as the HTML variant, adapted for scripting context.

> **Why a separate variant?**  
> The base `component-header-block.md` uses HTML `<!-- -->` comment syntax, which is invalid in PowerShell. Applying it verbatim to `.ps1` files would break script parsing. This variant preserves the SpeckKit structure while using the correct syntax for the target language.

---

## When to Use

Apply this header to **every PowerShell script** — bootstrap scripts, helpers, test scripts, build scripts, or any `.ps1` / `.psm1` file that implements a discrete piece of functionality.

**Default behavior:** When an agent is building or modifying a PowerShell file, it **MUST use this variant** and **SHOULD apply it automatically** unless the user explicitly opts out.

---

## Template

Copy the block below and fill in the bracketed values:

```powershell
<#
=============================================================================
SCRIPT:       [Script Name]
FILE:         [repo-path/to/script.ps1]
VERSION:      X.X.X
AUTHOR:       [Owner / Team]
LAST UPDATED: YYYY-MM-DD
ENVIRONMENT:  [e.g., Power Platform | Azure | Local Dev | CI/CD]

-----------------------------------------------------------------------------
OVERVIEW
-----------------------------------------------------------------------------
[1–2 sentence description of what this script does and why it exists.
Example: Bootstraps a new SpeckKit-governed project by scaffolding required
files and connecting to the registry submodule.]

-----------------------------------------------------------------------------
ARCHITECTURE
-----------------------------------------------------------------------------
- Script Type:      [Bootstrap | Helper | Build | Test | Utility]
- Execution Model:  [Interactive | Non-interactive | Called by other scripts]
- Dependencies:     [Modules, external tools, other scripts this calls]
- Output:           [Files created, values returned, side effects]

-----------------------------------------------------------------------------
PARAMETERS
-----------------------------------------------------------------------------
- [ParameterName]:  [Type] — [Description. Required/Optional. Default: value]
- [ParameterName]:  [Type] — [Description. Required/Optional. Default: value]

-----------------------------------------------------------------------------
FEATURES
-----------------------------------------------------------------------------
- [Feature or step 1 — e.g., Validates prerequisites before execution]
- [Feature or step 2 — e.g., Prompts user for profile selection]
- [Feature or step 3 — e.g., Scaffolds files from registry templates]

-----------------------------------------------------------------------------
PREREQUISITES
-----------------------------------------------------------------------------
1. PowerShell [minimum version, e.g., 7.x]
2. [Module name] installed — Install-Module [name]
3. [External tool or CLI, e.g., Git, az CLI, pac CLI]
4. [Required environment variable or credential]

-----------------------------------------------------------------------------
SECURITY
-----------------------------------------------------------------------------
- Auth Model:       [e.g., Service principal | Interactive login | None]
- Secrets:          [How secrets are handled — env vars, Key Vault, none]
- Scope:            [e.g., Least-privilege — read-only to registry repo]
- Sensitive Output: [Does this script log or output anything sensitive?]

-----------------------------------------------------------------------------
KNOWN LIMITATIONS
-----------------------------------------------------------------------------
- [Example: Requires internet access to pull registry submodule]
- [Example: Does not support parallel execution]

-----------------------------------------------------------------------------
TEST CASES
-----------------------------------------------------------------------------
✔ Runs without errors on clean environment
✔ Produces expected output files/folders
✔ Handles missing prerequisites gracefully
✔ Idempotent — safe to run multiple times

-----------------------------------------------------------------------------
CHANGELOG
-----------------------------------------------------------------------------
vX.X.X  YYYY-MM-DD  [Short, precise description of change]
vX.X.X  YYYY-MM-DD  [Short, precise description of change]
vX.X.X  YYYY-MM-DD  Initial version

-----------------------------------------------------------------------------
NON-NEGOTIABLES (Script Contract)
-----------------------------------------------------------------------------
- Do NOT remove prerequisite validation steps.
- Do NOT hardcode credentials or secrets.
- Changes must be additive unless version increment approved.
- Maintain idempotency — script must be safe to re-run.
=============================================================================
#>
```

---

## Minimal Variant (for short utility scripts)

For small helper scripts where the full block is disproportionate, use this condensed form:

```powershell
<#
.SYNOPSIS   [One-line summary]
.DESCRIPTION
    [What this script does.]
.PARAMETER  [Name]
    [Description]
.NOTES
    SpeckKit-governed | Version: X.X.X | Author: [name] | Updated: YYYY-MM-DD
#>
```

> **When to use minimal:** Scripts under ~50 lines or single-purpose utilities. Use the full block for anything that is part of the core scaffold, build, or test pipeline.

---

## Applicability

| File Type | Use This Variant |
|-----------|-----------------|
| `.ps1` scripts | ✅ Always |
| `.psm1` modules | ✅ Always |
| `.psd1` manifests | ✅ Condensed form |
| `.html`, `.js`, `.tsx` | ❌ Use `component-header-block.md` instead |
