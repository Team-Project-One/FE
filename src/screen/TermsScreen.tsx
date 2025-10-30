import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { BaseScreenProps } from "../types";
import BackIcon from "../../assets/back.svg";

const TermsScreen: React.FC<BaseScreenProps> = ({ onNavigate }) => {
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
        <Text style={styles.headerTitle}>이용약관</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>제1조 (목적)</Text>
        <Text style={styles.paragraph}>
          본 약관은 서비스를 이용함에 있어 회사와 이용자 사이의 권리, 의무 및
          책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
        </Text>
        <Text style={styles.sectionTitle}>제2조 (정의)</Text>
        <Text style={styles.paragraph}>
          1. “서비스”란 회사가 제공하는 모바일 애플리케이션 및 관련 제반
          서비스를 의미합니다.{"\n"}
          2. “이용자”란 본 약관에 동의하고 서비스를 이용하는 회원 및 비회원을
          말합니다.
        </Text>
        <Text style={styles.sectionTitle}>제3조 (약관의 게시와 개정)</Text>
        <Text style={styles.paragraph}>
          회사는 관련 법령을 준수하며 약관을 개정할 수 있습니다. 개정 시에는
          적용일자 및 개정사유를 명시하여 서비스 내 공지사항에 최소 7일 전
          게시합니다.
        </Text>
        <Text style={styles.sectionTitle}>제4조 (이용자의 의무)</Text>
        <Text style={styles.paragraph}>
          이용자는 관계법령, 약관, 서비스 이용안내 및 공지사항 등을 준수하여야
          하며, 서비스의 안정적 운영을 저해하는 행위를 하여서는 안 됩니다.
        </Text>
        <Text style={styles.sectionTitle}>제5조 (서비스의 제공 및 변경)</Text>
        <Text style={styles.paragraph}>
          회사는 안정적인 서비스 제공을 위해 최선을 다하며, 운영상·기술상의
          필요에 따라 서비스의 내용을 변경할 수 있습니다.
        </Text>
        <Text style={styles.sectionTitle}>제6조 (면책)</Text>
        <Text style={styles.paragraph}>
          천재지변, 불가항력, 이용자의 귀책사유로 인한 서비스 장애에 대하여
          회사는 책임을 지지 않습니다.
        </Text>
        <Text style={styles.sectionTitle}>부칙</Text>
        <Text style={styles.paragraph}>
          본 약관은 게시한 날로부터 시행합니다.
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

export default TermsScreen;
