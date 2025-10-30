import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import BackIcon from "../../assets/back.svg";
import FemaleIcon from "../../assets/female.svg";
import LightIcon from "../../assets/light.svg";
import LocationIcon from "../../assets/location.svg";
import SendIcon from "../../assets/send.svg";
import FixIcon from "../../assets/fix.svg";
import ExitIcon from "../../assets/exit.svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { BaseScreenProps } from "../types";
import { LinearGradient } from "expo-linear-gradient";

interface ChatDetailScreenProps extends BaseScreenProps {
  chatName?: string;
  chatAge?: number;
}

const mockMessages = [
  { id: "1", text: "안녕하세요!", time: "오후 3:15", isMe: false },
  { id: "2", text: "반가워요😊", time: "오후 3:20", isMe: false },
];

const ChatDetailScreen: React.FC<ChatDetailScreenProps> = ({
  onNavigate,
  chatName = "지은",
  chatAge = 26,
}) => {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState("");
  const [showIceBreaking, setShowIceBreaking] = useState(false);
  const [showDateCourse, setShowDateCourse] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const iceBreakingTopics = [
    { icon: "☁️", text: "요즘 가장 관심있는 취미는 무엇인가요?" },
    { icon: "🎵", text: "좋아하는 음악 장르나 아티스트는?" },
    { icon: "✈️", text: "가장 가보고 싶은 여행지는?" },
    { icon: "🍕", text: "제일 좋아하는 음식은 무엇인가요?" },
  ];

  const dateCourses = [
    { icon: "📍", text: "한강 공원 - 저녁 산책과 야경 감상" },
    { icon: "🎬", text: "CGV 강남 - 영화 관람 후 카페 투어" },
    { icon: "🍽️", text: "이태원 맛집 거리 - 다양한 음식 체험" },
    { icon: "🎨", text: "삼청동 갤러리 투어 - 예술적인 데이트" },
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="dark" />
      {/* Header */}
      <View style={[styles.header, { marginTop: insets.top }]}>
        <TouchableOpacity
          onPress={() => onNavigate("chat")}
          style={styles.backButton}
        >
          <BackIcon width={24} height={24} />
        </TouchableOpacity>
        <View style={styles.profileInfoHeader}>
          <View style={styles.profileImageSmall}>
            <FemaleIcon width={20} height={20} />
          </View>
          <Text style={styles.headerName}>
            {chatName}({chatAge})
          </Text>
        </View>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setShowMenu(!showMenu)}
        >
          <Text style={styles.menuIcon}>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {mockMessages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageBubble,
              msg.isMe ? styles.myMessage : styles.theirMessage,
            ]}
          >
            <Text
              style={msg.isMe ? styles.myMessageText : styles.theirMessageText}
            >
              {msg.text}
            </Text>
            <Text style={styles.messageTime}>{msg.time}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Input Area */}
      <View
        style={[styles.inputContainer, { paddingBottom: insets.bottom + 8 }]}
      >
        <View style={styles.suggestionButtons}>
          <TouchableOpacity
            style={styles.suggestionButton}
            onPress={() => setShowIceBreaking(true)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#FCE7F3", "#FFE4E6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.suggestionGradient}
            >
              <LightIcon width={16} height={16} />
              <Text style={styles.suggestionText}>아이스브레이킹 주제</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.suggestionButton}
            onPress={() => setShowDateCourse(true)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#FCE7F3", "#FFE4E6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.suggestionGradient}
            >
              <LocationIcon width={16} height={16} />
              <Text style={styles.suggestionText}>데이트 코스 추천</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.messageInputContainer}>
          <TextInput
            style={styles.messageInput}
            value={message}
            onChangeText={setMessage}
            placeholder="메시지를 입력하세요"
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity style={styles.sendButton}>
            <LinearGradient
              colors={["#F54144", "#EC4899"]}
              style={styles.sendButtonGradient}
            >
              <SendIcon width={20} height={20} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* Dropdown Menu */}
      {showMenu && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setShowMenu(false);
              // 채팅창 상단 고정 기능 구현
            }}
          >
            <FixIcon width={20} height={20} />
            <Text style={styles.menuItemText}>채팅창 상단 고정</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setShowMenu(false);
              // 채팅방 나가기 기능 구현
            }}
          >
            <ExitIcon width={20} height={20} />
            <Text style={[styles.menuItemText, styles.exitText]}>
              채팅방 나가기
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Date Course Modal */}
      {showDateCourse && (
        <View style={styles.modalOverlay}>
          <View style={styles.dateCourseModal}>
            <Text style={styles.dateCourseTitle}>데이트 코스 추천</Text>
            <View style={styles.coursesList}>
              {dateCourses.map((course, index) => (
                <View key={index} style={styles.courseItem}>
                  <Text style={styles.courseIcon}>{course.icon}</Text>
                  <Text style={styles.courseText}>{course.text}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => setShowDateCourse(false)}
            >
              <LinearGradient
                colors={["#F54144", "#EC4899"]}
                style={styles.confirmButtonGradient}
              >
                <Text style={styles.confirmButtonText}>확인</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Ice Breaking Modal */}
      {showIceBreaking && (
        <View style={styles.modalOverlay}>
          <View style={styles.iceBreakingModal}>
            <Text style={styles.iceBreakingTitle}>
              아이스브레이킹 주제 추천
            </Text>
            <View style={styles.topicsList}>
              {iceBreakingTopics.map((topic, index) => (
                <View key={index} style={styles.topicItem}>
                  <Text style={styles.topicIcon}>{topic.icon}</Text>
                  <Text style={styles.topicText}>{topic.text}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => setShowIceBreaking(false)}
            >
              <LinearGradient
                colors={["#F54144", "#EC4899"]}
                style={styles.confirmButtonGradient}
              >
                <Text style={styles.confirmButtonText}>확인</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
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
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonImage: {
    width: 24,
    height: 24,
  },
  profileInfoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  profileImageSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
  },
  profileAvatar: {
    width: 20,
    height: 20,
  },
  headerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  menuButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  menuIcon: {
    fontSize: 20,
    color: "#1F2937",
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    flexGrow: 1,
  },
  messageBubble: {
    maxWidth: "70%",
    marginBottom: 12,
  },
  myMessage: {
    alignSelf: "flex-end",
  },
  theirMessage: {
    alignSelf: "flex-start",
  },
  myMessageText: {
    backgroundColor: "#F54144",
    color: "#FFFFFF",
    padding: 12,
    borderRadius: 16,
    fontSize: 14,
  },
  theirMessageText: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.35,
    borderColor: "#E5E7EB",
    color: "#1F2937",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    fontSize: 14,
  },
  messageTime: {
    fontSize: 10,
    color: "#9CA3AF",
    marginTop: 4,
    textAlign: "left",
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1.35,
    borderTopColor: "#0000001A",
  },
  suggestionButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  suggestionButton: {
    flex: 1,
    minWidth: 0,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  suggestionGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 8,
  },
  suggestionIcon: {
    fontSize: 14,
  },
  suggestionIconImage: {
    width: 16,
    height: 16,
  },
  suggestionText: {
    fontSize: 12,
    color: "#C6005C",
    fontWeight: "500",
  },
  messageInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  messageInput: {
    backgroundColor: "#FFFFFF",
    flex: 1,
    minHeight: 50.64382553100586,
    paddingTop: 12,
    paddingRight: 16,
    paddingBottom: 12,
    paddingLeft: 16,
    borderWidth: 1.35,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    fontSize: 14,
  },
  sendButton: {
    width: 50.64382553100586,
    height: 50.64382553100586,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1.35,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  sendButtonGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  sendIcon: {
    width: 20,
    height: 20,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  dateCourseModal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  dateCourseTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 20,
    textAlign: "center",
  },
  coursesList: {
    marginBottom: 20,
  },
  courseItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    gap: 8,
  },
  courseIcon: {
    fontSize: 20,
  },
  courseText: {
    flex: 1,
    fontSize: 14,
    color: "#1F2937",
  },
  iceBreakingModal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  iceBreakingTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 20,
    textAlign: "center",
  },
  topicsList: {
    marginBottom: 20,
  },
  topicItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF0F5",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    gap: 8,
  },
  topicIcon: {
    fontSize: 20,
  },
  topicText: {
    flex: 1,
    fontSize: 14,
    color: "#1F2937",
  },
  confirmButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  confirmButtonGradient: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  dropdownMenu: {
    position: "absolute",
    top: 80,
    right: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 180,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  menuItemIcon: {
    width: 20,
    height: 20,
  },
  menuItemText: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "500",
  },
  exitText: {
    color: "#EF4444",
  },
});

export default ChatDetailScreen;
