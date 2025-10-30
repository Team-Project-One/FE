import { ViewStyle, TextStyle } from "react-native";

// ===== 공통 타입 정의 =====
export type Screen =
  | "signupLanding"
  | "signupLogin"
  | "signupBasic"
  | "signupDetailed"
  | "signupSelfIntro"
  | "signupProfile"
  | "home"
  | "mypage"
  | "matchingResult";

export type NavigationHandler = (screen: Screen) => void;

// ===== 컴포넌트 Props 타입 =====
export interface ButtonViewProps {
  title: string;
  onPress: () => void;
  buttonStyle?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
}

export interface AppHeaderProps {
  title: string;
}

export interface BottomNavigationProps {
  onNavigate: NavigationHandler;
}

// ===== 스크린 Props 타입 (공통 패턴) =====
export interface BaseScreenProps {
  onNavigate: NavigationHandler;
}

// 개별 스크린 Props는 BaseScreenProps를 확장
export interface MainScreenProps extends BaseScreenProps {}
export interface MyScreenProps extends BaseScreenProps {}
export interface MatchingResultScreenProps extends BaseScreenProps {}
export interface SignupLandingScreenProps extends BaseScreenProps {}
export interface SignupLoginScreenProps extends BaseScreenProps {}
export interface SignupBasicScreenProps extends BaseScreenProps {}
export interface SignupDetailedScreenProps extends BaseScreenProps {}
export interface SignupSelfIntroScreenProps extends BaseScreenProps {}
export interface SignupProfileScreenProps extends BaseScreenProps {}

// ===== 폼 데이터 타입 =====
export interface SignupBasicFormData {
  name: string;
  birthDate: string;
  gender: string;
}

export interface SignupDetailedFormData {
  job: string;
  region: string;
  drinkingFrequency: string;
  smokingStatus: string;
  height: string;
  pets: string;
  religion: string;
  contactFrequency: string;
  mbti: string;
}

// ===== 유틸리티 타입 =====
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
