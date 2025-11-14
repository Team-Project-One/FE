import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';

interface Props {
    label: string;
    selected: boolean;
    onPress: () => void;
    style?: ViewStyle | ViewStyle[];
    textStyle?: TextStyle | TextStyle[];
}

const SelectableButton: React.FC<Props> = ({ label, selected, onPress, style, textStyle }) => {
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
                    flex: 1,
                },
                style,
            ]}
        >
            <Text
                style={[
                    {
                        color: selected ? '#333333' : '#666666',
                        fontSize: 14,
                        fontWeight: selected ? '500' : '400',
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
