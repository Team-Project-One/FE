// ===== 공통 타입 정의 =====
export type Screen =
    | 'signupLanding'
    | 'signupLogin'
    | 'signupBasic'
    | 'signupDetailed'
    | 'signupSelfIntro'
    | 'signupProfile'
    | 'main'
    | 'home'
    | 'mypage'
    | 'chat'
    | 'chatDetail'
    | 'matchingResult'
    | 'settings'
    | 'profileEdit'
    | 'terms'
    | 'privacy';

export type NavigationHandler = (screen: Screen, extraData?: any) => void;

// ===== 컴포넌트 Props 타입 =====

export interface AppHeaderProps {
    title: string;
}

export interface BottomNavigationProps {
    onNavigate: NavigationHandler;
    currentScreen: Screen;
}

// ===== 스크린 Props 타입 (공통 패턴) =====
export interface BaseScreenProps {
    onNavigate: NavigationHandler;
    routeParams?: any;
}

// 개별 스크린 Props는 BaseScreenProps를 확장
export interface MainScreenProps extends BaseScreenProps {}
export interface MyScreenProps extends BaseScreenProps {}
export interface ChatScreenProps extends BaseScreenProps {}
export interface ChatDetailScreenProps extends BaseScreenProps {
    chatName?: string;
    chatAge?: number;
}
export interface MatchingResultScreenProps extends BaseScreenProps {}
export interface SettingsScreenProps extends BaseScreenProps {}

// ===== 회원가입 플로우 스크린 Props =====
export interface SignupLandingScreenProps extends BaseScreenProps {}
export interface SignupLoginScreenProps extends BaseScreenProps {}
export interface SignupBasicScreenProps extends BaseScreenProps {}
export interface SignupDetailedScreenProps extends BaseScreenProps {}
export interface SignupSelfIntroScreenProps extends BaseScreenProps {}
export interface SignupProfileScreenProps extends BaseScreenProps {}

// ===== 폼 데이터 타입 (기존 유지) =====
export type GenderOption = 'male' | 'female' | '';

export interface SignupBasicFormData {
    name: string;
    birthDate: string;
    gender: GenderOption;
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

export interface SignupFormState extends SignupBasicFormData, SignupDetailedFormData {
    kakaoId: string;
    email: string;
    sexualOrientation: string;
    introduction: string;
    profileImageUri: string | null;
}

export interface SignupResponse {
    id: number;
    name: string;
}

export interface UserStatus {
    userId: number | null;
    profileCompleted: boolean;
}

export interface MyPageData {
    userId: number;
    name: string;
    birthDate: string | null;
    gender: string | null;
    sexualOrientation: string | null;
    job: string | null;
    region: string | null;
    drinkingFrequency: string | null;
    smokingStatus: string | null;
    height: number | null;
    petPreference: string | null;
    religion: string | null;
    contactFrequency: string | null;
    mbti: string | null;
    introduction: string | null;
    profileImagePath: string | null;
}

// ===== 유틸리티 타입 =====
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
