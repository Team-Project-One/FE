import { request } from './client';
import { MyPageData, SignupDetailedFormData } from '../types';
import { mapFieldValue } from './signup';

export const fetchMyPage = async (userId: number): Promise<MyPageData> => {
    console.log('[API] fetchMyPage called with userId', userId);
    return request<MyPageData>(`/my-page/${userId}`);
};

export interface UpdateProfileRequest {
    job?: string;
    region?: string;
    drinkingFrequency?: string;
    smokingStatus?: string;
    height?: number;
    petPreference?: string;
    religion?: string;
    contactFrequency?: string;
    mbti?: string;
    introduction?: string;
}

export const updateIntroduction = async (userId: number, introduction: string): Promise<void> => {
    console.log('[API] updateIntroduction called with userId', userId, 'introduction', introduction);
    
    const updateData: UpdateProfileRequest = {
        introduction: introduction.trim(),
    };

    console.log('[API] updateIntroduction request body:', JSON.stringify(updateData));

    return request<void>(`/my-page/${userId}/profile`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
    });
};

export const updateProfile = async (userId: number, formData: SignupDetailedFormData): Promise<void> => {
    console.log('[API] updateProfile called with userId', userId, 'formData', formData);
    
    const updateData: UpdateProfileRequest = {};

    try {
        if (formData.job && formData.job.trim()) {
            updateData.job = mapFieldValue('job', formData.job);
        }
        if (formData.region && formData.region.trim()) {
            updateData.region = mapFieldValue('region', formData.region);
        }
        if (formData.drinkingFrequency && formData.drinkingFrequency.trim()) {
            updateData.drinkingFrequency = mapFieldValue('drinkingFrequency', formData.drinkingFrequency);
        }
        if (formData.smokingStatus && formData.smokingStatus.trim()) {
            updateData.smokingStatus = mapFieldValue('smokingStatus', formData.smokingStatus);
        }
        if (formData.height && formData.height.trim()) {
            const parsedHeight = parseInt(formData.height, 10);
            if (!Number.isNaN(parsedHeight)) {
                updateData.height = parsedHeight;
            }
        }
        if (formData.pets && formData.pets.trim()) {
            updateData.petPreference = mapFieldValue('petPreference', formData.pets);
        }
        if (formData.religion && formData.religion.trim()) {
            updateData.religion = mapFieldValue('religion', formData.religion);
        }
        if (formData.contactFrequency && formData.contactFrequency.trim()) {
            updateData.contactFrequency = mapFieldValue('contactFrequency', formData.contactFrequency);
        }
        if (formData.mbti && formData.mbti.trim()) {
            updateData.mbti = formData.mbti;
        }

        console.log('[API] updateProfile updateData (Enum values):', updateData);
        console.log('[API] updateProfile request body:', JSON.stringify(updateData));

        const response = await request<void>(`/my-page/${userId}/profile`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
        });

        console.log('[API] updateProfile response:', response);
        return response;
    } catch (error) {
        console.error('[API] updateProfile error:', error);
        throw error;
    }
};

