import { StyleSheet } from 'react-native';
import { colors, typography } from '../../theme/tokens';

export default StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        paddingBottom: 36,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 10000,
        overflow: 'hidden',
        marginBottom: 24,
    },
    gradient: {
        flex: 1,
        borderRadius: 10000,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    step: {
        ...typography.body16r,
        fontWeight: '400',
        color: '#4A5565',
    },
});
