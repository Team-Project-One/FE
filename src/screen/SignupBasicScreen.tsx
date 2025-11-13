import React, { useEffect, useRef, useState } from 'react';
import { Text, View, ScrollView, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import ButtonView from '../components/ButtonView';
import ErrorBanner from '../components/ErrorBanner';
import GenderSelector from '../components/signup/GenderSelector';
import BasicProgressHeader from '../components/signup/BasicProgressHeader';
import BasicInputGroup from '../components/signup/BasicInputGroup';
import BirthDateInput from '../components/signup/BirthDateInput';
import { SignupBasicScreenProps, SignupBasicFormData } from '../types';
import styles from '../styles/signup/signupBasicStyles';

const SignupBasicScreen: React.FC<SignupBasicScreenProps> = ({ onNavigate }) => {
    const insets = useSafeAreaInsets();

    const [formData, setFormData] = useState<SignupBasicFormData>({
        name: '',
        birthDate: '',
        gender: '',
    });

    const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
    const [showErrorBanner, setShowErrorBanner] = useState(false);

    const [progressAnimation] = useState(new Animated.Value(0));
    const [errorBannerAnimation] = useState(new Animated.Value(0));

    const errorHideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        Animated.timing(progressAnimation, {
            toValue: 0.25,
            duration: 1000,
            useNativeDriver: false,
        }).start();
    }, []);

    const handleInputChange = (field: keyof SignupBasicFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: false }));
        }
    };

    const validateForm = () => {
        const next: any = {};
        if (!formData.name.trim()) next.name = true;
        if (formData.birthDate.replace(/[^0-9]/g, '').length !== 8) next.birthDate = true;
        if (!formData.gender) next.gender = true;
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const getErrorMessage = () => {
        const missing: string[] = [];
        const invalid: string[] = [];

        if (!formData.name.trim()) missing.push('이름');
        const b = formData.birthDate.replace(/[^0-9]/g, '');
        if (!formData.birthDate) missing.push('생년월일');
        else if (b.length !== 8) invalid.push('생년월일');
        if (!formData.gender) missing.push('성별');

        if (invalid.length) return '생년월일을 다시 입력해주세요.';
        if (missing.length === 1) return `${missing[0]}을 입력해주세요.`;
        if (missing.length === 2) return `${missing[0]}과 ${missing[1]}을 입력해주세요.`;
        return `${missing.join(', ')}을 입력해주세요.`;
    };

    const showErrorBannerWithAnimation = () => {
        setShowErrorBanner(true);
        Animated.timing(errorBannerAnimation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();

        if (errorHideTimeoutRef.current) clearTimeout(errorHideTimeoutRef.current);

        errorHideTimeoutRef.current = setTimeout(() => {
            Animated.timing(errorBannerAnimation, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => setShowErrorBanner(false));
        }, 3000);
    };

    const handleNext = () => {
        if (validateForm()) onNavigate('signupDetailed');
        else showErrorBannerWithAnimation();
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <LinearGradient
                colors={['rgba(252, 231, 243, 0.6)', 'rgba(253, 242, 248, 0.4)', 'rgba(255, 228, 230, 0.6)']}
                style={styles.container}
            >
                <StatusBar style="auto" />

                <ErrorBanner message={getErrorMessage()} visible={showErrorBanner} top={insets.top + 16} />

                <BasicProgressHeader
                    progressAnimation={progressAnimation}
                    onBack={() => onNavigate('signupLogin')}
                    top={insets.top + 20}
                />

                <ScrollView
                    contentContainerStyle={[styles.content, { backgroundColor: 'transparent' }]}
                    style={{ backgroundColor: 'transparent' }}
                >
                    <BasicInputGroup
                        label="이름"
                        value={formData.name}
                        onChange={(v: string) => handleInputChange('name', v)}
                        error={errors.name}
                    />

                    <BirthDateInput
                        value={formData.birthDate}
                        onChange={(v: string) => handleInputChange('birthDate', v)}
                        error={errors.birthDate}
                    />

                    <View>
                        <Text style={styles.label}>성별</Text>
                        <GenderSelector
                            value={formData.gender}
                            onChange={(gender: string) =>
                                handleInputChange('gender', formData.gender === gender ? '' : gender)
                            }
                            hasError={!!errors.gender}
                        />
                    </View>
                </ScrollView>

                <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + 20 }]}>
                    <ButtonView title="다음" onPress={handleNext} />
                </View>

                <View style={styles.disclaimerContainer}>
                    <Text style={styles.disclaimerText}>입력하신 정보는 매칭을 위해서만 사용됩니다.</Text>
                </View>
            </LinearGradient>
        </View>
    );
};

export default SignupBasicScreen;
