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

/**
 * 폼 유효성 검사 헬퍼 함수
 * @param formData - 검사할 폼 데이터
 * @param requiredFields - 필수 필드 목록
 */
export const validateForm = (
  formData: Record<string, string>,
  requiredFields: string[]
): boolean => {
  return requiredFields.every(
    (field) => formData[field] && formData[field].trim() !== ""
  );
};

/**
 * 이메일 유효성 검사
 * @param email - 검사할 이메일
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 전화번호 유효성 검사
 * @param phone - 검사할 전화번호
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9-+\s()]+$/;
  return phoneRegex.test(phone) && phone.replace(/[^0-9]/g, "").length >= 10;
};
