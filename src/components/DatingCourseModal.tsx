import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import SendIcon from '../../assets/send.svg';
import { sendConversationTopicsMessage, fetchDatingCourses } from '../api/ai';

interface Message {
    id: string;
    text: string;
    isAI: boolean;
    timestamp: string;
}

interface Props {
    visible: boolean;
    otherUserName?: string;
    myUserId?: number | null;
    matchedUserId?: number | null;
    onClose: () => void;
}

const DatingCourseModal: React.FC<Props> = ({ visible, otherUserName = '상대방', myUserId, matchedUserId, onClose }) => {
    const insets = useSafeAreaInsets();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isSending, setIsSending] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

    const fallbackCourses = [
        '근처 카페에서 가볍게 커피 마시면서 대화 나누기',
        '한강이나 공원에서 산책하면서 야경 즐기기',
        '맛집 탐방하면서 서로 좋아하는 음식 공유하기',
        '전시회나 미술관 방문 후 카페에서 감상 나누기',
        '보드게임 카페에서 게임하면서 자연스럽게 친해지기',
    ];

    const buildInitialMessageText = (courseLines: string[]) => {
        return `두 분의 프로필과 성향을 바탕으로 추천하는 데이트 코스예요.\n${courseLines.join(
            '\n'
        )}\n마음에 드는 코스가 있다면 그 코스를 바탕으로 대화를 이어가 보세요 😊`;
    };

    useEffect(() => {
        if (!visible || messages.length > 0) return;

        const loadInitialCourses = async () => {
            try {
                if (myUserId != null && matchedUserId != null) {
                    const coursesFromApi = await fetchDatingCourses(myUserId, matchedUserId);

                    if (coursesFromApi && coursesFromApi.length > 0) {
                        const lines = coursesFromApi.map((c) => `• ${c}`);
                        const initialMessage: Message = {
                            id: '1',
                            text: buildInitialMessageText(lines),
                            isAI: true,
                            timestamp: formatTime(new Date()),
                        };
                        setMessages([initialMessage]);
                        return;
                    }
                }

                const fallbackLines = fallbackCourses.map((c) => `• ${c}`);
                const initialMessage: Message = {
                    id: '1',
                    text: buildInitialMessageText(fallbackLines),
                    isAI: true,
                    timestamp: formatTime(new Date()),
                };
                setMessages([initialMessage]);
            } catch (e) {
                console.error('[DatingCourseModal] Failed to fetch dating courses:', e);
                const fallbackLines = fallbackCourses.map((c) => `• ${c}`);
                const initialMessage: Message = {
                    id: '1',
                    text: buildInitialMessageText(fallbackLines),
                    isAI: true,
                    timestamp: formatTime(new Date()),
                };
                setMessages([initialMessage]);
            }
        };

        loadInitialCourses();
    }, [visible, myUserId, matchedUserId]);

    const formatTime = (date: Date) => {
        // 디바이스 로컬 시간 기준 (채팅방과 동일한 방식)
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const period = hours >= 12 ? '오후' : '오전';
        const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
        // 채팅방과 동일하게, 시(hour)는 한 자리일 때 앞에 0을 붙이지 않는다 (예: 8:05)
        return `${period} ${displayHours}:${minutes.toString().padStart(2, '0')}`;
    };

    const handleSendMessage = async () => {
        if (!message.trim() || isSending) return;

        const userMessageText = message.trim();
        const userMessage: Message = {
            id: Date.now().toString(),
            text: userMessageText,
            isAI: false,
            timestamp: formatTime(new Date()),
        };

        setMessages((prev) => [...prev, userMessage]);
        setMessage('');
        setIsSending(true);

        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);

        try {
            const aiResponseText = await sendConversationTopicsMessage(
                userMessageText,
                otherUserName,
                myUserId ?? undefined,
                matchedUserId ?? undefined
            );

            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: aiResponseText,
                isAI: true,
                timestamp: formatTime(new Date()),
            };

            setMessages((prev) => [...prev, aiResponse]);
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
        } catch (error) {
            console.error('[DatingCourseModal] Failed to get AI response:', error);

            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: '죄송합니다. 응답을 받는 중 오류가 발생했습니다. 다시 시도해주세요.',
                isAI: true,
                timestamp: formatTime(new Date()),
            };

            setMessages((prev) => [...prev, errorMessage]);
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -70}
            >
                <View style={styles.overlay}>
                    <View style={styles.modalContainer}>
                        {/* 헤더 */}
                        <View style={styles.header}>
                            <View style={styles.aiInfo}>
                                <View style={styles.aiIcon}>
                                    <Text style={styles.aiIconText}>🤖</Text>
                                </View>
                                <View style={styles.aiNameContainer}>
                                    <Text style={styles.aiName}>데이트 코스 추천 AI</Text>
                                    <Text style={styles.onlineStatus}>온라인</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        {/* 메시지 리스트 */}
                        <ScrollView
                            ref={scrollViewRef}
                            style={styles.messagesContainer}
                            contentContainerStyle={styles.messagesContent}
                            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                        >
                            {messages.map((msg) =>
                                msg.isAI ? (
                                    <View key={msg.id} style={styles.theirMessageContainer}>
                                        <View style={styles.theirMessageBubble}>
                                            <Text style={styles.theirMessageText}>{msg.text}</Text>
                                        </View>
                                        <Text style={styles.theirMessageTime}>{msg.timestamp}</Text>
                                    </View>
                                ) : (
                                    <View key={msg.id} style={styles.myMessageContainer}>
                                        <LinearGradient
                                            colors={['#EC4899', '#F43F5E']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={styles.myMessageBubble}
                                        >
                                            <Text style={styles.myMessageText}>{msg.text}</Text>
                                        </LinearGradient>
                                        <Text style={styles.myMessageTime}>{msg.timestamp}</Text>
                                    </View>
                                )
                            )}
                        </ScrollView>

                        {/* 입력창 */}
                        <View style={[styles.messageInputContainer, { paddingBottom: insets.bottom + 24 }]}>
                            <TextInput
                                style={[
                                    styles.messageInput,
                                    {
                                        backgroundColor: '#FFFFFF',
                                        borderColor: '#D1D5DC',
                                        color: '#000000',
                                    },
                                ]}
                                value={message}
                                onChangeText={setMessage}
                                placeholder="메시지를 입력하세요"
                                placeholderTextColor="#0A0A0A80"
                                multiline={false}
                                maxLength={200}
                                onSubmitEditing={handleSendMessage}
                                returnKeyType="send"
                                blurOnSubmit={false}
                            />
                            <TouchableOpacity
                                onPress={handleSendMessage}
                                style={styles.sendButton}
                                disabled={!message.trim() || isSending}
                            >
                                <LinearGradient colors={['#F43F5E', '#EC4899']} style={styles.sendButtonGradient}>
                                    <SendIcon width={20} height={20} />
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalContainer: {
        width: '100%',
        maxWidth: 400,
        height: '80%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 18,
        borderBottomWidth: 1.35,
        borderBottomColor: '#0000001A',
        backgroundColor: '#FFFFFF',
    },
    aiInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    aiIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FCE7F3',
        justifyContent: 'center',
        alignItems: 'center',
    },
    aiIconText: {
        fontSize: 18,
    },
    aiNameContainer: {
        justifyContent: 'center',
    },
    aiName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    onlineStatus: {
        marginTop: 2,
        fontSize: 13,
        color: '#10B981',
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 18,
        color: '#6B7280',
    },
    messagesContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    messagesContent: {
        paddingBottom: 16,
    },
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
        backgroundColor: '#FFFFFF',
        borderColor: '#0000001A',
    },
    theirMessageText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#1E2939',
    },
    theirMessageTime: {
        marginTop: 4,
        fontSize: 12,
        color: '#6B7280',
    },
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
    myMessageText: {
        color: '#FFFFFF',
        fontSize: 16,
        lineHeight: 24,
    },
    myMessageTime: {
        marginTop: 4,
        fontSize: 12,
        color: '#6B7280',
    },
    messageInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 24,
        paddingTop: 12,
        borderTopWidth: 1.35,
        borderTopColor: '#0000001A',
        backgroundColor: '#FFFFFF',
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
        backgroundColor: '#FFFFFF',
        borderColor: '#D1D5DC',
        color: '#000000',
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
});

export default DatingCourseModal;


