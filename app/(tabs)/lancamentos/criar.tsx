import { useEffect } from 'react';
import { StyleSheet, StatusBar, SafeAreaView } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { AddDownButton } from '@/components/AddDownButton';

import { useNavigation, useRouter, Stack } from 'expo-router';

export default function LancamentosCreateScreen() {
  const router = useRouter();

  const text = useThemeColor({}, 'text');
  const backgroundSoft = useThemeColor({}, 'backgroundSoft');
  const backgroundHard = useThemeColor({}, 'backgroundHard');

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ title: 'Cadastrar Lançamentos', headerTintColor: text, headerStyle: { backgroundColor: backgroundSoft } })
  }, [navigation])

  return (
    <>
      <Stack.Screen/>
      <SafeAreaView style={[styles.container, { backgroundColor: backgroundHard }]}>
        <StatusBar
              backgroundColor={backgroundHard}
              barStyle={ useThemeColor({}, 'barStyle') == 'dark' ? 'dark-content' : 'light-content'}
              translucent={false}
          />

        <ThemedText>Teste</ThemedText>
      
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
      }
});

