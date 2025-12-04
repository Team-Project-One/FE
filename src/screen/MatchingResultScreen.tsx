import React, { useMemo, useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Animated, Modal } from 'react-native';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';

// Animated Circle 컴포넌트
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

import BackIcon from '../assets/back.svg';
import MaleIcon from '../assets/maleIcon.svg';
import FemaleIcon from '../assets/femaleIcon.svg';
import MaleAvatarIcon from '../assets/male.svg';
import FemaleAvatarIcon from '../assets/female.svg';
import DownArrow from '../assets/down-arrow.svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MatchingResultScreenProps } from '../types';
import BottomNavigation from '../components/BottomNavigation';
import ButtonView from '../components/ButtonView';
import { useTheme } from '../theme/ThemeContext';
import { MatchingResult, fetchMatchingResult } from '../api/matching';
import { API_BASE_URL } from '../api/config';
import { mapEnumToDisplayValue } from '../api/signup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiError } from '../api/client';

const genderLabelMap: Record<string, { label: string; icon: 'male' | 'female' }> = {
    MALE: { label: '남성', icon: 'male' },
    FEMALE: { label: '여성', icon: 'female' },
};

const sexualOrientationMap: Record<string, string> = {
    STRAIGHT: '이성애자',
    HOMOSEXUAL: '동성애자',
};

const formatEnumValue = (field: Parameters<typeof mapEnumToDisplayValue>[0], value: string | null | undefined) =>
    mapEnumToDisplayValue(field, value ?? null) || '정보 없음';

