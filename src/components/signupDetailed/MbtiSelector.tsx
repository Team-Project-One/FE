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
    // MBTI는 다시 눌러서 선택 해제가 가능하도록 (null 허용)
    const handleSelect = (next: string) => {
        if (value === next) {
            onChange('');
        } else {
            onChange(next);
        }
    };
    return (
        <View style={styles.inputGroup}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Text style={[styles.label, { color: textColor }]}>MBTI</Text>
                <Text style={{ fontSize: 12, color: '#9CA3AF', marginLeft: 8 }}>모르면 안 고르셔도 됩니다!</Text>
            </View>

            <View style={styles.mbtiGrid}>
                {mbtiTypes.map((mbti) => (
                    <MbtiButton
                        key={mbti}
                        label={mbti}
                        selected={value === mbti}
                        onPress={() => handleSelect(mbti)}
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
