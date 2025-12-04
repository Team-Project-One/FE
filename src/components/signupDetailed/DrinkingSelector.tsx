import React from 'react';
import { View, Text } from 'react-native';
import styles from '../../styles/signup/singupDetailedStyles';
import SelectableButton from './SelectableButton';

interface DrinkingSelectorProps {
    value: string;
    onChange: (val: string) => void;
    error?: boolean;

    bgColor?: string;
    borderColor?: string;
    textColor?: string;
}

const DrinkingSelector: React.FC<DrinkingSelectorProps> = ({
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
            <Text style={[styles.label, { color: textColor }]}>음주 빈도</Text>

            <View style={styles.twoColumnContainer}>
                <View style={styles.buttonRow}>
                    <SelectableButton
                        label="안 마심"
                        selected={value === '안 마심'}
                        onPress={() => handleSelect('안 마심')}
                        error={error && !value}
                        bgColor={bgColor}
                        borderColor={borderColor}
                        textColor={textColor}
                    />
                    <SelectableButton
                        label="주 1회 이하"
                        selected={value === '주 1회 이하'}
                        onPress={() => handleSelect('주 1회 이하')}
                        error={error && !value}
                        bgColor={bgColor}
                        borderColor={borderColor}
                        textColor={textColor}
                    />
                </View>

                <View style={styles.buttonRow}>
                    <SelectableButton
                        label="주 1-2회"
                        selected={value === '주 1-2회'}
                        onPress={() => handleSelect('주 1-2회')}
                        error={error && !value}
                        bgColor={bgColor}
                        borderColor={borderColor}
                        textColor={textColor}
                    />
                    <SelectableButton
                        label="주 3회 이상"
                        selected={value === '주 3회 이상'}
                        onPress={() => handleSelect('주 3회 이상')}
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

export default DrinkingSelector;
