import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Animated, Modal, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import ButtonView from "../components/ButtonView";
import { SignupDetailedScreenProps, SignupDetailedFormData } from "../types";
import AlertSvg from "../assets/alert.svg";
import BackwardSvg from "../assets/backward.svg";

/**
 * 상세 정보 입력 화면 (2/4단계)
 * 직업, 지역, 음주빈도, 흡연여부, 키, 반려동물, 종교, 연락빈도, MBTI를 입력받습니다.
 */
const SignupDetailedScreen: React.FC<SignupDetailedScreenProps> = ({ onNavigate }) => {
  const insets = useSafeAreaInsets();
  const [formData, setFormData] = useState<SignupDetailedFormData>({
    job: "",
    region: "",
    drinkingFrequency: "",
    smokingStatus: "",
    height: "",
    pets: "",
    religion: "",
    contactFrequency: "",
    mbti: "",
  });
  const [progressAnimation] = useState(new Animated.Value(0));
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [showErrorBanner, setShowErrorBanner] = useState(false);
  const [errorBannerAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(progressAnimation, {
      toValue: 0.5,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, []);

  // 선택 버튼 클릭 시 토글 기능 (이미 선택된 값이면 취소)
  const handleSelection = (field: string, value: string) => {
    if (formData[field as keyof SignupDetailedFormData] === value) {
      setFormData((prev) => ({ ...prev, [field]: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 키 입력 시 숫자만 허용
  const handleHeightChange = (value: string) => {
    const numbersOnly = value.replace(/[^0-9]/g, "");
    handleInputChange("height", numbersOnly);
  };

  // 누락된 필드에 따른 에러 메시지 반환
  const getErrorMessage = () => {
    if (!formData.job) return "직업을 선택해주세요.";
    if (!formData.region) return "지역을 선택해주세요.";
    if (!formData.drinkingFrequency) return "음주 빈도를 선택해주세요.";
    if (!formData.smokingStatus) return "흡연 여부를 선택해주세요.";
    if (!formData.height) return "키를 입력해주세요.";
    if (!formData.pets) return "반려동물 여부를 선택해주세요.";
    if (!formData.religion) return "종교를 선택해주세요.";
    if (!formData.contactFrequency) return "연락 빈도를 선택해주세요.";
    if (!formData.mbti) return "MBTI를 선택해주세요.";
    return "";
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

  // 다음 단계로 이동 (모든 필드 검증 완료 후)
  const handleComplete = () => {
    const errorMessage = getErrorMessage();
    if (errorMessage) {
      showErrorBannerWithAnimation();
      return;
    }
    
    onNavigate("signupSelfIntro");
  };

  const mbtiTypes = [
    "INTJ", "INTP", "ENTJ", "ENTP",
    "INFJ", "INFP", "ENFJ", "ENFP",
    "ISTJ", "ISFJ", "ESTJ", "ESFJ",
    "ISTP", "ISFP", "ESTP", "ESFP"
  ];

  const locations = [
    "서울", "경기", "인천", "부산", "대구", "광주", "대전", "울산", "세종",
    "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"
  ];


  return (
    <LinearGradient
      colors={["#FFFFFF", "#FFFFFF"]}
      locations={[0, 1]}
      style={styles.container}
    >
      <LinearGradient
        colors={["rgba(252, 231, 243, 0.6)", "rgba(253, 242, 248, 0.4)", "rgba(255, 228, 230, 0.6)"]}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <StatusBar style="auto" />
        
        {/* 에러 배너 */}
        {showErrorBanner && (
          <Animated.View 
            style={[
              styles.errorBanner, 
              { 
                top: insets.top + 15.99,
                opacity: errorBannerAnimation,
                transform: [{
                  translateY: errorBannerAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-50, 0],
                  })
                }]
              }
            ]}
          >
            <AlertSvg
              width={20}
              height={20}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.errorBannerText}>{getErrorMessage()}</Text>
          </Animated.View>
        )}

        {/* 진행상황 바와 헤더 */}
        <View style={[styles.progressHeader, { paddingTop: insets.top + 20 }]}>
          {/* 진행상황 바 */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <Animated.View 
                style={[
                  styles.progressBarFill,
                  {
                    width: progressAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  }
                ]}
              >
                <LinearGradient
                  colors={['#EC4899', '#F43F5E']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.progressGradient}
                />
              </Animated.View>
            </View>
          </View>
          
          {/* 뒤로가기 버튼과 단계 표시 */}
          <View style={styles.headerRow}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => onNavigate("signupBasic")}
            >
              <BackwardSvg
                width={24}
                height={24}
              />
            </TouchableOpacity>
            <Text style={styles.stepText}>2/4단계</Text>
            <View style={styles.placeholder} />
          </View>
        </View>

        {/* 제목 */}
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>상세 정보를 입력해주세요!</Text>
        </View>

        {/* 폼 콘텐츠 */}
        <ScrollView 
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            {/* 직업 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>직업</Text>
              <View style={styles.jobContainer}>
                <View style={styles.jobRow}>
                  <TouchableOpacity
                    onPress={() => handleSelection("job", "무직")}
                    style={[
                      styles.jobButton,
                      ...(formData.job === "무직"
                        ? [styles.jobButtonSelected]
                        : []),
                    ]}
                  >
                    <Text style={[
                      styles.jobButtonText,
                      ...(formData.job === "무직"
                        ? [styles.jobButtonTextSelected]
                        : []),
                    ]}>무직</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleSelection("job", "학생")}
                    style={[
                      styles.jobButton,
                      ...(formData.job === "학생"
                        ? [styles.jobButtonSelected]
                        : []),
                    ]}
                  >
                    <Text style={[
                      styles.jobButtonText,
                      ...(formData.job === "학생"
                        ? [styles.jobButtonTextSelected]
                        : []),
                    ]}>학생</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.jobRow}>
                  <TouchableOpacity
                    onPress={() => handleSelection("job", "직장인")}
                    style={[
                      styles.jobButton,
                      ...(formData.job === "직장인"
                        ? [styles.jobButtonSelected]
                        : []),
                    ]}
                  >
                    <Text style={[
                      styles.jobButtonText,
                      ...(formData.job === "직장인"
                        ? [styles.jobButtonTextSelected]
                        : []),
                    ]}>직장인</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* 지역 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>지역</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setIsLocationModalVisible(true)}
                activeOpacity={0.8}
              >
                <Text style={formData.region ? styles.inputText : styles.inputPlaceholder}>
                  {formData.region || "지역을 선택하세요"}
                </Text>
              </TouchableOpacity>
              <Modal
                visible={isLocationModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setIsLocationModalVisible(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>지역 선택</Text>
                      <TouchableOpacity 
                        style={styles.modalCloseButton}
                        onPress={() => setIsLocationModalVisible(false)}
                      >
                        <Text style={styles.modalCloseIcon}>✕</Text>
                      </TouchableOpacity>
                    </View>
                    <FlatList
                      data={locations}
                      keyExtractor={(item) => item}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={[
                            styles.modalItem,
                            formData.region === item && styles.modalItemSelected
                          ]}
                          onPress={() => {
                            handleInputChange("region", item);
                            setIsLocationModalVisible(false);
                          }}
                        >
                          <Text style={[
                            styles.modalItemText,
                            formData.region === item && styles.modalItemTextSelected
                          ]}>{item}</Text>
                          {formData.region === item && (
                            <Text style={styles.modalItemCheck}>✓</Text>
                          )}
                        </TouchableOpacity>
                      )}
                      ItemSeparatorComponent={() => <View style={styles.modalSeparator} />}
                      showsVerticalScrollIndicator={false}
                      style={styles.modalList}
                    />
                  </View>
                </View>
              </Modal>
            </View>

            {/* 음주빈도 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>음주 빈도</Text>
              <View style={styles.twoColumnContainer}>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    onPress={() => handleSelection("drinkingFrequency", "안 마심")}
                    style={[
                      styles.selectionButton,
                      ...(formData.drinkingFrequency === "안 마심"
                        ? [styles.selectionButtonSelected]
                        : []),
                    ]}
                  >
                    <Text style={[
                      styles.selectionButtonText,
                      ...(formData.drinkingFrequency === "안 마심"
                        ? [styles.selectionButtonTextSelected]
                        : []),
                    ]}>안 마심</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleSelection("drinkingFrequency", "주 1회 이하")}
                    style={[
                      styles.selectionButton,
                      ...(formData.drinkingFrequency === "주 1회 이하"
                        ? [styles.selectionButtonSelected]
                        : []),
                    ]}
                  >
                    <Text style={[
                      styles.selectionButtonText,
                      ...(formData.drinkingFrequency === "주 1회 이하"
                        ? [styles.selectionButtonTextSelected]
                        : []),
                    ]}>주 1회 이하</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    onPress={() => handleSelection("drinkingFrequency", "주 1-2회")}
                    style={[
                      styles.selectionButton,
                      ...(formData.drinkingFrequency === "주 1-2회"
                        ? [styles.selectionButtonSelected]
                        : []),
                    ]}
                  >
                    <Text style={[
                      styles.selectionButtonText,
                      ...(formData.drinkingFrequency === "주 1-2회"
                        ? [styles.selectionButtonTextSelected]
                        : []),
                    ]}>주 1-2회</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleSelection("drinkingFrequency", "주 3회 이상")}
                    style={[
                      styles.selectionButton,
                      ...(formData.drinkingFrequency === "주 3회 이상"
                        ? [styles.selectionButtonSelected]
                        : []),
                    ]}
                  >
                    <Text style={[
                      styles.selectionButtonText,
                      ...(formData.drinkingFrequency === "주 3회 이상"
                        ? [styles.selectionButtonTextSelected]
                        : []),
                    ]}>주 3회 이상</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* 흡연여부 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>흡연 여부</Text>
              <View style={styles.twoColumnContainer}>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    onPress={() => handleSelection("smokingStatus", "비흡연")}
                    style={[
                      styles.selectionButton,
                      ...(formData.smokingStatus === "비흡연"
                        ? [styles.selectionButtonSelected]
                        : []),
                    ]}
                  >
                    <Text style={[
                      styles.selectionButtonText,
                      ...(formData.smokingStatus === "비흡연"
                        ? [styles.selectionButtonTextSelected]
                        : []),
                    ]}>비흡연</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleSelection("smokingStatus", "흡연")}
                    style={[
                      styles.selectionButton,
                      ...(formData.smokingStatus === "흡연"
                        ? [styles.selectionButtonSelected]
                        : []),
                    ]}
                  >
                    <Text style={[
                      styles.selectionButtonText,
                      ...(formData.smokingStatus === "흡연"
                        ? [styles.selectionButtonTextSelected]
                        : []),
                    ]}>흡연</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* 키 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>키</Text>
              <View style={{ position: "relative" }}>
                <TextInput
                  style={[styles.input, { paddingRight: 40 }]}
                  value={formData.height}
                  onChangeText={handleHeightChange}
                  placeholder="키를 입력해주세요"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
                <Text style={styles.cmSuffix}>cm</Text>
              </View>
            </View>

            {/* 반려동물 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>반려동물</Text>
              <View style={styles.twoColumnContainer}>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    onPress={() => handleSelection("pets", "없음")}
                    style={[
                      styles.selectionButton,
                      ...(formData.pets === "없음"
                        ? [styles.selectionButtonSelected]
                        : []),
                    ]}
                  >
                    <Text style={[
                      styles.selectionButtonText,
                      ...(formData.pets === "없음"
                        ? [styles.selectionButtonTextSelected]
                        : []),
                    ]}>없음</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleSelection("pets", "강아지")}
                    style={[
                      styles.selectionButton,
                      ...(formData.pets === "강아지"
                        ? [styles.selectionButtonSelected]
                        : []),
                    ]}
                  >
                    <Text style={[
                      styles.selectionButtonText,
                      ...(formData.pets === "강아지"
                        ? [styles.selectionButtonTextSelected]
                        : []),
                    ]}>강아지</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    onPress={() => handleSelection("pets", "고양이")}
                    style={[
                      styles.selectionButton,
                      ...(formData.pets === "고양이"
                        ? [styles.selectionButtonSelected]
                        : []),
                    ]}
                  >
                    <Text style={[
                      styles.selectionButtonText,
                      ...(formData.pets === "고양이"
                        ? [styles.selectionButtonTextSelected]
                        : []),
                    ]}>고양이</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleSelection("pets", "기타")}
                    style={[
                      styles.selectionButton,
                      ...(formData.pets === "기타"
                        ? [styles.selectionButtonSelected]
                        : []),
                    ]}
                  >
                    <Text style={[
                      styles.selectionButtonText,
                      ...(formData.pets === "기타"
                        ? [styles.selectionButtonTextSelected]
                        : []),
                    ]}>기타</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* 종교 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>종교</Text>
              <View style={styles.twoColumnContainer}>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    onPress={() => handleSelection("religion", "무교")}
                    style={[
                      styles.selectionButton,
                      ...(formData.religion === "무교"
                        ? [styles.selectionButtonSelected]
                        : []),
                    ]}
                  >
                    <Text style={[
                      styles.selectionButtonText,
                      ...(formData.religion === "무교"
                        ? [styles.selectionButtonTextSelected]
                        : []),
                    ]}>무교</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleSelection("religion", "기독교")}
                    style={[
                      styles.selectionButton,
                      ...(formData.religion === "기독교"
                        ? [styles.selectionButtonSelected]
                        : []),
                    ]}
                  >
                    <Text style={[
                      styles.selectionButtonText,
                      ...(formData.religion === "기독교"
                        ? [styles.selectionButtonTextSelected]
                        : []),
                    ]}>기독교</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    onPress={() => handleSelection("religion", "천주교")}
                    style={[
                      styles.selectionButton,
                      ...(formData.religion === "천주교"
                        ? [styles.selectionButtonSelected]
                        : []),
                    ]}
                  >
                    <Text style={[
                      styles.selectionButtonText,
                      ...(formData.religion === "천주교"
                        ? [styles.selectionButtonTextSelected]
                        : []),
                    ]}>천주교</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleSelection("religion", "불교")}
                    style={[
                      styles.selectionButton,
                      ...(formData.religion === "불교"
                        ? [styles.selectionButtonSelected]
                        : []),
                    ]}
                  >
                    <Text style={[
                      styles.selectionButtonText,
                      ...(formData.religion === "불교"
                        ? [styles.selectionButtonTextSelected]
                        : []),
                    ]}>불교</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    onPress={() => handleSelection("religion", "기타")}
                    style={[
                      styles.selectionButton,
                      ...(formData.religion === "기타"
                        ? [styles.selectionButtonSelected]
                        : []),
                    ]}
                  >
                    <Text style={[
                      styles.selectionButtonText,
                      ...(formData.religion === "기타"
                        ? [styles.selectionButtonTextSelected]
                        : []),
                    ]}>기타</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* 연락빈도 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>연락 빈도</Text>
              <View style={styles.twoColumnContainer}>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    onPress={() => handleSelection("contactFrequency", "중요함")}
                    style={[
                      styles.selectionButton,
                      ...(formData.contactFrequency === "중요함"
                        ? [styles.selectionButtonSelected]
                        : []),
                    ]}
                  >
                    <Text style={[
                      styles.selectionButtonText,
                      ...(formData.contactFrequency === "중요함"
                        ? [styles.selectionButtonTextSelected]
                        : []),
                    ]}>중요함</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleSelection("contactFrequency", "중요하지 않음")}
                    style={[
                      styles.selectionButton,
                      ...(formData.contactFrequency === "중요하지 않음"
                        ? [styles.selectionButtonSelected]
                        : []),
                    ]}
                  >
                    <Text style={[
                      styles.selectionButtonText,
                      ...(formData.contactFrequency === "중요하지 않음"
                        ? [styles.selectionButtonTextSelected]
                        : []),
                    ]}>중요하지 않음</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* MBTI */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>MBTI</Text>
              <View style={styles.mbtiGrid}>
                {mbtiTypes.map((mbti) => (
                  <TouchableOpacity
                    key={mbti}
                    onPress={() => handleSelection("mbti", mbti)}
                    style={[
                      styles.mbtiButton,
                      ...(formData.mbti === mbti
                        ? [styles.mbtiButtonSelected]
                        : []),
                    ]}
                  >
                    <Text style={[
                      styles.mbtiButtonText,
                      ...(formData.mbti === mbti
                        ? [styles.mbtiButtonTextSelected]
                        : []),
                    ]}>{mbti}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 다음 버튼 */}
            <View
              style={[styles.buttonContainer, { paddingBottom: insets.bottom + 20 }]}
            >
              <LinearGradient
                colors={["#EC4899", "#F43F5E"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <ButtonView
                  title="다음"
                  onPress={handleComplete}
                  buttonStyle={styles.nextButton}
                  textStyle={styles.nextButtonText}
                />
              </LinearGradient>
            </View>
            
            {/* 하단 안내 문구 */}
            <View style={styles.disclaimerContainer}>
              <Text style={styles.disclaimerText}>
                입력하신 정보는 매칭을 위해서만 사용됩니다.
              </Text>
            </View>
          </View>
        </ScrollView>
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
    borderWidth: 1.35,
    borderColor: "#9CA3AF",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    height: 52,
  },
  inputText: {
    color: "#333333",
    fontSize: 16,
  },
  inputPlaceholder: {
    color: "#999999",
    fontSize: 16,
  },
  cmSuffix: {
    position: "absolute",
    right: 16,
    top: 0,
    bottom: 0,
    textAlignVertical: "center",
    textAlign: "center",
    color: "#666666",
    lineHeight: 52,
  },
  jobContainer: {
    gap: 8,
  },
  jobRow: {
    flexDirection: "row",
    gap: 8,
  },
  jobButton: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1.35,
    borderTopColor: "#9CA3AF",
    borderWidth: 1.35,
    borderColor: "#9CA3AF",
    borderRadius: 10,
    flex: 1,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  jobButtonSelected: {
    backgroundColor: "#FDF2F8",
    borderWidth: 1.35,
    borderColor: "#EC4899",
  },
  jobButtonText: {
    color: "#666666",
    fontSize: 14,
    textAlign: "center",
  },
  jobButtonTextSelected: {
    color: "#333333",
    fontWeight: "500",
  },
  twoColumnContainer: {
    gap: 8,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
  },
  selectionButton: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1.35,
    borderTopColor: "#9CA3AF",
    borderWidth: 1.35,
    borderColor: "#9CA3AF",
    borderRadius: 10,
    flex: 1,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  selectionButtonSelected: {
    backgroundColor: "#FDF2F8",
    borderWidth: 1.35,
    borderColor: "#EC4899",
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
  mbtiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  mbtiButton: {
    width: 80,
    height: 44,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1.35,
    borderTopColor: "#9CA3AF",
    borderWidth: 1.35,
    borderColor: "#9CA3AF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  mbtiButtonSelected: {
    backgroundColor: "#FDF2F8",
    borderWidth: 1.35,
    borderColor: "#EC4899",
  },
  mbtiButtonText: {
    color: "#666666",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  mbtiButtonTextSelected: {
    color: "#333333",
    fontWeight: "500",
  },
  buttonContainer: {
    paddingHorizontal: 20,
  },
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
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  bottomSpacing: {
    height: 40,
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
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: "70%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333333",
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseIcon: {
    fontSize: 16,
    color: "#666666",
    fontWeight: "600",
  },
  modalList: {
    maxHeight: 300,
  },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  modalItemSelected: {
    backgroundColor: "#FDF2F8",
  },
  modalItemText: {
    fontSize: 16,
    color: "#333333",
    fontWeight: "500",
  },
  modalItemTextSelected: {
    color: "#EC4899",
    fontWeight: "600",
  },
  modalItemCheck: {
    fontSize: 16,
    color: "#EC4899",
    fontWeight: "600",
  },
  modalSeparator: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginLeft: 4,
  },
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
    shadowOffset: {
      width: 0,
      height: 4,
    },
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
});

export default SignupDetailedScreen;
