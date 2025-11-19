import React, { createContext, useContext, useMemo, useState } from 'react';

import { SignupFormState } from '../types';

interface SignupContextValue {
    signupData: SignupFormState;
    updateSignupData: (patch: Partial<SignupFormState>) => void;
    resetSignupData: () => void;
}

const defaultSignupState: SignupFormState = {
    kakaoId: '',
    email: '',
    name: '',
    birthDate: '',
    gender: '',
    sexualOrientation: 'STRAIGHT',
    job: '',
    region: '',
    drinkingFrequency: '',
    smokingStatus: '',
    height: '',
    pets: '',
    religion: '',
    contactFrequency: '',
    mbti: '',
    introduction: '',
    profileImageUri: null,
};

const SignupContext = createContext<SignupContextValue | undefined>(undefined);

export const SignupProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [signupData, setSignupData] = useState<SignupFormState>(defaultSignupState);

    const updateSignupData = (patch: Partial<SignupFormState>) => {
        setSignupData((prev) => ({ ...prev, ...patch }));
    };

    const resetSignupData = () => setSignupData(defaultSignupState);

    const value = useMemo(
        () => ({
            signupData,
            updateSignupData,
            resetSignupData,
        }),
        [signupData],
    );

    return <SignupContext.Provider value={value}>{children}</SignupContext.Provider>;
};

export const useSignup = () => {
    const context = useContext(SignupContext);
    if (!context) {
        throw new Error('useSignup 훅은 SignupProvider 안에서만 사용할 수 있습니다.');
    }
    return context;
};

