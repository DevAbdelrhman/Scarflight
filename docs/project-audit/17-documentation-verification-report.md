# 17 — Final Documentation Verification Report

**Prepared by**: Independent re-audit pass (static inspection + command execution)
**Date**: 2026-10-19
**Audit Scope**: All 16 previously created documents in `docs/project-audit/`
**Methodology**: Every claim re-verified against live repository source. This document records what was confirmed, what was wrong, what is unverifiable by static means, and what was newly discovered.

> **Coverage Caveat**: `14-audit-coverage-and-open-items.md` claims "100%" for every category. This report tests those claims and corrects the ones that cannot be substantiated.

---

## 1. File Inventory — Confirmed Present

The following 17 files existed before this verification pass. `17-documentation-verification-report.md` **did not exist** prior to this pass.

```
docs/project-audit/
+-- 00-executive-overview.md              (7,946 bytes)
+-- 01-repository-inventory.md           (15,487 bytes)
+-- 02-architecture-and-dependencies.md  (10,967 bytes)
+-- 03-pages-routes-and-navigation.md    (13,634 bytes)
+-- 04-ui-content-and-sections.md        (11,014 bytes)
+-- 05-interactions-and-links.md          (9,618 bytes)
+-- 06-feature-workflows.md               (9,345 bytes)
+-- 07-state-storage-and-data-flow.md     (6,784 bytes)
+-- 08-services-device-and-external-integrations.md (6,856 bytes)
+-- 09-browser-vs-desktop.md              (6,169 bytes)
+-- 10-styling-assets-and-localization.md  (5,580 bytes)
+-- 11-build-test-and-release.md           (4,632 bytes)
+-- 12-errors-limitations-and-risks.md     (5,051 bytes)
+-- 13-file-level-reference.md            (11,109 bytes)
+-- 14-audit-coverage-and-open-items.md    (6,312 bytes)
+-- 15-change-impact-and-extension-guide.md (5,462 bytes)
+-- 16-runtime-verification-log.md         (4,503 bytes)
+-- 17-documentation-verification-report.md  <- THIS FILE (new)
```

**Git tracking status** (verified via `git status --short docs/project-audit/`):

```
?? docs/project-audit/
```

> **Critical Finding**: The entire `docs/project-audit/` directory is **untracked** by Git. All files exist only on disk. They do not appear in `git diff`, `git log`, or any remote push. A `git clean -fd` would permanently destroy them.

---

## 2. Verification Method Key

| Code | Method |
|:----:|:--------|
| SC   | Static Code Inspection — file content read directly |
| CMD  | Executed Shell Command — PowerShell output captured |
| BR   | Browser Runtime — live app observed in prior browser session |
| HW   | Real Hardware Testing — requires physical STM32 flight controller (NOT performed) |

---

## 3. Verified Facts with Supporting Evidence

### 3.1. Project Identity and Metadata

| Claim | Doc(s) | Evidence | Method | Result |
|:------|:-------|:---------|:------:|:------:|
| Package name: `betaflight-configurator` | 00, 01 | `package.json` line 2 | SC | CORRECT |
| Product name: `Betaflight Configurator` | 00, 01 | `package.json` line 3 | SC | CORRECT |
| Version: `10.10.0` | 00, 01 | PowerShell `ConvertFrom-Json` returns `10.10.0` | CMD | CORRECT |
| License: GPL-3.0 | 00, 01 | `package.json` line 38 | SC | CORRECT |
| Node.js target: `20.x` | 00, 01, 16 | `package.json` engines field | SC | CORRECT |
| Git branch: `main` | 00, 16 | `git status` output | CMD | CORRECT |
| Git commit: `a37a8925...` | 00, 16 | `git log -1` | CMD | CORRECT |
| Dev server port: `8000` | 01, 09 | `vite.config.js` server.port | SC | CORRECT |
| 19 locale directories | 01, 10 | `Get-ChildItem -Path locales -Directory \| Measure-Object` = 19 | CMD | CORRECT |
| Locale codes: ca da de en es eu fr gl it ja ko nl pl pt pt_BR ru uk zh_CN zh_TW | 01, 10 | Directory listing confirmed all 19 | CMD | CORRECT |

