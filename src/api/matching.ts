import { request } from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SajuResponse {
    originalScore: number;
    finalScore: number;
    stressScore: number;
    person1SalAnalysis: string;
    person2SalAnalysis: string;
    matchAnalysis: string;
    error?: string | null;
}

export interface MatchingPersonInfo {
    userId: number;
    name: string | null;
    gender: string | null;
    birthDate: string | null;
    sexualOrientation: string | null;
    job: string | null;
    region: string | null;
    drinkingFrequency: string | null;
    smokingStatus: string | null;
    height: number | null;
    petPreference: string | null;
    religion: string | null;
    contactFrequency: string | null;
    mbti: string | null;
    introduction: string | null;
    profileImagePath: string | null;
}

export interface MatchingResult {
    sajuResponse: SajuResponse;
    personInfo: MatchingPersonInfo;
}

export const fetchMatchingResult = async (userId: number): Promise<MatchingResult> => {
    const accessToken = await AsyncStorage.getItem('@auth/accessToken');
    const response = await request<any>(`/matching/${userId}`, {
        headers: accessToken
            ? {
                  Authorization: `Bearer ${accessToken}`,
              }
            : undefined,
    });
    
    // API 응답이 snake_case로 오므로 camelCase로 변환
    return {
        sajuResponse: {
            originalScore: response.sajuResponse?.original_score ?? response.sajuResponse?.originalScore ?? 0,
            finalScore: response.sajuResponse?.final_score ?? response.sajuResponse?.finalScore ?? 0,
            stressScore: response.sajuResponse?.stress_score ?? response.sajuResponse?.stressScore ?? 0,
            person1SalAnalysis: response.sajuResponse?.person1_sal_analysis ?? response.sajuResponse?.person1SalAnalysis ?? '',
            person2SalAnalysis: response.sajuResponse?.person2_sal_analysis ?? response.sajuResponse?.person2SalAnalysis ?? '',
            matchAnalysis: response.sajuResponse?.match_analysis ?? response.sajuResponse?.matchAnalysis ?? '',
            error: response.sajuResponse?.error ?? null,
        },
        personInfo: response.personInfo,
    };
};

