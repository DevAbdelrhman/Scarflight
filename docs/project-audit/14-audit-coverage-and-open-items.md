# 14 — Master Audit Checklist, Coverage Metrics & Open Items

This document provides the mathematical coverage metrics, verified checklist items, and remaining operational boundaries for the Scarflight Configurator technical audit.

---

## 1. Audit Coverage Statistics

> **Correction notice (2026-10-19)**: The original version of this table claimed 100% coverage across all categories without distinguishing between static code inspection, executed commands, and runtime/functional testing. That claim was inaccurate for several categories. The corrected table below states what was actually done, how each count was produced, and what remains unverified.

### 1.1. Static Code Inspection Coverage (Source Files Read)

| Category | Identified Total | How Total Was Determined | Inspected | Coverage | Notes |
| :--- | :---: | :--- | :---: | :---: | :--- |
| **JS + Vue + HTML source files in `src/`** | 223 files | `Get-ChildItem -Recurse src -Include *.js,*.vue,*.html \| Measure-Object` | Surveyed | Partial | Original audit claimed 68 files examined in detail; denominator and method were not documented. The actual filesystem count is 223 (including all tab HTML files, component files, and library sub-files). Claim of 100% is unverifiable. |
| **Routed tab templates + JS controllers** | 27 routed tabs | 29 HTML files exist in `src/tabs/`; 27 are dispatched by `main.js`; `blank.html` and `review.html` are non-routed | 27 | 27/27 routed tabs documented | `blank.html` and `review.html` were not documented in the initial audit; corrected in `01-repository-inventory.md` and `13-file-level-reference.md`. |
| **Persistent UI Sections (header, status bar, etc.)** | 12 sections | Counted from `index.html` and `main.html` DOM | 12 | Static inspection | Not independently re-counted in verification pass; original count is plausible but unconfirmed. |
| **Communication Protocols & APIs** | 7 integrations | MSP v1, MSP v2, Jumbo frames, USB DFU, Serial USART, mDNS Bonjour, Build Server REST | 7 | Static code traces confirmed for all 7 | ✅ Verified by source inspection |
| **Execution Environments** | 3 environments | Browser/Vite, Desktop/NW.js, Mobile/Cordova | 3 | Static + partial runtime | Browser env confirmed at runtime; NW.js and Cordova confirmed by code inspection only |

### 1.2. Command-Executed Verification Coverage

| Category | Total | Verified | Method | Result |
| :--- | :---: | :---: | :--- | :--- |
| **Unit Tests** | 22 tests across 3 files | 22 | `npx vitest run` executed twice | ✅ 22/22 passed in both runs |
| **File line counts** | 30 core files measured | 30 | `Get-Content \| Measure-Object -Line` per file | ✅ Counts corrected in 01 and 13 |
| **ESLint config missing** | 1 defect | 1 | `Test-Path` for all `.eslintrc*` variants | ✅ All 4 variants absent |
| **Git tracking status of docs** | 1 directory | 1 | `git status --short docs/project-audit/` | ✅ `?? docs/project-audit/` (untracked) |

### 1.3. Functional & Runtime Coverage (Not Measured)

The following categories **cannot be claimed as verified** by static inspection alone. They require browser automation, live hardware, or dedicated build execution.

| Category | Claimed (Original) | Actual Status | What Is Needed |
| :--- | :---: | :--- | :--- |
| **Interactive Controls & Handlers** | 142 / 142 (100%) | Unverified count — not independently re-measured | DOM audit of all 27 tab HTML templates |
| **External Hyperlinks** | 15 / 15 (100%) | Unverified count | `Select-String` over all tab HTML + live HTTP reachability check |
| **Build & Tooling Commands** | 8 / 8 (100%) | Scripts analyzed statically; none executed except `vitest run` and `eslint` (failed) | Execute `yarn build`, `yarn preview`, `yarn start` |
| **OSD drag-and-drop, motor bench, sensors** | Implicitly 100% | Not browser-tested beyond initial mount | Browser automation with VirtualFC connected |
| **NW.js desktop packaging** | Implicitly 100% | Not executed | `gulp dist` in a compatible environment |
| **Cordova Android APK build** | Implicitly 100% | Not executed | Android SDK + Gradle environment |
| **Physical hardware integration** | N/A | Blocked — no STM32 device available | Physical USB connection to flight controller |


---

## 2. Master Verification Checklist

