import * as FileSystem from 'expo-file-system';

import { SignupFormState, SignupResponse } from '../types';
import { postMultipart } from './client';

type SignupEnumField =
    | 'gender'
    | 'sexualOrientation'
    | 'job'
    | 'region'
    | 'drinkingFrequency'
    | 'smokingStatus'
    | 'petPreference'
    | 'religion'
    | 'contactFrequency'
    | 'mbti';

const genderMap: Record<string, string> = {
    male: 'MALE',
    female: 'FEMALE',
};

const jobMap: Record<string, string> = {
    무직: 'UNEMPLOYED',
    학생: 'STUDENT',
    직장인: 'EMPLOYEE',
};

const regionMap: Record<string, string> = {
    서울: 'SEOUL',
    경기: 'GYEONGGI_DO',
    인천: 'INCHEON',
    부산: 'BUSAN',
    대구: 'DAEGU',
    광주: 'GWANGJU',
    대전: 'DAEJEON',
    울산: 'ULSAN',
    세종: 'SEJONG',
    강원: 'GANGWON_DO',
    충북: 'CHUNGCHEONGBUK_DO',
    충남: 'CHUNGCHEONGNAM_DO',
    전북: 'JEOLLABUK_DO',
    전남: 'JEOLLANAM_DO',
    경북: 'GYEONGSANGBUK_DO',
    경남: 'GYEONGSANGNAM_DO',
    제주: 'JEJU_DO',
};

const drinkingFrequencyMap: Record<string, string> = {
    '안 마심': 'NONE',
    '주 1회 이하': 'ONCE_OR_TWICE_PER_WEEK',
    '주 1-2회': 'ONCE_OR_TWICE_PER_WEEK',
    '주 3회 이상': 'THREE_TIMES_OR_MORE_PER_WEEK',
};

const smokingStatusMap: Record<string, string> = {
    비흡연: 'NON_SMOKER',
    흡연: 'SMOKER',
};

const petPreferenceMap: Record<string, string> = {
    없음: 'NONE',
    강아지: 'DOG',
    고양이: 'CAT',
    기타: 'OTHER',
};

const religionMap: Record<string, string> = {
    무교: 'NONE',
    기독교: 'CHRISTIAN',
    천주교: 'CATHOLIC',
    불교: 'BUDDHIST',
    기타: 'OTHER',
};

const contactFrequencyMap: Record<string, string> = {
    중요함: 'IMPORTANT',
    '중요하지 않음': 'NOT_IMPORTANT',
};

const defaultSexualOrientation = 'STRAIGHT';

const mapFieldValue = (field: SignupEnumField, value: string) => {
    if (!value) {
        throw new Error(`${field} 값이 비어 있습니다.`);
    }

    const normalized =
        field === 'gender'
            ? genderMap[value]
            : field === 'job'
            ? jobMap[value]
            : field === 'region'
            ? regionMap[value]
            : field === 'drinkingFrequency'
            ? drinkingFrequencyMap[value]
            : field === 'smokingStatus'
            ? smokingStatusMap[value]
            : field === 'petPreference'
            ? petPreferenceMap[value]
            : field === 'religion'
            ? religionMap[value]
            : field === 'contactFrequency'
            ? contactFrequencyMap[value]
            : field === 'sexualOrientation'
            ? value
            : value;

    if (!normalized) {
        throw new Error(`${field} 값(${value})을(를) 변환할 수 없습니다.`);
    }

    return normalized;
};

const appendString = (formData: FormData, key: string, value?: string | number | null) => {
    if (value === undefined || value === null) {
        return;
    }
    formData.append(key, String(value));
};

const createMultipartPayload = async (formState: SignupFormState) => {
    const formData = new FormData();

    appendString(formData, 'kakaoId', formState.kakaoId);
    appendString(formData, 'email', formState.email);

    appendString(formData, 'name', formState.name.trim());
    appendString(formData, 'birthdate', formState.birthDate);
    appendString(formData, 'gender', mapFieldValue('gender', formState.gender));
    appendString(
        formData,
        'sexualOrientation',
        mapFieldValue('sexualOrientation', formState.sexualOrientation || defaultSexualOrientation),
    );
    appendString(formData, 'job', mapFieldValue('job', formState.job));
    appendString(formData, 'region', mapFieldValue('region', formState.region));
    appendString(formData, 'drinkingFrequency', mapFieldValue('drinkingFrequency', formState.drinkingFrequency));
    appendString(formData, 'smokingStatus', mapFieldValue('smokingStatus', formState.smokingStatus));

    const parsedHeight = parseInt(formState.height, 10);
    if (Number.isNaN(parsedHeight)) {
        throw new Error('키 정보가 올바르지 않습니다.');
    }
    appendString(formData, 'height', parsedHeight);

    appendString(formData, 'petPreference', mapFieldValue('petPreference', formState.pets));
    appendString(formData, 'religion', mapFieldValue('religion', formState.religion));
    appendString(formData, 'contactFrequency', mapFieldValue('contactFrequency', formState.contactFrequency));
    appendString(formData, 'mbti', formState.mbti);
    appendString(formData, 'introduction', formState.introduction?.trim() ?? '');

    if (formState.profileImageUri) {
        const uri = formState.profileImageUri;
        const fileInfo = await FileSystem.getInfoAsync(uri);

        if (!fileInfo.exists) {
            throw new Error('선택한 프로필 이미지를 찾을 수 없습니다.');
        }

        const fileNameFromPath = uri.split('/').pop();
        const fileExtension = fileNameFromPath?.split('.').pop() || 'jpg';
        const mimeType = fileExtension.toLowerCase() === 'png' ? 'image/png' : 'image/jpeg';

        formData.append('profileImage', {
            uri,
            type: mimeType,
            name: fileNameFromPath || `profile.${fileExtension}`,
        } as unknown as Blob);
    }

    return formData;
};

export const submitSignup = async (formState: SignupFormState): Promise<SignupResponse> => {
    console.log('[submitSignup] payload', formState);
    const requiredFields: Array<keyof SignupFormState> = [
        'kakaoId',
        'name',
        'birthDate',
        'gender',
        'job',
        'region',
        'drinkingFrequency',
        'smokingStatus',
        'height',
        'pets',
        'religion',
        'contactFrequency',
        'mbti',
    ];

    const missing = requiredFields.filter((field) => !formState[field]);
    if (missing.length > 0) {
        console.warn('[submitSignup] missing fields', missing);
        throw new Error('입력되지 않은 필드가 있습니다. 이전 단계를 확인해주세요.');
    }

    const formData = await createMultipartPayload(formState);
    return postMultipart<SignupResponse>('/users/signup', formData);
};

