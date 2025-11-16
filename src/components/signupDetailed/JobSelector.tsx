import React from 'react';
import { View, Text } from 'react-native';
import styles from '../../styles/signup/singupDetailedStyles';
import SelectableButton from './SelectableButton';

interface JobSelectorProps {
    value: string;
    onChange: (job: string) => void;
    error?: boolean;

    bgColor?: string;
    borderColor?: string;
    textColor?: string;
}

const JobSelector: React.FC<JobSelectorProps> = ({
    value,
    onChange,
    error,
    bgColor = '#FFFFFF',
    borderColor = '#9CA3AF',
    textColor = '#364153',
}) => {
    const hasError = error && !value;

    return (
        <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: textColor }]}>직업</Text>

            <View style={styles.jobContainer}>
                <View style={styles.jobRow}>
                    <SelectableButton
                        label="무직"
                        selected={value === '무직'}
                        onPress={() => onChange(value === '무직' ? '' : '무직')}
                        error={hasError}
                        bgColor={bgColor}
                        borderColor={borderColor}
                        textColor={textColor}
                    />

                    <SelectableButton
                        label="학생"
                        selected={value === '학생'}
                        onPress={() => onChange(value === '학생' ? '' : '학생')}
                        error={hasError}
                        bgColor={bgColor}
                        borderColor={borderColor}
                        textColor={textColor}
                    />
                </View>

                <View style={styles.jobRow}>
                    <SelectableButton
                        label="직장인"
                        selected={value === '직장인'}
                        onPress={() => onChange(value === '직장인' ? '' : '직장인')}
                        error={hasError}
                        bgColor={bgColor}
                        borderColor={borderColor}
                        textColor={textColor}
                    />
                </View>
            </View>
        </View>
    );
};

export default JobSelector;
