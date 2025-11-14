import React from 'react';
import { View, Text } from 'react-native';
import styles from '../../styles/signup/singupDetailedStyles';
import SelectableButton from './SelectableButton';

interface PetsSelectorProps {
    value: string;
    onChange: (val: string) => void;
}

const PetsSelector: React.FC<PetsSelectorProps> = ({ value, onChange }) => {
    const toggle = (next: string) => onChange(value === next ? '' : next);

    return (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>반려동물</Text>
            <View style={styles.twoColumnContainer}>
                <View style={styles.buttonRow}>
                    <SelectableButton label="없음" selected={value === '없음'} onPress={() => toggle('없음')} />
                    <SelectableButton label="강아지" selected={value === '강아지'} onPress={() => toggle('강아지')} />
                </View>
                <View style={styles.buttonRow}>
                    <SelectableButton label="고양이" selected={value === '고양이'} onPress={() => toggle('고양이')} />
                    <SelectableButton label="기타" selected={value === '기타'} onPress={() => toggle('기타')} />
                </View>
            </View>
        </View>
    );
};

export default PetsSelector;
