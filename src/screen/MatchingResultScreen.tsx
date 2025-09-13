import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import ButtonView from "../components/ButtonView";
import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";
import { MatchingResultScreenProps } from "../types";
import { handleButtonPress } from "../utils";

/**
 * 매칭 결과 스크린 컴포넌트
 * 매칭된 상대의 정보와 액션 버튼들을 표시
 */
const MatchingResultScreen: React.FC<MatchingResultScreenProps> = ({
  onNavigate,
}) => {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {/* 헤더 영역 */}
      <AppHeader title="로고" />

      {/* 메인 콘텐츠 영역 */}
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileCard}>
          {/* 프로필 섹션 */}
          <View style={styles.profileSection}>
            <View style={styles.profileImageContainer}>
              <View style={styles.profileImage}>
                <Text style={styles.profileImageText}>사진</Text>
              </View>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>이름 (나이)</Text>
              <Text style={styles.userDetails}>직업 • 거주지역</Text>
              <Text style={styles.scoreText}>Original Score</Text>
              <Text style={styles.scoreText}>Final Score</Text>
              <Text style={styles.scoreText}>Stress Score</Text>
            </View>
          </View>

          {/* 상세 정보 박스들 */}
          <View style={styles.detailsSection}>
            <View style={styles.detailsRow}>
              <View style={styles.detailBox}>
                <Text style={styles.detailText}>MBTI</Text>
              </View>
              <View style={styles.detailBox}>
                <Text style={styles.detailText}>주량</Text>
              </View>
            </View>

            <View style={styles.wideDetailBox}>
              <Text style={styles.detailText}>취미</Text>
            </View>

            <View style={styles.wideDetailBox}>
              <Text style={styles.detailText}>자기소개</Text>
            </View>
          </View>
        </View>

        {/* 액션 버튼들 */}
        <View style={styles.actionButtons}>
          <ButtonView
            title="친구 요청 보내기"
            onPress={() => handleButtonPress("친구 요청 보내기")}
            buttonStyle={styles.actionButton}
            textStyle={styles.actionButtonText}
          />
          <ButtonView
            title="다시 매칭하기"
            onPress={() => handleButtonPress("다시 매칭하기")}
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
  },
  profileCard: {
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  profileSection: {
    flexDirection: "row",
    marginBottom: 20,
  },
  profileImageContainer: {
    marginRight: 15,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImageText: {
    fontSize: 14,
    color: "#666666",
  },
  profileInfo: {
    flex: 1,
    justifyContent: "center",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 5,
  },
  userDetails: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 12,
    color: "#888888",
    marginBottom: 2,
  },
  detailsSection: {
    gap: 10,
  },
  detailsRow: {
    flexDirection: "row",
    gap: 10,
  },
  detailBox: {
    flex: 1,
    backgroundColor: "#E0E0E0",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  wideDetailBox: {
    backgroundColor: "#E0E0E0",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  detailText: {
    fontSize: 14,
    color: "#333333",
  },
  actionButtons: {
    gap: 15,
  },
  actionButton: {
    backgroundColor: "#E0E0E0",
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
});

export default MatchingResultScreen;
