import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, Animated, TouchableOpacity } from 'react-native';
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

const SignupDetailedScreen: React.FC<SignupDetailedScreenProps> = ({ onNavigate }) => {
    const insets = useSafeAreaInsets();

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

    const [progressAnimation] = useState(new Animated.Value(0));
    const [showErrorBanner, setShowErrorBanner] = useState(false);

    useEffect(() => {
        Animated.timing(progressAnimation, {
            toValue: 0.5,
            duration: 1000,
            useNativeDriver: false,
        }).start();
    }, []);

    const handleChange = (field: keyof SignupDetailedFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

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

    const handleComplete = () => {
        const msg = getErrorMessage();
        if (msg) {
            setShowErrorBanner(true);
            return;
        }
        onNavigate('signupSelfIntro');
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <LinearGradient
                colors={['rgba(252, 231, 243, 0.6)', 'rgba(253, 242, 248, 0.4)', 'rgba(255, 228, 230, 0.6)']}
                style={styles.container}
            >
                <StatusBar style="auto" />

                <ErrorBanner
                    message={getErrorMessage()}
                    visible={showErrorBanner}
                    top={insets.top + 16}
                    onHidden={() => setShowErrorBanner(false)}
                />

                <BasicProgressHeader
                    progressAnimation={progressAnimation}
                    onBack={() => onNavigate('signupBasic')}
                    top={insets.top + 28}
                />

                <View style={styles.titleContainer}>
                    <Text style={styles.headerTitle}>상세 정보를 입력해주세요!</Text>
                </View>

                <ScrollView
                    contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.formContainer}>
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

                        <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + 20 }]}>
                            <ButtonView title="다음" onPress={handleComplete} />
                            <TouchableOpacity
                                onPress={() => onNavigate('main')}
                                style={{ marginTop: 12, alignSelf: 'center' }}
                            >
                                <Text style={{ color: '#6B7280' }}>메인으로</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.disclaimerContainer}>
                            <Text style={styles.disclaimerText}>입력하신 정보는 매칭을 위해서만 사용됩니다.</Text>
                        </View>
                    </View>
                </ScrollView>
            </LinearGradient>
        </View>
    );
};

export default SignupDetailedScreen;
