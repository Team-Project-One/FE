import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, ViewStyle } from "react-native";
import AlertSvg from "../../assets/alert.svg";

export interface ErrorBannerProps {
  message: string;
  visible: boolean;
  top: number;
  autoHideMs?: number;
  onHidden?: () => void;
  containerStyle?: ViewStyle | ViewStyle[];
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({
  message,
  visible,
  top,
  autoHideMs = 3000,
  onHidden,
  containerStyle,
}) => {
  const anim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible) {
      Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        Animated.timing(anim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onHidden && onHidden();
        });
      }, autoHideMs);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
      Animated.timing(anim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible, autoHideMs, onHidden]);

  if (!visible && anim.__getValue?.() === 0) return null;

  return (
    <Animated.View
      style={[
        styles.errorBanner,
        {
          top,
          opacity: anim,
          transform: [
            {
              translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-50, 0] }),
            },
          ],
        },
        containerStyle,
      ]}
    >
      <AlertSvg width={20} height={20} style={{ marginRight: 8 }} />
      <Text style={styles.errorBannerText}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  errorBanner: {
    position: "absolute",
    left: 16,
    right: 16,
    height: 54,
    backgroundColor: "#FEE2E2",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1.35,
    borderColor: "#FECACA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    zIndex: 1000,
  },
  errorBannerText: {
    color: "#FB2C36",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default ErrorBanner;