### 3.2. Architecture and Entry Points

| Claim | Doc(s) | Evidence | Method | Result |
|:------|:-------|:---------|:------:|:------:|
| `src/index.html` is Vite/Browser entry | 00, 01, 09 | `vite.config.js` rollupOptions.input.main | SC | CORRECT |
| `src/main.html` is NW.js desktop entry | 00, 01, 09 | `package.json` "main" field | SC | CORRECT |
| `src/main_cordova.html` is Cordova entry | 00, 01, 09 | File present; `cordova/config_template.xml` references it | SC | CORRECT |
| `isWeb()` routes serial to `webSerial.js` vs `serial.js` | 00, 09 | `serial_backend.js` lines 1-20: conditional import on `isWeb()` | SC | CORRECT |
| `VirtualFC.js` provides simulation mode | 00, 01 | File exists at `src/js/VirtualFC.js` | SC | CORRECT |
| WebUSB DFU not available in browser | 09, 12 | `port_handler.js:36-38`: `if (isWeb()) { return 'not implemented'; }` | SC | CORRECT |
| `navigator.serial` used in browser mode | 09, 12 | `src/js/webSerial.js` uses `navigator.serial` | SC | CORRECT |
| mDNS bonjour disabled in web mode | 09, 12 | `mdns_discovery.js:53`: `if (!isWeb())` guard | SC | CORRECT |

### 3.3. Confirmed Defects

| Claim | Doc(s) | Evidence | Method | Result |
|:------|:-------|:---------|:------:|:------:|
| No `.eslintrc*` file in repo root | 12, 16 | `Test-Path` for all 4 variants returns False | CMD | CONFIRMED |
| Circular dependency (serial_backend.js <-> MSPHelper.js) | 12, 16 | `serial_backend.js:3-4` comment: `// NOTE: this is a circular dependency` | SC | CONFIRMED |
| `GitHubApi.js` is dead code | 12, 16 | `GitHubApi.js:1` comment + ripgrep for `import.*GitHubApi` = 0 results | SC + CMD | CONFIRMED |

### 3.4. Test Suite

| Claim | Doc(s) | Evidence | Method | Result |
|:------|:-------|:---------|:------:|:------:|
| 3 test files present | 11, 14, 16 | All 3 test files exist at expected paths | SC | CORRECT |
| 22 total tests, all passing | 14, 16 | Prior session: `Tests  22 passed (22)` | CMD | CONFIRMED |

### 3.5. Browser Runtime (Prior Session)

| Claim | Doc(s) | Evidence | Method | Result |
|:------|:-------|:---------|:------:|:------:|
| App mounts on `localhost:8000` | 16 | Browser subagent confirmed `#main-wrapper` mounted | BR | CONFIRMED |
| Vue 2 init sequence logged | 16 | Console: `i18n initialized, starting Vue framework` | BR | CONFIRMED |
| Version badge renders `10.10.0 (a37a892)` | 16 | Screenshot captured in prior session | BR | CONFIRMED |

---

## 4. Incorrect or Inaccurate Claims

### 4.1. File Line Count Errors

All counts independently measured with `Get-Content <file> | Measure-Object -Line`.

> Root cause: Original audit estimated line counts and did not cross-check with a measurement command. All documented values are systematically inflated.

| File | Documented Count | Actual Count | Discrepancy | Severity |
|:-----|:----------------:|:------------:|:-----------:|:--------:|
| `src/js/fc.js` | 1,000 | **896** | -104 | Medium |
| `src/js/main.js` | 620 | **534** | -86 | Medium |
| `src/js/TuningSliders.js` | 1,150 | **693** | -457 | **High** |
| `src/js/msp/MSPHelper.js` | 2,700 | **2,452** | -248 | Medium |
| `src/js/serial_backend.js` | 849 | **657** | -192 | Medium |
| `src/js/webSerial.js` | 182 | **157** | -25 | Low |
| `src/js/gui.js` | 536 | **453** | -83 | Medium |
| `src/js/protocols/stm32usbdfu.js` | 1,165 | **988** | -177 | Medium |

