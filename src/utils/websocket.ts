import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { API_BASE_URL } from '../api/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message } from '../api/chat';

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
    private messageSubscriptions: Map<number, StompSubscription> = new Map();
    private messageHandlers: Map<number, Set<(message: Message) => void>> = new Map();
    private chatRoomUpdateHandlers: Set<() => void> = new Set();

    // WebSocket 연결
    async connect(userId: number): Promise<void> {
        if (this.client?.active || this.isConnecting) {
            console.log('[STOMP] Already connected or connecting');
            return;
        }

        this.userId = userId;
        this.isConnecting = true;

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
                    if (__DEV__) {
                        console.log('[STOMP]', str);
                    }
                },
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
                onConnect: () => {
                    console.log('[STOMP] Connected');
                    this.isConnecting = false;
                    // 메시지 구독 설정
                    this.subscribeToMessages();
                },
                onStompError: (frame) => {
                    console.error('[STOMP] Error:', frame);
                    this.isConnecting = false;
                },
                onDisconnect: () => {
                    console.log('[STOMP] Disconnected');
                    this.isConnecting = false;
                },
                onWebSocketError: (error) => {
                    console.error('[STOMP] WebSocket error:', error);
                    this.isConnecting = false;
                },
            });

            this.client.activate();
        } catch (error) {
            console.error('[STOMP] Connection error:', error);
            this.isConnecting = false;
            throw error;
        }
    }

    // 메시지 구독 설정
    private subscribeToMessages(): void {
        if (!this.client?.active || !this.userId) return;

        // 백엔드에서 /user/queue/chat으로 메시지를 전송
        const subscription = this.client.subscribe(
            `/user/queue/chat`,
            (message: IMessage) => {
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

                    // 채팅방 목록 업데이트 핸들러 호출
                    this.chatRoomUpdateHandlers.forEach((handler) => handler());
                } catch (error) {
                    console.error('[STOMP] Failed to parse message:', error);
                }
            },
            {
                // 구독 헤더 (필요한 경우)
            }
        );

        console.log('[STOMP] Subscribed to /user/queue/chat');
    }

    // 메시지 전송
    sendMessage(chatRoomId: number, content: string): void {
        if (!this.client?.active) {
            console.error('[STOMP] Client not connected');
            return;
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

    // 채팅방 목록 업데이트 핸들러 등록
    onChatRoomUpdate(handler: () => void): () => void {
        this.chatRoomUpdateHandlers.add(handler);
        return () => {
            this.chatRoomUpdateHandlers.delete(handler);
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
            this.messageHandlers.clear();
            this.chatRoomUpdateHandlers.clear();
        }
    }

    // 연결 상태 확인
    isConnected(): boolean {
        return this.client?.active ?? false;
    }
}

// 싱글톤 인스턴스
export const websocketManager = new WebSocketManager();
