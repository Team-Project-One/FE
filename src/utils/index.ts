// 유틸리티 함수들을 정의하는 파일

/**
 * 콘솔 로그를 출력하는 헬퍼 함수
 * @param message - 출력할 메시지
 * @param data - 추가 데이터 (선택사항)
 */
export const log = (message: string, data?: any) => {
  console.log(`[${new Date().toISOString()}] ${message}`, data || "");
};

/**
 * 버튼 클릭 이벤트를 처리하는 헬퍼 함수
 * @param buttonName - 버튼 이름
 */
export const handleButtonPress = (buttonName: string) => {
  log(`${buttonName} 버튼 눌림`);
};
