import React from 'react';
import { View, Text } from 'react-native';
import styles from '../../styles/signup/singupDetailedStyles';
import SelectableButton from './SelectableButton';

interface JobSelectorProps {
    value: string;
    onChange: (job: string) => void;
    error?: boolean;
}

const JobSelector: React.FC<JobSelectorProps> = ({ value, onChange, error }) => {
    const hasError = error && !value;

    return (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>직업</Text>

            <View style={styles.jobContainer}>
                <View style={styles.jobRow}>
                    <SelectableButton
                        label="무직"
                        selected={value === '무직'}
                        onPress={() => onChange(value === '무직' ? '' : '무직')}
                        error={hasError}
                    />
                    <SelectableButton
                        label="학생"
                        selected={value === '학생'}
                        onPress={() => onChange(value === '학생' ? '' : '학생')}
                        error={hasError}
                    />
                </View>

                <View style={styles.jobRow}>
                    <SelectableButton
                        label="직장인"
                        selected={value === '직장인'}
                        onPress={() => onChange(value === '직장인' ? '' : '직장인')}
                        error={hasError}
                    />
                </View>
            </View>
        </View>
    );
};

export default JobSelector;
