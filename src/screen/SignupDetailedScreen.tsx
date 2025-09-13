import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import ButtonView from "../components/ButtonView";
import { SignupDetailedScreenProps, SignupDetailedFormData } from "../types";
import { COLORS, SIZES, SPACING, LAYOUT } from "../constants";

/**
 * 회원가입 상세 정보 입력 스크린 컴포넌트
 * 음주빈도, 흡연여부, 키, 반려동물, 종교, 자녀계획, MBTI를 입력받음
 */
const SignupDetailedScreen: React.FC<SignupDetailedScreenProps> = ({
  onNavigate,
}) => {
  const insets = useSafeAreaInsets();
  const [formData, setFormData] = useState<SignupDetailedFormData>({
    drinkingFrequency: "",
    smokingStatus: "",
    height: "",
    pets: "",
    religion: "",
    childrenPlan: "",
    mbti: "",
  });

  const handleSelection = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleComplete = () => {
    console.log("상세 정보:", formData);
    onNavigate("home"); // 회원가입 완료 후 메인으로 이동
  };

  const renderSelectionButtons = (
    options: string[],
    field: string,
    selectedValue: string,
    columns: number = 2
  ) => {
    const rows = [];
    for (let i = 0; i < options.length; i += columns) {
      const rowOptions = options.slice(i, i + columns);
      rows.push(
        <View key={i} style={styles.buttonRow}>
          {rowOptions.map((option) => (
            <ButtonView
              key={option}
              title={option}
              onPress={() => handleSelection(field, option)}
              buttonStyle={[
                styles.selectionButton,
                ...(selectedValue === option
                  ? [styles.selectionButtonSelected]
                  : []),
              ]}
              textStyle={[
                styles.selectionButtonText,
                ...(selectedValue === option
                  ? [styles.selectionButtonTextSelected]
                  : []),
              ]}
            />
          ))}
          {/* 빈 공간 채우기 */}
          {rowOptions.length < columns &&
            Array.from({ length: columns - rowOptions.length }).map(
              (_, index) => (
                <View key={`empty-${index}`} style={styles.selectionButton} />
              )
            )}
        </View>
      );
    }
    return rows;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {/* 헤더 영역 */}
      <View style={[styles.header, { paddingTop: insets.top + 80 }]}>
        <Text style={styles.headerTitle}>상세 정보를 입력해주세요!</Text>
      </View>

      {/* 폼 콘텐츠 */}
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.formContainer}>
          {/* 음주빈도 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>음주빈도</Text>
            {renderSelectionButtons(
              ["안 마심", "가끔 마심", "적당히 마심", "자주 마심"],
              "drinkingFrequency",
              formData.drinkingFrequency,
              2
            )}
          </View>

          {/* 흡연여부 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>흡연여부</Text>
            <View style={styles.buttonRow}>
              {["비흡연", "가끔 흡연", "흡연"].map((option) => (
                <ButtonView
                  key={option}
                  title={option}
                  onPress={() => handleSelection("smokingStatus", option)}
                  buttonStyle={[
                    styles.selectionButton,
                    ...(formData.smokingStatus === option
                      ? [styles.selectionButtonSelected]
                      : []),
                  ]}
                  textStyle={[
                    styles.selectionButtonText,
                    ...(formData.smokingStatus === option
                      ? [styles.selectionButtonTextSelected]
                      : []),
                  ]}
                />
              ))}
            </View>
          </View>

          {/* 키 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>키</Text>
            <TextInput
              style={styles.input}
              value={formData.height}
              onChangeText={(value) => handleInputChange("height", value)}
              placeholder="키를 입력하세요 (cm)"
              placeholderTextColor="#999"
            />
          </View>

          {/* 반려동물 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>반려동물</Text>
            {renderSelectionButtons(
              ["없음", "강아지", "고양이", "기타"],
              "pets",
              formData.pets,
              2
            )}
          </View>

          {/* 종교 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>종교</Text>
            {renderSelectionButtons(
              ["무교", "불교", "기독교", "천주교", "기타"],
              "religion",
              formData.religion,
              2
            )}
          </View>

          {/* 자녀계획 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>자녀계획</Text>
            <View style={styles.buttonRow}>
              {["원함", "상관없음", "원하지 않음"].map((option) => (
                <ButtonView
                  key={option}
                  title={option}
                  onPress={() => handleSelection("childrenPlan", option)}
                  buttonStyle={[
                    styles.selectionButton,
                    ...(formData.childrenPlan === option
                      ? [styles.selectionButtonSelected]
                      : []),
                  ]}
                  textStyle={[
                    styles.selectionButtonText,
                    ...(formData.childrenPlan === option
                      ? [styles.selectionButtonTextSelected]
                      : []),
                  ]}
                />
              ))}
            </View>
          </View>

          {/* MBTI */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>MBTI</Text>
            <TextInput
              style={styles.input}
              value={formData.mbti}
              onChangeText={(value) => handleInputChange("mbti", value)}
              placeholder="MBTI를 입력하세요"
              placeholderTextColor="#999"
            />
          </View>
        </View>
      </ScrollView>

      {/* 완료 버튼 */}
      <View
        style={[styles.buttonContainer, { paddingBottom: insets.bottom + 20 }]}
      >
        <ButtonView
          title="완료"
          onPress={handleComplete}
          buttonStyle={styles.completeButton}
          textStyle={styles.completeButtonText}
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
    gap: 12,
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
  buttonRow: {
    flexDirection: "row",
    gap: 8,
  },
  selectionButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    minHeight: 44,
  },
  selectionButtonSelected: {
    backgroundColor: "#E0E0E0",
    borderColor: "#999",
  },
  selectionButtonText: {
    color: "#666666",
    fontSize: 14,
    textAlign: "center",
  },
  selectionButtonTextSelected: {
    color: "#333333",
    fontWeight: "500",
  },
  buttonContainer: {
    paddingHorizontal: 20,
  },
  completeButton: {
    backgroundColor: "#E0E0E0",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "100%",
  },
  completeButtonText: {
    color: "#333333",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default SignupDetailedScreen;
