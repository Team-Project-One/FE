import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import BackIcon from "../../assets/back.svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { SettingsScreenProps } from "../types";

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onNavigate }) => {
  const insets = useSafeAreaInsets();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={[styles.header, { marginTop: insets.top }]}>
        <TouchableOpacity
          onPress={() => onNavigate("mypage")}
          style={styles.backButton}
        >
          <BackIcon width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>설정</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Settings Content */}
      <ScrollView
        contentContainerStyle={[
          styles.settingsContainer,
          { paddingBottom: insets.bottom + 24 },
        ]}
      >
        {/* 알림 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>알림</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>푸시 알림</Text>
              <Text style={styles.settingDescription}>
                새로운 메시지 및 매칭 알림
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.toggle, pushNotifications && styles.toggleActive]}
              onPress={() => setPushNotifications(!pushNotifications)}
            >
              <View
                style={[
                  styles.toggleThumb,
                  pushNotifications && styles.toggleThumbActive,
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* 표시 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>표시</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>다크 모드</Text>
              <Text style={styles.settingDescription}>어두운 테마 사용</Text>
            </View>
            <TouchableOpacity
              style={[styles.toggle, darkMode && styles.toggleActive]}
              onPress={() => setDarkMode(!darkMode)}
            >
              <View
                style={[
                  styles.toggleThumb,
                  darkMode && styles.toggleThumbActive,
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* 계정 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>계정</Text>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => onNavigate("terms")}
          >
            <Text style={styles.settingLabel}>이용 약관</Text>
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => onNavigate("privacy")}
          >
            <Text style={styles.settingLabel}>개인정보 처리방침</Text>
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>버전 정보</Text>
            <Text style={styles.versionText}>v1.0.0</Text>
          </View>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={[styles.settingLabel, styles.dangerText]}>
              계정 탈퇴
            </Text>
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  backButtonImage: { width: 24, height: 24 },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
  },
  placeholder: {
    width: 32,
  },
  settingsContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "500",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: "#6B7280",
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#E5E7EB",
    padding: 2,
    justifyContent: "center",
  },
  toggleActive: {
    backgroundColor: "#EC4899",
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    position: "absolute",
    left: 2,
  },
  toggleThumbActive: {
    left: 22,
  },
  arrowIcon: {
    fontSize: 20,
    color: "#9CA3AF",
  },
  versionText: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  dangerText: {
    color: "#F54144",
  },
});

export default SettingsScreen;
