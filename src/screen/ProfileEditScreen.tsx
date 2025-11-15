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

const ProfileEditScreen: React.FC<SignupDetailedScreenProps> = ({ onNavigate, routeParams }) => {
    const insets = useSafeAreaInsets();

    const prevProgress = routeParams?.progress ?? 0.25;
    const currentProgress = 0.5;

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

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <StatusBar style="auto" />

            <View style={[localStyles.header, { marginTop: insets.top }]}>
                <TouchableOpacity onPress={() => onNavigate('main')} style={localStyles.backButton}>
                    <BackIcon width={24} height={24} />
                </TouchableOpacity>

                <Text style={localStyles.headerTitle}>프로필 수정</Text>

                <View style={localStyles.placeholder} />
            </View>

            <ScrollView
                contentContainerStyle={[styles.content, { paddingBottom: 30 }]}
                showsVerticalScrollIndicator={false}
            >
                <View style={[styles.formContainer, { paddingTop: 4 }]}>
                    <JobSelector value={formData.job} onChange={(v) => handleChange('job', v)} />
                    <RegionSelector value={formData.region} onChange={(v) => handleChange('region', v)} />
                    <DrinkingSelector
                        value={formData.drinkingFrequency}
                        onChange={(v) => handleChange('drinkingFrequency', v)}
                    />
                    <SmokingSelector
                        value={formData.smokingStatus}
                        onChange={(v) => handleChange('smokingStatus', v)}
                    />
                    <HeightInput value={formData.height} onChange={(v) => handleChange('height', v)} />
                    <PetsSelector value={formData.pets} onChange={(v) => handleChange('pets', v)} />
                    <ReligionSelector value={formData.religion} onChange={(v) => handleChange('religion', v)} />
                    <ContactFrequencySelector
                        value={formData.contactFrequency}
                        onChange={(v) => handleChange('contactFrequency', v)}
                    />
                    <MbtiSelector value={formData.mbti} onChange={(v) => handleChange('mbti', v)} />
                </View>
            </ScrollView>

            <View style={[styles.footerContainer, { paddingBottom: 20 }]}>
                <View style={styles.buttonContainer}>
                    <ButtonView title="완료" onPress={handleComplete} />
                </View>

                <Text style={[styles.disclaimerText, { marginTop: 10 }]}>
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
        borderBottomColor: '#0000001A',
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
        color: '#1F2937',
    },
    placeholder: {
        width: 32,
    },
});

export default ProfileEditScreen;
