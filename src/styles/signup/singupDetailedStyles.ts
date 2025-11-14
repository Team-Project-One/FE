import { StyleSheet } from 'react-native';
import { colors, typography } from '../../theme/tokens';

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    titleContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1E2939',
        textAlign: 'center',
    },
    content: {
        flexGrow: 1,
        padding: 24,
    },
    formContainer: {
        gap: 25,
    },
    inputGroup: {
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
    inputText: {
        color: '#364153',
        fontSize: 16,
    },
    inputPlaceholder: {
        color: '#6B7280',
        fontSize: 16,
        fontWeight: '400',
    },
    cmSuffix: {
        position: 'absolute',
        right: 16,
        top: 0,
        bottom: 0,
        textAlignVertical: 'center',
        textAlign: 'center',
        color: '#364153',
        lineHeight: 52,
    },
    jobContainer: {
        gap: 8,
        width: '100%',
        alignSelf: 'stretch',
    },
    jobRow: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'space-between',
    },
    twoColumnContainer: {
        gap: 8,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'space-between',
    },
    mbtiGrid: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
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
    disclaimerContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems: 'center',
    },
    disclaimerText: {
        fontSize: 13,
        paddingBottom: 20,
        color: '#6B7280',
        textAlign: 'center',
    },
    errorButton: {
        borderTopColor: '#FB2C36',
        borderColor: '#FB2C36',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 40,
        maxHeight: '70%',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333333',
    },
    modalCloseButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCloseIcon: {
        fontSize: 16,
        color: '#666666',
        fontWeight: '600',
    },
    modalList: {
        maxHeight: 300,
    },
    modalItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 4,
        borderRadius: 8,
    },
    modalItemSelected: {
        backgroundColor: '#FDF2F8',
    },
    modalItemText: {
        fontSize: 16,
        color: '#333333',
        fontWeight: '500',
    },
    modalItemTextSelected: {
        color: '#EC4899',
        fontWeight: '600',
    },
    modalItemCheck: {
        fontSize: 16,
        color: '#EC4899',
        fontWeight: '600',
    },
    modalSeparator: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginLeft: 4,
    },
});
