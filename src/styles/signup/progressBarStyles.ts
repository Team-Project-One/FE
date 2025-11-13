import { StyleSheet } from 'react-native';
import { colors, typography } from '../../theme/tokens';

export default StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    progressBar: {
        height: 4,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
        overflow: 'hidden',
        marginBottom: 15,
    },
    gradient: {
        flex: 1,
        borderRadius: 2,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    step: {
        ...typography.body16r,
        fontWeight: '500',
        color: colors.gray[100],
    },
});
