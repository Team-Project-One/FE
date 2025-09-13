import React, { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SignupLandingScreen from "./screen/SignupLandingScreen";
import SignupBasicScreen from "./screen/SignupBasicScreen";
import SignupDetailedScreen from "./screen/SignupDetailedScreen";
import MainScreen from "./screen/MainScreen";
import MyScreen from "./screen/MyScreen";
import MatchingResultScreen from "./screen/MatchingResultScreen";
import { Screen, NavigationHandler } from "./types";

/**
 * 최상위 루트 컴포넌트
 * SafeAreaProvider로 앱을 감싸 SafeArea 값을 하위 컴포넌트에 제공
 */
const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("signupLanding");

  const handleNavigation: NavigationHandler = (screen) => {
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "signupLanding":
        return <SignupLandingScreen onNavigate={handleNavigation} />;
      case "signupBasic":
        return <SignupBasicScreen onNavigate={handleNavigation} />;
      case "signupDetailed":
        return <SignupDetailedScreen onNavigate={handleNavigation} />;
      case "home":
        return <MainScreen onNavigate={handleNavigation} />;
      case "mypage":
        return <MyScreen onNavigate={handleNavigation} />;
      case "matchingResult":
        return <MatchingResultScreen onNavigate={handleNavigation} />;
      default:
        return <SignupLandingScreen onNavigate={handleNavigation} />;
    }
  };

  return <SafeAreaProvider>{renderScreen()}</SafeAreaProvider>;
};

export default App;
