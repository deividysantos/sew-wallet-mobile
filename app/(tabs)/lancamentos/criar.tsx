import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import { StyleSheet, StatusBar, SafeAreaView, View, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { AddDownButton } from '@/components/AddDownButton';

import { useRouter, Stack } from 'expo-router';

export default function LancamentosCreateScreen() {
  const router = useRouter();

  const text = useThemeColor({}, 'text');
  const backgroundSoft = useThemeColor({}, 'backgroundSoft');
  const backgroundHard = useThemeColor({}, 'backgroundHard');

  const [tipoLancamento, setTipoLancamento] = useState('');

  return (
    <>
      <SafeAreaView style={[styles.container, { backgroundColor: backgroundHard }]}>
        <StatusBar
          backgroundColor={backgroundHard}
          barStyle={useThemeColor({}, 'barStyle') == 'dark' ? 'dark-content' : 'light-content'}
          translucent={false}
        />
        {tipoLancamento === '' &&
          <>
            <ThemedText>
              Selecione o tipo de lançamentos
            </ThemedText>

            <View style={{ flexDirection: 'row', gap: 50, padding: 25 }}>
              <TouchableOpacity
                onPress={() => { setTipoLancamento('C') }}
                style={styles.btnTipoLancamento}
              >
                <Ionicons size={40} name="arrow-up-outline" style={{ color: 'green' }} />
                <ThemedText>
                  Crédito
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => { setTipoLancamento('D') }}
                style={styles.btnTipoLancamento}
              >
                <Ionicons size={40} name="arrow-down-outline" style={{ color: 'red' }} />
                <ThemedText>
                  Débito
                </ThemedText>
              </TouchableOpacity>
            </View>
          </>
        }

        {tipoLancamento === 'C' && <>
            <ThemedText>
              agora vai
            </ThemedText>
        </>}

        {tipoLancamento === 'D' && <>
            <ThemedText>
              agora vai
            </ThemedText>
        </>}
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnTipoLancamento: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'white',
    padding: 20,
    width: 100,
    height: 100,
    borderRadius: 100,
  }
});

