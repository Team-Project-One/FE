import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { API_BASE_URL } from '../api/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message } from '../api/chat';
import { incrementUnreadCount, resetUnreadCount, setLastReadTimestamp } from './chatStorage';
import { showLocalNotification, getNotificationSetting } from './notifications';

// STOMP WebSocket URL 생성
const getWebSocketUrl = (): string => {
    // SockJS는 HTTP/HTTPS URL 사용
    const baseUrl = API_BASE_URL.replace(/\/$/, '');
    return `${baseUrl}/ws/chat`;
};

class WebSocketManager {
    private client: Client | null = null;
    private userId: number | null = null;
    private isConnecting = false;
    private connectPromise: Promise<void> | null = null;
    private messageSubscriptions: Map<number, StompSubscription> = new Map();
    private messageHandlers: Map<number, Set<(message: Message) => void>> = new Map();
    private typingHandlers: Map<number, Set<(typing: boolean) => void>> = new Map();
    private chatRoomUpdateHandlers: Set<(roomId?: number) => void> = new Set();
    private roomEventHandlers: Map<number, Set<() => void>> = new Map();
    private activeRoomId: number | null = null;

    // WebSocket 연결
    async connect(userId: number): Promise<void> {
        // 이미 연결 완료된 경우
        if (this.client?.connected) {
            console.log('[STOMP] Already connected');
            return;
        }

        // 이미 연결 중인 경우, 기존 연결 시도 완료까지 대기
        if (this.connectPromise) {
            console.log('[STOMP] Already connecting, waiting for existing connection');
            return this.connectPromise;
        }

        this.userId = userId;
        this.isConnecting = true;

        this.connectPromise = new Promise<void>(async (resolve, reject) => {
            try {
                const accessToken = await AsyncStorage.getItem('@auth/accessToken');
                const wsUrl = getWebSocketUrl();

                console.log('[STOMP] Connecting to:', wsUrl);
                console.log('[STOMP] UserId:', userId);

                // SockJS 클라이언트 생성
                const socket = new SockJS(wsUrl);

                // STOMP 클라이언트 생성
                this.client = new Client({
                    webSocketFactory: () => socket,
                    connectHeaders: accessToken
                        ? {
                              Authorization: `Bearer ${accessToken}`,
                          }
                        : {},
                    debug: (str) => {
                        // STOMP 내부 디버그 로그는 출력하지 않음 (재연결 메시지 등)
                        // 필요한 경우에만 주석 해제
                        // if (__DEV__) {
                        //     console.log('[STOMP]', str);
                        // }
                    },
                    reconnectDelay: 5000,
                    heartbeatIncoming: 4000,
                    heartbeatOutgoing: 4000,
                    onConnect: () => {
                        console.log('[STOMP] Connected');
                        this.isConnecting = false;
                        // 메시지 구독 설정
                        this.subscribeToMessages();
                        resolve();
                    },
                    onStompError: (frame) => {
                        console.error('[STOMP] Error:', frame);
                        this.isConnecting = false;
                        reject(new Error(frame.body || 'STOMP error'));
                    },
                    onDisconnect: () => {
                        console.log('[STOMP] Disconnected');
                        this.isConnecting = false;
                    },
                    onWebSocketError: (error) => {
                        console.error('[STOMP] WebSocket error:', error);
                        this.isConnecting = false;
                        reject(error);
                    },
                });

                this.client.activate();
            } catch (error) {
                console.error('[STOMP] Connection error:', error);
                this.isConnecting = false;
                reject(error);
            }
        });

        try {
            await this.connectPromise;
        } finally {
            this.connectPromise = null;
        }
    }

