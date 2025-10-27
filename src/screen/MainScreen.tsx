import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import ButtonView from "../components/ButtonView";
import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";
import { MainScreenProps } from "../types";
import { COLORS, SIZES, SPACING, LAYOUT } from "../constants";

/**
 * 앱의 메인 화면을 구성하는 컴포넌트
 * 헤더, 콘텐츠, 푸터 및 매칭 버튼을 포함
 */
const MainScreen: React.FC<MainScreenProps> = ({ onNavigate }) => {
  // 디바이스의 Safe Area(노치, 하단 바 등) 크기를 가져와 UI가 가려지지 않도록 함
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {/* 헤더 영역 */}
      <AppHeader title="로고" />

      {/* 콘텐츠 영역 */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.scrollableText}>
          메인 페이지입니다. 여기에 메인 콘텐츠가 들어갑니다.
        </Text>
      </ScrollView>

      {/* 매칭하기 버튼 */}
      <View style={[styles.buttonContainer, { bottom: insets.bottom + 120 }]}>
        <ButtonView
          title="매칭하기"
          onPress={() => onNavigate("matchingResult")}
          buttonStyle={styles.matchingButton}
          textStyle={styles.matchingButtonText}
        />
      </View>

      {/* 하단 네비게이션 */}
      <BottomNavigation onNavigate={onNavigate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.contentPadding,
  },
  scrollableText: {
    textAlign: "center",
    fontSize: SIZES.fontSizeXLarge,
    color: COLORS.text,
    lineHeight: 28,
    marginBottom: SPACING.headerPadding,
  },
  buttonContainer: {
    position: "absolute",
    alignSelf: "center",
  },
  matchingButton: {
    width: SIZES.buttonWidth,
    height: SIZES.buttonHeight,
    borderRadius: SIZES.borderRadiusLarge,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: LAYOUT.shadowOffset,
    shadowOpacity: LAYOUT.shadowOpacity,
    shadowRadius: LAYOUT.shadowRadius,
    elevation: LAYOUT.elevation,
  },
  matchingButtonText: {
    fontSize: SIZES.fontSizeXXLarge,
  },
});

export default MainScreen;
