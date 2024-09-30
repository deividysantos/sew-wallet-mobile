import Ionicons from '@expo/vector-icons/Ionicons';
import { TouchableOpacity, type TouchableOpacityProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type AddDownButtonProps = TouchableOpacityProps & {
  lightColor?: string;
  darkColor?: string;
};

export function AddDownButton({ style, lightColor, darkColor, ...otherProps }: AddDownButtonProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'backgroundSoft');
  const primaryColor = useThemeColor({ light: lightColor, dark: darkColor }, 'primary');

  return (
    <TouchableOpacity style={[{ backgroundColor }, styles.addButton, style]} {...otherProps}> 
        <Ionicons size={50} name="add" style={{color: primaryColor}} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    addButton: {
        width: 60, 
        height: 60,
        position: 'absolute', 
        bottom: 25, 
        right: 25, 
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center'
    }
});