# 백엔드 데이터베이스 ERD 문서

## 개요

이 문서는 실제 백엔드 코드(`../BE/src/main/java`)를 기반으로 작성된 최신 ERD(Entity-Relationship Diagram)입니다.

---

## ERD 다이어그램

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ERD 다이어그램                                  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────┐
│   kakao_users       │
│─────────────────────│
│ PK id (BIGINT)      │
│     kakaoId (VARCHAR│
│     email (VARCHAR) │
│     role (VARCHAR)  │
└──────────┬──────────┘
           │ 1:1
           │
           ▼
┌─────────────────────┐         ┌──────────────────────┐
│      users          │ 1:1     │   user_profiles      │
│─────────────────────│◄────────│──────────────────────│
│ PK id (BIGINT)      │         │ PK id (BIGINT)       │
│     name (VARCHAR)  │         │ FK user_id (BIGINT)  │
│     gender (ENUM)   │         │     profileImagePath │
│     birthDate (DATE)│         │     sexualOrientation│
│ FK kakao_user_id   │         │     job (ENUM)       │
│     (BIGINT)        │         │     region (ENUM)    │
└──────────┬──────────┘         │     drinkingFrequency│
           │                    │     smokingStatus    │
           │ N                  │     height (INTEGER)  │
           │                    │     petPreference     │
           │                    │     religion (ENUM)   │
           │                    │     contactFrequency │
           │                    │     mbti (ENUM)      │
           │                    │     introduction     │
           │                    │       (VARCHAR)      │
           │                    └──────────────────────┘
           │
           │ N
           │
           ▼
┌─────────────────────┐
│ chatroom_participants│ (중간 테이블)
│─────────────────────│
│ FK room_id (BIGINT) │
│ FK user_id (BIGINT) │
└──────────┬──────────┘
           │
           │ N
           │
           ▼
┌─────────────────────┐         ┌──────────────────────┐
│    chat_rooms       │ 1:N     │   chat_messages      │
│─────────────────────│────────►│──────────────────────│
│ PK id (BIGINT)      │         │ PK id (BIGINT)       │
│     lastMessage     │         │ FK room_id (BIGINT) │
│       (VARCHAR)     │         │ FK sender_id         │
│     lastMessageTime │         │       (BIGINT)       │
│       stamp         │         │     content          │
│       (DATETIME)    │         │       (VARCHAR(1000))│
└─────────────────────┘         │     timestamp        │
                                │       (DATETIME)     │
                                └──────────────────────┘
                                         ▲
                                         │ N
                                         │
                                ┌────────┴──────────┐
                                │      users        │
                                └───────────────────┘

┌─────────────────────┐
│  refresh_tokens     │
│─────────────────────│
│ PK id (BIGINT)      │
│     userId (VARCHAR)│
│     token (VARCHAR) │
│     createdAt       │
│       (DATETIME)    │
└─────────────────────┘
```

---

## 테이블 상세 설명

### 1. `kakao_users` (카카오 유저)

**목적**: 카카오 로그인 인증 정보 저장

| 필드명    | 데이터 타입   | 제약조건                 | 설명                |
| --------- | ------------- | ------------------------ | ------------------- |
| `id`      | BIGINT        | PK, AUTO_INCREMENT       | 카카오 유저 고유 ID |
| `kakaoId` | VARCHAR       | UNIQUE, NOT NULL         | 카카오 계정 ID      |
| `email`   | VARCHAR       | UNIQUE, NOT NULL         | 카카오 이메일       |
| `role`    | VARCHAR(ENUM) | NOT NULL, DEFAULT='USER' | 사용자 권한 (USER)  |

**관계**:

- **1:1** → `users` (`users.kakao_user_id`)

**참고사항**:

- `KakaoUser` Entity에 해당
- 카카오 로그인 시 생성되는 최상위 인증 테이블

---

### 2. `users` (유저)

**목적**: 앱 내 사용자 기본 정보 저장

| 필드명          | 데이터 타입   | 제약조건           | 설명                                  |
| --------------- | ------------- | ------------------ | ------------------------------------- |
| `id`            | BIGINT        | PK, AUTO_INCREMENT | 유저 고유 ID                          |
| `name`          | VARCHAR       | NOT NULL           | 사용자 이름                           |
| `gender`        | VARCHAR(ENUM) | NOT NULL           | 성별 (MALE, FEMALE)                   |
| `birthDate`     | DATE          | NOT NULL           | 생년월일                              |
| `kakao_user_id` | BIGINT        | FK, UNIQUE         | 카카오 유저 ID (참조: kakao_users.id) |

**관계**:

- **1:1** ← `kakao_users` (`kakao_user_id`)
- **1:1** → `user_profiles` (`user_profiles.user_id`)
- **N:M** → `chat_rooms` (중간 테이블: `chatroom_participants`)
- **1:N** → `chat_messages` (`chat_messages.sender_id`)

**참고사항**:

- `User` Entity에 해당
- 앱의 핵심 사용자 정보를 담는 테이블

---

### 3. `user_profiles` (유저 상세정보)

**목적**: 사용자의 상세 프로필 정보 저장

| 필드명              | 데이터 타입   | 제약조건             | 설명                                                                   |
| ------------------- | ------------- | -------------------- | ---------------------------------------------------------------------- |
| `id`                | BIGINT        | PK, AUTO_INCREMENT   | 프로필 고유 ID                                                         |
| `user_id`           | BIGINT        | FK, NOT NULL, UNIQUE | 유저 ID (참조: users.id)                                               |
| `profileImagePath`  | VARCHAR       | NULL                 | 프로필 이미지 파일 경로                                                |
| `sexualOrientation` | VARCHAR(ENUM) | NULL                 | 성적 지향성 (STRAIGHT, HOMOSEXUAL)                                     |
| `job`               | VARCHAR(ENUM) | NULL                 | 직업 (UNEMPLOYED, STUDENT, EMPLOYEE)                                   |
| `region`            | VARCHAR(ENUM) | NULL                 | 지역 (SEOUL, GYEONGGI_DO, INCHEON, ...)                                |
| `drinkingFrequency` | VARCHAR(ENUM) | NULL                 | 음주 빈도 (NONE, ONCE_OR_TWICE_PER_WEEK, THREE_TIMES_OR_MORE_PER_WEEK) |
| `smokingStatus`     | VARCHAR(ENUM) | NULL                 | 흡연 여부 (NON_SMOKER, SMOKER)                                         |
| `height`            | INTEGER       | NULL                 | 키 (cm)                                                                |
| `petPreference`     | VARCHAR(ENUM) | NULL                 | 반려동물 선호도 (NONE, DOG, CAT, OTHER)                                |
| `religion`          | VARCHAR(ENUM) | NULL                 | 종교 (NONE, CATHOLIC, CHRISTIAN, BUDDHIST, OTHER)                      |
| `contactFrequency`  | VARCHAR(ENUM) | NULL                 | 연락 빈도 중요도 (IMPORTANT, NOT_IMPORTANT)                            |
| `mbti`              | VARCHAR(ENUM) | NULL                 | MBTI 유형 (INTJ, INTP, ENTJ, ..., UNKNOWN)                             |
| `introduction`      | VARCHAR       | NULL                 | 자기소개                                                               |

**관계**:

- **1:1** ← `users` (`user_id`)

**참고사항**:

- `UserProfile` Entity에 해당
- 프로필 이미지는 별도 테이블이 아닌 파일 경로로 저장
- 모든 상세 정보 필드는 NULL 허용 (선택적 입력)

---

### 4. `chat_rooms` (채팅방)

**목적**: 1:1 채팅방 정보 저장

| 필드명                 | 데이터 타입 | 제약조건           | 설명               |
| ---------------------- | ----------- | ------------------ | ------------------ |
| `id`                   | BIGINT      | PK, AUTO_INCREMENT | 채팅방 고유 ID     |
| `lastMessage`          | VARCHAR     | NULL               | 마지막 메시지 내용 |
| `lastMessageTimestamp` | DATETIME    | NULL               | 마지막 메시지 시간 |

**관계**:

- **N:M** → `users` (중간 테이블: `chatroom_participants`)
- **1:N** → `chat_messages` (`chat_messages.room_id`)

**참고사항**:

- `ChatRoom` Entity에 해당
- 1:1 채팅방만 지원 (2명의 사용자만 참여)
- `chatroom_participants` 중간 테이블을 통해 사용자와 연결

---

### 5. `chatroom_participants` (채팅방 참여자 - 중간 테이블)

**목적**: 채팅방과 사용자의 N:M 관계를 매핑

| 필드명    | 데이터 타입 | 제약조건 | 설명                            |
| --------- | ----------- | -------- | ------------------------------- |
| `room_id` | BIGINT      | FK, PK   | 채팅방 ID (참조: chat_rooms.id) |
| `user_id` | BIGINT      | FK, PK   | 유저 ID (참조: users.id)        |

**관계**:

- **N:1** ← `chat_rooms` (`room_id`)
- **N:1** ← `users` (`user_id`)

**참고사항**:

- `ChatRoom` Entity의 `@ManyToMany` 어노테이션으로 자동 생성되는 중간 테이블
- 복합 기본키 (room_id, user_id)

---

### 6. `chat_messages` (채팅 메시지)

**목적**: 채팅방 내 메시지 저장

| 필드명      | 데이터 타입   | 제약조건           | 설명                            |
| ----------- | ------------- | ------------------ | ------------------------------- |
| `id`        | BIGINT        | PK, AUTO_INCREMENT | 메시지 고유 ID                  |
| `room_id`   | BIGINT        | FK, NOT NULL       | 채팅방 ID (참조: chat_rooms.id) |
| `sender_id` | BIGINT        | FK, NOT NULL       | 발신자 ID (참조: users.id)      |
| `content`   | VARCHAR(1000) | NOT NULL           | 메시지 내용 (최대 1000자)       |
| `timestamp` | DATETIME      | NOT NULL           | 메시지 전송 시간                |

**관계**:

- **N:1** ← `chat_rooms` (`room_id`)
- **N:1** ← `users` (`sender_id`)

**참고사항**:

- `ChatMessage` Entity에 해당
- 메시지 삭제 시 채팅방도 함께 삭제됨 (CascadeType.ALL)

---

### 7. `refresh_tokens` (리프레시 토큰)

**목적**: JWT 리프레시 토큰 저장

| 필드명      | 데이터 타입  | 제약조건              | 설명                               |
| ----------- | ------------ | --------------------- | ---------------------------------- |
| `id`        | BIGINT       | PK, AUTO_INCREMENT    | 토큰 고유 ID                       |
| `userId`    | VARCHAR      | NOT NULL              | 사용자 식별자 (kakaoId 또는 email) |
| `token`     | VARCHAR(500) | NOT NULL              | 리프레시 토큰 값                   |
| `createdAt` | DATETIME     | NOT NULL, DEFAULT=NOW | 토큰 생성 시간                     |

**관계**:

- 다른 테이블과의 외래키 관계 없음 (독립적)

**참고사항**:

- `RefreshToken` Entity에 해당
- JWT 인증을 위한 리프레시 토큰 관리

---

## 기존 ERD와의 차이점

### 삭제된 테이블 (실제 Entity가 존재하지 않음)

1. **`todays_fortunes` (운세)**
   - **이유**: `FortuneDTO`는 DTO이며, 실제 Entity가 없음
   - **대체**: 운세는 OpenAI API를 통해 실시간 생성되며 DB에 저장되지 않음

2. **`chemistry_scores` (궁합점수)**
   - **이유**: `SajuResponse`는 외부 Python API 응답 DTO이며, 실제 Entity가 없음
   - **대체**: 궁합점수는 외부 API 호출로 실시간 계산되며 DB에 저장되지 않음

3. **`member_settings` (설정)**
   - **이유**: 실제 Entity가 존재하지 않음
   - **대체**: 설정 정보는 현재 프론트엔드의 `AsyncStorage`에 저장됨

4. **`user_pic` (유저 사진)**
   - **이유**: 별도 테이블이 아닌 `user_profiles.profileImagePath` 필드로 관리됨
   - **대체**: 프로필 이미지는 파일 경로 문자열로 저장

### 변경된 구조

1. **채팅방 참여자 관리**
   - **기존**: `chat_participants` 테이블에 `member_id`, `joined_at`, `last_read_at` 등 필드 존재
   - **현재**: `chatroom_participants` 중간 테이블로 단순화 (room_id, user_id만 존재)
   - **이유**: JPA의 `@ManyToMany` 어노테이션으로 자동 생성되는 구조

2. **채팅방 구조**
   - **기존**: `chat_rooms`에 `room_type`, `created_at`, `participant_id` 필드 존재
   - **현재**: `lastMessage`, `lastMessageTimestamp` 필드만 존재
   - **이유**: 1:1 채팅만 지원하므로 단순화된 구조

---

## 주요 특징

1. **인증 구조**
   - 카카오 로그인 → `kakao_users` → `users` → `user_profiles` 순서로 연결
   - JWT 리프레시 토큰은 별도 테이블로 관리

2. **채팅 시스템**
   - 1:1 채팅방만 지원
   - ManyToMany 관계로 유연한 참여자 관리
   - 메시지는 채팅방에 종속적 (Cascade 삭제)

3. **프로필 관리**
   - 기본 정보(`users`)와 상세 정보(`user_profiles`) 분리
   - 프로필 이미지는 파일 경로로 저장 (별도 테이블 없음)

4. **실시간 데이터**
   - 운세, 궁합점수는 DB에 저장하지 않고 외부 API로 실시간 생성
   - 설정 정보는 프론트엔드 로컬 스토리지에 저장

---

## 데이터 타입 상세

### ENUM 타입들

**Gender**: `MALE`, `FEMALE`

**SexualOrientation**: `STRAIGHT`, `HOMOSEXUAL`

**Job**: `UNEMPLOYED`, `STUDENT`, `EMPLOYEE`

**Region**: `SEOUL`, `GYEONGGI_DO`, `INCHEON`, `BUSAN`, `DAEGU`, `GWANGJU`, `DAEJEON`, `ULSAN`, `SEJONG`, `GANGWON_DO`, `CHUNGCHEONGBUK_DO`, `CHUNGCHEONGNAM_DO`, `JEOLLABUK_DO`, `JEOLLANAM_DO`, `GYEONGSANGBUK_DO`, `GYEONGSANGNAM_DO`, `JEJU_DO`

**DrinkingFrequency**: `NONE`, `ONCE_OR_TWICE_PER_WEEK`, `THREE_TIMES_OR_MORE_PER_WEEK`

**SmokingStatus**: `NON_SMOKER`, `SMOKER`

**PetPreference**: `NONE`, `DOG`, `CAT`, `OTHER`

**Religion**: `NONE`, `CATHOLIC`, `CHRISTIAN`, `BUDDHIST`, `OTHER`

**ContactFrequency**: `IMPORTANT`, `NOT_IMPORTANT`

**Mbti**: `INTJ`, `INTP`, `ENTJ`, `ENTP`, `INFJ`, `INFP`, `ENFJ`, `ENFP`, `ISTJ`, `ISFJ`, `ESTJ`, `ESFJ`, `ISTP`, `ISFP`, `ESTP`, `ESFP`, `UNKNOWN`

**Role**: `USER`

---

## 작성일

2024년 (백엔드 코드 기준)

## 참고

- 모든 테이블명과 필드명은 실제 JPA Entity 클래스에서 추출
- 데이터 타입은 Java 타입을 기반으로 추정 (실제 DB 스키마와 약간 다를 수 있음)
- 관계는 JPA 어노테이션(`@OneToOne`, `@ManyToOne`, `@OneToMany`, `@ManyToMany`)을 기반으로 작성
