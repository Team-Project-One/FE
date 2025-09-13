import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import ButtonView from "../components/ButtonView";
import { SignupBasicScreenProps, SignupBasicFormData } from "../types";
import { COLORS, SIZES, SPACING, LAYOUT } from "../constants";

/**
 * 회원가입 기본 정보 입력 스크린 컴포넌트
 * 이름, 생년월일, 성별을 입력받음
 */
const SignupBasicScreen: React.FC<SignupBasicScreenProps> = ({
  onNavigate,
}) => {
  const insets = useSafeAreaInsets();
  const [formData, setFormData] = useState<SignupBasicFormData>({
    name: "",
    birthDate: "",
    gender: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    console.log("기본 정보:", formData);
    onNavigate("signupDetailed");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {/* 헤더 영역 */}
      <View style={[styles.header, { paddingTop: insets.top + 80 }]}>
        <Text style={styles.headerTitle}>기본 정보를 입력해주세요!</Text>
      </View>

      {/* 폼 콘텐츠 */}
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.formContainer}>
          {/* 이름 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>이름</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(value) => handleInputChange("name", value)}
              placeholder="이름을 입력하세요"
              placeholderTextColor="#999"
            />
          </View>

          {/* 생년월일 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>생년월일</Text>
            <TextInput
              style={styles.input}
              value={formData.birthDate}
              onChangeText={(value) => handleInputChange("birthDate", value)}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#999"
            />
            <Text style={styles.descriptionText}>
              정확한 사주 분석을 위해 필요합니다.
            </Text>
          </View>

          {/* 성별 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>성별</Text>
            <View style={styles.genderContainer}>
              <ButtonView
                title="남성"
                onPress={() => handleInputChange("gender", "남성")}
                buttonStyle={[
                  styles.genderButton,
                  ...(formData.gender === "남성"
                    ? [styles.genderButtonSelected]
                    : []),
                ]}
                textStyle={[
                  styles.genderButtonText,
                  ...(formData.gender === "남성"
                    ? [styles.genderButtonTextSelected]
                    : []),
                ]}
              />
              <ButtonView
                title="여성"
                onPress={() => handleInputChange("gender", "여성")}
                buttonStyle={[
                  styles.genderButton,
                  ...(formData.gender === "여성"
                    ? [styles.genderButtonSelected]
                    : []),
                ]}
                textStyle={[
                  styles.genderButtonText,
                  ...(formData.gender === "여성"
                    ? [styles.genderButtonTextSelected]
                    : []),
                ]}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 다음 버튼 */}
      <View
        style={[styles.buttonContainer, { paddingBottom: insets.bottom + 20 }]}
      >
        <ButtonView
          title="다음"
          onPress={handleNext}
          buttonStyle={styles.nextButton}
          textStyle={styles.nextButtonText}
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
    paddingBottom: 20,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
  },
  content: {
    flexGrow: 1,
    padding: 20,
  },
  formContainer: {
    gap: 25,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
  },
  descriptionText: {
    fontSize: 12,
    color: "#666666",
    marginTop: 4,
  },
  genderContainer: {
    flexDirection: "row",
    gap: 10,
  },
  genderButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  genderButtonSelected: {
    backgroundColor: "#E0E0E0",
    borderColor: "#999",
  },
  genderButtonText: {
    color: "#666666",
    fontSize: 16,
    textAlign: "center",
  },
  genderButtonTextSelected: {
    color: "#333333",
    fontWeight: "500",
  },
  buttonContainer: {
    paddingHorizontal: 20,
  },
  nextButton: {
    backgroundColor: "#E0E0E0",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "100%",
  },
  nextButtonText: {
    color: "#333333",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default SignupBasicScreen;
