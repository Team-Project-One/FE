import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { ButtonViewProps } from "../types";
import { COLORS, SIZES } from "../constants";

/**
 * 앱 전체에서 사용되는 버튼 컴포넌트
 * Pressable 기반으로 '누르다 취소' 기능 지원
 */
const ButtonView: React.FC<ButtonViewProps> = ({
  title,
  onPress,
  buttonStyle,
  textStyle,
}) => (
  <Pressable
    // 버튼이 눌렸을 때(pressed) 투명도를 0.5로 변경하여 시각적 피드백
    style={({ pressed }) => [
      styles.button,
      buttonStyle,
      { opacity: pressed ? 0.5 : 1 },
    ]}
    onPress={onPress}
  >
    <Text style={[styles.buttonText, textStyle]}>{title}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.buttonPaddingVertical,
    paddingHorizontal: SIZES.buttonPaddingHorizontal,
    borderRadius: SIZES.borderRadius,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: SIZES.fontSizeLarge,
    fontWeight: "bold",
  },
});

export default ButtonView;
