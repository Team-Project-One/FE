import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppHeaderProps } from "../types";
import { COLORS, SIZES, SPACING, LAYOUT } from "../constants";

/**
 * 앱 헤더 컴포넌트
 * 제목을 중앙에 표시하는 공통 헤더
 */
const AppHeader: React.FC<AppHeaderProps> = ({ title }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.header, { paddingTop: insets.top + LAYOUT.safeAreaTop }]}
    >
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.gray,
    paddingHorizontal: SPACING.headerPadding,
    paddingVertical: SPACING.medium,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: SIZES.fontSizeXLarge,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
  },
});

export default AppHeader;
