import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import BackIcon from "../../assets/back.svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { BaseScreenProps } from "../types";

const PrivacyScreen: React.FC<BaseScreenProps> = ({ onNavigate }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          onPress={() => onNavigate("settings")}
          style={styles.backButton}
        >
          <BackIcon width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>개인정보 처리방침</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>1. 수집하는 개인정보 항목</Text>
        <Text style={styles.paragraph}>
          서비스 제공을 위해 최소한의 개인정보(이름, 연락처 등)를 수집합니다.
        </Text>

        <Text style={styles.sectionTitle}>2. 개인정보의 이용 목적</Text>
        <Text style={styles.paragraph}>
          회원관리, 서비스 제공 및 개선, 고객문의 대응, 법적 의무 이행을 위해
          사용됩니다.
        </Text>

        <Text style={styles.sectionTitle}>3. 보유 및 이용기간</Text>
        <Text style={styles.paragraph}>
          관련 법령에 따른 보관기간 동안 또는 회원 탈퇴 시까지 보관 후
          파기합니다.
        </Text>

        <Text style={styles.sectionTitle}>4. 제3자 제공 및 위탁</Text>
        <Text style={styles.paragraph}>
          법령에 근거하거나 이용자의 동의가 있는 경우에 한하여 제3자에게
          제공/위탁합니다.
        </Text>

        <Text style={styles.sectionTitle}>5. 개인정보 보호를 위한 조치</Text>
        <Text style={styles.paragraph}>
          암호화, 접근통제, 보안점검 등 안전성 확보를 위한 기술적/관리적 조치를
          적용합니다.
        </Text>

        <Text style={styles.sectionTitle}>부칙</Text>
        <Text style={styles.paragraph}>
          본 방침은 게시한 날로부터 시행합니다.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
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
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#1F2937" },
  placeholder: { width: 32 },
  content: { paddingHorizontal: 16, paddingBottom: 24 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: { fontSize: 14, color: "#374151", lineHeight: 22 },
});

export default PrivacyScreen;
