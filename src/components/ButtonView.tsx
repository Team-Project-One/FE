import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle, View } from 'react-native';
import ChatIcon from '../../assets/chat.svg';
import RematchIcon from '../../assets/rematch.svg';
import { LinearGradient } from 'expo-linear-gradient';

export interface GradientButtonProps {
    title: string;
    onPress: () => void;
    icon?: string;
    variant?: 'gradient' | 'outline';
    disabled?: boolean;
    size?: 'default' | 'small' | 'medium';
    titleStyle?: TextStyle | TextStyle[];
}

const HEIGHTS: Record<NonNullable<GradientButtonProps['size']>, number> = {
    default: 64,
    small: 48,
    medium: 52,
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
            <TouchableOpacity onPress={onPress} disabled={disabled} activeOpacity={0.7} style={buttonStyle}>
                <LinearGradient
                    colors={disabled ? ['#D1D5DB', '#D1D5DB'] : ['#EC4899', '#F54144']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                        flex: 1,
                        borderRadius: BORDER_RADIUS,
                        padding: 1.35,
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: 'white',
                            borderRadius: BORDER_RADIUS - 2,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingHorizontal: 24,
                            opacity: disabled ? 0.5 : 1,
                        }}
                    >
                        {icon &&
                            (icon === 'chatting' ? (
                                <ChatIcon width={18} height={18} style={{ marginRight: 8 }} />
                            ) : icon === 'rematching' ? (
                                <RematchIcon width={18} height={18} style={{ marginRight: 12, paddingBottom: 2 }} />
                            ) : (
                                <Text style={{ color: '#EC4899', fontWeight: '400', fontSize: 16, marginRight: 8 }}>
                                    {icon}
                                </Text>
                            ))}
                        <Text
                            style={[
                                {
                                    color: disabled ? '#D1D5DB' : '#E60076',
                                    fontWeight: '400',
                                    fontSize: 16,
                                    paddingBottom: 2,
                                },
                                titleStyle,
                            ]}
                        >
                            {title}
                        </Text>
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity onPress={onPress} disabled={disabled} activeOpacity={0.9} style={buttonStyle}>
            <LinearGradient
                colors={disabled ? ['#D1D5DB', '#D1D5DB'] : ['#EC4899', '#F54144']}
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
                        <ChatIcon width={18} height={18} style={{ marginRight: 12, paddingBottom: 2 }} />
                    ) : icon === 'rematching' ? (
                        <RematchIcon width={18} height={18} style={{ marginRight: 12 }} />
                    ) : (
                        <Text style={{ color: 'white', fontWeight: '400', fontSize: 16, marginRight: 8 }}>{icon}</Text>
                    ))}
                <Text
                    style={[
                        { color: 'white', fontWeight: '400', fontSize: 16, lineHeight: 20, textAlign: 'center' },
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
