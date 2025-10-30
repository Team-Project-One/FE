import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import FemaleIcon from "../../assets/female.svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { BaseScreenProps } from "../types";
import BottomNavigation from "../components/BottomNavigation";

interface ChatScreenProps extends BaseScreenProps {}

interface ChatData {
  id: string;
  name: string;
  age: number;
  lastMessage: string;
  time: string;
  unreadCount: number;
}

const mockChats: ChatData[] = [
  {
    id: "1",
    name: "지은",
    age: 26,
    lastMessage: "안녕하세요! 반가워요😊",
    time: "오후 3:20",
    unreadCount: 2,
  },
  {
    id: "2",
    name: "민준",
    age: 28,
    lastMessage: "오늘 저녁 어때요?",
    time: "오후 2:15",
    unreadCount: 0,
  },
  {
    id: "3",
    name: "서연",
    age: 25,
    lastMessage: "네 좋아요!",
    time: "오전 11:30",
    unreadCount: 1,
  },
];

const ChatScreen: React.FC<ChatScreenProps> = ({ onNavigate }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>채팅</Text>
      </View>

      {/* Chat List */}
      <ScrollView
        contentContainerStyle={styles.chatList}
        showsVerticalScrollIndicator={true}
      >
        {mockChats.map((chat) => (
          <TouchableOpacity
            key={chat.id}
            style={styles.chatItem}
            onPress={() =>
              onNavigate("chatDetail", {
                chatName: chat.name,
                chatAge: chat.age,
              })
            }
          >
            {/* Profile Image */}
            <View style={styles.profileImageContainer}>
              <View style={styles.profileImagePlaceholder}>
                <FemaleIcon width={28} height={28} />
              </View>
            </View>

            {/* Chat Info */}
            <View style={styles.chatInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.chatName}>
                  {chat.name}({chat.age})
                </Text>
              </View>
              <Text style={styles.lastMessage}>{chat.lastMessage}</Text>
            </View>

            {/* Time and Unread */}
            <View style={styles.rightSection}>
              <Text style={styles.chatTime}>{chat.time}</Text>
              {chat.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadBadgeText}>{chat.unreadCount}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={{ paddingBottom: insets.bottom }}>
        <BottomNavigation onNavigate={onNavigate} currentScreen={"chat"} />
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
    paddingHorizontal: 24,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
  },
  chatList: {
    flexGrow: 1,
  },
  chatItem: {
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  profileImageContainer: {
    marginRight: 16,
  },
  profileImagePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
  },
  profileEmoji: {
    fontSize: 32,
  },
  chatInfo: {
    flex: 1,
    justifyContent: "center",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  lastMessage: {
    fontSize: 14,
    color: "#6B7280",
  },
  rightSection: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  chatTime: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  unreadBadge: {
    backgroundColor: "#EC4899",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

export default ChatScreen;
