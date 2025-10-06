import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import colors from '../theme/colors';
import { typography } from '../theme/typography';
type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;     // dışardan override
  textStyle?: StyleProp<TextStyle>; // dışardan override
  disabled?: boolean;
};

const PrimaryButton: React.FC<Props> = ({
  title,
  onPress,
  loading = false,
  style,
  textStyle,
  disabled,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.button, style]}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={[styles.text, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand,   // default: brand blue
    borderColor: colors.brand,
  },
  text: {
    color: '#fff',
    fontSize: typography.price,
    fontFamily: typography.family.semibold,
  },
});

export default PrimaryButton;
