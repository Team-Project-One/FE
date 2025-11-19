import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import ButtonView from '../components/ButtonView';
import { SignupSelfIntroScreenProps } from '../types';
import BasicProgressHeader from '../components/signup/BasicProgressHeader';
import { useSignup } from '../context/SignupContext';

const MAX_LEN = 500;

const GradientText: React.FC<{
    text: string;
    width: number;
    height: number;
    fontSize: number;
}> = ({ text, width, height, fontSize }) => {
    return (
        <Svg width={width} height={height}>
            <Defs>
                <SvgLinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <Stop offset="0%" stopColor="#EC4899" />
                    <Stop offset="100%" stopColor="#F54144" />
                </SvgLinearGradient>
            </Defs>
            <SvgText
                fill="url(#grad)"
                fontSize={fontSize}
                fontWeight="400"
                x={width / 2}
                y={height * 0.72}
                textAnchor="middle"
            >
                {text}
            </SvgText>
        </Svg>
    );
};

const SignupSelfIntroScreen: React.FC<SignupSelfIntroScreenProps> = ({ onNavigate, routeParams }) => {
    const insets = useSafeAreaInsets();
    const { signupData, updateSignupData } = useSignup();
    const [bio, setBio] = useState(signupData.introduction || '');

    const prevProgress = routeParams?.progress ?? 0.5;
    const currentProgress = 0.75;

    const handleNext = () => {
        updateSignupData({ introduction: bio.trim() });
        onNavigate('signupProfile', { progress: currentProgress });
    };

    return (
        <LinearGradient colors={['#FFFFFF', '#FFFFFF']} style={styles.container}>
            <LinearGradient
                colors={['rgba(252, 231, 243, 0.6)', 'rgba(253, 242, 248, 0.4)', 'rgba(255, 228, 230, 0.6)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.container}
            >
                <StatusBar style="auto" />

                <BasicProgressHeader
                    startProgress={prevProgress}
                    endProgress={currentProgress}
                    onBack={() => onNavigate('signupDetailed', { progress: 0.5 })}
                    top={insets.top + 28}
                    step={3}
                    totalSteps={4}
                />

                <View style={styles.titleContainer}>
                    <Text style={styles.headerTitle}>자기소개를 작성해주세요!</Text>
                </View>

                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>자기소개</Text>
                            <TextInput
                                style={styles.bioInput}
                                value={bio}
                                onChangeText={(t) => {
                                    if (t.length <= MAX_LEN) setBio(t);
                                }}
                                placeholder="취미, 관심사, 이상형, 좋아하거나 싫어하는 음식 등을 자유롭게 작성해주세요."
                                placeholderTextColor="#6B7280"
                                multiline
                                numberOfLines={5}
                                textAlignVertical="top"
                                scrollEnabled
                                maxLength={MAX_LEN}
                            />
                            <Text style={styles.counterText}>{`${bio.length}/${MAX_LEN}`}</Text>
                        </View>

                        <LinearGradient
                            colors={['#FCE7F3', '#FFE4E6']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.tipsBox}
                        >
                            <Text style={styles.tipsTitle}>자기소개 팁</Text>
                            <View style={styles.tipItem}>
                                <Text style={styles.tipText}>• 자신의 성격과 취미를 간단히 소개해보세요</Text>
                            </View>
                            <View style={styles.tipItem}>
                                <Text style={styles.tipText}>• 이상형이나 원하는 관계에 대해 언급하세요</Text>
                            </View>
                            <View style={styles.tipItem}>
                                <Text style={styles.tipText}>• 진솔하고 긍정적인 내용이 좋은 인상을 줍니다</Text>
                            </View>
                            <View style={styles.tipItem}>
                                <Text style={styles.tipText}>• 너무 길지 않게 핵심만 담아주세요</Text>
                            </View>
                        </LinearGradient>
                    </View>
                </ScrollView>

                <View style={[styles.footerContainer, { paddingBottom: 40 }]}>
                    <View style={styles.buttonContainer}>
                        <ButtonView title="다음" onPress={handleNext} />
                    </View>

                    <LinearGradient
                        colors={['#EC4899', '#F54144']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.skipButtonOuter}
                    >
                        <TouchableOpacity activeOpacity={0.8} onPress={handleNext} style={styles.skipButtonInner}>
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <GradientText text="건너뛰기" width={300} height={26} fontSize={16} />
                            </View>
                        </TouchableOpacity>
                    </LinearGradient>

                    <Text style={[styles.disclaimerText, { marginTop: 10 }]}>
                        추후 마이페이지에서 변경할 수 있습니다.
                    </Text>
                </View>
            </LinearGradient>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { flexGrow: 1, padding: 24 },
    titleContainer: {
        paddingHorizontal: 24,
        paddingBottom: 30,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1E2939',
        lineHeight: 28,
        textAlign: 'center',
    },
    formContainer: { gap: 12 },
    inputGroup: { gap: 8 },
    label: { fontSize: 16, fontWeight: '400', color: '#364153', lineHeight: 24 },
    bioInput: {
        borderWidth: 1.35,
        borderTopWidth: 1.35,
        borderColor: '#9CA3AF',
        borderTopColor: '#9CA3AF',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
        fontSize: 14,
        lineHeight: 24,
        minHeight: 124,
    },
    counterText: {
        alignSelf: 'flex-end',
        color: '#6A7282',
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 20,
        marginBottom: 16,
    },
    tipsBox: {
        padding: 16,
        borderRadius: 12,
    },
    tipsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4A5565',
        marginBottom: 7,
    },
    tipItem: { marginTop: 7 },
    tipText: {
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 20,
        color: '#4A5565',
    },
    footerContainer: {
        paddingHorizontal: 24,
        alignSelf: 'center',
        width: '100%',
        maxWidth: 480,
    },
    buttonContainer: { width: '100%', marginBottom: 12 },

    skipButtonOuter: {
        width: '100%',
        height: 64,
        padding: 1.35,
        borderRadius: 14,
    },
    skipButtonInner: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
    },

    disclaimerText: {
        fontSize: 14,
        fontWeight: '400',
        color: '#6A7282',
        textAlign: 'center',
    },
});

export default SignupSelfIntroScreen;
