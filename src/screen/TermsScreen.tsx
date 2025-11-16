import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { BaseScreenProps } from '../types';
import BackIcon from '../../assets/back.svg';
import { useTheme } from '../theme/ThemeContext';

const TermsScreen: React.FC<BaseScreenProps> = ({ onNavigate }) => {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]}>
            <StatusBar style={isDark ? 'light' : 'dark'} />

            <View
                style={[
                    styles.header,
                    {
                        borderBottomColor: isDark ? '#FFFFFF33' : '#E5E7EB',
                        marginTop: insets.top,
                    },
                ]}
            >
                <TouchableOpacity onPress={() => onNavigate('settings')} style={styles.backButton}>
                    <BackIcon width={24} height={24} color={isDark ? '#FFFFFF' : '#000000'} />
                </TouchableOpacity>

                <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#1E2939' }]}>이용약관</Text>

                <View style={styles.placeholder} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1E2939' }]}>제1조 (목적)</Text>
                <Text style={[styles.paragraph, { color: isDark ? '#CCCCCC' : '#374151' }]}>
                    본 약관은 서비스를 이용함에 있어 회사와 이용자 사이의 권리, 의무 및 책임사항을 규정함을 목적으로
                    합니다.
                </Text>

                <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1E2939' }]}>제2조 (정의)</Text>
                <Text style={[styles.paragraph, { color: isDark ? '#CCCCCC' : '#374151' }]}>
                    1. “서비스”란 회사가 제공하는 모바일 애플리케이션 및 관련 제반 서비스를 의미합니다.
                    {'\n'}
                    2. “이용자”란 본 약관에 동의하고 서비스를 이용하는 회원 및 비회원을 말합니다.
                </Text>

                <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1E2939' }]}>
                    제3조 (약관의 게시와 개정)
                </Text>
                <Text style={[styles.paragraph, { color: isDark ? '#CCCCCC' : '#374151' }]}>
                    회사는 관련 법령을 준수하며 약관을 개정할 수 있으며 개정 시 적용일자 및 개정사유를 명시합니다.
                </Text>

                <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1E2939' }]}>
                    제4조 (이용자의 의무)
                </Text>
                <Text style={[styles.paragraph, { color: isDark ? '#CCCCCC' : '#374151' }]}>
                    이용자는 관계법령, 약관, 서비스 이용안내 및 공지사항 등을 준수하여야 합니다.
                </Text>

                <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1E2939' }]}>
                    제5조 (서비스 제공 및 변경)
                </Text>
                <Text style={[styles.paragraph, { color: isDark ? '#CCCCCC' : '#374151' }]}>
                    회사는 안정적인 서비스 제공을 위해 최선을 다하며 운영상·기술상의 필요에 따라 서비스를 변경할 수
                    있습니다.
                </Text>

                <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1E2939' }]}>제6조 (면책)</Text>
                <Text style={[styles.paragraph, { color: isDark ? '#CCCCCC' : '#374151' }]}>
                    천재지변, 불가항력 등 회사가 통제할 수 없는 사유로 인한 서비스 장애에 대하여 회사는 책임을 지지
                    않습니다.
                </Text>

                <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>부칙</Text>
                <Text style={[styles.paragraph, { color: isDark ? '#CCCCCC' : '#374151' }]}>
                    본 약관은 게시한 날로부터 시행합니다.
                </Text>
            </ScrollView>
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
        borderBottomWidth: 1.35,
    },
    backButton: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholder: { width: 32 },
    headerTitle: {
        fontSize: 20,
        fontWeight: '400',
        lineHeight: 28,
    },
    content: {
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
        marginTop: 24,
        marginBottom: 8,
    },
    paragraph: { fontSize: 14, lineHeight: 24 },
});

export default TermsScreen;
