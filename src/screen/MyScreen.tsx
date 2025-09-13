import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import ButtonView from "../components/ButtonView";
import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";
import { MyScreenProps } from "../types";
import { handleButtonPress } from "../utils";
import { COLORS, SIZES, SPACING, LAYOUT } from "../constants";

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
    backgroundColor: COLORS.white,
  },
  content: {
    flexGrow: 1,
    padding: SPACING.contentPadding,
    alignItems: "center",
  },
  profileImageContainer: {
    marginBottom: SPACING.headerPadding,
  },
  profileImage: {
    width: LAYOUT.profileImageSize,
    height: LAYOUT.profileImageSize,
    borderRadius: LAYOUT.profileImageSize / 2,
    backgroundColor: COLORS.gray,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImageText: {
    fontSize: SIZES.fontSizeLarge,
    color: COLORS.textSecondary,
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 30,
  },
  userName: {
    fontSize: SIZES.fontSizeXXLarge,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SPACING.small,
  },
  userDetails: {
    fontSize: SIZES.fontSizeLarge,
    color: COLORS.textSecondary,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 40,
  },
  detailBox: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    paddingVertical: SPACING.medium,
    paddingHorizontal: SPACING.headerPadding,
    borderRadius: SIZES.borderRadiusMedium,
    marginHorizontal: 5,
    alignItems: "center",
  },
  detailText: {
    fontSize: SIZES.fontSizeLarge,
    color: COLORS.text,
  },
  actionButtons: {
    width: "100%",
    gap: SPACING.medium,
  },
  actionButton: {
    backgroundColor: COLORS.lightGray,
    paddingVertical: SPACING.medium,
    paddingHorizontal: SPACING.headerPadding,
    borderRadius: SIZES.borderRadiusMedium,
    width: "100%",
  },
  actionButtonText: {
    color: COLORS.text,
    fontSize: SIZES.fontSizeLarge,
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
