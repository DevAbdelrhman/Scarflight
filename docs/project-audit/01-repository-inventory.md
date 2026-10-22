# 01 — Repository Inventory & File Responsibilities

This inventory provides a comprehensive breakdown of all directories and files across the repository, explaining their structural purpose, operational responsibilities, and classification.

---

## 1. Root Level Directory Map

```text
c:\Users\DELL\Drone
├── .DS_Store               # macOS Finder metadata artifact (ignorable)
├── .git/                   # Git source control repository (branch: main, commit: a37a892)
├── CODE_OF_CONDUCT.md      # Contributor Covenant Code of Conduct v1.4.0
├── CONTRIBUTING.md         # Developer contribution rules and PR guidelines
├── README.md               # Upstream project overview, building guides, and badges
├── assets/                 # Graphics assets (branding, icons, screenshots)
├── cache/                  # Build & runtime cache directory (untracked)
├── cordova/                # Apache Cordova mobile build templates and configs
├── crowdin.yml             # Crowdin localization configuration file
├── debug/                  # Output directory for debug builds (untracked)
├── dist/                   # Output directory for production build bundles (untracked)
├── gulp-appdmg.js          # Gulp helper task for macOS DMG image creation
├── gulpfile.js             # Gulp 4 master build automation script (NW.js, packaging)
├── libraries/              # Legacy vendored frontend libraries (nouislider, flightindicators)
├── locales/                # 19 language translation directories (JSON message dictionaries)
├── netlify.toml            # Netlify hosting configuration for web preview
├── node_modules/           # Node.js dependencies (untracked)
├── package.json            # Project manifest, dependencies, scripts, NW.js window settings
├── resources/              # Runtime resources: 3D models, motor diagrams, OSD fonts
├── src/                    # Primary application source code (HTML, JS, Vue, Less, CSS)
├── test/                   # Vitest unit tests, test fixtures, and test mocks
├── vite.config.js          # Vite 4 bundler, PWA, and dev server configuration
└── yarn.lock               # Yarn dependency lockfile (frozen dependency tree)
```

---

## 2. Root File Responsibilities

