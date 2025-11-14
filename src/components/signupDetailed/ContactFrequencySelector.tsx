import React from 'react';
import { View, Text } from 'react-native';
import styles from '../../styles/signup/singupDetailedStyles';
import SelectableButton from './SelectableButton';

interface ContactFrequencySelectorProps {
    value: string;
    onChange: (val: string) => void;
}

const ContactFrequencySelector: React.FC<ContactFrequencySelectorProps> = ({ value, onChange }) => {
    const toggle = (next: string) => onChange(value === next ? '' : next);

    return (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>연락 빈도</Text>
            <View style={styles.twoColumnContainer}>
                <View style={styles.buttonRow}>
                    <SelectableButton label="중요함" selected={value === '중요함'} onPress={() => toggle('중요함')} />
                    <SelectableButton
                        label="중요하지 않음"
                        selected={value === '중요하지 않음'}
                        onPress={() => toggle('중요하지 않음')}
                    />
                </View>
            </View>
        </View>
    );
};

export default ContactFrequencySelector;
