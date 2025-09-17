# PRD: 택시 호출 앱 (Taxi App)

본 문서는 현재 구현 중인 v0(MVP) 범위를 정의합니다. 스프린트마다 지속적으로 업데이트됩니다.

## 1. 개요 (Overview)

- 목적: 사용자가 출발지/도착지를 지정해 택시 호출을 요청하고, 기사에게는 배차 알림이 전달되는 모바일 MVP를 React Native + Node.js로 구현한다.
- 현재 범위: 로그인/회원가입 UI, 메인 지도/목록/설정 화면, 호출 생성 및 목록 조회, 기사용 목록·배차, FCM 알림.
- 제외 범위(v0): 실시간 주행 추적, 정교한 권한/오프라인 처리, 기사 앱 분리, 결제/요금 산정, 자동 배차 알고리즘.

## 2. 타깃 사용자 & 가치 (Users & Value)

- 승객: 간단한 정보 입력과 지도 검색으로 택시 호출을 빠르게 요청할 수 있다.
- 기사: 호출 목록을 받아보고 수락 시 사용자에게 즉시 알릴 수 있다.

## 3. 목표 & 지표 (Goals & Metrics)

- 목표
  - v0 UI 플로우 완성: Intro → 로그인/회원가입 → 메인(지도, 목록, 설정 탭)
  - 호출 생성 플로우 완료: 지도 검색 → 서버 `/taxi/call` → 목록/푸시로 확인
  - Firebase Cloud Messaging 연동 유지: 호출/배차 알림 정상 수신
- 지표(정성)
  - 로그인/호출/목록/배차 테스트가 로컬 환경에서 성공적으로 수행될 것
  - 오류(Alert, 로그)로 실패 원인을 확인할 수 있을 것

## 4. 핵심 기능 (Scope v0)

1. 사용자 인증

   - Intro에서 `AsyncStorage.userId` 존재 여부로 메인/로그인 분기
   - 로그인: ID/PW 입력 → `/taxi/login` 검증 → 성공 시 `AsyncStorage` 저장
   - 회원가입: ID/PW 중복 검증 → `/taxi/register` 호출 → 응답 Alert 처리

2. 호출 생성 & 지도 UX

   - 지도 화면: Google Maps 기반, `react-native-google-places-autocomplete`로 주소 검색/자동완성
   - 롱프레스 시 역지오코딩으로 주소 확인 후 출발/도착지에 배치, 두 지점 간 Polyline 표시
   - 현재 위치 버튼: `@react-native-community/geolocation`으로 좌표 취득 후 출발지 자동 입력
   - 호출 버튼: `/taxi/call` API에 좌표·주소 전달 → 성공 시 목록 탭 이동 및 Alert

3. 호출 목록 & 기사 플로우

   - 승객 `/taxi/list`: 호출 이력 + `formatted_time`을 반환, 클라이언트는 목록에서 시각 표시
   - 기사 `/driver/list`: 대기/본인 배차 호출 목록 조회, `/driver/accept`로 배차 처리 후 사용자 푸시 전송

4. 푸시 알림
   - Firebase Admin SDK로 호출 발생 시 기사 전체, 배차 수락 시 해당 승객에게 푸시 발송
   - FCM 토큰은 로그인/회원가입 시 업데이트

## 5. 사용자 플로우 (User Flows)

1. 앱 시작 → Intro: 저장된 `userId` 존재 시 Main, 없으면 Login
2. 지도 탭에서 주소 검색 또는 롱프레스 선택 → 출발/도착지 설정 → 호출 요청 → 성공 Alert 후 목록 탭 이동
3. 목록 탭 진입 시 자동으로 `/taxi/list` 호출, 풀투리프레시로 갱신
4. 기사(추후 별도 앱 분리 가능)는 `/driver/login` → 목록 확인 → 호출 수락 시 승객에게 푸시 전송

## 6. 네비게이션 구조 (Navigation)

- Stack: Intro → Login → Register → Main (Intro에서 조건부로 Main 바로 이동)
- BottomTab(Main): Map(Main_Map), List(Main_List), Setting(Main_Setting)
- 주요 화면 파일
  - `taxiApp/src/TaxiApp.tsx`: Stack 네비게이션 정의
  - `taxiApp/src/Main.tsx`: BottomTab 정의
  - `taxiApp/src/Main_Map.tsx`: 지도/자동완성/현재 위치/호출 로직
  - `taxiApp/src/Main_List.tsx`: 호출 목록, `formatted_time` 표시, 새로고침/로딩 UI
  - `taxiApp/src/Login.tsx`, `Register.tsx`: 인증 화면 + 서버 연동

