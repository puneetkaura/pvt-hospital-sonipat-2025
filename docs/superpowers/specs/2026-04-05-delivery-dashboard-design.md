# Sonipat Private Hospital Delivery Dashboard

## Overview
A Progressive Web App (PWA) for senior administrators and doctors to visualize institutional deliveries across private hospitals in Sonipat district. Clean, minimal aesthetic suitable for executive-level users.

## Data Source
- `delivery.csv` — ~85 private hospitals across 6 health blocks
- Columns: Health Block Name, Format Type (PHC/DH/SDH), Facility Name, Ownership, Deliveries count
- Health blocks: Gohana, Kharkhoda, Sonipat Urban, Gannaur, Badkhalsa, Halalpur

## Tech Stack
- **Vite + React + TypeScript** — fast dev, modern tooling
- **Tailwind CSS** — clean utility-first styling
- **Recharts** — lightweight charting library
- **vite-plugin-pwa** — PWA support (service worker, manifest, offline)
- CSV parsed at build time via a small utility (no backend needed)

## Features

### 1. Filter Controls (top bar)
- **Health Block multi-select**: Chip/pill-style selector. All selected by default. Click to toggle individual blocks on/off.
- **Top N dropdown**: Options — Top 10, Top 20, Top 30. Default: Top 20.

### 2. Primary View — Horizontal Bar Chart
- Hospitals on Y-axis, delivery count on X-axis
- Sorted descending by delivery count
- Bars colored by health block (consistent color palette)
- Hover tooltip showing: Hospital name, Health Block, Format Type, Delivery count
- Clean grid lines, large readable labels

### 3. Visual Design
- White background, subtle gray borders
- System font stack (Inter/system-ui)
- Muted, professional color palette (blues, teals, slate)
- Responsive: works on desktop and tablet
- No decorative elements — data-first design

### 4. PWA
- Installable on mobile/desktop
- Offline-capable (all data is bundled)
- App icon and splash screen with project branding

## Non-Goals
- No summary cards, averages, or aggregate statistics
- No authentication
- No backend/API
- No data editing
- No export functionality (v1)
