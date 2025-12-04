import React from 'react';
import { View, Text } from 'react-native';
import styles from '../../styles/signup/singupDetailedStyles';
import SelectableButton from './SelectableButton';

interface PetsSelectorProps {
    value: string;
    onChange: (val: string) => void;
    error?: boolean;
    bgColor?: string;
    borderColor?: string;
    textColor?: string;
}

const PetsSelector: React.FC<PetsSelectorProps> = ({
    value,
    onChange,
    error,
    bgColor = '#FFFFFF',
    borderColor = '#9CA3AF',
    textColor = '#364153',
}) => {
    const hasError = error && !value;
    const handleSelect = (next: string) => {
        if (value === next) return;
        onChange(next);
    };

    return (
        <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: textColor }]}>반려동물</Text>

            <View style={styles.twoColumnContainer}>
                <View style={styles.buttonRow}>
                    <SelectableButton
                        label="없음"
                        selected={value === '없음'}
                        onPress={() => handleSelect('없음')}
                        error={hasError}
                        bgColor={bgColor}
                        borderColor={borderColor}
                        textColor={textColor}
                    />

                    <SelectableButton
                        label="강아지"
                        selected={value === '강아지'}
                        onPress={() => handleSelect('강아지')}
                        error={hasError}
                        bgColor={bgColor}
                        borderColor={borderColor}
                        textColor={textColor}
                    />
                </View>

                <View style={styles.buttonRow}>
                    <SelectableButton
                        label="고양이"
                        selected={value === '고양이'}
                        onPress={() => handleSelect('고양이')}
                        error={hasError}
                        bgColor={bgColor}
                        borderColor={borderColor}
                        textColor={textColor}
                    />

                    <SelectableButton
                        label="기타"
                        selected={value === '기타'}
                        onPress={() => handleSelect('기타')}
                        error={hasError}
                        bgColor={bgColor}
                        borderColor={borderColor}
                        textColor={textColor}
                    />
                </View>
            </View>
        </View>
    );
};

export default PetsSelector;