    // 메시지 구독 설정
    private subscribeToMessages(): void {
        if (!this.client?.active || !this.userId) return;

        // 백엔드에서 /user/queue/chat으로 메시지를 전송
        const subscription = this.client.subscribe(
            `/user/queue/chat`,
            async (message: IMessage) => {
                try {
                    const data = JSON.parse(message.body);
                    console.log('[STOMP] Message received:', data);

                    const chatMessage: Message = {
                        messageId: data.messageId,
                        roomId: data.roomId,
                        senderId: data.senderId,
                        senderName: data.senderName,
                        content: data.content,
                        timestamp: data.timestamp,
                        isMe: data.senderId === this.userId,
                    };

                    // 특정 채팅방의 메시지 핸들러 호출
                    const handlers = this.messageHandlers.get(chatMessage.roomId);
                    if (handlers) {
                        handlers.forEach((handler) => handler(chatMessage));
                    }

                    // 읽음/안읽음 상태 갱신
                    if (chatMessage.roomId === this.activeRoomId) {
                        await resetUnreadCount(chatMessage.roomId);
                        await setLastReadTimestamp(chatMessage.roomId, chatMessage.timestamp);
                    } else if (chatMessage.senderId !== this.userId) {
                        await incrementUnreadCount(chatMessage.roomId);
                    }

                    // 로컬 알림 표시 (내 메시지가 아니고, 활성 채팅방이 아닐 때)
                    // AppState 체크 제거: 백그라운드에서도 알림 표시
                    if (
                        !chatMessage.isMe &&
                        chatMessage.roomId !== this.activeRoomId
                    ) {
                        const notificationEnabled = await getNotificationSetting();
                        if (notificationEnabled) {
                            await showLocalNotification(
                                chatMessage.senderName || '알 수 없음',
                                chatMessage.content,
                                {
                                    roomId: chatMessage.roomId,
                                    senderId: chatMessage.senderId,
                                    messageId: chatMessage.messageId,
                                }
                            );
                        }
                    }

                    // 채팅방 목록 업데이트 핸들러 호출 (roomId 전달)
                    this.chatRoomUpdateHandlers.forEach((handler) => handler(chatMessage.roomId));
                } catch (error) {
                    console.error('[STOMP] Failed to parse message:', error);
                }
            },
            {
                // 구독 헤더 (필요한 경우)
            }
        );

        console.log('[STOMP] Subscribed to /user/queue/chat');

        // 상대방 입력 상태 구독
        const typingSubscription = this.client.subscribe(
            `/user/queue/chat-typing`,
            (message: IMessage) => {
                try {
                    const data = JSON.parse(message.body) as { roomId: number; typing: boolean };
                    const handlers = this.typingHandlers.get(data.roomId);
                    if (handlers) {
                        handlers.forEach((handler) => handler(data.typing));
                    }
                } catch (error) {
                    console.error('[STOMP] Failed to parse typing event:', error);
                }
            }
        );

        // 채팅방 이벤트 구독 (나가기 등)
        const roomEventSubscription = this.client.subscribe(
            `/user/queue/chat-room-event`,
            (message: IMessage) => {
                try {
                    const data = JSON.parse(message.body);
                    console.log('[STOMP] Room event received:', data);
                    
                    if (data.type === 'ROOM_LEFT' && data.roomId) {
                        const handlers = this.roomEventHandlers.get(data.roomId);
                        if (handlers) {
                            handlers.forEach((handler) => handler());
                        }
                    }
                } catch (error) {
                    console.error('[STOMP] Failed to parse room event:', error);
                }
            }
        );

        this.messageSubscriptions.set(-1, subscription);
        this.messageSubscriptions.set(-2, typingSubscription);
        this.messageSubscriptions.set(-3, roomEventSubscription);
    }

    // 메시지 전송
    sendMessage(chatRoomId: number, content: string): void {
        if (!this.client?.connected) {
            console.error('[STOMP] Client not connected');
            throw new Error('STOMP client not connected');
        }

        const message = {
            roomId: chatRoomId,
            content: content,
        };

        console.log('[STOMP] Sending message:', message);
        this.client.publish({
            destination: '/app/chat/message',
            body: JSON.stringify(message),
        });
    }

    // 상대방에게 입력 상태 전달
    sendTyping(chatRoomId: number, typing: boolean): void {
        if (!this.client?.connected) {
            console.error('[STOMP] Client not connected (typing)');
            return;
        }

        const payload = {
            roomId: chatRoomId,
            typing,
        };

        this.client.publish({
            destination: '/app/chat/typing',
            body: JSON.stringify(payload),
        });
    }

