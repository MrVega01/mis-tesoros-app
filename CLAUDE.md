# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Start development server
npx expo start

# Run on specific platform
npx expo start --ios
npx expo start --android
npx expo start --web

# Lint (ESLint with standard + JSX presets)
npx eslint .
```

There is no test suite configured in this project.

## Environment Setup

Copy `.env.example` to `.env` and set `EXPO_PUBLIC_API_URL` to the backend API base URL. Expo exposes it via `process.env.EXPO_PUBLIC_API_URL` (see `src/utils/constants.js`).

## Architecture

### Navigation

Two-level navigation defined in `App.js`:

- **Root Stack** (`@react-navigation/stack`): `LogIn` → `Home`, plus modal-like stack screens for `Create Product`, `Create Category`, `Create Sale` (all with `headerShown: false`).
- **Bottom Tab** (`src/routes/Home.jsx`): Uses `react-native-paper`'s `BottomNavigation.Bar` as a custom tab bar. Three tabs: `Productos` (Products), `Tasa` (Tax), `Mensajes` (Messages).

### State Management

- **Global state**: React Context + `useReducer` via `src/context/global.js` and `src/hooks/useGlobalReducer.js`. Currently manages tax rate, persisted with `AsyncStorage`.
- **Form state**: `react-hook-form` with Zod schemas (in `src/schemas/`).
- **Server state**: TanStack Query (`@tanstack/react-query`) for all server state — data fetching, caching, mutations, and background sync. Use `useQuery` for reads and `useMutation` for writes. Query functions use the native `fetch` API (no Axios). Custom hooks in `src/hooks/` wrap `useQuery`/`useMutation` and are the only place query keys and fetch logic are defined.

### Styling

- Centralized design tokens in `src/theme.js` (colors, font sizes, font weights).
- Styles via `StyleSheet.create` throughout.
- Custom "styled" base components in `src/components/` (`StyledText`, `StyledTextInput`, `StyledTextInputWithLabel`, `StyledTouchableHighlight`, `StyledTouchableLink`) that accept a `style` prop for overrides and apply theme defaults.
- Dark color scheme: primary background `#1f1f2e`, accent `#dd851f`.

### Internationalization

`i18next` + `react-i18next`, initialized in `src/hooks/useI18n.js` (called once in `App.js`). Locale files: `src/locales/es.json` (default) and `src/locales/en.json`. Use the `useTranslation` hook in components.

### Icons

Custom SVG icon components in `src/img/` built with `react-native-svg`. Each exports a component accepting a `color` prop.

### Code Conventions

- JavaScript (no TypeScript).
- Functional components only.
- Views are organized by domain under `src/views/`: `auth/`, `company/`, `core/`, `client/`.
- Components are in `src/components/` and are domain-agnostic reusable primitives.
- ESLint standard style (no semicolons, 2-space indent).
- For every code creation related with UI, it should be done by visualist agent. However, the architect should plan the integration of the requirement first, so the visualist can work over it.