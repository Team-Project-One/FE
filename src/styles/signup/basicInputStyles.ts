import { StyleSheet } from 'react-native';
import { colors, typography } from '../../theme/tokens';

export default StyleSheet.create({
    group: {
        gap: 8,
    },
    label: {
        ...typography.body16r,
        fontWeight: '400',
        color: '#364153',
    },
    input: {
        borderTopWidth: 1.35,
        borderTopColor: '#9CA3AF',
        borderWidth: 1.35,
        borderColor: '#9CA3AF',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#364153',
        backgroundColor: colors.white.base,
        width: '100%',
        height: 52,
    },
    inputError: {
        borderTopColor: '#FB2C36',
        borderColor: '#FB2C36',
    },
});
