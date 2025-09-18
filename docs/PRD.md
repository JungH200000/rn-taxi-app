# 제품 요구 사항 문서

## 1. 개요

- **목적**: 승객이 택시 호출을 생성하고 기사가 이를 확인·수락하는 최소 기능 제품을 구현한다. 양측은 Firebase Cloud Messaging(FCM) 푸시로 실시간 상태를 공유한다.
- **구성 요소**
  - `taxiApp/`: 승객용 React Native 앱 (v0는 Android 중심)
  - `driverApp/`: 기사용 React Native 앱
  - `server/`: Node.js + Express 백엔드 (MariaDB, Firebase Admin SDK 연동)
- **v0 제외 범위**: 결제/요금 계산, 실시간 주행 추적, 고급 권한/오프라인 처리, 배포 자동화, 다국어, 정교한 리포팅 및 모니터링

## 2. 사용자 및 가치

- **승객**: 빠르게 호출을 요청하고 배차 결과를 즉시 확인하고 싶다.
- **기사**: 대기 중인 호출을 파악하고 간단히 수락한 뒤 배차 완료 알림을 전달하고 싶다.

## 3. 목표와 성공 기준

- 로컬 환경에서 전체 흐름(승객 요청 → 기사 REQ 확인 → 기사 수락 → 푸시 알림 → 승객 목록 RES 반영)이 정상 동작.
- 양측 로그인/회원가입이 FCM 토큰을 저장하고 오류 메시지를 적절히 표시.
- 모든 API 응답이 `{ code, message, data }` 포맷을 따르고 사람이 읽을 수 있는 `formatted_time`을 제공.

## 4. 기능 범위 (v0)

### 4.1 승객 앱 (`taxiApp`)

- `AsyncStorage`에 `userId`, `fcmToken`, `nickName` 저장.
- 로그인/회원가입은 `/taxi/login`, `/taxi/register` 호출 시 FCM 토큰을 함께 전송.
- 메인 지도 화면
  - `react-native-google-places-autocomplete`로 출발/도착지 검색 자동완성 제공.
  - 지도 롱프레스로 Google Geocoding API 역지오코딩.
  - `@react-native-community/geolocation`으로 현재 위치를 출발지로 설정.
  - 선택한 두 지점에 마커와 Polyline 표시.
  - `/taxi/call`로 좌표·주소를 전송하여 호출 생성.
- 메인 목록 화면
  - `/taxi/list` 결과를 표시하고 `formatted_time`을 노출.
  - `call_state`가 `RES`이면 파란색으로 강조.
  - `messaging().onMessage` 수신 시 자동 새로고침.

### 4.2 기사 앱 (`driverApp`)

- 승객 앱과 동일한 방식으로 인증/토큰 저장.
- 메인 목록 화면
  - `/driver/list`를 호출해 모든 호출을 가져오고, 필터(전체/`REQ`/`RES`) 제공.
  - `REQ` 상태의 항목에만 “Accept” 버튼 노출, `/driver/accept` 호출.
  - 수동 새로고침 및 FCM 수신 시 자동 새로고침.

### 4.3 서버 (`server/routes/index.js`)

- `/taxi/register|login` → `tb_user` FCM 토큰 관리.
- `/taxi/list` → 최신 순 조회, `formatted_time` 값 생성 (`requert_time` 컬럼 사용).
- `/taxi/call` → 호출 저장 후 `sendPushToAlldriver()`로 기사 전체에 알림 발송.
- `/driver/register|login|list|accept` → `tb_driver` 및 기사 흐름 처리. 수락 시 `sendPushToUser(userId)` 호출.
- 공통 유틸: `updateFCM`, `sendPushToAlldriver`, `sendPushToUser`, `sendFcm`.

## 5. 사용자 흐름

1. **승객**
   1. 앱 실행 → Intro에서 `AsyncStorage.userId` 확인.
   2. 로그인/회원가입 → FCM 토큰 저장 후 메인 탭 진입.
   3. 지도에서 주소 검색/롱프레스/현재 위치로 출발·도착지 설정.
   4. 호출 생성 → 성공 Alert → 목록 화면 이동.
   5. 기사 수락 시 FCM을 받아 목록이 즉시 갱신.
2. **기사**
   1. 앱 실행 → Intro → 로그인/회원가입.
   2. 호출 목록 확인, 필요 시 `REQ` 필터 적용.
   3. 호출 수락 → 상태가 `RES`로 변경, 승객에게 푸시 전달.

## 6. 데이터 모델

- **AsyncStorage (앱별)**
  - `userId` (문자열)
  - `fcmToken` (문자열)
  - `nickName` (문자열, 향후 서버 동기화 예정)
- **MariaDB `taxi` 스키마**
  - `tb_user(user_id, user_pw, fcm_token)`
  - `tb_driver(driver_id, driver_pw, fcm_token)`
  - `tb_call(id, user_id, start_lat, start_lng, start_addr, end_lat, end_lng, end_addr, call_state, driver_id, requert_time)`
    - `requert_time`은 추후 `request_time`으로 정정 필요.
  - API는 각 행에 `formatted_time`을 추가해 UI에 전달.
- **환경/보안 파일**
  - `taxiApp/.env`, `driverApp/.env`: Google Maps API 키 (`react-native-dotenv`로 로드).
  - 각 앱의 `google-services.json`: Firebase 설정 (Git 미포함).
  - `server/`의 Firebase Admin 서비스 계정 JSON (Git 미포함).

## 7. 기술 스택

- 모바일: React Native 0.81, React Navigation, `react-native-maps`, `react-native-google-places-autocomplete`, `@react-native-community/geolocation`.
- FCM: `@react-native-firebase/app`, `@react-native-firebase/messaging`, `react-native-get-random-values`, `patch-package`.
- 백엔드: Node.js, Express, `mysql`, `dotenv`, Firebase Admin SDK, MariaDB.

## 8. 비기능 요구 사항

- 모든 API는 동일한 JSON 구조를 유지.
- `patch-package`가 `postinstall`에서 자동 실행되도록 관리.
- 민감 정보는 Git에 커밋하지 않고 템플릿(.env-example 등)만 제공.
- 오류가 발생하면 Alert 및 콘솔 로그로 원인 파악이 가능해야 함.

## 9. 부록

- **Repo 구조**: `taxiApp/`, `driverApp/`, `server/`, `docs/`, `images/`
- **주요 명령어**
  - 승객 앱: `cd taxiApp && npm install, `npm run android`
  - 기사 앱: `cd driverApp && npm install, `npm run android`
  - 서버: `cd server && npm install && npm start`
- **참고 문서**
  - 일일 로그: `docs/daily-dev-logs/`
