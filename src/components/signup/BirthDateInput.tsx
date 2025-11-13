import React from 'react';
import { View, Text, TextInput } from 'react-native';
import styles from '../../styles/signup/birthDateStyles';

const BirthDateInput = ({ value, onChange, error }: any) => {
    const formatBirthDate = (text: string) => {
        const numbers = text.replace(/[^0-9]/g, '');
        if (numbers.length <= 4) return numbers;
        if (numbers.length <= 6) return `${numbers.slice(0, 4)}-${numbers.slice(4)}`;
        return `${numbers.slice(0, 4)}-${numbers.slice(4, 6)}-${numbers.slice(6, 8)}`;
    };

    return (
        <View style={styles.group}>
            <Text style={styles.label}>생년월일</Text>

            <TextInput
                style={[styles.input, error && styles.inputError]}
                value={value}
                onChangeText={(v) => onChange(formatBirthDate(v))}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#A3A3A3"
                keyboardType="numeric"
                maxLength={10}
            />

            <Text style={styles.desc}>정확한 사주 분석을 위해 필요합니다.</Text>
        </View>
    );
};

export default BirthDateInput;
