import React from 'react';
import { View, Text, TextInput } from 'react-native';
import styles from '../../styles/signup/singupDetailedStyles';

interface HeightInputProps {
    value: string;
    onChange: (val: string) => void;
    error?: boolean;

    bgColor?: string;
    borderColor?: string;
    textColor?: string;
}

const HeightInput: React.FC<HeightInputProps> = ({
    value,
    onChange,
    error,
    bgColor = '#FFFFFF',
    borderColor = '#9CA3AF',
    textColor = '#364153',
}) => {
    const handleChange = (text: string) => {
        const onlyNumbers = text.replace(/[^0-9]/g, '');
        onChange(onlyNumbers);
    };

    return (
        <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: textColor }]}>키</Text>

            <View style={{ position: 'relative' }}>
                <TextInput
                    style={[
                        styles.input,
                        {
                            paddingRight: 40,
                            backgroundColor: bgColor,
                            borderColor: borderColor,
                            color: textColor,
                        },
                        error && styles.errorButton,
                    ]}
                    value={value}
                    onChangeText={handleChange}
                    placeholder="키를 입력해주세요"
                    placeholderTextColor={textColor + '80'}
                    keyboardType="numeric"
                />

                <Text style={[styles.cmSuffix, { color: textColor }]}>cm</Text>
            </View>
        </View>
    );
};

export default HeightInput;
