import React, { useMemo } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomNavigationProps, Screen } from "../types";
import ChatIcon from "../../assets/bottomChat.svg";
import HomeIcon from "../../assets/bottomHome.svg";
import MyIcon from "../../assets/bottomMy.svg";

/**
 * 하단 네비게이션 컴포넌트
 * 앱의 주요 화면으로 이동할 수 있는 하단 네비게이션 바
 */
const BottomNavigation: React.FC<BottomNavigationProps> = ({
  onNavigate,
  currentScreen,
}) => {
  const insets = useSafeAreaInsets();
  const activeTab = useMemo(() => {
    if (currentScreen === "chat") return "chat";
    if (currentScreen === "mypage") return "mypage";
    return "main";
  }, [currentScreen]);

  const handleNavigation = (screen: Screen, tabName: string) => {
    onNavigate(screen);
  };

  return (
    <View style={[styles.bottomNav, { paddingBottom: insets.bottom + 8 }]}>
      <TouchableOpacity
        style={[
          styles.navButton,
          activeTab === "chat" && styles.navButtonActive,
        ]}
        onPress={() => handleNavigation("chat", "chat")}
      >
        <ChatIcon width={24} height={24} />
        <Text
          style={[
            styles.navButtonText,
            activeTab === "chat" && styles.navButtonTextActive,
          ]}
        >
          채팅
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.navButton,
          activeTab === "main" && styles.navButtonActive,
        ]}
        onPress={() => handleNavigation("main", "main")}
      >
        <HomeIcon width={24} height={24} />
        <Text
          style={[
            styles.navButtonText,
            activeTab === "main" && styles.navButtonTextActive,
          ]}
        >
          홈
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.navButton,
          activeTab === "mypage" && styles.navButtonActive,
        ]}
        onPress={() => handleNavigation("mypage", "mypage")}
      >
        <MyIcon width={24} height={24} />
        <Text
          style={[
            styles.navButtonText,
            activeTab === "mypage" && styles.navButtonTextActive,
          ]}
        >
          마이페이지
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    height: 60,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 8,
  },
  navButton: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  navButtonActive: {
    opacity: 1,
  },
  navButtonIcon: {
    width: 24,
    height: 24,
  },
  navButtonText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  navButtonTextActive: {
    color: "#EC4899",
    fontWeight: "600",
  },
});

export default BottomNavigation;
