import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 알림 핸들러 설정 (포그라운드/백그라운드 모두에서 알림 표시)
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true, // 알림 배너 표시
        shouldShowList: true, // 알림 목록에 표시
        shouldPlaySound: true, // 각 알림마다 사운드 재생
        shouldSetBadge: true,
    }),
});

// 알림 권한 요청
export const requestNotificationPermissions = async (): Promise<boolean> => {
    try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log('[Notifications] Permission not granted');
            return false;
        }

        // Android에서 알림 채널 설정
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'Default',
                importance: Notifications.AndroidImportance.HIGH,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
                sound: 'default', // 기본 알림 사운드 사용
                enableVibrate: true,
                enableLights: true,
            });
        }

        return true;
    } catch (error) {
        console.error('[Notifications] Failed to request permissions:', error);
        return false;
    }
};

// 알림 권한 상태 확인
export const checkNotificationPermissions = async (): Promise<boolean> => {
    try {
        const { status } = await Notifications.getPermissionsAsync();
        return status === 'granted';
    } catch (error) {
        console.error('[Notifications] Failed to check permissions:', error);
        return false;
    }
};

// 로컬 알림 표시 (포그라운드/백그라운드 모두)
export const showLocalNotification = async (
    title: string,
    body: string,
    data?: any
): Promise<void> => {
    try {
        const hasPermission = await checkNotificationPermissions();
        if (!hasPermission) {
            console.log('[Notifications] No permission to show notification');
            return;
        }

        // 고유한 알림 ID 생성 (메시지 ID 또는 타임스탬프 사용)
        const notificationId = data?.messageId 
            ? `chat_${data.roomId}_${data.messageId}`
            : `chat_${Date.now()}_${Math.random()}`;

        await Notifications.scheduleNotificationAsync({
            identifier: notificationId, // 고유 ID로 각 알림을 구분
            content: {
                title,
                body,
                data: data || {},
                sound: true, // 각 알림마다 사운드 재생
            },
            trigger: null, // 즉시 표시
        });
    } catch (error) {
        console.error('[Notifications] Failed to show notification:', error);
    }
};

// 알림 설정 저장/불러오기
const NOTIFICATION_SETTING_KEY = '@notification/enabled';

export const getNotificationSetting = async (): Promise<boolean> => {
    try {
        const value = await AsyncStorage.getItem(NOTIFICATION_SETTING_KEY);
        return value !== 'false'; // 기본값은 true
    } catch (error) {
        console.error('[Notifications] Failed to get setting:', error);
        return true; // 기본값
    }
};

export const setNotificationSetting = async (enabled: boolean): Promise<void> => {
    try {
        await AsyncStorage.setItem(NOTIFICATION_SETTING_KEY, enabled ? 'true' : 'false');
    } catch (error) {
        console.error('[Notifications] Failed to save setting:', error);
    }
};

