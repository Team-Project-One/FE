import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import ButtonView from "../components/ButtonView";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { BaseScreenProps } from "../types";

const Chip = ({
  label,
  selected,
  onPress,
  containerStyle,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  containerStyle?: any;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.chip, containerStyle, selected && styles.chipSelected]}
  >
    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const ProfileEditScreen: React.FC<BaseScreenProps> = ({ onNavigate }) => {
  const insets = useSafeAreaInsets();
  const [job, setJob] = useState<string>("학생");
  const [region, setRegion] = useState<string>("");
  const [drink, setDrink] = useState<string>("가끔 마심");
  const [smoke, setSmoke] = useState<string>("비흡연");
  const [height, setHeight] = useState<string>("160");
  const [pet, setPet] = useState<string>("없음");
  const [religion, setReligion] = useState<string>("무교");
  const [contact, setContact] = useState<string>("중요함");
  const [mbti, setMbti] = useState<string>("ESFP");

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          onPress={() => onNavigate("mypage")}
          style={styles.backButton}
        >
          <Image
            source={require("../../assets/back.svg")}
            style={styles.backButtonImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>프로필 수정</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 120 },
        ]}
      >
        <Text style={styles.sectionLabel}>직업</Text>
        <View style={styles.rowWrap}>
          {["무직", "학생", "직장인", "기타"].map((label) => (
            <Chip
              key={label}
              label={label}
              selected={job === label}
              onPress={() => setJob(label)}
              containerStyle={styles.col2}
            />
          ))}
        </View>

        <Text style={styles.sectionLabel}>지역</Text>
        <TextInput
          style={styles.input}
          value={region}
          onChangeText={setRegion}
        />

        <Text style={styles.sectionLabel}>음주 빈도</Text>
        <View style={styles.rowWrap}>
          {["안 마심", "가끔 마심", "자주 마심", "매일 마심"].map((label) => (
            <Chip
              key={label}
              label={label}
              selected={drink === label}
              onPress={() => setDrink(label)}
              containerStyle={styles.col2}
            />
          ))}
        </View>

        <Text style={styles.sectionLabel}>흡연 여부</Text>
        <View style={styles.rowWrap}>
          {["비흡연", "흡연"].map((label) => (
            <Chip
              key={label}
              label={label}
              selected={smoke === label}
              onPress={() => setSmoke(label)}
              containerStyle={styles.col2}
            />
          ))}
        </View>

        <Text style={styles.sectionLabel}>키</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={height}
          onChangeText={setHeight}
        />

        <Text style={styles.sectionLabel}>반려동물</Text>
        <View style={styles.rowWrap}>
          {["없음", "강아지", "고양이", "기타"].map((label) => (
            <Chip
              key={label}
              label={label}
              selected={pet === label}
              onPress={() => setPet(label)}
              containerStyle={styles.col2}
            />
          ))}
        </View>

        <Text style={styles.sectionLabel}>종교</Text>
        <View style={styles.rowWrap}>
          {["무교", "기독교", "천주교", "불교", "기타", "무응답"].map(
            (label) => (
              <Chip
                key={label}
                label={label}
                selected={religion === label}
                onPress={() => setReligion(label)}
                containerStyle={styles.col2}
              />
            )
          )}
        </View>

        <Text style={styles.sectionLabel}>연락 빈도</Text>
        <View style={styles.rowWrap}>
          {["중요함", "중요하지 않음"].map((label) => (
            <Chip
              key={label}
              label={label}
              selected={contact === label}
              onPress={() => setContact(label)}
              containerStyle={styles.col2}
            />
          ))}
        </View>

        <Text style={styles.sectionLabel}>MBTI</Text>
        <View style={styles.rowWrap}>
          {[
            "INTJ",
            "INTP",
            "ENTJ",
            "ENTP",
            "INFJ",
            "INFP",
            "ENFJ",
            "ENFP",
            "ISTJ",
            "ISFJ",
            "ESTJ",
            "ESFJ",
            "ISTP",
            "ISFP",
            "ESTP",
            "ESFP",
          ].map((label) => (
            <Chip
              key={label}
              label={label}
              selected={mbti === label}
              onPress={() => setMbti(label)}
              containerStyle={styles.col4}
            />
          ))}
        </View>

        <View style={{ marginTop: 24 }}>
          <ButtonView title="완료" onPress={() => onNavigate("mypage")} />
        </View>
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
  content: { paddingHorizontal: 16 },
  sectionLabel: {
    fontSize: 14,
    color: "#1F2937",
    marginTop: 12,
    marginBottom: 8,
  },
  rowWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  col2: { width: "48%" },
  col4: { width: "23%" },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  chipSelected: { backgroundColor: "#FDECF2", borderColor: "#EC4899" },
  chipText: { fontSize: 14, color: "#1F2937" },
  chipTextSelected: { color: "#EC4899", fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  // 버튼 공용 컴포넌트 사용으로 개별 스타일 제거
});

export default ProfileEditScreen;
