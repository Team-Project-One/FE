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
    const toggle = (next: string) => onChange(value === next ? '' : next);

    return (
        <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: textColor }]}>음주 빈도</Text>

            <View style={styles.twoColumnContainer}>
                <View style={styles.buttonRow}>
                    <SelectableButton
                        label="안 마심"
                        selected={value === '안 마심'}
                        onPress={() => toggle('안 마심')}
                        error={error && !value}
                        bgColor={bgColor}
                        borderColor={borderColor}
                        textColor={textColor}
                    />
                    <SelectableButton
                        label="주 1회 이하"
                        selected={value === '주 1회 이하'}
                        onPress={() => toggle('주 1회 이하')}
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
                        onPress={() => toggle('주 1-2회')}
                        error={error && !value}
                        bgColor={bgColor}
                        borderColor={borderColor}
                        textColor={textColor}
                    />
                    <SelectableButton
                        label="주 3회 이상"
                        selected={value === '주 3회 이상'}
                        onPress={() => toggle('주 3회 이상')}
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
