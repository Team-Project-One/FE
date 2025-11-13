import { StyleSheet } from 'react-native';
import { colors, typography } from '../../theme/tokens';

export default StyleSheet.create({
    group: {
        gap: 12,
        marginBottom: 10,
    },
    label: {
        ...typography.body18r,
        fontWeight: '600',
        color: colors.gray[100],
        marginBottom: 4,
    },
    input: {
        borderTopWidth: 1.35,
        borderTopColor: colors.gray[500],
        borderWidth: 1.35,
        borderColor: colors.gray[500],
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 16,
        fontSize: 18,
        backgroundColor: colors.white.base,
        width: '100%',
        height: 60,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    inputError: {
        borderColor: colors.rose[500],
    },
});
