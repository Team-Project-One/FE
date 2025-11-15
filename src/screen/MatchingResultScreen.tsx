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
    const profile = mockMatchData;

    const [isExpanded, setIsExpanded] = useState(false);

    const handleChat = () => {
        onNavigate('chatDetail', { chatName: '지은', chatAge: 26 });
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <ScrollView
                contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 12 }]}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => onNavigate('main')} style={styles.backButton}>
                        <BackIcon width={24} height={24} />
                    </TouchableOpacity>

                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerTitle}>운명의 상대를 찾았어요!</Text>
                        <Text style={styles.headerSubtitle}>사주팔자 기반 완벽 매칭</Text>
                    </View>

                    <View style={styles.placeholder} />
                </View>

                <View style={styles.profileCard}>
                    <View style={styles.profileSection}>
                        <View style={styles.profileImageContainer}>
                            {profile.profileImage ? (
                                <Image source={{ uri: profile.profileImage }} style={styles.profileImage} />
                            ) : (
                                <View style={styles.profileImagePlaceholder}>
                                    <Text style={styles.profileEmoji}>👤</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.profileInfo}>
                            <View style={styles.nameRow}>
                                <Text style={styles.userName}>
                                    {profile.name}({profile.age})
                                </Text>

                                {profile.gender === 'male' ? (
                                    <MaleIcon width={24} height={24} />
                                ) : (
                                    <FemaleIcon width={24} height={24} />
                                )}
                            </View>

                            <Text style={styles.userDetails}>
                                {profile.job} • {profile.location}
                            </Text>

                            <View style={styles.scoresContainer}>
                                <View style={styles.scoreRow}>
                                    <Text style={styles.scoreLabel}>Original Score</Text>
                                    <Text style={styles.scoreValueRed}>{profile.originalScore.toFixed(3)}</Text>
                                </View>
                                <View style={styles.scoreRow}>
                                    <Text style={styles.scoreLabel}>Final Score</Text>
                                    <Text style={styles.scoreValueRed}>{profile.finalScore.toFixed(3)}</Text>
                                </View>
                                <View style={styles.scoreRow}>
                                    <Text style={styles.scoreLabel}>Stress Score</Text>
                                    <Text style={styles.scoreValueGreen}>{profile.stressScore.toFixed(3)}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>MBTI</Text>
                    <View style={styles.mbtiTag}>
                        <Text style={styles.mbtiText}>{profile.mbti}</Text>
                    </View>
                </View>

                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>자기소개</Text>
                    <Text style={styles.introText}>{profile.selfIntroduction}</Text>
                </View>

                <View style={styles.sectionCard}>
                    <TouchableOpacity style={styles.dropdownHeader} onPress={() => setIsExpanded(!isExpanded)}>
                        <Text style={styles.sectionTitle}>기타 정보</Text>
                        <View style={{ paddingBottom: 14 }}>
                            <DownArrow
                                width={20}
                                height={20}
                                style={{ transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] }}
                            />
                        </View>
                    </TouchableOpacity>

                    {!isExpanded && (
                        <>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>음주</Text>
                                <Text style={styles.infoValue}>{profile.drinking}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>흡연 여부</Text>
                                <Text style={styles.infoValue}>{profile.smoking}</Text>
                            </View>
                        </>
                    )}

                    {isExpanded && (
                        <>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>음주</Text>
                                <Text style={styles.infoValue}>{profile.drinking}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>흡연 여부</Text>
                                <Text style={styles.infoValue}>{profile.smoking}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>성지향성</Text>
                                <Text style={styles.infoValue}>{profile.sexualOrientation}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>키</Text>
                                <Text style={styles.infoValue}>{profile.height}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>반려동물</Text>
                                <Text style={styles.infoValue}>{profile.pets}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>종교</Text>
                                <Text style={styles.infoValue}>{profile.religion}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>연락 빈도</Text>
                                <Text style={styles.infoValue}>{profile.contactfrequency}</Text>
                            </View>
                        </>
                    )}
                </View>

                <View style={styles.buttonContainer}>
                    <ButtonView title="채팅하기" icon="chatting" onPress={handleChat} />
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
                <BottomNavigation onNavigate={onNavigate} currentScreen={'main'} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 36,
    },
    backButton: {
        width: 24,
        height: 24,
        marginTop: 14,
    },
    headerTextContainer: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        lineHeight: 28,
        color: '#1E2939',
        paddingTop: 48,
        textAlign: 'center',
    },
    headerSubtitle: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '400',
        color: '#4A5565',
        marginTop: 8,
        textAlign: 'center',
    },
    placeholder: {
        width: 32,
    },
    profileCard: {
        backgroundColor: '#FDF2F8',
        borderRadius: 14,
        padding: 24,
        marginBottom: 24,
    },
    profileSection: {
        flexDirection: 'row',
    },
    profileImageContainer: {
        marginRight: 16,
    },
    profileImage: {
        width: 96,
        height: 96,
        borderRadius: 48,
    },
    profileImagePlaceholder: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileEmoji: {
        fontSize: 48,
    },
    profileInfo: {
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    userName: {
        fontSize: 24,
        fontWeight: '700',
        lineHeight: 32,
        color: '#1E2939',
    },
    userDetails: {
        fontSize: 16,
        color: '#4A5565',
        lineHeight: 24,
        marginBottom: 7,
    },
    scoresContainer: {
        gap: 4,
    },
    scoreRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    scoreLabel: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '400',
        color: '#4A5565',
    },
    scoreValueRed: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '400',
        color: '#DB2777',
    },
    scoreValueGreen: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '400',
        color: '#00A63E',
    },
    sectionCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: 10,
        padding: 16,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
        color: '#1E2939',
        marginBottom: 10,
    },
    dropdownHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
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
        lineHeight: 20,
        color: '#BE185D',
    },
    introText: {
        fontSize: 14,
        color: '#364153',
        lineHeight: 24,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    infoLabel: {
        fontSize: 14,
        color: '#4A5565',
        lineHeight: 20,
    },
    infoValue: {
        fontSize: 14,
        lineHeight: 20,
        color: '#4A5565',
    },
    buttonContainer: {
        marginTop: 10,
        marginBottom: 32,
    },
    buttonSpacing: {
        height: 12,
    },
});

export default MatchingResultScreen;
