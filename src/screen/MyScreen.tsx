import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Alert, TextInput, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackIcon from '../assets/back.svg';
import CameraIcon from '../assets/camera.svg';
import FemaleIcon from '../assets/femaleIcon.svg';
import PencilIcon from '../assets/pencil.svg';
import Pencil2Icon from '../assets/pencil2.svg';
import OptionIcon from '../assets/option.svg';
import LogoutIcon from '../assets/logout.svg';
import AvartarIcon from '../assets/female.svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { MyPageData, MyScreenProps } from '../types';
import BottomNavigation from '../components/BottomNavigation';
import { useTheme } from '../theme/ThemeContext';
import { fetchMyPage } from '../api/mypage';

const MyScreen: React.FC<MyScreenProps> = ({ onNavigate }) => {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [profilePhoto, setProfilePhoto] = useState('');
    const [profileData, setProfileData] = useState<MyPageData | null>(null);
    const [selfIntroduction, setSelfIntroduction] = useState('');
    const [isEditingIntro, setIsEditingIntro] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setIsLoading(true);
                const storedId = await AsyncStorage.getItem('@auth/userId');
                const numericId = storedId ? Number(storedId) : null;
                if (!numericId) {
                    setError('로그인 정보를 찾을 수 없습니다.');
                    setIsLoading(false);
                    return;
                }
                const data = await fetchMyPage(numericId);
                console.log('[MyScreen] fetched data', data);
                console.log('[MyScreen] fetched profile', data);
                setProfileData(data);
                setSelfIntroduction(data.introduction || '');
                if (data.profileImagePath) {
                    setProfilePhoto(data.profileImagePath);
                }
            } catch (err) {
                console.error('마이페이지 정보 조회 실패', err);
                setError('마이페이지 정보를 불러오지 못했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
    }, []);

    const handlePhotoUpload = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('권한 필요', '사진을 업로드하려면 갤러리 접근 권한이 필요합니다.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            setProfilePhoto(result.assets[0].uri);
        }
    };

    if (isLoading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#EC4899" />
            </View>
        );
    }

    if (error || !profileData) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }]}>
                <Text style={{ color: isDark ? '#FFF' : '#111', textAlign: 'center' }}>{error || '정보를 불러올 수 없습니다.'}</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#111' : '#FFFFFF' }]}>
            <StatusBar style={isDark ? 'light' : 'dark'} />

            {/* Header */}
            <View
                style={[
                    styles.header,
                    {
                        marginTop: insets.top,
                        borderBottomColor: isDark ? '#FFFFFF33' : '#0000001A',
                    },
                ]}
            >
                <TouchableOpacity onPress={() => onNavigate('main')} style={styles.backButton}>
                    <BackIcon width={24} height={24} color={isDark ? '#FFFFFF' : '#000000'} />
                </TouchableOpacity>

                <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>마이페이지</Text>

                <View style={styles.placeholder} />
            </View>

            {/* Content */}
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Profile Photo */}
                <View style={styles.profilePhotoContainer}>
                    <TouchableOpacity style={styles.profilePhotoButton} onPress={handlePhotoUpload}>
                        {profilePhoto ? (
                            <Image source={{ uri: profilePhoto }} style={styles.profilePhoto} />
                        ) : (
                            <View style={[styles.profilePhotoPlaceholder, { backgroundColor: '#FCCEE8' }]}>
                                <AvartarIcon width={50} height={50} />
                            </View>
                        )}

                        <View style={styles.cameraBadge}>
                            <CameraIcon width={28} height={28} />
                        </View>
                    </TouchableOpacity>

                    {/* Name + Gender */}
                    <View style={styles.nameContainer}>
                        <Text style={[styles.userName, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
                            {profileData.name}
                        </Text>

                        {profileData.gender === 'FEMALE' && <FemaleIcon width={24} height={24} style={{ paddingTop: 2 }} />}
                    </View>

                    <Text style={[styles.userDetails, { color: isDark ? '#BBBBBB' : '#4A5565' }]}>
                        {profileData.job || '직업 미설정'} · {profileData.region || '지역 미설정'}
                    </Text>
                </View>

                {/* Birth Date & MBTI */}
                <View style={styles.detailsRow}>
                    <View style={[styles.detailBox, { backgroundColor: isDark ? '#222' : '#F9FAFB' }]}>
                        <Text style={[styles.detailLabel, { color: isDark ? '#AAA' : '#6A7282' }]}>생년월일</Text>

                        <Text style={[styles.detailText, { color: isDark ? '#FFF' : '#1E2939' }]}>
                            {profileData.birthDate || '생년월일 미설정'}
                        </Text>
                    </View>

                    <View style={[styles.detailBox, { backgroundColor: isDark ? '#222' : '#F9FAFB' }]}>
                        <Text style={[styles.detailLabel, { color: isDark ? '#AAA' : '#6A7282' }]}>MBTI</Text>

                        <Text style={[styles.detailText, { color: isDark ? '#FFF' : '#1E2939' }]}>
                            {profileData.mbti || 'MBTI 미설정'}
                        </Text>
                    </View>
                </View>

                {/* Self Introduction */}
                <View style={styles.introContainer}>
                    <View style={styles.introHeaderRow}>
                        <Text style={[styles.introLabel, { color: isDark ? '#FFFFFF' : '#1E2939' }]}>자기소개</Text>

                        <TouchableOpacity style={styles.editButton} onPress={() => setIsEditingIntro(!isEditingIntro)}>
                            {isEditingIntro ? (
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                    <PencilIcon width={18} height={18} color="#EC4899" />
                                    <Text style={[styles.editButtonText, { color: '#EC4899' }]}>완료</Text>
                                </View>
                            ) : (
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                    <PencilIcon width={18} height={18} color={isDark ? '#AAA' : '#8D8D8D'} />
                                    <Text style={[styles.editButtonText, { color: isDark ? '#AAA' : '#8D8D8D' }]}>
                                        수정
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                    <View
                        style={[
                            styles.introBox,
                            {
                                backgroundColor: isDark ? '#222' : '#F9FAFB',
                                borderColor: isDark ? '#444' : '#D1D5DB',
                                borderWidth: isEditingIntro ? 1 : 0,
                            },
                        ]}
                    >
                        {isEditingIntro ? (
                            <TextInput
                                style={[styles.introInput, { color: isDark ? '#EEE' : '#6B7280' }]}
                                multiline
                                value={selfIntroduction}
                                onChangeText={setSelfIntroduction}
                                placeholder="자기소개를 입력하세요"
                                placeholderTextColor={isDark ? '#888' : '#999'}
                            />
                        ) : (
                            <Text style={[styles.introText, { color: isDark ? '#CCC' : '#364153' }]}>
                        {selfIntroduction || '자기소개가 없습니다.'}
                            </Text>
                        )}
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtonsContainer}>
                    <TouchableOpacity
                        style={[styles.editProfileButton, { backgroundColor: isDark ? '#222' : '#F9FAFB' }]}
                        onPress={() => onNavigate('profileEdit')}
                    >
                        <View style={styles.pencil2IconWrapper}>
                            <Pencil2Icon width={18} height={18} color={isDark ? '#FFF' : '#1E2939'} />
                        </View>
                        <Text style={[styles.editProfileButtonText, { color: isDark ? '#FFFFFF' : '#1E2939' }]}>
                            프로필 수정
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.settingsButton, { backgroundColor: isDark ? '#222' : '#F9FAFB' }]}
                        onPress={() => onNavigate('settings')}
                    >
                        <OptionIcon width={18} height={18} color={isDark ? '#FFF' : '#1E2939'} />
                        <Text style={[styles.settingsButtonText, { color: isDark ? '#FFFFFF' : '#1E2939' }]}>설정</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.logoutButton, { backgroundColor: isDark ? '#222' : '#F9FAFB' }]}
                        onPress={() => Alert.alert('알림', '로그아웃')}
                    >
                        <LogoutIcon width={18} height={18} color={isDark ? '#FFF' : '#1E2939'} />
                        <Text style={[styles.logoutButtonText, { color: isDark ? '#FFFFFF' : '#1E2939' }]}>
                            로그아웃
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={{ paddingBottom: insets.bottom }}>
                <BottomNavigation onNavigate={onNavigate} currentScreen={'mypage'} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 35,
        borderBottomWidth: 1.35,
    },

    backButton: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },

    headerTitle: {
        fontSize: 20,
        fontWeight: '400',
        lineHeight: 24,
    },

    placeholder: { width: 32 },

    content: {
        flexGrow: 1,
        paddingHorizontal: 24,
    },

    profilePhotoContainer: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 32,
    },

    profilePhotoButton: { position: 'relative', marginBottom: 16 },

    profilePhoto: { width: 96, height: 96, borderRadius: 64 },

    profilePhotoPlaceholder: {
        width: 96,
        height: 96,
        borderRadius: 64,
        justifyContent: 'center',
        alignItems: 'center',
    },

    profileEmoji: { fontSize: 50 },

    cameraBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 28,
        height: 28,
        borderRadius: 22,
        backgroundColor: '#F6339A',
        justifyContent: 'center',
        alignItems: 'center',
    },

    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 8,
    },

    userName: {
        fontSize: 20,
        fontWeight: '700',
        paddingLeft: 16,
    },

    userDetails: {
        fontSize: 16,
        lineHeight: 24,
    },

    detailsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 36,
    },

    detailBox: {
        flex: 1,
        borderRadius: 10,
        padding: 16,
        alignItems: 'center',
    },

    detailLabel: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 4,
    },

    detailText: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '400',
    },

    introContainer: { marginBottom: 24 },

    introHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },

    introLabel: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
    },

    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },

    editButtonText: {
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 20,
    },

    introBox: {
        borderRadius: 10,
        padding: 16,
        height: 80,
        flexDirection: 'row',
    },

    introInput: {
        flex: 1,
        height: 48,
        fontSize: 14,
        lineHeight: 24,
        textAlignVertical: 'top',
    },

    introText: { fontSize: 14, lineHeight: 24 },

    actionButtonsContainer: {
        gap: 16,
        marginBottom: 36,
    },

    editProfileButton: {
        height: 64,
        borderRadius: 10,
        paddingVertical: 16,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    editProfileButtonText: { fontSize: 16, lineHeight: 24 },

    settingsButton: {
        height: 64,
        borderRadius: 10,
        paddingVertical: 16,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    settingsButtonText: { fontSize: 16, lineHeight: 24 },

    logoutButton: {
        height: 64,
        borderRadius: 10,
        paddingVertical: 16,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    logoutButtonText: { fontSize: 16, lineHeight: 24 },

    pencil2IconWrapper: {
        width: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default MyScreen;
