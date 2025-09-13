import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MainScreen from "./components/MainScreen";

/**
 * 최상위 루트 컴포넌트
 * SafeAreaProvider로 앱을 감싸 SafeArea 값을 하위 컴포넌트에 제공
 */
const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <MainScreen />
    </SafeAreaProvider>
  );
};

export default App;
