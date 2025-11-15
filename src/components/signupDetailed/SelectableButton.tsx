import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';
import styles from '../../styles/signup/singupDetailedStyles';

interface Props {
    label: string;
    selected: boolean;
    onPress: () => void;
    style?: ViewStyle | ViewStyle[];
    textStyle?: TextStyle | TextStyle[];
    error?: boolean;
}

const SelectableButton: React.FC<Props> = ({ label, selected, onPress, style, textStyle, error }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            style={[
                {
                    backgroundColor: selected ? '#FDF2F8' : '#FFFFFF',
                    borderWidth: 1.35,
                    borderColor: selected ? '#EC4899' : '#9CA3AF',
                    borderTopColor: selected ? '#EC4899' : '#9CA3AF',
                    borderRadius: 10,
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    minWidth: 166,
                },
                error && !selected && styles.errorButton,
                style,
            ]}
        >
            <Text
                style={[
                    {
                        color: selected ? '#EC4899' : '#364153',
                        fontSize: 16,
                        fontWeight: '400',
                        lineHeight: 24,
                    },
                    textStyle,
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
};

export default SelectableButton;
