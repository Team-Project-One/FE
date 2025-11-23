import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

import BackIcon from '../../assets/back.svg';
import FemaleIcon from '../../assets/female.svg';
import LightIcon from '../../assets/light.svg';
import LocationIcon from '../../assets/location.svg';
import SendIcon from '../../assets/send.svg';
import ReportIcon from '../assets/reportIcon.svg';
import ExitIcon from '../../assets/exit.svg';
import MenuIcon from '../assets/menuIcon.svg';

import ChatTipModal from '../components/ChatTipModal';
import { BaseScreenProps } from '../types';
import { useTheme } from '../theme/ThemeContext';
import { fetchMessages, Message, createOrGetChatRoom, fetchChatRooms } from '../api/chat';
import { websocketManager } from '../utils/websocket';

interface ChatDetailScreenProps extends BaseScreenProps {
    chatName?: string;
    chatAge?: number;
    chatRoomId?: number;
    otherUserId?: number;
}

const ChatDetailScreen: React.FC<ChatDetailScreenProps> = ({ 
    onNavigate, 
    chatName = '지은', 
    chatAge = 26,
    chatRoomId,
    otherUserId,
}) => {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [message, setMessage] = useState('');
    const [showMenu, setShowMenu] = useState(false);
    const [tipVisible, setTipVisible] = useState(true);
    const [messages, setMessages] = useState<Message[]>([]);
    const [userId, setUserId] = useState<number | null>(null);
    const [currentChatRoomId, setCurrentChatRoomId] = useState<number | undefined>(chatRoomId);
    const [currentOtherUserId, setCurrentOtherUserId] = useState<number | undefined>(otherUserId);
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);
    const tipType = 'ice';

    useEffect(() => {
        const checkTip = async () => {
            const viewed = await AsyncStorage.getItem('chat_tip_viewed');
            if (viewed === 'true') setTipVisible(false);
        };
        checkTip();
    }, []);

    // userId 로드 및 WebSocket 연결
    useEffect(() => {
        const initializeChat = async () => {
            try {
                const storedId = await AsyncStorage.getItem('@auth/userId');
                const numericId = storedId ? Number(storedId) : null;
                if (!numericId) {
                    console.error('[ChatDetailScreen] No userId found');
                    return;
                }
                setUserId(numericId);

                // WebSocket 연결
                if (!websocketManager.isConnected()) {
                    await websocketManager.connect(numericId);
                }

                // 채팅방이 있으면 메시지 로드
                if (currentChatRoomId) {
                    await loadMessages(numericId, currentChatRoomId);
                }
            } catch (error) {
                console.error('[ChatDetailScreen] Initialization error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeChat();

        return () => {
            // STOMP에서는 특별한 구독 해제가 필요 없음
        };
    }, [currentChatRoomId]);

    // 메시지 로드
    const loadMessages = async (currentUserId: number, roomId: number) => {
        try {
            const loadedMessages = await fetchMessages(roomId, currentUserId);
            setMessages(loadedMessages);
            // 스크롤을 맨 아래로
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: false });
            }, 100);
        } catch (error) {
            console.error('[ChatDetailScreen] Failed to load messages:', error);
        }
    };

    // 실시간 메시지 수신 핸들러
    useEffect(() => {
        if (!currentChatRoomId || !userId) return;

        const cleanup = websocketManager.onMessage(currentChatRoomId, (newMessage: Message) => {
            setMessages((prev) => {
                // 중복 메시지 방지
                const exists = prev.some((msg) => msg.messageId === newMessage.messageId);
                if (exists) return prev;
                return [...prev, { ...newMessage, isMe: newMessage.senderId === userId }];
            });
            // 스크롤을 맨 아래로
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
        });

        return cleanup;
    }, [currentChatRoomId, userId]);

    const closeTip = async () => {
        setTipVisible(false);
        await AsyncStorage.setItem('chat_tip_viewed', 'true');
    };

    // 메시지 전송
    const handleSendMessage = async () => {
        if (!message.trim() || !userId || !currentOtherUserId || isSending) return;

        const messageContent = message.trim();
        setMessage('');
        setIsSending(true);

        try {
            let roomId = currentChatRoomId;

            // 채팅방이 없으면 생성
            if (!roomId) {
                const room = await createOrGetChatRoom(userId, currentOtherUserId);
                roomId = room.roomId;
                setCurrentChatRoomId(roomId);
                setCurrentOtherUserId(room.otherUserId);
                
                // 새로 생성된 채팅방의 메시지 로드
                await loadMessages(userId, roomId);
            }

            // STOMP로 메시지 전송 (백엔드에서 저장 및 전송 처리)
            if (roomId) {
                websocketManager.sendMessage(roomId, messageContent);
            }

            // 메시지는 WebSocket을 통해 수신되므로 여기서는 UI 업데이트만
            // (실제 메시지는 STOMP를 통해 수신됨)
        } catch (error) {
            console.error('[ChatDetailScreen] Failed to send message:', error);
            setMessage(messageContent); // 실패 시 메시지 복원
        } finally {
            setIsSending(false);
        }
    };

    // 시간 포맷팅
    const formatTime = (dateString: string): string => {
        const date = new Date(dateString);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const period = hours >= 12 ? '오후' : '오전';
        const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
        return `${period} ${displayHours}:${minutes.toString().padStart(2, '0')}`;
    };

    // otherUserId가 없을 때 chatRoomId로 채팅방 정보 가져오기
    useEffect(() => {
        const loadChatRoomInfo = async () => {
            if (!currentChatRoomId && otherUserId) {
                setCurrentOtherUserId(otherUserId);
            } else if (currentChatRoomId && !currentOtherUserId && userId) {
                // 채팅방 정보에서 otherUserId 가져오기
                try {
                    const rooms = await fetchChatRooms(userId);
                    const room = rooms.find((r) => r.roomId === currentChatRoomId);
                    if (room) {
                        setCurrentOtherUserId(room.otherUserId);
                    }
                } catch (error) {
                    console.error('[ChatDetailScreen] Failed to load chat room info:', error);
                }
            }
        };
        loadChatRoomInfo();
    }, [currentChatRoomId, otherUserId, userId]);

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: isDark ? '#000000' : '#FFFFFF' }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar style={isDark ? 'light' : 'dark'} />

            <View
                style={[
                    styles.header,
                    {
                        marginTop: insets.top,
                        borderBottomColor: isDark ? '#333' : '#0000001A',
                    },
                ]}
            >
                <TouchableOpacity onPress={() => onNavigate('chat')} style={styles.backButton}>
                    <BackIcon width={24} height={24} color={isDark ? '#FFF' : '#000'} />
                </TouchableOpacity>

                <View style={styles.profileInfoHeader}>
                    <View style={[styles.profileImageSmall, { backgroundColor: '#FCCEE8' }]}>
                        <FemaleIcon width={24} height={24} />
                    </View>

                    <Text style={[styles.headerName, { color: isDark ? '#FFFFFF' : '#1E2939' }]}>
                        {chatName}({chatAge})
                    </Text>
                </View>

                <TouchableOpacity style={styles.menuButton} onPress={() => setShowMenu(!showMenu)}>
                    <MenuIcon width={24} height={24} color={isDark ? '#FFF' : '#000'} />
                </TouchableOpacity>
            </View>

            <ScrollView 
                ref={scrollViewRef}
                style={styles.messagesContainer} 
                contentContainerStyle={styles.messagesContent}
            >
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <Text style={{ color: isDark ? '#FFFFFF' : '#1E2939' }}>메시지를 불러오는 중...</Text>
                    </View>
                ) : messages.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={{ color: isDark ? '#A0A0A0' : '#6A7282' }}>아직 메시지가 없습니다.</Text>
                    </View>
                ) : (
                    messages.map((msg) =>
                        msg.isMe ? (
                            <View key={msg.messageId} style={styles.myMessageContainer}>
                                <LinearGradient
                                    colors={['#EC4899', '#F43F5E']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.myMessageBubble}
                                >
                                    <Text style={styles.myMessageText}>{msg.content}</Text>
                                </LinearGradient>

                                <Text style={[styles.myMessageTime, { color: isDark ? '#A0A0A0' : '#6A7282' }]}>
                                    {formatTime(msg.timestamp)}
                                </Text>
                            </View>
                        ) : (
                            <View key={msg.messageId} style={styles.theirMessageContainer}>
                                <View
                                    style={[
                                        styles.theirMessageBubble,
                                        {
                                            backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
                                            borderColor: isDark ? '#444' : '#0000001A',
                                        },
                                    ]}
                                >
                                    <Text style={[styles.theirMessageText, { color: isDark ? '#FFFFFF' : '#1E2939' }]}>
                                        {msg.content}
                                    </Text>
                                </View>
                                <Text style={[styles.theirMessageTime, { color: isDark ? '#888' : '#6A7282' }]}>
                                    {formatTime(msg.timestamp)}
                                </Text>
                            </View>
                        )
                    )
                )}
            </ScrollView>

            <View
                style={[
                    styles.inputContainer,
                    {
                        paddingBottom: insets.bottom + 8,
                        backgroundColor: isDark ? '#0D0D0D' : '#FFFFFF',
                        borderTopColor: isDark ? '#333' : '#0000001A',
                    },
                ]}
            >
                <View style={styles.suggestionButtons}>
                    <TouchableOpacity style={styles.suggestionButton}>
                        <LinearGradient colors={['#FCE7F3', '#FFE4E6']} style={styles.suggestionGradient}>
                            <LightIcon width={16} height={16} />
                            <Text style={styles.suggestionText}>아이스브레이킹 주제</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.suggestionButton}>
                        <LinearGradient colors={['#FCE7F3', '#FFE4E6']} style={styles.suggestionGradient}>
                            <LocationIcon width={16} height={16} />
                            <Text style={styles.suggestionText}>데이트 코스 추천</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <View style={styles.messageInputContainer}>
                    <TextInput
                        style={[
                            styles.messageInput,
                            {
                                backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
                                borderColor: isDark ? '#444' : '#D1D5DC',
                                color: isDark ? '#EEEEEE' : '#000000',
                            },
                        ]}
                        value={message}
                        onChangeText={setMessage}
                        placeholder="메시지를 입력하세요"
                        placeholderTextColor={isDark ? '#777777' : '#0A0A0A80'}
                        onSubmitEditing={handleSendMessage}
                        returnKeyType="send"
                    />

                    <TouchableOpacity 
                        style={styles.sendButton} 
                        onPress={handleSendMessage}
                        disabled={!message.trim() || isSending}
                    >
                        <LinearGradient colors={['#F43F5E', '#EC4899']} style={styles.sendButtonGradient}>
                            <SendIcon width={20} height={20} />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>

            {showMenu && (
                <View
                    style={[
                        styles.dropdownMenu,
                        {
                            backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
                            borderColor: isDark ? '#444' : 'rgba(0,0,0,0.1)',
                        },
                    ]}
                >
                    <TouchableOpacity style={styles.menuItem} onPress={() => setShowMenu(false)}>
                        <ReportIcon width={16} height={16} />
                        <Text style={[styles.menuItemText, { color: isDark ? '#FF8888' : '#F54900' }]}>신고하기</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={() => setShowMenu(false)}>
                        <ExitIcon width={16} height={16} />
                        <Text style={[styles.menuItemText, { color: isDark ? '#FF6666' : '#E7000B' }]}>
                            채팅방 나가기
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            <ChatTipModal visible={tipVisible} type={tipType} onClose={closeTip} />
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 28,
        height: 96,
        borderBottomWidth: 1.35,
    },
    backButton: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    profileInfoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    profileImageSmall: {
        width: 40,
        height: 40,
        borderRadius: 450,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerName: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
    },
    menuButton: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 'auto',
    },

    messagesContainer: { flex: 1 },
    messagesContent: { padding: 24, flexGrow: 1 },

    myMessageContainer: {
        alignSelf: 'flex-end',
        marginBottom: 14,
        maxWidth: '75%',
        alignItems: 'flex-end',
    },
    myMessageBubble: {
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 10,
    },
    myMessageText: { color: '#FFFFFF', fontSize: 16, lineHeight: 24 },
    myMessageTime: { marginTop: 4, fontSize: 12, textAlign: 'right' },

    theirMessageContainer: {
        alignSelf: 'flex-start',
        marginBottom: 12,
        maxWidth: '75%',
    },
    theirMessageBubble: {
        borderWidth: 1.35,
        paddingVertical: 10,
        paddingHorizontal: 17,
        borderRadius: 10,
    },
    theirMessageText: { fontSize: 16, lineHeight: 24 },
    theirMessageTime: {
        marginTop: 4,
        fontSize: 12,
        textAlign: 'left',
    },

    inputContainer: {
        paddingHorizontal: 16,
        paddingTop: 21,
        borderTopWidth: 1.35,
    },
    suggestionButtons: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 21,
    },
    suggestionButton: {
        flex: 1,
        borderRadius: 10,
        overflow: 'hidden',
    },
    suggestionGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 10,
        gap: 2,
    },

    suggestionText: {
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 20,
        color: '#C6005C',
    },

    messageInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingBottom: 24,
    },
    messageInput: {
        flex: 1,
        minHeight: 50,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 1.35,
        borderRadius: 10,
        fontSize: 16,
    },

    sendButton: {
        width: 50,
        height: 50,
        borderRadius: 10,
        overflow: 'hidden',
    },
    sendButtonGradient: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },

    dropdownMenu: {
        position: 'absolute',
        top: 72,
        right: 24,
        borderRadius: 10,
        borderWidth: 1.35,
        paddingVertical: 8,
        paddingHorizontal: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 12,
        minWidth: 180,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        gap: 8,
    },
    menuItemText: {
        fontSize: 16,
        fontWeight: '400',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
});

export default ChatDetailScreen;
