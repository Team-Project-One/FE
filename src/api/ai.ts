import { request } from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PromptRequest {
    prompt: string;
    myUserId?: number;
    matchedUserId?: number;
}

export interface ConversationTopicsResponse {
    topics: string[];
}

export interface DatingCoursesResponse {
    courses: string[];
}

// 아이스브레이킹 추천 주제 초기 호출: /ai/conversation-topics
export const fetchConversationTopics = async (
    myUserId: number,
    matchedUserId: number
): Promise<string[]> => {
    const accessToken = await AsyncStorage.getItem('@auth/accessToken');

    const response = await request<ConversationTopicsResponse>('/ai/conversation-topics', {
        method: 'POST',
        headers: accessToken
            ? {
                  Authorization: `Bearer ${accessToken}`,
                  'Content-Type': 'application/json',
              }
            : {
                  'Content-Type': 'application/json',
              },
        body: JSON.stringify({
            myUserId,
            matchedUserId,
        }),
    });

    if (response && Array.isArray(response.topics)) {
        return response.topics;
    }
    return [];
};

// 데이트 코스 추천 초기 호출: /ai/dating-courses
export const fetchDatingCourses = async (
    myUserId: number,
    matchedUserId: number
): Promise<string[]> => {
    const accessToken = await AsyncStorage.getItem('@auth/accessToken');

    const response = await request<DatingCoursesResponse>('/ai/dating-courses', {
        method: 'POST',
        headers: accessToken
            ? {
                  Authorization: `Bearer ${accessToken}`,
                  'Content-Type': 'application/json',
              }
            : {
                  'Content-Type': 'application/json',
              },
        body: JSON.stringify({
            myUserId,
            matchedUserId,
        }),
    });

    if (response && Array.isArray(response.courses)) {
        return response.courses;
    }
    return [];
};

// 아이스브레이킹 주제 AI 채팅 API(일반 대화): /ai
export const sendConversationTopicsMessage = async (
    message: string,
    otherUserName?: string,
    myUserId?: number | null,
    matchedUserId?: number | null
): Promise<string> => {
    const accessToken = await AsyncStorage.getItem('@auth/accessToken');
    
    try {
        // 백엔드의 /ai POST 엔드포인트 사용 (PromptRequest 형식)
        const prompt = otherUserName 
            ? `상대방 ${otherUserName}님과의 대화에서: ${message}\n\n이에 대한 친절하고 자연스러운 응답을 해주세요.`
            : message;
        
        const response = await request<string>('/ai', {
            method: 'POST',
            headers: accessToken
                ? {
                      Authorization: `Bearer ${accessToken}`,
                      'Content-Type': 'application/json',
                  }
                : {
                      'Content-Type': 'application/json',
                  },
            body: JSON.stringify({
                prompt,
                myUserId: myUserId ?? undefined,
                matchedUserId: matchedUserId ?? undefined,
            } as PromptRequest),
        });

        // 응답이 문자열인 경우 그대로 반환
        if (typeof response === 'string') {
            return response;
        }
        
        // 객체인 경우 message 필드 확인
        if (typeof response === 'object' && response !== null) {
            const obj = response as any;
            return obj.message || obj.response || obj.content || '응답을 받을 수 없습니다.';
        }
        
        return '응답을 받을 수 없습니다.';
    } catch (error: any) {
        console.error('[AI API] Error details:', error);
        throw error;
    }
};

