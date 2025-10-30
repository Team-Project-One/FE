import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Text as SvgText } from "react-native-svg";
import ButtonView from "../components/ButtonView";
import { SignupSelfIntroScreenProps } from "../types";
import BackwardSvg from "../assets/backward.svg";

const MAX_LEN = 500;

/**
 * 그라데이션 텍스트 컴포넌트 (건너뛰기 버튼용)
 */
const GradientText: React.FC<{ text: string; width: number; height: number; fontSize: number }>
  = ({ text, width, height, fontSize }) => {
  return (
    <Svg width={width} height={height}>
      <Defs>
        <SvgLinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#F6339A" />
          <Stop offset="100%" stopColor="#FF2056" />
        </SvgLinearGradient>
      </Defs>
      <SvgText
        fill="url(#grad)"
        fontSize={fontSize}
        fontWeight="700"
        x={width / 2}
        y={height * 0.72}
        textAnchor="middle"
      >{text}</SvgText>
    </Svg>
  );
};

/**
 * 자기소개 입력 화면 (3/4단계)
 * 사용자의 자기소개를 작성할 수 있으며, 건너뛰기 옵션도 제공합니다.
 */
const SignupSelfIntroScreen: React.FC<SignupSelfIntroScreenProps> = ({ onNavigate }) => {
  const insets = useSafeAreaInsets();
  const [bio, setBio] = useState("");
  const [progressAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(progressAnimation, {
      toValue: 0.75,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, []);

  const handleNext = () => {
    onNavigate("signupProfile");
  };

  return (
    <LinearGradient colors={["#FFFFFF", "#FFFFFF"]} locations={[0, 1]} style={styles.container}>
      <LinearGradient
        colors={["rgba(252, 231, 243, 0.6)", "rgba(253, 242, 248, 0.4)", "rgba(255, 228, 230, 0.6)"]}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <StatusBar style="auto" />

        <View style={[styles.progressHeader, { paddingTop: insets.top + 20 }]}>          
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <Animated.View 
                style={{
                  height: "100%",
                  width: progressAnimation.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
                }}
              >
                <LinearGradient colors={["#EC4899", "#F43F5E"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.progressGradient} />
              </Animated.View>
            </View>
          </View>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={() => onNavigate("signupDetailed")}>              
              <BackwardSvg width={24} height={24} />
            </TouchableOpacity>
            <Text style={styles.stepText}>3/4단계</Text>
            <View style={styles.placeholder} />
          </View>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>자기소개를 작성해주세요!</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>자기소개</Text>
              <TextInput
                style={styles.bioInput}
                value={bio}
                onChangeText={(t) => { if (t.length <= MAX_LEN) setBio(t); }}
                placeholder="취미, 관심사, 이상형, 좋아하거나 싫어하는 음식 등을 자유롭게 작성해주세요."
                placeholderTextColor="#999"
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                scrollEnabled
                maxLength={MAX_LEN}
              />
              <Text style={styles.counterText}>{`${bio.length}/${MAX_LEN}`}</Text>
            </View>

            <View style={styles.tipsBox}>
              <Text style={styles.tipsTitle}>자기소개 팁</Text>
              <View style={styles.tipItem}><Text style={styles.tipText}>· 자신의 성격과 취미를 간단히 소개해보세요</Text></View>
              <View style={styles.tipItem}><Text style={styles.tipText}>· 이상형이나 원하는 관계에 대해 언급하세요</Text></View>
              <View style={styles.tipItem}><Text style={styles.tipText}>· 진솔하고 긍정적인 내용이 좋은 인상을 줍니다</Text></View>
              <View style={styles.tipItem}><Text style={styles.tipText}>· 너무 길지 않게 핵심만 담아주세요</Text></View>
            </View>
          </View>
        </ScrollView>

        <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + 20 }]}>          
          <LinearGradient colors={["#EC4899", "#F43F5E"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientButton}>
            <ButtonView title="다음" onPress={handleNext} buttonStyle={styles.nextButton} textStyle={styles.nextButtonText} />
          </LinearGradient>

          <TouchableOpacity style={styles.skipButton} activeOpacity={0.8} onPress={() => onNavigate("signupProfile")}>
            <GradientText text="건너뛰기" width={300} height={26} fontSize={16} />
          </TouchableOpacity>
        </View>

        <View style={styles.disclaimerContainer}><Text style={styles.disclaimerText}>추후 마이페이지에서 변경할 수 있습니다.</Text></View>
        <View style={styles.bottomSpacing} />
      </LinearGradient>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  progressHeader: { paddingHorizontal: 20, paddingBottom: 20 },
  progressBarContainer: { marginBottom: 15 },
  progressBar: { height: 4, backgroundColor: "#E0E0E0", borderRadius: 2, overflow: "hidden" },
  progressGradient: { flex: 1, borderRadius: 2 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backButton: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
  stepText: { fontSize: 16, fontWeight: "500", color: "#333333" },
  placeholder: { width: 40 },
  titleContainer: { paddingHorizontal: 20, paddingBottom: 20, alignItems: "center" },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#333333", textAlign: "center" },
  content: { flexGrow: 1, padding: 20 },
  formContainer: { gap: 20 },
  inputGroup: { gap: 8 },
  label: { fontSize: 16, fontWeight: "500", color: "#333333" },
  bioInput: {
    borderWidth: 1.35,
    borderTopWidth: 1.35,
    borderColor: "#9CA3AF",
    borderTopColor: "#9CA3AF",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
    minHeight: 5 * 20 + 24,
  },
  counterText: { alignSelf: "flex-end", color: "#666666", fontSize: 12 },
  tipsBox: { backgroundColor: "#FDF2F8", padding: 16, borderRadius: 12, borderWidth: 1, borderColor: "#FCE7F3" },
  tipsTitle: { fontSize: 14, fontWeight: "700", color: "#6B7280", marginBottom: 8 },
  tipItem: { marginTop: 4 },
  tipText: { fontSize: 13, color: "#6B7280" },
  buttonContainer: { paddingHorizontal: 20, gap: 12 },
  gradientButton: { 
    width: 346,
    height: 64,
    borderRadius: 14,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  nextButton: { 
    backgroundColor: "transparent", 
    paddingVertical: 0, 
    paddingHorizontal: 20, 
    borderRadius: 14, 
    width: "100%",
    height: "100%",
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold", textAlign: "center" },
  skipButton: {
    width: 346,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 0,
    borderWidth: 1.35,
    borderColor: "#F6339A",
    borderTopWidth: 1.35,
    alignSelf: 'center',
  },
  disclaimerContainer: { paddingHorizontal: 20, paddingVertical: 10, alignItems: "center" },
  disclaimerText: { fontSize: 12, color: "#6B7280", textAlign: "center" },
  bottomSpacing: { height: 40 },
});

export default SignupSelfIntroScreen;


