import { request } from './client';

export interface JwtTokenResponse {
    accessToken: string;
    refreshToken?: string;
    kakaoId?: string;
    email?: string;
    newUser?: boolean;
}

export interface TestLoginPayload {
    testUserNumber?: number;
    name?: string;
    gender?: string;
    birthDate?: string;
}

export const requestTestLogin = async (payload?: TestLoginPayload): Promise<JwtTokenResponse> => {
    return request<JwtTokenResponse>('/auth/test-login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload ?? { testUserNumber: 2 }),
    });
};

