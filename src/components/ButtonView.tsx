import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
} from "react-native";
import ChatIcon from "../../assets/chat.svg";
import RematchIcon from "../../assets/rematch.svg";
import { LinearGradient } from "expo-linear-gradient";

export interface GradientButtonProps {
  title: string;
  onPress: () => void;
  icon?: string;
  variant?: "gradient" | "outline";
  disabled?: boolean;
  buttonStyle?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
}

/**
 * 그라데이션 버튼 공용 컴포넌트
 * variant: "gradient" (기본) - 핑크-마젠타 그라데이션
 * variant: "outline" - 흰색 배경, 핑크 테두리
 */
const ButtonView: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  icon,
  variant = "gradient",
  disabled = false,
  buttonStyle,
  textStyle,
}) => {
  if (variant === "outline") {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
        style={[
          styles.outlineButton,
          disabled && styles.disabledButton,
          buttonStyle,
        ]}
      >
        <View style={styles.buttonContent}>
          {icon &&
            (icon === "chatting" ? (
              <ChatIcon width={20} height={20} />
            ) : icon === "rematching" ? (
              <RematchIcon width={20} height={20} />
            ) : (
              <Text style={styles.outlineIcon}>{icon}</Text>
            ))}
          <Text
            style={[
              styles.outlineText,
              disabled && styles.disabledText,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.9}
      style={[styles.gradientButton, buttonStyle]}
    >
      <LinearGradient
        colors={disabled ? ["#D1D5DB", "#D1D5DB"] : ["#F54144", "#EC4899"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <View style={styles.buttonContent}>
          {icon &&
            (icon === "chatting" ? (
              <ChatIcon width={20} height={20} />
            ) : icon === "rematching" ? (
              <RematchIcon width={20} height={20} />
            ) : (
              <Text style={styles.icon}>{icon}</Text>
            ))}
          <Text style={[styles.buttonText, textStyle]}>{title}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gradientButton: {
    borderRadius: 16,
    overflow: "hidden",
  },
  gradient: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  iconImage: {
    width: 20,
    height: 20,
  },
  outlineButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: "#F54144",
  },
  outlineText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#F54144",
  },
  outlineIconImage: {
    width: 20,
    height: 20,
  },
  disabledButton: {
    borderColor: "#D1D5DB",
  },
  disabledText: {
    color: "#D1D5DB",
  },
});

export default ButtonView;
