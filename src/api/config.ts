import Constants from 'expo-constants';
import { Platform } from 'react-native';

type ExpoExtraConfig = {
    apiBaseUrl?: string;
};

const normalizeBaseUrl = (value?: string) => {
    if (!value) return undefined;
    return value.endsWith('/') ? value.slice(0, -1) : value;
};

const resolveDefaultBaseUrl = () => {
    if (__DEV__) {
        return Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';
    }
    return 'http://localhost:8080';
};

const extra = (Constants?.expoConfig?.extra || Constants?.manifest?.extra || {}) as ExpoExtraConfig;

export const API_BASE_URL =
    normalizeBaseUrl(process.env.EXPO_PUBLIC_API_BASE_URL) ??
    normalizeBaseUrl(extra.apiBaseUrl) ??
    resolveDefaultBaseUrl();

export const API_TIMEOUT = 15000;

