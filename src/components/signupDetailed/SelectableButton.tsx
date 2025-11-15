import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';
import styles from '../../styles/signup/singupDetailedStyles';

interface Props {
    label: string;
    selected: boolean;
    onPress: () => void;

    // 다크모드 스타일
    bgColor?: string;
    borderColor?: string;
    textColor?: string;

    style?: ViewStyle | ViewStyle[];
    textStyle?: TextStyle | TextStyle[];
    error?: boolean;
}

const SelectableButton: React.FC<Props> = ({
    label,
    selected,
    onPress,
    bgColor = '#FFFFFF',
    borderColor = '#9CA3AF',
    textColor = '#364153',
    style,
    textStyle,
    error,
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            style={[
                {
                    backgroundColor: selected ? '#FDF2F8' : bgColor,
                    borderWidth: 1.35,
                    borderColor: selected ? '#EC4899' : borderColor,
                    borderTopColor: selected ? '#EC4899' : borderColor,
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
                        color: selected ? '#EC4899' : textColor,
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
