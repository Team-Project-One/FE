import { StyleSheet } from 'react-native';
import { colors } from '../../theme/tokens';

export default StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 10,
    },
    genderButton: {
        flex: 1,
        backgroundColor: colors.white.base,
        borderTopWidth: 1.35,
        borderTopColor: colors.gray[500],
        borderWidth: 1.35,
        borderColor: colors.gray[500],
        paddingVertical: 18,
        borderRadius: 10,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    genderButtonSelectedMale: {
        backgroundColor: colors.gray[900],
        borderColor: colors.gray[800],
    },
    genderButtonSelectedFemale: {
        backgroundColor: colors.pink[50],
        borderColor: colors.pink[500],
    },
    genderButtonError: {
        borderColor: colors.rose[500],
    },
    genderButtonText: {
        color: colors.gray[600],
        fontSize: 16,
    },
    genderButtonTextSelectedMale: {
        color: colors.gray[100],
        fontWeight: '600',
    },
    genderButtonTextSelectedFemale: {
        color: colors.pink[500],
        fontWeight: '600',
    },
});
