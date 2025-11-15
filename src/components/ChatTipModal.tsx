import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import ButtonView from './ButtonView';

interface Props {
    visible: boolean;
    type: 'ice' | 'date';
    onClose: () => void;
}

const ChatTipModal: React.FC<Props> = ({ visible, type, onClose }) => {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modalBox}>
                    <Text style={styles.title}>{type === 'ice' ? '💡 아이스브레이킹 팁' : '📍 데이트 코스 추천'}</Text>

                    <Text style={styles.desc}>
                        {type === 'ice'
                            ? '처음 대화를 시작할 때 어색하시나요?\n아이스브레이킹 질문을 활용해보세요!\n아래 주제를 선택해 드립니다.'
                            : '만남 약속이 있으신가요?\n데이트 코스 추천 버튼을 눌러보세요!\n다양한 장소를 선택해드립니다.'}
                    </Text>

                    <View style={styles.buttonWrapper}>
                        <ButtonView title={type === 'ice' ? '다음' : '확인'} onPress={onClose} size="medium" />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: '#000000B2',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 29,
    },
    modalBox: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 24,
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 18,
        fontWeight: '400',
        lineHeight: 28,
        color: '#1E2939',
        marginBottom: 12,
    },
    desc: {
        fontSize: 15,
        color: '#4A5565',
        lineHeight: 24,
        marginBottom: 24,
    },
    buttonWrapper: {
        width: '100%',
    },
});

export default ChatTipModal;
