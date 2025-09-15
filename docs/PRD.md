# PRD: 택시 호출 앱 (Taxi App)

본 문서는 현재 구현된 v0(프로토타입) 기준의 제품 요구사항 문서입니다. 이후 스프린트마다 문서를 계속 업데이트합니다.

## 1. 개요 (Overview)
- 목적: 승객이 출발지/도착지를 설정해 택시를 호출하는 앱의 MVP를 React Native로 구현한다.
- 현재 범위: 로그인/회원가입 UI, 자동 로그인, 지도 화면 UI(마커 추가 토글), 호출 목록 더미 데이터, 설정(닉네임 관리, 로그아웃).
- 비범위(Out of scope, v0): 실제 지도 SDK 연동, 위치 권한 처리, 서버 인증/배차/푸시, 운전기사(드라이버) 앱, 결제.

## 2. 사용자와 가치 (Users & Value)
- 대상 사용자: 택시를 호출하려는 일반 승객.
- 사용자 가치: 간단한 온보딩과 호출 플로우를 빠르게 체험할 수 있는 프로토타입 제공(실제 배차는 미포함).

## 3. 목표 및 지표 (Goals & Metrics)
- 목표
  - v0 UI 플로우 완성: 인트로→로그인/회원가입→메인(지도/목록/설정).
  - 기기 재실행 시 자동 로그인 상태 유지(로컬 저장).
  - 호출 목록/로딩/당겨서새로고침 UX 제공(더미 데이터).
- 지표(정성)
  - 온보딩 무리 없이 전환 가능 여부, 버튼/탭의 명확성, 저장/로그아웃 동작 확인.

## 4. 핵심 기능 (Scope v0)
1) 온보딩/인증
- 인트로 스플래시: 2초 후 자동 로그인 여부 확인(`AsyncStorage.userId`) 후 분기.
- 로그인: ID/PW 입력 시 버튼 활성화, 로그인 시 `userId`를 로컬 저장.
- 회원가입: ID/비밀번호/확인 입력 유효성 검증만 제공(서버 전송 없음).

2) 메인 탭
- 지도 탭
  - UI: 상단 출발지/도착지 입력, 호출 버튼.
  - 제스처: 지도 영역 길게 누르면 “출발지로 등록/도착지로 등록” 토글 패널 노출(상태 토글만, 실제 마커/좌표 저장 없음).
- 목록 탭
  - 더미 호출 10건 생성, 리스트 헤더/아이템, 당겨서 새로고침, 로딩 모달.
- 설정 탭
  - 닉네임 관리: `AsyncStorage.nickName` 로드/저장, 저장 성공/실패 안내(Alert).
  - 로그아웃: `AsyncStorage.userId` 제거 후 스택 초기화.

3) 데이터 보관
- 로컬 저장: `AsyncStorage`에 `userId`, `nickName` 사용.
- 서버 연동: 없음(향후 연동 예정). `docs/daily-dev-logs/log01.md`에 DB 스키마 제안 참고.

## 5. 사용자 흐름 (User Flows)
1) 앱 실행: Intro(2초) → 자동 로그인(있음: Main / 없음: Login).
2) 로그인: ID/PW 입력 → Login 버튼 활성화 → 저장 후 Main 이동.
3) 회원가입: ID/PW/비밀번호 확인 입력 → 일치 시 버튼 활성화 → v0에서는 로컬/서버 저장 없음.
4) 지도 호출: 출발/도착지 입력 또는 길게 누르기 → 패널에서 출발/도착 선택 → v0에서는 호출 생성/전송 미구현.
5) 목록 확인: 더미 데이터 표시, 당겨서 새로고침 시 재로딩.
6) 설정 변경: 닉네임 입력→저장(로컬)→토스트/Alert 확인, 로그아웃 시 초기 화면 복귀.

## 6. 네비게이션 구조 (Navigation)
- Stack: Intro → Login → Register → Main, 또는 Intro → Main.
- Tab(Main 내부): 지도(Main_Map), 목록(Main_List), 설정(Main_Setting).
- 화면 레퍼런스
  - `taxiApp/src/TaxiApp.tsx`: Stack 네비게이션 정의
  - `taxiApp/src/Main.tsx`: BottomTab 네비게이션 정의
  - `taxiApp/src/Intro.tsx`: 자동 로그인 체크
  - `taxiApp/src/Login.tsx`: 로그인 저장 후 이동
  - `taxiApp/src/Register.tsx`: 유효성 검사 UI
  - `taxiApp/src/Main_Map.tsx`: 지도 UI/롱프레스 토글
  - `taxiApp/src/Main_List.tsx`: 더미 목록/로딩/새로고침
  - `taxiApp/src/Main_Setting.tsx`: 닉네임/로그아웃 진입
  - `taxiApp/src/Main_Setting_NickName.tsx`: 닉네임 로컬 저장

