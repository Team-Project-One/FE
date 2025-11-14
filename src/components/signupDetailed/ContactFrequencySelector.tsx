import React from 'react';
import { View, Text } from 'react-native';
import styles from '../../styles/signup/singupDetailedStyles';
import SelectableButton from './SelectableButton';

interface ContactFrequencySelectorProps {
    value: string;
    onChange: (val: string) => void;
    error?: boolean;
}

const ContactFrequencySelector: React.FC<ContactFrequencySelectorProps> = ({ value, onChange, error }) => {
    const toggle = (next: string) => onChange(value === next ? '' : next);

    return (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>연락 빈도</Text>

            <View style={styles.twoColumnContainer}>
                <View style={styles.buttonRow}>
                    <SelectableButton
                        label="중요함"
                        selected={value === '중요함'}
                        onPress={() => toggle('중요함')}
                        error={error && !value}
                    />

                    <SelectableButton
                        label="중요하지 않음"
                        selected={value === '중요하지 않음'}
                        onPress={() => toggle('중요하지 않음')}
                        error={error && !value}
                    />
                </View>
            </View>
        </View>
    );
};

export default ContactFrequencySelector;