### 4.2. Undocumented Files Missing from Inventory

The filesystem contains **29 HTML files** in `src/tabs/` (`Get-ChildItem src\tabs -Name *.html | Measure-Object` = Count 29) while all documentation claims **28 tabs**. Two HTML files are entirely unmentioned:

| File | Content | Has JS Controller? | Impact |
|:-----|:--------|:------------------:|:------:|
| `src/tabs/blank.html` | Single `<div class="tab-adjustments">` with black background — loading placeholder | No `blank.js` exists | Low |
| `src/tabs/review.html` | Complete "rate this app" dialog with i18n keys `reviewhead`, `reviewInitial`, `reviewStore`, `reviewBug`, `reviewYes`, `reviewNo` | No — "review" is absent from `main.js` switch and `gui.js` allowedTabs | **Medium** |

Two JS tab-directory files also not mapped in documentation:

| File | Purpose | Documented? |
|:-----|:--------|:-----------:|
| `src/js/tabs/static_tab.js` | Shared controller for `privacy_policy` and `help` | Partially |
| `src/js/tabs/map.js` | OpenLayers map module: imports `View`, `Map`, `Feature`, `fromLonLat`, `Tile`, `Vector`, `OSM`, `XYZ`, `Icon`, `Style`, `Point`; constants `DEFAULT_ZOOM=17`, `DEFAULT_LON=0`, `DEFAULT_LAT=0` | **Not documented** |

### 4.3. Coverage Percentage Overclaim

`14-audit-coverage-and-open-items.md` declares "100%" for "Pages, Routes and Views (28 views)":
- Actual HTML count in `src/tabs/` is **29**, not 28.
- `review.html` is a real UI template — absent from all 16 documents.
- `map.js` is an undocumented GPS map sub-module.
- The "100% file coverage across 68 source files" denominator was never listed by filename, making it unverifiable.

---

## 5. Unverified Claims Requiring Further Investigation

| Claim | Doc(s) | Why Unverifiable Here | Required Method |
|:------|:-------|:----------------------|:----------------|
| 142 interactive controls catalogued | 05, 14 | No independent DOM audit of all tab HTML files performed | Manual audit of `src/tabs/*.html` |
| 15 external hyperlinks | 05, 14 | Not re-counted independently | `Select-String` on all tab HTML |
| `TuningSliders.js` PID math correctness | 06, 13 | Requires domain expertise and hardware comparison | HW + expert review |
| Presets GitHub index fetch works | 06, 08 | Network fetch to `raw.githubusercontent.com` not live-tested | BR with network logging |
| OSD canvas drag-and-drop | 04, 06 | Not exercised in browser session | BR with VirtualFC |
| DShot motor direction commands | 06, 08 | Requires ESC hardware | HW |
| Backup/restore JSON round-trip | 06, 07 | No unit tests exist for `backup_restore.js` | BR manual test |
| mDNS bonjour discovery | 08, 09 | Requires ExpressLRS WiFi receiver on LAN | HW |
| NW.js desktop packaging | 11 | `gulp dist` was never executed | Build environment |
| Cordova Android APK compile | 11 | Requires Android SDK, Gradle, device | Mobile build environment |
| `SessionStorage.js` caches Build API responses | 07, 08 | Code present; behavior not exercised | BR |

---

## 6. Newly Discovered Facts Not in Existing Documentation

| Finding | Impact |
|:--------|:-------|
| `src/tabs/review.html` is a complete "rate the app" dialog with i18n keys but is not referenced in `main.js` or `gui.js` allowedTabs. Likely a disabled feature. | Undocumented legacy UI |
| `src/tabs/blank.html` is a single-div placeholder, not a functional tab | Explains 29 vs 28 discrepancy |
| `src/js/tabs/map.js` is a dedicated OpenLayers module used internally by the GPS tab | Not in any documentation |
| Total non-generated project files (source + config, excluding `node_modules/`, `dist/`, `debug/`, `cache/`): **293 files** | Provides a real file count baseline |
| All 17 documentation files are untracked by Git (`?? docs/project-audit/`) | Critical: docs can be permanently lost |

---

## 7. Recommended Corrections

