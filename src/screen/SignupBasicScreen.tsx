import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import ButtonView from "../components/ButtonView";
import { SignupBasicScreenProps, SignupBasicFormData } from "../types";
import AlertSvg from "../../assets/alert.svg";
import BackwardSvg from "../../assets/back.svg";
import MaleSvg from "../../assets/male.svg";
import FemaleSvg from "../../assets/femaleIcon.svg";

/**
 * 기본 정보 입력 화면 (1/4단계)
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
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [showErrorBanner, setShowErrorBanner] = useState(false);
  const [progressAnimation] = useState(new Animated.Value(0));
  const [errorBannerAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(progressAnimation, {
      toValue: 0.25,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, []);

  const handleInputChange = (
    field: keyof SignupBasicFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as string])
      setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const formatBirthDate = (text: string) => {
    const numbers = text.replace(/[^0-9]/g, "");
    if (numbers.length <= 4) return numbers;
    if (numbers.length <= 6)
      return `${numbers.slice(0, 4)}-${numbers.slice(4)}`;
    return `${numbers.slice(0, 4)}-${numbers.slice(4, 6)}-${numbers.slice(
      6,
      8
    )}`;
  };

  const handleBirthDateChange = (value: string) => {
    handleInputChange("birthDate", formatBirthDate(value));
  };

  const handleGenderChange = (gender: string) => {
    handleInputChange("gender", formData.gender === gender ? "" : gender);
  };

  const getErrorMessage = () => {
    const missing: string[] = [];
    const invalid: string[] = [];
    if (!formData.name.trim()) missing.push("이름");
    if (!formData.birthDate.trim()) missing.push("생년월일");
    else if (formData.birthDate.replace(/[^0-9]/g, "").length !== 8)
      invalid.push("생년월일");
    if (!formData.gender) missing.push("성별");
    if (invalid.length) return "생년월일을 다시 입력해주세요.";
    if (!missing.length) return "";
    if (missing.length === 1) return `${missing[0]}을 입력해주세요.`;
    if (missing.length === 2)
      return `${missing[0]}과 ${missing[1]}을 입력해주세요.`;
    return `${missing[0]}, ${missing[1]}, ${missing[2]}을 입력해주세요.`;
  };

  const validateForm = () => {
    const next: { [key: string]: boolean } = {};
    if (!formData.name.trim()) next.name = true;
    const b = formData.birthDate.replace(/[^0-9]/g, "");
    if (b.length !== 8) next.birthDate = true;
    if (!formData.gender) next.gender = true;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const showErrorBannerWithAnimation = () => {
    setShowErrorBanner(true);
    Animated.timing(errorBannerAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      Animated.timing(errorBannerAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowErrorBanner(false);
      });
    }, 3000);
  };

  const handleNext = () => {
    if (validateForm()) onNavigate("signupDetailed");
    else showErrorBannerWithAnimation();
  };

  return (
    <LinearGradient
      colors={["#FFFFFF", "#FFFFFF"]}
      locations={[0, 1]}
      style={styles.container}
    >
      <LinearGradient
        colors={[
          "rgba(252, 231, 243, 0.6)",
          "rgba(253, 242, 248, 0.4)",
          "rgba(255, 228, 230, 0.6)",
        ]}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <StatusBar style="auto" />

        {showErrorBanner && (
          <Animated.View
            style={[
              styles.errorBanner,
              {
                top: insets.top + 15.99,
                opacity: errorBannerAnimation,
                transform: [
                  {
                    translateY: errorBannerAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-50, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <AlertSvg width={20} height={20} style={{ marginRight: 8 }} />
            <Text style={styles.errorBannerText}>{getErrorMessage()}</Text>
          </Animated.View>
        )}

        <View style={[styles.progressHeader, { paddingTop: insets.top + 20 }]}>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressBarFill,
                  {
                    width: progressAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0%", "100%"],
                    }),
                  },
                ]}
              >
                <LinearGradient
                  colors={["#EC4899", "#F43F5E"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.progressGradient}
                />
              </Animated.View>
            </View>
          </View>

          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => onNavigate("signupLogin")}
            >
              <BackwardSvg width={24} height={24} />
            </TouchableOpacity>
            <Text style={styles.stepText}>1/4단계</Text>
            <View style={styles.placeholder} />
          </View>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>기본 정보를 입력해주세요!</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>이름</Text>
              <TextInput
                style={[styles.nameInput, errors.name && styles.inputError]}
                value={formData.name}
                onChangeText={(v) => handleInputChange("name", v)}
                placeholder="이름을 입력하세요"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>생년월일</Text>
              <TextInput
                style={[
                  styles.birthDateInput,
                  errors.birthDate && styles.inputError,
                ]}
                value={formData.birthDate}
                onChangeText={handleBirthDateChange}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={10}
              />
              <Text style={styles.descriptionText}>
                정확한 사주 분석을 위해 필요합니다.
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>성별</Text>
              <View style={styles.genderContainer}>
                <TouchableOpacity
                  onPress={() => handleGenderChange("남성")}
                  style={[
                    styles.genderButton,
                    formData.gender === "남성" &&
                      styles.genderButtonSelectedMale,
                    errors.gender &&
                      formData.gender !== "남성" &&
                      styles.genderButtonError,
                  ]}
                >
                  <View style={styles.genderButtonContent}>
                    <MaleSvg
                      width={20}
                      height={20}
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      style={[
                        styles.genderButtonText,
                        formData.gender === "남성" &&
                          styles.genderButtonTextSelectedMale,
                      ]}
                    >
                      남성
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleGenderChange("여성")}
                  style={[
                    styles.genderButton,
                    formData.gender === "여성" &&
                      styles.genderButtonSelectedFemale,
                    errors.gender &&
                      formData.gender !== "여성" &&
                      styles.genderButtonError,
                  ]}
                >
                  <View style={styles.genderButtonContent}>
                    <FemaleSvg
                      width={20}
                      height={20}
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      style={[
                        styles.genderButtonText,
                        formData.gender === "여성" &&
                          styles.genderButtonTextSelectedFemale,
                      ]}
                    >
                      여성
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        <View
          style={[
            styles.buttonContainer,
            { paddingBottom: insets.bottom + 20 },
          ]}
        >
          <LinearGradient
            colors={["#EC4899", "#F43F5E"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <ButtonView
              title="다음"
              onPress={handleNext}
              buttonStyle={styles.nextButton}
              textStyle={styles.nextButtonText}
            />
          </LinearGradient>
        </View>

        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimerText}>
            입력하신 정보는 매칭을 위해서만 사용됩니다.
          </Text>
        </View>
        <View style={styles.bottomSpacing} />
      </LinearGradient>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  errorBanner: {
    position: "absolute",
    left: 16,
    right: 16,
    height: 54,
    backgroundColor: "#FEE2E2",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1.35,
    borderColor: "#FECACA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    zIndex: 1000,
  },
  errorBannerText: {
    color: "#FB2C36",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  progressHeader: { paddingHorizontal: 20, paddingBottom: 20 },
  progressBarContainer: { marginBottom: 15 },
  progressBar: {
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: { height: "100%", borderRadius: 2 },
  progressGradient: { flex: 1, borderRadius: 2 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  stepText: { fontSize: 16, fontWeight: "500", color: "#333333" },
  placeholder: { width: 40 },
  titleContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
  },
  content: { flexGrow: 1, padding: 20 },
  formContainer: { gap: 30 },
  inputGroup: { gap: 12 },
  label: { fontSize: 18, fontWeight: "600", color: "#333333", marginBottom: 4 },
  nameInput: {
    borderTopWidth: 1.35,
    borderTopColor: "#9CA3AF",
    borderWidth: 1.35,
    borderColor: "#9CA3AF",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 18,
    backgroundColor: "#FFFFFF",
    width: "100%",
    height: 60,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  birthDateInput: {
    borderTopWidth: 1.35,
    borderTopColor: "#9CA3AF",
    borderWidth: 1.35,
    borderColor: "#9CA3AF",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 18,
    backgroundColor: "#FFFFFF",
    width: "100%",
    height: 60,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputError: { borderWidth: 1.35, borderColor: "#FB2C36" },
  descriptionText: { fontSize: 12, color: "#6B7280" },
  genderContainer: { flexDirection: "row", gap: 10 },
  genderButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1.35,
    borderTopColor: "#9CA3AF",
    borderWidth: 1.35,
    borderColor: "#9CA3AF",
    padding: 18,
    borderRadius: 10,
    width: 166,
    height: 60,
  },
  genderButtonSelectedMale: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1.35,
    borderColor: "#3B82F6",
  },
  genderButtonSelectedFemale: {
    backgroundColor: "#FDF2F8",
    borderWidth: 1.35,
    borderColor: "#EC4899",
  },
  genderButtonError: { borderWidth: 1.35, borderColor: "#FB2C36" },
  genderButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  genderButtonText: { color: "#666666" },
  genderButtonTextSelectedMale: { color: "#3B82F6", fontWeight: "500" },
  genderButtonTextSelectedFemale: { color: "#EC4899", fontWeight: "500" },
  buttonContainer: { paddingHorizontal: 20 },
  gradientButton: {
    width: 346,
    height: 64,
    borderRadius: 14,
    overflow: "hidden",
    alignSelf: "center",
  },
  nextButton: {
    backgroundColor: "transparent",
    paddingVertical: 0,
    paddingHorizontal: 20,
    borderRadius: 14,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  bottomSpacing: { height: 40 },
  disclaimerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
  },
  disclaimerText: { fontSize: 12, color: "#6B7280", textAlign: "center" },
});

export default SignupBasicScreen;
