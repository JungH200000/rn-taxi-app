# Ride Hailing MVP : React Native + Node.js

This repository contains a passenger app, a driver app, and a Node.js backend used to prototype a simple taxi dispatch flow. Push notifications are delivered through Firebase Cloud Messaging (FCM).

> Detailed product requirements are documented in [`docs/PRD.md`](./docs/PRD.md).

## Repository Layout

- `taxiApp/` : Passenger React Native app (Android focus for v0).
- `driverApp/` : Driver React Native app with dedicated API wrapper and UI tweaks.
- `server/` : Express backend, MariaDB integration, Firebase Admin push helpers.
- `docs/` : Product documentation and daily development logs.

## Prerequisites

- Node.js ≥ 20
- npm ≥ 10
- Android Studio (emulator or USB debugging) and Java JDK
- MariaDB (or MySQL-compatible) instance reachable from the backend
- Firebase project with Cloud Messaging enabled

## Initial Setup

1. **Clone & install shared dependencies**

   ```bash
   git clone <repo>
   cd rn-taxi-app
   ```

2. **Backend (`server/`)**

   ```bash
   cd server
   npm install
   cp .env-example.md .env            # add DB_PASSWORD
   npm start
   ```

   - Import the schema from `docs/daily-dev-logs/log01.md`.
   - Place your Firebase Admin service account JSON in `server/` (ignore tracked files).

3. **Passenger app (`taxiApp/`)**

   ```bash
   cd ../taxiApp
   npm install
   cp .env-example.md .env            # add MAPS_API_KEY
   npm start                           # Metro
   npm run android                     # launch on emulator/device
   ```

   - Add `android/app/google-services.json` (Firebase console → Android app, SHA1 from `./gradlew signingReport`).

4. **Driver app (`driverApp/`)**
   ```bash
   cd ../driverApp
   npm install
   cp .env-example.md .env            # add MAPS_API_KEY (or reuse)
   npm start
   npm run android
   ```
   - Provide a dedicated `google-services.json` and register the debug SHA1 for the driver package.

## Firebase & Push Checklist

- Both apps rely on `@react-native-firebase/app` and `@react-native-firebase/messaging`.
- Ensure notification permission prompts succeed on the emulator/device.
- FCM tokens are stored in `AsyncStorage` (`fcmToken`) and sent to the backend during login/register.
- The backend uses Firebase Admin SDK to broadcast when a passenger creates a call and when a driver accepts.

## Working with the Backend

| Endpoint                | Purpose                                               |
| ----------------------- | ----------------------------------------------------- |
| `POST /taxi/register`   | Create passenger account, persist FCM token           |
| `POST /taxi/login`      | Validate passenger credentials, update FCM token      |
| `POST /taxi/list`       | Retrieve passenger call history with `formatted_time` |
| `POST /taxi/call`       | Insert new call, push to all drivers                  |
| `POST /driver/register` | Create driver account, persist FCM token              |
| `POST /driver/login`    | Validate driver credentials, update FCM token         |
| `POST /driver/list`     | Return all REQ or assigned calls                      |
| `POST /driver/accept`   | Assign driver to call, notify passenger               |

All responses follow the pattern `[{ code, message, data }]`.

## Handy Scripts

- `npm start` : Metro bundler (both apps)
- `npm run android` : Build & install debug variant
- `npm run lint` : ESLint
- `npm test` : Jest (placeholder)
- `npm run android -- --variant=release` : Build release APK (requires signing setup)

## Notes & Gotchas

- `patch-package` runs automatically (`postinstall`) to keep the Google Places autocomplete fixes applied.
- `react-native-get-random-values` must be imported before Firebase to satisfy the Places dependency.
- The backend expects MariaDB on `localhost` (adjust in `server/database/db_connect.js`).
- For local device testing, update `baseURL` in `taxiApp/src/API.tsx` and `driverApp/src/API.tsx` to match your machine’s LAN IP.

## Additional Documentation

- Daily work logs: [`docs/daily-dev-logs/`](./docs/daily-dev-logs/)
- Schema notes & SQL snippets: [`docs/daily-dev-logs/log01.md`](./docs/daily-dev-logs/log01.md)
- Product requirements: [`docs/PRD.md`](./docs/PRD.md)
