import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';

// 버튼 컴포넌트, 눌렀을 때 반투명해짐
const ButtonView = ({ title, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

export default function App() {
  return (
    <SafeAreaView style={styles.backgroundColorContainer}>
      <StatusBar style="auto" />

      {/* 헤더 */}
      <View style={styles.header}>
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
      <View style={styles.buttonContainer}>
        <ButtonView title = "매칭하기"  onPress={() => console.log('매칭 버튼 눌림')}/>
      </View>

      {/* 푸터 영역 */}
      <View style={styles.footer}>
        <ButtonView title="친구" onPress={() => console.log('친구 버튼 눌림')} />
        <ButtonView title="홈" onPress={() => console.log('홈 버튼 눌림')} />
        <ButtonView title="마이" onPress={() => console.log('마이 버튼 눌림')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundColorContainer: {       // 배경색
    flex: 1,
    backgroundColor: '#FEBEEC',
  },
  header: {                         // 헤더
    height: 66.5,
    alignItems: 'center',
    backgroundColor: '#002E66',  // 색은 명지대 로고에서 따 옴
  },
  headerText: {                     // 헤더 지금은하트인데 나중에 로고들어가야함 하트 위치 마음에 안듬
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  content: {                        // 그냥 짬통 아직 여기다가 뭐 할지 안정함
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  scrollableText: {                 // 스크롤 가능하다해서 해 봄 다른 페이지에서 써먹을 듯
    textAlign: 'center',
    fontSize: 18,
    color: '#333',
  },
  footer: {                         // 푸터 
    height: 62.5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: '#002E66',  
    alignItems: 'center',
  },
  buttonContainer:{                 // 매칭 버튼으로 활용 중
    color: '#002E66',
    position: 'absolute',
    alignSelf: 'center',
    bottom: 120
  },
  button: {                          // 일반 버튼 스타일 
    backgroundColor: '#002E66',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  buttonText: {                     // 버튼 글자
    color: '#ffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});