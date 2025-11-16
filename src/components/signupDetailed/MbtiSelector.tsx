import React from 'react';
import { View, Text } from 'react-native';
import styles from '../../styles/signup/singupDetailedStyles';
import MbtiButton from './MbtiButton';

interface MbtiSelectorProps {
    value: string;
    onChange: (val: string) => void;
    error?: boolean;
    bgColor?: string;
    borderColor?: string;
    textColor?: string;
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

const MbtiSelector: React.FC<MbtiSelectorProps> = ({
    value,
    onChange,
    error,
    bgColor = '#FFFFFF',
    borderColor = '#9CA3AF',
    textColor = '#364153',
}) => {
    const toggle = (next: string) => onChange(value === next ? '' : next);

    return (
        <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: textColor }]}>MBTI</Text>

            <View style={styles.mbtiGrid}>
                {mbtiTypes.map((mbti) => (
                    <MbtiButton
                        key={mbti}
                        label={mbti}
                        selected={value === mbti}
                        onPress={() => toggle(mbti)}
                        error={error}
                        bgColor={bgColor}
                        borderColor={borderColor}
                        textColor={textColor}
                    />
                ))}
            </View>
        </View>
    );
};

export default MbtiSelector;
