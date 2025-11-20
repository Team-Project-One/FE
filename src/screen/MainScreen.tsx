import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Platform, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MainScreenProps } from '../types';
import BottomNavigation from '../components/BottomNavigation';
import ButtonView from '../components/ButtonView';
import DivineIcon from '../assets/divine.svg';
import FortuneCookieIcon from '../assets/fortune-cookie.svg';
import SirenIcon from '../assets/siren.svg';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchTodayFortune, FortuneDTO } from '../api/fortune';
import { fetchMyPage } from '../api/mypage';
import { ApiError } from '../api/client';

const fortuneTexts = {
    총운: [
        '오늘은 새로운 시작을 위한 좋은 날입니다. 용기를 내어 한 발 더 나아가보세요.',
        '작은 변화가 큰 기회로 이어질 수 있는 날입니다. 주변을 살펴보세요.',
        '인내심을 가지고 기다린다면 좋은 결과가 있을 것입니다.',
    ],
    애정운: [
        '운명의 상대를 만날 수 있는 절호의 기회가 다가오고 있습니다.',
        '진실한 마음으로 다가간다면 상대방도 마음을 열 것입니다.',
        '소중한 인연을 놓치지 마세요. 적극적으로 다가가보세요.',
    ],
    금전운: [
        '계획적인 소비가 필요한 시기입니다. 신중하게 결정하세요.',
        '새로운 투자 기회가 있을 수 있습니다. 충분히 검토해보세요.',
        '절약하는 습관이 큰 도움이 될 것입니다.',
    ],
    직장운: [
        '새로운 프로젝트에 도전할 좋은 기회입니다. 자신감을 가지세요.',
        '동료와의 협력이 중요한 시기입니다. 소통을 강화하세요.',
        '승진이나 새로운 기회가 다가올 수 있습니다. 준비하세요.',
    ],
};

const categoryEmoji = {
    총운: '🔮',
    애정운: '❤️',
    금전운: '💰',
    직장운: '💼',
} as const;

