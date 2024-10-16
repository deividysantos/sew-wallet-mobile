import { useEffect, useState } from 'react';
import { StyleSheet, StatusBar, SafeAreaView, Modal, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { AddDownButton } from '@/components/AddDownButton';
import  LancamentosCreateModal  from '@/app/(tabs)/lancamentos/criar'

import { useNavigation, useRouter, Stack } from 'expo-router';

export default function LancamentosScreen() {
  const router = useRouter();

  const text = useThemeColor({}, 'text');
  const backgroundSoft = useThemeColor({}, 'backgroundSoft');
  const backgroundHard = useThemeColor({}, 'backgroundHard');

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ title: 'Lançamentos', headerTintColor: text, headerStyle: { backgroundColor: backgroundSoft } })
  }, [navigation])

  const [modal, setModal] = useState(false);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }}/>
      <SafeAreaView style={[styles.container, { backgroundColor: backgroundHard }]}>
        <StatusBar
              backgroundColor={backgroundHard}
              barStyle={ useThemeColor({}, 'barStyle') == 'dark' ? 'dark-content' : 'light-content'}
              translucent={false}
          />

        <AddDownButton onPress={() => { setModal(true) } }/>

        <LancamentosCreateModal  visible={modal} setVisible={setModal}/>
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

