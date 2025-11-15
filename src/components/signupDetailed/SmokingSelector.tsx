import React from 'react';
import { View, Text } from 'react-native';
import styles from '../../styles/signup/singupDetailedStyles';
import SelectableButton from './SelectableButton';

interface SmokingSelectorProps {
    value: string;
    onChange: (val: string) => void;
    error?: boolean;
}

const SmokingSelector: React.FC<SmokingSelectorProps> = ({ value, onChange, error }) => {
    const toggle = (next: string) => onChange(value === next ? '' : next);

    return (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>흡연 여부</Text>

            <View style={styles.twoColumnContainer}>
                <View style={styles.buttonRow}>
                    <SelectableButton
                        label="비흡연"
                        selected={value === '비흡연'}
                        onPress={() => toggle('비흡연')}
                        error={error && !value}
                    />
                    <SelectableButton
                        label="흡연"
                        selected={value === '흡연'}
                        onPress={() => toggle('흡연')}
                        error={error && !value}
                    />
                </View>
            </View>
        </View>
    );
};

export default SmokingSelector;
