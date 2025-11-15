import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ImageBackground, Dimensions, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import ButtonView from '../components/ButtonView';
import { SignupLandingScreenProps } from '../types';
import DivineLogoSvg from '../../assets/divine.svg';

const { width, height } = Dimensions.get('window');

const backgroundImages = ['/couple1.jpg', '/couple2.jpg', '/couple3.jpg'];

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1a1a1a' },
    backgroundContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
    backgroundImageWrapper: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
    backgroundImage: { flex: 1, width: width, height: height },
    backgroundImageHidden: { position: 'absolute', width: width, height: height, opacity: 0 },
    overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)' },
    contentWrapper: { flex: 1, zIndex: 10 },
    header: { paddingHorizontal: 20, paddingBottom: 30, alignItems: 'center' },
    logoContainer: { alignItems: 'center', justifyContent: 'center' },
    content: { flex: 1, paddingHorizontal: 24, justifyContent: 'center', alignItems: 'center' },
    mainText: { fontSize: 30, fontWeight: '400', color: '#FFFFFF', textAlign: 'center', lineHeight: 48 },
    subText: {
        fontSize: 18,
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 28,
        marginBottom: 19,
    },
    caption: {
        fontSize: 15,
        fontWeight: '400',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 5,
        lineHeight: 26,
    },
    buttonContainer: { paddingHorizontal: 24, alignSelf: 'center', width: '100%', maxWidth: 480 },
});

const DivineLogo = () => (
    <View style={styles.logoContainer}>
        <DivineLogoSvg width={80} height={80} />
    </View>
);

const SignupLandingScreen: React.FC<SignupLandingScreenProps> = ({ onNavigate }) => {
    const insets = useSafeAreaInsets();

    // 전환 상태
    const [current, setCurrent] = useState(0);
    const [next, setNext] = useState(1);
    const [isNextReady, setIsNextReady] = useState(false);

    const fade = useRef(new Animated.Value(1)).current;
    const isTransitioning = useRef(false);

    // 전환 애니메이션
    const startTransition = (nextIndex: number) => {
        if (isTransitioning.current) return;
        isTransitioning.current = true;

        Animated.timing(fade, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
        }).start(() => {
            const newCurrent = nextIndex;
            const newNext = (newCurrent + 1) % backgroundImages.length;

            setCurrent(newCurrent);
            setNext(newNext);
            fade.setValue(1);

            isTransitioning.current = false;
            setIsNextReady(false);
        });
    };

    const DISPLAY_DURATION = 5000;

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isTransitioning.current && isNextReady) {
                startTransition(next);
            }
        }, DISPLAY_DURATION);

        return () => clearInterval(interval);
    }, [isNextReady, next]);

    const nextOpacity = fade.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
    });

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <View style={styles.backgroundContainer}>
                <Animated.View style={[styles.backgroundImageWrapper, { opacity: fade }]}>
                    <ImageBackground
                        source={{ uri: backgroundImages[current] }}
                        style={styles.backgroundImage}
                        resizeMode="cover"
                    >
                        <View style={styles.overlay} />
                    </ImageBackground>
                </Animated.View>

                <ImageBackground
                    source={{ uri: backgroundImages[next] }}
                    style={styles.backgroundImageHidden}
                    resizeMode="cover"
                    onLoad={() => setIsNextReady(true)}
                />

                <Animated.View style={[styles.backgroundImageWrapper, { opacity: nextOpacity }]}>
                    <ImageBackground
                        source={{ uri: backgroundImages[next] }}
                        style={styles.backgroundImage}
                        resizeMode="cover"
                    >
                        <View style={styles.overlay} />
                    </ImageBackground>
                </Animated.View>
            </View>

            <View style={styles.contentWrapper}>
                <View style={[styles.header, { paddingTop: insets.top }]}>
                    <DivineLogo />
                </View>

                <View style={styles.content}>
                    <Text style={styles.mainText}>사주는 우주가</Text>
                    <Text style={styles.mainText}>당신에게만 보낸</Text>
                    <Text style={[styles.mainText, { marginBottom: 22 }]}>운명의 암호입니다.</Text>

                    <Text style={styles.subText}>오직 당신만이 열 수 있는 비밀입니다.</Text>
                    <Text style={styles.caption}>어딘가에 당신을 기다리는 사람이 있습니다.</Text>
                    <Text style={styles.caption}>그 사람 또한 당신을 애타게 찾고 있을지 모릅니다.</Text>
                    <Text style={styles.caption}>이제, 그 운명을 확인할 시간입니다.</Text>
                </View>

                <View style={[styles.buttonContainer, { paddingBottom: 60 }]}>
                    <ButtonView
                        title="운명 해독 시작하기"
                        onPress={() => onNavigate('signupLogin')}
                        titleStyle={{ paddingBottom: 1 }}
                    />
                </View>
            </View>
        </View>
    );
};

export default SignupLandingScreen;
