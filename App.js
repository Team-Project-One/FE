import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import { SafeAreaProvider,useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * 앱 전체에서 사용되는 버튼 컴포넌트
 * Pressable 기반으로 '누르다 취소' 기능 지원
 * 
 */
const ButtonView = ({ title, onPress, buttonStyle, textStyle }) => (
  <Pressable
    // 버튼이 눌렸을 때(pressed) 투명도를 0.5로 변경하여 시각적 피드백
    style={({ pressed }) => [
      styles.button,
      buttonStyle,
      { opacity: pressed ? 0.5 : 1 },
    ]}
    onPress={onPress}
  >
    <Text style={[styles.buttonText, textStyle]}>{title}</Text>
  </Pressable>
);

/**
 * 앱의 메인 화면을 구성하는 컴포넌트
 * 헤더, 콘텐츠, 푸터 및 매칭 버튼을 포함
 */
function MainScreen() {
  // 디바이스의 Safe Area(노치, 하단 바 등) 크기를 가져와 UI가 가려지지 않도록 함
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.backgroundColorContainer}>
      <StatusBar style="auto" />

      {/* 헤더 영역*/}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.headerText}>❤️</Text>
      </View>

      {/* 콘텐츠 영역 */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.scrollableText}>
          운명의 상대를 만나보세요{"\n"}
          사주팔자로 찾는 완벽한 궁합{"\n"}
        </Text>
      </ScrollView>

      {/* 매칭하기 버튼 */}
      <View style={[styles.buttonContainer, { bottom: insets.bottom + 120 }]}>
        <ButtonView
          title="매칭하기"
          onPress={() => console.log("매칭 버튼 눌림")}
          buttonStyle={styles.matchingButton}
          textStyle={styles.matchingButtonText}
        />
      </View>

      {/* 푸터 영역 */}
      <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
        <ButtonView title="친구" onPress={() => console.log("친구 버튼 눌림")} />
        <ButtonView title="홈" onPress={() => console.log("홈 버튼 눌림")} />
        <ButtonView title="마이" onPress={() => console.log("마이 버튼 눌림")} />
      </View>
    </View>
  );
}

/**
 * 최상위 루트 컴포넌트
 * SafeAreaProvider로 앱을 감싸 SafeArea 값을 하위 컴포넌트에 제공
 * 
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <MainScreen />
    </SafeAreaProvider>
  );
}

// 스타일 시트
const styles = StyleSheet.create({
  /**
   * 레이아웃 스타일
   * (화면 전체, 헤더, 콘첸츠, 푸터 등)
   */
  backgroundColorContainer: {
    flex: 1,  // 화면 전체로 설정
    backgroundColor: "#FEBEEC",
  },
  header: {
    height: 135, // 일단 피그마 기준으로 설정했지만 차후에 논의 필요해보임
    paddingHorizontal: 16,
    alignItems: "center",
    backgroundColor: "#002E66", // 명지대 로고 색상
    justifyContent: "center", // 로고 중앙에 위치
  },
  content: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  footer: {
    height: 125, // 일단 피그마 기준으로 설정했지만 차후에 논의 필요해보임
    paddingHorizontal: 16,
    flexDirection: "row", // 버튼 가로 배치
    justifyContent: "space-around", // 버튼 사이 동일한 간격 부여
    width: "100%",
    backgroundColor: "#002E66",
    alignItems: "center",
  },

  /**
   * 텍스트 스타일
   */
  // 앱 로고로 대체 예정
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  // 스크롤 기능, 다른 페이지에서 주로 활용할 듯 
  scrollableText: {
    textAlign: "center",
    fontSize: 18,
    color: "#333",
    lineHeight: 28,
  },
  buttonText: {
    color: "#ffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  // '매칭하기' 버튼 텍스트 전용 스타일
  matchingButtonText: {
    fontSize: 20,
  },

  /**
   * 버튼 스타일
   */
  buttonContainer: {
    position: "absolute", // 다른 UI 위에 떠 있도록 설정
    alignSelf: "center",  
  },
  // '친구', '홈', '마이' 일반 버튼 기본 스타일
  button: {
    backgroundColor: "#002E66",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  // '매칭하기' 버튼 전용 스타일
  matchingButton: {
    width: 200,
    height: 90,
    borderRadius: 12,
    justifyContent: "center", 
    alignItems: "center", 
    // ios용 그림자
    shadowColor: "#000", 
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // 안드로이드용 그림자
    elevation: 5, 
  },
});
