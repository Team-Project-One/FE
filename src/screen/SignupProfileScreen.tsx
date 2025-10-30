import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Animated,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import ButtonView from "../components/ButtonView";
import { SignupProfileScreenProps } from "../types";
import BackwardSvg from "../../assets/back.svg";
import ProfileSvg from "../../assets/profile.svg";

/**
 * 프로필 사진 등록 화면 (4/4단계)
 * 프로필 사진을 업로드하고 가입을 완료합니다. 가입 완료 시 성공 모달을 표시합니다.
 */
const SignupProfileScreen: React.FC<SignupProfileScreenProps> = ({
  onNavigate,
}) => {
  const insets = useSafeAreaInsets();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalAnimation] = useState(new Animated.Value(0));
  const [progressAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(progressAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, []);

  // 갤러리에서 프로필 사진 선택
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("사진 접근 권한이 필요합니다.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  };

  // 성공 모달 애니메이션 제어
  useEffect(() => {
    if (showSuccessModal) {
      Animated.spring(modalAnimation, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(modalAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [showSuccessModal]);

  // 가입 완료 처리 및 성공 모달 표시
  const handleComplete = () => {
    setShowSuccessModal(true);
  };

  const handleStart = () => {
    setShowSuccessModal(false);
    onNavigate("home");
  };

  const handleBack = () => {
    onNavigate("signupSelfIntro");
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
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <BackwardSvg width={24} height={24} />
            </TouchableOpacity>
            <Text style={styles.stepText}>4/4단계</Text>
            <View style={styles.placeholder} />
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>프로필 사진을 등록해주세요!</Text>
            <Text style={styles.subtitle}>
              매력적인 사진으로 좋은 인상을 남겨보세요
            </Text>
          </View>

          <View style={styles.profileContainer}>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={pickImage}
              activeOpacity={0.8}
            >
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              ) : (
                <ProfileSvg width={200} height={200} />
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.noteText}>
            프로필 사진은 추후 마이페이지에서 변경할 수 있습니다
          </Text>
        </View>

        <View
          style={[
            styles.buttonContainer,
            { paddingBottom: insets.bottom + 20 },
          ]}
        >
          <ButtonView title="가입 완료" onPress={handleComplete} />
          <TouchableOpacity onPress={() => onNavigate("main")} style={{ alignSelf: "center" }}>
            <Text style={{ color: "#6B7280" }}>메인으로</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipButton}
            activeOpacity={0.8}
            onPress={handleComplete}
          >
            <Text style={styles.skipButtonText}>건너뛰기</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimerText}>
            입력하신 정보는 매칭을 위해서만 사용됩니다.
          </Text>
        </View>
        <Modal
          visible={showSuccessModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowSuccessModal(false)}
        >
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.modalContent,
                {
                  transform: [
                    {
                      scale: modalAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1],
                      }),
                    },
                  ],
                  opacity: modalAnimation,
                },
              ]}
            >
              <Text style={styles.modalTitle}>가입을 축하합니다! 🎉</Text>
              <Text style={styles.modalMessage}>
                운명의 상대를 지금 바로 만나보세요!
              </Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleStart}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#EC4899", "#F43F5E"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.modalButtonGradient}
                >
                  <Text style={styles.modalButtonText}>시작하기</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>
      </LinearGradient>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressHeader: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  progressBarContainer: {
    marginBottom: 15,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 2,
  },
  progressGradient: {
    flex: 1,
    borderRadius: 2,
  },
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
  stepText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 40,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
  },
  profileContainer: {
    marginBottom: 30,
  },
  profileButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  noteText: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    paddingHorizontal: 40,
    lineHeight: 20,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    gap: 12,
    alignSelf: "center",
    width: "100%",
    maxWidth: 480,
  },
  
  skipButton: {
    width: "100%",
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 0,
    borderWidth: 1.35,
    borderColor: "#EC4899",
    alignSelf: "center",
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#EC4899",
  },
  disclaimerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
  },
  disclaimerText: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 32,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  modalButton: {
    width: "100%",
    borderRadius: 8,
    overflow: "hidden",
  },
  modalButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SignupProfileScreen;
