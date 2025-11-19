import { request } from './client';
import { UserStatus } from '../types';

export const fetchUserStatus = async (kakaoId: string): Promise<UserStatus> => {
    return request<UserStatus>(`/users/status/${kakaoId}`);
};

