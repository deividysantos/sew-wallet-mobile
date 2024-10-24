import { StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useNavigation, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ContaDescrita } from '@/types/conta';
import { useAuth } from '@/contexts/AuthContext';

export default function ContasScreen() {
  const backgroundHard = useThemeColor({}, 'backgroundHard');
  const backgroundSoft = useThemeColor({}, 'backgroundSoft');
  const primaryColor = useThemeColor({}, 'primary');
  const text = useThemeColor({}, 'text');

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: 'Cartões', headerTintColor: text, headerStyle: { backgroundColor: backgroundSoft } })
  }, [navigation])

  
  return (
    
    <SafeAreaView style={[styles.container, { backgroundColor: backgroundHard }]}>
        <StatusBar
            backgroundColor={backgroundSoft}
            barStyle={ useThemeColor({}, 'barStyle') == 'dark' ? 'dark-content' : 'light-content'}
            translucent={false}
        /> 
    </SafeAreaView>
  
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 25,
    }
});