| File | Purpose & Responsibility | Size (Bytes) | Evidence / Reference |
| :--- | :--- | :--- | :--- |
| [`package.json`](file:///c:/Users/DELL/Drone/package.json) | Declares project metadata, dependencies (Vue 2, Three.js, D3, OpenLayers), NW.js runtime parameters (`window`, `chromium-args`), build scripts (`dev`, `build`, `start`, `release`, `test`, `lint`), and husky git hooks. | 4,390 | Lines 1–138 |
| [`vite.config.js`](file:///c:/Users/DELL/Drone/vite.config.js) | Configures Vite 4 development server (`port 8000`), preview server (`port 8080`), Vue 2 plugin (`@vitejs/plugin-vue2`), PWA caching (`vite-plugin-pwa`), static asset copy hooks, and middleware to serve `/locales/` and `/resources/`. | 3,922 | Lines 1–119 |
| [`gulpfile.js`](file:///c:/Users/DELL/Drone/gulpfile.js) | Gulp 4 build script for NW.js desktop packaging (Windows InnoSetup, macOS DMG, Linux Debian/RPM/Tarball, ARMv8) and Cordova mobile APK packaging. | 40,977 | Lines 1–1223 |
| [`gulp-appdmg.js`](file:///c:/Users/DELL/Drone/gulp-appdmg.js) | Stream wrapper for `appdmg` package to build stylized macOS DMG installers with background artwork and icon positioning. | 779 | Lines 1–32 |
| [`yarn.lock`](file:///c:/Users/DELL/Drone/yarn.lock) | Complete deterministic dependency tree locked for Yarn package manager. | 821,735 | 821 KB lockfile |
| [`crowdin.yml`](file:///c:/Users/DELL/Drone/crowdin.yml) | Configuration for Crowdin translation service synchronization mapping `locales/%two_letters_code%/messages.json`. | 795 | Lines 1–33 |
| [`netlify.toml`](file:///c:/Users/DELL/Drone/netlify.toml) | Redirect rules and publish directory (`src/dist`) for Netlify cloud deployments. | 59 | Lines 1–4 |
| [`README.md`](file:///c:/Users/DELL/Drone/README.md) | Official documentation detailing features, installation, hardware requirements, Chrome Web Store deprecation history, and building from source. | 10,476 | Lines 1–254 |
| [`CONTRIBUTING.md`](file:///c:/Users/DELL/Drone/CONTRIBUTING.md) | Guidelines for opening issues, requesting features, contributing code, and submitting pull requests. | 949 | Lines 1–36 |
| [`CODE_OF_CONDUCT.md`](file:///c:/Users/DELL/Drone/CODE_OF_CONDUCT.md) | Standard Contributor Covenant Code of Conduct. | 3,276 | Lines 1–74 |

---

## 3. Directory Breakdown: `src/` (Core Application Source)

The `src/` directory represents the main execution codebase.

### 3.1. Entry Points
- [`src/index.html`](file:///c:/Users/DELL/Drone/src/index.html) (16,923 bytes): Modern web entry point used by Vite. Loads `/src/js/utils/common.js` and `/src/js/browserMain.js`. Contains root DOM hierarchy (`#main-wrapper`, `#tabs`, `#content`, modals).
- [`src/main.html`](file:///c:/Users/DELL/Drone/src/main.html) (21,502 bytes): Legacy & Desktop NW.js entry point declared in `package.json:6`. Links all precompiled tab CSS files and loads `./js/main.js`.
- [`src/main_cordova.html`](file:///c:/Users/DELL/Drone/src/main_cordova.html) (1,926 bytes): Mobile webview shell for Apache Cordova mobile environments.

### 3.2. Subdirectories in `src/`

#### `src/components/` (Vue 2 Components)
- [`init.js`](file:///c:/Users/DELL/Drone/src/components/init.js): Mounts the root Vue instance to `#main-wrapper` once `i18next` triggers `'initialized'`.
- [`vueI18n.js`](file:///c:/Users/DELL/Drone/src/components/vueI18n.js): Bridges Vue components with `@panter/vue-i18next`.
- `betaflight-logo/`: Vue component displaying the animated bee logo, Configurator version, firmware version, and target board ID.
- `status-bar/`: Vue component for the bottom status bar displaying cycle time, CPU load, I2C errors, packet errors, and port utilization.
- `quad-status/`: Vue components `BatteryIcon.vue` and `BatteryLegend.vue` rendering live battery voltage and cell state.
- `port-picker/`: Vue components `PortsInput.vue`, `FirmwareVirtualOption.vue`, and `PortOverrideOption.vue`.
- `sensor-status/`: Sensor indicator icons (Gyro, Accel, Mag, Baro, GPS, Sonar).
- `data-flash/`: Dataflash storage utilization gauge.
- `EscDshotDirection/`: Interactive Vue modal component for testing and reversing ESC motor directions using DShot commands.
- `MotorOutputReordering/`: Interactive Vue modal component for visually clicking motors to reorder MCU motor output mappings.

#### `src/js/` (Application Controllers, Protocols & Services)
> **Line count format**: `Total physical lines` in editor (and `SLOC` excluding blank lines). Both are provided for developer clarity.

- [`main.js`](file:///c:/Users/DELL/Drone/src/js/main.js) (620 lines / 534 SLOC): Core application lifecycle controller, numeric input sanitizer, tab click dispatcher, log drawer controller, dark theme initializer.
- [`browserMain.js`](file:///c:/Users/DELL/Drone/src/js/browserMain.js) (61 lines / 56 SLOC): Vite web entry wrapper; imports all Less stylesheets, loads `main.js`, and registers PWA service worker.
- [`gui.js`](file:///c:/Users/DELL/Drone/src/js/gui.js) (536 lines / 453 SLOC): `GuiControl` singleton managing timer intervals/timeouts, dialogs (`showYesNoDialog`, `showWaitDialog`, `showInformationDialog`), tab cleanup, and platform detection.
- [`fc.js`](file:///c:/Users/DELL/Drone/src/js/fc.js) (1,000 lines / 896 SLOC): Flight Controller data store holding all telemetry, analog readings, board configuration, features, and capabilities.
- [`serial_backend.js`](file:///c:/Users/DELL/Drone/src/js/serial_backend.js) (849 lines / 657 SLOC): Connection lifecycle manager; chooses between `serial.js` (NW.js) and `webSerial.js` (Browser), handles auto-connect, handshake sequence, and periodic telemetry polling.
- [`serial.js`](file:///c:/Users/DELL/Drone/src/js/serial.js) (470 lines / 417 SLOC): NW.js desktop serial implementation using `chrome.serial` API.
- [`webSerial.js`](file:///c:/Users/DELL/Drone/src/js/webSerial.js) (182 lines / 157 SLOC): Web Serial API implementation (`navigator.serial`) for browser execution.
- [`VirtualFC.js`](file:///c:/Users/DELL/Drone/src/js/VirtualFC.js) (274 lines / 229 SLOC): Complete simulated Flight Controller generating realistic mock MSP data for browser preview without hardware.
- [`ConfigStorage.js`](file:///c:/Users/DELL/Drone/src/js/ConfigStorage.js) (82 lines / 70 SLOC): Local storage abstraction for persistent user preferences.
- [`SessionStorage.js`](file:///c:/Users/DELL/Drone/src/js/SessionStorage.js) (66 lines / 55 SLOC): Session storage wrapper for caching cloud build responses.
- [`BuildApi.js`](file:///c:/Users/DELL/Drone/src/js/BuildApi.js) (204 lines / 172 SLOC): REST client for `https://build.betaflight.com` target manifests and cloud builds.
- [`port_handler.js`](file:///c:/Users/DELL/Drone/src/js/port_handler.js) (456 lines / 375 SLOC): Port detection polling, USB device filtering, and mDNS network receiver matching.
- [`mdns_discovery.js`](file:///c:/Users/DELL/Drone/src/js/mdns_discovery.js) (141 lines / 126 SLOC): Zero-configuration mDNS discovery for ExpressLRS WiFi receivers.
- [`DarkTheme.js`](file:///c:/Users/DELL/Drone/src/js/DarkTheme.js) (82 lines / 69 SLOC): Theme switching engine (Light, Dark, OS Auto).
- [`TuningSliders.js`](file:///c:/Users/DELL/Drone/src/js/TuningSliders.js) (837 lines / 693 SLOC): Math engine calculating PID master sliders, damping, tracking, and filter frequencies.
- [`RateCurve.js`](file:///c:/Users/DELL/Drone/src/js/RateCurve.js) (284 lines / 217 SLOC): Math curves generator for Betaflight, QuickRates, Actual, and KISS rates models.
- [`backup_restore.js`](file:///c:/Users/DELL/Drone/src/js/backup_restore.js) (923 lines / 775 SLOC): Backup and restore parser reading/writing JSON configuration files.
- [`CliAutoComplete.js`](file:///c:/Users/DELL/Drone/src/js/CliAutoComplete.js) (586 lines / 523 SLOC): Trie and dictionary autocompleter for CLI tab commands.

#### `src/js/msp/` (MultiWii Serial Protocol)
- [`msp.js`](file:///c:/Users/DELL/Drone/src/js/msp.js) (403 lines / 371 SLOC): Low-level state machine parser for MSP v1 (`$M>`), MSP v2 (`$X>`), and Jumbo frame streaming.
- [`MSPCodes.js`](file:///c:/Users/DELL/Drone/src/js/msp/MSPCodes.js) (212 lines / 188 SLOC): Numeric command definitions for all MSP commands (1 to 255+).
- [`MSPHelper.js`](file:///c:/Users/DELL/Drone/src/js/msp/MSPHelper.js) (2,815 lines / 2,452 SLOC): High-level encoder/decoder translating raw binary buffers into structured JavaScript objects.

#### `src/js/protocols/` (Bootloader & Flashing Protocols)
- [`stm32usbdfu.js`](file:///c:/Users/DELL/Drone/src/js/protocols/stm32usbdfu.js) (1,165 lines / 988 SLOC): Native USB DFU protocol implementation using `chrome.usb` control transfers for STM32, GD32, AT32, APM32 microcontrollers.
- [`stm32.js`](file:///c:/Users/DELL/Drone/src/js/protocols/stm32.js) (899 lines / 740 SLOC): Serial USART bootloader protocol using ACK/NACK handshake for flashing over COM ports.

#### `src/tabs/` & `src/js/tabs/` (Tab System Taxonomy)
The application markup templates and controllers are divided into four clear categories:

1. **27 Active Routed Sidebar Tabs** (dispatched via `main.js` switch statement; 26 in `src/tabs/*.html` + `presets` in `src/tabs/presets/presets.html`):
   - `landing`: Welcome screen, release notes, hardware driver links, sponsors.
   - `setup`: Live 3D drone attitude model (Three.js), accelerometer calibration, backup/restore.
   - `ports`: Multi-UART configuration table (MSP, Serial RX, Telemetry, GPS, Blackbox).
   - `configuration`: System features, mixer, board orientation, arming flags, beeper conditions.
   - `power`: Battery voltage/current calibration and cell thresholds.
   - `failsafe`: Failsafe stages, guard timers, channel fallback procedures.
   - `presets`: Community presets browser, GitHub index search, script applicator ([`src/tabs/presets/presets.html`](file:///c:/Users/DELL/Drone/src/tabs/presets/presets.html)).
   - `pid_tuning`: PID profiles, master sliders, feedforward, D-term & Gyro filter tables.
   - `receiver`: Radio receiver channels, channel map, stick deadbands, RSSI.
   - `auxiliary`: RC mode switches (ARM, ANGLE, HORIZON, AIRMODE, BEEPER, TURTLE, etc.).
   - `adjustments`: In-flight adjustment rules linked to switches/potentiometers.
   - `servos`: Servo mixer channels, direction, and endpoints.
   - `gps`: GPS status, satellite map, coordinates, and OpenLayers live map view.
   - `motors`: Motor slider test bench, DShot direction wizard, motor reordering wizard.
   - `osd`: Drag-and-drop OSD visual element placer, font manager, HD/SD video formats.
   - `vtx`: Video transmitter channels, power tables, pit mode, JSON VTX table import.
   - `transponder`: IR transponder timing codes (i-Lap, ArcRF).
   - `led_strip`: Interactive 16x16 grid LED strip configurator, colors, modes.
   - `sensors`: Real-time oscilloscopes for Gyro, Accel, Mag, Baro, Sonar.
   - `logging`: Serial blackbox log download.
   - `onboard_logging`: Onboard flash / SD card Blackbox management.
   - `cli`: Command line terminal with autocompletion and diff dump.
   - `options`: Configurator application preferences.
   - `help`: Documentation, manual, and community links.
   - `privacy_policy`: Privacy terms and analytics consent.
   - `firmware_flasher`: Online/local firmware flashing tool.
   - `setup_osd`: Standalone OSD board setup view.

2. **1 Auxiliary Popup Window Template** (standalone desktop/NW.js window, not in sidebar):
   - [`receiver_msp.html`](file:///c:/Users/DELL/Drone/src/tabs/receiver_msp.html) (with [`receiver_msp.js`](file:///c:/Users/DELL/Drone/src/js/tabs/receiver_msp.js)): Auxiliary window launched by `receiver.js` via `chrome.app.window.create()`.

3. **2 Non-Routed Template Files** (present in `src/tabs/` root; not in router):
   - [`blank.html`](file:///c:/Users/DELL/Drone/src/tabs/blank.html) (1 line): Single `<div class="tab-adjustments">` black placeholder used during tab transitions.
   - [`review.html`](file:///c:/Users/DELL/Drone/src/tabs/review.html) (11 lines): "Rate this app" modal template. All referenced i18n keys (`reviewhead`, `reviewYes`, etc.) are absent from all 19 locale files. Orphaned dead code.

4. **1 Tab Sub-Module** (in `src/js/tabs/`; no standalone HTML tab):
   - [`map.js`](file:///c:/Users/DELL/Drone/src/js/tabs/map.js) (138 lines / 137 SLOC): OpenLayers helper module imported exclusively by [`gps.js`](file:///c:/Users/DELL/Drone/src/js/tabs/gps.js). Configures map layers, markers, and layer toggle buttons.

---

## 4. Ancillary Directories

### 4.1. `libraries/` (Vendored Frontend Assets)
- `analytics.js`: Google Analytics tracking engine.
- `jquery.flightindicators.js` & `flightindicators.css`: Artificial horizon and compass gauges.
- `jquery.nouislider.all.min.js`, `jquery.nouislider.min.css`: Dual-handle range sliders used in Auxiliary and Adjustment tabs.
- `jquery.liblink.js`: Slider linking helper.

### 4.2. `resources/` (Binary & Graphic Data Assets)
- `models/`: Three.js 3D model JSON files: `quad_x.json`, `quad_vtail.json`, `quad_atail.json`, `hex_x.json`, `hex_plus.json`, `tricopter.json`, `y4.json`, `y6.json`, `fallback.json`.
- `motor_order/`: PNG diagrams illustrating motor order and rotation for all airframe configurations.
- `osd/`: Font bitmap files (`.mcm`) and metadata for analog and digital OSD chipsets.

### 4.3. `locales/` (Internationalization)
Contains 19 language subdirectories, each with `messages.json`:
`ca`, `da`, `de`, `en` (canonical), `es`, `eu`, `fr`, `gl`, `it`, `ja`, `ko`, `nl`, `pl`, `pt`, `pt_BR`, `ru`, `uk`, `zh_CN`, `zh_TW`.

### 4.4. `cordova/` (Mobile Build Configuration)
- `config_template.xml`: Cordova XML config declaring permissions (USB, Network, Storage).
- `package_template.json` & `build_template.json`: Mobile build settings.
- `usb_device_filter.xml`: Android USB accessory filter allowing OTG connection to STM32 flight controllers.
- `debug.keystore`: Signing key for debug Android APKs.

### 4.5. `test/` (Unit Test Suite)
- [`setup.js`](file:///c:/Users/DELL/Drone/test/setup.js): JSDOM environment bootstrap, window mocks.
- `js/msp/MSPHelper.test.js`: CRC checks, board info decoding tests.
- `js/msp.test.js`: MSP V1/V2 packet decoding, checksum failure tests.
- `tabs/cli.test.js`: CLI command parser and buffer handling tests.

---

## 5. Excluded & Generated Directories

| Directory | Classification | Explanation for Exclusion from Source Control |
| :--- | :--- | :--- |
| `node_modules/` | External Dependencies | Contains 1,000+ third-party npm packages; managed via `package.json` and `yarn.lock`. |
| `dist/` | Build Artifacts | Temporary production build output generated by `vite build` or `gulp dist`. |
| `debug/` | Build Artifacts | Unpacked NW.js debug binaries generated during `gulp debug`. |
| `apps/` | Release Artifacts | Packaged desktop installers generated during `gulp apps`. |
| `release/` | Distribution Archives | Final zipped packages and installer executables created by `gulp release`. |
| `cache/` | Build Cache | Downloaded NW.js runtime binaries (`nwjs-v0.72.0-*`) cached by `nw-builder`. |
