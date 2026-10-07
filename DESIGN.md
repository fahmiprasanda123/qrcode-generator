# HonestQR Design Direction

## Identity & Philosophy
HonestQR is an open, private, in-browser utility built to eradicate predatory 14-day QR code expiry scams and monthly subscriptions.
- **Character**: Engineered, trustworthy, utilitarian, crisp.
- **Inspiration**: Precision Technical Instruments, Swiss Editorial Typography.
- **Anti-Pattern Rule**: No generic AI slop: no floating purple-blue glows, no meaningless pulsing status dots, no emoji decoration in functional UI, no excessive pill-shaped capsules, no em dashes (`—`).

---

## Dials (Antislop System)
- **ENERGY**: 2 (Focused, confident, restrained, professional)
- **RHYTHM**: 2 (Structured grid, clear contrast between input controls and live inspection)
- **MOTION**: 1 (Immediate 150ms state feedback, zero perpetual loops or distracting float animations)

---

## Color Tokens & Design System

### Light Mode (Default)
- **Background Base**: `#f9fafb` (Soft graphite paper)
- **Card / Surface**: `#ffffff` (Clean white)
- **Surface Secondary**: `#f3f4f6` (Subtle container fill)
- **Borders**: `#e5e7eb` (Subtle boundary), `#d1d5db` (Interactive border)
- **Typography**:
  - Primary: `#111827` (Deep graphite)
  - Secondary: `#4b5563` (Neutral slate)
  - Muted: `#6b7280` (Technical labels)
- **Status / Verification**:
  - Verified Green: `#15803d` (Deep forest emerald)
  - Verified Background: `#f0fdf4`
  - Verified Border: `#bbf7d0`
- **Actions**:
  - Primary Button: `#111827` with `#ffffff` text
  - Secondary Button: `#ffffff` with `#111827` text, `#d1d5db` border

### Dark Mode
- **Background Base**: `#090a0f` (Deep obsidian)
- **Card / Surface**: `#12141a` (Dark graphite)
- **Surface Secondary**: `#1a1d26` (Muted panel fill)
- **Borders**: `#242834` (Hairline boundary), `#374151` (Interactive border)
- **Typography**:
  - Primary: `#f9fafb` (Crisp off-white)
  - Secondary: `#9ca3af` (Readable mid-tone)
  - Muted: `#6b7280` (Muted technical caption)
- **Status / Verification**:
  - Verified Green: `#22c55e` (Vibrant leaf green)
  - Verified Background: `#052e16`
  - Verified Border: `#166534`
- **Actions**:
  - Primary Button: `#f9fafb` with `#111827` text
  - Secondary Button: `#12141a` with `#f9fafb` text, `#242834` border

### Coffee / Support Accent
- Light: Text `#92400e`, Background `#fef3c7`, Border `#fde68a`
- Dark: Text `#fbbf24`, Background `#261a06`, Border `#452c08`

---

## Typography
- **Primary Body & Headings**: `Plus Jakarta Sans`, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif.
  - Headings: Tight negative tracking (`-0.03em`), bold weights (700, 800), natural human copy.
- **Monospace**: `JetBrains Mono`, monospace.
  - Restricted strictly to: Raw payload inspector, hex color inputs, technical indicators.

---

## Iconography & Assets
- **Standard**: Clean, inline monochrome SVG vectors (1.75px–2px stroke).
- **Rule**: Zero emoji used as visual icons in UI tabs, buttons, or headers.

---

## Spacing & Shape
- **Radius Scale**:
  - Small: `6px` (Buttons, inputs, chips)
  - Medium: `10px` (Cards, preview wrappers)
  - Large: `14px` (Main workspace shells)
- **Shadows**:
  - Flat/Resting: Subtle 1px boundary with minimal 1px-2px soft drop.
  - Lifted: Clean 4px elevation for floating elements (toast notifications).
