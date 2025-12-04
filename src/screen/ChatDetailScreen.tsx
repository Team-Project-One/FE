import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Animated,
    TouchableWithoutFeedback,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

import BackIcon from '../../assets/back.svg';
import FemaleAvatarIcon from '../../assets/female.svg';
import MaleAvatarIcon from '../../assets/male.svg';
import LightIcon from '../../assets/light.svg';
import LocationIcon from '../../assets/location.svg';
import SendIcon from '../../assets/send.svg';
import ReportIcon from '../assets/reportIcon.svg';
import ExitIcon from '../../assets/exit.svg';
import MenuIcon from '../assets/menuIcon.svg';

import ChatTipModal from '../components/ChatTipModal';
import IcebreakingTopicModal from '../components/IcebreakingTopicModal';
import DatingCourseModal from '../components/DatingCourseModal';
import ConfirmModal from '../components/ConfirmModal';
import { BaseScreenProps } from '../types';
import { useTheme } from '../theme/ThemeContext';
import { fetchMessages, Message, createOrGetChatRoom, leaveChatRoom, fetchChatRooms, ChatRoom } from '../api/chat';
import { websocketManager } from '../utils/websocket';
import { resetUnreadCount, setLastReadTimestamp } from '../utils/chatStorage';
import { API_BASE_URL } from '../api/config';
import { Image } from 'react-native';
import { fetchMyPage } from '../api/mypage';
import { fetchMatchingResultWithMatchedUser } from '../api/matching';

// 앱이 실행되어 있는 동안(세션 단위) 각 채팅방에서 팁 모달을 이미 보여줬는지 추적
const viewedTipRoomIds: Set<number> = new Set();

interface ChatDetailScreenProps extends BaseScreenProps {
    chatName?: string;
    chatAge?: number;
    chatRoomId?: number;
    otherUserId?: number;
    showTip?: boolean; // 매칭결과 화면에서 온 경우 모달 강제 표시
}

