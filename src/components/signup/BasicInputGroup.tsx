import React from 'react';
import { View, Text, TextInput } from 'react-native';
import styles from '../../styles/signup/basicInputStyles';

const BasicInputGroup = ({ label, value, onChange, error }: any) => {
    return (
        <View style={styles.group}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={[styles.input, error && styles.inputError]}
                value={value}
                onChangeText={onChange}
                placeholder={`${label}을 입력하세요`}
                placeholderTextColor="#6B7280"
            />
        </View>
    );
};

export default BasicInputGroup;
