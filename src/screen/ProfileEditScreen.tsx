import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ButtonView from '../components/ButtonView';

import JobSelector from '../components/signupDetailed/JobSelector';
import RegionSelector from '../components/signupDetailed/RegionSelector';
import DrinkingSelector from '../components/signupDetailed/DrinkingSelector';
import SmokingSelector from '../components/signupDetailed/SmokingSelector';
import HeightInput from '../components/signupDetailed/HeightInput';
import PetsSelector from '../components/signupDetailed/PetsSelector';
import ReligionSelector from '../components/signupDetailed/ReligionSelector';
import ContactFrequencySelector from '../components/signupDetailed/ContactFrequencySelector';
import MbtiSelector from '../components/signupDetailed/MbtiSelector';

import { SignupDetailedScreenProps, SignupDetailedFormData } from '../types';
import styles from '../styles/signup/singupDetailedStyles';
import BackIcon from '../assets/back.svg';
import { useTheme } from '../theme/ThemeContext';
import { fetchMyPage, updateProfile } from '../api/mypage';
import { mapEnumToDisplayValue } from '../api/signup';
import { ApiError } from '../api/client';

const ProfileEditScreen: React.FC<SignupDetailedScreenProps> = ({ onNavigate }) => {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [formData, setFormData] = useState<SignupDetailedFormData>({
        job: '',
        region: '',
        drinkingFrequency: '',
        smokingStatus: '',
        height: '',
        pets: '',
        religion: '',
        contactFrequency: '',
        mbti: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // DB에서 프로필 데이터를 가져와서 formData에 설정
    useEffect(() => {
        const loadProfileData = async () => {
            try {
                const storedId = await AsyncStorage.getItem('@auth/userId');
                const numericId = storedId ? Number(storedId) : null;
                if (!numericId) {
                    console.error('로그인 정보를 찾을 수 없습니다.');
                    return;
                }
                const data = await fetchMyPage(numericId);
                console.log('[ProfileEditScreen] fetched data', data);
                
                // DB 데이터를 formData 형식으로 변환 (Enum → 한글)
                setFormData({
                    job: mapEnumToDisplayValue('job', data.job),
                    region: mapEnumToDisplayValue('region', data.region),
                    drinkingFrequency: mapEnumToDisplayValue('drinkingFrequency', data.drinkingFrequency),
                    smokingStatus: mapEnumToDisplayValue('smokingStatus', data.smokingStatus),
                    height: data.height ? String(data.height) : '',
                    pets: mapEnumToDisplayValue('petPreference', data.petPreference),
                    religion: mapEnumToDisplayValue('religion', data.religion),
                    contactFrequency: mapEnumToDisplayValue('contactFrequency', data.contactFrequency),
                    mbti: data.mbti || '',
                });
            } catch (err) {
                console.error('프로필 정보 조회 실패', err);
            }
        };

        loadProfileData();
    }, []);

    const handleChange = (field: keyof SignupDetailedFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleComplete = async () => {
        console.log('[ProfileEditScreen] handleComplete called');
        console.log('[ProfileEditScreen] formData:', formData);
        try {
            setIsSubmitting(true);
            const storedId = await AsyncStorage.getItem('@auth/userId');
            const numericId = storedId ? Number(storedId) : null;
            if (!numericId) {
                console.error('[ProfileEditScreen] No userId found');
                Alert.alert('오류', '로그인 정보를 찾을 수 없습니다.');
                setIsSubmitting(false);
                return;
            }

            console.log('[ProfileEditScreen] Calling updateProfile with userId:', numericId);
            await updateProfile(numericId, formData);
            console.log('[ProfileEditScreen] Profile updated successfully');
            Alert.alert('성공', '프로필이 수정되었습니다.', [
                {
                    text: '확인',
                    onPress: () => onNavigate('mypage'),
                },
            ]);
        } catch (err) {
            console.error('[ProfileEditScreen] Profile update failed', err);
            if (err instanceof ApiError || err instanceof Error) {
                Alert.alert('오류', err.message || '프로필 수정 중 오류가 발생했습니다.');
            } else {
                Alert.alert('오류', '프로필 수정 중 알 수 없는 오류가 발생했습니다.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // 다크모드 컬러셋
    const colorSet = {
        bg: isDark ? '#111111' : '#FFFFFF',
        text: isDark ? '#FFFFFF' : '#1F2937',
        subText: isDark ? '#AAAAAA' : '#1E2939',

        selectorBg: isDark ? '#1E1E1E' : '#FFFFFF',
        selectorBorder: isDark ? '#333333' : '#9CA3AF',
        selectorText: isDark ? '#FFFFFF' : '#364153',
    };

    return (
        <View style={{ flex: 1, backgroundColor: colorSet.bg }}>
            <StatusBar style={isDark ? 'light' : 'dark'} />

            {/* Header */}
            <View
                style={[
                    localStyles.header,
                    {
                        marginTop: insets.top,
                        borderBottomColor: isDark ? '#FFFFFF33' : '#0000001A',
                    },
                ]}
            >
                <TouchableOpacity onPress={() => onNavigate('main')} style={localStyles.backButton}>
                    <BackIcon width={24} height={24} color={colorSet.text} />
                </TouchableOpacity>

                <Text style={[localStyles.headerTitle, { color: colorSet.text }]}>프로필 수정</Text>

                <View style={localStyles.placeholder} />
            </View>

            {/* Content */}
            <ScrollView
                contentContainerStyle={[styles.content, { paddingBottom: 30 }]}
                showsVerticalScrollIndicator={false}
            >
                <View style={[styles.formContainer, { paddingTop: 4 }]}>
                    <JobSelector
                        value={formData.job}
                        onChange={(v) => handleChange('job', v)}
                        bgColor={colorSet.selectorBg}
                        borderColor={colorSet.selectorBorder}
                        textColor={colorSet.selectorText}
                    />

                    <RegionSelector
                        value={formData.region}
                        onChange={(v) => handleChange('region', v)}
                        bgColor={colorSet.selectorBg}
                        borderColor={colorSet.selectorBorder}
                        textColor={colorSet.selectorText}
                    />

                    <DrinkingSelector
                        value={formData.drinkingFrequency}
                        onChange={(v) => handleChange('drinkingFrequency', v)}
                        bgColor={colorSet.selectorBg}
                        borderColor={colorSet.selectorBorder}
                        textColor={colorSet.selectorText}
                    />

                    <SmokingSelector
                        value={formData.smokingStatus}
                        onChange={(v) => handleChange('smokingStatus', v)}
                        bgColor={colorSet.selectorBg}
                        borderColor={colorSet.selectorBorder}
                        textColor={colorSet.selectorText}
                    />

                    <HeightInput
                        value={formData.height}
                        onChange={(v) => handleChange('height', v)}
                        bgColor={colorSet.selectorBg}
                        borderColor={colorSet.selectorBorder}
                        textColor={colorSet.selectorText}
                    />

                    <PetsSelector
                        value={formData.pets}
                        onChange={(v) => handleChange('pets', v)}
                        bgColor={colorSet.selectorBg}
                        borderColor={colorSet.selectorBorder}
                        textColor={colorSet.selectorText}
                    />

                    <ReligionSelector
                        value={formData.religion}
                        onChange={(v) => handleChange('religion', v)}
                        bgColor={colorSet.selectorBg}
                        borderColor={colorSet.selectorBorder}
                        textColor={colorSet.selectorText}
                    />

                    <ContactFrequencySelector
                        value={formData.contactFrequency}
                        onChange={(v) => handleChange('contactFrequency', v)}
                        bgColor={colorSet.selectorBg}
                        borderColor={colorSet.selectorBorder}
                        textColor={colorSet.selectorText}
                    />

                    <MbtiSelector
                        value={formData.mbti}
                        onChange={(v) => handleChange('mbti', v)}
                        bgColor={colorSet.selectorBg}
                        borderColor={colorSet.selectorBorder}
                        textColor={colorSet.selectorText}
                    />
                </View>
            </ScrollView>

            {/* Footer */}
            <View
                style={[
                    styles.footerContainer,
                    {
                        paddingBottom: 20,
                        backgroundColor: colorSet.bg,
                    },
                ]}
            >
                <View style={styles.buttonContainer}>
                    {isSubmitting ? (
                        <View style={{ paddingVertical: 16, alignItems: 'center' }}>
                            <ActivityIndicator size="small" color={isDark ? '#FFFFFF' : '#1F2937'} />
                        </View>
                    ) : (
                        <ButtonView title="완료" onPress={handleComplete} />
                    )}
                </View>

                <Text
                    style={[
                        styles.disclaimerText,
                        {
                            marginTop: 10,
                            color: colorSet.subText,
                        },
                    ]}
                >
                    입력하신 정보는 매칭을 위해서만 사용됩니다.
                </Text>
            </View>
        </View>
    );
};

const localStyles = StyleSheet.create({
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
});

export default ProfileEditScreen;
