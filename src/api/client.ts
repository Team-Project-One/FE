import { API_BASE_URL } from './config';

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
    const response = await fetch(normalizePath(path), {
        ...options,
        headers: {
            Accept: 'application/json',
            ...(options.headers || {}),
        },
    });

    const data = await parseResponseBody(response);

    if (!response.ok) {
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

    return data as T;
};

export const postMultipart = async <T>(path: string, formData: FormData): Promise<T> => {
    return request<T>(path, {
        method: 'POST',
        body: formData,
    });
};

