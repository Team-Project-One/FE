import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaleSvg from "../../assets/male.svg";
import FemaleSvg from "../../assets/femaleIcon.svg";

export interface GenderSelectorProps {
  value: string;
  onChange: (gender: string) => void;
  hasError?: boolean;
}

const GenderSelector: React.FC<GenderSelectorProps> = ({ value, onChange, hasError }) => {
  return (
    <View style={styles.genderContainer}>
      <TouchableOpacity
        onPress={() => onChange(value === "남성" ? "" : "남성")}
        style={[
          styles.genderButton,
          value === "남성" && styles.genderButtonSelectedMale,
          hasError && value !== "남성" && styles.genderButtonError,
        ]}
      >
        <View style={styles.genderButtonContent}>
          <MaleSvg width={20} height={20} style={{ marginRight: 8 }} />
          <Text
            style={[styles.genderButtonText, value === "남성" && styles.genderButtonTextSelectedMale]}
          >
            남성
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onChange(value === "여성" ? "" : "여성")}
        style={[
          styles.genderButton,
          value === "여성" && styles.genderButtonSelectedFemale,
          hasError && value !== "여성" && styles.genderButtonError,
        ]}
      >
        <View style={styles.genderButtonContent}>
          <FemaleSvg width={20} height={20} style={{ marginRight: 8 }} />
          <Text
            style={[styles.genderButtonText, value === "여성" && styles.genderButtonTextSelectedFemale]}
          >
            여성
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default GenderSelector;