const getAgeFromBirth = (birthDate?: string | null) => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    if (Number.isNaN(birth.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
};

const MatchingResultScreen: React.FC<MatchingResultScreenProps> = ({ onNavigate, routeParams }) => {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [isExpanded, setIsExpanded] = useState(false);
    const [showNoMatchModal, setShowNoMatchModal] = useState(false);
    const [isRematching, setIsRematching] = useState(false);
    const animatedValue = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const scrollViewRef = useRef<ScrollView>(null);

    const matchResult: MatchingResult | undefined = routeParams?.matchResult;
    const fromChat = !!routeParams?.fromChat;
    const person = matchResult?.personInfo;
    const saju = matchResult?.sajuResponse;

    const profile = useMemo(() => {
        if (!person) {
            return null;
        }

        const genderInfo = person.gender ? genderLabelMap[person.gender] : undefined;
        const age = getAgeFromBirth(person.birthDate);
        const resolveProfileImage = (path?: string | null) => {
            if (!path) return null;
            if (path.startsWith('http://') || path.startsWith('https://')) {
                return path;
            }
            const base = API_BASE_URL.replace(/\/$/, '');
            const normalizedPath = path.startsWith('/') ? path : `/${path}`;
            return `${base}${normalizedPath}`;
        };
        const profileImage = resolveProfileImage(person.profileImagePath);

        return {
            userId: person.userId,
            name: person.name || '이름 미설정',
            age: age ?? undefined,
            genderIcon: genderInfo?.icon ?? 'female',
            genderLabel: genderInfo?.label ?? '미설정',
            job: formatEnumValue('job', person.job),
            location: formatEnumValue('region', person.region),
            mbti:
                !person.mbti || person.mbti === 'UNKNOWN'
                    ? '모름'
                    : person.mbti,
            drinking: formatEnumValue('drinkingFrequency', person.drinkingFrequency),
            sexualOrientation: sexualOrientationMap[person.sexualOrientation ?? ''] || '정보 없음',
            pets: formatEnumValue('petPreference', person.petPreference),
            height: person.height ? `${person.height}cm` : '정보 없음',
            contactfrequency: formatEnumValue('contactFrequency', person.contactFrequency),
            religion: formatEnumValue('religion', person.religion),
            smoking:
                person.smokingStatus === 'SMOKER'
                    ? '흡연'
                    : person.smokingStatus === 'NON_SMOKER'
                    ? '비흡연'
                    : '정보 없음',
            profileImage,
            selfIntroduction: person.introduction || '자기소개가 없습니다.',
        };
    }, [person]);

    // 도넛 차트 애니메이션
    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: false,
        }).start();
    }, []);

    // 매칭 결과가 변경될 때 스크롤을 최상단으로 이동
    useEffect(() => {
        if (matchResult) {
            setTimeout(() => {
                scrollViewRef.current?.scrollTo({ y: 0, animated: true });
            }, 100);
        }
    }, [matchResult]);

    // 터치 인터랙션 핸들러
    const handleChartPressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 1.1,
            useNativeDriver: true,
            tension: 300,
            friction: 10,
        }).start();
    };

    const handleChartPressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 300,
            friction: 10,
        }).start();
    };

    // 도넛 차트 계산
    const finalScore = Math.min(100, Math.max(0, saju?.finalScore ?? 0));
    const radius = 60;
    const strokeWidth = 12;
    const circumference = 2 * Math.PI * radius;

    if (!matchResult || !person || !saju || !profile) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ marginBottom: 16 }}>매칭 정보를 불러오지 못했습니다.</Text>
                <ButtonView title="돌아가기" onPress={() => onNavigate('main')} size="medium" />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#FFFFFF' }]}>
            <StatusBar style={isDark ? 'light' : 'dark'} />

            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 12 }]}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={[styles.header, { borderBottomColor: isDark ? '#333' : '#0000001A', paddingTop: insets.top }]}>
                    <TouchableOpacity 
                        onPress={() => {
                            // 채팅방에서 온 경우 채팅방으로 돌아가기
                            if (fromChat && routeParams?.chatRoomId) {
                                onNavigate('chatDetail', {
                                    chatRoomId: routeParams.chatRoomId,
                                    otherUserId: routeParams.otherUserId,
                                    chatName: routeParams.chatName,
                                    chatAge: routeParams.chatAge,
                                });
                            } else {
                                onNavigate('main');
                            }
                        }} 
                        style={styles.backButton}
                    >
                        <BackIcon width={24} height={24} color={isDark ? '#FFF' : '#000'} />
                    </TouchableOpacity>

                    <View style={styles.headerTextContainer}>
                        <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#1E2939' }]}>
                            {fromChat ? '프로필 정보' : '운명의 상대를 찾았어요!'}
                        </Text>
                        {!fromChat && (
                            <Text style={[styles.headerSubtitle, { color: isDark ? '#CCCCCC' : '#4A5565' }]}>
                                사주팔자 기반 완벽 매칭
                            </Text>
                        )}
                    </View>

                    <View style={styles.placeholder} />
                </View>

                {/* Profile Card */}
                <View style={[styles.profileCard, { 
                    backgroundColor: isDark 
                        ? '#111' 
                        : (profile.genderIcon === 'male' ? '#EFF6FF' : '#FDF2F8') // 남자: 파란색, 여자: 핑크색
                }]}>
                    <View style={styles.profileSection}>
                        <View style={styles.profileImageContainer}>
                            {profile.profileImage ? (
                                <Image source={{ uri: profile.profileImage }} style={styles.profileImage} />
                            ) : (
                                <View
                                    style={[
                                        styles.profileImagePlaceholder,
                                        {
                                            // 남자: 연파랑, 여자: 연핑크
                                            backgroundColor:
                                                profile.genderIcon === 'male' ? '#BFDBFE' : '#FCCEE8',
                                        },
                                    ]}
                                >
                                    {profile.genderIcon === 'male' ? (
                                        <MaleAvatarIcon width={72} height={72} />
                                    ) : (
                                        <FemaleAvatarIcon width={72} height={72} />
                                    )}
                                </View>
                            )}
                        </View>

                        <View style={styles.profileInfo}>
                            <View style={styles.nameRow}>
                                <Text style={[styles.userName, { color: isDark ? '#FFFFFF' : '#1E2939' }]}>
                                    {profile.name}
                                    {profile.age ? `(${profile.age})` : ''}
                                </Text>

                                {profile.genderIcon === 'male' ? (
                                    <MaleIcon width={24} height={24} />
                                ) : (
                                    <FemaleIcon width={24} height={24} />
                                )}
                            </View>

                            <Text style={[styles.userDetails, { color: isDark ? '#CCCCCC' : '#4A5565' }]}>
                                {profile.job} • {profile.location}
                            </Text>

                            {/* Score Section */}
                            <View style={styles.scoresContainer}>
                                <View style={styles.scoreRow}>
                                    <Text style={[styles.scoreLabel, { color: isDark ? '#BBB' : '#4A5565' }]}>
                                        연애 찰떡 점수
                                    </Text>
                                    <Text style={styles.scoreValueRed}>
                                        {(saju.originalScore ?? 0).toFixed(3)}
                                    </Text>
                                </View>

                                <View style={styles.scoreRow}>
                                    <Text style={[styles.scoreLabel, { color: isDark ? '#BBB' : '#4A5565' }]}>
                                        평생 인연 점수
                                    </Text>
                                    <Text style={styles.scoreValueRed}>
                                        {(saju.finalScore ?? 0).toFixed(3)}
                                    </Text>
                                </View>

                                <View style={styles.scoreRow}>
                                    <Text style={[styles.scoreLabel, { color: isDark ? '#BBB' : '#4A5565' }]}>
                                        투닥투닥 점수
                                    </Text>
                                    <Text style={styles.scoreValueGreen}>
                                        {(saju.stressScore ?? 0).toFixed(3)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* MBTI Section */}
                <View style={[styles.sectionCard, { 
                    backgroundColor: isDark 
                        ? '#111' 
                        : (profile.genderIcon === 'male' ? '#EFF6FF' : '#FDF2F8')
                }]}>
                    <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1E2939' }]}>MBTI</Text>
                    <View style={[
                        styles.mbtiTag,
                        {
                            backgroundColor: profile.genderIcon === 'male' ? '#DBEAFE' : '#FCE7F3', // 남자: 진한 파란색, 여자: 핑크색
                        }
                    ]}>
                        <Text style={[
                            styles.mbtiText,
                            {
                                color: profile.genderIcon === 'male' ? '#1E40AF' : '#BE185D', // 남자: 진한 파란색 텍스트, 여자: 핑크색 텍스트
                            }
                        ]}>{profile.mbti}</Text>
                    </View>
                </View>

                {/* Self Introduction */}
                <View style={[styles.sectionCard, { 
                    backgroundColor: isDark 
                        ? '#111' 
                        : (profile.genderIcon === 'male' ? '#EFF6FF' : '#FDF2F8')
                }]}>
                    <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1E2939' }]}>자기소개</Text>
                    <Text style={[styles.introText, { color: isDark ? '#CCCCCC' : '#364153' }]}>
                        {profile.selfIntroduction}
                    </Text>
                </View>

                {/* 사주 분석 - 도넛 차트 */}
                <View style={[styles.sectionCard, { 
                    backgroundColor: isDark 
                        ? '#111' 
                        : (profile.genderIcon === 'male' ? '#EFF6FF' : '#FDF2F8')
                }]}>
                    <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1E2939', marginBottom: 24 }]}>
                        사주 분석
                    </Text>
                    
                    <TouchableOpacity
                        activeOpacity={1}
                        onPressIn={handleChartPressIn}
                        onPressOut={handleChartPressOut}
                        style={styles.chartTouchable}
                    >
                        <Animated.View
                            style={[
                                styles.chartContainer,
                                {
                                    transform: [
                                        { scale: scaleAnim },
                                    ],
                                },
                            ]}
                        >
                            <Svg width={160} height={160} style={styles.chartSvg}>
                                <G rotation="-90" origin="80, 80">
                                    {/* 배경 원 */}
                                    <Circle
                                        cx="80"
                                        cy="80"
                                        r={radius}
                                        stroke={isDark ? '#333' : '#E5E7EB'}
                                        strokeWidth={strokeWidth}
                                        fill="transparent"
                                    />
                                    {/* 진행 원 (애니메이션) */}
                                    <AnimatedCircle
                                        cx="80"
                                        cy="80"
                                        r={radius}
                                        stroke={profile.genderIcon === 'male' ? '#3B82F6' : '#EC4899'}
                                        strokeWidth={strokeWidth}
                                        fill="transparent"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={animatedValue.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [circumference, circumference - (finalScore / 100) * circumference],
                                        })}
                                        strokeLinecap="round"
                                    />
                                </G>
                                {/* 중앙 텍스트 (숫자만) */}
                                <SvgText
                                    x="80"
                                    y="85"
                                    fontSize="40"
                                    fontWeight="700"
                                    fill={profile.genderIcon === 'male' ? '#1E40AF' : '#BE185D'}
                                    textAnchor="middle"
                                >
                                    {Math.round(finalScore)}
                                </SvgText>
                            </Svg>
                            
                            <View style={styles.chartLabelContainer}>
                                <Text style={[styles.chartLabel, { color: isDark ? '#FFFFFF' : '#1E2939' }]}>
                                    {saju.matchAnalysis ?? '매우 좋음'}
                                </Text>
                            </View>
                        </Animated.View>
                    </TouchableOpacity>
                </View>

                {/* Dropdown Section */}
                <View style={[styles.sectionCard, { 
                    backgroundColor: isDark 
                        ? '#111' 
                        : (profile.genderIcon === 'male' ? '#EFF6FF' : '#FDF2F8')
                }]}>
                    <TouchableOpacity style={styles.dropdownHeader} onPress={() => setIsExpanded(!isExpanded)}>
                        <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1E2939' }]}>기타 정보</Text>
                        <DownArrow
                            width={20}
                            height={20}
                            style={{ transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] }}
                        />
                    </TouchableOpacity>

                    {/* default 두 줄 */}
                    {!isExpanded && (
                        <>
                            <View style={styles.infoRow}>
                                <Text style={[styles.infoLabel, { color: isDark ? '#CCC' : '#4A5565' }]}>음주</Text>
                                <Text style={[styles.infoValue, { color: isDark ? '#EEE' : '#4A5565' }]}>
                                    {profile.drinking}
                                </Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Text style={[styles.infoLabel, { color: isDark ? '#CCC' : '#4A5565' }]}>
                                    흡연 여부
                                </Text>
                                <Text style={[styles.infoValue, { color: isDark ? '#EEE' : '#4A5565' }]}>
                                    {profile.smoking}
                                </Text>
                            </View>
                        </>
                    )}

                    {/* 펼친 상태 전체 */}
                    {isExpanded && (
                        <>
                            <View style={styles.infoRow}>
                                <Text style={[styles.infoLabel, { color: isDark ? '#CCC' : '#4A5565' }]}>음주</Text>
                                <Text style={[styles.infoValue, { color: isDark ? '#EEE' : '#4A5565' }]}>
                                    {profile.drinking}
                                </Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Text style={[styles.infoLabel, { color: isDark ? '#CCC' : '#4A5565' }]}>
                                    흡연 여부
                                </Text>
                                <Text style={[styles.infoValue, { color: isDark ? '#EEE' : '#4A5565' }]}>
                                    {profile.smoking}
                                </Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Text style={[styles.infoLabel, { color: isDark ? '#CCC' : '#4A5565' }]}>성지향성</Text>
                                <Text style={[styles.infoValue, { color: isDark ? '#EEE' : '#4A5565' }]}>
                                    {profile.sexualOrientation}
                                </Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Text style={[styles.infoLabel, { color: isDark ? '#CCC' : '#4A5565' }]}>키</Text>
                                <Text style={[styles.infoValue, { color: isDark ? '#EEE' : '#4A5565' }]}>
                                    {profile.height}
                                </Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Text style={[styles.infoLabel, { color: isDark ? '#CCC' : '#4A5565' }]}>반려동물</Text>
                                <Text style={[styles.infoValue, { color: isDark ? '#EEE' : '#4A5565' }]}>
                                    {profile.pets}
                                </Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Text style={[styles.infoLabel, { color: isDark ? '#CCC' : '#4A5565' }]}>종교</Text>
                                <Text style={[styles.infoValue, { color: isDark ? '#EEE' : '#4A5565' }]}>
                                    {profile.religion}
                                </Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Text style={[styles.infoLabel, { color: isDark ? '#CCC' : '#4A5565' }]}>
                                    연락 빈도
                                </Text>
                                <Text style={[styles.infoValue, { color: isDark ? '#EEE' : '#4A5565' }]}>
                                    {profile.contactfrequency}
                                </Text>
                            </View>
                        </>
                    )}
                </View>

                {/* Buttons - 매칭 진입 시에만 노출, 채팅방에서 온 경우 숨김 */}
                {!fromChat && (
                    <View style={styles.buttonContainer}>
                        <ButtonView
                            title="채팅하기"
                            icon="chatting"
                            onPress={() =>
                                onNavigate('chatDetail', {
                                    chatName: profile.name,
                                    chatAge: profile.age,
                                    otherUserId: profile.userId,
                                    showTip: true, // 매칭결과 화면에서 온 경우 모달 표시
                                })
                            }
                        />
                        <View style={styles.buttonSpacing} />
                        <ButtonView
                            title={isRematching ? "매칭 중..." : "다시 매칭하기"}
                            icon="rematching"
                            variant="outline"
                            disabled={isRematching}
                            onPress={async () => {
                                try {
                                    setIsRematching(true);
                                    const storedId = await AsyncStorage.getItem('@auth/userId');
                                    const numericId = storedId ? Number(storedId) : null;
                                    if (!numericId) {
                                        setShowNoMatchModal(true);
                                        return;
                                    }
                                    // 현재 표시된 사용자 ID를 제외하고 매칭
                                    const excludeUserId = person?.userId;
                                    const result = await fetchMatchingResult(numericId, excludeUserId);
                                    // 매칭 결과가 있으면 같은 화면으로 새로운 결과와 함께 이동
                                    onNavigate('matchingResult', { matchResult: result, fromChat: false });
                                    // 스크롤을 최상단으로 이동
                                    setTimeout(() => {
                                        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
                                    }, 100);
                                } catch (err: any) {
                                    // 매칭 가능한 사용자가 없는 경우는 정상적인 상황이므로 조용히 처리
                                    // 모든 에러에 대해 모달만 표시 (콘솔 에러는 표시하지 않음)
                                    setShowNoMatchModal(true);
                                } finally {
                                    setIsRematching(false);
                                }
                            }}
                        />
                    </View>
                )}
            </ScrollView>

            {/* 공용 안내 모달 */}
            <Modal
                visible={showNoMatchModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowNoMatchModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#1F2933' : '#FFFFFF' }]}>
                        <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#1E2939' }]}>
                            매칭 가능한 사용자가 없습니다!
                        </Text>
                        <Text style={[styles.modalMessage, { color: isDark ? '#E5E7EB' : '#4A5565' }]}>
                            잠시 후 다시 시도해 주세요.
                        </Text>

                        <View style={styles.modalButtonRow}>
                            <ButtonView title="확인" size="medium" onPress={() => setShowNoMatchModal(false)} />
                        </View>
                    </View>
                </View>
            </Modal>

                <BottomNavigation onNavigate={onNavigate} currentScreen="main" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 0,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
        borderBottomWidth: 1.35,
        paddingHorizontal: 24,
        paddingBottom: 20,
    },
    backButton: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTextContainer: { flex: 1, alignItems: 'center' },
    headerTitle: { fontSize: 20, fontWeight: '700' },
    headerSubtitle: { fontSize: 14, marginTop: 6 },
    placeholder: { width: 24, height: 24 },

    profileCard: {
        borderRadius: 14,
        padding: 24,
        marginBottom: 24,
    },
    profileSection: { flexDirection: 'row' },
    profileImageContainer: { marginRight: 16 },
    profileImage: { width: 96, height: 96, borderRadius: 48 },
    profileImagePlaceholder: {
        width: 96,
        height: 96,
        borderRadius: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },

    profileInfo: { flex: 1 },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    userName: { fontSize: 24, fontWeight: '700' },
    userDetails: {
        fontSize: 16,
        marginBottom: 7,
    },

    scoresContainer: { gap: 4 },
    scoreRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    scoreLabel: { fontSize: 14 },
    scoreValueRed: {
        fontSize: 14,
        color: '#DB2777',
    },
    scoreValueGreen: {
        fontSize: 14,
        color: '#00A63E',
    },

    sectionCard: {
        borderRadius: 10,
        padding: 16,
        marginBottom: 24,
    },
    sectionTitle: { fontSize: 16, marginBottom: 10, fontWeight: '400' },

    mbtiTag: {
        backgroundColor: '#FCE7F3',
        borderRadius: 10000,
        paddingVertical: 4,
        paddingHorizontal: 9,
        alignSelf: 'flex-start',
    },
    mbtiText: {
        fontSize: 14,
        fontWeight: '400',
        color: '#BE185D',
    },

    introText: {
        fontSize: 14,
        lineHeight: 24,
    },

    chartTouchable: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    chartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
    },
    chartSvg: {
        marginBottom: 16,
    },
    chartLabelContainer: {
        marginTop: 8,
    },
    chartLabel: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },

    dropdownHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },

    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    infoLabel: { fontSize: 14 },
    infoValue: { fontSize: 14 },

    buttonContainer: {
        marginTop: 10,
        marginBottom: 32,
    },
    buttonSpacing: {
        height: 12,
    },

    // 공용 모달 스타일
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    modalContent: {
        borderRadius: 16,
        paddingVertical: 24,
        paddingHorizontal: 20,
        width: '100%',
        maxWidth: 360,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 8,
        textAlign: 'center',
    },
    modalMessage: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
    },
    modalButtonRow: {
        width: '100%',
    },
});

export default MatchingResultScreen;
