import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { colors } from '../../theme/tokens';
import styles from '../../styles/signup/genderStyles';

interface Props {
    value: string;
    onChange: (gender: string) => void;
    hasError?: boolean;
}

const GenderSelector: React.FC<Props> = ({ value, onChange, hasError }) => {
    const isMale = value === 'male';
    const isFemale = value === 'female';

    return (
        <View style={styles.container}>
            {/* 남성 */}
            <TouchableOpacity
                style={[
                    styles.genderButton,
                    isMale && styles.genderButtonSelectedMale,
                    hasError && !value && styles.genderButtonError,
                ]}
                onPress={() => onChange('male')}
                activeOpacity={0.8}
            >
                <Text style={[styles.genderButtonText, isMale && styles.genderButtonTextSelectedMale]}>남성</Text>
            </TouchableOpacity>

            {/* 여성 */}
            <TouchableOpacity
                style={[
                    styles.genderButton,
                    isFemale && styles.genderButtonSelectedFemale,
                    hasError && !value && styles.genderButtonError,
                ]}
                onPress={() => onChange('female')}
                activeOpacity={0.8}
            >
                <Text style={[styles.genderButtonText, isFemale && styles.genderButtonTextSelectedFemale]}>여성</Text>
            </TouchableOpacity>
        </View>
    );
};

export default GenderSelector;
