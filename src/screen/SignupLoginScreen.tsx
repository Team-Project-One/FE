import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { SignupLoginScreenProps } from '../types';
import DivineLogoSvg from '../assets/divine.svg';
import KakaoLoginSvg from '../assets/kakao-login.svg';

/**
 * 카카오 로그인 화면
 * 앱 시작 시 첫 화면으로, 카카오 로그인을 통해 회원가입 프로세스를 시작합니다.
 */
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SignupLoginScreen: React.FC<SignupLoginScreenProps> = ({ onNavigate }) => {
    // 카카오 로그인 버튼 클릭 시 기본 정보 입력 화면으로 이동
    const handleKakaoLogin = () => {
        console.log('카카오 로그인 시도');
        onNavigate('signupBasic');
    };

    return (
        <LinearGradient
            colors={['#FDF2F8', '#FCE7F3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.container}
        >
            <StatusBar style="dark" />

            <View style={styles.content}>
                <View style={styles.logoContainer}>
                    <DivineLogoSvg width={120} height={40} />
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.mainTitle}>운명의 상대를 만나보세요</Text>
                    <Text style={styles.subTitle}>사주팔자로 찾는 완벽한 궁합</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={handleKakaoLogin} activeOpacity={0.9}>
                        <KakaoLoginSvg width={SCREEN_WIDTH - 40} height={52} />
                    </TouchableOpacity>

                    <Text style={styles.disclaimerText}>
                        가입 시 서비스 이용약관 및 개인정보처리방침에 동의한 것으로 간주됩니다.
                    </Text>
                </View>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    logoContainer: {
        marginBottom: 40,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 60,
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#1E2939',
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 32,
    },
    subTitle: {
        fontSize: 16,
        fontWeight: '400',
        color: '#4A5565',
        textAlign: 'center',
        marginBottom: 48,
        lineHeight: 24,
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
    },
    disclaimerText: {
        marginTop: 16,
        fontSize: 12,
        fontWeight: '400',
        color: '#6B7280',
        textAlign: 'center',
        paddingHorizontal: 36,
        lineHeight: 19.5,
    },
});

export default SignupLoginScreen;
