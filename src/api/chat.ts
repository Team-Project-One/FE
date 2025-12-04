import { request } from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ChatRoom {
    roomId: number;
    otherUserId: number;
    otherUserName: string;
    otherUserProfileImage: string | null;
    otherUserGender?: string | null; // 성별 정보 (MALE, FEMALE 등)
    otherUserAge?: number | null; // 상대방 나이
    otherUserBirthDate?: string | null; // 상대방 생년월일
    lastMessage: string | null;
    lastMessageTimestamp: string | null;
    unreadCount?: number; // 백엔드에서 제공하지 않으면 클라이언트에서 계산
}

export interface Message {
    messageId: number;
    roomId: number;
    senderId: number;
    senderName: string;
    content: string;
    timestamp: string;
    isMe?: boolean; // 클라이언트에서 계산
}

export interface CreateChatRoomRequest {
    matchedUserId: number;
}

export interface SendMessageRequest {
    roomId: number;
    content: string;
}

// 채팅방 목록 조회
export const fetchChatRooms = async (userId: number): Promise<ChatRoom[]> => {
    const accessToken = await AsyncStorage.getItem('@auth/accessToken');
    const response = await request<any>('/api/chat/rooms', {
        headers: accessToken
            ? {
                  Authorization: `Bearer ${accessToken}`,
              }
            : undefined,
    });

    // snake_case를 camelCase로 변환
    if (Array.isArray(response)) {
        return response.map((room: any) => ({
            roomId: room.roomId ?? room.room_id,
            otherUserId: room.otherUserId ?? room.other_user_id,
            otherUserName: room.otherUserName ?? room.other_user_name,
            otherUserProfileImage: room.otherUserProfileImage ?? room.other_user_profile_image,
            otherUserGender: room.otherUserGender ?? room.other_user_gender ?? null,
            otherUserAge: room.otherUserAge ?? room.other_user_age ?? null,
            otherUserBirthDate: room.otherUserBirthDate ?? room.other_user_birth_date ?? null,
            lastMessage: room.lastMessage ?? room.last_message,
            lastMessageTimestamp: room.lastMessageTimestamp ?? room.last_message_timestamp,
            unreadCount:
                room.unreadCount ??
                room.unread_count ??
                room.unreadMessageCount ??
                room.unread_message_count ??
                0,
        }));
    }
    return [];
};

// 채팅방 생성 또는 조회
export const createOrGetChatRoom = async (userId: number, matchedUserId: number): Promise<ChatRoom> => {
    const accessToken = await AsyncStorage.getItem('@auth/accessToken');
    const response = await request<any>('/api/chat/room', {
        method: 'POST',
        headers: accessToken
            ? {
                  Authorization: `Bearer ${accessToken}`,
                  'Content-Type': 'application/json',
              }
            : {
                  'Content-Type': 'application/json',
              },
        body: JSON.stringify({
            matchedUserId: matchedUserId,
        }),
    });

    // snake_case를 camelCase로 변환
    return {
        roomId: response.roomId ?? response.room_id,
        otherUserId: response.otherUserId ?? response.other_user_id,
        otherUserName: response.otherUserName ?? response.other_user_name,
        otherUserProfileImage: response.otherUserProfileImage ?? response.other_user_profile_image,
        otherUserGender: response.otherUserGender ?? response.other_user_gender ?? null,
        otherUserAge: response.otherUserAge ?? response.other_user_age ?? null,
        otherUserBirthDate: response.otherUserBirthDate ?? response.other_user_birth_date ?? null,
        lastMessage: response.lastMessage ?? response.last_message,
        lastMessageTimestamp: response.lastMessageTimestamp ?? response.last_message_timestamp,
        unreadCount:
            response.unreadCount ??
            response.unread_count ??
            response.unreadMessageCount ??
            response.unread_message_count ??
            0,
    };
};

// 특정 채팅방의 메시지 조회
export const fetchMessages = async (roomId: number, userId: number): Promise<Message[]> => {
    const accessToken = await AsyncStorage.getItem('@auth/accessToken');
    const response = await request<any>(`/api/chat/room/${roomId}/messages`, {
        headers: accessToken
            ? {
                  Authorization: `Bearer ${accessToken}`,
              }
            : undefined,
    });

    // snake_case를 camelCase로 변환하고 isMe 플래그 추가
    if (Array.isArray(response)) {
        return response.map((msg: any) => ({
            messageId: msg.messageId ?? msg.message_id,
            roomId: msg.roomId ?? msg.room_id,
            senderId: msg.senderId ?? msg.sender_id,
            senderName: msg.senderName ?? msg.sender_name,
            content: msg.content,
            timestamp: msg.timestamp,
            isMe: (msg.senderId ?? msg.sender_id) === userId,
        }));
    }
    return [];
};

// 채팅방 나가기
export const leaveChatRoom = async (roomId: number): Promise<void> => {
    const accessToken = await AsyncStorage.getItem('@auth/accessToken');
    await request<void>(`/api/chat/room/${roomId}`, {
        method: 'DELETE',
        headers: accessToken
            ? {
                  Authorization: `Bearer ${accessToken}`,
              }
            : undefined,
    });
};
