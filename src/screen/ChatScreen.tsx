import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import FemaleAvatarIcon from '../../assets/female.svg';
import MaleAvatarIcon from '../../assets/male.svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseScreenProps } from '../types';
import BackIcon from '../assets/back.svg';
import BottomNavigation from '../components/BottomNavigation';
import { useTheme } from '../theme/ThemeContext';
import { fetchChatRooms, ChatRoom } from '../api/chat';
import { websocketManager } from '../utils/websocket';
import { API_BASE_URL } from '../api/config';
import { getUnreadCountMap, getLastReadMap } from '../utils/chatStorage';
import { ApiError } from '../api/client';

interface ChatScreenProps extends BaseScreenProps {}

const ChatScreen: React.FC<ChatScreenProps> = ({ onNavigate }) => {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [userId, setUserId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 채팅방 목록 로드
    const loadChatRooms = async (currentUserId: number) => {
        try {
            setIsLoading(true);
            const [rooms, unreadMap, lastReadMap] = await Promise.all([
                fetchChatRooms(currentUserId),
                getUnreadCountMap(),
                getLastReadMap(),
            ]);

            const enhancedRooms = rooms.map((room) => {
                const key = String(room.roomId);
                const storedUnread = unreadMap[key] ?? 0;
                if (storedUnread > 0) {
                    return { ...room, unreadCount: storedUnread };
                }

                const lastReadTimestamp = lastReadMap[key];
                let fallbackUnread = 0;
                if (room.lastMessageTimestamp) {
                    const lastMessageTime = Date.parse(room.lastMessageTimestamp);
                    const lastReadTime = lastReadTimestamp ? Date.parse(lastReadTimestamp) : 0;
                    if (!lastReadTimestamp || lastMessageTime > lastReadTime) {
                        fallbackUnread = 1;
                    }
                }

                const apiUnread = room.unreadCount ?? 0;
                return { ...room, unreadCount: Math.max(apiUnread, fallbackUnread) };
            });

            setChatRooms(enhancedRooms);
        } catch (error) {
            console.error('[ChatScreen] Failed to load chat rooms:', error);
            // 401 에러인 경우 로그인 화면으로 리다이렉트
            if (error instanceof ApiError && error.status === 401) {
                console.log('[ChatScreen] Unauthorized - Redirecting to login');
                onNavigate('signupLanding');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // 초기화 및 WebSocket 연결
    useEffect(() => {
        const initialize = async () => {
            try {
                const storedId = await AsyncStorage.getItem('@auth/userId');
                const numericId = storedId ? Number(storedId) : null;
                if (!numericId) {
                    console.error('[ChatScreen] No userId found');
                    setIsLoading(false);
                    return;
                }
                setUserId(numericId);

                // WebSocket 연결
                if (!websocketManager.isConnected()) {
                    await websocketManager.connect(numericId);
                }

                // 채팅방 목록 로드
                await loadChatRooms(numericId);

                // 실시간 채팅방 업데이트 핸들러 등록
                const cleanup = websocketManager.onChatRoomUpdate(async (roomId) => {
                    if (numericId) {
                        // 특정 채팅방이 업데이트된 경우 즉시 해당 채팅방만 업데이트
                        if (roomId) {
                            const [unreadMap] = await Promise.all([getUnreadCountMap()]);
                            setChatRooms((prev) =>
                                prev.map((room) => {
                                    if (room.roomId === roomId) {
                                        const storedUnread = unreadMap[String(roomId)] ?? 0;
                                        return { ...room, unreadCount: storedUnread };
                                    }
                                    return room;
                                })
                            );
                        }
                        // 전체 목록도 백그라운드에서 업데이트
                        loadChatRooms(numericId);
                    }
                });

                return cleanup;
            } catch (error) {
                console.error('[ChatScreen] Initialization error:', error);
                setIsLoading(false);
            }
        };

        const cleanup = initialize();
        return () => {
            cleanup.then((fn) => fn?.());
        };
    }, []);

    // 시간 포맷팅
    const formatTime = (dateString: string | null): string => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const period = hours >= 12 ? '오후' : '오전';
            const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
            return `${period} ${displayHours}:${minutes.toString().padStart(2, '0')}`;
        } catch (error) {
            console.error('[ChatScreen] Failed to format time:', error);
            return '';
        }
    };

    const resolveImageUri = (path?: string | null) => {
        if (!path) return null;
        if (path.startsWith('http://') || path.startsWith('https://')) {
            return path;
        }
        const base = API_BASE_URL.replace(/\/$/, '');
        const normalized = path.startsWith('/') ? path : `/${path}`;
        return `${base}${normalized}`;
    };

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#000000' : '#FFFFFF' }]}>
            <StatusBar style={isDark ? 'light' : 'dark'} />

            <View style={[styles.header, { marginTop: insets.top, borderBottomColor: isDark ? '#333333' : '#0000001A' }]}>
                {/* 채팅 화면에서는 뒤로가기 버튼 제거 */}
                <View style={styles.headerLeftPlaceholder} />

                <View style={styles.headerTitleWrapper}>
                    <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#1E2939' }]}>채팅</Text>
                </View>

                <View style={styles.headerRightPlaceholder} />
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={isDark ? '#FFFFFF' : '#1E2939'} />
                </View>
            ) : chatRooms.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={[styles.emptyText, { color: isDark ? '#A0A0A0' : '#6A7282' }]}>
                        아직 채팅방이 없습니다.
                    </Text>
                </View>
            ) : (
            <ScrollView contentContainerStyle={styles.chatList} showsVerticalScrollIndicator={true}>
                    {chatRooms.map((chat) => (
                    <TouchableOpacity
                            key={chat.roomId ?? chat.chatRoomId ?? `${chat.otherUserId}-${chat.lastMessageTimestamp}`}
                        style={[
                            styles.chatItem,
                            {
                                borderBottomColor: isDark ? '#333333' : '#0000001A',
                            },
                        ]}
                        onPress={() =>
                            onNavigate('chatDetail', {
                                    chatName: chat.otherUserName,
                                    chatAge: chat.otherUserAge,
                                    chatRoomId: chat.roomId,
                                    otherUserId: chat.otherUserId,
                            })
                        }
                    >
                        <View style={styles.profileImageContainer}>
                            {chat.otherUserProfileImage ? (
                                <Image
                                    source={{ uri: resolveImageUri(chat.otherUserProfileImage) || undefined }}
                                    style={styles.profileImage}
                                />
                            ) : (
                                <View
                                    style={[
                                        styles.profileImagePlaceholder,
                                        {
                                            // 성별에 따라 기본 프로필 배경색 분기: 남자(파랑), 여자/기타(핑크)
                                            backgroundColor:
                                                chat.otherUserGender === 'MALE' ? '#BFDBFE' : '#FCCEE8',
                                        },
                                    ]}
                                >
                                    {chat.otherUserGender === 'MALE' ? (
                                        <MaleAvatarIcon width={28} height={28} />
                                    ) : (
                                        <FemaleAvatarIcon width={28} height={28} />
                                    )}
                                </View>
                            )}
                        </View>

                        <View style={styles.chatInfo}>
                                <View style={styles.chatHeaderRow}>
                                <Text style={[styles.chatName, { color: isDark ? '#FFFFFF' : '#1E2939' }]}>
                                        {chat.otherUserName}
                                        {chat.otherUserAge ? `(${chat.otherUserAge})` : ''}
                                </Text>
                                    <Text style={[styles.chatTime, { color: isDark ? '#9CA3AF' : '#6A7282' }]}>
                                        {formatTime(chat.lastMessageTimestamp)}
                            </Text>
                        </View>

                                <View style={styles.chatMessageRow}>
                                    <Text 
                                        style={[styles.lastMessage, { color: isDark ? '#D1D5DC' : '#4A5565' }]}
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                    >
                                        {chat.lastMessage || '메시지가 없습니다.'}
                            </Text>
                                    {(chat.unreadCount ?? 0) > 0 && (
                                <View style={styles.unreadBadge}>
                                            <Text style={styles.unreadBadgeText}>
                                                {(chat.unreadCount ?? 0) > 99 ? '99+' : chat.unreadCount}
                                            </Text>
                                </View>
                            )}
                                </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            )}

            <BottomNavigation onNavigate={onNavigate} currentScreen={'chat'} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 35,
        borderBottomWidth: 1.35,
    },
    headerLeftPlaceholder: { width: 24, height: 24 },
    headerTitleWrapper: { flex: 1, alignItems: 'center' },
    headerRightPlaceholder: { width: 24, height: 24 },
    headerTitle: {
        fontSize: 20,
        fontWeight: '400',
        lineHeight: 24,
    },
    chatList: {
        flexGrow: 1,
    },
    chatItem: {
        flexDirection: 'row',
        paddingVertical: 20,
        paddingHorizontal: 24,
        borderBottomWidth: 1.35,
    },
    profileImageContainer: {
        marginRight: 16,
    },
    profileImagePlaceholder: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#FCCEE8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImage: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#FCCEE8',
    },
    chatInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    chatHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    chatName: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 22,
    },
    chatMessageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
    },
    lastMessage: {
        fontSize: 14,
        lineHeight: 20,
        flex: 1,
    },
    chatTime: {
        fontSize: 12,
        lineHeight: 16,
    },
    unreadBadge: {
        backgroundColor: '#F6339A',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    unreadBadgeText: {
        fontSize: 12,
        fontWeight: '400',
        lineHeight: 16,
        color: '#FFFFFF',
        paddingBottom: 2,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
    },
});

export default ChatScreen;