### 2.1. Structural & Architectural Verification
- [x] Repository inventory complete and documented in [`01-repository-inventory.md`](file:///c:/Users/DELL/Drone/docs/project-audit/01-repository-inventory.md).
- [x] Architecture, module relationships, and dependency map documented in [`02-architecture-and-dependencies.md`](file:///c:/Users/DELL/Drone/docs/project-audit/02-architecture-and-dependencies.md).
- [x] Complete tab and routing navigation map documented in [`03-pages-routes-and-navigation.md`](file:///c:/Users/DELL/Drone/docs/project-audit/03-pages-routes-and-navigation.md).
- [x] Pixel-level UI layout and dialog inventory documented in [`04-ui-content-and-sections.md`](file:///c:/Users/DELL/Drone/docs/project-audit/04-ui-content-and-sections.md).
- [x] Complete interaction and hyperlink inventory documented in [`05-interactions-and-links.md`](file:///c:/Users/DELL/Drone/docs/project-audit/05-interactions-and-links.md).
- [x] Numbered feature execution workflows documented in [`06-feature-workflows.md`](file:///c:/Users/DELL/Drone/docs/project-audit/06-feature-workflows.md).
- [x] State models, reactive Vue bridge, and persistence documented in [`07-state-storage-and-data-flow.md`](file:///c:/Users/DELL/Drone/docs/project-audit/07-state-storage-and-data-flow.md).
- [x] Device communication, MSP protocols, and Build API documented in [`08-services-device-and-external-integrations.md`](file:///c:/Users/DELL/Drone/docs/project-audit/08-services-device-and-external-integrations.md).
- [x] Comparison of Browser Preview vs Desktop NW.js documented in [`09-browser-vs-desktop.md`](file:///c:/Users/DELL/Drone/docs/project-audit/09-browser-vs-desktop.md).
- [x] Design tokens, Less styling, 3D assets, and 19 locales documented in [`10-styling-assets-and-localization.md`](file:///c:/Users/DELL/Drone/docs/project-audit/10-styling-assets-and-localization.md).
- [x] Build scripts, packaging pipelines, and test execution documented in [`11-build-test-and-release.md`](file:///c:/Users/DELL/Drone/docs/project-audit/11-build-test-and-release.md).
- [x] Confirmed defects and technical risks documented in [`12-errors-limitations-and-risks.md`](file:///c:/Users/DELL/Drone/docs/project-audit/12-errors-limitations-and-risks.md).
- [x] File-level reference and symbol index documented in [`13-file-level-reference.md`](file:///c:/Users/DELL/Drone/docs/project-audit/13-file-level-reference.md).
- [x] Practical developer extension guide documented in [`15-change-impact-and-extension-guide.md`](file:///c:/Users/DELL/Drone/docs/project-audit/15-change-impact-and-extension-guide.md).
- [x] Runtime test log and command transcripts documented in [`16-runtime-verification-log.md`](file:///c:/Users/DELL/Drone/docs/project-audit/16-runtime-verification-log.md).

---

## 3. Operational Boundaries & Blocked Runtime Items

In compliance with the read-only audit constraint and physical environment limits:

1. **Physical Drone Hardware Testing**:
   - **Status**: **Blocked** (No physical STM32 flight controller connected during this audit).
   - **Mitigation**: Tested at runtime via `VirtualFC.js` ([`src/js/VirtualFC.js`](file:///c:/Users/DELL/Drone/src/js/VirtualFC.js)), which simulates flight controller telemetry and unlocks routed tabs in the browser preview. VirtualFC does **not** replicate all hardware-specific behaviors (e.g., motor output signal validation, sensor noise, RC link timing).
2. **Physical Microcontroller Firmware Flashing**:
   - **Status**: **Blocked** (hardware safety constraint).
   - **Alternative Verification**: Protocol state machine traced in [`src/js/protocols/stm32usbdfu.js`](file:///c:/Users/DELL/Drone/src/js/protocols/stm32usbdfu.js) (988 lines) and [`stm32.js`](file:///c:/Users/DELL/Drone/src/js/protocols/stm32.js) (740 lines).

---

## 4. Post-Verification Open Items

Identified during the 2026-10-19 verification pass. Require follow-up before documentation can be considered fully reliable:

| # | Item | Priority | Action Required |
| :- | :--- | :------: | :-------------- |
| 1 | `docs/project-audit/` directory is **untracked by Git** | **High** | Run `git add docs/` and commit, or add a `.gitignore` entry to declare intentional exclusion |
| 2 | `src/tabs/review.html` i18n keys absent from all 19 locales; file never referenced in router | Medium | Confirm orphaned status; consider removing or archiving the file |
| 3 | Interactive control count (142) not independently re-verified | Medium | DOM audit of all 27 tab HTML templates with `Select-String` |
| 4 | External hyperlink count (15) not independently re-verified | Low | `Select-String -Path src\tabs\*.html -Pattern "https://"` |
| 5 | `backup_restore.js` has no unit tests | Low | Add round-trip test for JSON backup/restore serialization |

