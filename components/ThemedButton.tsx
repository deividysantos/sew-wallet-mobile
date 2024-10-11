import { StyleSheet, TouchableOpacity, type TouchableOpacityProps } from 'react-native';
import { ThemedText } from './ThemedText';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedByttonProps = TouchableOpacityProps & {
  lightColor?: string;
  darkColor?: string;
  text: string
};

export function ThemedButton({ text, style, lightColor, darkColor, ...otherProps }: ThemedByttonProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'primary');
  const textColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
        <TouchableOpacity style={[{ backgroundColor }, styles.button, style]} {...otherProps}> 
            <ThemedText style={{ color: 'white' }}>
                {text}
            </ThemedText>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
      width: 350,
      padding: 10,
      alignItems: 'center',
      borderRadius: 100,
      marginTop: 28
    }
  });
  