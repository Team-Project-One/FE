import { API_BASE_URL } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const normalizePath = (path: string) => {
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    const base = API_BASE_URL.replace(/\/$/, '');
    const relative = path.replace(/^\//, '');
    return `${base}/${relative}`;
};

const parseResponseBody = async (response: Response) => {
    const text = await response.text();
    if (!text) {
        return null;
    }

    try {
        return JSON.parse(text);
    } catch (error) {
        return text;
    }
};

export class ApiError extends Error {
    status: number;
    data: unknown;

    constructor(message: string, status: number, data: unknown) {
        super(message);
        this.status = status;
        this.data = data;
    }
}

interface RequestOptions extends RequestInit {}

export const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
    const url = normalizePath(path);
    console.log('[API] request:', options.method || 'GET', url);
    if (options.body) {
        console.log('[API] request body:', options.body);
    }

    const response = await fetch(url, {
        ...options,
        headers: {
            Accept: 'application/json',
            ...(options.headers || {}),
        },
    });

    console.log('[API] response status:', response.status, response.statusText);
    const data = await parseResponseBody(response);
    console.log('[API] response data:', data);

    // HTTP 상태 코드 체크
    if (!response.ok) {
        // 401 Unauthorized 에러 발생 시 토큰 삭제
        if (response.status === 401) {
            console.log('[API] 401 Unauthorized - Clearing tokens');
            await AsyncStorage.removeItem('@auth/accessToken');
            await AsyncStorage.removeItem('@auth/refreshToken');
            await AsyncStorage.removeItem('@auth/userId');
        }

        const fallbackMessage = '요청 처리 중 문제가 발생했습니다.';
        const message =
            (data &&
                typeof data === 'object' &&
                'message' in data &&
                typeof (data as Record<string, unknown>).message === 'string' &&
                (data as Record<string, unknown>).message) ||
            fallbackMessage;

        throw new ApiError(message as string, response.status, data);
    }

    // 백엔드 커스텀 에러 상태 체크 (HTTP 200이지만 응답 본문에 에러가 있는 경우)
    if (data && typeof data === 'object' && 'status' in data) {
        const status = (data as Record<string, unknown>).status;
        // status가 음수이거나 200이 아닌 경우 에러로 처리
        if (typeof status === 'number' && (status < 0 || status !== 200)) {
            const fallbackMessage = '요청 처리 중 문제가 발생했습니다.';
            const message =
                (data &&
                    typeof data === 'object' &&
                    'message' in data &&
                    typeof (data as Record<string, unknown>).message === 'string' &&
                    (data as Record<string, unknown>).message) ||
                fallbackMessage;

            throw new ApiError(message || fallbackMessage, response.status, data);
        }
    }

    return data as T;
};

export const postMultipart = async <T>(path: string, formData: FormData): Promise<T> => {
    return request<T>(path, {
        method: 'POST',
        body: formData,
    });
};

