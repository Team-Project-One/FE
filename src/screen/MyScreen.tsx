import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Alert, TextInput, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackIcon from '../assets/back.svg';
import CameraIcon from '../assets/camera.svg';
import FemaleIcon from '../assets/femaleIcon.svg';
import MaleIcon from '../assets/maleIcon.svg';
import PencilIcon from '../assets/pencil.svg';
import Pencil2Icon from '../assets/pencil2.svg';
import OptionIcon from '../assets/option.svg';
import LogoutIcon from '../assets/logout.svg';
import FemaleAvatarIcon from '../assets/female.svg';
import MaleAvatarIcon from '../assets/male.svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { MyPageData, MyScreenProps } from '../types';
import BottomNavigation from '../components/BottomNavigation';
import { useTheme } from '../theme/ThemeContext';
import { fetchMyPage, updateIntroduction, updateProfileImage, deleteProfileImage } from '../api/mypage';
import ConfirmModal from '../components/ConfirmModal';
import { API_BASE_URL } from '../api/config';
import { ApiError } from '../api/client';
import { mapEnumToDisplayValue } from '../api/signup';

const MyScreen: React.FC<MyScreenProps> = ({ onNavigate }) => {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [profilePhoto, setProfilePhoto] = useState('');
    const [profileData, setProfileData] = useState<MyPageData | null>(null);
    const [selfIntroduction, setSelfIntroduction] = useState('');
    const [isEditingIntro, setIsEditingIntro] = useState(false);
    const [isSavingIntro, setIsSavingIntro] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState(false);
    const [showLogoutErrorModal, setShowLogoutErrorModal] = useState(false);

    const resolveImageUri = (path?: string | null) => {
        if (!path) return '';
        if (path.startsWith('http://') || path.startsWith('https://')) {
            return path;
        }
        const base = API_BASE_URL.replace(/\/$/, '');
        const normalizedPath = path.startsWith('/') ? path : `/${path}`;
        return `${base}${normalizedPath}`;
    };

    const loadProfile = useCallback(async () => {
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
            setProfileData(data);
            setSelfIntroduction(data.introduction || '');
            if (data.profileImagePath) {
                const resolved = resolveImageUri(data.profileImagePath);
                console.log('[MyScreen] resolved profile photo', resolved);
                setProfilePhoto(resolved);
            } else {
                console.log('[MyScreen] no profile image path, clearing photo');
                setProfilePhoto('');
            }
        } catch (err) {
            console.error('마이페이지 정보 조회 실패', err);
            setError('마이페이지 정보를 불러오지 못했습니다.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    const handlePhotoUpload = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('권한 필요', '사진을 업로드하려면 갤러리 접근 권한이 필요합니다.');
                return;
            }

            // 기본 프로필 / 앨범 선택 옵션 제공
            Alert.alert(
                '프로필 사진',
                '프로필 사진을 어떻게 하시겠어요?',
                [
                    {
                        text: '기본 이미지로 변경',
                        style: 'destructive',
                        onPress: async () => {
                            try {
                                setIsUploadingPhoto(true);
                                const storedId = await AsyncStorage.getItem('@auth/userId');
                                const numericId = storedId ? Number(storedId) : null;
                                if (!numericId) {
                                    throw new Error('로그인 정보를 찾을 수 없습니다.');
                                }

                                await deleteProfileImage(numericId);
                                await loadProfile();
                                Alert.alert('완료', '기본 프로필 이미지로 변경되었습니다.');
                            } catch (err) {
                                console.error('[MyScreen] Failed to delete profile image', err);
                                Alert.alert('오류', '프로필 이미지를 삭제하지 못했습니다.');
                            } finally {
                                setIsUploadingPhoto(false);
                            }
                        },
                    },
                    {
                        text: '앨범에서 선택',
                        onPress: async () => {
                            const result = await ImagePicker.launchImageLibraryAsync({
                                mediaTypes: 'images',
                                allowsEditing: true,
                                aspect: [1, 1],
                                quality: 0.8,
                            });

                            if (!result.canceled && result.assets[0]) {
                                const asset = result.assets[0];
                                const previousPhoto = profilePhoto;
                                setProfilePhoto(asset.uri);

                                try {
                                    setIsUploadingPhoto(true);
                                    const storedId = await AsyncStorage.getItem('@auth/userId');
                                    const numericId = storedId ? Number(storedId) : null;
                                    if (!numericId) {
                                        throw new Error('로그인 정보를 찾을 수 없습니다.');
                                    }

                                    const uploadedPath = await updateProfileImage(numericId, {
                                        uri: asset.uri,
                                        name: asset.fileName ?? 'profile.jpg',
                                        type: asset.mimeType ?? 'image/jpeg',
                                    });

                                    if (uploadedPath) {
                                        await loadProfile();
                                    }
                                    Alert.alert('완료', '프로필 이미지가 변경되었습니다.');
                                } catch (uploadError) {
                                    console.error('[MyScreen] Failed to upload profile image', uploadError);
                                    Alert.alert('오류', '프로필 이미지를 업로드하지 못했습니다.');
                                    setProfilePhoto(previousPhoto);
                                } finally {
                                    setIsUploadingPhoto(false);
                                }
                            }
                        },
                    },
                    { text: '취소', style: 'cancel' },
                ],
                { cancelable: true }
            );
        } catch (err) {
            console.error('[MyScreen] handlePhotoUpload error', err);
            Alert.alert('오류', '프로필 이미지를 처리하는 중 문제가 발생했습니다.');
        }
    };

    const handleSaveIntroduction = async () => {
        try {
            setIsSavingIntro(true);
            const storedId = await AsyncStorage.getItem('@auth/userId');
            const numericId = storedId ? Number(storedId) : null;
            if (!numericId) {
                Alert.alert('오류', '로그인 정보를 찾을 수 없습니다.');
                setIsSavingIntro(false);
                return;
            }

            await updateIntroduction(numericId, selfIntroduction);
            console.log('[MyScreen] Introduction updated successfully');
            setIsEditingIntro(false);
            // 프로필 데이터도 업데이트
            if (profileData) {
                setProfileData({ ...profileData, introduction: selfIntroduction });
            }
        } catch (err) {
            console.error('[MyScreen] Introduction update failed', err);
            if (err instanceof ApiError || err instanceof Error) {
                Alert.alert('오류', err.message || '자기소개 수정 중 오류가 발생했습니다.');
            } else {
                Alert.alert('오류', '자기소개 수정 중 알 수 없는 오류가 발생했습니다.');
            }
        } finally {
            setIsSavingIntro(false);
        }
    };

    const handleLogout = () => {
        setShowLogoutConfirmModal(true);
    };

    const handleLogoutConfirm = async () => {
        setShowLogoutConfirmModal(false);
                    try {
                        await AsyncStorage.multiRemove(['@auth/accessToken', '@auth/refreshToken', '@auth/userId']);
                        onNavigate('signupLanding');
                    } catch (err) {
                        console.error('[MyScreen] Logout failed', err);
            setShowLogoutErrorModal(true);
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
                {/* 마이페이지 화면에서는 뒤로가기 버튼 제거 */}
                <View style={styles.backButton} />

                <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>마이페이지</Text>

                <View style={styles.placeholder} />
            </View>

            {/* Content */}
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Profile Photo */}
                <View style={styles.profilePhotoContainer}>
                    <TouchableOpacity style={styles.profilePhotoButton} onPress={handlePhotoUpload}>
                        <>
                            {profilePhoto ? (
                                <Image source={{ uri: profilePhoto }} style={styles.profilePhoto} />
                            ) : (
                                <View
                                    style={[
                                        styles.profilePhotoPlaceholder,
                                        {
                                            // 성별에 따라 기본 프로필 배경색 분기: 남자(파랑), 여자/기타(핑크)
                                            backgroundColor:
                                                profileData.gender === 'MALE' ? '#BFDBFE' : '#FCCEE8',
                                        },
                                    ]}
                                >
                                    {profileData.gender === 'MALE' ? (
                                        <MaleAvatarIcon width={50} height={50} />
                                    ) : (
                                        <FemaleAvatarIcon width={50} height={50} />
                                    )}
                                </View>
                            )}

                            <View style={styles.cameraBadge}>
                                <CameraIcon width={28} height={28} />
                            </View>

                            {isUploadingPhoto && (
                                <View style={styles.uploadingOverlay}>
                                    <ActivityIndicator size="small" color="#FFFFFF" />
                                </View>
                            )}
                        </>
                    </TouchableOpacity>

                    {/* Name + Gender */}
                    <View style={styles.nameContainer}>
                        <Text style={[styles.userName, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
                            {profileData.name}
                        </Text>

                        {profileData.gender === 'MALE' ? (
                            <MaleIcon width={24} height={24} style={{ paddingTop: 2 }} />
                        ) : profileData.gender === 'FEMALE' ? (
                            <FemaleIcon width={24} height={24} style={{ paddingTop: 2 }} />
                        ) : null}
                    </View>

                    <Text style={[styles.userDetails, { color: isDark ? '#BBBBBB' : '#4A5565' }]}>
                        {mapEnumToDisplayValue('job', profileData.job) || '직업 미설정'} · {mapEnumToDisplayValue('region', profileData.region) || '지역 미설정'}
                    </Text>
                </View>

                {/* Birth Date & MBTI */}
                <View style={styles.detailsRow}>
                    <View style={[styles.detailBox, { backgroundColor: profileData.gender === 'MALE' ? (isDark ? '#1E3A5F' : '#EFF6FF') : (isDark ? '#4A2A3A' : '#FDF2F8') }]}>
                        <Text style={[styles.detailLabel, { color: isDark ? '#AAA' : '#6A7282' }]}>생년월일</Text>

                        <Text style={[styles.detailText, { color: isDark ? '#FFF' : '#1E2939' }]}>
                            {profileData.birthDate || '생년월일 미설정'}
                        </Text>
                    </View>

                    <View style={[styles.detailBox, { backgroundColor: profileData.gender === 'MALE' ? (isDark ? '#1E3A5F' : '#EFF6FF') : (isDark ? '#4A2A3A' : '#FDF2F8') }]}>
                        <Text style={[styles.detailLabel, { color: isDark ? '#AAA' : '#6A7282' }]}>MBTI</Text>

                        <Text style={[styles.detailText, { color: isDark ? '#FFF' : '#1E2939' }]}>
                            {!profileData.mbti || profileData.mbti === 'UNKNOWN' ? '모름' : profileData.mbti}
                        </Text>
                    </View>
                </View>

                {/* Self Introduction */}
                <View style={styles.introContainer}>
                    <View style={styles.introHeaderRow}>
                        <Text style={[styles.introLabel, { color: isDark ? '#FFFFFF' : '#1E2939' }]}>자기소개</Text>

                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={async () => {
                                if (isEditingIntro) {
                                    // 완료 버튼 클릭 시 API 호출
                                    await handleSaveIntroduction();
                                } else {
                                    // 수정 버튼 클릭 시 편집 모드로 전환
                                    setIsEditingIntro(true);
                                }
                            }}
                            disabled={isSavingIntro}
                        >
                            {isEditingIntro ? (
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                    {isSavingIntro ? (
                                        <ActivityIndicator size="small" color="#EC4899" />
                                    ) : (
                                        <>
                                            <PencilIcon width={18} height={18} color="#EC4899" />
                                            <Text style={[styles.editButtonText, { color: '#EC4899' }]}>완료</Text>
                                        </>
                                    )}
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
                                backgroundColor: profileData.gender === 'MALE' ? (isDark ? '#1E3A5F' : '#EFF6FF') : (isDark ? '#4A2A3A' : '#FDF2F8'),
                            },
                        ]}
                    >
                        {isEditingIntro ? (
                            <TextInput
                                // 편집 시에도 보기 모드와 동일한 텍스트 색상 사용
                                style={[styles.introInput, { color: isDark ? '#CCC' : '#364153' }]}
                                multiline
                                scrollEnabled
                                maxLength={255}
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
                        style={[styles.editProfileButton, { backgroundColor: profileData.gender === 'MALE' ? (isDark ? '#1E3A5F' : '#EFF6FF') : (isDark ? '#4A2A3A' : '#FDF2F8') }]}
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
                        style={[styles.settingsButton, { backgroundColor: profileData.gender === 'MALE' ? (isDark ? '#1E3A5F' : '#EFF6FF') : (isDark ? '#4A2A3A' : '#FDF2F8') }]}
                        onPress={() => onNavigate('settings')}
                    >
                        <OptionIcon width={18} height={18} color={isDark ? '#FFF' : '#1E2939'} />
                        <Text style={[styles.settingsButtonText, { color: isDark ? '#FFFFFF' : '#1E2939' }]}>설정</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.logoutButton, { backgroundColor: profileData.gender === 'MALE' ? (isDark ? '#1E3A5F' : '#EFF6FF') : (isDark ? '#4A2A3A' : '#FDF2F8') }]}
                        onPress={handleLogout}
                    >
                        <LogoutIcon width={18} height={18} color={isDark ? '#FFF' : '#1E2939'} />
                        <Text style={[styles.logoutButtonText, { color: isDark ? '#FFFFFF' : '#1E2939' }]}>
                            로그아웃
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Bottom Navigation */}
            <BottomNavigation onNavigate={onNavigate} currentScreen={'mypage'} />
            <ConfirmModal
                visible={showLogoutConfirmModal}
                title="로그아웃"
                message="정말 로그아웃 하시겠어요?"
                confirmText="로그아웃"
                cancelText="취소"
                onConfirm={handleLogoutConfirm}
                onCancel={() => setShowLogoutConfirmModal(false)}
            />
            <ConfirmModal
                visible={showLogoutErrorModal}
                title="오류"
                message="로그아웃 중 문제가 발생했습니다."
                confirmText="확인"
                cancelText={undefined}
                onConfirm={() => setShowLogoutErrorModal(false)}
                onCancel={() => setShowLogoutErrorModal(false)}
            />
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

    uploadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 64,
        backgroundColor: 'rgba(0,0,0,0.5)',
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
        textAlign: 'center',
    },

    userDetails: {
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
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
        minHeight: 120, // 대략 5줄 정도 보이도록 높이 확보
        flexDirection: 'row',
    },

    introInput: {
        flex: 1,
        minHeight: 120, // 5줄 정도 기본 높이
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
