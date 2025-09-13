import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ButtonView from "./ButtonView";
import { BottomNavigationProps } from "../types";
import { COLORS, SIZES, SPACING, LAYOUT } from "../constants";

/**
 * 하단 네비게이션 컴포넌트
 * 앱의 주요 화면으로 이동할 수 있는 하단 네비게이션 바
 */
const BottomNavigation: React.FC<BottomNavigationProps> = ({ onNavigate }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bottomNav,
        { paddingBottom: insets.bottom + LAYOUT.safeAreaBottom },
      ]}
    >
      <ButtonView
        title="친구"
        onPress={() => onNavigate("friends")}
        buttonStyle={styles.navButton}
        textStyle={styles.navButtonText}
      />
      <ButtonView
        title="홈"
        onPress={() => onNavigate("home")}
        buttonStyle={styles.navButton}
        textStyle={styles.navButtonText}
      />
      <ButtonView
        title="마이페이지"
        onPress={() => onNavigate("mypage")}
        buttonStyle={styles.navButton}
        textStyle={styles.navButtonText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    height: SIZES.bottomNavHeight,
    flexDirection: "row",
    backgroundColor: COLORS.lightGray,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  navButton: {
    flex: 1,
    backgroundColor: "transparent",
    paddingVertical: SPACING.small,
    paddingHorizontal: SPACING.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  navButtonText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.fontSizeMedium,
  },
});

export default BottomNavigation;
