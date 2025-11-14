import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Animated, Modal, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import ButtonView from '../components/ButtonView';
import { SignupProfileScreenProps } from '../types';
import BasicProgressHeader from '../components/signup/BasicProgressHeader';
import ProfileSvg from '../../assets/profile.svg';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Text as SvgText } from 'react-native-svg';

const GradientText = ({ text, width, height, fontSize }: any) => {
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

const SignupProfileScreen: React.FC<SignupProfileScreenProps> = ({ onNavigate }) => {
    const insets = useSafeAreaInsets();
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modalAnimation] = useState(new Animated.Value(0));

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('사진 접근 권한이 필요합니다.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled && result.assets[0]) {
            setProfileImage(result.assets[0].uri);
        }
    };

    useEffect(() => {
        if (showSuccessModal) {
            Animated.spring(modalAnimation, {
                toValue: 1,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(modalAnimation, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [showSuccessModal]);

    const handleComplete = () => {
        setShowSuccessModal(true);
    };

    const handleStart = () => {
        setShowSuccessModal(false);
        onNavigate('home');
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
                    startProgress={0.75}
                    endProgress={1}
                    onBack={() => onNavigate('signupSelfIntro')}
                    top={insets.top + 28}
                    step={4}
                    totalSteps={4}
                />

                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.titleContainer}>
                        <Text style={styles.headerTitle}>프로필 사진을 등록해주세요!</Text>
                        <Text style={styles.subtitle}>매력적인 사진으로 좋은 인상을 남겨보세요</Text>
                    </View>

                    <View style={styles.profileContainer}>
                        <TouchableOpacity style={styles.profileButton} activeOpacity={0.8} onPress={pickImage}>
                            {profileImage ? (
                                <Image source={{ uri: profileImage }} style={styles.profileImage} resizeMode="cover" />
                            ) : (
                                <ProfileSvg width={200} height={200} />
                            )}
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.noteText}>프로필 사진은 추후 마이페이지에서 변경할 수 있습니다</Text>
                </ScrollView>

                <View style={[styles.footerContainer, { paddingBottom: 40 }]}>
                    <View style={styles.buttonContainer}>
                        <ButtonView title="가입 완료" onPress={handleComplete} />
                    </View>

                    <LinearGradient
                        colors={['#EC4899', '#F54144']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.skipButtonOuter}
                    >
                        <TouchableOpacity activeOpacity={0.8} onPress={handleComplete} style={styles.skipButtonInner}>
                            <GradientText text="건너뛰기" width={300} height={26} fontSize={16} />
                        </TouchableOpacity>
                    </LinearGradient>

                    <Text style={[styles.disclaimerText, { marginTop: 10 }]}>
                        입력하신 정보는 매칭을 위해서만 사용됩니다.
                    </Text>
                </View>

                <Modal
                    visible={showSuccessModal}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShowSuccessModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <Animated.View
                            style={[
                                styles.modalContent,
                                {
                                    transform: [
                                        {
                                            scale: modalAnimation.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0.8, 1],
                                            }),
                                        },
                                    ],
                                    opacity: modalAnimation,
                                },
                            ]}
                        >
                            <Text style={styles.modalTitle}>가입을 축하합니다! 🎉</Text>
                            <Text style={styles.modalMessage}>운명의 상대를 지금 바로 만나보세요!</Text>

                            <TouchableOpacity style={styles.modalButton} onPress={handleStart} activeOpacity={0.8}>
                                <LinearGradient
                                    colors={['#EC4899', '#F43F5E']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.modalButtonGradient}
                                >
                                    <Text style={styles.modalButtonText}>시작하기</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </Modal>
            </LinearGradient>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },

    content: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 0,
    },

    titleContainer: {
        paddingHorizontal: 24,
        paddingTop: 34,
        paddingBottom: 30,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1E2939',
        lineHeight: 30,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#4A5565',
        textAlign: 'center',
        lineHeight: 24,
        marginTop: 8,
    },

    profileContainer: {
        alignItems: 'center',
        marginBottom: 32,
        marginTop: 5,
    },
    profileButton: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
    },

    noteText: {
        fontSize: 14,
        color: '#6A7282',
        textAlign: 'center',
        lineHeight: 20,
        marginTop: 10,
        marginBottom: 20,
    },

    footerContainer: {
        paddingHorizontal: 24,
        alignSelf: 'center',
        width: '100%',
        maxWidth: 480,
    },

    buttonContainer: {
        width: '100%',
        marginBottom: 12,
    },

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

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 32,
        width: 360,
        height: 220,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1E2939',
        marginBottom: 30,
        lineHeight: 28,
        textAlign: 'center',
    },
    modalMessage: {
        fontSize: 16,
        color: '#4A5565',
        textAlign: 'center',
        marginBottom: 28,
        lineHeight: 24,
    },
    modalButton: {
        width: 320,
        borderRadius: 14,
        overflow: 'hidden',
    },
    modalButtonGradient: {
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalButtonText: {
        fontSize: 18,
        fontWeight: '400',
        lineHeight: 20,
        color: '#FFFFFF',
    },
});

export default SignupProfileScreen;
