# React Native 개발 환경 설정 완벽 가이드 (React Native CLI)

React Native(RN)는 JavaScript와 React만으로 Android와 iOS 앱을 모두 만들 수 있게 해주는 강력한 프레임워크입니다. RN 앱 개발을 시작하는 방법은 크게 두 가지가 있는데, 바로 **Expo**를 사용하는 것과 **React Native CLI**를 직접 설정하는 것입니다.

이 가이드에서는 React Native CLI를 사용해 개발 환경을 직접 구축하는 방법을 단계별로 알아보겠습니다.

## 시작하기 전: Expo와 React Native CLI, 무엇이 다른가요?

React Native 프로젝트를 시작하는 두 가지 주요 경로를 이해하는 것은 매우 중요합니다.

- **Expo 🚀**

  - **정의:** Expo는 React Native를 기반으로 개발을 더 쉽고 빠르게 할 수 있도록 도와주는 도구와 서비스의 모음입니다.
  - **설명:** Expo를 사용하는 것은 **'풀옵션 가구가 완비된 집'** 에 입주하는 것과 같습니다. 복잡한 초기 설정 없이 바로 앱 개발을 시작할 수 있고, Expo가 제공하는 다양한 기본 기능(카메라, 지도 등)을 쉽게 가져다 쓸 수 있습니다.

- **React Native CLI (이 가이드의 주제) 🛠️**

  - **정의:** React Native Core 라이브러리를 직접 설치하고 네이티브 개발 환경(Android Studio, Xcode)을 수동으로 구성하는 전통적인 방식입니다.
  - **설명:** CLI 방식은 **'직접 땅을 파고 집을 짓는 것'** 과 같습니다. 초기 설정이 다소 복잡하지만, 앱의 모든 네이티브 기능을 직접 제어할 수 있어 자유도가 매우 높습니다. 네이티브 코드 수정이 필요하거나 Expo에서 지원하지 않는 특정 라이브러리를 사용해야 할 때 필수적입니다.

이 가이드는 'React Native CLI' 방식을 다루며, 내 컴퓨터에 완전한 네이티브 앱 개발 환경을 구축하는 것을 목표로 합니다.

---

## 1단계: Node.js 설치하기

> **Node.js란?**
>
> 원래 웹 브라우저에서만 실행되던 JavaScript를 내 컴퓨터(서버)에서도 실행할 수 있게 해주는 환경입니다. React Native는 프로젝트를 만들고, 패키지를 관리하고, 개발 서버를 실행하는 등 많은 작업을 Node.js 기반으로 수행합니다.

터미널(Windows의 경우 PowerShell 또는 cmd)을 열고 아래 명령어를 입력하여 Node.js와 npm(Node Package Manager)이 잘 설치되었는지 확인합니다. **LTS(Long Term Support)** 버전을 설치하는 것을 권장합니다.

```bash
# Node.js 버전 확인
node -v

# npm 버전 확인
npm -v
```

