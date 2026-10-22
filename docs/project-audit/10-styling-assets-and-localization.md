# 10 — Styling, Design Tokens, Assets & Localization

This document details the visual design architecture, stylesheet hierarchy, responsive layout rules, media assets, and internationalization system of Scarflight Configurator.

---

## 1. Styling System & Design Tokens

The styling architecture uses **Less** preprocessor stylesheets modularized per tab, integrated with CSS Custom Properties (CSS variables) for dynamic dark/light theme switching.

### 1.1. Core Palette & Design Tokens

The global color palette is defined in [`src/css/theme.css`](file:///c:/Users/DELL/Drone/src/css/theme.css) and [`src/css/dark-theme.less`](file:///c:/Users/DELL/Drone/src/css/dark-theme.less):

| Token / CSS Variable | Light Theme Value | Dark Theme Value | Purpose & Usage |
| :--- | :--- | :--- | :--- |
| `--accent` | `#eea600` (Gold Amber) | `#eea600` (Gold Amber) | Primary brand accent color: active buttons, switchery toggles, highlights. |
| `--switcherysecond` | `#d4d4d4` | `#333333` | Background color for inactive toggle switches. |
| Background (Root) | `#f5f5f5` | `#1e1e1e` | Application background behind content cards. |
| Card / Container Surface | `#ffffff` | `#252526` | Tab content cards, panels, and data entry boxes. |
| Primary Text | `#222222` | `#e0e0e0` | Main headings, table content, form labels. |
| Secondary Text | `#666666` | `#aaaaaa` | Subtitles, helper text, units of measurement (mV, µs, deg). |
| Warning / Danger Accent | `#d9534f` (Red) | `#ff6b6b` (Red) | Arming warnings, motor safety alerts, invalid inputs, error banners. |
| Success Accent | `#5cb85c` (Green) | `#69db7c` (Green) | Successful save confirmations, healthy sensors, battery full. |

### 1.2. Dark Theme Controller (`DarkTheme.js`)
- **Modes**:
  - `0`: Light Theme.
  - `1`: Dark Theme (adds `.dark-theme` class to `<body>`).
  - `2`: Automatic (listens to OS preference via `window.matchMedia("(prefers-color-scheme: dark)")`).
- **Persistence**: User preference is stored in `localStorage` under key `darkTheme` ([`main.js:592–598`](file:///c:/Users/DELL/Drone/src/js/main.js#L592-L598)).

---

## 2. Typography & Fonts

- **Primary Font Family**: `Open Sans`, `Helvetica Neue`, `Arial`, sans-serif.
- **Embedded Webfonts**: Located in [`src/css/opensans_webfontkit/`](file:///c:/Users/DELL/Drone/src/css/opensans_webfontkit/) providing offline typography for all desktop and mobile targets without relying on external CDNs.
- **Icon Typography**: `@fortawesome/fontawesome-free` vector glyphs loaded for menu bars (`fa-bars`), options (`fa-gear`), warnings (`fa-triangle-exclamation`), and status indicators.

---

## 3. Assets Inventory

### 3.1. 3D Model Geometries (`resources/models/`)
The Setup tab uses Three.js JSON model definitions to display the real-time attitude of the drone:

| Model File | Airframe Type | Geometry Structure |
| :--- | :--- | :--- |
| [`quad_x.json`](file:///c:/Users/DELL/Drone/resources/models/quad_x.json) | Quad X (Most Common) | Standard 4-rotor symmetrical cross airframe. |
| [`quad_vtail.json`](file:///c:/Users/DELL/Drone/resources/models/quad_vtail.json) | Quad V-Tail | 4-rotor configuration with angled rear tail motors. |
| [`quad_atail.json`](file:///c:/Users/DELL/Drone/resources/models/quad_atail.json) | Quad A-Tail | 4-rotor configuration with inverted rear tail motors. |
| [`hex_x.json`](file:///c:/Users/DELL/Drone/resources/models/hex_x.json) | Hexacopter X | 6-rotor symmetrical configuration. |
| [`hex_plus.json`](file:///c:/Users/DELL/Drone/resources/models/hex_plus.json) | Hexacopter Plus | 6-rotor forward-facing configuration. |
| [`tricopter.json`](file:///c:/Users/DELL/Drone/resources/models/tricopter.json) | Tricopter | 3-rotor airframe with tilting tail servo. |
| [`y4.json`](file:///c:/Users/DELL/Drone/resources/models/y4.json) | Y4 Airframe | Y-frame with twin coaxial rear motors. |
| [`y6.json`](file:///c:/Users/DELL/Drone/resources/models/y6.json) | Y6 Airframe | 3 arms with 6 coaxial contra-rotating motors. |
| [`fallback.json`](file:///c:/Users/DELL/Drone/resources/models/fallback.json) | Generic Box | Simplified geometric proxy used when custom model fails to load. |

### 3.2. Motor Order Diagrams (`resources/motor_order/`)
PNG diagrams illustrating motor numbering and rotation direction for all 30+ supported airframe mixer profiles.

### 3.3. OSD Character Maps (`resources/osd/`)
Binary `.mcm` character map fonts uploaded to onboard MAX7456 OSD chips:
- `default.mcm`, `bold.mcm`, `extra_bold.mcm`, `clarity.mcm`, `digital.mcm`, `vision.mcm`.

---

## 4. Internationalization & Localization (`locales/`)

Configurator supports **19 languages** managed via `i18next` and `@panter/vue-i18next`:

### 4.1. Supported Locales
1. `ca` (Catalan)
2. `da` (Danish)
3. `de` (German)
4. `en` (English — **Canonical Source Dictionary**)
5. `es` (Spanish)
6. `eu` (Basque)
7. `fr` (French)
8. `gl` (Galician)
9. `it` (Italian)
10. `ja` (Japanese)
11. `ko` (Korean)
12. `nl` (Dutch)
13. `pl` (Polish)
14. `pt` (Portuguese)
15. `pt_BR` (Brazilian Portuguese)
16. `ru` (Russian)
17. `uk` (Ukrainian)
18. `zh_CN` (Simplified Chinese)
19. `zh_TW` (Traditional Chinese)

### 4.2. DOM Translation Mechanism
- Static HTML elements use the `i18n` attribute: `<span i18n="tabSetup">Setup</span>`.
- Tooltips use `i18n_title`: `<select i18n_title="virtualMSPVersion">`.
- Dynamic JavaScript code calls `i18n.getMessage(key, [replacements])`.
- Vue components use `$t('key')` via `vueI18n.js`.
- Automatic fallback: If a key is missing in a localized dictionary, `i18next` falls back to `en` (English).
