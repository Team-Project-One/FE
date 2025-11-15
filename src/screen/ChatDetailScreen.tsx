import React, { useState } from 'react';
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
import BackIcon from '../../assets/back.svg';
import FemaleIcon from '../../assets/female.svg';
import LightIcon from '../../assets/light.svg';
import LocationIcon from '../../assets/location.svg';
import SendIcon from '../../assets/send.svg';
import FixIcon from '../../assets/fix.svg';
import ExitIcon from '../../assets/exit.svg';
import MenuIcon from '../assets/menuIcon.svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { BaseScreenProps } from '../types';
import { LinearGradient } from 'expo-linear-gradient';

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
    const [message, setMessage] = useState('');
    const [showMenu, setShowMenu] = useState(false);

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <StatusBar style="dark" />

            <View style={[styles.header, { marginTop: insets.top }]}>
                <TouchableOpacity onPress={() => onNavigate('chat')} style={styles.backButton}>
                    <BackIcon width={24} height={24} />
                </TouchableOpacity>

                <View style={styles.profileInfoHeader}>
                    <View style={styles.profileImageSmall}>
                        <FemaleIcon width={24} height={24} />
                    </View>

                    <Text style={styles.headerName}>
                        {chatName}({chatAge})
                    </Text>
                </View>

                <TouchableOpacity style={styles.menuButton} onPress={() => setShowMenu(!showMenu)}>
                    <MenuIcon width={24} height={24} />
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
                            <Text style={styles.myMessageTime}>{msg.time}</Text>
                        </View>
                    ) : (
                        <View key={msg.id} style={styles.theirMessageContainer}>
                            <View style={styles.theirMessageBubble}>
                                <Text style={styles.theirMessageText}>{msg.text}</Text>
                            </View>
                            <Text style={styles.theirMessageTime}>{msg.time}</Text>
                        </View>
                    )
                )}
            </ScrollView>

            <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 8 }]}>
                <View style={styles.suggestionButtons}>
                    <TouchableOpacity style={styles.suggestionButton}>
                        <LinearGradient
                            colors={['#FCE7F3', '#FFE4E6']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.suggestionGradient}
                        >
                            <LightIcon width={16} height={16} />
                            <Text style={styles.suggestionText}>아이스브레이킹 주제</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.suggestionButton}>
                        <LinearGradient
                            colors={['#FCE7F3', '#FFE4E6']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.suggestionGradient}
                        >
                            <LocationIcon width={16} height={16} />
                            <Text style={styles.suggestionText}>데이트 코스 추천</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <View style={styles.messageInputContainer}>
                    <TextInput
                        style={styles.messageInput}
                        value={message}
                        onChangeText={setMessage}
                        placeholder="메시지를 입력하세요"
                        placeholderTextColor="#0A0A0A80"
                    />
                    <TouchableOpacity style={styles.sendButton}>
                        <LinearGradient colors={['#F43F5E', '#EC4899']} style={styles.sendButtonGradient}>
                            <SendIcon width={20} height={20} />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>

            {showMenu && (
                <View style={styles.dropdownMenu}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => setShowMenu(false)}>
                        <FixIcon width={16} height={16} />
                        <Text style={styles.menuItemText}>채팅창 상단 고정</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={() => setShowMenu(false)}>
                        <ExitIcon width={16} height={16} />
                        <Text style={[styles.menuItemText, styles.exitText]}>채팅방 나가기</Text>
                    </TouchableOpacity>
                </View>
            )}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 28,
        height: 96,
        borderBottomWidth: 1.35,
        borderBottomColor: '#0000001A',
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
        backgroundColor: '#FEE2E2',
        justifyContent: 'center',
        alignItems: 'center',
    },

    headerName: { fontSize: 16, fontWeight: '400', lineHeight: 24, color: '#1E2939' },

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
        maxWidth: '100%',
    },

    myMessageText: { color: '#FFFFFF', fontSize: 16, lineHeight: 24 },
    myMessageTime: { marginTop: 4, fontSize: 12, color: '#6A7282', textAlign: 'right' },

    theirMessageContainer: {
        alignSelf: 'flex-start',
        marginBottom: 12,
        maxWidth: '75%',
    },

    theirMessageBubble: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1.35,
        borderColor: '#0000001A',
        paddingVertical: 10,
        paddingHorizontal: 17,
        borderRadius: 10,
    },

    theirMessageText: { fontSize: 16, lineHeight: 24, color: '#1E2939' },
    theirMessageTime: { marginTop: 4, fontSize: 12, color: '#6A7282', textAlign: 'left' },

    inputContainer: {
        paddingHorizontal: 16,
        paddingTop: 21,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1.35,
        borderTopColor: '#0000001A',
    },

    suggestionButtons: { flexDirection: 'row', gap: 8, marginBottom: 21 },

    suggestionButton: { flex: 1, borderRadius: 10, overflow: 'hidden' },

    suggestionGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 10,
        gap: 2,
    },

    suggestionText: { fontSize: 14, fontWeight: '400', lineHeight: 20, color: '#C6005C' },

    messageInputContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingBottom: 24 },

    messageInput: {
        flex: 1,
        minHeight: 50,
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
        borderWidth: 1.35,
        borderColor: '#D1D5DC',
        borderRadius: 10,
        fontSize: 16,
    },

    sendButton: { width: 50, height: 50, borderRadius: 10, overflow: 'hidden', backgroundColor: '#FFFFFF' },

    sendButtonGradient: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },

    dropdownMenu: {
        position: 'absolute',
        top: 80,
        right: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        borderWidth: 1.35,
        borderColor: 'rgba(0,0,0,0.1)',
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

    menuItemText: { fontSize: 16, color: '#0A0A0A', fontWeight: '400' },
    exitText: { color: '#E7000B' },
});

export default ChatDetailScreen;
