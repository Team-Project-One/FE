import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MainScreenProps } from "../types";
import BottomNavigation from "../components/BottomNavigation";
import ButtonView from "../components/ButtonView";
import DivineIcon from "../../assets/divine.svg";
import FortuneCookieIcon from "../../assets/fortuneCookie.svg";
import SirenIcon from "../../assets/siren.svg";

const fortuneTexts = {
  총운: [
    "오늘은 새로운 시작을 위한 좋은 날입니다. 용기를 내어 한 발 더 나아가보세요.",
    "작은 변화가 큰 기회로 이어질 수 있는 날입니다. 주변을 살펴보세요.",
    "인내심을 가지고 기다린다면 좋은 결과가 있을 것입니다.",
  ],
  애정운: [
    "운명의 상대를 만날 수 있는 절호의 기회가 다가오고 있습니다.",
    "진실한 마음으로 다가간다면 상대방도 마음을 열 것입니다.",
    "소중한 인연을 놓치지 마세요. 적극적으로 다가가보세요.",
  ],
  금전운: [
    "계획적인 소비가 필요한 시기입니다. 신중하게 결정하세요.",
    "새로운 투자 기회가 있을 수 있습니다. 충분히 검토해보세요.",
    "절약하는 습관이 큰 도움이 될 것입니다.",
  ],
  직장운: [
    "새로운 프로젝트에 도전할 좋은 기회입니다. 자신감을 가지세요.",
    "동료와의 협력이 중요한 시기입니다. 소통을 강화하세요.",
    "승진이나 새로운 기회가 다가올 수 있습니다. 준비하세요.",
  ],
};

