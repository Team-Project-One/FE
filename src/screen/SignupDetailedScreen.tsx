import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import ButtonView from '../components/ButtonView';
import ErrorBanner from '../components/signup/ErrorBanner';
import BasicProgressHeader from '../components/signup/BasicProgressHeader';
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

const SignupDetailedScreen: React.FC<SignupDetailedScreenProps> = ({ onNavigate, routeParams }) => {
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

    const [showErrorBanner, setShowErrorBanner] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const getErrorMessage = () => {
        if (!formData.job) return '직업을 선택해주세요.';
        if (!formData.region) return '지역을 선택해주세요.';
        if (!formData.drinkingFrequency) return '음주 빈도를 선택해주세요.';
        if (!formData.smokingStatus) return '흡연 여부를 선택해주세요.';
        if (!formData.height) return '키를 입력해주세요.';
        if (!formData.pets) return '반려동물 여부를 선택해주세요.';
        if (!formData.religion) return '종교를 선택해주세요.';
        if (!formData.contactFrequency) return '연락 빈도를 선택해주세요.';
        if (!formData.mbti) return 'MBTI를 선택해주세요.';
        return '';
    };

    const handleChange = (field: keyof SignupDetailedFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleComplete = () => {
        setHasSubmitted(true);
        const msg = getErrorMessage();
        if (msg) {
            setShowErrorBanner(true);
            return;
        }
        onNavigate('signupSelfIntro', { progress: currentProgress });
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <LinearGradient
                colors={['rgba(252, 231, 243, 0.6)', 'rgba(253, 242, 248, 0.4)', 'rgba(255, 228, 230, 0.6)']}
                style={{ flex: 1 }}
            >
                <StatusBar style="auto" />

                <ErrorBanner
                    message={getErrorMessage()}
                    visible={showErrorBanner}
                    top={insets.top + 16}
                    onHidden={() => setShowErrorBanner(false)}
                />

                <BasicProgressHeader
                    startProgress={prevProgress}
                    endProgress={currentProgress}
                    onBack={() => onNavigate('signupBasic', { progress: 0.25 })}
                    top={insets.top + 28}
                    step={2}
                    totalSteps={4}
                />

                <View style={styles.titleContainer}>
                    <Text style={styles.headerTitle}>상세 정보를 입력해주세요!</Text>
                </View>

                <ScrollView
                    contentContainerStyle={[styles.content, { paddingBottom: 30 }]}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.formContainer}>
                        <JobSelector
                            value={formData.job}
                            onChange={(v) => handleChange('job', v)}
                            error={hasSubmitted && !formData.job}
                        />

                        <RegionSelector
                            value={formData.region}
                            onChange={(v) => handleChange('region', v)}
                            error={hasSubmitted && !formData.region}
                        />

                        <DrinkingSelector
                            value={formData.drinkingFrequency}
                            onChange={(v) => handleChange('drinkingFrequency', v)}
                            error={hasSubmitted && !formData.drinkingFrequency}
                        />

                        <SmokingSelector
                            value={formData.smokingStatus}
                            onChange={(v) => handleChange('smokingStatus', v)}
                            error={hasSubmitted && !formData.smokingStatus}
                        />

                        <HeightInput
                            value={formData.height}
                            onChange={(v) => handleChange('height', v)}
                            error={hasSubmitted && !formData.height}
                        />

                        <PetsSelector
                            value={formData.pets}
                            onChange={(v) => handleChange('pets', v)}
                            error={hasSubmitted && !formData.pets}
                        />

                        <ReligionSelector
                            value={formData.religion}
                            onChange={(v) => handleChange('religion', v)}
                            error={hasSubmitted && !formData.religion}
                        />

                        <ContactFrequencySelector
                            value={formData.contactFrequency}
                            onChange={(v) => handleChange('contactFrequency', v)}
                            error={hasSubmitted && !formData.contactFrequency}
                        />

                        <MbtiSelector
                            value={formData.mbti}
                            onChange={(v) => handleChange('mbti', v)}
                            error={hasSubmitted && !formData.mbti}
                        />
                    </View>
                </ScrollView>

                <View style={[styles.footerContainer, { paddingBottom: 20 }]}>
                    <View style={styles.buttonContainer}>
                        <ButtonView title="다음" onPress={handleComplete} />
                    </View>

                    <Text style={[styles.disclaimerText, { marginTop: 10 }]}>
                        입력하신 정보는 매칭을 위해서만 사용됩니다.
                    </Text>
                </View>
            </LinearGradient>
        </View>
    );
};

export default SignupDetailedScreen;
