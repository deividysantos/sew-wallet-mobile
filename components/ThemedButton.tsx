import { StyleSheet, TouchableOpacity, type TouchableOpacityProps } from 'react-native';
import { ThemedText } from './ThemedText';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedByttonProps = TouchableOpacityProps & {
  lightColor?: string;
  darkColor?: string;
  text: string,
  type?: 'cancel' | 'default' | 'primary'
};

export function ThemedButton({ type = 'default',text, style, lightColor, darkColor, ...otherProps }: ThemedByttonProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'primary');
  const textColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const secondaryColor = useThemeColor({}, 'secondary');
  const primaryColor = useThemeColor({}, 'primary');

  return (
        <TouchableOpacity 
          style={[ 
            { backgroundColor },
            type == 'primary' ? styles.primary : undefined,
            type == 'default' ? [styles.default, {backgroundColor: secondaryColor, borderColor: primaryColor}] : undefined,
            type == 'cancel' ? styles.cancel : undefined,
            , style
          ]} 
            {...otherProps}
          >

            <ThemedText 
              style={[
                type == 'cancel' ? {color: 'red'} : undefined,
                type != 'cancel' ? {color: 'white'} : undefined,
              ]}
            >
                {text}
            </ThemedText>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    primary: {
      width: 350,
      padding: 10,
      alignItems: 'center',
      borderRadius: 100,
      marginTop: 28
    },
    default: {
      paddingHorizontal: 35,
      paddingVertical: 10,
      borderRadius: 8,
      borderWidth: 1
    },
    cancel: {
      paddingHorizontal: 35,
      paddingVertical: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'red',
      backgroundColor: 'transparent'

    }
  });
  