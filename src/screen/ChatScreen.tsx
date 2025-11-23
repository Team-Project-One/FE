import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import FemaleIcon from '../../assets/female.svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseScreenProps } from '../types';
import BackIcon from '../assets/back.svg';
import BottomNavigation from '../components/BottomNavigation';
import { useTheme } from '../theme/ThemeContext';
import { fetchChatRooms, ChatRoom } from '../api/chat';
import { websocketManager } from '../utils/websocket';

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
            const rooms = await fetchChatRooms(currentUserId);
            setChatRooms(rooms);
        } catch (error) {
            console.error('[ChatScreen] Failed to load chat rooms:', error);
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
                const cleanup = websocketManager.onChatRoomUpdate(() => {
                    if (numericId) {
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
            const now = new Date();
            const diff = now.getTime() - date.getTime();
            const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

            if (diffDays === 0) {
                // 오늘
                const hours = date.getHours();
                const minutes = date.getMinutes();
                const period = hours >= 12 ? '오후' : '오전';
                const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
                return `${period} ${displayHours}:${minutes.toString().padStart(2, '0')}`;
            } else if (diffDays === 1) {
                return '어제';
            } else if (diffDays < 7) {
                return `${diffDays}일 전`;
            } else {
                const month = date.getMonth() + 1;
                const day = date.getDate();
                return `${month}/${day}`;
            }
        } catch (error) {
            console.error('[ChatScreen] Failed to format time:', error);
            return '';
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#000000' : '#FFFFFF' }]}>
            <StatusBar style={isDark ? 'light' : 'dark'} />

            <View
                style={[
                    styles.header,
                    {
                        paddingTop: 36,
                        borderBottomColor: isDark ? '#333333' : '#0000001A',
                    },
                ]}
            >
                <TouchableOpacity onPress={() => onNavigate('main')} style={styles.backButton}>
                    <BackIcon width={24} height={24} color={isDark ? '#FFFFFF' : '#000000'} />
                </TouchableOpacity>

                <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#1E2939' }]}>채팅</Text>
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
                            key={chat.chatRoomId}
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
                                <View style={styles.profileImagePlaceholder}>
                                    <FemaleIcon width={28} height={28} />
                                </View>
                            </View>

                            <View style={styles.chatInfo}>
                                <View style={styles.nameRow}>
                                    <Text style={[styles.chatName, { color: isDark ? '#FFFFFF' : '#1E2939' }]}>
                                        {chat.otherUserName}
                                    </Text>
                                </View>
                                <Text style={[styles.lastMessage, { color: isDark ? '#D1D5DC' : '#4A5565' }]}>
                                    {chat.lastMessage || '메시지가 없습니다.'}
                                </Text>
                            </View>

                            <View style={styles.rightSection}>
                                <Text style={[styles.chatTime, { color: isDark ? '#9CA3AF' : '#6A7282' }]}>
                                    {formatTime(chat.lastMessageTimestamp)}
                                </Text>
                                {(chat.unreadCount ?? 0) > 0 && (
                                    <View style={styles.unreadBadge}>
                                        <Text style={styles.unreadBadgeText}>{chat.unreadCount}</Text>
                                    </View>
                                )}
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
        paddingHorizontal: 24,
        paddingVertical: 35,
        borderBottomWidth: 1.35,
        justifyContent: 'center',
    },
    backButton: {
        position: 'absolute',
        left: 24,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '400',
        lineHeight: 24,
        textAlign: 'center',
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
    chatInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    chatName: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
    },
    lastMessage: {
        fontSize: 14,
        lineHeight: 20,
    },
    rightSection: {
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    chatTime: {
        fontSize: 12,
        lineHeight: 16,
        marginBottom: 8,
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
