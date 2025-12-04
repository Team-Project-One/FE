# 백엔드 서버 실행 가이드

## Spring Boot 서버 실행 방법

### 1. 필수 요구사항
- Java 21 이상
- MySQL 데이터베이스 (localhost:3306)
- 데이터베이스명: `TeamProject1`

### 2. 데이터베이스 설정
`application.properties` 파일에서 데이터베이스 연결 정보 확인:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/TeamProject1?serverTimezone=Asia/Seoul&allowPublicKeyRetrieval=true&useSSL=false
spring.datasource.username=root
spring.datasource.password=zxcv8240?
```

### 3. 서버 실행 방법

#### 방법 1: Gradle Wrapper 사용 (권장)
```bash
cd C:\TeamProject\BE
.\gradlew.bat bootRun
```

#### 방법 2: IDE에서 실행
1. IntelliJ IDEA 또는 Eclipse에서 `BackendApplication.java` 파일 열기
2. `main` 메서드에서 우클릭 → "Run 'BackendApplication.main()'"

#### 방법 3: 빌드 후 실행
```bash
cd C:\TeamProject\BE
.\gradlew.bat build
java -jar build\libs\backend-0.0.1-SNAPSHOT.jar
```

### 4. 서버 확인
- 서버가 정상적으로 실행되면 `http://localhost:8080`에서 접근 가능
- WebSocket 엔드포인트: `ws://localhost:8080/ws/chat`
- Swagger UI: `http://localhost:8080/swagger-ui.html` (설정된 경우)

### 5. 문제 해결
- 포트 8080이 이미 사용 중인 경우: `application.properties`에서 `server.port=8081` 등으로 변경
- 데이터베이스 연결 실패: MySQL이 실행 중인지 확인
- Java 버전 오류: Java 21 이상 설치 필요

