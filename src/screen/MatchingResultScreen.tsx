import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import BackIcon from '../../assets/back.svg';
import MaleIcon from '../../assets/male.svg';
import FemaleIcon from '../../assets/femaleIcon.svg';
import DownArrow from '../assets/down-arrow.svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MatchingResultScreenProps } from '../types';
import BottomNavigation from '../components/BottomNavigation';
import ButtonView from '../components/ButtonView';
import { useTheme } from '../theme/ThemeContext';

const mockMatchData = {
    name: '지은',
    age: 26,
    gender: 'female',
    job: '디자이너',
    location: '강남구',
    originalScore: 85.123,
    finalScore: 92.456,
    stressScore: 23.789,
    mbti: 'ENFP',
    drinking: '주 1회 이하',
    sexualOrientation: '이성애자',
    pets: '고양이',
    height: '168cm',
    education: '학생',
    contactfrequency: '중요함',
    religion: '무교',
    smoking: '비흡연',
    profileImage:
        'https://images.unsplash.com/photo-1708000609854-72c89a2fb689?crop=entropy&cs=tinysrgb&fit=max&fm=jpg',
    selfIntroduction:
        '안녕하세요! 따뜻한 사람과 진솔한 대화를 나누며 함께 성장하는 관계를 원합니다. 영화와 카페 투어를 좋아하고, 주말에는 요리하는 것을 즐겨요.',
};

const MatchingResultScreen: React.FC<MatchingResultScreenProps> = ({ onNavigate }) => {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const profile = mockMatchData;
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#FFFFFF' }]}>
            <StatusBar style={isDark ? 'light' : 'dark'} />

            <ScrollView
                contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 12 }]}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={[styles.header, { borderBottomColor: isDark ? '#333' : '#0000001A' }]}>
                    <TouchableOpacity onPress={() => onNavigate('main')} style={styles.backButton}>
                        <BackIcon width={24} height={24} color={isDark ? '#FFF' : '#000'} />
                    </TouchableOpacity>

                    <View style={styles.headerTextContainer}>
                        <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#1E2939' }]}>
                            운명의 상대를 찾았어요!
                        </Text>
                        <Text style={[styles.headerSubtitle, { color: isDark ? '#CCCCCC' : '#4A5565' }]}>
                            사주팔자 기반 완벽 매칭
                        </Text>
                    </View>

                    <View style={styles.placeholder} />
                </View>

                {/* Profile Card */}
                <View style={[styles.profileCard, { backgroundColor: isDark ? '#111' : '#FDF2F8' }]}>
                    <View style={styles.profileSection}>
                        <View style={styles.profileImageContainer}>
                            {profile.profileImage ? (
                                <Image source={{ uri: profile.profileImage }} style={styles.profileImage} />
                            ) : (
                                <View
                                    style={[
                                        styles.profileImagePlaceholder,
                                        { backgroundColor: isDark ? '#333' : '#E5E7EB' },
                                    ]}
                                >
                                    <Text style={{ fontSize: 48, color: isDark ? '#FFF' : '#000' }}>👤</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.profileInfo}>
                            <View style={styles.nameRow}>
                                <Text style={[styles.userName, { color: isDark ? '#FFFFFF' : '#1E2939' }]}>
                                    {profile.name}({profile.age})
                                </Text>

                                {profile.gender === 'male' ? (
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
                                        Original Score
                                    </Text>
                                    <Text style={styles.scoreValueRed}>{profile.originalScore.toFixed(3)}</Text>
                                </View>

                                <View style={styles.scoreRow}>
                                    <Text style={[styles.scoreLabel, { color: isDark ? '#BBB' : '#4A5565' }]}>
                                        Final Score
                                    </Text>
                                    <Text style={styles.scoreValueRed}>{profile.finalScore.toFixed(3)}</Text>
                                </View>

                                <View style={styles.scoreRow}>
                                    <Text style={[styles.scoreLabel, { color: isDark ? '#BBB' : '#4A5565' }]}>
                                        Stress Score
                                    </Text>
                                    <Text style={styles.scoreValueGreen}>{profile.stressScore.toFixed(3)}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* MBTI Section */}
                <View style={[styles.sectionCard, { backgroundColor: isDark ? '#111' : '#F9FAFB' }]}>
                    <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1E2939' }]}>MBTI</Text>
                    <View style={styles.mbtiTag}>
                        <Text style={styles.mbtiText}>{profile.mbti}</Text>
                    </View>
                </View>

                {/* Self Introduction */}
                <View style={[styles.sectionCard, { backgroundColor: isDark ? '#111' : '#F9FAFB' }]}>
                    <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1E2939' }]}>자기소개</Text>
                    <Text style={[styles.introText, { color: isDark ? '#CCCCCC' : '#364153' }]}>
                        {profile.selfIntroduction}
                    </Text>
                </View>

                {/* Dropdown Section */}
                <View style={[styles.sectionCard, { backgroundColor: isDark ? '#111' : '#F9FAFB' }]}>
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

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    <ButtonView
                        title="채팅하기"
                        icon="chatting"
                        onPress={() =>
                            onNavigate('chatDetail', {
                                chatName: profile.name,
                                chatAge: profile.age,
                            })
                        }
                    />
                    <View style={styles.buttonSpacing} />
                    <ButtonView
                        title="다시 매칭하기"
                        icon="rematching"
                        variant="outline"
                        onPress={() => onNavigate('main')}
                    />
                </View>
            </ScrollView>

            <View style={{ paddingBottom: insets.bottom }}>
                <BottomNavigation onNavigate={onNavigate} currentScreen="main" />
            </View>
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
        marginBottom: 36,
        borderBottomWidth: 1.35,
    },
    backButton: {
        width: 24,
        height: 24,
        marginTop: 14,
    },
    headerTextContainer: { flex: 1, alignItems: 'center' },
    headerTitle: { fontSize: 20, fontWeight: '700', paddingTop: 48 },
    headerSubtitle: { fontSize: 16, marginTop: 8 },

    placeholder: { width: 32 },

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
});

export default MatchingResultScreen;
