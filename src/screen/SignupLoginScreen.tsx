import React, { useCallback, useRef, useState } from "react";
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
import { SignupLoginScreenProps } from "../types";
import DivineLogoSvg from "../assets/divine.svg";
import KakaoLoginSvg from "../assets/kakao-login.svg";
import { useSignup } from "../context/SignupContext";

/**
 * 카카오 로그인 화면
 * 앱 시작 시 첫 화면으로, 카카오 로그인을 통해 회원가입 프로세스를 시작합니다.
 */
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const USER_INFO_ENDPOINT =
  process.env.EXPO_PUBLIC_USER_INFO_URL || "http://10.0.2.2:8080/api/users/me";
const KAKAO_MOBILE_LOGIN_ENDPOINT =
  process.env.EXPO_PUBLIC_KAKAO_MOBILE_LOGIN_URL ||
  "http://10.0.2.2:8080/auth/kakao/mobile";

const SignupLoginScreen: React.FC<SignupLoginScreenProps> = ({
  onNavigate,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const hasFetchedUserInfo = useRef(false);
  const { updateSignupData } = useSignup();

  const fetchUserInfo = useCallback(async (token: string) => {
    if (hasFetchedUserInfo.current) return;
    hasFetchedUserInfo.current = true;

    // 타임아웃 설정 (10초)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      console.log("사용자 정보 요청:", USER_INFO_ENDPOINT);
      const response = await fetch(USER_INFO_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Content-Type 확인
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("JSON이 아닌 응답:", {
          contentType,
          response: text.substring(0, 200),
        });
        throw new Error(`서버가 JSON이 아닌 응답을 반환했습니다: ${contentType}`);
      }

      const profile = await response.json();
      console.log("사용자 정보:", profile);
      
      // 응답에 status 필드가 있고 에러 상태인 경우
      if (profile.status !== undefined && (profile.status < 0 || profile.status >= 400)) {
        // 회원가입 미완료 사용자로 간주 (에러가 아닌 정상적인 경우)
        console.log("사용자 정보 없음 (회원가입 미완료):", profile.status);
        throw new Error(`사용자 정보 없음: status ${profile.status}`);
      }

      // 응답 상태 확인 (HTTP status)
      if (!response.ok) {
        const errorText = JSON.stringify(profile);
        console.error("사용자 정보 호출 실패:", {
          status: response.status,
          statusText: response.statusText,
          response: errorText.substring(0, 200),
        });
        throw new Error(`사용자 정보 호출 실패: ${response.status} ${response.statusText}`);
      }
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      // 사용자 정보 없음 (회원가입 미완료)인 경우는 정상적인 흐름
      if (error?.message?.includes("사용자 정보 없음")) {
        console.log("사용자 정보 없음 - 회원가입 플로우로 이동 예정");
        throw error;
      }
      
      // 실제 에러인 경우만 에러 로그 출력
      console.error("사용자 정보 불러오기 오류", error);
      // JSON 파싱 에러인 경우 더 자세한 정보 제공
      if (error instanceof SyntaxError && error.message.includes("JSON")) {
        console.error("JSON 파싱 오류 - 서버가 HTML이나 다른 형식을 반환했을 수 있습니다.");
      }
      // 타임아웃 에러인 경우
      if (error.name === 'AbortError') {
        console.error("사용자 정보 요청 시간 초과");
      }
      // 에러를 다시 던져서 호출하는 쪽에서 처리할 수 있도록 함
      throw error;
    }
  }, []);

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
      hasFetchedUserInfo.current = false;
      
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

      // 백엔드 응답 로그 출력
      console.log("백엔드 토큰 응답:", {
        accessToken: tokens.accessToken ? "있음" : "없음",
        refreshToken: tokens.refreshToken ? "있음" : "없음",
        newUser: tokens.newUser,
        newUserType: typeof tokens.newUser,
        allKeys: Object.keys(tokens || {}),
        fullResponse: tokens,
      });

      await AsyncStorage.setItem("@auth/accessToken", tokens.accessToken);

      if (tokens.refreshToken) {
        await AsyncStorage.setItem("@auth/refreshToken", tokens.refreshToken);
      }

      updateSignupData({
        kakaoId:
          tokens.kakaoId ??
          tokens.kakao_id ??
          tokens.userId ??
          tokens.user_id ??
          "",
        email: tokens.email ?? "",
      });

      // newUser 값 확인
      // 다양한 형식의 newUser 값 체크
      const newUserValue = tokens.newUser ?? tokens.isNewUser ?? tokens.is_new_user;
      let isNewUser = 
        newUserValue === true || 
        newUserValue === "true" || 
        newUserValue === 1 ||
        String(newUserValue).toLowerCase() === "true";
      
      // 사용자 정보 요청을 먼저 시도하고, 실패하면 회원가입 플로우로 이동
      let userInfoFetchFailed = false;
      try {
        await fetchUserInfo(tokens.accessToken);
        console.log("사용자 정보 가져오기 성공");
      } catch (err: any) {
        // 사용자 정보 요청이 실패하면 (status: -500 등) 회원가입 미완료로 간주
        const errorMessage = err?.message || String(err || "");
        
        // 사용자 정보 없음은 정상적인 경우 (회원가입 미완료)
        if (
          errorMessage.includes("사용자 정보 없음") ||
          errorMessage.includes("500") || 
          errorMessage.includes("-500") || 
          errorMessage.includes("status") ||
          errorMessage.includes("호출 실패")
        ) {
          console.log("사용자 정보 없음 - 회원가입 플로우로 이동");
          userInfoFetchFailed = true;
          isNewUser = true; // 회원가입 플로우로 강제 이동
        } else {
          // 실제 에러인 경우만 에러 로그 출력
          console.error("사용자 정보 가져오기 실패:", {
            message: err?.message,
            error: err,
          });
        }
      }
      
      console.log("회원가입 플로우 결정:", {
        tokensNewUser: tokens.newUser,
        tokensIsNewUser: tokens.isNewUser,
        newUserValue: newUserValue,
        newUserType: typeof newUserValue,
        isNewUser: isNewUser,
        userInfoFetchFailed: userInfoFetchFailed,
        navigateTo: isNewUser ? "signupBasic" : "main",
        allTokenKeys: Object.keys(tokens || {}),
      });
      
      // 네비게이션은 한 번만 실행
      const targetScreen = isNewUser ? "signupBasic" : "main";
      console.log("최종 네비게이션:", targetScreen);
      console.log("onNavigate 함수 타입:", typeof onNavigate);
      
      // 로딩 상태를 먼저 해제한 후 네비게이션
      setIsLoading(false);
      
      // 약간의 지연을 두고 네비게이션 (상태 업데이트가 완료되도록)
      setTimeout(() => {
        console.log("네비게이션 실행:", targetScreen);
        onNavigate(targetScreen);
      }, 100);
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
  }, [exchangeKakaoToken, fetchUserInfo, onNavigate, updateSignupData]);

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
});

export default SignupLoginScreen;