    // 특정 채팅방의 메시지 수신 핸들러 등록
    onMessage(chatRoomId: number, handler: (message: Message) => void): () => void {
        if (!this.messageHandlers.has(chatRoomId)) {
            this.messageHandlers.set(chatRoomId, new Set());
        }
        this.messageHandlers.get(chatRoomId)!.add(handler);

        // cleanup 함수 반환
        return () => {
            const handlers = this.messageHandlers.get(chatRoomId);
            if (handlers) {
                handlers.delete(handler);
                if (handlers.size === 0) {
                    this.messageHandlers.delete(chatRoomId);
                }
            }
        };
    }

    // 특정 채팅방의 입력 상태 핸들러 등록
    onTyping(chatRoomId: number, handler: (typing: boolean) => void): () => void {
        if (!this.typingHandlers.has(chatRoomId)) {
            this.typingHandlers.set(chatRoomId, new Set());
        }
        this.typingHandlers.get(chatRoomId)!.add(handler);

        return () => {
            const handlers = this.typingHandlers.get(chatRoomId);
            if (handlers) {
                handlers.delete(handler);
                if (handlers.size === 0) {
                    this.typingHandlers.delete(chatRoomId);
                }
            }
        };
    }

    // 채팅방 목록 업데이트 핸들러 등록
    onChatRoomUpdate(handler: (roomId?: number) => void): () => void {
        this.chatRoomUpdateHandlers.add(handler);
        return () => {
            this.chatRoomUpdateHandlers.delete(handler);
        };
    }

    // 채팅방 나가기 이벤트 핸들러 등록
    onRoomLeft(chatRoomId: number, handler: () => void): () => void {
        if (!this.roomEventHandlers.has(chatRoomId)) {
            this.roomEventHandlers.set(chatRoomId, new Set());
        }
        this.roomEventHandlers.get(chatRoomId)!.add(handler);

        return () => {
            const handlers = this.roomEventHandlers.get(chatRoomId);
            if (handlers) {
                handlers.delete(handler);
                if (handlers.size === 0) {
                    this.roomEventHandlers.delete(chatRoomId);
                }
            }
        };
    }

    // 특정 채팅방 구독 (STOMP에서는 필요 없지만 호환성을 위해 유지)
    joinChatRoom(chatRoomId: number): void {
        // STOMP에서는 특정 채팅방을 구독할 필요가 없음
        // 모든 메시지는 /user/queue/chat으로 오고, roomId로 필터링
        console.log('[STOMP] joinChatRoom called (no-op in STOMP):', chatRoomId);
    }

    // 특정 채팅방 구독 해제 (STOMP에서는 필요 없지만 호환성을 위해 유지)
    leaveChatRoom(chatRoomId: number): void {
        // STOMP에서는 특정 채팅방을 구독 해제할 필요가 없음
        console.log('[STOMP] leaveChatRoom called (no-op in STOMP):', chatRoomId);
    }

    // 연결 해제
    disconnect(): void {
        if (this.client) {
            console.log('[STOMP] Disconnecting');
            // 모든 구독 해제
            this.messageSubscriptions.forEach((subscription) => {
                subscription.unsubscribe();
            });
            this.messageSubscriptions.clear();

            this.client.deactivate();
            this.client = null;
            this.userId = null;
            this.isConnecting = false;
            this.connectPromise = null;
            this.messageHandlers.clear();
            this.typingHandlers.clear();
            this.chatRoomUpdateHandlers.clear();
            this.roomEventHandlers.clear();
        }
    }

    // 연결 상태 확인
    isConnected(): boolean {
        return this.client?.connected ?? false;
    }

    setActiveRoom(roomId: number | null): void {
        this.activeRoomId = roomId;
        if (roomId) {
            resetUnreadCount(roomId);
        }
    }
}

// 싱글톤 인스턴스
export const websocketManager = new WebSocketManager();