만약 버전이 표시되지 않는다면, [Node.js 공식 웹사이트](https://nodejs.org/)에서 LTS 버전을 다운로드하여 설치해 주세요.

---

## 2단계: Java Development Kit (JDK) 설치하기

> **JDK(Java Development Kit)란?**
>
> 이름 그대로 Java 애플리케이션을 개발하는 데 필요한 도구 모음입니다. Android 앱은 기본적으로 Java와 Kotlin으로 만들어지기 때문에, React Native로 만든 JavaScript 코드를 실제 Android 앱으로 빌드(변환)하려면 JDK가 반드시 필요합니다.

1.  **JDK 설치:** [AdoptOpenJDK](https://adoptium.net/)나 Oracle JDK 등에서 권장 버전을 설치합니다. (React Native 공식 문서에서 권장하는 버전을 확인하는 것이 가장 좋습니다.)
2.  **환경 변수 설정:** 설치 후 `JAVA_HOME`이라는 환경 변수에 JDK 설치 경로를 지정해야 컴퓨터가 JDK를 찾을 수 있습니다.

> **사용자 환경 변수와 시스템 환경 변수??** 👤
>
> - **시스템 환경 변수**: 컴퓨터의 모든 사용자 계정에 적용됩니다. 관리자 권한이 필요합니다.
> - **사용자 환경 변수**: 현재 로그인한 사용자 계정에만 적용됩니다. 일반 사용자 권한으로 설정할 수 있습니다.
>
>   **어떤 걸로 설정하든 상관 없습니다.**

3.  **설치 확인:** 터미널에 아래 명령어를 입력하여 설치 및 환경 변수 설정이 올바른지 확인합니다.

<!-- end list -->

```bash
# 설치된 Java 버전 확인
java -version

# JAVA_HOME 환경 변수 값 확인 (Windows)
echo %JAVA_HOME%

# Path 환경 변수에 Java 경로가 포함되었는지 확인 (Windows)
echo %path%
```

---

### **3단계: Android Studio 설치 및 설정하기**

> **Android Studio란?** 🧑‍💻
>
> Google이 제공하는 공식 Android 앱 개발 도구(IDE)입니다. React Native CLI 개발에서는 코드를 직접 짜기보다는, 다음과 같은 필수적인 도구를 설치하고 관리하는 목적으로 사용합니다.
>
> - **Android SDK:** 앱을 만드는 데 필요한 소프트웨어 개발 키트
> - **빌드 도구:** 코드를 `.apk`나 `.aab` 파일로 만들어주는 도구
> - **에뮬레이터(AVD):** 실제 기기 없이 앱을 테스트할 수 있는 가상 스마트폰

[Android Studio 공식 웹사이트](https://developer.android.com/studio)에서 설치 파일을 받아 설치를 진행합니다. 설치 후에는 앱을 빌드하고 테스트하는 데 필요한 몇 가지 추가 설정이 필요합니다.

#### **1. Android SDK 설치**

**SDK(Software Development Kit)** 는 특정 플랫폼용 앱을 개발하는 데 필요한 도구 모음입니다. Android Studio의 **SDK Manager**를 통해 원하는 버전의 Android SDK를 설치해야 합니다.

- Android Studio 시작 화면에서 `More Actions` → `SDK Manager`로 이동합니다.
- `SDK Platforms` 탭에서 원하는 Android 버전(API Level)을 선택하고 설치합니다. (일반적으로 최신 버전 또는 프로젝트에서 목표로 하는 버전을 설치합니다.)

#### **2. 가상 디바이스(AVD) 생성**

**AVD(Android Virtual Device)**, 즉 **에뮬레이터**는 실제 스마트폰 없이도 컴퓨터에서 앱을 테스트할 수 있게 해주는 가상 스마트폰입니다.

- Android Studio 시작 화면에서 `More Actions` → `Virtual Device Manager`로 이동합니다.
- `Create device` 버튼을 눌러 원하는 기기 모델(예: Pixel 7)과 Android 버전(앞서 설치한 SDK)을 선택하여 가상 디바이스를 생성합니다.

#### **3. 환경 변수 설정**

마지막으로, 컴퓨터의 어느 위치에서든 Android 개발 도구를 사용할 수 있도록 **환경 변수**를 설정해야 합니다. 이는 React Native CLI가 Android SDK의 위치를 찾기 위해 반드시 필요한 과정입니다.

- **`ANDROID_HOME` 설정:**
  - 내 PC의 Android SDK 설치 경로를 값으로 하는 `ANDROID_HOME`이라는 새 환경 변수를 만듭니다. 경로는 보통 `C:\Users\사용자명\AppData\Local\Android\Sdk`와 같습니다.
- **`Path`에 `platform-tools` 추가:**
  - 기존 `Path` 환경 변수에 `%ANDROID_HOME%\platform-tools` 경로를 추가합니다. 이 폴더에는 앱 설치 및 디버깅에 사용되는 `adb`와 같은 핵심 도구가 들어있습니다.

설정이 완료되면 터미널(PowerShell 또는 cmd)을 재시작한 후, 아래 명령어로 올바르게 설정되었는지 확인합니다.

```bash
# ANDROID_HOME 변수가 올바른 SDK 경로를 가리키는지 확인
# 예: C:\Users\YourUser\AppData\Local\Android\Sdk
echo %ANDROID_HOME%

# Path 변수에 platform-tools 경로가 포함되었는지 확인
# ...다른 경로들...;C:\Users\YourUser\AppData\Local\Android\Sdk\platform-tools;
echo %path%
```

---

## 4단계: 새로운 React Native 프로젝트 생성하기

이제 모든 준비가 끝났습니다. 터미널에서 다음 명령어를 실행하여 첫 React Native 프로젝트를 만들어 봅시다.

```bash
# 'taxiApp'이라는 이름의 새로운 React Native 프로젝트를 생성합니다.
npx react-native@latest init taxiApp
```

- `npx`: 패키지를 임시로 다운로드하여 실행하는 Node.js 명령어입니다. `react-native` CLI를 내 컴퓨터에 영구적으로 설치하지 않고도 프로젝트 생성 명령을 사용할 수 있게 해줍니다.
- `react-native@latest`: 항상 최신 버전의 React Native CLI를 사용하여 프로젝트를 생성하도록 보장합니다.
- `init taxiApp`: `taxiApp`이라는 이름으로 새로운 프로젝트를 초기화(initialize)하라는 의미입니다. `taxiApp` 대신 원하는 프로젝트 이름으로 변경할 수 있습니다.

이제 프로젝트 폴더(`taxiApp`)로 이동하여 개발 서버를 시작하고 에뮬레이터에서 앱을 실행할 수 있습니다.

---

## 마치며

지금까지 React Native CLI를 사용하여 네이티브 개발 환경을 구축하는 전체 과정을 알아보았습니다. 요약하자면 다음과 같습니다.

1.  **개발 방식 선택:** Expo와 React Native CLI의 차이점을 이해하고, 네이티브 제어가 필요한 CLI 방식을 선택했습니다.
2.  **필수 도구 설치:** JavaScript 런타임인 **Node.js**, Android 빌드를 위한 **JDK**, 그리고 Android SDK와 에뮬레이터를 관리하기 위한 **Android Studio**를 순서대로 설치했습니다.
3.  **프로젝트 생성:** 모든 설정이 완료된 후, `npx react-native@latest init` 명령어로 성공적으로 새로운 프로젝트를 만들었습니다.

조금은 복잡한 과정이었지만, 이제 여러분은 어떤 종류의 React Native 앱이든 자유롭게 개발할 수 있는 강력한 기반을 갖추게 되었습니다. 수고하셨습니다\!
