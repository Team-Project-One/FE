import React from 'react';
import { View, Text } from 'react-native';
import styles from '../../styles/signup/singupDetailedStyles';
import SelectableButton from './SelectableButton';

interface SmokingSelectorProps {
    value: string;
    onChange: (val: string) => void;
    error?: boolean;
    bgColor?: string;
    borderColor?: string;
    textColor?: string;
}

const SmokingSelector: React.FC<SmokingSelectorProps> = ({
    value,
    onChange,
    error,
    bgColor = '#FFFFFF',
    borderColor = '#9CA3AF',
    textColor = '#364153',
}) => {
    // 한번 선택한 옵션을 다시 눌러도 해제되지 않도록 하고,
    // 다른 옵션을 눌렀을 때만 선택이 변경되도록 처리
    const handleSelect = (next: string) => {
        if (value === next) return;
        onChange(next);
    };

    return (
        <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: textColor }]}>흡연 여부</Text>

            <View style={styles.twoColumnContainer}>
                <View style={styles.buttonRow}>
                    <SelectableButton
                        label="비흡연"
                        selected={value === '비흡연'}
                        onPress={() => handleSelect('비흡연')}
                        error={error && !value}
                        bgColor={bgColor}
                        borderColor={borderColor}
                        textColor={textColor}
                    />

                    <SelectableButton
                        label="흡연"
                        selected={value === '흡연'}
                        onPress={() => handleSelect('흡연')}
                        error={error && !value}
                        bgColor={bgColor}
                        borderColor={borderColor}
                        textColor={textColor}
                    />
                </View>
            </View>
        </View>
    );
};

export default SmokingSelector;
