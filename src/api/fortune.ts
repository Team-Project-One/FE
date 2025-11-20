import { request } from './client';

export interface FortuneDTO {
    overallFortune: string;
    loveFortune: string;
    moneyFortune: string;
    careerFortune: string;
}

export const fetchTodayFortune = async (birthDate?: string | null): Promise<FortuneDTO> => {
    console.log('[API] fetchTodayFortune called with birthDate', birthDate);
    const url = birthDate ? `/fortune?birthDate=${encodeURIComponent(birthDate)}` : '/fortune';
    return request<FortuneDTO>(url);
};

