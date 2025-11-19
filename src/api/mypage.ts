import { request } from './client';
import { MyPageData } from '../types';

export const fetchMyPage = async (userId: number): Promise<MyPageData> => {
    console.log('[API] fetchMyPage called with userId', userId);
    return request<MyPageData>(`/my-page/${userId}`);
};

