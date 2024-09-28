/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    backgroundHard: '#fff',
    backgroundSoft: '#fff',
    primary: '#00A884',
    secondary: '#0A332C',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    backgroupTextInput: '#2A3942',
    placeholderColor: '#ccc'
  },
  dark: {
    text: '#ECEDEE',
    backgroundHard: '#111B21',
    backgroundSoft: '#2A3942',
    primary: '#00A884',    
    secondary: '#0A332C',    
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    placeholderColor: '#ccc'
  },
};
