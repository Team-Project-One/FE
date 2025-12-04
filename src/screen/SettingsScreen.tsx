import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import BackIcon from '../../assets/back.svg';
import ToggleOff from '../assets/toggle.svg';
import ToggleOn from '../assets/toggle-active.svg';
import RightArrow from '../assets/rightArrow.svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SettingsScreenProps } from '../types';
import { useTheme } from '../theme/ThemeContext';
import { getNotificationSetting, setNotificationSetting } from '../utils/notifications';
import { deleteUser } from '../api/mypage';
import ConfirmModal from '../components/ConfirmModal';
import { websocketManager } from '../utils/websocket';

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onNavigate }) => {
    const insets = useSafeAreaInsets();
    const [pushNotifications, setPushNotifications] = useState(true);
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
    const [showDeleteErrorModal, setShowDeleteErrorModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // 알림 설정 불러오기
    useEffect(() => {
        const loadNotificationSetting = async () => {
            const enabled = await getNotificationSetting();
            setPushNotifications(enabled);
        };
        loadNotificationSetting();
    }, []);

    // 알림 설정 토글
    const handleToggleNotifications = async () => {
        const newValue = !pushNotifications;
        setPushNotifications(newValue);
        await setNotificationSetting(newValue);
    };

    // 계정 탈퇴 처리
    const handleDeleteAccount = async () => {
        try {
            setIsDeleting(true);
            const userIdStr = await AsyncStorage.getItem('@auth/userId');
            if (!userIdStr) {
                throw new Error('사용자 ID를 찾을 수 없습니다.');
            }
            const userId = Number(userIdStr);
            
            await deleteUser(userId);
            
            // WebSocket 연결 해제
            websocketManager.disconnect();
            
            // 로컬 스토리지 정리
            await AsyncStorage.multiRemove([
                '@auth/accessToken',
                '@auth/refreshToken',
                '@auth/userId',
            ]);
            
            setShowDeleteConfirmModal(false);
            setShowDeleteSuccessModal(true);
        } catch (error) {
            console.error('[SettingsScreen] Failed to delete account:', error);
            setShowDeleteConfirmModal(false);
            setShowDeleteErrorModal(true);
        } finally {
            setIsDeleting(false);
        }
    };

    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]}>
            <StatusBar style={isDark ? 'light' : 'dark'} />

            <View
                style={[
                    styles.header,
                    {
                        marginTop: insets.top,
                        borderBottomColor: isDark ? '#FFFFFF33' : '#0000001A',
                    },
                ]}
            >
                <TouchableOpacity onPress={() => onNavigate('mypage')} style={styles.backButton}>
                    <BackIcon width={24} height={24} color={isDark ? '#FFFFFF' : '#000000'} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#1E2939' }]}>설정</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView contentContainerStyle={[styles.settingsContainer, { paddingBottom: insets.bottom + 24 }]}>
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1E2939' }]}>알림</Text>

                    <View style={[styles.settingItem, { borderBottomColor: isDark ? '#FFFFFF33' : '#0000001A' }]}>
                        <View style={styles.settingInfo}>
                            <Text style={[styles.settingLabel, { color: isDark ? '#FFFFFF' : '#364153' }]}>
                                푸시 알림
                            </Text>
                            <Text style={[styles.settingDescription, { color: isDark ? '#CCCCCC' : '#6A7282' }]}>
                                새로운 메시지 및 매칭 알림
                            </Text>
                        </View>

                        <TouchableOpacity onPress={handleToggleNotifications}>
                            {pushNotifications ? (
                                <ToggleOn width={50} height={30} />
                            ) : (
                                <ToggleOff width={50} height={30} />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1E2939' }]}>표시</Text>

                    <View style={[styles.settingItem, { borderBottomColor: isDark ? '#FFFFFF33' : '#0000001A' }]}>
                        <View style={styles.settingInfo}>
                            <Text style={[styles.settingLabel, { color: isDark ? '#FFFFFF' : '#364153' }]}>
                                다크 모드
                            </Text>
                            <Text style={[styles.settingDescription, { color: isDark ? '#CCCCCC' : '#6A7282' }]}>
                                어두운 테마 사용
                            </Text>
                        </View>

                        <TouchableOpacity onPress={toggleTheme}>
                            {isDark ? <ToggleOn width={50} height={30} /> : <ToggleOff width={50} height={30} />}
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1E2939' }]}>계정</Text>

                    <TouchableOpacity
                        style={[styles.settingItem, { borderBottomColor: isDark ? '#FFFFFF33' : '#0000001A' }]}
                        onPress={() => onNavigate('terms')}
                    >
                        <Text style={[styles.settingLabel, { color: isDark ? '#FFFFFF' : '#364153' }]}>이용 약관</Text>
                        <RightArrow width={20} height={20} color={isDark ? '#FFFFFF' : '#000000'} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.settingItem, { borderBottomColor: isDark ? '#FFFFFF33' : '#0000001A' }]}
                        onPress={() => onNavigate('privacy')}
                    >
                        <Text style={[styles.settingLabel, { color: isDark ? '#FFFFFF' : '#364153' }]}>
                            개인정보 처리방침
                        </Text>
                        <RightArrow width={20} height={20} color={isDark ? '#FFFFFF' : '#000000'} />
                    </TouchableOpacity>

                    <View style={[styles.settingItem, { borderBottomColor: isDark ? '#FFFFFF33' : '#0000001A' }]}>
                        <Text style={[styles.settingLabel, { color: isDark ? '#FFFFFF' : '#364153' }]}>버전 정보</Text>
                        <Text style={[styles.versionText, { color: isDark ? '#CCCCCC' : '#6A7282' }]}>v1.0.0</Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.settingItem, { borderBottomColor: isDark ? '#FFFFFF33' : '#0000001A' }]}
                        onPress={() => setShowDeleteConfirmModal(true)}
                        disabled={isDeleting}
                    >
                        <Text style={[styles.settingLabel, styles.dangerText]}>계정 탈퇴</Text>
                        <RightArrow width={20} height={20} color={isDark ? '#FFFFFF' : '#000000'} />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <ConfirmModal
                visible={showDeleteConfirmModal}
                title="계정 탈퇴"
                message="정말 계정을 탈퇴하시겠어요? 탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다."
                confirmText="탈퇴하기"
                cancelText="취소"
                onConfirm={handleDeleteAccount}
                onCancel={() => setShowDeleteConfirmModal(false)}
                confirmButtonColor="#E7000B"
            />
            <ConfirmModal
                visible={showDeleteSuccessModal}
                title="계정 탈퇴 완료"
                message="계정이 성공적으로 탈퇴되었습니다."
                confirmText="확인"
                cancelText=""
                onConfirm={() => {
                    setShowDeleteSuccessModal(false);
                    onNavigate('login');
                }}
                onCancel={() => {
                    setShowDeleteSuccessModal(false);
                    onNavigate('login');
                }}
            />
            <ConfirmModal
                visible={showDeleteErrorModal}
                title="오류"
                message="계정 탈퇴 중 문제가 발생했습니다."
                confirmText="확인"
                cancelText=""
                onConfirm={() => setShowDeleteErrorModal(false)}
                onCancel={() => setShowDeleteErrorModal(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 35,
        height: 96,
        borderBottomWidth: 1.35,
    },
    backButton: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '400',
        lineHeight: 28,
    },
    placeholder: { width: 32 },
    settingsContainer: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 38,
    },
    section: { marginBottom: 30 },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
        marginBottom: 14,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        borderBottomWidth: 1.35,
    },
    settingInfo: { flex: 1 },
    settingLabel: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '400',
        marginBottom: 2,
    },
    settingDescription: {
        fontSize: 14,
        lineHeight: 20,
    },
    versionText: {
        fontSize: 14,
    },
    dangerText: {
        color: '#E7000B',
    },
});

export default SettingsScreen;
