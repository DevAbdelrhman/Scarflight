# 00 — Executive Overview & Project Identity

## 1. Project Purpose & Summary

**Betaflight Configurator** is the official cross-platform ground station and configuration utility for the [Betaflight](https://github.com/betaflight/betaflight) open-source flight controller firmware. The application serves drone pilots, developers, and hardware manufacturers worldwide, providing end-to-end tooling for:

1. **Hardware Setup & Orientation**: Live 3D gyro/attitude visualization (using Three.js), accelerometer calibration, board alignment, and peripheral management.
2. **Firmware Flashing & Cloud Builds**: In-system flashing of flight controller boards via USB DFU (STM32, GD32, AT32, APM32) and serial bootloaders, including cloud-customized firmware builds from `https://build.betaflight.com`.
3. **Flight Control & Tuning**: Comprehensive PID loops, Feedforward, D-term filters, dynamic gyro notch filtering, RC rates curves, and in-flight adjustment profiles.
4. **Peripherals & Communication**: Multi-UART serial port mapping (MSP, Serial RX, Telemetry, GPS, Blackbox), OSD (On-Screen Display) canvas layout editor, VTX (Video Transmitter) frequency/power management, and LED strip programming.
5. **Community Presets**: One-click configuration presets fetched from community repositories for tuning, RC links (ExpressLRS, Crossfire), filters, and OS/hardware profiles.
6. **Diagnostics & Logging**: Real-time sensor graph visualizers, motor test bench sliders, DShot ESC direction/reordering wizards, and Blackbox flash/SD card log downloads.

---

## 2. Project Metadata & Baseline Information

| Attribute | Inspected Value | Source Reference |
| :--- | :--- | :--- |
| **Package Name** | `betaflight-configurator` | [`package.json:2`](file:///c:/Users/DELL/Drone/package.json#L2) |
| **Product Name** | `Betaflight Configurator` | [`package.json:3`](file:///c:/Users/DELL/Drone/package.json#L3) |
| **Application Version** | `10.10.0` | [`package.json:5`](file:///c:/Users/DELL/Drone/package.json#L5) |
| **Repository URL** | `github.com/betaflight/betaflight-configurator` | [`package.json:35`](file:///c:/Users/DELL/Drone/package.json#L35) |
| **License** | GPL-3.0 | [`package.json:38`](file:///c:/Users/DELL/Drone/package.json#L38) |
| **Target Engine** | Node.js `20.x` | [`package.json:40`](file:///c:/Users/DELL/Drone/package.json#L40) |
| **Current Git Branch** | `main` | Verified via Git metadata |
| **Current Git Commit** | `a37a8925b6d340cb375575357dae690f07cbe9aa` | Git commit hash |
| **Audit Date** | October 19, 2026 | System execution timestamp |
| **Audit Status** | Read-Only Complete System Functional Audit | Verified across 18 modular audit documents (00–17) |

---

## 3. High-Level Architecture & Runtime Environments

Betaflight Configurator employs a **hybrid architecture** that bridges legacy Google Chrome App origins, modern Vite/Vue 2 componentization, native desktop packaging (NW.js), and mobile runtime support (Apache Cordova).

```mermaid
graph TD
    subgraph Execution_Environments ["Execution Environments"]
        Browser["Modern Web Browser / PWA (Vite 4 Dev & Build)"]
        Desktop["Desktop Application (NW.js 0.72.0 on Win/Mac/Linux/ARM)"]
        Mobile["Mobile App (Apache Cordova for Android/iOS)"]
    end

    subgraph Entry_Points ["Entry Points"]
        IndexHtml["src/index.html (Vite entry)"]
        MainHtml["src/main.html (NW.js entry)"]
        CordovaHtml["src/main_cordova.html (Cordova entry)"]
    end

    subgraph Core_Runtime ["Core Application Runtime"]
        AppReady["src/js/main.js (Lifecycle, Tab Router, DOM Bindings)"]
        VueInit["src/components/init.js (Vue 2 App: Header, Logo, StatusBar)"]
        GUI["src/js/gui.js (GuiControl: Timers, Dialogs, State)"]
        FCStore["src/js/fc.js (Flight Controller Data Store)"]
        ConfigStorage["src/js/ConfigStorage.js (localStorage Engine)"]
    end

    subgraph Hardware_Abstractions ["Hardware & Communication Abstraction"]
        SerialSwitch{"serial_backend.js: isWeb()?"}
        WebSerial["src/js/webSerial.js (Web Serial API: navigator.serial)"]
        NWSerial["src/js/serial.js (chrome.serial / native socket)"]
        VirtualFC["src/js/VirtualFC.js (Simulated Hardware Testbench)"]
        DFU["src/js/protocols/stm32usbdfu.js (chrome.usb DFU)"]
        MSP["src/js/msp.js & MSPHelper.js (MSP v1, v2 & Jumbo Frames)"]
    end

    subgraph UI_Modules ["28 Specialized Tabs & View Modules"]
        Landing["landing.js"]
        Setup["setup.js (Three.js 3D Model)"]
        PID["pid_tuning.js (TuningSliders & RateCurve)"]
        PresetsTab["presets/presets.js (PresetsRepoIndexed)"]
        OSDTab["osd.js (Canvas OSD Layout & Font)"]
        MotorsTab["motors.js (EscDshotDirection & MotorOutputReordering)"]
        CLITab["cli.js (CliAutoComplete)"]
        OtherTabs["... 21 Additional Tabs"]
    end

    Browser --> IndexHtml --> AppReady
    Desktop --> MainHtml --> AppReady
    Mobile --> CordovaHtml --> AppReady

    AppReady --> VueInit
    AppReady --> GUI
    AppReady --> FCStore
    AppReady --> SerialSwitch

    SerialSwitch -->|Yes (Browser)| WebSerial
    SerialSwitch -->|No (Desktop)| NWSerial
    SerialSwitch -->|Virtual Mode| VirtualFC

    WebSerial --> MSP
    NWSerial --> MSP
    NWSerial --> DFU

    MSP --> FCStore
    FCStore --> UI_Modules
```

---

## 4. Key Execution Environments Compared

| Environment | Entry Point | Serial Protocol | DFU Flashing | Filesystem Access | Network Discovery |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Web Preview / PWA** | [`src/index.html`](file:///c:/Users/DELL/Drone/src/index.html) via Vite (`localhost:8000`) | Web Serial API (`navigator.serial` in [`webSerial.js`](file:///c:/Users/DELL/Drone/src/js/webSerial.js)) | **Not Supported** (WebUSB DFU not implemented) | HTML5 Blob / File API | **Not Supported** (Raw mDNS sockets unavailable in browser) |
| **Desktop Application** | [`src/main.html`](file:///c:/Users/DELL/Drone/src/main.html) via NW.js `0.72.0` | `chrome.serial` in [`serial.js`](file:///c:/Users/DELL/Drone/src/js/serial.js) | **Supported** via `chrome.usb` ([`stm32usbdfu.js`](file:///c:/Users/DELL/Drone/src/js/protocols/stm32usbdfu.js)) | Native `chrome.fileSystem` & Node.js `fs` | **Supported** via `bonjour` ([`mdns_discovery.js`](file:///c:/Users/DELL/Drone/src/js/mdns_discovery.js)) |
| **Mobile Runtime** | [`src/main_cordova.html`](file:///c:/Users/DELL/Drone/src/main_cordova.html) via Cordova | Cordova Chrome API plugin | Restricted | Cordova file plugin | **Supported** via `cordova.plugins.zeroconf` |

---

## 5. Summary of Audit Findings & Status

1. **Architecture Integrity**:
   - The application functions as an event-driven Single Page Application with dynamic tab mounting into `#content` and a reactive Vue 2 header/footer shell.
   - 28 functional tabs and view controllers have been identified, traced to implementation, and audited.
2. **Virtual Flight Controller Mode**:
   - Built-in simulation mode in [`src/js/VirtualFC.js`](file:///c:/Users/DELL/Drone/src/js/VirtualFC.js) allows full testing of all tabs and UI interactions in web preview without requiring physical drone hardware.
3. **Confirmed Defects & Operational Risks**:
   - **Missing ESLint Config**: No `.eslintrc` configuration file exists in the repository root, causing `yarn lint` and Git pre-commit hooks (`husky`) to abort with exit code 1.
   - **Circular Dependency**: Circular import between [`src/js/serial_backend.js`](file:///c:/Users/DELL/Drone/src/js/serial_backend.js) and [`src/js/msp/MSPHelper.js`](file:///c:/Users/DELL/Drone/src/js/msp/MSPHelper.js).
   - **Dead Code**: [`src/js/GitHubApi.js`](file:///c:/Users/DELL/Drone/src/js/GitHubApi.js) is unreferenced across the codebase.
4. **Documentation Structure**:
   - This audit is split into 18 modular documents (00 through 17) in `docs/project-audit/` to provide complete, source-verified coverage for future human engineers and AI coding agents.
