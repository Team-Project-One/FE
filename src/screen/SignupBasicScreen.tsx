import React, { useRef, useState } from 'react';
import { Text, View, ScrollView, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import ButtonView from '../components/ButtonView';
import ErrorBanner from '../components/signup/ErrorBanner';
import GenderSelector from '../components/signup/GenderSelector';
import BasicProgressHeader from '../components/signup/BasicProgressHeader';
import BasicInputGroup from '../components/signup/BasicInputGroup';
import BirthDateInput from '../components/signup/BirthDateInput';
import { SignupBasicScreenProps, SignupBasicFormData } from '../types';
import styles from '../styles/signup/signupBasicStyles';
import { useSignup } from '../context/SignupContext';

const SignupBasicScreen: React.FC<SignupBasicScreenProps> = ({ onNavigate, routeParams }) => {
    const insets = useSafeAreaInsets();

    const prevProgress = routeParams?.progress ?? 0;
    const currentProgress = 0.25;
    const { signupData, updateSignupData } = useSignup();

    const [formData, setFormData] = useState<SignupBasicFormData>({
        name: signupData.name || '',
        birthDate: signupData.birthDate || '',
        gender: signupData.gender || '',
    });

    const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
    const [showErrorBanner, setShowErrorBanner] = useState(false);

    const errorBannerAnimation = useRef(new Animated.Value(0)).current;
    const errorHideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleInputChange = (field: keyof SignupBasicFormData, value: string) => {
        // 이름 필드에 대한 제한 적용 (입력 중에는 최대 길이만 제한)
        if (field === 'name') {
            // 최대 4글자 제한만 적용 (입력 중에는 한글 필터링하지 않음)
            if (value.length > 4) {
                value = value.slice(0, 4);
            }
        }
        
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: false }));
        }
    };

    const validateForm = () => {
        const next: any = {};
        const nameTrimmed = formData.name.trim();
        if (!nameTrimmed) {
            next.name = true;
        } else if (nameTrimmed.length > 4) {
            next.name = true;
        } else if (!/^[가-힣]+$/.test(nameTrimmed)) {
            next.name = true;
        }
        if (formData.birthDate.replace(/[^0-9]/g, '').length !== 8) next.birthDate = true;
        if (!formData.gender) next.gender = true;
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const getErrorMessage = () => {
        const missing: string[] = [];
        const invalid: string[] = [];

        const nameTrimmed = formData.name.trim();
        if (!nameTrimmed) {
            missing.push('이름');
        } else if (nameTrimmed.length > 4) {
            invalid.push('이름은 4글자 이하여야 합니다.');
        } else if (!/^[가-힣]+$/.test(nameTrimmed)) {
            invalid.push('이름은 한글만 입력 가능합니다.');
        }
        
        const b = formData.birthDate.replace(/[^0-9]/g, '');
        if (!formData.birthDate) missing.push('생년월일');
        else if (b.length !== 8) invalid.push('생년월일');
        if (!formData.gender) missing.push('성별');

        if (invalid.length) {
            if (invalid.includes('이름은 4글자 이하여야 합니다.')) return '이름은 4글자 이하여야 합니다.';
            if (invalid.includes('이름은 한글만 입력 가능합니다.')) return '이름은 한글만 입력 가능합니다.';
            return '생년월일을 다시 입력해주세요.';
        }
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
        if (validateForm()) {
            // 이름에서 한글이 아닌 문자 제거 및 최대 4글자 제한
            let cleanedName = formData.name.trim().replace(/[^가-힣]/g, '');
            if (cleanedName.length > 4) {
                cleanedName = cleanedName.slice(0, 4);
            }
            
            updateSignupData({
                name: cleanedName,
                birthDate: formData.birthDate,
                gender: formData.gender,
            });
            onNavigate('signupDetailed', { progress: currentProgress });
        } else {
            showErrorBannerWithAnimation();
        }
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
                    startProgress={prevProgress}
                    endProgress={currentProgress}
                    onBack={() => onNavigate('signupLogin')}
                    top={insets.top + 40}
                    step={1}
                    totalSteps={4}
                />

                <Text
                    style={{
                        fontSize: 20,
                        fontWeight: '700',
                        color: '#1E2939',
                        marginBottom: 40,
                        textAlign: 'center',
                    }}
                >
                    기본 정보를 입력해주세요!
                </Text>

                <ScrollView
                    contentContainerStyle={[styles.content, { backgroundColor: 'transparent' }]}
                    style={{ backgroundColor: 'transparent' }}
                >
                    <View style={{ marginBottom: 6 }}>
                        <BasicInputGroup
                            label="이름"
                            value={formData.name}
                            onChange={(v: string) => handleInputChange('name', v)}
                            error={errors.name}
                        />
                    </View>

                    <View style={{ marginBottom: 6 }}>
                        <BirthDateInput
                            value={formData.birthDate}
                            onChange={(v: string) => handleInputChange('birthDate', v)}
                            error={errors.birthDate}
                        />
                    </View>

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

                <View style={[styles.footerContainer, { paddingBottom: 20 }]}>
                    <View style={styles.buttonContainer}>
                        <ButtonView title="다음" onPress={handleNext} />
                    </View>

                    <Text style={[styles.disclaimerText, { marginTop: 10 }]}>
                        입력하신 정보는 매칭을 위해서만 사용됩니다.
                    </Text>
                </View>
            </LinearGradient>
        </View>
    );
};

export default SignupBasicScreen;
