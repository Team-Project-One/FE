import { request } from './client';
import { MyPageData } from '../types';

export interface FortuneDTO {
    overallFortune: string;    // 총운
    loveFortune: string;       // 애정운
    moneyFortune: string;      // 금전운
    careerFortune: string;     // 직장운
}

export const fetchTodayFortune = async (birthDate?: string | null): Promise<FortuneDTO> => {
    console.log('[API] fetchTodayFortune called with birthDate', birthDate);
    const url = birthDate ? `/fortune?birthDate=${encodeURIComponent(birthDate)}` : '/fortune';
    return request<FortuneDTO>(url);
};

