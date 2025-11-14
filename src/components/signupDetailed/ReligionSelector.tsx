import React from 'react';
import { View, Text } from 'react-native';
import styles from '../../styles/signup/singupDetailedStyles';
import SelectableButton from './SelectableButton';

interface ReligionSelectorProps {
    value: string;
    onChange: (val: string) => void;
}

const ReligionSelector: React.FC<ReligionSelectorProps> = ({ value, onChange }) => {
    const toggle = (next: string) => onChange(value === next ? '' : next);

    return (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>종교</Text>
            <View style={styles.twoColumnContainer}>
                <View style={styles.buttonRow}>
                    <SelectableButton label="무교" selected={value === '무교'} onPress={() => toggle('무교')} />
                    <SelectableButton label="기독교" selected={value === '기독교'} onPress={() => toggle('기독교')} />
                </View>
                <View style={styles.buttonRow}>
                    <SelectableButton label="천주교" selected={value === '천주교'} onPress={() => toggle('천주교')} />
                    <SelectableButton label="불교" selected={value === '불교'} onPress={() => toggle('불교')} />
                </View>
                <View style={styles.buttonRow}>
                    <SelectableButton label="기타" selected={value === '기타'} onPress={() => toggle('기타')} />
                </View>
            </View>
        </View>
    );
};

export default ReligionSelector;
