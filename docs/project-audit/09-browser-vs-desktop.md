# 09 — Execution Environments: Web Preview vs. Desktop Application

This document provides a systematic technical comparison between the **Web Preview / PWA execution environment** and the **Original Desktop NW.js Application** (including the Cordova mobile target).

---

## 1. Environment Architectural Breakdown

### 1.1. Web Preview / Browser Environment
- **Runtime**: Modern Evergreen Web Browser (Chrome, Edge, Opera) with Web Serial API support.
- **Entry Point**: [`src/index.html`](file:///c:/Users/DELL/Drone/src/index.html) loaded via Vite dev server (`http://localhost:8000`) or built PWA (`vite-plugin-pwa`).
- **Script Bootstrap**: [`src/js/browserMain.js`](file:///c:/Users/DELL/Drone/src/js/browserMain.js) dynamically imports Less stylesheets and mounts `main.js`.
- **Environment Detection**: Evaluated as `isWeb() === true` ([`src/js/utils/isWeb.js`](file:///c:/Users/DELL/Drone/src/js/utils/isWeb.js)) based on `!!import.meta.env`.
- **Security Context**: Strictly constrained by browser sandbox rules: no arbitrary filesystem access, no raw TCP sockets, no background Node.js threads.

### 1.2. Original Desktop Application (NW.js)
- **Runtime**: NW.js `0.72.0` (Chromium + Node.js unified runtime) configured in [`package.json`](file:///c:/Users/DELL/Drone/package.json) and [`gulpfile.js`](file:///c:/Users/DELL/Drone/gulpfile.js).
- **Entry Point**: [`src/main.html`](file:///c:/Users/DELL/Drone/src/main.html) declared in `package.json:6` (`"main": "main.html"`).
- **Script Bootstrap**: Directly links pre-compiled CSS stylesheets and executes [`src/js/main.js`](file:///c:/Users/DELL/Drone/src/js/main.js).
- **Environment Detection**: Evaluated as `GUI.isNWJS() === true` ([`src/js/gui.js:75–76`](file:///c:/Users/DELL/Drone/src/js/gui.js#L75-L76)) by verifying `require('nw.gui')`.
- **Security Context**: Full desktop privileges: access to Node.js standard libraries (`fs`, `child_process`, `os`), native window menus, unconstrained raw USB access (`chrome.usb`), and raw TCP sockets.

---

## 2. Technical Comparison Matrix

| Feature / Capability | Browser Preview Behavior | Desktop NW.js Behavior | Source-Code Evidence | Verification Status | Limitations & Unresolved Questions |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Serial Communication** | Uses Web Serial API (`navigator.serial`). Requires user to manually pick device from browser modal prompt. | Uses `chrome.serial` API. Automatically enumerates all connected serial ports into dropdown. | [`src/js/serial_backend.js:27–31`](file:///c:/Users/DELL/Drone/src/js/serial_backend.js#L27-L31) | **Verified** | Web Serial requires Chrome/Edge; unsupported on Firefox or Safari. |
| **Virtual Flight Controller** | Fully operational. Allows testing all 28 tabs without physical hardware. | Fully operational. | [`src/js/VirtualFC.js`](file:///c:/Users/DELL/Drone/src/js/VirtualFC.js), [`serial_backend.js:117`](file:///c:/Users/DELL/Drone/src/js/serial_backend.js#L117) | **Verified** | Virtual FC uses static mock data; does not simulate actual flight physics. |
| **Firmware Flashing (USB DFU)** | **Not Available**. `PortHandler.initialize()` returns `'not implemented'` in web mode. | Fully supported via `chrome.usb` control transfers for STM32, GD32, AT32, APM32. | [`src/js/port_handler.js:36–38`](file:///c:/Users/DELL/Drone/src/js/port_handler.js#L36-L38), [`stm32usbdfu.js`](file:///c:/Users/DELL/Drone/src/js/protocols/stm32usbdfu.js) | **Verified** | WebUSB DFU is not yet implemented in the web codebase. Flashing requires desktop. |
| **mDNS Network Discovery** | **Disabled**. Web browsers cannot bind raw multicast UDP sockets. | Fully supported via Node `bonjour` library to discover wireless ELRS receivers. | [`src/js/mdns_discovery.js:53–65`](file:///c:/Users/DELL/Drone/src/js/mdns_discovery.js#L53-L65) | **Verified** | In web preview, network receivers must be typed manually as IP addresses. |
| **Filesystem / File Choosers** | Relies on HTML5 `<input type="file">` and `Blob` downloads for config backup/restore. | Uses native `chrome.fileSystem.chooseEntry()` dialogs. | [`src/js/gui.js:447–511`](file:///c:/Users/DELL/Drone/src/js/gui.js#L447-L511) | **Verified** | In browser preview, save path is determined by standard browser download folder. |
| **Background Timers** | Subject to browser tab throttling when minimized or backgrounded. | Timer intervals remapped to Node.js `global.setInterval` to prevent background freezing. | [`src/js/main.js:40–50`](file:///c:/Users/DELL/Drone/src/js/main.js#L40-L50) | **Verified** | Long operations (like blackbox download) may slow down if web tab is backgrounded. |
| **Window Frame & DevTools** | Rendered inside browser viewport; devtools toggled via browser F12. | Custom frameless NW.js window; devtools opened programmatically via `nwWindow.showDevTools()`. | [`package.json:26–32`](file:///c:/Users/DELL/Drone/package.json#L26-L32), [`main.js:201`](file:///c:/Users/DELL/Drone/src/js/main.js#L201) | **Verified** | None. |
| **Offline Execution** | Handled via Service Worker (`vite-plugin-pwa` caching HTML/JS/CSS). | Inherently offline native desktop application. | [`src/js/browserMain.js:54–60`](file:///c:/Users/DELL/Drone/src/js/browserMain.js#L54-L60) | **Verified** | Cloud builds require active internet connection in both environments. |

---

## 3. Mobile Execution Target (Apache Cordova)

The repository also maintains an Apache Cordova mobile build target:
- **Entry Point**: [`src/main_cordova.html`](file:///c:/Users/DELL/Drone/src/main_cordova.html) & [`src/js/main_cordova.js`](file:///c:/Users/DELL/Drone/src/js/main_cordova.js).
- **USB OTG Serial**: Bridges Android USB host controller via `cordova/usb_device_filter.xml` to connect flight controllers via USB OTG cable.
- **Mobile UI**: Controlled by [`src/js/phones_ui.js`](file:///c:/Users/DELL/Drone/src/js/phones_ui.js) adjusting viewport scaling, swipe gestures (`jquery-touchswipe`), and hardware back-button interceptors.
- **Network Discovery**: Uses `cordova.plugins.zeroconf` ([`mdns_discovery.js:22–51`](file:///c:/Users/DELL/Drone/src/js/mdns_discovery.js#L22-L51)) to detect WiFi drones.
