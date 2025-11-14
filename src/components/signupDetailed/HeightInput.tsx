import React from 'react';
import { View, Text, TextInput } from 'react-native';
import styles from '../../styles/signup/singupDetailedStyles';

interface HeightInputProps {
    value: string;
    onChange: (val: string) => void;
    error?: boolean;
}

const HeightInput: React.FC<HeightInputProps> = ({ value, onChange, error }) => {
    const handleChange = (text: string) => {
        const onlyNumbers = text.replace(/[^0-9]/g, '');
        onChange(onlyNumbers);
    };

    return (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>키</Text>

            <View style={{ position: 'relative' }}>
                <TextInput
                    style={[styles.input, { paddingRight: 40 }, error && styles.errorButton]}
                    value={value}
                    onChangeText={handleChange}
                    placeholder="키를 입력해주세요"
                    placeholderTextColor="#6B7280"
                    keyboardType="numeric"
                />
                <Text style={styles.cmSuffix}>cm</Text>
            </View>
        </View>
    );
};

export default HeightInput;