const MainScreen: React.FC<MainScreenProps> = ({ onNavigate }) => {
    const insets = useSafeAreaInsets();
    const [showFortune, setShowFortune] = useState(false);
    const [showMatchingWarning, setShowMatchingWarning] = useState(false);
    const [warningChecked, setWarningChecked] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<keyof typeof fortuneTexts>('총운');
    const [fortuneData, setFortuneData] = useState<FortuneDTO | null>(null);
    const [isLoadingFortune, setIsLoadingFortune] = useState(false);
    const [birthDate, setBirthDate] = useState<string | null>(null);

    // 생년월일 가져오기
    useEffect(() => {
        const loadBirthDate = async () => {
            try {
                const storedId = await AsyncStorage.getItem('@auth/userId');
                const numericId = storedId ? Number(storedId) : null;
                if (numericId) {
                    const userData = await fetchMyPage(numericId);
                    setBirthDate(userData.birthDate);
                }
            } catch (err) {
                console.error('생년월일 로드 실패', err);
            }
        };
        loadBirthDate();
    }, []);

    const getFortuneByCategory = (category: keyof typeof fortuneTexts): string => {
        if (!fortuneData) {
            // API 데이터가 없으면 기존 랜덤 텍스트 사용
            const texts = fortuneTexts[category];
            return texts[Math.floor(Math.random() * texts.length)];
        }

        // API 데이터에서 카테고리별 운세 반환
        switch (category) {
            case '총운':
                return fortuneData.overallFortune;
            case '애정운':
                return fortuneData.loveFortune;
            case '금전운':
                return fortuneData.moneyFortune;
            case '직장운':
                return fortuneData.careerFortune;
            default:
                return '';
        }
    };

    const handleFortuneClick = async () => {
        setShowFortune(true);
        setSelectedCategory('총운');
        
        // 운세 데이터가 없으면 API 호출
        if (!fortuneData) {
            await loadFortuneData();
        }
    };

    const loadFortuneData = async () => {
        try {
            setIsLoadingFortune(true);
            const data = await fetchTodayFortune(birthDate);
            console.log('[MainScreen] Fortune data loaded', data);
            setFortuneData(data);
        } catch (err) {
            console.error('[MainScreen] Fortune load failed', err);
            // 에러 발생 시 기존 랜덤 텍스트 사용
        } finally {
            setIsLoadingFortune(false);
        }
    };

    const handleCategoryChange = async (category: keyof typeof fortuneTexts) => {
        setSelectedCategory(category);
        
        // 운세 데이터가 없으면 API 호출
        if (!fortuneData) {
            await loadFortuneData();
        }
    };

    const handleCloseFortune = () => {
        setShowFortune(false);
    };


    const handleMatchingClick = () => {
        setShowMatchingWarning(true);
        setWarningChecked(false);
    };

    const handleWarningConfirm = () => {
        if (warningChecked) {
            setShowMatchingWarning(false);
            onNavigate('matchingResult');
        }
    };

    const handleWarningClose = () => {
        setShowMatchingWarning(false);
        setWarningChecked(false);
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <ImageBackground
                source={require('../../assets/mainScreen.jpg')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
                    <View style={{ width: 96, height: 40 }}>
                        <DivineIcon width={96} height={63} />
                    </View>
                    <TouchableOpacity onPress={handleFortuneClick} style={styles.cookieButton}>
                        <View style={{ width: 40, height: 40 }}>
                            <FortuneCookieIcon width={40} height={40} />
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.overlay}>
                    <View style={styles.textContainer}>
                        <Text style={styles.greetingText}>운명의 상대를 만나보세요</Text>
                        <Text style={styles.descriptionText}>사주팔자로 찾는 완벽한 궁합</Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        <ButtonView title="매칭하기" onPress={handleMatchingClick} titleStyle={{ paddingBottom: 2 }} />
                    </View>
                </View>
            </ImageBackground>

            <BottomNavigation onNavigate={onNavigate} currentScreen={'main'} />

            {showFortune && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.fortuneCategoryWrapper}>
                            {(['총운', '애정운', '금전운', '직장운'] as const).map((category) => (
                                <TouchableOpacity
                                    key={category}
                                    style={[
                                        styles.fortuneCategoryLabel,
                                        selectedCategory === category && styles.fortuneCategoryLabelActive,
                                    ]}
                                    onPress={() => handleCategoryChange(category)}
                                >
                                    <Text
                                        style={[
                                            styles.fortuneCategoryLabelText,
                                            selectedCategory === category && styles.fortuneCategoryLabelTextActive,
                                        ]}
                                    >
                                        {category}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.fortuneModal}>
                            <Text style={styles.fortuneTitle}>
                                {selectedCategory}{' '}
                                <Text style={{ fontSize: 22 }}>{categoryEmoji[selectedCategory]}</Text>
                            </Text>

                            <View style={styles.fortuneBox}>
                                {isLoadingFortune ? (
                                    <ActivityIndicator size="small" color="#EC4899" />
                                ) : (
                                    <Text style={styles.fortuneMessage}>{getFortuneByCategory(selectedCategory)}</Text>
                                )}
                            </View>

                            <TouchableOpacity onPress={handleCloseFortune} activeOpacity={0.8}>
                                <LinearGradient
                                    colors={['#EC4899', '#F43F5E']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.fortuneConfirm}
                                >
                                    <Text style={styles.fortuneConfirmText}>확인</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            {showMatchingWarning && (
                <View style={styles.modalOverlay}>
                    <View style={styles.warningModalContent}>
                        <View style={styles.warningHeader}>
                            <View
                                style={{
                                    ...styles.sirenIconContainer,
                                    ...(Platform.OS === 'web' && {
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }),
                                }}
                            >
                                <SirenIcon width={28} height={28} style={[{ marginLeft: 91 }]} />
                            </View>
                            <Text style={styles.warningModalTitle}>매칭 주의사항</Text>
                            <TouchableOpacity onPress={handleWarningClose} style={styles.closeIcon}>
                                <Text style={[styles.closeIconText, { paddingBottom: 28 }, { paddingLeft: 2 }]}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.warningListBox}>
                            <Text style={styles.warningItem}>
                                • 정확한 사주 분석을 위해 진실한 정보를 제공해주세요.
                            </Text>
                            <Text style={styles.warningItem}>• 상대방에게 예의를 지켜주세요.</Text>
                            <Text style={styles.warningItem}>• 개인정보 보호를 위해 주의깊게 소통해주세요.</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.checkboxContainer}
                            onPress={() => setWarningChecked(!warningChecked)}
                        >
                            <View style={[styles.checkbox, warningChecked && styles.checkboxChecked]}>
                                {warningChecked && <Text style={styles.checkmark}>✓</Text>}
                            </View>
                            <Text style={styles.checkboxText}>주의사항을 확인했습니다.</Text>
                        </TouchableOpacity>

                        <ButtonView
                            title="완료"
                            onPress={handleWarningConfirm}
                            disabled={!warningChecked}
                            titleStyle={{ paddingBottom: 1 }}
                            size="medium"
                        />
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    backgroundImage: { flex: 1, width: '100%', height: '100%' },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingBottom: 12,
        zIndex: 10,
    },

    cookieButton: { width: 48, height: 48, justifyContent: 'center', alignItems: 'center' },

    overlay: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 48,
        paddingBottom: 0,
    },

    textContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 48 },

    greetingText: { fontSize: 25, fontWeight: '700', color: '#1E2939', marginBottom: 12, textAlign: 'center' },
    descriptionText: { fontSize: 18, color: '#4A5565', textAlign: 'center' },

    buttonContainer: { width: '100%', alignSelf: 'center', marginBottom: 48 },

    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },

    modalContainer: {
        width: '100%',
        maxWidth: 380,
        position: 'relative',
    },

    fortuneCategoryWrapper: {
        flexDirection: 'row',
        position: 'absolute',
        top: -36,
        alignSelf: 'center',
    },

    fortuneCategoryLabel: {
        backgroundColor: '#FCE7F3',
        paddingVertical: 8,
        paddingHorizontal: 17,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        marginHorizontal: 4,
    },

    fortuneCategoryLabelActive: {
        backgroundColor: '#FFFFFF',
    },

    fortuneCategoryLabelText: {
        fontSize: 14,
        lineHeight: 21,
        color: '#0A0A0A',
    },

    fortuneCategoryLabelTextActive: {
        color: '#DB2777',
        fontWeight: '700',
        lineHeight: 21,
    },

    fortuneModal: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingVertical: 32,
        paddingHorizontal: 24,
        width: '100%',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 12,
        elevation: 8,
    },

    fortuneTitle: {
        fontSize: 20,
        fontWeight: '700',
        lineHeight: 28,
        color: '#1E2939',
        textAlign: 'center',
        marginBottom: 24,
    },

    fortuneBox: {
        backgroundColor: '#FFF4F7',
        borderRadius: 20,
        padding: 24,
        paddingVertical: 36,
        marginBottom: 24,
    },

    fortuneMessage: {
        fontSize: 16,
        color: '#364153',
        textAlign: 'center',
        lineHeight: 26,
    },

    fortuneConfirm: {
        height: 52,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },

    fortuneConfirmText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
    },

    warningModalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingTop: 24,
        padding: 18,
        width: '100%',
        maxWidth: 400,
    },

    warningHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 24,
    },

    sirenIconContainer: {
        width: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },

    warningModalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1E2939',
        lineHeight: 28,
        flex: 1,
        textAlign: 'center',
    },

    closeIcon: { width: 16, height: 16, justifyContent: 'center', alignItems: 'center' },
    closeIconText: { fontSize: 16, color: '#0A0A0A', fontWeight: '300' },

    warningListBox: {
        backgroundColor: '#FEFCE8',
        borderRadius: 10,
        padding: 16,
        paddingBottom: 0,
        marginBottom: 18,
    },

    warningItem: { fontSize: 14, color: '#364153', lineHeight: 23, marginBottom: 12 },

    checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },

    checkbox: {
        width: 18,
        height: 18,
        borderWidth: 1.35,
        borderColor: '#4A5565',
        borderRadius: 4,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    checkboxChecked: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },

    checkmark: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },

    checkboxText: { fontSize: 14, color: '#4A5565' },
});

export default MainScreen;
