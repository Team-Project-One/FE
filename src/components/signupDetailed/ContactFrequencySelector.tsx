import React from 'react';
import { View, Text } from 'react-native';
import styles from '../../styles/signup/singupDetailedStyles';
import SelectableButton from './SelectableButton';

interface ContactFrequencySelectorProps {
    value: string;
    onChange: (val: string) => void;
    error?: boolean;
    bgColor?: string;
    borderColor?: string;
    textColor?: string;
}

const ContactFrequencySelector: React.FC<ContactFrequencySelectorProps> = ({
    value,
    onChange,
    error,
    bgColor = '#FFFFFF',
    borderColor = '#9CA3AF',
    textColor = '#364153',
}) => {
    const handleSelect = (next: string) => {
        if (value === next) return;
        onChange(next);
    };

    return (
        <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: textColor }]}>연락 빈도</Text>

            <View style={styles.twoColumnContainer}>
                <View style={styles.buttonRow}>
                    <SelectableButton
                        label="중요함"
                        selected={value === '중요함'}
                        onPress={() => handleSelect('중요함')}
                        error={error && !value}
                        bgColor={bgColor}
                        borderColor={borderColor}
                        textColor={textColor}
                    />

                    <SelectableButton
                        label="중요하지 않음"
                        selected={value === '중요하지 않음'}
                        onPress={() => handleSelect('중요하지 않음')}
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

export default ContactFrequencySelector;
