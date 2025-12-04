import { StyleSheet } from 'react-native';
import { colors } from '../../theme/tokens';

export default StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 14,
    },
    genderButton: {
        flex: 1,
        backgroundColor: colors.white.base,
        borderTopWidth: 1.35,
        borderTopColor: '#9CA3AF',
        borderWidth: 1.35,
        borderColor: '#9CA3AF',
        paddingTop: 15,
        paddingBottom: 19,
        borderRadius: 10,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 13,
    },
    genderButtonSelectedMale: {
        backgroundColor: '#EFF6FF', // 파란색 배경
        borderColor: '#3B82F6', // 파란색 테두리
        borderTopColor: '#3B82F6',
    },
    genderButtonSelectedFemale: {
        backgroundColor: colors.pink[50],
        borderColor: colors.pink[500],
        borderTopColor: colors.pink[500],
    },
    genderButtonError: {
        borderColor: '#FB2C36',
        borderTopColor: '#FB2C36',
    },
    genderButtonText: {
        color: '#6B7280',
        fontSize: 16,
    },
    genderButtonTextSelectedMale: {
        color: '#1E40AF', // 진한 파란색 텍스트
        fontWeight: '400',
    },
    genderButtonTextSelectedFemale: {
        color: colors.pink[700],
        fontWeight: '400',
    },
});
