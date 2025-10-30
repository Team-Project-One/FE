import React, { useEffect, useState } from "react";
import "./theme/global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Text, TextInput } from "react-native";
import {
  useFonts,
  Arimo_400Regular,
  Arimo_700Bold,
} from "@expo-google-fonts/arimo";
import MainScreen from "./screen/MainScreen";
import SignupLandingScreen from "./screen/SignupLandingScreen";
import SignupLoginScreen from "./screen/SignupLoginScreen";
import SignupBasicScreen from "./screen/SignupBasicScreen";
import SignupDetailedScreen from "./screen/SignupDetailedScreen";
import SignupSelfIntroScreen from "./screen/SignupSelfIntroScreen";
import SignupProfileScreen from "./screen/SignupProfileScreen";
import MyScreen from "./screen/MyScreen";
import ChatScreen from "./screen/ChatScreen";
import ChatDetailScreen from "./screen/ChatDetailScreen";
import MatchingResultScreen from "./screen/MatchingResultScreen";
import SettingsScreen from "./screen/SettingsScreen";
import ProfileEditScreen from "./screen/ProfileEditScreen";
import TermsScreen from "./screen/TermsScreen";
import PrivacyScreen from "./screen/PrivacyScreen";
import { Screen, NavigationHandler } from "./types";

interface AppState {
  currentScreen: Screen;
  chatDetailName?: string;
  chatDetailAge?: number;
}

/**
 * 최상위 루트 컴포넌트
 * SafeAreaProvider로 앱을 감싸 SafeArea 값을 하위 컴포넌트에 제공
 */
const App: React.FC = () => {
  const [fontsLoaded] = useFonts({ Arimo_400Regular, Arimo_700Bold });
  const [appState, setAppState] = useState<AppState>({
    currentScreen: "signupLanding",
  });

  useEffect(() => {
    if (fontsLoaded) {
      // 전역 기본 글꼴 설정
      // 이미 기본값이 있는 경우 보존 후 덮어쓰기
      Text.defaultProps = Text.defaultProps || {};
      Text.defaultProps.style = [
        Text.defaultProps.style,
        { fontFamily: "Arimo_400Regular" },
      ];

      TextInput.defaultProps = TextInput.defaultProps || {};
      TextInput.defaultProps.style = [
        TextInput.defaultProps.style,
        { fontFamily: "Arimo_400Regular" },
      ];
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const handleNavigation: NavigationHandler = (screen, extraData?: any) => {
    if (screen === "chatDetail" && extraData) {
      setAppState({
        currentScreen: "chatDetail",
        chatDetailName: extraData.chatName,
        chatDetailAge: extraData.chatAge,
      });
    } else {
      setAppState({ currentScreen: screen });
    }
  };

  const renderScreen = () => {
    switch (appState.currentScreen) {
      case "signupLanding":
        return <SignupLandingScreen onNavigate={handleNavigation} />;
      case "signupLogin":
        return <SignupLoginScreen onNavigate={handleNavigation} />;
      case "signupBasic":
        return <SignupBasicScreen onNavigate={handleNavigation} />;
      case "signupDetailed":
        return <SignupDetailedScreen onNavigate={handleNavigation} />;
      case "signupSelfIntro":
        return <SignupSelfIntroScreen onNavigate={handleNavigation} />;
      case "signupProfile":
        return <SignupProfileScreen onNavigate={handleNavigation} />;
      case "home":
      case "main":
        return <MainScreen onNavigate={handleNavigation} />;
      case "mypage":
        return <MyScreen onNavigate={handleNavigation} />;
      case "chat":
        return <ChatScreen onNavigate={handleNavigation} />;
      case "chatDetail":
        return (
          <ChatDetailScreen
            onNavigate={handleNavigation}
            chatName={appState.chatDetailName}
            chatAge={appState.chatDetailAge}
          />
        );
      case "matchingResult":
        return <MatchingResultScreen onNavigate={handleNavigation} />;
      case "settings":
        return <SettingsScreen onNavigate={handleNavigation} />;
      case "profileEdit":
        return <ProfileEditScreen onNavigate={handleNavigation} />;
      case "terms":
        return <TermsScreen onNavigate={handleNavigation} />;
      case "privacy":
        return <PrivacyScreen onNavigate={handleNavigation} />;
      default:
        return <SignupLandingScreen onNavigate={handleNavigation} />;
    }
  };

  return <SafeAreaProvider>{renderScreen()}</SafeAreaProvider>;
};

export default App;
