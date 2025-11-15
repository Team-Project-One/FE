import React, { useMemo } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomNavigationProps, Screen } from '../types';
import ChatIcon from '../../assets/bottomChat.svg';
import HomeIcon from '../../assets/bottomHome.svg';
import MyIcon from '../../assets/bottomMy.svg';
import { useTheme } from '../theme/ThemeContext';

const BottomNavigation: React.FC<BottomNavigationProps> = ({ onNavigate, currentScreen }) => {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const activeTab = useMemo(() => {
        if (currentScreen === 'chat') return 'chat';
        if (currentScreen === 'mypage') return 'mypage';
        return 'main';
    }, [currentScreen]);

    const handleNavigation = (screen: Screen) => {
        onNavigate(screen);
    };

    return (
        <View
            style={[
                styles.bottomNav,
                {
                    paddingBottom: 16 + insets.bottom,
                    backgroundColor: isDark ? '#0D0D0D' : '#FFFFFF',
                    borderTopColor: isDark ? '#333333' : 'rgba(0,0,0,0.1)',
                },
            ]}
        >
            <View style={styles.buttonWrapper}>
                <TouchableOpacity style={styles.navButton} onPress={() => handleNavigation('chat')}>
                    <ChatIcon
                        width={24}
                        height={24}
                        color={activeTab === 'chat' ? '#EC4899' : isDark ? '#6B7280' : '#9CA3AF'}
                    />
                    <Text
                        style={[
                            styles.navButtonText,
                            { color: isDark ? '#6B7280' : '#9CA3AF' },
                            activeTab === 'chat' && styles.navButtonTextActive,
                        ]}
                    >
                        채팅
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navButton} onPress={() => handleNavigation('main')}>
                    <HomeIcon
                        width={24}
                        height={24}
                        color={activeTab === 'main' ? '#EC4899' : isDark ? '#6B7280' : '#9CA3AF'}
                    />
                    <Text
                        style={[
                            styles.navButtonText,
                            { color: isDark ? '#6B7280' : '#9CA3AF' },
                            activeTab === 'main' && styles.navButtonTextActive,
                        ]}
                    >
                        홈
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navButton} onPress={() => handleNavigation('mypage')}>
                    <MyIcon
                        width={24}
                        height={24}
                        color={activeTab === 'mypage' ? '#EC4899' : isDark ? '#6B7280' : '#9CA3AF'}
                    />
                    <Text
                        style={[
                            styles.navButtonText,
                            { color: isDark ? '#6B7280' : '#9CA3AF' },
                            activeTab === 'mypage' && styles.navButtonTextActive,
                        ]}
                    >
                        마이페이지
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    bottomNav: {
        borderTopWidth: 1.35,
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
        fontWeight: '400',
    },
    navButtonTextActive: {
        color: '#EC4899',
    },
});

export default BottomNavigation;