## 7. 데이터 모델
- 로컬(AsyncStorage)
  - `userId: string` — 로그인 상태 판단에 사용
  - `nickName: string` — 설정의 닉네임
- 서버/DB (설계 반영)
  - DB 사용자: `CREATE USER 'taxi'@'%' IDENTIFIED BY 'taxi';`
  - 권한: `GRANT ALL PRIVILEGES ON taxi.* TO 'taxi'@'%' IDENTIFIED BY 'taxi';`
  - 테이블
    - `tb_user(user_id, user_pw, fcm_token)` — 승객 계정/FCM 토큰
    - `tb_driver(driver_id, driver_pw, fcm_token)` — 기사 계정/FCM 토큰
    - `tb_call(id, user_id, start_lat, start_lng, start_addr, end_lat, end_lng, end_addr, call_state, driver_id)` — 호출 정보 및 배차 상태
  - 참고: 상세 SQL은 `docs/daily-dev-logs/log01.md`에 기록

## 8. 기술 스택 (Tech Stack)
- React Native
  - Navigation: `@react-navigation/native`, `@react-navigation/stack`, `@react-navigation/bottom-tabs`, `react-native-screens`, `react-native-safe-area-context`
  - Gesture/Animation: `react-native-gesture-handler`, `react-native-reanimated`, `react-native-worklets`
  - UI/Assets: `react-native-vector-icons`, `@types/react-native-vector-icons`, `react-native-responsive-screen`
  - Storage: `@react-native-async-storage/async-storage`
- 백엔드(계획): `Node.js`
- 데이터베이스: `MariaDB` (관리 도구: `HeidiSQL`)
- 환경: Android Studio, iOS Simulator

### Android 설정 메모: react-native-vector-icons
1) `taxiApp/android/app/build.gradle` 최하단에 아래 추가
```groovy
apply from: file("../../node_modules/react-native-vector-icons/fonts.gradle")
```
2) 변경사항 반영(Clean)
```powershell
cd taxiApp/android
./gradlew clean
```

## 9. 요구사항 상세 (Requirements)
- 기능 요구사항
  - 자동 로그인 분기(인트로 2초 대기 후 판단)
  - 로그인 입력 검증 및 저장, 회원가입 입력 유효성(UI)
  - 지도 화면 롱프레스 토글 패널 표출 및 버튼 동작(상태 토글)
  - 호출 목록 더미 데이터 로딩, 당겨서 새로고침, 로딩 모달
  - 닉네임 로드/저장, 로그아웃 후 초기 화면 복귀
- 비기능 요구사항
  - 한국어 UI, 기본 반응형 고려(`react-native-responsive-screen` 사용 구간)
  - 오프라인 상태에서도 기본 플로우 동작(로컬 저장 기반)

## 10. 리스크와 가정 (Risks & Assumptions)
- 리스크
  - 지도/위치/권한 미연동 상태에서 UX 괴리
  - 서버 연동 전환 시 API 설계와 상태관리 리팩토링 필요
- 가정
  - v0은 데모/프로토타입 목적, 실 배차/결제는 후속 스프린트에서 구현

## 11. 오픈 이슈 (Open Questions)
- 지도 SDK 선택: Google Maps vs Naver/Kakao 등 지역별 최적화
- 인증 방식: JWT/세션/소셜 로그인 여부
- 호출 매칭: 폴링, 소켓, FCM 기반 푸시 전략
- 서버 스택: Node.js + MariaDB 제안 유지 여부

## 12. 부록 (Appendix)
- 프로젝트 구조
  - 진입점: `taxiApp/index.js`
  - 앱 래퍼(샘플 템플릿): `taxiApp/App.tsx` — 실제 실행은 `TaxiApp` 사용
- 실행
  - `cd taxiApp && npm start`
  - Android: `npm run android`
  - iOS: `bundle install` → `bundle exec pod install` → `npm run ios`
