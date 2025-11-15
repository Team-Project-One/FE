import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Alert, TextInput } from 'react-native';
import BackIcon from '../../assets/back.svg';
import CameraIcon from '../../assets/camera.svg';
import FemaleIcon from '../../assets/femaleIcon.svg';
import PencilIcon from '../../assets/pencil.svg';
import Pencil2Icon from '../../assets/pencil2.svg';
import OptionIcon from '../../assets/option.svg';
import LogoutIcon from '../../assets/logout.svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { MyScreenProps } from '../types';
import BottomNavigation from '../components/BottomNavigation';

// 더미 데이터
const dummyUserData = {
    name: '김명지',
    age: 20,
    gender: 'female',
    job: '직장인',
    location: '서울',
    birthDate: '2005-02-23',
    mbti: 'ESFP',
    selfIntroduction: 'LOZOLOZLOZ',
};

const MyScreen: React.FC<MyScreenProps> = ({ onNavigate }) => {
    const insets = useSafeAreaInsets();
    const [profilePhoto, setProfilePhoto] = useState('');
    const [selfIntroduction, setSelfIntroduction] = useState(dummyUserData.selfIntroduction);
    const [isEditingIntro, setIsEditingIntro] = useState(false);

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

    const genderIcon = dummyUserData.gender === 'male' ? '♂' : '♀';
    const genderColor = dummyUserData.gender === 'male' ? '#3B82F6' : '#F54144';

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={[styles.header, { marginTop: insets.top }]}>
                <TouchableOpacity onPress={() => onNavigate('main')} style={styles.backButton}>
                    <BackIcon width={24} height={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>마이페이지</Text>
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
                            <View style={styles.profilePhotoPlaceholder}>
                                <Text style={styles.profileEmoji}>👤</Text>
                            </View>
                        )}
                        <View style={styles.cameraBadge}>
                            <CameraIcon width={28} height={28} />
                        </View>
                    </TouchableOpacity>

                    {/* Name and Gender */}
                    <View style={styles.nameContainer}>
                        <Text style={styles.userName}>
                            {dummyUserData.name}({dummyUserData.age})
                        </Text>
                        {dummyUserData.gender === 'female' ? (
                            <FemaleIcon width={20} height={20} />
                        ) : (
                            <Text style={[styles.genderIcon, { color: genderColor }]}>{genderIcon}</Text>
                        )}
                    </View>
                    <Text style={styles.userDetails}>
                        {dummyUserData.job} · {dummyUserData.location}
                    </Text>
                </View>

                {/* Birth Date & MBTI */}
                <View style={styles.detailsRow}>
                    <View style={styles.detailBox}>
                        <Text style={styles.detailLabel}>생년월일</Text>
                        <Text style={styles.detailText}>{dummyUserData.birthDate}</Text>
                    </View>
                    <View style={styles.detailBox}>
                        <Text style={styles.detailLabel}>MBTI</Text>
                        <Text style={styles.detailText}>{dummyUserData.mbti}</Text>
                    </View>
                </View>

                {/* Self Introduction */}
                <View style={styles.introContainer}>
                    <View style={styles.introHeaderRow}>
                        <Text style={styles.introLabel}>자기소개</Text>
                        <TouchableOpacity style={styles.editButton} onPress={() => setIsEditingIntro(!isEditingIntro)}>
                            {isEditingIntro ? (
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                    <View style={styles.pencilIconWrapper}>
                                        <PencilIcon width={18} height={18} />
                                    </View>
                                    <Text style={[styles.editButtonText, styles.editPink]}>완료</Text>
                                </View>
                            ) : (
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                    <View style={styles.pencilIconWrapper}>
                                        <PencilIcon width={18} height={18} />
                                    </View>
                                    <Text style={[styles.editButtonText, styles.editGray]}>수정</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.introBox, isEditingIntro && styles.introBoxEditing]}>
                        {isEditingIntro ? (
                            <TextInput
                                style={styles.introInput}
                                multiline
                                value={selfIntroduction}
                                onChangeText={setSelfIntroduction}
                                placeholder="자기소개를 입력하세요"
                            />
                        ) : (
                            <Text style={styles.introText}>{selfIntroduction}</Text>
                        )}
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtonsContainer}>
                    <TouchableOpacity style={styles.editProfileButton} onPress={() => onNavigate('profileEdit')}>
                        <View style={styles.pencil2IconWrapper}>
                            <Pencil2Icon width={18} height={18} />
                        </View>
                        <Text style={styles.editProfileButtonText}>프로필 수정</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingsButton} onPress={() => onNavigate('settings')}>
                        <OptionIcon width={18} height={18} />
                        <Text style={styles.settingsButtonText}>설정</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.logoutButton} onPress={() => Alert.alert('알림', '로그아웃')}>
                        <LogoutIcon width={18} height={18} />
                        <Text style={styles.logoutButtonText}>로그아웃</Text>
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
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 35,
        borderBottomWidth: 1.35,
        borderBottomColor: '#0000001A',
    },
    backButton: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButtonImage: {
        width: 24,
        height: 24,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '400',
        lineHeight: 24,
        color: '#1F2937',
    },
    placeholder: {
        width: 32,
    },
    content: {
        flexGrow: 1,
        paddingHorizontal: 24,
    },
    profilePhotoContainer: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 32,
    },
    profilePhotoButton: {
        position: 'relative',
        marginBottom: 16,
    },
    profilePhoto: {
        width: 96,
        height: 96,
        borderRadius: 64,
    },
    profilePhotoPlaceholder: {
        width: 96,
        height: 96,
        borderRadius: 64,
        backgroundColor: '#FCCEE8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileEmoji: {
        fontSize: 50,
    },
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
    cameraIconImage: {
        width: 16,
        height: 16,
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
        color: '#1F2937',
        paddingLeft: 16,
    },
    genderIcon: {
        fontSize: 24,
    },
    femaleIcon: {
        width: 24,
        height: 24,
    },
    userDetails: {
        fontSize: 16,
        lineHeight: 24,
        color: '#4A5565',
    },
    detailsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 36,
    },
    detailBox: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        borderRadius: 10,
        padding: 16,
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: 14,
        lineHeight: 20,
        color: '#6A7282',
        marginBottom: 4,
    },
    detailText: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '400',
        color: '#1E2939',
    },
    introContainer: {
        marginBottom: 24,
    },
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
        color: '#1E2939',
    },
    editButtonText: {
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 20,
    },
    editGray: {
        color: '#8D8D8D',
    },
    editPink: {
        color: '#EC4899',
    },
    pencilGray: {
        tintColor: '#8D8D8D',
    },
    pencilPink: {
        tintColor: '#EC4899',
    },
    introText: {
        fontSize: 14,
        color: '#364153',
        lineHeight: 24,
    },
    introBox: {
        backgroundColor: '#F9FAFB',
        borderRadius: 10,
        padding: 16,
        height: 80,
        borderWidth: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    introBoxEditing: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
    },
    introInput: {
        flex: 1,
        height: 48,
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 24,
        paddingTop: 0,
        paddingBottom: 0,
        textAlignVertical: 'top',
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    editButtonActive: {
        backgroundColor: '#8D8D8D',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    pencilIconWrapper: {
        width: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pencilIcon: {
        width: 16,
        height: 16,
    },
    pencil2IconWrapper: {
        width: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editText: {
        fontSize: 14,
        lineHeight: 20,
        color: '#EC4899',
        fontWeight: '400',
    },
    doneText: {
        fontSize: 14,
        lineHeight: 20,
        color: '#8D8D8D',
        fontWeight: '400',
    },
    actionButtonsContainer: {
        gap: 16,
        marginBottom: 36,
    },
    editProfileButton: {
        backgroundColor: '#F9FAFB',
        height: 64,
        borderRadius: 10,
        paddingVertical: 16,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    editProfileIcon: {
        fontSize: 20,
    },
    editProfileButtonText: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
        color: '#1E2939',
    },
    settingsButton: {
        backgroundColor: '#F9FAFB',
        height: 64,
        borderRadius: 10,
        paddingVertical: 16,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    settingsIcon: {
        fontSize: 20,
    },
    settingsButtonText: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
        color: '#1E2939',
    },
    logoutButton: {
        backgroundColor: '#F9FAFB',
        height: 64,
        borderRadius: 10,
        paddingVertical: 16,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    logoutIcon: {
        fontSize: 20,
    },
    logoutButtonText: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
        color: '#1E2939',
    },
});

export default MyScreen;