## 7. 데이터 모델

- 로컬(AsyncStorage)
  - `userId: string` ? 로그인 세션 유지
  - `nickName: string` ? 설정 화면에서 사용(추후 서버 연동 예정)
- 서버(DB: MariaDB, `taxi` 스키마)
  - `tb_user(user_id, user_pw, fcm_token)` ? 승객 계정/토큰
  - `tb_driver(driver_id, driver_pw, fcm_token)` ? 기사 계정/토큰
  - `tb_call(id, user_id, start_lat, start_lng, start_addr, end_lat, end_lng, end_addr, call_state, driver_id, requert_time)` ? 호출 정보, 기사 배정 상태, 요청 시각
    - 서버는 응답 시 `formatted_time`(가공된 표시용 문자열)을 추가해 반환
- 환경 변수
  - `taxiApp/.env`: `MAPS_API_KEY`
  - `taxiApp/.env-example.md`: 공유용 템플릿
  - Firebase 서비스 계정 JSON은 서버 폴더에 별도 보관(버전 관리 제외)

## 8. 기술 스택 (Tech Stack)

- 모바일
  - React Native, React Navigation, AsyncStorage
  - 지도/검색: `react-native-maps`, `react-native-google-places-autocomplete`, Google Geocoding API
  - 위치: `@react-native-community/geolocation`
  - 기타: `react-native-get-random-values`(Places 의존성), `react-native-vector-icons`, `react-native-responsive-screen`
- 네트워크: Axios(`taxiApp/src/API.tsx`)
- 서버: Node.js, Express, `mysql`, `dotenv`, Firebase Admin SDK, `patch-package`
- 빌드/환경: `react-native-dotenv`로 `.env` 로딩, Android Google Maps Secrets Gradle Plugin(2.0.1)

## 9. 요구사항 세부 (Requirements)

- 기능 요구사항
  - 주소 검색/롱프레스/현재 위치 중 하나로 출발·도착 지점 설정 가능
  - `/taxi/call` 호출 시 좌표/주소/요청 시각이 모두 저장되고 기사에게 푸시 발송
  - 목록 화면은 `formatted_time`을 함께 노출
  - 기사 수락 시 승객 푸시 알림 발송
- 비기능 요구사항
  - `.env` 키나 Firebase 키는 Git에 포함하지 않음
  - Places 라이브러리 패치(`patch-package`)가 `npm install` 이후 자동 적용되도록 유지
  - 네트워크 오류 발생 시 Alert 또는 로그로 식별 가능해야 함

## 10. 리스크 & 가정 (Risks & Assumptions)

- 리스크
  - DB 스키마(`tb_call.requert_time`)와 서버 쿼리 컬럼명이 불일치할 경우 발생할 수 있는 오류
  - Axios `baseURL`이 개발자 PC IPv4에 고정되어 있어 환경별 설정 누락 시 통신 실패 가능
  - 위치 권한 미부여 시 현재 위치 버튼이 실패할 수 있음
- 가정
  - v0는 로컬 네트워크 내 단일 서버/DB를 사용
  - 승객/기사 계정은 동일 앱에서 관리하되 향후 앱 분리 가능

## 11. 오픈 이슈 (Open Questions)

- Axios `baseURL`을 환경별로 분리할 방법(.env, 런타임 설정 등)을 어떻게 정리할지
- 지도 SDK(네이버/카카오) 대체 가능성 및 비교 평가 필요 여부
- 로그인 세션을 JWT로 확장할지 단기적으로 AsyncStorage 유지할지 결정
- Places 라이브러리 패치 유지 전략(버전 업 시 재생성 방법) 문서화 필요

## 12. 부록 (Appendix)

- 프로젝트 구조
  - 모바일: `taxiApp/`
  - 서버: `server/`
- 실행
  - 모바일: `cd taxiApp && npm install && npm start`, Android는 `npm run android`
  - 서버: `cd server && npm install && npm start`
- 참고 문서
  - DB 스키마: `docs/daily-dev-logs/log01.md`
  - 일일 로그: `docs/daily-dev-logs/`
