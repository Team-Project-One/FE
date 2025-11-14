import React from 'react';
import { View, Text } from 'react-native';
import styles from '../../styles/signup/singupDetailedStyles';
import SelectableButton from './SelectableButton';

interface MbtiSelectorProps {
    value: string;
    onChange: (val: string) => void;
}

const mbtiTypes = [
    'INTJ',
    'INTP',
    'ENTJ',
    'ENTP',
    'INFJ',
    'INFP',
    'ENFJ',
    'ENFP',
    'ISTJ',
    'ISFJ',
    'ESTJ',
    'ESFJ',
    'ISTP',
    'ISFP',
    'ESTP',
    'ESFP',
];

const MbtiSelector: React.FC<MbtiSelectorProps> = ({ value, onChange }) => {
    const toggle = (next: string) => onChange(value === next ? '' : next);

    return (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>MBTI</Text>
            <View style={styles.mbtiGrid}>
                {mbtiTypes.map((mbti) => (
                    <SelectableButton
                        key={mbti}
                        label={mbti}
                        selected={value === mbti}
                        onPress={() => toggle(mbti)}
                        style={{ width: 80, height: 44, flex: undefined }}
                        textStyle={{ fontSize: 14, fontWeight: '500' }}
                    />
                ))}
            </View>
        </View>
    );
};

export default MbtiSelector;
