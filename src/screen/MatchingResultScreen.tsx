import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import BackIcon from "../../assets/back.svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MatchingResultScreenProps } from "../types";
import BottomNavigation from "../components/BottomNavigation";
import ButtonView from "../components/ButtonView";

// 샘플 매칭 데이터
const mockMatchData = {
  name: "지은",
  age: 26,
  gender: "female",
  job: "디자이너",
  location: "강남구",
  originalScore: 85.123,
  finalScore: 92.456,
  stressScore: 23.789,
  mbti: "ENFP",
  drinking: "가끔 마심",
  pets: "고양이",
  profileImage:
    "https://images.unsplash.com/photo-1708000609854-72c89a2fb689?crop=entropy&cs=tinysrgb&fit=max&fm=jpg",
  selfIntroduction:
    "안녕하세요! 따뜻한 사람과 진솔한 대화를 나누며 함께 성장하는 관계를 원합니다. 영화와 카페 투어를 좋아하고, 주말에는 요리하는 것을 즐겨요.",
};

const MatchingResultScreen: React.FC<MatchingResultScreenProps> = ({
  onNavigate,
}) => {
  const insets = useSafeAreaInsets();
  const profile = mockMatchData;
  const genderIcon = profile.gender === "male" ? "♂" : "♀";
  const genderColor = profile.gender === "male" ? "#3B82F6" : "#F54144";

  const handleChat = () => {
    onNavigate("chatDetail", { chatName: "지은", chatAge: 26 });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          onPress={() => onNavigate("main")}
          style={styles.backButton}
        >
          <BackIcon width={24} height={24} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>운명의 상대를 찾았어요!</Text>
          <Text style={styles.headerSubtitle}>사주팔자 기반 완벽 매칭</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card - Pink */}
        <View style={styles.profileCard}>
          <View style={styles.profileSection}>
            <View style={styles.profileImageContainer}>
              {profile.profileImage ? (
                <Image
                  source={{ uri: profile.profileImage }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <Text style={styles.profileEmoji}>👤</Text>
                </View>
              )}
            </View>

            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>
                  {profile.name}({profile.age}){" "}
                </Text>
                <Text style={[styles.genderIcon, { color: genderColor }]}>
                  {genderIcon}
                </Text>
              </View>
              <Text style={styles.userDetails}>
                {profile.job} • {profile.location}
              </Text>

              {/* Scores */}
              <View style={styles.scoresContainer}>
                <View style={styles.scoreRow}>
                  <Text style={styles.scoreLabel}>Original Score</Text>
                  <Text style={styles.scoreValueRed}>
                    {profile.originalScore.toFixed(3)}
                  </Text>
                </View>
                <View style={styles.scoreRow}>
                  <Text style={styles.scoreLabel}>Final Score</Text>
                  <Text style={styles.scoreValueRed}>
                    {profile.finalScore.toFixed(3)}
                  </Text>
                </View>
                <View style={styles.scoreRow}>
                  <Text style={styles.scoreLabel}>Stress Score</Text>
                  <Text style={styles.scoreValueGreen}>
                    {profile.stressScore.toFixed(3)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* MBTI Section - White */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>MBTI</Text>
          <View style={styles.mbtiTag}>
            <Text style={styles.mbtiText}>{profile.mbti}</Text>
          </View>
        </View>

        {/* Self Introduction Section - White */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>자기소개</Text>
          <Text style={styles.introText}>{profile.selfIntroduction}</Text>
        </View>

        {/* Other Info Section - White */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>기타 정보</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>음주</Text>
            <Text style={styles.infoValue}>{profile.drinking}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>반려동물</Text>
            <Text style={styles.infoValue}>{profile.pets}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <ButtonView title="채팅하기" icon="chatting" onPress={handleChat} />
          <View style={styles.buttonSpacing} />
          <ButtonView
            title="다시 매칭하기"
            icon="rematching"
            variant="outline"
            onPress={() => onNavigate("main")}
          />
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={{ paddingBottom: insets.bottom }}>
        <BottomNavigation onNavigate={onNavigate} currentScreen={"main"} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  backButton: {
    width: 32,
    height: 32,
  },
  backButtonImage: {
    width: 24,
    height: 24,
  },
  headerTextContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 120,
    paddingTop: 20,
  },
  profileCard: {
    backgroundColor: "#FDF2F8",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  profileSection: {
    flexDirection: "row",
  },
  profileImageContainer: {
    marginRight: 16,
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  profileImagePlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  profileEmoji: {
    fontSize: 48,
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
  },
  genderIcon: {
    fontSize: 20,
  },
  userDetails: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 12,
  },
  scoresContainer: {
    gap: 4,
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  scoreLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  scoreValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1F2937",
  },
  scoreValueRed: {
    fontSize: 12,
    fontWeight: "600",
    color: "#EF4444",
  },
  scoreValueGreen: {
    fontSize: 12,
    fontWeight: "600",
    color: "#10B981",
  },
  sectionCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
  },
  mbtiTag: {
    backgroundColor: "#FFF0F5",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
  },
  mbtiText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
  },
  introText: {
    fontSize: 14,
    color: "#1F2937",
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    color: "#1F2937",
  },
  buttonContainer: {
    marginTop: 8,
  },
  buttonSpacing: {
    height: 12,
  },
});

export default MatchingResultScreen;