const ChatDetailScreen: React.FC<ChatDetailScreenProps> = ({ 
    onNavigate, 
    chatName = '지은', 
    chatAge = 26,
    chatRoomId,
    otherUserId,
    showTip = false,
}) => {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [message, setMessage] = useState('');
    const [showMenu, setShowMenu] = useState(false);
    // 기본값은 false로 두고, 채팅방 ID가 결정된 뒤에 조건에 따라 켜준다
    const [tipVisible, setTipVisible] = useState(false);
    const [icebreakingTopicVisible, setIcebreakingTopicVisible] = useState(false);
    const [datingCourseVisible, setDatingCourseVisible] = useState(false);
    const [showLeaveConfirmModal, setShowLeaveConfirmModal] = useState(false);
    const [showLeaveSuccessModal, setShowLeaveSuccessModal] = useState(false);
    const [showLeaveErrorModal, setShowLeaveErrorModal] = useState(false);
    const [showReportConfirmModal, setShowReportConfirmModal] = useState(false);
    const [showReportErrorModal, setShowReportErrorModal] = useState(false);
    const [showOtherLeftModal, setShowOtherLeftModal] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [userId, setUserId] = useState<number | null>(null);
    const [currentChatRoomId, setCurrentChatRoomId] = useState<number | undefined>(chatRoomId);
    const [currentOtherUserId, setCurrentOtherUserId] = useState<number | undefined>(otherUserId);
    const [chatRoomInfo, setChatRoomInfo] = useState<ChatRoom | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [isOtherTyping, setIsOtherTyping] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);
    const typingDot1 = useRef(new Animated.Value(0.3)).current;
    const typingDot2 = useRef(new Animated.Value(0.3)).current;
    const typingDot3 = useRef(new Animated.Value(0.3)).current;
    const tipType = 'ice';

    // 나이 계산 함수
    const getAgeFromBirth = (birthDate?: string | null): number | null => {
        if (!birthDate) return null;
        const birth = new Date(birthDate);
        if (Number.isNaN(birth.getTime())) return null;
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    // 상대 입력 중 애니메이션 (● ● ● 순차 점멸 - 자연스럽게)
    useEffect(() => {
        const createDotAnimation = (value: Animated.Value, delay: number) =>
            Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(value, {
                        toValue: 1,
                        duration: 220,
                        useNativeDriver: true,
                    }),
                    Animated.timing(value, {
                        toValue: 0.3,
                        duration: 220,
                        useNativeDriver: true,
                    }),
                ])
            );

        const anim1 = createDotAnimation(typingDot1, 0);
        const anim2 = createDotAnimation(typingDot2, 150);
        const anim3 = createDotAnimation(typingDot3, 300);

        anim1.start();
        anim2.start();
        anim3.start();

        return () => {
            anim1.stop();
            anim2.stop();
            anim3.stop();
        };
    }, [typingDot1, typingDot2, typingDot3]);

    // 프로필 이미지 URI 해결
    const resolveImageUri = (path?: string | null) => {
        if (!path) return null;
        if (path.startsWith('http://') || path.startsWith('https://')) {
            return path;
        }
        const base = API_BASE_URL.replace(/\/$/, '');
        const normalized = path.startsWith('/') ? path : `/${path}`;
        return `${base}${normalized}`;
    };

    // 입력 중 말풍선 점 애니메이션용 opacity
    const dotOpacity1 = typingDot1;
    const dotOpacity2 = typingDot2;
    const dotOpacity3 = typingDot3;

    const markRoomAsRead = useCallback(
        async (roomId?: number, timestamp?: string) => {
            if (!roomId) return;
            try {
                await resetUnreadCount(roomId);
                if (timestamp) {
                    await setLastReadTimestamp(roomId, timestamp);
                }
            } catch (error) {
                console.error('[ChatDetailScreen] Failed to mark room as read:', error);
            }
        },
        []
    );

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

                let targetRoomId = currentChatRoomId;

                if (!targetRoomId && currentOtherUserId) {
                    const room = await createOrGetChatRoom(numericId, currentOtherUserId);
                    const derivedRoomId = room.roomId ?? room.chatRoomId ?? room.id;
                    targetRoomId = derivedRoomId;
                    if (targetRoomId) {
                        setCurrentChatRoomId(targetRoomId);
                        setCurrentOtherUserId(room.otherUserId ?? currentOtherUserId);
                        setChatRoomInfo(room); // 채팅방 정보 설정
                    }
                }

                // 채팅방이 있으면 메시지 로드
                if (targetRoomId) {
                    await loadMessages(numericId, targetRoomId);
                    // 팁 모달은 채팅방별로, 앱이 켜져 있는 동안 최초 진입 시에만 표시
                    // 단, 매칭결과 화면에서 온 경우(showTip=true)는 강제로 표시
                    if (showTip || !viewedTipRoomIds.has(targetRoomId)) {
                        setTipVisible(true);
                        viewedTipRoomIds.add(targetRoomId);
                    } else {
                        setTipVisible(false);
                    }
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
    }, [currentChatRoomId, currentOtherUserId, markRoomAsRead]);

    useEffect(() => {
        if (!currentChatRoomId) return;
        websocketManager.setActiveRoom(currentChatRoomId);
        markRoomAsRead(currentChatRoomId);
        return () => {
            websocketManager.setActiveRoom(null);
        };
    }, [currentChatRoomId, markRoomAsRead]);

    // 메시지 로드
    const loadMessages = async (currentUserId: number, roomId: number) => {
        try {
            const loadedMessages = await fetchMessages(roomId, currentUserId);
            setMessages(loadedMessages);
            if (loadedMessages.length > 0) {
                const lastTimestamp = loadedMessages[loadedMessages.length - 1].timestamp;
                markRoomAsRead(roomId, lastTimestamp);
            } else {
                markRoomAsRead(roomId);
            }
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
            markRoomAsRead(currentChatRoomId, newMessage.timestamp);
        });

        const typingCleanup = websocketManager.onTyping(currentChatRoomId, (typing: boolean) => {
            setIsOtherTyping(typing);
        });

        // 상대방 나가기 이벤트 구독
        const roomLeftCleanup = websocketManager.onRoomLeft(currentChatRoomId, () => {
            setShowOtherLeftModal(true);
        });

        return () => {
            cleanup();
            typingCleanup();
            roomLeftCleanup();
        };
    }, [currentChatRoomId, userId, markRoomAsRead]);

    const closeTip = async () => {
        console.log('[ChatDetailScreen] closeTip called');
        setTipVisible(false);
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
                await markRoomAsRead(roomId);
            }

            // WebSocket이 끊겼다면 재연결 시도
            if (!websocketManager.isConnected()) {
                await websocketManager.connect(userId);
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

    // 채팅방 정보 가져오기
    useEffect(() => {
        const loadChatRoomInfo = async () => {
            if (!userId) return;

            try {
                if (currentChatRoomId) {
                    // 채팅방 ID로 정보 가져오기
                    const rooms = await fetchChatRooms(userId);
                    const room = rooms.find((r) => r.roomId === currentChatRoomId);
                    if (room) {
                        console.log('[ChatDetailScreen] Chat room info:', room);
                        // 생년월일이 없으면 사용자 정보에서 가져오기 시도
                        if (!room.otherUserBirthDate && room.otherUserId) {
                            try {
                                // 다른 사용자의 정보를 가져올 수 있는 API가 필요
                                // 일단 채팅방 정보만 사용
                                console.log('[ChatDetailScreen] BirthDate not found in room info');
                            } catch (err) {
                                console.error('[ChatDetailScreen] Failed to fetch user info:', err);
                            }
                        }
                        setChatRoomInfo(room);
                        setCurrentOtherUserId(room.otherUserId);
                    }
                } else if (otherUserId) {
                    // otherUserId로 채팅방 찾기
                    setCurrentOtherUserId(otherUserId);
                    const rooms = await fetchChatRooms(userId);
                    const room = rooms.find((r) => r.otherUserId === otherUserId);
                    if (room) {
                        console.log('[ChatDetailScreen] Chat room info:', room);
                        setChatRoomInfo(room);
                        setCurrentChatRoomId(room.roomId);
                    }
                }
            } catch (error) {
                console.error('[ChatDetailScreen] Failed to load chat room info:', error);
            }
        };
        loadChatRoomInfo();
    }, [currentChatRoomId, otherUserId, userId]);

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: isDark ? '#000000' : '#FFFFFF' }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -70}
        >
            <StatusBar style={isDark ? 'light' : 'dark'} />

            <View
                style={[
                    styles.header,
                    {
                        marginTop: insets.top,
                        borderBottomColor: isDark ? '#333' : '#0000001A',
                        backgroundColor: isDark ? '#000000' : '#FFFFFF',
                    },
                ]}
            >
                <TouchableOpacity onPress={() => onNavigate('chat')} style={styles.backButton}>
                    <BackIcon width={24} height={24} color={isDark ? '#FFF' : '#000'} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.profileInfoHeader}
                    onPress={async () => {
                        const targetUserId = currentOtherUserId ?? otherUserId ?? chatRoomInfo?.otherUserId;
                        if (!targetUserId || !userId) {
                            Alert.alert('알림', '사용자 정보를 불러올 수 없습니다.');
                            return;
                        }

                        try {
                            // 내 userId와 상대방 userId를 모두 전달하여 두 사람 간의 매칭 결과 가져오기
                            const matchResult = await fetchMatchingResultWithMatchedUser(userId, targetUserId);
                            // 채팅방 정보를 함께 전달하여 뒤로가기 시 채팅방으로 돌아갈 수 있도록
                            onNavigate('matchingResult', { 
                                matchResult, 
                                fromChat: true,
                                chatRoomId: currentChatRoomId,
                                otherUserId: targetUserId,
                                chatName: chatRoomInfo?.otherUserName || chatName,
                                chatAge: chatRoomInfo?.otherUserAge || chatAge,
                            });
                        } catch (error) {
                            console.error('[ChatDetailScreen] Failed to fetch matching result:', error);
                            Alert.alert('오류', '매칭 결과를 불러오는 중 오류가 발생했습니다.');
                        }
                    }}
                >
                    {chatRoomInfo?.otherUserProfileImage ? (
                        <Image
                            source={{ uri: resolveImageUri(chatRoomInfo.otherUserProfileImage) || undefined }}
                            style={styles.profileImageSmall}
                        />
                    ) : (
                        <View
                            style={[
                                styles.profileImageSmall,
                                {
                                    backgroundColor:
                                        chatRoomInfo?.otherUserGender === 'MALE' ? '#BFDBFE' : '#FCCEE8',
                                },
                            ]}
                        >
                            {chatRoomInfo?.otherUserGender === 'MALE' ? (
                                <MaleAvatarIcon width={24} height={24} />
                            ) : (
                                <FemaleAvatarIcon width={24} height={24} />
                            )}
                    </View>
                    )}

                    <Text style={[styles.headerName, { color: isDark ? '#FFFFFF' : '#1E2939' }]}>
                        {chatRoomInfo?.otherUserName || chatName}
                        ({(() => {
                            if (chatRoomInfo?.otherUserBirthDate) {
                                const calculatedAge = getAgeFromBirth(chatRoomInfo.otherUserBirthDate);
                                if (calculatedAge !== null) {
                                    return calculatedAge;
                                }
                            }
                            return chatRoomInfo?.otherUserAge || chatAge;
                        })()})
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuButton} onPress={() => setShowMenu(!showMenu)}>
                    <MenuIcon width={24} height={24} color={isDark ? '#FFF' : '#000'} />
                </TouchableOpacity>
            </View>

            <ScrollView 
                ref={scrollViewRef}
                style={[
                    styles.messagesContainer,
                    {
                        backgroundColor:
                            chatRoomInfo?.otherUserGender === 'MALE'
                                ? isDark
                                    ? '#0A1A2E'
                                    : '#EFF6FF'
                                : isDark
                                ? '#2A1A2A'
                                : '#FDF2F8',
                    },
                ]} 
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
                    <>
                        {messages.map((msg) =>
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
                        )}

                        {isOtherTyping && (
                            <View style={styles.theirMessageContainer}>
                                <View
                                    style={[
                                        styles.theirMessageBubble,
                                        {
                                            backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
                                            borderColor: isDark ? '#444' : '#0000001A',
                                        },
                                    ]}
                                >
                                    <View style={styles.typingDotsRow}>
                                        <Animated.View
                                            style={[
                                                styles.typingDot,
                                                { backgroundColor: isDark ? '#E5E7EB' : '#9CA3AF', opacity: dotOpacity1 },
                                            ]}
                                        />
                                        <Animated.View
                                            style={[
                                                styles.typingDot,
                                                { backgroundColor: isDark ? '#E5E7EB' : '#9CA3AF', opacity: dotOpacity2 },
                                            ]}
                                        />
                                        <Animated.View
                                            style={[
                                                styles.typingDot,
                                                { backgroundColor: isDark ? '#E5E7EB' : '#9CA3AF', opacity: dotOpacity3 },
                                            ]}
                                        />
                                    </View>
                                </View>
                            </View>
                        )}
                    </>
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
                    <TouchableOpacity
                        style={[
                            styles.suggestionButton,
                            tipVisible && tipType === 'ice' && { opacity: 1 },
                        ]}
                        onPress={() => setIcebreakingTopicVisible(true)}
                    >
                        <LinearGradient colors={['#FCE7F3', '#FFE4E6']} style={styles.suggestionGradient}>
                            <LightIcon width={16} height={16} />
                            <Text style={styles.suggestionText}>아이스브레이킹 주제</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.suggestionButton}
                        onPress={() => setDatingCourseVisible(true)}
                    >
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
                        onChangeText={(text) => {
                            setMessage(text);
                            if (currentChatRoomId) {
                                websocketManager.sendTyping(currentChatRoomId, text.length > 0);
                            }
                        }}
                        placeholder="메시지를 입력하세요"
                        placeholderTextColor={isDark ? '#777777' : '#0A0A0A80'}
                        maxLength={200}
                        onSubmitEditing={handleSendMessage}
                        onFocus={() => {
                            if (currentChatRoomId) {
                                websocketManager.sendTyping(currentChatRoomId, message.trim().length > 0);
                            }
                        }}
                        onBlur={() => {
                            if (currentChatRoomId) {
                                websocketManager.sendTyping(currentChatRoomId, false);
                            }
                        }}
                        returnKeyType="send"
                        multiline={false}
                        blurOnSubmit={false}
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
                <>
                    {/* 외부 클릭 시 메뉴 닫기 */}
                    <TouchableWithoutFeedback onPress={() => setShowMenu(false)}>
                        <View style={styles.menuOverlay} />
                    </TouchableWithoutFeedback>
                <View
                    style={[
                        styles.dropdownMenu,
                        {
                            backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
                            borderColor: isDark ? '#444' : 'rgba(0,0,0,0.1)',
                        },
                    ]}
                >
                        <TouchableOpacity style={styles.menuItem} onPress={() => {
                            if (!currentChatRoomId) {
                                setShowMenu(false);
                                return;
                            }
                            setShowMenu(false);
                            setShowReportConfirmModal(true);
                        }}>
                        <ReportIcon width={16} height={16} />
                        <Text style={[styles.menuItemText, { color: isDark ? '#FF8888' : '#F54900' }]}>신고하기</Text>
                    </TouchableOpacity>

                        <TouchableOpacity style={styles.menuItem} onPress={() => {
                        if (!currentChatRoomId) {
                            setShowMenu(false);
                            return;
                        }
                            setShowMenu(false);
                            setShowLeaveConfirmModal(true);
                    }}>
                        <ExitIcon width={16} height={16} />
                        <Text style={[styles.menuItemText, { color: isDark ? '#FF6666' : '#E7000B' }]}>
                            채팅방 나가기
                        </Text>
                    </TouchableOpacity>
                </View>
                </>
            )}

            <ChatTipModal visible={tipVisible} type={tipType} onClose={closeTip} />
            <IcebreakingTopicModal
                visible={icebreakingTopicVisible}
                otherUserName={chatRoomInfo?.otherUserName || chatName}
                myUserId={userId}
                matchedUserId={currentOtherUserId ?? otherUserId}
                onClose={() => setIcebreakingTopicVisible(false)}
            />
            <DatingCourseModal
                visible={datingCourseVisible}
                otherUserName={chatRoomInfo?.otherUserName || chatName}
                myUserId={userId}
                matchedUserId={currentOtherUserId ?? otherUserId}
                onClose={() => setDatingCourseVisible(false)}
            />
            <ConfirmModal
                visible={showLeaveConfirmModal}
                title="채팅방 나가기"
                message="정말 채팅방에서 나가시겠어요?"
                confirmText="나가기"
                cancelText="취소"
                onConfirm={async () => {
                    setShowLeaveConfirmModal(false);
                    if (!currentChatRoomId) return;
                    try {
                        await leaveChatRoom(currentChatRoomId);
                        setShowLeaveSuccessModal(true);
                    } catch (error) {
                        console.error('[ChatDetailScreen] Failed to leave chat room', error);
                        setShowLeaveErrorModal(true);
                    }
                }}
                onCancel={() => setShowLeaveConfirmModal(false)}
            />
            <ConfirmModal
                visible={showLeaveSuccessModal}
                title="알림"
                message="채팅방에서 나갔습니다."
                confirmText="확인"
                cancelText={undefined}
                onConfirm={() => {
                    setShowLeaveSuccessModal(false);
                    onNavigate('chat');
                }}
                onCancel={() => {
                    setShowLeaveSuccessModal(false);
                    onNavigate('chat');
                }}
            />
            <ConfirmModal
                visible={showLeaveErrorModal}
                title="오류"
                message="채팅방 나가기에 실패했습니다."
                confirmText="확인"
                cancelText={undefined}
                onConfirm={() => setShowLeaveErrorModal(false)}
                onCancel={() => setShowLeaveErrorModal(false)}
            />
            <ConfirmModal
                visible={showReportConfirmModal}
                title="신고하기"
                message="신고하시겠습니까?"
                confirmText="신고하기"
                cancelText="취소"
                onConfirm={async () => {
                    setShowReportConfirmModal(false);
                    if (!currentChatRoomId) return;
                    try {
                        await leaveChatRoom(currentChatRoomId);
                        onNavigate('chat');
                    } catch (error) {
                        console.error('[ChatDetailScreen] Failed to report chat room', error);
                        setShowReportErrorModal(true);
                    }
                }}
                onCancel={() => setShowReportConfirmModal(false)}
            />
            <ConfirmModal
                visible={showReportErrorModal}
                title="오류"
                message="신고 처리 중 오류가 발생했습니다."
                confirmText="확인"
                cancelText={undefined}
                onConfirm={() => setShowReportErrorModal(false)}
                onCancel={() => setShowReportErrorModal(false)}
            />
            <ConfirmModal
                visible={showOtherLeftModal}
                title="알림"
                message="상대방이 채팅방을 나갔습니다."
                confirmText="확인"
                cancelText=""
                onConfirm={() => {
                    setShowOtherLeftModal(false);
                    onNavigate('chat');
                }}
                onCancel={() => {
                    setShowOtherLeftModal(false);
                    onNavigate('chat');
                }}
            />
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
        borderRadius: 20,
        backgroundColor: '#FCCEE8',
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

    typingDotsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        paddingHorizontal: 6,
        paddingVertical: 6,
    },
    typingDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },

    messageInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingBottom: 24,
    },
    messageInput: {
        flex: 1,
        height: 50,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 1.35,
        borderRadius: 10,
        fontSize: 16,
        textAlignVertical: 'center',
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

    menuOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 998,
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
        zIndex: 999,
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
