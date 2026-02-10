# SpeckKit Manifest Registry

**Authoritative Registry for Spec-Governed Projects**

**Repository:** `SpeckKit-Project-Development`
**Registry Path:** `/system-manifests/`
**Registry File:** `MANIFEST_INDEX.json.md`
**Governance Status:** **ACTIVE & BINDING**
**Effective Date:** February 10, 2026
**Authority:** SpeckKit Project Development

---

## Executive Summary

This repository hosts the **SpeckKit Manifest Registry**, the authoritative portfolio-level governance system for all SpeckKit-managed projects.

The registry provides:

* A **single source of truth** for all projects
* Deterministic project discovery for SpeckKit
* Governance, compliance, and lifecycle enforcement
* Portfolio-level review without repository crawling
* A permanent audit trail for system evolution

> **If a project is not in the registry, it does not exist for SpeckKit.**

---

## Core Mental Model

SpeckKit operates with **two strictly separated layers**:

### 1️⃣ Registry Layer (This Repository)

**Purpose:** Discovery, governance, routing
**Scope:** Portfolio-level only
**Never contains:** Specs, UX rules, code, logic

### 2️⃣ Project Layer (Individual Repositories)

**Purpose:** Describe and govern one system
**Scope:** System-level behavior and review rules
**Never assumes:** Knowledge of other projects

```
Registry answers: “What systems exist?”
Project answers:  “What is this system?”
```

---

## Repository Structure

```
SpeckKit-Project-Development/
├── system-manifests/
│   ├── MANIFEST_INDEX.json.md   ← Authoritative registry
│   └── REGISTRY_LOCK.md         ← Binding governance rules
├── MANIFEST_RULES.md            ← Registry usage rules
└── README.md                    ← This document
```

---

## Registry Files (Authoritative)

### `MANIFEST_INDEX.json.md`

The **only** file SpeckKit uses to discover projects.

Responsibilities:

* Lists all registered projects
* Points to each project’s `SYSTEM_MANIFEST.json.md`
* Declares lifecycle status and review eligibility
* Enables registry-based project review

Constraints:

* JSON-MD format (machine + human readable)
* No specs, no UX, no code
* No implied projects

---

### `REGISTRY_LOCK.md`

A **binding governance contract**.

Defines:

* Mandatory registry rules
* Compliance requirements
* Approval and audit policies
* Enforcement and violation handling

Once active, **registry rules override project preference**.

---

## Project-Level Requirements (All Projects)

Every registered project **MUST** contain the following at repo root:

```
<Project Repo>/
├── SYSTEM_MANIFEST.json.md   ← REQUIRED
├── SPEC.md                   ← If spec-governed
├── UX_INVARIANTS.md           ← If UX is reviewed
├── TEST_ACCEPTANCE.md         ← If demo / UX flows exist
├── BINDING_CERTIFICATION.md   ← Recommended
```

---

### `SYSTEM_MANIFEST.json.md` (Critical)

This file is the **only contract** between a project and the registry.

Mandatory registry backlink:

```jsonc
"registry": {
  "indexUrl": "https://github.com/bradlaw76/SpeckKit-Project-Development/blob/main/system-manifests/MANIFEST_INDEX.json.md",
  "projectId": "lowercase-hyphen-id"
}
```

Without this:

* Registry review fails
* Portfolio review is blocked
* Project is considered orphaned

---

## How SpeckKit Uses the Registry

### Registry Review (Portfolio Governance)

Run from this repository:

```
/speckit.registry.review Review manifest registry at /system-manifests/MANIFEST_INDEX.json.md
```

Validates:

* Registry structure
* URL integrity
* Project uniqueness
* Manifest accessibility
* Governance alignment

Does **not** inspect project code or specs.

---

### Project Review (Direct)

Run inside a project repo:

```
/speckit.review Review system using SYSTEM_MANIFEST.json.md
```

Used for local, system-focused work.

---

### Project Review (Registry-Routed – Recommended)

Run from the registry repo:

```
/speckit.review project <projectId>
```

Flow:

1. Read registry
2. Resolve project
3. Fetch project manifest
4. Review **only declared scope**

This is the safest and most scalable mode.

---

## Creating a New Project (Mandatory Process)

### Step 1 — Create Project Repository

Standard GitHub repo creation.

---

### Step 2 — Create `SYSTEM_MANIFEST.json.md`

Minimum viable manifest:

```jsonc
{
  "system": {
    "name": "Project Name",
    "version": "0.1.0",
    "status": "DEVELOPMENT",
    "type": "demo | hybrid | production"
  },
  "purpose": {
    "summary": "What this system does",
    "nonGoals": []
  },
  "architecture": {
    "runtime": "",
    "state": ""
  },
  "registry": {
    "indexUrl": "https://github.com/bradlaw76/SpeckKit-Project-Development/blob/main/system-manifests/MANIFEST_INDEX.json.md",
    "projectId": "new-project-id"
  },
  "review": {
    "speckitEnabled": true,
    "scope": ["spec", "ux", "acceptance"]
  }
}
```

Commit to project repo.

---

### Step 3 — Register the Project

Edit `system-manifests/MANIFEST_INDEX.json.md`:

```jsonc
{
  "id": "new-project-id",
  "name": "Project Name",
  "repo": "https://github.com/bradlaw76/<repo>",
  "manifestUrl": "https://github.com/bradlaw76/<repo>/blob/main/SYSTEM_MANIFEST.json.md",
  "type": "demo-hybrid",
  "status": "DEVELOPMENT",
  "speckitReviewable": true
}
```

Commit with:

```
[REGISTRY] Add project: new-project-id
```

---

### Step 4 — Validate Registry

```
/speckit.registry.review Review manifest registry at /system-manifests/MANIFEST_INDEX.json.md
```

---

### Step 5 — Review the Project

```
/speckit.review project new-project-id
```

---

## Registry Rules (Enforced)

* Project IDs must be lowercase-hyphen
* IDs are immutable
* Versions must follow semantic versioning
* ACTIVE projects require:

  * 100% compliance
  * 100% test pass rate
* Registry is append-only (history preserved)
* Audit trail required for all changes

See **REGISTRY_LOCK.md** for full enforcement details.

---

## Lifecycle States

Allowed project statuses:

```
DEVELOPMENT
ACTIVE
INACTIVE
DEPRECATED
ARCHIVED
```

Lifecycle flow:

```
DEVELOPMENT → ACTIVE → INACTIVE / DEPRECATED → ARCHIVED
```

---

## What This Repository Never Does

* Stores specs
* Reviews code
* Defines UX behavior
* Makes architectural decisions

It governs **existence, discoverability, and compliance only**.

---

## Why This Works

* Deterministic AI review
* Zero repo crawling
* Explicit scope control
* Portfolio-scale governance
* Human-readable + machine-enforced

---

## Final Authority Statement

This registry is **binding** on all SpeckKit-managed projects.

Any project not listed here:

* Is invisible to SpeckKit
* Cannot be reviewed
* Is considered non-governed

**Status:** ACTIVE & ENFORCING
**Next Review:** Q2 2026
Just say the word.