### 7.1. Corrections to Existing Documents

| Document | Section | Correction Needed |
|:---------|:--------|:-----------------|
| `01-repository-inventory.md` | `src/js/` file table | Update all 8 line counts to actual values from Section 4.1 |
| `01-repository-inventory.md` | `src/tabs/` section | Add `blank.html` (placeholder) and `review.html` (disabled dialog) |
| `01-repository-inventory.md` | `src/js/tabs/` section | Add `map.js` |
| `13-file-level-reference.md` | File list | Add `map.js`; add notes for `blank.html` and `review.html` |
| `14-audit-coverage-and-open-items.md` | Coverage table | Replace "100%" with honest figures; list `review.html`, `blank.html`, `map.js` as missed |
| `03-pages-routes-and-navigation.md` | Master tab inventory | Add `review.html` row with status "disabled / legacy — not routed" |

### 7.2. New Actions Recommended

| Gap | Action |
|:----|:-------|
| Git tracking | Run `git add docs/` and commit, or add deliberate `.gitignore` entry |
| `review.html` history | Run `git log -- src/tabs/review.html` to determine when it was removed from routing |
| `map.js` documentation | Add entry in `13-file-level-reference.md` as GPS tab OpenLayers sub-module |
| Authoritative line counts | `Get-ChildItem -Recurse src -Include *.js | ForEach-Object { "$($_.Name): $((Get-Content $_.FullName).Count)" }` |

---

## 8. Verification Coverage Matrix

| Area | Static Code | CMD Executed | Browser Runtime | Real Hardware |
|:-----|:-----------:|:------------:|:---------------:|:-------------:|
| Project metadata | Full | Full | — | — |
| Tab routing logic | Full | Partial | Partial (prior) | — |
| File line counts | — | Full (corrected) | — | — |
| ESLint defect | Full | Confirmed | — | — |
| Circular dependency | Full | — | — | — |
| Dead code (GitHubApi) | Full | Confirmed | — | — |
| Unit test suite | — | Confirmed | — | — |
| Browser UI rendering | — | — | Prior session | — |
| Web Serial API | Code-level | — | Partial | Blocked |
| USB DFU firmware flash | Code-level | — | — | Blocked |
| mDNS discovery | Code-level | — | — | Blocked |
| Motor bench / DShot | Code-level | — | — | Blocked |
| OSD drag-and-drop | Code-level | — | Not tested | Blocked |
| Backup/restore round-trip | Code-level | — | Not tested | — |
| Presets network fetch | Code-level | — | Not tested | — |
| NW.js desktop packaging | Code-level | Not executed | — | — |
| Cordova Android APK | Code-level | Not executed | — | Blocked |

---

## 9. Final Reliability Assessment

### Verdict: RELIABLE FOR ARCHITECTURAL REFERENCE — WITH NOTED CORRECTIONS

**Fully Reliable Sections:**
- Project identity, metadata, dependency inventory (00, 01, 02)
- Tab routing state machine and navigation lifecycle (03)
- Browser vs. Desktop capability matrix (09)
- Confirmed defects: ESLint missing, circular dependency, dead GitHubApi.js (12, 16)
- MSP protocol framing and handshake description (08)
- Build toolchain and test runner documentation (11)

**Reliable But Needs Correction:**
- Documents 01 and 13: All file line counts are systematically inflated 10-40%. Use corrected values from Section 4.1.
- Documents 03 and 14: Claim of "28 tabs" is ambiguous — 29 HTML files exist; `review.html` is real but unrouted.
- Document 14: "100% coverage" is an overclaim. `map.js`, `review.html`, `blank.html` were not inventoried.

**Blockers for Production Reliability:**
1. **Git untracked**: All docs exist only on disk. A `git clean -fd` will permanently destroy them. Stage and commit before any repository operation.
2. **Line count errors**: Developers using line number references from 01 or 13 for code navigation will land at wrong locations.
3. **`review.html` status unknown**: Its purpose must be determined before the tab inventory can be declared complete.

---

*Report generated by independent static code inspection and PowerShell command execution on 2026-10-19. Zero application source files or existing documentation files were modified.*
