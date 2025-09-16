# PRD: 택시 호출 앱 (Taxi App)

본 문서는 현재 구현 중인 v0(MVP) 범위를 정의합니다. 스프린트마다 지속적으로 업데이트됩니다.

## 1. 개요 (Overview)

- 목적: 사용자가 출발지/도착지를 지정해 택시 호출을 요청하고, 기사에게는 배차 알림이 전달되는 모바일 MVP를 React Native + Node.js로 구현한다.
- 현재 범위: 로그인/회원가입 UI, 메인 지도/목록/설정 화면, 호출 목록 표시, 기초 배차 요청, 푸시 알림 연계.
- 제외 범위(v0): 실 이동 경로 추적, 권한 처리 고도화, 기사 앱 별도 분리, 결제/요금 산정, 정식 배차 로직.

## 2. 타깃 사용자 & 가치 (Users & Value)

- 승객: 간단한 정보 입력만으로 택시 호출 요청을 빠르게 경험할 수 있다.
- 기사: 호출 목록을 공유로 받아보고 배차 수락 시 사용자에게 즉시 알릴 수 있다.

## 3. 목표 & 지표 (Goals & Metrics)

- 목표
  - v0 UI 플로우 완성: Intro → 로그인/회원가입 → 메인(지도, 목록, 설정 탭)
  - 기본 서버 API(`/taxi/*`, `/driver/*`)로 회원 관리·콜 생성·목록 조회·배차 수락 처리
  - Firebase Cloud Messaging을 이용해 호출/배차 알림 전송 경로 확보
- 지표(정성)
  - 로그인/목록/배차 요청이 로컬 테스트 환경에서 성공적으로 수행될 것
  - 에러 상황(Alert, 코드) 대응 흐름 확인

## 4. 핵심 기능 (Scope v0)

1. 사용자 인증

   - Intro에서 `AsyncStorage.userId` 존재 여부로 메인/로그인 분기
   - 로그인: ID/PW 입력 → 서버 `/taxi/login` 검증 → 성공 시 `AsyncStorage` 저장
   - 회원가입: ID/PW 검증 → `/taxi/register` 호출 → 중복 ID Alert 처리

2. 호출 생성 & 조회

   - 지도 화면: Google Maps 표시, 롱프레스 UI로 출발/도착지 선택(후속 구현 예정)
   - 호출 버튼: v0에서는 UI만 제공, 서버 연동은 후속 단계에서 확장
   - 목록 화면: `/taxi/list` 호출 결과를 FlatList로 표시, 풀투리프레시 및 로딩 모달 제공

3. 기사 플로우(서버)

   - `/driver/login`으로 기사 계정 검증, `/driver/list`로 전체 호출/배차 상태 조회
   - `/driver/accept` 실행 시 `tb_call` 갱신 및 사용자에게 배차 완료 푸시 발송

4. 푸시 알림
   - Firebase Admin SDK 초기화 후 서비스 계정 키 사용
   - 신규 호출 시 기사 전체에게 알림, 배차 수락 시 해당 사용자에게 알림

## 5. 사용자 플로우 (User Flows)

1. 앱 시작 → Intro: 저장된 `userId` 존재 시 Main, 없으면 Login
2. 로그인 성공 → Main 탭 진입 → 지도/목록/설정 탭 이동
3. 회원가입 성공 → Login 화면으로 복귀
4. 목록 탭 진입 시 자동으로 `/taxi/list` 요청, 풀투리프레시로 재조회
5. 기사 앱(v0에서는 동일 서버 API 사용) 호출 수락 → 사용자에게 FCM 알림

## 6. 네비게이션 구조 (Navigation)

