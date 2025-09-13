import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import ButtonView from "../components/ButtonView";
import { SignupLandingScreenProps } from "../types";

/**
 * 회원가입 랜딩 스크린 컴포넌트
 * 앱 소개와 시작하기 버튼을 표시
 */
const SignupLandingScreen: React.FC<SignupLandingScreenProps> = ({
  onNavigate,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {/* 헤더 영역 */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.logoButton}>
          <Text style={styles.logoText}>로고</Text>
        </View>
      </View>

      {/* 메인 콘텐츠 영역 */}
      <View style={styles.content}>
        <Text style={styles.title}>운명의 상대를 찾아보세요!</Text>
        <Text style={styles.subtitle}>
          사주팔자를 바탕으로{"\n"}
          완벽한 매칭을 경험해보세요
        </Text>

        {/* 설명 placeholder */}
        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionText}>설명</Text>
          <Text style={styles.descriptionSubtext}>
            (이 부분은 뭘 채워야할 지 모르겠음)
          </Text>
        </View>
      </View>

      {/* 시작하기 버튼 */}
      <View
        style={[styles.buttonContainer, { paddingBottom: insets.bottom + 20 }]}
      >
        <ButtonView
          title="시작하기"
          onPress={() => onNavigate("signupBasic")}
          buttonStyle={styles.startButton}
          textStyle={styles.startButtonText}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: "center",
  },
  logoButton: {
    backgroundColor: "#E0E0E0",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  logoText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
  },
  descriptionBox: {
    backgroundColor: "#E0E0E0",
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 40,
  },
  descriptionText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 10,
  },
  descriptionSubtext: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
  },
  buttonContainer: {
    paddingHorizontal: 20,
  },
  startButton: {
    backgroundColor: "#E0E0E0",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: "100%",
  },
  startButtonText: {
    color: "#333333",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default SignupLandingScreen;

