# STOMP WebSocket 마이그레이션 가이드

## 문제점
현재 프론트엔드는 Socket.IO 클라이언트를 사용하고 있지만, 백엔드는 **STOMP WebSocket**을 사용하고 있습니다.
이 둘은 호환되지 않으므로 프론트엔드를 STOMP 클라이언트로 변경해야 합니다.

## 백엔드 STOMP 설정 요약
- WebSocket 엔드포인트: `/ws/chat` (SockJS 지원)
- 메시지 전송 경로: `/app/chat/message`
- 메시지 수신 경로: `/user/queue/chat`
- 인증: JWT 토큰 필요

## 서버 실행 방법

### 1. 필수 요구사항
- Java 21 이상
- MySQL 데이터베이스 실행 중
- 데이터베이스명: `TeamProject1`

### 2. 서버 실행 (Windows)
```bash
cd C:\TeamProject\BE
.\gradlew.bat bootRun
```

### 3. 서버 확인
- 서버 주소: `http://localhost:8080`
- WebSocket 엔드포인트: `ws://localhost:8080/ws/chat`

## 프론트엔드 변경 필요 사항

### 1. Socket.IO → STOMP 클라이언트로 변경
- `socket.io-client` 제거
- `@stomp/stompjs` 및 `sockjs-client` 설치 필요
- `src/utils/websocket.ts` 파일을 STOMP 클라이언트로 재작성 필요

### 2. 메시지 형식
백엔드에서 기대하는 메시지 형식:
```json
{
  "roomId": 1,
  "content": "메시지 내용"
}
```

백엔드에서 전송하는 메시지 형식:
```json
{
  "messageId": 1,
  "roomId": 1,
  "senderId": 1,
  "senderName": "사용자명",
  "content": "메시지 내용",
  "timestamp": "2024-01-01T12:00:00"
}
```

