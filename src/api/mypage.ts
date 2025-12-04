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
    
    const trimmed = introduction.trim();
    const limited = trimmed.length > 255 ? trimmed.slice(0, 255) : trimmed;

    const updateData: UpdateProfileRequest = {
        introduction: limited,
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
        // MBTI는 optional. 값이 비어 있으면 'UNKNOWN'으로 보내 BE에서 null로 초기화하도록 처리
        if (formData.mbti !== undefined) {
            const trimmed = formData.mbti.trim();
            updateData.mbti = trimmed ? trimmed : 'UNKNOWN';
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

export interface ProfileImageFile {
    uri: string;
    name?: string;
    type?: string;
}

export const updateProfileImage = async (userId: number, file: ProfileImageFile): Promise<string> => {
    if (!file?.uri) {
        throw new Error('올릴 프로필 이미지를 찾을 수 없습니다.');
    }

    const formData = new FormData();
    formData.append('profileImage', {
        uri: file.uri,
        name: file.name ?? 'profile.jpg',
        type: file.type ?? 'image/jpeg',
    } as any);

    const response = await request<string>(`/my-page/${userId}/profile-image`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        body: formData,
    });

    return response;
};

// 프로필 이미지를 삭제하여 기본 이미지 상태로 되돌리기
export const deleteProfileImage = async (userId: number): Promise<void> => {
    await request<void>(`/my-page/${userId}/profile-image`, {
        method: 'DELETE',
    });
};

// 계정 탈퇴
export const deleteUser = async (userId: number): Promise<number> => {
    console.log('[API] deleteUser called with userId', userId);
    return request<number>(`/my-page/${userId}`, {
        method: 'DELETE',
    });
};

