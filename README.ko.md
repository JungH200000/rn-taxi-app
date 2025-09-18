# 승객/기사 호출 MVP : React Native + Node.js

이 저장소는 승객용 앱, 기사용 앱, 그리고 간단한 택시 호출 흐름을 검증하기 위한 Node.js 백엔드로 구성되어 있습니다. 알림은 Firebase Cloud Messaging(FCM)을 통해 실시간으로 전달됩니다.

> 자세한 제품 요구 사항 문서는 [`docs/PRD.md`](./docs/PRD.md)에 정리되어 있습니다.

## 저장소 구조

- `taxiApp/` : 승객용 React Native 앱 (v0는 Android 중심)
- `driverApp/` : 기사용 React Native 앱. 전용 API 래퍼와 UI 조정 포함
- `server/` : Express 백엔드, MariaDB 연동, Firebase Admin 기반 푸시 유틸리티
- `docs/` : 제품 문서와 일일 작업 로그

## 사전 준비 사항

- Node.js ≥ 20
- npm ≥ 10
- Android Studio (에뮬레이터 또는 USB 디버깅 가능 기기)와 JDK
- 백엔드에서 접근 가능한 MariaDB(혹은 호환 DB)
- Cloud Messaging이 활성화된 Firebase 프로젝트

## 초기 설정

1. **클론 및 공통 설치**

   ```bash
   git clone <repo>
   cd rn-taxi-app
   ```

2. **백엔드 (`server/`)**

   ```bash
   cd server
   npm install
   cp .env-example.md .env            # DB_PASSWORD 입력
   npm start
   ```

   - `docs/daily-dev-logs/log01.md`에 있는 스키마를 MariaDB에 적용하세요.
   - Firebase Admin 서비스 계정 JSON을 `server/`에 배치하고 Git에는 포함하지 않습니다.

3. **승객 앱 (`taxiApp/`)**

   ```bash
   cd ../taxiApp
   npm install
   cp .env-example.md .env            # MAPS_API_KEY 입력
   npm start                           # Metro 번들러
   npm run android                     # 에뮬레이터/기기 실행
   ```

   - Firebase 콘솔에서 발급한 `android/app/google-services.json`을 추가하고, `./gradlew signingReport`로 얻은 SHA1을 콘솔에 등록합니다.

4. **기사 앱 (`driverApp/`)**
   ```bash
   cd ../driverApp
   npm install
   cp .env-example.md .env            # MAPS_API_KEY 입력 (또는 공유 값 사용)
   npm start
   npm run android
   ```
   - 기사 앱용 `google-services.json`을 별도로 배치하고, 해당 패키지의 디버그 SHA1을 Firebase에 등록합니다.

## Firebase & Push 점검 목록

- 두 앱 모두 `@react-native-firebase/app`, `@react-native-firebase/messaging`에 의존합니다.
- 에뮬레이터/기기에서 알림 권한 요청을 허용해야 합니다.
- 획득한 FCM 토큰은 `AsyncStorage`의 `fcmToken`에 저장되고 로그인/회원가입 시 서버로 전송됩니다.
- 백엔드는 Firebase Admin SDK로 호출 생성 시 기사에게, 배차 완료 시 승객에게 알림을 발송합니다.

## 백엔드 REST API 요약

| Endpoint                | 용도                                        |
| ----------------------- | ------------------------------------------- |
| `POST /taxi/register`   | 승객 회원가입 및 FCM 토큰 저장              |
| `POST /taxi/login`      | 승객 로그인 및 FCM 토큰 갱신                |
| `POST /taxi/list`       | 승객 호출 이력 조회 (`formatted_time` 포함) |
| `POST /taxi/call`       | 새 호출 등록 후 기사 전원에게 푸시          |
| `POST /driver/register` | 기사 회원가입 및 FCM 토큰 저장              |
| `POST /driver/login`    | 기사 로그인 및 FCM 토큰 갱신                |
| `POST /driver/list`     | 기사 목록(REQ + 배정된 콜) 조회             |
| `POST /driver/accept`   | 호출 수락 및 해당 승객에게 알림             |

모든 응답은 `[{ code, message, data }]` 형식을 따릅니다.

## 자주 쓰는 스크립트

- `npm start` : 두 앱에서 Metro 번들러 실행
- `npm run android` : 디버그 빌드 설치
- `npm run lint` : ESLint 검사
- `npm test` : Jest(현재는 기본값)
- `npm run android -- --variant=release` : 릴리스 APK 빌드(서명 설정 필요)

## 유의 사항

- `patch-package`가 `postinstall` 스크립트를 통해 자동 실행되므로 Google Places 라이브러리 패치가 유지됩니다.
- Firebase보다 먼저 `react-native-get-random-values`를 임포트해야 Google Places 의존성이 충족됩니다.
- 백엔드는 기본적으로 `localhost`의 MariaDB를 기대합니다(`server/database/db_connect.js`에서 수정 가능).
- 실기기 테스트 시 `taxiApp/src/API.tsx`, `driverApp/src/API.tsx`의 `baseURL`을 개발 PC의 LAN IP로 변경하세요.

## 추가 문서

- 일일 작업 로그: [`docs/daily-dev-logs/`](./docs/daily-dev-logs/)
- 스키마 및 SQL 메모: [`docs/daily-dev-logs/log01.md`](./docs/daily-dev-logs/log01.md)
- 제품 요구 사항: [`docs/PRD.md`](./docs/PRD.md)
