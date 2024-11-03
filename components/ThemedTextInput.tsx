import { TextInput, type TextInputProps, StyleSheet } from 'react-native';
import { forwardRef } from 'react';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default';
};

export const ThemedTextInput = forwardRef<TextInput, ThemedTextInputProps>(function ThemedTextInput({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextInputProps, ref) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'backgroundSoft');
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const placeholderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'placeholderColor');
  const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'primary');

  return (
    <TextInput
      style={[
        { backgroundColor, color, borderColor },
        type === 'default' ? styles.default : undefined,
        style,
      ]}
      placeholderTextColor={placeholderColor}
      {...rest}
      ref={ref}
    />
  );
});

const styles = StyleSheet.create({
  default: {        
    padding: 10,
    fontSize: 16,
    borderRadius: 8,
    borderStyle: 'solid',
    borderWidth: 1
  }
});
