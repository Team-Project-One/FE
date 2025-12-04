import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_READ_KEY = '@chat/lastReadMap';
const UNREAD_COUNT_KEY = '@chat/unreadCountMap';

type LastReadMap = Record<string, string>;
type UnreadCountMap = Record<string, number>;

const readMap = async <T extends Record<string, any>>(key: string): Promise<T> => {
    try {
        const stored = await AsyncStorage.getItem(key);
        return stored ? (JSON.parse(stored) as T) : ({} as T);
    } catch (error) {
        console.error('[chatStorage] Failed to read map:', key, error);
        return {} as T;
    }
};

const writeMap = async (key: string, map: Record<string, any>) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(map));
    } catch (error) {
        console.error('[chatStorage] Failed to write map:', key, error);
    }
};

export const getLastReadMap = () => readMap<LastReadMap>(LAST_READ_KEY);

export const setLastReadTimestamp = async (roomId: number, timestamp: string) => {
    const map = await readMap<LastReadMap>(LAST_READ_KEY);
    map[String(roomId)] = timestamp;
    await writeMap(LAST_READ_KEY, map);
};

export const getUnreadCountMap = () => readMap<UnreadCountMap>(UNREAD_COUNT_KEY);

export const setUnreadCount = async (roomId: number, count: number) => {
    const map = await readMap<UnreadCountMap>(UNREAD_COUNT_KEY);
    map[String(roomId)] = Math.max(0, count);
    await writeMap(UNREAD_COUNT_KEY, map);
};

// 순차 처리를 위한 큐
const incrementQueue: Map<string, Promise<number>> = new Map();

export const incrementUnreadCount = async (roomId: number): Promise<number> => {
    const key = String(roomId);
    
    // 이미 진행 중인 작업이 있으면 대기
    const existingPromise = incrementQueue.get(key);
    if (existingPromise) {
        await existingPromise;
    }
    
    // 새로운 작업 시작
    const promise = (async () => {
        try {
            const map = await readMap<UnreadCountMap>(UNREAD_COUNT_KEY);
            const currentCount = map[key] ?? 0;
            const newCount = currentCount + 1;
            map[key] = newCount;
            await writeMap(UNREAD_COUNT_KEY, map);
            return newCount;
        } finally {
            incrementQueue.delete(key);
        }
    })();
    
    incrementQueue.set(key, promise);
    return promise;
};

export const resetUnreadCount = async (roomId: number) => {
    const map = await readMap<UnreadCountMap>(UNREAD_COUNT_KEY);
    const key = String(roomId);
    if (map[key]) {
        map[key] = 0;
        await writeMap(UNREAD_COUNT_KEY, map);
    }
};

