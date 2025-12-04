import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ImageBackground, Dimensions, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import ButtonView from '../components/ButtonView';
import { SignupLandingScreenProps } from '../types';
import DivineLogoSvg from '../../assets/divine.svg';

const { width, height } = Dimensions.get('window');

const backgroundImages = [
    require('../../assets/mainScreen1.jpg'),
    require('../../assets/mainScreen2.jpg'),
    require('../../assets/mainScreen3.jpg'),
] as const;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1a1a1a' },
    backgroundContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
    backgroundImage: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width, height },
    animatedBackground: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
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

    const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0);
    const [nextBackgroundIndex, setNextBackgroundIndex] = useState(1);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const interval = setInterval(() => {
            const nextIdx = (currentBackgroundIndex + 1) % backgroundImages.length;
            setNextBackgroundIndex(nextIdx);
            fadeAnim.stopAnimation();
            fadeAnim.setValue(0);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true,
            }).start(() => {
                setCurrentBackgroundIndex(nextIdx);
                fadeAnim.setValue(1);
            });
        }, 5000);

        return () => clearInterval(interval);
    }, [currentBackgroundIndex, fadeAnim]);

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <View style={styles.backgroundContainer}>
                <Animated.Image
                    source={backgroundImages[currentBackgroundIndex]}
                    style={[
                        styles.backgroundImage,
                        {
                            opacity: fadeAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 0],
                            }),
                        },
                    ]}
                    resizeMode="cover"
                />
                <Animated.Image
                    source={backgroundImages[nextBackgroundIndex]}
                    style={[styles.backgroundImage, styles.animatedBackground, { opacity: fadeAnim }]}
                    resizeMode="cover"
                />
                <View style={styles.overlay} />
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
