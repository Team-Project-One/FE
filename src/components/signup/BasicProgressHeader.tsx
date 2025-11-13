import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BackwardSvg from '../../../assets/back.svg';
import styles from '../../styles/signup/progressBarStyles';

const BasicProgressHeader = ({ progressAnimation, onBack, top }: any) => {
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

                <Text style={styles.step}>1/4단계</Text>

                <View style={{ width: 40 }} />
            </View>
        </View>
    );
};

export default BasicProgressHeader;
