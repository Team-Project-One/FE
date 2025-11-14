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
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
        textAlign: 'center',
    },
    content: {
        flexGrow: 1,
        padding: 20,
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
        borderWidth: 1.35,
        borderColor: '#9CA3AF',
        borderTopWidth: 1.35,
        borderTopColor: '#9CA3AF',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: colors.white.base,
        color: '#333333',
        height: 52,
    },
    inputText: {
        color: '#333333',
        fontSize: 16,
    },
    inputPlaceholder: {
        color: '#999999',
        fontSize: 16,
    },
    cmSuffix: {
        position: 'absolute',
        right: 16,
        top: 0,
        bottom: 0,
        textAlignVertical: 'center',
        textAlign: 'center',
        color: '#666666',
        lineHeight: 52,
    },
    jobContainer: {
        gap: 8,
    },
    jobRow: {
        flexDirection: 'row',
        gap: 8,
    },
    twoColumnContainer: {
        gap: 8,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 8,
    },
    mbtiGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
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
        color: '#6B7280',
        textAlign: 'center',
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
