import React, { useMemo } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomNavigationProps, Screen } from '../types';
import ChatIcon from '../../assets/bottomChat.svg';
import HomeIcon from '../../assets/bottomHome.svg';
import MyIcon from '../../assets/bottomMy.svg';

const BottomNavigation: React.FC<BottomNavigationProps> = ({ onNavigate, currentScreen }) => {
    const insets = useSafeAreaInsets();

    const activeTab = useMemo(() => {
        if (currentScreen === 'chat') return 'chat';
        if (currentScreen === 'mypage') return 'mypage';
        return 'main';
    }, [currentScreen]);

    const handleNavigation = (screen: Screen) => {
        onNavigate(screen);
    };

    return (
        <View style={[styles.bottomNav, { paddingBottom: 16 + insets.bottom }]}>
            <View style={styles.buttonWrapper}>
                <TouchableOpacity style={styles.navButton} onPress={() => handleNavigation('chat')}>
                    <ChatIcon width={24} height={24} color={activeTab === 'chat' ? '#EC4899' : '#9CA3AF'} />
                    <Text style={[styles.navButtonText, activeTab === 'chat' && styles.navButtonTextActive]}>채팅</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navButton} onPress={() => handleNavigation('main')}>
                    <HomeIcon width={24} height={24} color={activeTab === 'main' ? '#EC4899' : '#9CA3AF'} />
                    <Text style={[styles.navButtonText, activeTab === 'main' && styles.navButtonTextActive]}>홈</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navButton} onPress={() => handleNavigation('mypage')}>
                    <MyIcon width={24} height={24} color={activeTab === 'mypage' ? '#EC4899' : '#9CA3AF'} />
                    <Text style={[styles.navButtonText, activeTab === 'mypage' && styles.navButtonTextActive]}>
                        마이페이지
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    bottomNav: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1.35,
        borderTopColor: 'rgba(0,0,0,0.1)',
        paddingHorizontal: 48,
        paddingTop: 16,
    },

    buttonWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 63,
    },

    navButton: {
        paddingVertical: 8,
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
    },

    navButtonText: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '400',
    },
    navButtonTextActive: {
        color: '#EC4899',
    },
});

export default BottomNavigation;
