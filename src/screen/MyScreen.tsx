import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import ButtonView from "../components/ButtonView";
import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";
import { MyScreenProps } from "../types";
import { handleButtonPress } from "../utils";

/**
 * 마이스크린 컴포넌트
 * 사용자 프로필 정보와 설정 옵션을 표시
 */
const MyScreen: React.FC<MyScreenProps> = ({ onNavigate }) => {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {/* 헤더 영역 */}
      <AppHeader title="로고" />

      {/* 메인 콘텐츠 영역 */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* 프로필 사진 */}
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImage}>
            <Text style={styles.profileImageText}>사진</Text>
          </View>
        </View>

        {/* 사용자 정보 */}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>이름 (나이)</Text>
          <Text style={styles.userDetails}>직업 • 거주지역</Text>
        </View>

        {/* 띠, MBTI 정보 */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailBox}>
            <Text style={styles.detailText}>띠</Text>
          </View>
          <View style={styles.detailBox}>
            <Text style={styles.detailText}>MBTI</Text>
          </View>
        </View>

        {/* 액션 버튼들 */}
        <View style={styles.actionButtons}>
          <ButtonView
            title="프로필 설정"
            onPress={() => handleButtonPress("프로필 설정")}
            buttonStyle={styles.actionButton}
            textStyle={styles.actionButtonText}
          />
          <ButtonView
            title="로그아웃"
            onPress={() => handleButtonPress("로그아웃")}
            buttonStyle={styles.actionButton}
            textStyle={styles.actionButtonText}
          />
        </View>
      </ScrollView>

      {/* 하단 네비게이션 */}
      <BottomNavigation onNavigate={onNavigate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
  },
  profileImageContainer: {
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImageText: {
    fontSize: 16,
    color: "#666666",
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 30,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
  },
  userDetails: {
    fontSize: 16,
    color: "#666666",
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 40,
  },
  detailBox: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  detailText: {
    fontSize: 16,
    color: "#333333",
  },
  actionButtons: {
    width: "100%",
    gap: 15,
  },
  actionButton: {
    backgroundColor: "#F5F5F5",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "100%",
  },
  actionButtonText: {
    color: "#333333",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  bottomNav: {
    height: 60,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  navButton: {
    backgroundColor: "transparent",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  navButtonText: {
    color: "#666666",
    fontSize: 14,
  },
});

export default MyScreen;
