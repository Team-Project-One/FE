import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BackwardSvg from '../../../assets/back.svg';
import styles from '../../styles/signup/progressHeaderStyles';

const BasicProgressHeader = ({ startProgress, endProgress, progress, onBack, top, step, totalSteps }: any) => {
    const from = startProgress ?? 0;
    const to = endProgress ?? progress ?? from;

    const progressAnimation = useRef(new Animated.Value(from)).current;

    useEffect(() => {
        progressAnimation.setValue(from);
        Animated.timing(progressAnimation, {
            toValue: to,
            duration: 400,
            useNativeDriver: false,
        }).start();
    }, [from, to]);

    return (
        <View style={[styles.container, { paddingTop: top }]}>
            <View style={styles.progressBar}>
                <Animated.View
                    style={{
                        height: '100%',
                        width: progressAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%'],
                        }),
                    }}
                >
                    <LinearGradient colors={['#EC4899', '#F43F5E']} style={styles.gradient} />
                </Animated.View>
            </View>

            <View style={styles.row}>
                <TouchableOpacity style={styles.backButton} onPress={onBack}>
                    <BackwardSvg width={24} height={24} />
                </TouchableOpacity>

                {step && totalSteps ? (
                    <Text style={styles.step}>
                        {step}/{totalSteps}단계
                    </Text>
                ) : (
                    <View style={{ width: 24 }} />
                )}

                <View style={{ width: 24 }} />
            </View>
        </View>
    );
};

export default BasicProgressHeader;
