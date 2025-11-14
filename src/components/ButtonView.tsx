import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';
import ChatIcon from '../../assets/chat.svg';
import RematchIcon from '../../assets/rematch.svg';
import { LinearGradient } from 'expo-linear-gradient';

export interface GradientButtonProps {
    title: string;
    onPress: () => void;
    icon?: string;
    variant?: 'gradient' | 'outline';
    disabled?: boolean;
    size?: 'default' | 'small' | 'large';
    titleStyle?: TextStyle | TextStyle[];
}

const HEIGHTS: Record<NonNullable<GradientButtonProps['size']>, number> = {
    default: 64,
    small: 48,
    large: 80,
};

const BORDER_RADIUS = 14;

const ButtonView: React.FC<GradientButtonProps> = ({
    title,
    onPress,
    icon,
    variant = 'gradient',
    disabled = false,
    size = 'default',
    titleStyle,
}) => {
    const height = HEIGHTS[size];
    const buttonStyle: ViewStyle = {
        height,
        borderRadius: BORDER_RADIUS,
    };

    if (variant === 'outline') {
        return (
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled}
                activeOpacity={0.7}
                style={{
                    ...buttonStyle,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 24,
                    borderWidth: 1.35,
                    borderColor: disabled ? '#D1D5DB' : '#EC4899',
                    backgroundColor: 'white',
                    opacity: disabled ? 0.5 : 1,
                }}
            >
                {icon &&
                    (icon === 'chatting' ? (
                        <ChatIcon width={20} height={20} style={{ marginRight: 8 }} />
                    ) : icon === 'rematching' ? (
                        <RematchIcon width={20} height={20} style={{ marginRight: 8 }} />
                    ) : (
                        <Text style={{ color: '#EC4899', fontWeight: '400', fontSize: 18, marginRight: 8 }}>
                            {icon}
                        </Text>
                    ))}
                <Text
                    style={[{ color: disabled ? '#D1D5DB' : '#EC4899', fontWeight: '400', fontSize: 18 }, titleStyle]}
                >
                    {title}
                </Text>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity onPress={onPress} disabled={disabled} activeOpacity={0.9} style={buttonStyle}>
            <LinearGradient
                colors={disabled ? ['#D1D5DB', '#D1D5DB'] : ['#EC4899', '#F54144']} // ← 여기 순서 변경됨
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 24,
                    borderRadius: BORDER_RADIUS,
                }}
            >
                {icon &&
                    (icon === 'chatting' ? (
                        <ChatIcon width={20} height={20} style={{ marginRight: 8 }} />
                    ) : icon === 'rematching' ? (
                        <RematchIcon width={20} height={20} style={{ marginRight: 8 }} />
                    ) : (
                        <Text style={{ color: 'white', fontWeight: '400', fontSize: 18, marginRight: 8 }}>{icon}</Text>
                    ))}
                <Text
                    style={[
                        { color: 'white', fontWeight: '400', fontSize: 18, lineHeight: 28, textAlign: 'center' },
                        titleStyle,
                    ]}
                >
                    {title}
                </Text>
            </LinearGradient>
        </TouchableOpacity>
    );
};

export default ButtonView;
