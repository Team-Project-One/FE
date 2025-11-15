import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
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

    const handleChange = (field: keyof SignupDetailedFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleComplete = () => {
        onNavigate('mypage');
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
                    <ButtonView title="완료" onPress={handleComplete} />
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