const MainScreen: React.FC<MainScreenProps> = ({ onNavigate }) => {
  const insets = useSafeAreaInsets();
  const [showFortune, setShowFortune] = useState(false);
  const [showMatchingWarning, setShowMatchingWarning] = useState(false);
  const [warningChecked, setWarningChecked] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<keyof typeof fortuneTexts>("총운");

  const getRandomFortune = (category: keyof typeof fortuneTexts) => {
    const texts = fortuneTexts[category];
    return texts[Math.floor(Math.random() * texts.length)];
  };

  const handleFortuneClick = () => {
    setShowFortune(true);
    setSelectedCategory("총운");
  };

  const handleCloseFortune = () => {
    setShowFortune(false);
  };

  const handleCategoryChange = (category: keyof typeof fortuneTexts) => {
    setSelectedCategory(category);
  };

  const handleMatchingClick = () => {
    setShowMatchingWarning(true);
    setWarningChecked(false);
  };

  const handleWarningConfirm = () => {
    if (warningChecked) {
      setShowMatchingWarning(false);
      onNavigate("matchingResult");
    }
  };

  const handleWarningClose = () => {
    setShowMatchingWarning(false);
    setWarningChecked(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={{ width: 120, height: 40 }}>
          <DivineIcon width={120} height={40} />
        </View>
        <TouchableOpacity
          onPress={handleFortuneClick}
          style={styles.cookieButton}
        >
          {Platform.OS === "web" ? (
            <View style={{ width: 40, height: 40, position: "relative" }}>
              <FortuneCookieIcon width={40} height={40} opacity={1} />
            </View>
          ) : (
            <View style={{ width: 40, height: 40 }}>
              <FortuneCookieIcon width={40} height={40} />
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Main Content with Background Image */}
      <View style={styles.mainContent}>
        <ImageBackground
          source={require("../../assets/mainScreen.jpg")}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          {/* Dark Overlay */}
          <View style={styles.overlay}>
            {/* Text Overlay */}
            <View style={styles.textContainer}>
              <Text style={styles.greetingText}>운명의 상대를 만나보세요</Text>
              <Text style={styles.descriptionText}>
                사주팔자로 찾는 완벽한 궁합
              </Text>
            </View>

            {/* Matching Button */}
            <View style={styles.buttonContainer}>
              <ButtonView title="매칭하기" onPress={handleMatchingClick} />
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* Bottom Navigation */}
      <View style={{ paddingBottom: insets.bottom }}>
        <BottomNavigation onNavigate={onNavigate} currentScreen={"main"} />
      </View>

      {/* Fortune Modal */}
      {showFortune && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>오늘의 운세</Text>

            {/* Category Buttons */}
            <View style={styles.categoryContainer}>
              {(["총운", "애정운", "금전운", "직장운"] as const).map(
                (category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      selectedCategory === category &&
                        styles.categoryButtonSelected,
                    ]}
                    onPress={() => handleCategoryChange(category)}
                  >
                    <Text
                      style={[
                        styles.categoryButtonText,
                        selectedCategory === category &&
                          styles.categoryButtonTextSelected,
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>

            {/* Fortune Text */}
            <View style={styles.fortuneTextBox}>
              <Text style={styles.fortuneText}>
                {getRandomFortune(selectedCategory)}
              </Text>
            </View>

            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseFortune}
            >
              <Text style={styles.closeButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Matching Warning Modal */}
      {showMatchingWarning && (
        <View style={styles.modalOverlay}>
          <View style={styles.warningModalContent}>
            {/* Header with Siren Icon */}
            <View style={styles.warningHeader}>
              <View
                style={{
                  ...styles.sirenIconContainer,
                  ...(Platform.OS === "web" && {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }),
                }}
              >
                <SirenIcon width={28} height={28} />
              </View>
              <Text style={styles.warningModalTitle}>매칭 주의사항</Text>
              <TouchableOpacity
                onPress={handleWarningClose}
                style={styles.closeIcon}
              >
                <Text style={styles.closeIconText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Warning List */}
            <View style={styles.warningListBox}>
              <Text style={styles.warningItem}>
                • 정확한 사주 분석을 위해 진실한 정보를 제공해주세요.
              </Text>
              <Text style={styles.warningItem}>
                • 상대방에게 예의를 지켜주세요.
              </Text>
              <Text style={styles.warningItem}>
                • 개인정보 보호를 위해 주의깊게 소통해주세요.
              </Text>
            </View>

            {/* Checkbox */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setWarningChecked(!warningChecked)}
            >
              <View
                style={[
                  styles.checkbox,
                  warningChecked && styles.checkboxChecked,
                ]}
              >
                {warningChecked && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxText}>주의사항을 확인했습니다.</Text>
            </TouchableOpacity>

            {/* Complete Button */}
            <ButtonView
              title="완료"
              onPress={handleWarningConfirm}
              disabled={!warningChecked}
            />
          </View>
        </View>
      )}
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
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    zIndex: 10,
    elevation: 0,
  },
  logoImage: {
    width: 120,
    height: 40,
  },
  cookieButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  cookieImage: {
    width: 40,
    height: 40,
  },
  mainContent: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  textContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  descriptionText: {
    fontSize: 14,
    color: "#E5E7EB",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buttonContainer: {
    width: "100%",
    alignSelf: "center",
    marginBottom: 60,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 20,
    textAlign: "center",
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  categoryButton: {
    flex: 1,
    minWidth: "45%",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  categoryButtonSelected: {
    borderColor: "#F94144",
    backgroundColor: "#FEE2E2",
  },
  categoryButtonText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  categoryButtonTextSelected: {
    color: "#F94144",
    fontWeight: "600",
  },
  fortuneTextBox: {
    backgroundColor: "#FFF0F5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    minHeight: 80,
  },
  fortuneText: {
    fontSize: 16,
    color: "#1F2937",
    lineHeight: 24,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#F94144",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  warningModalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  warningHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  sirenIconContainer: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  sirenIcon: {
    width: 28,
    height: 28,
  },
  warningModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    flex: 1,
    textAlign: "center",
  },
  closeIcon: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  closeIconText: {
    fontSize: 24,
    color: "#6B7280",
    fontWeight: "300",
  },
  warningListBox: {
    backgroundColor: "#FFFBEB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  warningItem: {
    fontSize: 14,
    color: "#1F2937",
    lineHeight: 22,
    marginBottom: 8,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#3B82F6",
    borderRadius: 4,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#3B82F6",
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  checkboxText: {
    fontSize: 14,
    color: "#374151",
  },
});

export default MainScreen;
