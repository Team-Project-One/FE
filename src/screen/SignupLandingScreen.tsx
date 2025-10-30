import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import ButtonView from "../components/ButtonView";
import { SignupLandingScreenProps } from "../types";
import { LinearGradient } from "expo-linear-gradient";
import DivineLogoSvg from "../../assets/divine.svg";

const { width, height } = Dimensions.get("window");

// 배경 이미지 목록 (5초마다 자동 전환)
const backgroundImages = [
  "https://images.unsplash.com/photo-1605041140728-fecfe5b22e16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGNvdXBsZSUyMGRhdGluZyUyMHJvbWFudGljfGVufDF8fHx8MTc1ODg3MTQ1N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1654727317152-b8178b6083ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGNvdXBsZSUyMGxvdmUlMjByZWxhdGlvbnNoaXB8ZW58MXx8fHwxNzU4OTU0ODQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1699726256380-d1e393507b4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMHN1bnNldCUyMGNvdXBsZSUyMHNpbGhvdWV0dGV8ZW58MXx8fHwxNzU4OTU0ODQyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a", // 검정/하얀 화면 대신 어두운 배경색 사용
  },
  backgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#1a1a1a", // 배경색으로 자연스러운 전환 보장
  },
  backgroundImageWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  backgroundImageHidden: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
    zIndex: -1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  contentWrapper: {
    flex: 1,
    zIndex: 10,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  mainText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 38,
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 0.5,
  },
  subText: {
    fontSize: 17,
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 15,
    opacity: 0.95,
    textShadowColor: "rgba(0, 0, 0, 0.6)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 0.3,
  },
  buttonContainer: {
    paddingHorizontal: 20,
  },
  gradientButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  startButton: {
    backgroundColor: "transparent",
    paddingVertical: 18,
    paddingHorizontal: 20,
    width: "100%",
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

const DivineLogo = () => (
  <View style={styles.logoContainer}>
    <DivineLogoSvg width={80} height={80} style={{ alignSelf: "center" }} />
  </View>
);

/**
 * 앱 랜딩 화면
 * 배경 이미지가 자동으로 전환되며, 시작하기 버튼을 통해 로그인 화면으로 이동합니다.
 */
const SignupLandingScreen: React.FC<SignupLandingScreenProps> = ({
  onNavigate,
}) => {
  const insets = useSafeAreaInsets();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [nextImageIndex, setNextImageIndex] = useState(1);
  const [displayNextIndex, setDisplayNextIndex] = useState(1);
  const [isNextImageLoaded, setIsNextImageLoaded] = useState(false);
  const currentIndexRef = useRef(0);
  const isTransitioningRef = useRef(false);

  useEffect(() => {
    currentIndexRef.current = currentImageIndex;
  }, [currentImageIndex]);

  // 초기 이미지가 이미 표시 중인 경우 로드 상태 설정
  useEffect(() => {
    // 초기 상태에서 displayNextIndex가 이미 설정되어 있으면 로드된 것으로 간주
    // 약간의 딜레이 후에 로드 상태 설정 (이미지가 실제로 렌더링될 시간을 줌)
    setTimeout(() => {
      if (displayNextIndex === nextImageIndex && !isNextImageLoaded) {
        setIsNextImageLoaded(true);
      }
    }, 500);
  }, []);

  // 배경 이미지 페이드 전환 애니메이션 처리
  const startTransition = useRef((nextIndex: number) => {
    if (isTransitioningRef.current) return;

    isTransitioningRef.current = true;

    // 크로스페이드 효과: 현재 이미지 페이드 아웃, 다음 이미지 페이드 인
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 2000, // 애니메이션 시간을 더 길게 설정 (2초)
      useNativeDriver: true,
    }).start(() => {
      // 전환 완료 후 현재 인덱스 업데이트
      const newCurrentIndex = nextIndex;
      const newNextIndex = (newCurrentIndex + 1) % backgroundImages.length;

      // ref와 state 동시 업데이트 (다음 이미지도 함께)
      currentIndexRef.current = newCurrentIndex;

      // 1. [중요] State를 먼저 업데이트하여 리렌더링을 트리거합니다.
      //    이 시점에 fadeAnim.value는 0이므로,
      //    "현재 이미지 레이어"는 새 이미지(newCurrentIndex)로 바뀌지만 opacity는 0입니다.
      setCurrentImageIndex(newCurrentIndex);
      setNextImageIndex(newNextIndex);
      setDisplayNextIndex(newNextIndex);

      // 2. [중요] State 업데이트가 반영된 후에 opacity 값을 1로 리셋합니다.
      //    이렇게 하면 "현재 이미지 레이어"(이제 newCurrentIndex)가
      //    깜빡임 없이 자연스럽게 opacity: 1 (다음 전환을 위해 보임) 상태가 됩니다.
      fadeAnim.setValue(1);

      // 전환 플래그 해제
      isTransitioningRef.current = false;
    });
  }).current;

  // nextImageIndex가 변경되면 이미지를 미리 로드 (displayNextIndex는 아직 업데이트 안 함)
  useEffect(() => {
    // 로드 상태 리셋
    setIsNextImageLoaded(false);
    // opacity를 1로 설정하여 다음 이미지가 숨겨진 상태로 시작
    fadeAnim.setValue(1);
  }, [nextImageIndex]);

  // 이미지가 로드되면 displayNextIndex 업데이트 및 전환 시작
  useEffect(() => {
    // 이미지가 로드되었고, 전환 중이 아니며, 다음 이미지가 현재 이미지와 다를 때
    if (
      isNextImageLoaded &&
      !isTransitioningRef.current &&
      nextImageIndex !== currentIndexRef.current
    ) {
      // 1. displayNextIndex를 업데이트하여 "다음 이미지" 레이어가
      //    미리 로드된 이미지를 가리키도록 함
      setDisplayNextIndex(nextImageIndex);

      // 2. [중요] 'setDisplayNextIndex'가 네이티브 UI에 반영될
      //    아주 짧은 시간(1~2 프레임)을 줍니다.
      //    (1.5초가 넘는 기존 딜레이는 너무 깁니다.)
      requestAnimationFrame(() => {
        if (!isTransitioningRef.current) {
          // 3. fadeAnim 값을 1로 확실히 리셋 (현재 이미지가 보이는 상태)
          //    (startTransition 콜백에서도 하지만, 여기서도 한 번 더 보장)
          fadeAnim.setValue(1);

          // 4. 전환 시작
          startTransition(nextImageIndex);
        }
      });
    }
  }, [isNextImageLoaded, nextImageIndex, startTransition]);

  // 5초마다 배경 이미지 자동 전환
  useEffect(() => {
    const interval = setInterval(() => {
      // 이미 전환 중이면 건너뛰기
      if (isTransitioningRef.current) {
        return;
      }

      const currentIndex = currentIndexRef.current;
      const nextIndex = (currentIndex + 1) % backgroundImages.length;

      // 다음 이미지 인덱스 설정 (이미지 로드 시작)
      // displayNextIndex는 이미지가 로드된 후에만 업데이트됨
      setNextImageIndex(nextIndex);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // 다음 이미지에 대한 opacity (현재 이미지와 반대)
  // 전환 중이 아니면 완전히 숨김 (0)으로 설정하여 이전 이미지가 보이지 않도록
  const nextImageOpacity = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* 배경 슬라이드쇼 - 크로스페이드 효과를 위해 두 개의 레이어 사용 */}
      <View style={styles.backgroundContainer}>
        {/* 현재 이미지 레이어 */}
        <Animated.View
          style={[styles.backgroundImageWrapper, { opacity: fadeAnim }]}
        >
          <ImageBackground
            source={{ uri: backgroundImages[currentImageIndex] }}
            style={styles.backgroundImage}
            resizeMode="cover"
            onError={() => {
              console.log("Image load error, trying next image");
              setCurrentImageIndex(
                (prevIndex) => (prevIndex + 1) % backgroundImages.length
              );
            }}
          >
            <View style={styles.overlay} />
          </ImageBackground>
        </Animated.View>

        {/* 다음 이미지 레이어 - 크로스페이드 효과 */}
        {/* nextImageIndex로 이미지를 미리 로드 (숨겨진 상태) */}
        {/* displayNextIndex와 다를 때만 숨겨진 이미지로 미리 로드 */}
        {nextImageIndex !== displayNextIndex ? (
          <ImageBackground
            source={{ uri: backgroundImages[nextImageIndex] }}
            style={styles.backgroundImageHidden}
            resizeMode="cover"
            onLoad={() => {
              // 이미지가 로드되면 상태 업데이트
              // 모바일에서 완전히 렌더링될 시간을 충분히 주기 위해 긴 딜레이
              setTimeout(() => {
                setIsNextImageLoaded(true);
              }, 300);
            }}
            onError={() => {
              console.log("Next image load error");
              setIsNextImageLoaded(true); // 에러가 나도 전환 진행
            }}
          />
        ) : null}
        {/* displayNextIndex로 표시할 이미지 */}
        <Animated.View
          key={`next-${displayNextIndex}`}
          style={[
            styles.backgroundImageWrapper,
            {
              opacity: nextImageOpacity,
            },
          ]}
        >
          <ImageBackground
            source={{ uri: backgroundImages[displayNextIndex] }}
            style={styles.backgroundImage}
            resizeMode="cover"
            onLoad={() => {
              // displayNextIndex가 nextImageIndex와 같으면 이미 로드된 것으로 간주
              // (초기 상태 또는 전환 완료 후 상태)
              // 모바일에서 완전히 렌더링될 시간을 충분히 주기 위해 긴 딜레이
              if (displayNextIndex === nextImageIndex && !isNextImageLoaded) {
                setTimeout(() => {
                  setIsNextImageLoaded(true);
                }, 300);
              }
            }}
          >
            <View style={styles.overlay} />
          </ImageBackground>
        </Animated.View>
      </View>

      {/* 컨텐츠 영역 */}
      <View style={styles.contentWrapper}>
        {/* 헤더 영역 */}
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <DivineLogo />
        </View>

        {/* 메인 콘텐츠 영역 */}
        <View style={styles.content}>
          <Text style={styles.mainText}>사주는 우주가</Text>
          <Text style={styles.mainText}>당신에게만 보낸</Text>
          <Text style={styles.mainText}>운명의 암호입니다.</Text>

          <Text style={styles.subText}>
            오직 당신만이 열 수 있는 비밀입니다.
          </Text>
          <Text style={styles.subText}>
            어딘가에 당신을 기다리는 사람이 있습니다.
          </Text>
          <Text style={styles.subText}>
            그 사람 또한 당신을 애타게 찾고 있을지 모릅니다.
          </Text>
          <Text style={styles.subText}>이제, 그 운명을 확인할 시간입니다.</Text>
        </View>

        {/* 시작하기 버튼 */}
        <View
          style={[
            styles.buttonContainer,
            { paddingBottom: insets.bottom + 20 },
          ]}
        >
          <LinearGradient
            colors={["#ec4899", "#f43f5e"]}
            style={styles.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <ButtonView
              title="운명 해독 시작하기"
              onPress={() => onNavigate("signupLogin")}
              buttonStyle={styles.startButton}
              textStyle={styles.startButtonText}
            />
          </LinearGradient>
        </View>
      </View>
    </View>
  );
};
export default SignupLandingScreen;
