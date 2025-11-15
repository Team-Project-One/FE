import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import FemaleIcon from '../../assets/female.svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { BaseScreenProps } from '../types';
import BackIcon from '../assets/back.svg';
import BottomNavigation from '../components/BottomNavigation';
import { useTheme } from '../theme/ThemeContext';

interface ChatScreenProps extends BaseScreenProps {}

interface ChatData {
    id: string;
    name: string;
    age: number;
    lastMessage: string;
    time: string;
    unreadCount: number;
}

const mockChats: ChatData[] = [
    {
        id: '1',
        name: '지은',
        age: 26,
        lastMessage: '안녕하세요! 반가워요😊',
        time: '오후 3:20',
        unreadCount: 2,
    },
    {
        id: '2',
        name: '민준',
        age: 28,
        lastMessage: '오늘 저녁 어때요?',
        time: '오후 2:15',
        unreadCount: 0,
    },
    {
        id: '3',
        name: '서연',
        age: 25,
        lastMessage: '네 좋아요!',
        time: '오전 11:30',
        unreadCount: 1,
    },
];

const ChatScreen: React.FC<ChatScreenProps> = ({ onNavigate }) => {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

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

            <ScrollView contentContainerStyle={styles.chatList} showsVerticalScrollIndicator={true}>
                {mockChats.map((chat) => (
                    <TouchableOpacity
                        key={chat.id}
                        style={[
                            styles.chatItem,
                            {
                                borderBottomColor: isDark ? '#333333' : '#0000001A',
                            },
                        ]}
                        onPress={() =>
                            onNavigate('chatDetail', {
                                chatName: chat.name,
                                chatAge: chat.age,
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
                                    {chat.name}({chat.age})
                                </Text>
                            </View>
                            <Text style={[styles.lastMessage, { color: isDark ? '#D1D5DC' : '#4A5565' }]}>
                                {chat.lastMessage}
                            </Text>
                        </View>

                        <View style={styles.rightSection}>
                            <Text style={[styles.chatTime, { color: isDark ? '#9CA3AF' : '#6A7282' }]}>
                                {chat.time}
                            </Text>
                            {chat.unreadCount > 0 && (
                                <View style={styles.unreadBadge}>
                                    <Text style={styles.unreadBadgeText}>{chat.unreadCount}</Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={{ paddingBottom: insets.bottom }}>
                <BottomNavigation onNavigate={onNavigate} currentScreen={'chat'} />
            </View>
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
});

export default ChatScreen;
