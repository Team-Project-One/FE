# Divine (디바인) - Frontend

디바인은 사주 궁합으로 상대를 추천하고, 매칭된 사용자끼리 실시간으로 대화할 수 있는 데이팅 앱입니다. 이 저장소는 디바인의 React Native 앱 코드입니다.

- 기간: 2025.09 ~ 2025.12
- 백엔드: [Team-Project-One/BE](https://github.com/Team-Project-One/BE)

## 기술 스택

| 구분 | 사용 기술 |
|---|---|
| Framework | React Native 0.81, Expo 54, React 19 |
| Language | TypeScript |
| Styling | NativeWind (Tailwind CSS) |
| 실시간 통신 | STOMP (@stomp/stompjs) |
| 인증 | Kakao 로그인, JWT |

## 주요 기능

- 카카오 로그인과 단계별 회원가입 (기본 정보, 프로필, 상세 정보, 자기소개)
- 사주 궁합 기반 매칭과 매칭 결과 화면
- STOMP 기반 1:1 실시간 채팅, 입력 중 표시
- AI 대화 주제, 데이트 코스 추천
- 오늘의 운세
- 마이페이지, 프로필 수정, 프로필 이미지 변경과 삭제

## 화면 구성

| 영역 | 화면 |
|---|---|
| 회원가입 / 로그인 | SignupLanding, SignupLogin, SignupBasic, SignupProfile, SignupDetailed, SignupSelfIntro, Terms, Privacy |
| 메인 / 매칭 | Main, MatchingResult |
| 채팅 | Chat, ChatDetail |
| 마이페이지 | My, ProfileEdit, Settings |

## 프로젝트 구조

```
src/
├── api/          # 백엔드 API 호출 (auth, user, matching, chat, ai, fortune, mypage)
├── components/   # 공용 컴포넌트, 회원가입 단계별 컴포넌트
├── screen/       # 화면
├── utils/        # WebSocket(STOMP) 연결, 알림, 채팅 저장
├── context/      # 회원가입 단계 간 입력값 공유
├── constants/    # 상수
├── theme/        # 색상, 폰트
└── types/        # 타입 정의
```

## 실행 방법

### 요구 사항

- Node.js
- Android 에뮬레이터
- 실행 중인 백엔드 서버 ([BE 실행 가이드](./BE_SERVER_RUN_GUIDE.md))

### 실행

```bash
npm install
npm run android   # 또는 npm start
```

### 백엔드 주소

`app.json`의 `expo.extra.apiBaseUrl`로 지정합니다. 지정하지 않으면 개발 모드에서 아래 주소를 사용합니다.

- Android 에뮬레이터: `http://10.0.2.2:8080`
- 그 외: `http://localhost:8080`

## 문서

- [BE 실행 가이드](./BE_SERVER_RUN_GUIDE.md)
- [STOMP 마이그레이션 가이드](./STOMP_MIGRATION_GUIDE.md): Socket.IO 클라이언트를 백엔드의 STOMP 방식으로 전환한 과정
- [ERD 문서](./ERD_DOCUMENTATION.md)
