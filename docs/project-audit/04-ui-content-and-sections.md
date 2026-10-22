# 04 — UI Content, Elements & Layout Inventory

This document details the pixel-level layout structure, UI components, displayed text, and conditional visual elements across the entire Betaflight Configurator interface.

---

## 1. Top Headerbar Layout & Persistent Elements

The top navigation headerbar (`div.headerbar`) remains visible across all application views and contains critical hardware status, connection controls, and global toggles.

```text
+------------------------------------------------------------------------------------------------------------------------------------+
| [=]  [Logo + Version]  |  [Port Dropdown / Virtual] [Baud] [Auto]  |  [Battery] [Sensors: G A M B G S] [Expert]  |  [Flash] [Connect] | [:]|
+------------------------------------------------------------------------------------------------------------------------------------+
```

### 1.1. Headerbar Elements Breakdown (Left to Right)

| DOM Element ID / Selector | Type | Visual Content / Text | Source Component | Behavior & Conditions |
| :--- | :--- | :--- | :--- | :--- |
| `#menu_btn` | Icon Button | FontAwesome `fa-bars` | [`src/index.html:20`](file:///c:/Users/DELL/Drone/src/index.html#L20) | Mobile drawer toggle. Expands or collapses sidebar tabs in mobile / narrow viewports. |
| `<betaflight-logo>` | Vue Component | Betaflight Bee SVG, "Configurator: 10.10.0", Target & Firmware ID | [`src/components/betaflight-logo/`](file:///c:/Users/DELL/Drone/src/components/betaflight-logo) | Shows Configurator version; upon FC connection, dynamically displays firmware version (e.g. `4.5.0`) and hardware target. |
| `#port-override-option` | Text Input Container | Label "Port:", `<input id="port-override" value="/dev/rfcomm0">` | [`src/index.html:30`](file:///c:/Users/DELL/Drone/src/index.html#L30) | Hidden by default; visible only when "Manual" is selected in the port dropdown ([`serial_backend.js:55`](file:///c:/Users/DELL/Drone/src/js/serial_backend.js#L55)). |
| `#firmware-virtual-option` | Select Dropdown | `#firmware-version-dropdown` listing API versions (e.g. `1.46.0`, `1.45.0`, `1.44.0`) | [`src/index.html:36`](file:///c:/Users/DELL/Drone/src/index.html#L36) | Visible when "Virtual" port is selected. Configures simulated API version for `VirtualFC.js`. |
| `#port` | Select Dropdown | Options: Detected COM ports, `tcp://...` (mDNS), "Virtual", "Manual" | [`src/index.html:43`](file:///c:/Users/DELL/Drone/src/index.html#L43) | Populated dynamically by `PortHandler` or `PortsInput.vue`. Locked/disabled during active connection. |
| `#auto-connect-switch` | Checkbox Toggle | Switchery toggle, text "Auto-Connect" | [`src/index.html:49`](file:///c:/Users/DELL/Drone/src/index.html#L49) | If checked, automatically connects to newly inserted USB COM ports. Hidden when device is in DFU mode. |
| `#baud` | Select Dropdown | 115200 (default), 57600, 38400, 19200, 9600, 250000, 500000, 1000000 | [`src/index.html:57`](file:///c:/Users/DELL/Drone/src/index.html#L57) | Configures serial baud rate. Hidden when DFU bootloader is detected. |
| `<battery-icon>` & `<battery-legend>` | Vue Components | Dynamic battery graphic + voltage readout (e.g. `16.4V`) | [`src/components/quad-status/`](file:///c:/Users/DELL/Drone/src/components/quad-status) | Bound to `FC.ANALOG.voltage` and `FC.BATTERY_STATE`. Updates color (green -> yellow -> red) based on cell thresholds. |
| `.bottomStatusIcons` | Status Icons | Armed (`.armedicon`), Failsafe (`.failsafeicon`), Link (`.linkicon`) | [`src/index.html:91`](file:///c:/Users/DELL/Drone/src/index.html#L91) | Highlighted dynamically when the quad is armed, in failsafe mode, or has RC link active. |
| `#sensor-status` | Icon Bar | `gyro`, `accel`, `mag`, `baro`, `gps`, `sonar` | [`src/index.html:97`](file:///c:/Users/DELL/Drone/src/index.html#L97) | Shows hardware sensor health: inactive (grey), active/healthy (blue), or hardware failure (red). |
| `#dataflash_wrapper_global` | Status Gauge | Free dataflash space legend + gauge | [`src/index.html:119`](file:///c:/Users/DELL/Drone/src/index.html#L119) | Shows percentage of onboard flash memory used for Blackbox logs. |
| `#expertMode` | Checkbox Toggle | "Enable Expert Mode" | [`src/index.html:126`](file:///c:/Users/DELL/Drone/src/index.html#L126) | Unlocks advanced tabs, expert PID sliders, and low-level CLI commands. Persisted in `localStorage`. |
| `#flashbutton` | Button | Icon + "Update Firmware" | [`src/index.html:135`](file:///c:/Users/DELL/Drone/src/index.html#L135) | Opens the Firmware Flasher tab. Disabled while connected to an active FC. |
| `#connectbutton` | Primary Button | Icon + "Connect" / "Disconnect" / "Connecting..." | [`src/index.html:141`](file:///c:/Users/DELL/Drone/src/index.html#L141) | Triggers connection handshake via `serial_backend.js`. Background changes to yellow/orange when connected. |
| `#reveal_btn` | Icon Button | FontAwesome `fa-ellipsis-v` | [`src/index.html:148`](file:///c:/Users/DELL/Drone/src/index.html#L148) | Mobile dropdown toggle revealing sensor status and battery on smaller screens. |

---

## 2. Global Drawer & Bottom Status Bar

### 2.1. Collapsible Log Drawer (`#log`)
- Located immediately below the headerbar ([`src/index.html:152–158`](file:///c:/Users/DELL/Drone/src/index.html#L152-L158)).
- Controlled by `#showlog` toggle ("Show Log" / "Hide Log").
- Displays real-time serial timestamps, MSP packet receipts, connection errors, and firmware flasher progress lines.

### 2.2. Bottom Status Bar (`<status-bar>`)
- Implemented as a reactive Vue component in [`src/components/status-bar/StatusBar.vue`](file:///c:/Users/DELL/Drone/src/components/status-bar/StatusBar.vue).
- Displays six live telemetry gauges:
  1. **Port Utilization Down (`port-usage-down`)**: Inbound bytes/sec.
  2. **Port Utilization Up (`port-usage-up`)**: Outbound bytes/sec.
  3. **Packet Error (`packet-error`)**: Count of corrupted MSP checksum packets.
  4. **I2C Error (`i2c-error`)**: Hardware I2C bus collision / timeout counter (`FC.CONFIG.i2cError`).
  5. **Cycle Time (`cycle-time`)**: Main FC looptime in microseconds (e.g. `125 µs` for 8kHz loop).
  6. **CPU Load (`cpu-load`)**: Microcontroller processor load percentage (e.g. `14%`).

---

## 3. Pixel-Level Layout of Key Tabs

### 3.1. Landing Tab (`src/tabs/landing.html`)
- **Header Section**: "Welcome to Betaflight - Configurator" introductory message.
- **Sponsor Bar**: Official sponsors logo grid (NewBeeDrone, SpeedyBee, RadioLink, Holybro).
- **Documentation & Tools Grid**:
  - Links to download Blackbox Log Viewer and TX Lua Scripts.
  - Links to CP210x Virtual COM Port drivers, STM USB VCP drivers, Zadig, and ImpulseRC Driver Fixer.
- **Contributing & Support**: Links to GitHub issue tracker, Wiki, Crowdin translators, PayPal donation button, and Facebook group.

### 3.2. Setup Tab (`src/tabs/setup.html`)
- **Interactive 3D Attitude Canvas**: WebGL canvas (`#canvas`) rendering a 3D model of the selected airframe. Rotates in real time to match pitch, roll, and yaw from `FC.ATTITUDE`.
- **Primary Actions Bar**:
  - Button "Calibrate Accelerometer" (sends `MSP_ACC_CALIBRATION`).
  - Button "Reset Z axis" (zeroes current yaw heading).
  - Button "Backup" / "Restore" (opens JSON file chooser).
- **Instruments Panel**: Artificial horizon and directional gyro compass dials.
- **System Info Card**: Arming disable flags, battery voltage, firmware version, and craft name.

### 3.3. PID Tuning Tab (`src/tabs/pid_tuning.html`)
- **Sub-Tab Navigation**:
  1. *PID Profile Settings*: Master multipliers, P, I, D, Feedforward sliders for Roll, Pitch, Yaw.
  2. *Filter Settings*: 1st/2nd order Gyro Lowpass, Dynamic Notch Filter, D-term Lowpass, RPM Filter settings.
  3. *Rates*: Interactive D3 curve visualizer for Roll, Pitch, Yaw rates and expo curves.
- **Profile Selector**: Dropdown to switch between PID Profiles 1–4 and Rate Profiles 1–4.
- **Save / Reload Bar**: Floating bottom bar with "Save" (`MSP_SET_PID` + `MSP_EEPROM_WRITE`) and "Reload" buttons.

### 3.4. Motors Tab (`src/tabs/motors.html`)
- **Safety Warning Banner**: Prominent red warning banner requiring user checkbox confirmation: *"I understand the risks, propellers are removed..."* before sliders unlock.
- **Motor Sliders Bench**: Individual sliders (Motors 1 to 8) and a "Master" slider to throttle all motors concurrently.
- **Wizard Action Buttons**:
  - Button "Reorder Motors": Opens the `MotorOutputReordering` Vue modal dialog.
  - Button "Motor Direction": Opens the `EscDshotDirection` Vue modal dialog.

---

## 4. Modal Dialogs Inventory

The application defines 9 global native `<dialog>` elements in [`src/index.html:231–320`](file:///c:/Users/DELL/Drone/src/index.html#L231-L320) plus specialized Vue component modals:

| Dialog Element | Header / Purpose | Buttons | Source File |
| :--- | :--- | :--- | :--- |
| `.dialogConfiguratorUpdate` | Notice: New Configurator version available | "Go to Website", "Close" | [`src/index.html:231`](file:///c:/Users/DELL/Drone/src/index.html#L231) |
| `.dialogConnectWarning` | Warning: Arming flags or unsupported firmware | "Close" | [`src/index.html:242`](file:///c:/Users/DELL/Drone/src/index.html#L242) |
| `#dialogResetToCustomDefaults`| Notice: Board requires custom defaults | "Apply Custom Defaults", "Cancel" | [`src/index.html:252`](file:///c:/Users/DELL/Drone/src/index.html#L252) |
| `#dialogReportProblems` | Warning: Configuration problems detected | "Close" | [`src/index.html:267`](file:///c:/Users/DELL/Drone/src/index.html#L267) |
| `.dialogError` | Error: Communication failure or invalid command | "Close" | [`src/index.html:287`](file:///c:/Users/DELL/Drone/src/index.html#L287) |
| `.dialogYesNo` | Generic confirmation dialog | Yes / No buttons (dynamic labels) | [`src/index.html:297`](file:///c:/Users/DELL/Drone/src/index.html#L297) |
| `.dialogWait` | Modal loading spinner during long operations | "Cancel" (conditional) | [`src/index.html:306`](file:///c:/Users/DELL/Drone/src/index.html#L306) |
| `.dialogInformation` | Generic informational announcement | "OK" / Confirm button | [`src/index.html:314`](file:///c:/Users/DELL/Drone/src/index.html#L314) |
| `DetailedDialog` (Presets) | Preset markdown documentation, options, diff preview | "Pick", "Close" | [`src/tabs/presets/DetailedDialog`](file:///c:/Users/DELL/Drone/src/tabs/presets/DetailedDialog) |
| `SourcesDialog` (Presets) | Manage GitHub repository sources for presets | "Add Source", "Reset to Default" | [`src/tabs/presets/SourcesDialog`](file:///c:/Users/DELL/Drone/src/tabs/presets/SourcesDialog) |
| `EscDshotDirection` | Interactive ESC DShot direction testing wizard | "Spin All", "Normal", "Reverse" | [`src/components/EscDshotDirection`](file:///c:/Users/DELL/Drone/src/components/EscDshotDirection) |
| `MotorOutputReordering` | Interactive motor sequence renumbering wizard | Motor circle buttons, "Save" | [`src/components/MotorOutputReordering`](file:///c:/Users/DELL/Drone/src/components/MotorOutputReordering) |
