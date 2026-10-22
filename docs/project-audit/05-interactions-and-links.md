# 05 — Interactions, Controls & External Links Inventory

This document catalogs the interactive elements, click handlers, form inputs, toggles, keyboard shortcuts, and external hyperlinks discovered across Scarflight Configurator.

---

## 1. Global Navigation & Headerbar Interactions

| Control Description | Selector / DOM | Event | Handler / Call Chain | State Read / Written | Hardware / Native Operation | Verification Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Connect / Disconnect Button** | `div.connect_controls a.connect` | `click` | `main.js` -> [`serial_backend.js:87`](file:///c:/Users/DELL/Drone/src/js/serial_backend.js#L87) | Reads `#port`, `#baud`, `CONFIGURATOR.virtualMode`. Writes `GUI.connecting_to`, `isConnected`. | Calls `serial.connect()` / `webSerial.connect()`. Sends initial MSP handshake sequence. | **Verified** |
| **Firmware Flasher Button** | `div.open_firmware_flasher a.flash` | `click` | [`main.js:277–284`](file:///c:/Users/DELL/Drone/src/js/main.js#L277-L284) | Checks `GUI.connected_to`. If connected, clicks disconnect first. | Transitions view to `.tab_firmware_flasher`. | **Verified** |
| **Show/Hide Log Button** | `#showlog` | `click` | [`main.js:536–559`](file:///c:/Users/DELL/Drone/src/js/main.js#L536-L559) | Toggles `$(this).data('state')`. Writes `ConfigStorage.set({'logopen': state})`. | Expands/collapses `#log` drawer and scrolls to bottom. | **Verified** |
| **Expert Mode Toggle** | `input[name="expertModeCheckbox"]` | `change` | [`main.js:571–587`](file:///c:/Users/DELL/Drone/src/js/main.js#L571-L587) | Reads checked state. Writes `ConfigStorage.set({'expertMode': checked})`. | Invokes `updateTabList(FC.FEATURE_CONFIG.features)` and notifies active tab's `expertModeChanged(checked)`. | **Verified** |
| **Numeric Inputs Sanitizer** | `#content input[type="number"]` | `keydown`, `change` | [`main.js:479–534`](file:///c:/Users/DELL/Drone/src/js/main.js#L479-L534) | Reads `min`, `max`, `step`, and `data('previousValue')`. | Whitelists numeric keycodes (0–9, minus, dot, backspace). Restricts value within min/max bounds. | **Verified** |
| **Documentation Button** | `#button-documentation` | `click` | [`gui.js:315–317`](file:///c:/Users/DELL/Drone/src/js/gui.js#L315-L317) | Reads `GUI.active_tab`. | Opens external URL `https://Scarflight.com/docs/wiki/configurator/<tab>-tab` in default browser. | **Verified** |

---

## 2. Key Tab Action Controls

### 2.1. Setup Tab (`src/js/tabs/setup.js`)

| Control Label | Selector | Event | Implementation Call Chain | Resulting Side Effect |
| :--- | :--- | :--- | :--- | :--- |
| **Calibrate Accelerometer** | `#acc_calibration` | `click` | `MSP.send_message(MSPCodes.MSP_ACC_CALIBRATION)` | FC samples accelerometer offsets over 2 seconds; locks orientation. |
| **Reset Z axis** | `#reset_zaxis` | `click` | `model.resetHeading()` | Zeroes out current yaw offset in Three.js visualizer. |
| **Backup** | `#backup` | `click` | [`backup_restore.js:backup()`](file:///c:/Users/DELL/Drone/src/js/backup_restore.js) | Queries all FC config tables via MSP, generates JSON object, triggers file save dialog. |
| **Restore** | `#restore` | `click` | [`backup_restore.js:restore()`](file:///c:/Users/DELL/Drone/src/js/backup_restore.js) | Opens JSON file picker, validates schema with `djv`, writes parameters back via MSP. |
| **Reboot to Bootloader** | `#reboot_bootloader` | `click` | `MSP.send_message(MSPCodes.MSP_SET_REBOOT, [rebootBootloader])` | Triggers FC reboot into ROM DFU bootloader; auto-switches to Firmware Flasher tab. |

### 2.2. PID Tuning Tab (`src/js/tabs/pid_tuning.js`)

| Control Label | Selector | Event | Implementation Call Chain | Resulting Side Effect |
| :--- | :--- | :--- | :--- | :--- |
| **Master Multiplier Slider** | `.slider-master-multiplier` | `change` | [`TuningSliders.js:applyMasterMultiplier()`](file:///c:/Users/DELL/Drone/src/js/TuningSliders.js) | Recalculates Roll/Pitch/Yaw P, I, D, and Feedforward values proportionately. |
| **Dampening Slider** | `.slider-dampening` | `change` | [`TuningSliders.js:applyDampening()`](file:///c:/Users/DELL/Drone/src/js/TuningSliders.js) | Modulates D gains against P gains according to aerodynamic ratio. |
| **Profile Selector** | `#pid-profile-dropdown` | `change` | `MSP.send_message(MSPCodes.MSP_SELECT_SETTING, [profileIndex])` | Switches active flight profile (1–4) on FC memory. |
| **Save Button** | `#save_btn` | `click` | `MSPHelper.set_pid(...)` -> `MSPHelper.write_to_eeprom()` | Writes PID/filter values via `MSP_SET_PID`, commits to EEPROM via `MSP_EEPROM_WRITE`. |

### 2.3. Motors Tab (`src/js/tabs/motors.js`)

| Control Label | Selector | Event | Implementation Call Chain | Resulting Side Effect |
| :--- | :--- | :--- | :--- | :--- |
| **Motor Safety Checkbox** | `#safety_switch` | `change` | `motors.js:toggleSafety(e)` | Enables or disables the motor slider track handles. |
| **Master Motor Slider** | `#slider_master` | `input` | `motors.js:setAllMotors(val)` | Sends `MSP_SET_MOTOR` with identical throttle value across all active motor channels. |
| **Reorder Motors** | `#reorder_motors_btn` | `click` | Mounts `MotorOutputReordering.vue` modal | Interactively remaps resource pins for motors 1–8; writes CLI `resource motor` commands. |
| **Motor Direction** | `#motor_direction_btn` | `click` | Mounts `EscDshotDirection.vue` modal | Sends bidirectional DShot command packets to ESCs to test and flip spin directions. |

### 2.4. CLI Tab (`src/js/tabs/cli.js`)

| Control Label | Selector | Event | Implementation Call Chain | Resulting Side Effect |
| :--- | :--- | :--- | :--- | :--- |
| **Command Input Field** | `#cli_input` | `keydown` (Enter) | `cli.js:sendLine(text)` | Appends command to terminal, transmits raw ASCII string over serial port. |
| **Save to File** | `#save_to_file_btn` | `click` | `GUI.saveToTextFileDialog(cliOutputText, filename, 'txt')` | Exports terminal log / diff dump to local text file. |
| **Clear Buffer** | `#clear_buffer_btn` | `click` | `$('#cli_window').empty()` | Clears onscreen terminal history buffer. |

---

## 3. External Hyperlinks Directory

All external hyperlinks have been inspected in source templates. Target behavior is enforced by `GUI.addLinksTargetBlank()` ([`gui.js:521`](file:///c:/Users/DELL/Drone/src/js/gui.js#L521)) and in NW.js by `new-win-policy` opening in the external browser ([`main.js:193–198`](file:///c:/Users/DELL/Drone/src/js/main.js#L193-L198)).

| Link Display Text | File Reference | Destination URL | Purpose |
| :--- | :--- | :--- | :--- |
| **Scarflight Blackbox Log Viewer** | [`src/tabs/landing.html:13`](file:///c:/Users/DELL/Drone/src/tabs/landing.html#L13) | `https://github.com/Scarflight/blackbox-log-viewer/releases` | Downloader for standalone flight log analysis tool. |
| **Scarflight TX Lua Scripts** | [`src/tabs/landing.html:17`](file:///c:/Users/DELL/Drone/src/tabs/landing.html#L17) | `https://github.com/Scarflight/Scarflight-tx-lua-scripts/releases` | OpenTX / EdgeTX transmitter Lua scripts. |
| **Scarflight Firmware Source Code** | [`src/tabs/landing.html:24`](file:///c:/Users/DELL/Drone/src/tabs/landing.html#L24) | `https://github.com/Scarflight/Scarflight` | Core C firmware GitHub repository. |
| **CP210x Drivers** | [`src/tabs/landing.html:36`](file:///c:/Users/DELL/Drone/src/tabs/landing.html#L36) | `https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers` | Silicon Labs USB-to-UART VCP driver download. |
| **STM USB VCP Drivers** | [`src/tabs/landing.html:42`](file:///c:/Users/DELL/Drone/src/tabs/landing.html#L42) | `https://www.st.com/en/development-tools/stsw-stm32102.html` | STMicroelectronics Virtual COM Port driver download. |
| **Zadig Driver Installer** | [`src/tabs/landing.html:48`](file:///c:/Users/DELL/Drone/src/tabs/landing.html#L48) | `https://zadig.akeo.ie/` | USB driver replacer for STM32 DFU WinUSB installation. |
| **ImpulseRC Driver Fixer** | [`src/tabs/landing.html:54`](file:///c:/Users/DELL/Drone/src/tabs/landing.html#L54) | `https://impulserc.blob.core.windows.net/utilities/ImpulseRC_Driver_Fixer.exe` | Automated Windows DFU driver repair tool. |
| **Scarflight Wiki** | [`src/tabs/landing.html:64`](file:///c:/Users/DELL/Drone/src/tabs/landing.html#L64) | `https://Scarflight.com/docs/wiki` | Official documentation and setup tutorials. |
| **Scarflight Support Discord** | [`src/tabs/help.html:20`](file:///c:/Users/DELL/Drone/src/tabs/help.html#L20) | `https://discord.Scarflight.com/` | Real-time community assistance server. |
| **Donate (PayPal)** | [`src/tabs/landing.html:84`](file:///c:/Users/DELL/Drone/src/tabs/landing.html#L84) | `https://paypal.me/Scarflight` | Open-source developer fund donation link. |
| **Patreon** | [`src/tabs/landing.html:88`](file:///c:/Users/DELL/Drone/src/tabs/landing.html#L88) | `https://www.patreon.com/Scarflight` | Monthly recurring contribution page. |
| **Sponsor: NewBeeDrone** | [`src/tabs/landing.html:95`](file:///c:/Users/DELL/Drone/src/tabs/landing.html#L95) | `https://newbeedrone.com` | Official manufacturer sponsor. |
| **Sponsor: SpeedyBee** | [`src/tabs/landing.html:98`](file:///c:/Users/DELL/Drone/src/tabs/landing.html#L98) | `https://www.speedybee.com` | Official manufacturer sponsor. |
| **Sponsor: RadioLink** | [`src/tabs/landing.html:101`](file:///c:/Users/DELL/Drone/src/tabs/landing.html#L101) | `https://www.radiolink.com` | Official manufacturer sponsor. |
| **Sponsor: Holybro** | [`src/tabs/landing.html:104`](file:///c:/Users/DELL/Drone/src/tabs/landing.html#L104) | `https://holybro.com` | Official manufacturer sponsor. |
