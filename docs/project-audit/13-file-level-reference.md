# 13 — File-Level Source Reference & Symbol Index

This document provides a searchable index of all major files, classes, components, functions, and exported symbols across the Scarflight Configurator codebase.

---

## 1. Core Architectural & Infrastructure Modules

| File Path | Primary Export / Class | Key Responsibilities | Primary Callers |
| :--- | :--- | :--- | :--- |
| [`src/js/main.js`](file:///c:/Users/DELL/Drone/src/js/main.js) | `appReady()`, `isExpertModeEnabled()` | Lifecycle entry, numeric input validation, tab click dispatcher, log drawer toggle. | `index.html`, `main.html`, `browserMain.js` |
| [`src/js/gui.js`](file:///c:/Users/DELL/Drone/src/js/gui.js) | `GUI` (`GuiControl`), `TABS` | Timer management (`interval_add`, `timeout_add`), modal dialog helpers, tab switch cleanup. | `main.js`, `serial_backend.js`, all tab controllers |
| [`src/js/fc.js`](file:///c:/Users/DELL/Drone/src/js/fc.js) | `FC` | Central in-memory state store for flight controller telemetry, configuration, and capabilities. | `MSPHelper.js`, `init.js`, `serial_backend.js`, all tabs |
| [`src/js/data_storage.js`](file:///c:/Users/DELL/Drone/src/js/data_storage.js) | `CONFIGURATOR` | Application session state, connection flags, versioning metadata, API version constants. | `main.js`, `init.js`, `serial_backend.js` |
| [`src/js/ConfigStorage.js`](file:///c:/Users/DELL/Drone/src/js/ConfigStorage.js) | `get()`, `set()`, `remove()` | Persistent key-value storage engine wrapping browser `localStorage`. | `main.js`, `gui.js`, `options.js`, `DarkTheme.js` |
| [`src/js/SessionStorage.js`](file:///c:/Users/DELL/Drone/src/js/SessionStorage.js) | `get()`, `set()`, `remove()` | Ephemeral session storage engine wrapping browser `sessionStorage`. | `BuildApi.js` (cloud build caching) |
| [`src/js/localization.js`](file:///c:/Users/DELL/Drone/src/js/localization.js) | `i18n` | Internationalization loader, dictionary resolver, page localization crawler. | `main.js`, `init.js`, `gui_log.js`, all tabs |
| [`src/js/DarkTheme.js`](file:///c:/Users/DELL/Drone/src/js/DarkTheme.js) | `setDarkTheme()`, `DarkTheme` | Toggles light, dark, and auto OS-preference themes. | `main.js`, `options.js` |
| [`src/js/Analytics.js`](file:///c:/Users/DELL/Drone/src/js/Analytics.js) | `tracking`, `checkSetupAnalytics()` | Google Analytics wrapper for opt-in event and view tracking. | `main.js`, `serial_backend.js`, `firmware_flasher.js` |

---

## 2. Communication, Protocols & Drivers

| File Path | Primary Export / Class | Key Responsibilities | Primary Callers |
| :--- | :--- | :--- | :--- |
| [`src/js/serial_backend.js`](file:///c:/Users/DELL/Drone/src/js/serial_backend.js) | `initializeSerialBackend()` | Connection handshake orchestrator, live telemetry polling loop, port visibility updater. | `main.js` |
| [`src/js/serial.js`](file:///c:/Users/DELL/Drone/src/js/serial.js) | `serial` | Desktop serial driver wrapping `chrome.serial` and TCP socket streams. | `serial_backend.js` (in desktop mode) |
| [`src/js/webSerial.js`](file:///c:/Users/DELL/Drone/src/js/webSerial.js) | `WebSerial` | Modern browser serial driver wrapping Web Serial API (`navigator.serial`). | `serial_backend.js` (in web mode) |
| [`src/js/VirtualFC.js`](file:///c:/Users/DELL/Drone/src/js/VirtualFC.js) | `VirtualFC` | Full flight controller simulator generating synthetic telemetry and feature sets. | `serial_backend.js` (in virtual mode) |
| [`src/js/msp.js`](file:///c:/Users/DELL/Drone/src/js/msp.js) | `MSP` | Low-level streaming state machine parsing MSP v1, MSP v2, and Jumbo frames. | `MSPHelper.js`, `serial_backend.js` |
| [`src/js/msp/MSPCodes.js`](file:///c:/Users/DELL/Drone/src/js/msp/MSPCodes.js) | `MSPCodes` | Numeric enumeration mapping 100+ MSP protocol commands. | `MSPHelper.js`, `serial_backend.js`, all tabs |
| [`src/js/msp/MSPHelper.js`](file:///c:/Users/DELL/Drone/src/js/msp/MSPHelper.js) | `MspHelper` | High-level packet serializer and deserializer populating `FC` state models. | `serial_backend.js`, all configuration tabs |
| [`src/js/protocols/stm32usbdfu.js`](file:///c:/Users/DELL/Drone/src/js/protocols/stm32usbdfu.js) | `STM32DFU` | USB DFU firmware flashing protocol engine using `chrome.usb` control transfers. | `firmware_flasher.js` |
| [`src/js/protocols/stm32.js`](file:///c:/Users/DELL/Drone/src/js/protocols/stm32.js) | `STM32` | Serial USART bootloader flashing protocol engine for COM-port flashing. | `firmware_flasher.js` |
| [`src/js/port_handler.js`](file:///c:/Users/DELL/Drone/src/js/port_handler.js) | `PortHandler` | Background poller detecting USB device insertion, removal, and DFU bootloader state. | `serial_backend.js` |
| [`src/js/mdns_discovery.js`](file:///c:/Users/DELL/Drone/src/js/mdns_discovery.js) | `MdnsDiscovery` | Zeroconf/mDNS network poller discovering wireless ExpressLRS receiver IP addresses. | `port_handler.js` |
| [`src/js/BuildApi.js`](file:///c:/Users/DELL/Drone/src/js/BuildApi.js) | `BuildApi` | REST client querying targets, releases, and cloud builds from `build.Scarflight.com`. | `firmware_flasher.js` |

---

## 3. Vue UI Components (`src/components/`)

| Component Directory | Component Tag / File | Key Responsibilities | Primary Callers |
| :--- | :--- | :--- | :--- |
| `Scarflight-logo/` | `<Scarflight-logo>` | Displays brand graphic, version badge, target name, and firmware ID. | `index.html`, `main.html` |
| `status-bar/` | `<status-bar>` | Displays cycle time, CPU load, I2C error count, packet errors, port usage. | `index.html`, `main.html` |
| `quad-status/` | `<battery-icon>`, `<battery-legend>` | Renders live battery gauge, cell count detection, and voltage readouts. | `index.html`, `main.html` |
| `sensor-status/` | `#sensor-status` | Renders color-coded status glyphs for Gyro, Accel, Mag, Baro, GPS, Sonar. | `index.html`, `main.html` |
| `port-picker/` | `PortsInput.vue`, `FirmwareVirtualOption.vue` | Standalone dropdown components for COM port and virtual version picking. | `src/components/init.js` |
| `data-flash/` | `<data-flash>` | Visual gauge showing onboard flash data storage utilization. | `onboard_logging.js`, `index.html` |
| `EscDshotDirection/` | `EscDshotDirection.vue` | Modal dialog wizard testing and reversing ESC spin directions via DShot. | `motors.js` |
| `MotorOutputReordering/` | `MotorOutputReordering.vue` | Interactive wizard clicking motors to reorder MCU hardware output pins. | `motors.js` |

---

## 4. Tab Controllers (`src/js/tabs/`)

| Tab Identifier | Controller File | Primary Export | Description |
| :--- | :--- | :--- | :--- |
| `landing` | [`landing.js`](file:///c:/Users/DELL/Drone/src/js/tabs/landing.js) | `landing` | Welcome screen, sponsor grid, driver installer links, release notes. |
| `setup` | [`setup.js`](file:///c:/Users/DELL/Drone/src/js/tabs/setup.js) | `setup` | WebGL 3D attitude viewer, accelerometer calibration, backup/restore. |
| `ports` | [`ports.js`](file:///c:/Users/DELL/Drone/src/js/tabs/ports.js) | `ports` | Multi-UART serial port mapping table (MSP, Serial RX, Telemetry, GPS). |
| `configuration` | [`configuration.js`](file:///c:/Users/DELL/Drone/src/js/tabs/configuration.js) | `configuration` | Mixer airframe selection, system features, beeper conditions, board alignment. |
| `power` | [`power.js`](file:///c:/Users/DELL/Drone/src/js/tabs/power.js) | `power` | Battery voltage calibration, current meter scale, cell voltage limits. |
| `failsafe` | [`failsafe.js`](file:///c:/Users/DELL/Drone/src/js/tabs/failsafe.js) | `failsafe` | Stage 1/2 failsafe switch behavior, guard timers, GPS rescue fallback. |
| `presets` | [`presets/presets.js`](file:///c:/Users/DELL/Drone/src/tabs/presets/presets.js) | `presets` | Community presets browser, GitHub index search, CLI script applicator. |
| `pid_tuning` | [`pid_tuning.js`](file:///c:/Users/DELL/Drone/src/js/tabs/pid_tuning.js) | `pid_tuning` | Master PID sliders, D-term/gyro filters, feedforward, rates curves. |
| `receiver` | [`receiver.js`](file:///c:/Users/DELL/Drone/src/js/tabs/receiver.js) | `receiver` | RC channel monitor bars, stick map, deadbands, RSSI input channel. |
| `auxiliary` | [`auxiliary.js`](file:///c:/Users/DELL/Drone/src/js/tabs/auxiliary.js) | `auxiliary` | RC mode switches (ARM, ANGLE, HORIZON, AIRMODE, BEEPER, TURTLE). |
| `adjustments` | [`adjustments.js`](file:///c:/Users/DELL/Drone/src/js/tabs/adjustments.js) | `adjustments` | In-flight adjustment rules linked to switches or potentiometers. |
| `servos` | [`servos.js`](file:///c:/Users/DELL/Drone/src/js/tabs/servos.js) | `servos` | Servo mixer channel mapping, direction, min/max endpoints. |
| `gps` | [`gps.js`](file:///c:/Users/DELL/Drone/src/js/tabs/gps.js) | `gps` | GPS 3D fix status, satellite constellation, OpenLayers live map view. |
| `motors` | [`motors.js`](file:///c:/Users/DELL/Drone/src/js/tabs/motors.js) | `motors` | Motor bench test sliders, DShot motor direction & reorder wizards. |
| `osd` | [`osd.js`](file:///c:/Users/DELL/Drone/src/js/tabs/osd.js) | `osd` | Drag-and-drop OSD canvas layout editor, font manager, HD/SD video modes. |
| `vtx` | [`vtx.js`](file:///c:/Users/DELL/Drone/src/js/tabs/vtx.js) | `vtx` | Video transmitter band/channel/power tables, JSON VTX table import. |
| `transponder` | [`transponder.js`](file:///c:/Users/DELL/Drone/src/js/tabs/transponder.js) | `transponder` | IR race transponder configuration (i-Lap, ArcRF). |
| `led_strip` | [`led_strip.js`](file:///c:/Users/DELL/Drone/src/js/tabs/led_strip.js) | `led_strip` | Interactive 16x16 grid WS2812 LED strip designer. |
| `sensors` | [`sensors.js`](file:///c:/Users/DELL/Drone/src/js/tabs/sensors.js) | `sensors` | Real-time oscilloscopes for Gyro, Accel, Mag, Baro, Sonar. |
| `logging` | [`logging.js`](file:///c:/Users/DELL/Drone/src/js/tabs/logging.js) | `logging` | Serial blackbox log downloader. |
| `onboard_logging` | [`onboard_logging.js`](file:///c:/Users/DELL/Drone/src/js/tabs/onboard_logging.js) | `onboard_logging` | Onboard flash / SD card Blackbox log manager and eraser. |
| `cli` | [`cli.js`](file:///c:/Users/DELL/Drone/src/js/tabs/cli.js) | `cli` | Command Line Interface terminal with autocomplete and diff dump. |
| `options` | [`options.js`](file:///c:/Users/DELL/Drone/src/js/tabs/options.js) | `options` | Configurator application preferences. |
| `help` | [`help.js`](file:///c:/Users/DELL/Drone/src/js/tabs/help.js) | `help` | Links to documentation, discord, manual, and support. |
| `static_tab` | [`static_tab.js`](file:///c:/Users/DELL/Drone/src/js/tabs/static_tab.js) | `staticTab` | Generic renderer for static markdown views (Privacy Policy, Changelog). |
| `firmware_flasher` | [`firmware_flasher.js`](file:///c:/Users/DELL/Drone/src/js/tabs/firmware_flasher.js) | `firmware_flasher` | Online and local firmware flashing controller. |
| `setup_osd` | [`setup_osd.js`](file:///c:/Users/DELL/Drone/src/js/tabs/setup_osd.js) | `setup_osd` | Specialized setup tab for standalone OSD boards. |
| `receiver_msp` | [`receiver_msp.js`](file:///c:/Users/DELL/Drone/src/js/tabs/receiver_msp.js) | `receiver_msp` | Software-driven MSP RC channel input generator. |
| *(sub-module)* | [`map.js`](file:///c:/Users/DELL/Drone/src/js/tabs/map.js) | `initMap()` | OpenLayers map initializer used internally by `gps.js`. Not a routed tab. Exports one function: `initMap()` which builds OSM, Google Satellite, and Google Hybrid tile layers, places GPS/Mag/NoFix icon markers, and registers `$('#Hybrid')` / `$('#Satellite')` / `$('#Street')` click handlers. 138 lines. |

---

## 5. Non-Routed Template Files (`src/tabs/`)

These files reside in `src/tabs/` but are **not dispatched by the tab router** in `main.js` or `gui.js`.

| File | Lines | Description | Status |
| :--- | :---: | :--- | :--- |
| [`src/tabs/blank.html`](file:///c:/Users/DELL/Drone/src/tabs/blank.html) | 1 | Single `<div class="tab-adjustments" style="width:100%;height:100%;background-color:#000000;">`. Black-background placeholder used during tab loading transitions. | Active — used as loading screen fill |
| [`src/tabs/review.html`](file:///c:/Users/DELL/Drone/src/tabs/review.html) | 11 | "Rate this app" dialog with i18n keys `reviewhead`, `reviewInitial`, `reviewStore`, `reviewBug`, `reviewYes`, `reviewNo`. None of these keys exist in any of the 19 locale files. File is not imported or referenced anywhere in the active codebase. Present since initial commit; only one commit exists in this repo. **Conclusion (inferred):** Orphaned dead code ported from an earlier Chrome App or Cordova build. Never activated in this codebase. |
