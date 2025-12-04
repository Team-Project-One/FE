import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import ButtonView from './ButtonView';
import ArrowDown from '../assets/arrowDown.svg';

interface Props {
    visible: boolean;
    type: 'ice' | 'date';
    onClose: () => void;
}

const ChatTipModal: React.FC<Props> = ({ visible, type, onClose }) => {
    const handleClose = () => {
        console.log('[ChatTipModal] handleClose called');
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                <View style={styles.modalBox}>
                    <Text style={styles.title}>{type === 'ice' ? '💡 아이스브레이킹 팁' : '📍 데이트 코스 추천'}</Text>

                    <Text style={styles.desc}>
                        {type === 'ice'
                                ? '처음 대화를 시작할 때 어색하시나요?\n아이스브레이킹 버튼을 눌러보세요!\n대화 주제를 추천해 드립니다.'
                            : '만남 약속이 있으신가요?\n데이트 코스 추천 버튼을 눌러보세요!\n다양한 장소를 선택해드립니다.'}
                    </Text>

                    <View style={styles.buttonWrapper}>
                            <ButtonView title={type === 'ice' ? '닫기' : '확인'} onPress={handleClose} size="medium" />
                        </View>
                    </View>
                    {type === 'ice' && (
                        <View style={styles.arrowContainer}>
                            <View style={styles.arrowWrapper}>
                                <ArrowDown width={200} height={400} />
                    </View>
                        </View>
                    )}
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
        paddingTop: 220, // 모달을 더 아래로
    },
    modalContainer: {
        width: '100%',
        alignItems: 'center',
    },
    modalBox: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: 24,
        zIndex: 10,
    },
    arrowContainer: {
        marginTop: -140, // 화살표 시작 부분을 모달에 가깝게 유지 (모달이 내려간 만큼 보정)
        alignItems: 'flex-start', // 왼쪽에서 시작
        width: '100%',
        paddingLeft: 25, // 왼쪽 여백 (왼쪽으로 이동)
    },
    arrowWrapper: {
        transform: [{ rotate: '0deg' }, { translateY: 40 }], // 회전 없음, 아래로 이동하여 끝부분이 더 아래로 가리키도록
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
        zIndex: 20,
    },
});

export default ChatTipModal;
