import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface ConfirmModalProps {
    visible: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmButtonColor?: string; // 확인 버튼 색상 (기본값: 빨간색 계열)
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    visible,
    title,
    message,
    confirmText = '확인',
    cancelText,
    onConfirm,
    onCancel,
    confirmButtonColor,
}) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
            <View style={styles.overlay}>
                <View
                    style={[
                        styles.modalContainer,
                        {
                            backgroundColor: isDark ? '#1F1F1F' : '#FFFFFF',
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.title,
                            {
                                color: isDark ? '#FFFFFF' : '#1E2939',
                            },
                        ]}
                    >
                        {title}
                    </Text>
                    <Text
                        style={[
                            styles.message,
                            {
                                color: isDark ? '#D1D5DC' : '#4A5565',
                            },
                        ]}
                    >
                        {message}
                    </Text>
                    <View style={styles.buttonContainer}>
                        {cancelText && (
                            <TouchableOpacity
                                style={[
                                    styles.cancelButton,
                                    {
                                        backgroundColor: isDark ? '#333333' : '#F9FAFB',
                                        borderColor: isDark ? '#444444' : '#E5E7EB',
                                    },
                                ]}
                                onPress={onCancel}
                                activeOpacity={0.7}
                            >
                                <Text
                                    style={[
                                        styles.cancelButtonText,
                                        {
                                            color: isDark ? '#FFFFFF' : '#1E2939',
                                        },
                                    ]}
                                >
                                    {cancelText}
                                </Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            style={[
                                styles.confirmButton,
                                {
                                    backgroundColor: confirmButtonColor || (isDark ? '#DC2626' : '#E7000B'),
                                    flex: cancelText ? 1 : undefined,
                                    width: cancelText ? undefined : '100%',
                                },
                            ]}
                            onPress={onConfirm}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.confirmButtonText}>{confirmText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: '#000000B2',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    modalContainer: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 24,
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        lineHeight: 28,
        color: '#1E2939',
        marginBottom: 12,
        textAlign: 'center',
    },
    message: {
        fontSize: 15,
        color: '#4A5565',
        lineHeight: 24,
        marginBottom: 24,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '400',
        color: '#1E2939',
    },
    confirmButton: {
        flex: 1,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#E7000B',
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmButtonText: {
        fontSize: 16,
        fontWeight: '400',
        color: '#FFFFFF',
    },
});

export default ConfirmModal;

