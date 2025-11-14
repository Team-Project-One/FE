import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import styles from '../../styles/signup/singupDetailedStyles';

interface RegionSelectorProps {
    value: string;
    onChange: (region: string) => void;
    error?: boolean;
}

const locations = [
    '서울',
    '경기',
    '인천',
    '부산',
    '대구',
    '광주',
    '대전',
    '울산',
    '세종',
    '강원',
    '충북',
    '충남',
    '전북',
    '전남',
    '경북',
    '경남',
    '제주',
];

const RegionSelector: React.FC<RegionSelectorProps> = ({ value, onChange, error }) => {
    const [visible, setVisible] = useState(false);

    return (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>지역</Text>

            <TouchableOpacity
                style={[styles.input, error && styles.errorButton]}
                onPress={() => setVisible(true)}
                activeOpacity={0.8}
            >
                <Text style={value ? styles.inputText : styles.inputPlaceholder}>{value || '지역을 선택하세요'}</Text>
            </TouchableOpacity>

            <Modal visible={visible} transparent animationType="slide" onRequestClose={() => setVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>지역 선택</Text>
                            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setVisible(false)}>
                                <Text style={styles.modalCloseIcon}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={locations}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => {
                                const selected = value === item;

                                return (
                                    <TouchableOpacity
                                        style={[styles.modalItem, selected && styles.modalItemSelected]}
                                        onPress={() => {
                                            onChange(item);
                                            setVisible(false);
                                        }}
                                    >
                                        <Text style={[styles.modalItemText, selected && styles.modalItemTextSelected]}>
                                            {item}
                                        </Text>
                                        {selected && <Text style={styles.modalItemCheck}>✓</Text>}
                                    </TouchableOpacity>
                                );
                            }}
                            ItemSeparatorComponent={() => <View style={styles.modalSeparator} />}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default RegionSelector;
