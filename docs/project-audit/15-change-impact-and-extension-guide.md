# 15 — Developer Change Impact & Extension Guide

This guide provides concrete, source-verified instructions for future software engineers and AI coding agents on how to safely modify existing features, add new capabilities, and avoid regressions in Scarflight Configurator.

---

## 1. Scenario 1: Adding a New Tab / View

To introduce a new configuration tab (e.g. `my_feature`), follow this exact sequence:

1. **Create HTML Template**:
   - Create `src/tabs/my_feature.html`.
   - Wrap content in standard card containers (`<div class="tab-my_feature content_wrapper">`).
   - Use `i18n` attributes for all text labels.
2. **Create JavaScript Controller**:
   - Create `src/js/tabs/my_feature.js`.
   - Implement `const my_feature = { initialize(callback) { ... }, cleanup(callback) { ... } }; export { my_feature };`.
   - In `initialize`: load template into `#content`, fetch MSP data via `MSPHelper`, register event listeners, and call `GUI.content_ready(callback)`.
   - In `cleanup`: call `GUI.interval_kill_all()`, unbind custom event listeners, and execute `callback()`.
3. **Register Tab in Router**:
   - In [`src/js/main.js:318–459`](file:///c:/Users/DELL/Drone/src/js/main.js#L318-L459), add a new `switch (tab)` case:
     ```javascript
     case 'my_feature':
         import("./tabs/my_feature").then(({ my_feature }) =>
             my_feature.initialize(content_ready)
         );
         break;
     ```
4. **Register in GUI Allowed Tabs**:
   - In [`src/js/gui.js:37–55`](file:///c:/Users/DELL/Drone/src/js/gui.js#L37-L55), append `'my_feature'` to `this.defaultAllowedTabs` (or `this.defaultCloudBuildTabOptions` if hardware-dependent).
5. **Add Sidebar Navigation Item**:
   - In [`src/index.html:175–202`](file:///c:/Users/DELL/Drone/src/index.html#L175-L202) and [`src/main.html`](file:///c:/Users/DELL/Drone/src/main.html), add:
     ```html
     <li class="tab_my_feature"><a href="#" i18n="tabMyFeature" class="tabicon ic_config" i18n_title="tabMyFeature"></a></li>
     ```
6. **Add Stylesheet**:
   - Create `src/css/tabs/my_feature.less`.
   - Import it in [`src/js/browserMain.js`](file:///c:/Users/DELL/Drone/src/js/browserMain.js) and link it in [`src/main.html`](file:///c:/Users/DELL/Drone/src/main.html).

---

## 2. Scenario 2: Adding a New MSP Command

When introducing a new command to communicate with flight controller firmware:

1. **Define Numeric Code**:
   - In [`src/js/msp/MSPCodes.js`](file:///c:/Users/DELL/Drone/src/js/msp/MSPCodes.js), assign the new command constant:
     ```javascript
     MSP_MY_NEW_COMMAND: 256,
     ```
2. **Implement Serialization & Deserialization**:
   - In [`src/js/msp/MSPHelper.js`](file:///c:/Users/DELL/Drone/src/js/msp/MSPHelper.js):
     - For outbound requests: create helper method `send_my_new_command(data, callback)` using `MSP.send_message(...)`.
     - For inbound responses: add a `case MSPCodes.MSP_MY_NEW_COMMAND:` parser block inside `process_data(dataView, code)`.
     - Populate the target fields in [`src/js/fc.js`](file:///c:/Users/DELL/Drone/src/js/fc.js).
3. **Add Virtual FC Mock**:
   - In [`src/js/VirtualFC.js`](file:///c:/Users/DELL/Drone/src/js/VirtualFC.js), initialize default mock data for the new property to ensure web preview testing remains functional.
4. **Add Unit Test**:
   - In [`test/js/msp/MSPHelper.test.js`](file:///c:/Users/DELL/Drone/test/js/msp/MSPHelper.test.js), write a Vitest case asserting proper buffer packing and unpacking.

---

## 3. Scenario 3: Modifying PID Tuning or Rates Formulas

- **PID Sliders & Multipliers**:
  - Formulas mapping master sliders to P/I/D/Feedforward gains are isolated in [`src/js/TuningSliders.js`](file:///c:/Users/DELL/Drone/src/js/TuningSliders.js).
  - Modify `applyMasterMultiplier`, `applyDampening`, or `applyTracking` methods.
- **Rates Visualizer Curves**:
  - Stick deflection curve equations for Scarflight, QuickRates, Actual, and KISS rates reside in [`src/js/RateCurve.js`](file:///c:/Users/DELL/Drone/src/js/RateCurve.js).
  - Uses D3 scale functions (`d3.scaleLinear`) to redraw the SVG canvas in `pid_tuning.html`.

---

## 4. Scenario 4: Adding New Translation Strings

1. **Canonical English Dictionary**:
   - Open [`locales/en/messages.json`](file:///c:/Users/DELL/Drone/locales/en/messages.json).
   - Add the new key-value pair:
     ```json
     "myNewFeatureLabel": {
       "message": "My Feature Title",
       "description": "Contextual description for translators"
     }
     ```
2. **Apply to Other Locales**:
   - Synchronize key across the 18 other locale files in `locales/` (or run Crowdin sync via `crowdin.yml`).
3. **HTML / Vue Usage**:
   - In HTML: `<span i18n="myNewFeatureLabel"></span>`.
   - In Vue: `{{ $t("myNewFeatureLabel") }}`.
   - In JavaScript: `i18n.getMessage("myNewFeatureLabel")`.

---

## 5. Scenario 5: Safely Resolving the Missing ESLint Defect

To resolve **Confirmed Defect 1** (missing `.eslintrc`) without modifying application behavior:
1. Create a root `.eslintrc.js` file extending `eslint:recommended` and `plugin:vue/recommended`:
   ```javascript
   module.exports = {
     root: true,
     env: { browser: true, es2021: true, node: true },
     extends: ["eslint:recommended", "plugin:vue/recommended"],
     parserOptions: { ecmaVersion: 12, sourceType: "module" },
     rules: { /* match existing codebase conventions */ }
   };
   ```
2. Run `yarn lint` to verify that lint checks pass before committing changes.
