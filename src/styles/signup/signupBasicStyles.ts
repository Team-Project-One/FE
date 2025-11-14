import { StyleSheet } from 'react-native';
import { colors, typography } from '../../theme/tokens';

export default StyleSheet.create({
    container: {
        flex: 1,
    },

    content: {
        padding: 20,
        gap: 30,
    },

    label: {
        ...typography.body16r,
        fontWeight: '400',
        color: '#364153',
        marginBottom: 8,
    },

    footerContainer: {
        paddingHorizontal: 24,
        alignItems: 'center',
        width: '100%',
        maxWidth: 480,
        alignSelf: 'center',
    },

    buttonContainer: {
        width: '100%',
    },

    disclaimerText: {
        fontSize: 13,
        paddingBottom: 20,
        color: '#6B7280',
        textAlign: 'center',
    },
});
