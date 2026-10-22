# 12 — Confirmed Defects, Limitations & Technical Risks

This document catalogs confirmed software defects, architectural vulnerabilities, runtime limitations, and operational risks identified across the codebase.

---

## 1. Confirmed Software Defects

### Defect 1: Missing ESLint Configuration File
- **Status**: **Confirmed Defect**
- **Evidence**:
  - `package.json:22` defines `"lint": "eslint --ext .js,.vue src gulpfile.js gulp-appdmg.js"`.
  - `package.json:135` defines a Husky pre-commit hook `"pre-commit": "yarn lint"`.
  - Directory inspection confirms no `.eslintrc`, `.eslintrc.js`, `.eslintrc.json`, or `.eslintrc.yml` exists in the repository root.
  - Executing `eslint` fails with exit code 1:
    `ESLint: 8.48.0. ESLint couldn't find a configuration file.`
- **User / Developer Impact**: Any developer attempting to commit code with Husky enabled will encounter Git pre-commit abort errors until an ESLint configuration is restored.
- **Affected Files**: [`package.json:20–23`](file:///c:/Users/DELL/Drone/package.json#L20-L23), [`package.json:133–137`](file:///c:/Users/DELL/Drone/package.json#L133-L137).

### Defect 2: Circular Dependency Between `serial_backend.js` and `MSPHelper.js`
- **Status**: **Confirmed Defect (Documented in Code)**
- **Evidence**:
  - In [`src/js/serial_backend.js:3-4`](file:///c:/Users/DELL/Drone/src/js/serial_backend.js#L3-L4):
    `// NOTE: this is a circular dependency, needs investigating`
    `import MspHelper from "./msp/MSPHelper";`
  - [`src/js/msp/MSPHelper.js`](file:///c:/Users/DELL/Drone/src/js/msp/MSPHelper.js) imports `serial_backend.js` for port status checks.
- **Impact**: Creates tight coupling that complicates refactoring and prevents testing `serial_backend.js` in total isolation.
- **Affected Files**: [`src/js/serial_backend.js`](file:///c:/Users/DELL/Drone/src/js/serial_backend.js), [`src/js/msp/MSPHelper.js`](file:///c:/Users/DELL/Drone/src/js/msp/MSPHelper.js).

### Defect 3: Dead Code in `GitHubApi.js`
- **Status**: **Confirmed Defect / Code Smell**
- **Evidence**:
  - In [`src/js/GitHubApi.js:1`](file:///c:/Users/DELL/Drone/src/js/GitHubApi.js#L1):
    `// NOTE: this files seems to be unused anywhere`
  - Global grep across the entire repository confirms zero callers or importers of `GitHubApi.js`.
- **Impact**: Unused dead code increasing repository size.
- **Affected Files**: [`src/js/GitHubApi.js`](file:///c:/Users/DELL/Drone/src/js/GitHubApi.js).

### Defect 4: Missing `changelog.html` Template for Dispatched Route
- **Status**: **Confirmed Defect**
- **Evidence**:
  - In [`src/js/main.js:324–328`](file:///c:/Users/DELL/Drone/src/js/main.js#L324-L328):
    `case 'changelog': import("./tabs/static_tab").then(({ staticTab }) => staticTab.initialize("changelog", content_ready));`
  - [`src/js/tabs/static_tab.js:11–14`](file:///c:/Users/DELL/Drone/src/js/tabs/static_tab.js#L11-L14) constructs `const tabFile = './tabs/' + staticTabName + '.html'` and loads it via jQuery `load()`.
  - File `src/tabs/changelog.html` is **missing from disk** (`Test-Path` returns `False`).
- **Impact**: Any navigation action attempting to switch to the `changelog` tab results in an unhandled 404 HTTP load failure and a blank content area.
- **Affected Files**: [`src/js/main.js:324–328`](file:///c:/Users/DELL/Drone/src/js/main.js#L324-L328), [`src/js/tabs/static_tab.js`](file:///c:/Users/DELL/Drone/src/js/tabs/static_tab.js).

### Defect 5: Orphaned Legacy Dialog `review.html` with Unmapped Locales
- **Status**: **Confirmed Defect / Orphaned Code**
- **Evidence**:
  - [`src/tabs/review.html`](file:///c:/Users/DELL/Drone/src/tabs/review.html) contains a complete rating prompt referencing i18n keys: `reviewhead`, `reviewInitial`, `reviewStore`, `reviewBug`, `reviewYes`, `reviewNo`.
  - Grep across all 19 language files in `locales/*/messages.json` returns **zero matches** for all 6 keys.
  - Zero callers or references exist in `main.js`, `gui.js`, `index.html`, or `main.html`.
  - Present since the initial Git commit (`a37a892`); never integrated.
- **Impact**: Dead code; if ever rendered, all strings display as unlocalized raw key tokens.
- **Affected Files**: [`src/tabs/review.html`](file:///c:/Users/DELL/Drone/src/tabs/review.html).

---

## 2. Runtime & Platform Limitations

### Limitation 1: WebUSB DFU Not Implemented in Browser Preview
- **Status**: **Verified Architectural Limitation**
- **Evidence**:
  - In [`src/js/port_handler.js:36–38`](file:///c:/Users/DELL/Drone/src/js/port_handler.js#L36-L38):
    `if (isWeb()) { return 'not implemented'; }`
  - USB DFU flashing is implemented exclusively in [`src/js/protocols/stm32usbdfu.js`](file:///c:/Users/DELL/Drone/src/js/protocols/stm32usbdfu.js) using the native desktop `chrome.usb` API.
- **Impact**: Flight controllers cannot be flashed from the browser preview. Users must use the native desktop application (NW.js) for firmware flashing.

### Limitation 2: Web Serial API Restricted to Chromium Browsers
- **Status**: **Verified Platform Limitation**
- **Evidence**:
  - [`src/js/webSerial.js`](file:///c:/Users/DELL/Drone/src/js/webSerial.js) relies directly on `navigator.serial`.
- **Impact**: Web preview hardware connection works only in Chromium-based browsers (Google Chrome, Microsoft Edge, Opera, Brave). Firefox and Safari do not support Web Serial.

### Limitation 3: Browser Sandbox Prevents mDNS Network Discovery
- **Status**: **Verified Platform Limitation**
- **Evidence**:
  - In [`src/js/mdns_discovery.js:53`](file:///c:/Users/DELL/Drone/src/js/mdns_discovery.js#L53):
    `if (!isWeb()) { import('bonjour')... }`
- **Impact**: Automatic discovery of ExpressLRS WiFi receivers is unavailable in browser preview; users must manually specify receiver IP addresses.

---

## 3. Operational & Safety Risks

### Risk 1: Accidental Motor Spin Hazard
- **Status**: **Mitigated Safety Risk**
- **Description**: Flight controller motor bench testing commands (`MSP_SET_MOTOR`) bypass radio receiver failsafes. If propellers are attached, high-speed motor rotation can cause severe injury.
- **Mitigation**:
  - Mandatory safety checkbox (`#safety_switch`) must be clicked before motor sliders unlock.
  - Automatic motor cutoff timeout if communication drops.
  - Prominent red alert banner displayed in [`src/tabs/motors.html`](file:///c:/Users/DELL/Drone/src/tabs/motors.html).

### Risk 2: Browser LocalStorage Quota Pressure (5MB Limit)
- **Status**: **Monitored Technical Risk**
- **Description**: Web browsers allocate a strict 5MB quota to `localStorage`. Older versions stored target binaries in storage, leading to quota exhaustion (`QUOTA_EXCEEDED_ERR`).
- **Mitigation**:
  - [`src/js/main.js:68–88`](file:///c:/Users/DELL/Drone/src/js/main.js#L68-L88) runs `cleanupLocalStorage()` on every startup, actively removing large cache blobs.

### Risk 3: Untracked Documentation Directory in Git Working Tree
- **Status**: **Active Operational Risk**
- **Description**: All files under `docs/project-audit/` currently show as `?? docs/project-audit/` (untracked) in `git status`.
- **Impact**: An automated `git clean -fd` or branch checkout could permanently delete the entire technical audit documentation suite without recovery from Git history.
- **Mitigation**:
  - Run `git add docs/project-audit/` and commit the files, or explicitly track them.
