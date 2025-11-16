import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Props {
    label: string;
    selected: boolean;
    onPress: () => void;
    error?: boolean;

    // 다크모드 스타일
    bgColor?: string;
    borderColor?: string;
    textColor?: string;
}

const MbtiButton: React.FC<Props> = ({
    label,
    selected,
    onPress,
    error,
    bgColor = '#FFFFFF',
    borderColor = '#9CA3AF',
    textColor = '#364153',
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            style={[
                styles.button,
                { backgroundColor: bgColor, borderColor },
                selected && styles.selected,
                error && !selected && styles.errorButton,
            ]}
        >
            <Text style={[styles.text, { color: textColor }, selected && styles.textSelected]}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        width: '23.5%',
        height: 40,
        borderRadius: 10,
        borderWidth: 1.35,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    selected: {
        borderColor: '#EC4899',
        backgroundColor: '#FDF2F8',
    },
    text: {
        fontSize: 14,
        fontWeight: '400',
    },
    textSelected: {
        color: '#EC4899',
    },
    errorButton: {
        borderColor: '#FB2C36',
    },
});

export default MbtiButton;