- Stack: Intro → Login → Register → Main (Intro에서 조건부로 Main 바로 이동)
- BottomTab(Main): Map(Main_Map), List(Main_List), Setting(Main_Setting)
- 주요 화면 파일
  - `taxiApp/src/TaxiApp.tsx`: Stack 네비게이션 정의
  - `taxiApp/src/Main.tsx`: BottomTab 정의
  - `taxiApp/src/Main_Map.tsx`: 지도 UI, 롱프레스 대응 준비
  - `taxiApp/src/Main_List.tsx`: 호출 목록, 새로고침/로딩 UI
  - `taxiApp/src/Login.tsx`, `Register.tsx`: 인증 화면 + 서버 연동

## 7. 데이터 모델

- 로컬(AsyncStorage)
  - `userId: string` ? 로그인 세션 유지
  - `nickName: string` ? 설정 화면에서 사용(추후 서버 연동 예정)
- 서버(DB: MariaDB, `taxi` 스키마)
  - `tb_user(user_id, user_pw, fcm_token)` ? 승객 계정/토큰
  - `tb_driver(driver_id, driver_pw, fcm_token)` ? 기사 계정/토큰
  - `tb_call(id, user_id, start_lat, start_lng, start_addr, end_lat, end_lng, end_addr, call_state, driver_id)` ? 콜 정보 및 상태
- 환경 변수
  - `.env`: `DB_PASSWORD` (MySQL 계정 비밀번호)
  - Firebase 서비스 계정 JSON은 로컬/배포 인프라에서만 보관

## 8. 기술 스택 (Tech Stack)

- 모바일: React Native, React Navigation, AsyncStorage, react-native-maps, react-native-vector-icons, react-native-responsive-screen
- 네트워크: Axios(`taxiApp/src/API.tsx`)
- 서버: Node.js, Express(Express Generator 기반), mysql 드라이버, dotenv
- 인프라: Firebase Admin SDK(FCM), MariaDB(관리 도구: HeidiSQL)
- Android:
  - Google Maps Secrets Gradle Plugin(2.0.1) + `local.defaults.properties`로 API Key 관리
  - `react-native-vector-icons` 빌드 스크립트 적용

## 9. 요구사항 세부 (Requirements)

- 기능 요구사항
  - Intro 로그인 분기, 로그인/회원가입 API 연동, 목록 새로고침 및 로딩 상태 처리
  - 서버 API는 JSON 배열 `{ code, message, data }` 형식 통일
  - 배차 요청/수락 시 FCM 토큰 갱신 및 푸시 발송
  - Google Maps API 키는 Secrets Plugin + `local.properties`로 관리
- 비기능 요구사항
  - 모든 API 오류는 Alert로 사용자에게 안내
  - 개발 환경별 `baseURL`/API Key는 환경 파일로 분리 관리
  - 서비스 계정 키 등 민감 정보는 Git에 포함하지 않음

## 10. 리스크 & 가정 (Risks & Assumptions)

- 리스크
  - 로컬 네트워크(IP 변경)에 따른 Axios `baseURL` 오류 가능
  - FCM 토큰 관리 누락 시 푸시 실패 가능성
  - 지도 SDK 권한 처리 미구현으로 실제 기기 테스트 시 제한 발생
- 가정
  - v0는 로컬 네트워크 내 단일 서버/DB를 사용
  - 승객/기사 계정은 동일 앱에서 관리하되 향후 앱 분리 가능

## 11. 오픈 이슈 (Open Questions)

- 실제 위치 추적/경로 안내를 어떤 SDK로 구현할지(Google vs Naver/Kakao)
- 로그인 토큰을 JWT 등으로 교체할지, 단순 세션 유지로 갈지 결정 필요
- 배차 로직(선착순/자동 배차) 구체화 및 상태 정의
- Axios `baseURL` 다중 환경 구성 방식(환경 파일 vs 런타임 설정)

## 12. 부록 (Appendix)

- 프로젝트 구조
  - 모바일: `taxiApp/`
  - 서버: `server/`
- 실행
  - 모바일: `cd taxiApp && npm start`, Android는 `npm run android`
  - 서버: `cd server && npm install && npm start`
- 참고 문서
  - DB 스키마: `docs/daily-dev-logs/log01.md`
  - 일일 로그: `docs/daily-dev-logs/`
