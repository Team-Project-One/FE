import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Props {
    label: string;
    selected: boolean;
    onPress: () => void;
    error?: boolean;
}

const MbtiButton: React.FC<Props> = ({ label, selected, onPress, error }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            style={[styles.button, selected && styles.selected, error && !selected && styles.errorButton]}
        >
            <Text style={[styles.text, selected && styles.textSelected]}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        width: '23.5%',
        height: 40,
        borderRadius: 10,
        borderWidth: 1.35,
        borderColor: '#9CA3AF',
        backgroundColor: '#FFFFFF',
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
        color: '#364153',
        fontWeight: '400',
    },
    textSelected: {
        color: '#EC4899',
        fontWeight: '400',
    },
    errorButton: {
        borderTopColor: '#FB2C36',
        borderColor: '#FB2C36',
    },
});

export default MbtiButton;
