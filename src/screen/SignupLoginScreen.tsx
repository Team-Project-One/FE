import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login, KakaoOAuthToken } from "@react-native-seoul/kakao-login";
import { Screen, SignupLoginScreenProps } from "../types";
import DivineLogoSvg from "../assets/divine.svg";
import KakaoLoginSvg from "../assets/kakao-login.svg";
import { fetchUserStatus } from "../api/user";
import { useSignup } from "../context/SignupContext";
import { requestTestLogin, JwtTokenResponse } from "../api/auth";

/**
 * 카카오 로그인 화면
 * 앱 시작 시 첫 화면으로, 카카오 로그인을 통해 회원가입 프로세스를 시작합니다.
 */
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const KAKAO_MOBILE_LOGIN_ENDPOINT =
  process.env.EXPO_PUBLIC_KAKAO_MOBILE_LOGIN_URL ||
  "http://10.0.2.2:8080/auth/kakao/mobile";

const SignupLoginScreen: React.FC<SignupLoginScreenProps> = ({
  onNavigate,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { updateSignupData } = useSignup();

  const processLoginTokens = useCallback(
    async (tokens: JwtTokenResponse): Promise<Screen> => {
      if (!tokens || !tokens.accessToken) {
        throw new Error("백엔드에서 액세스 토큰을 받지 못했습니다.");
      }

      await AsyncStorage.setItem("@auth/accessToken", tokens.accessToken);

      if (tokens.refreshToken) {
        await AsyncStorage.setItem("@auth/refreshToken", tokens.refreshToken);
      }

      updateSignupData({
        kakaoId:
          tokens.kakaoId ??
          (tokens as any).kakao_id ??
          (tokens as any).userId ??
          (tokens as any).user_id ??
          "",
        email: tokens.email ?? "",
      });

      let targetScreen: Screen = "signupBasic";

      try {
        const userStatus = await fetchUserStatus(tokens.kakaoId ?? "");
        console.log("[SignupLogin] user status", userStatus);
        if (userStatus.userId) {
          await AsyncStorage.setItem("@auth/userId", String(userStatus.userId));
        }
        const profileCompleted = userStatus.profileCompleted;
        targetScreen = profileCompleted ? "home" : "signupBasic";
      } catch (statusError) {
        console.error("사용자 상태 확인 실패:", statusError);
        targetScreen = "signupBasic";
      }

      return targetScreen;
    },
    [updateSignupData]
  );

  const navigateToScreen = useCallback(
    (targetScreen: Screen) => {
      setTimeout(() => {
        console.log("네비게이션 실행:", targetScreen);
        onNavigate(targetScreen);
      }, 100);
    },
    [onNavigate]
  );

  const exchangeKakaoToken = useCallback(
    async (kakaoTokens: KakaoOAuthToken) => {
      if (!kakaoTokens?.accessToken) {
        throw new Error("카카오 액세스 토큰을 받지 못했습니다.");
      }

      // 타임아웃 설정 (10초)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        console.log("백엔드 토큰 교환 요청:", KAKAO_MOBILE_LOGIN_ENDPOINT);
        const response = await fetch(KAKAO_MOBILE_LOGIN_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accessToken: kakaoTokens.accessToken,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text().catch(() => "응답을 읽을 수 없습니다");
          console.error("백엔드 토큰 교환 실패:", {
            status: response.status,
            statusText: response.statusText,
            response: errorText.substring(0, 200),
          });
          throw new Error(`백엔드 토큰 교환에 실패했습니다: ${response.status} ${response.statusText}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error("JSON이 아닌 응답:", {
            contentType,
            response: text.substring(0, 200),
          });
          throw new Error(`서버가 JSON이 아닌 응답을 반환했습니다: ${contentType}`);
        }

        return response.json();
      } catch (error: any) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
          throw new Error("서버 응답 시간이 초과되었습니다. 네트워크 연결을 확인해주세요.");
        }
        throw error;
      }
    },
    []
  );

  const handleKakaoLogin = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // 카카오 로그인 시도
      console.log("카카오 로그인 시작...");
      
      // login 함수가 존재하는지 확인
      if (typeof login !== 'function') {
        throw new Error("카카오 로그인 모듈이 제대로 로드되지 않았습니다. 앱을 재시작해주세요.");
      }
      
      let kakaoTokens: KakaoOAuthToken | null = null;
      try {
        const result = await login();
        console.log("카카오 로그인 응답 타입:", typeof result);
        console.log("카카오 로그인 응답:", JSON.stringify(result, null, 2));
        
        // result가 유효한지 확인
        if (result === null || result === undefined) {
          throw new Error("카카오 로그인이 취소되었거나 실패했습니다.");
        }
        
        // result가 객체인지 확인
        if (typeof result !== 'object' || Array.isArray(result)) {
          throw new Error(`카카오 로그인 응답 형식이 올바르지 않습니다. 타입: ${typeof result}`);
        }
        
        kakaoTokens = result as KakaoOAuthToken;
        
        // accessToken이 있는지 확인
        if (!kakaoTokens.accessToken) {
          const keys = Object.keys(kakaoTokens);
          console.error("kakaoTokens에 accessToken이 없습니다. 사용 가능한 키:", keys);
          throw new Error(`카카오 액세스 토큰이 없습니다. 응답 키: ${keys.join(', ')}`);
        }
      } catch (loginError: any) {
        console.error("카카오 login() 함수 오류 상세:", {
          message: loginError?.message,
          toString: loginError?.toString(),
          stack: loginError?.stack,
          error: loginError
        });
        
        // "Cannot read property" 에러인 경우
        if (loginError?.message?.includes('Cannot read') || loginError?.message?.includes('Cannot read prop')) {
          throw new Error("카카오 로그인 모듈 초기화 오류. 앱을 완전히 종료한 후 다시 시작해주세요.");
        }
        
        throw new Error(`카카오 로그인 실패: ${loginError?.message || loginError?.toString() || "알 수 없는 오류"}`);
      }

      // kakaoTokens가 null이면 에러
      if (!kakaoTokens || !kakaoTokens.accessToken) {
        throw new Error("카카오 로그인 토큰을 가져오지 못했습니다.");
      }

      const tokens = await exchangeKakaoToken(kakaoTokens);

      if (!tokens || !tokens.accessToken) {
        throw new Error("백엔드에서 액세스 토큰을 받지 못했습니다.");
      }

      const targetScreen = await processLoginTokens(tokens);
      console.log("최종 네비게이션:", targetScreen);
      setIsLoading(false);
      navigateToScreen(targetScreen);
    } catch (error: any) {
      console.error("카카오 로그인 오류", error);
      const errorMessage = error?.message || error?.toString() || "알 수 없는 오류가 발생했습니다.";
      Alert.alert(
        "로그인 오류",
        errorMessage.includes("Cannot read") 
          ? "카카오 로그인 초기화에 문제가 있습니다. 앱을 재시작해주세요."
          : errorMessage
      );
    } finally {
      setIsLoading(false);
    }
  }, [exchangeKakaoToken, navigateToScreen, processLoginTokens]);

  const handleTestLogin = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log("테스트 로그인 시작...");
      const tokens = await requestTestLogin({ testUserNumber: 2 });
      const targetScreen = await processLoginTokens(tokens);
      console.log("테스트 로그인 네비게이션:", targetScreen);
      setIsLoading(false);
      navigateToScreen(targetScreen);
    } catch (error: any) {
      console.error("테스트 로그인 오류", error);
      const errorMessage = error?.message || error?.toString() || "테스트 로그인 중 오류가 발생했습니다.";
      Alert.alert("테스트 로그인 오류", errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [navigateToScreen, processLoginTokens]);

  return (
    <LinearGradient
      colors={["#FDF2F8", "#FCE7F3"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <StatusBar style="dark" />

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <DivineLogoSvg width={120} height={40} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.mainTitle}>운명의 상대를 만나보세요</Text>
          <Text style={styles.subTitle}>사주팔자로 찾는 완벽한 궁합</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleKakaoLogin}
            activeOpacity={0.9}
            disabled={isLoading}
            style={isLoading && styles.disabledButton}
          >
            <KakaoLoginSvg width={SCREEN_WIDTH - 40} height={52} />
          </TouchableOpacity>
          {isLoading && (
            <ActivityIndicator
              style={styles.loadingIndicator}
              color="#3c1e1e"
            />
          )}

          <Text style={styles.disclaimerText}>
            가입 시 서비스 이용약관 및 개인정보처리방침에 동의한 것으로
            간주됩니다.
          </Text>

          {__DEV__ && (
            <TouchableOpacity
              style={styles.testLoginButton}
              onPress={handleTestLogin}
              disabled={isLoading}
            >
              <Text style={styles.testLoginText}>테스트 로그인 (User B)</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  logoContainer: {
    marginBottom: 40,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1E2939",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 32,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "400",
    color: "#4A5565",
    textAlign: "center",
    marginBottom: 48,
    lineHeight: 24,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  loadingIndicator: {
    marginTop: 12,
  },
  disclaimerText: {
    marginTop: 16,
    fontSize: 12,
    fontWeight: "400",
    color: "#6B7280",
    textAlign: "center",
    paddingHorizontal: 36,
    lineHeight: 19.5,
  },
  testLoginButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  testLoginText: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
  },
});

export default SignupLoginScreen;
