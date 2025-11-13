import { StyleSheet } from 'react-native';
import { colors, typography } from '../../theme/tokens';

export default StyleSheet.create({
    container: {
        flex: 1,
    },

    content: {
        flexGrow: 1,
        padding: 20,
        gap: 30,
    },

    label: {
        ...typography.body18r,
        fontWeight: '600',
        color: colors.gray[100],
        marginBottom: 8,
    },

    buttonContainer: {
        paddingHorizontal: 20,
        alignSelf: 'center',
        width: '100%',
        maxWidth: 480,
    },

    disclaimerContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems: 'center',
    },

    disclaimerText: {
        fontSize: 12,
        color: colors.gray[600],
        textAlign: 'center',
    },
});
