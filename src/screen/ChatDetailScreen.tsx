import React, { useState, useEffect } from 'react';
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

interface ChatDetailScreenProps extends BaseScreenProps {
    chatName?: string;
    chatAge?: number;
}

const mockMessages = [
    { id: '1', text: '안녕하세요!', time: '오후 3:15', isMe: false },
    { id: '2', text: '반가워요😊', time: '오후 3:20', isMe: true },
];

const ChatDetailScreen: React.FC<ChatDetailScreenProps> = ({ onNavigate, chatName = '지은', chatAge = 26 }) => {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [message, setMessage] = useState('');
    const [showMenu, setShowMenu] = useState(false);
    const [tipVisible, setTipVisible] = useState(true);
    const tipType = 'ice';

    useEffect(() => {
        const checkTip = async () => {
            const viewed = await AsyncStorage.getItem('chat_tip_viewed');
            if (viewed === 'true') setTipVisible(false);
        };
        checkTip();
    }, []);

    const closeTip = async () => {
        setTipVisible(false);
        await AsyncStorage.setItem('chat_tip_viewed', 'true');
    };

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
                    <View style={[styles.profileImageSmall, { backgroundColor: '#FEE2E2' }]}>
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

            <ScrollView style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}>
                {mockMessages.map((msg) =>
                    msg.isMe ? (
                        <View key={msg.id} style={styles.myMessageContainer}>
                            <LinearGradient
                                colors={['#EC4899', '#F43F5E']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.myMessageBubble}
                            >
                                <Text style={styles.myMessageText}>{msg.text}</Text>
                            </LinearGradient>

                            <Text style={[styles.myMessageTime, { color: isDark ? '#A0A0A0' : '#6A7282' }]}>
                                {msg.time}
                            </Text>
                        </View>
                    ) : (
                        <View key={msg.id} style={styles.theirMessageContainer}>
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
                                    {msg.text}
                                </Text>
                            </View>
                            <Text style={[styles.theirMessageTime, { color: isDark ? '#888' : '#6A7282' }]}>
                                {msg.time}
                            </Text>
                        </View>
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
                    />

                    <TouchableOpacity style={styles.sendButton}>
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
});

export default ChatDetailScreen;
