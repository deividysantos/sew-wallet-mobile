import { TextInput, type TextInputProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default';
};

export function ThemedTextInput({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextInputProps) {
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
    />
  );
}

const styles = StyleSheet.create({
  default: {        
    padding: 10,
    fontSize: 16,
    borderRadius: 8,
    borderStyle: 'solid',
    borderWidth: 1
  }
});
