import { useEffect, useState, useCallback } from 'react';
import { StyleSheet, StatusBar, SafeAreaView, Modal, TouchableOpacity, Alert, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { AddDownButton } from '@/components/AddDownButton';

import  LancamentosCreateModal  from '@/app/(tabs)/lancamentos/criar'

import { useNavigation, useRouter, Stack } from 'expo-router';
import { LancamentoRepository } from '@/repositories/LancamentoRepository';
import { LancamentoDescrito } from '@/types/lancamentos';

export default function LancamentosScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const text = useThemeColor({}, 'text');
  const backgroundSoft = useThemeColor({}, 'backgroundSoft');
  const backgroundHard = useThemeColor({}, 'backgroundHard');

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ title: 'Lançamentos', headerTintColor: text, headerStyle: { backgroundColor: backgroundSoft } })
  }, [navigation])

  const [modal, setModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      atualizaDados();
    }, [])
  );

  useEffect( () => {
    atualizaDados();
  }, [])

  const [diasComLancamentos, setDiasComLancamentos] = useState<string[]>([]);
  const [lancamentos, setLancamentos] = useState<LancamentoDescrito[]>([]);
  async function atualizaDados(){
    const lancamentoRepository = new LancamentoRepository();

    try {
      const result =  await lancamentoRepository.getAllByUser(user.USUARIO_ID);

      if (!result) {
        return
      }
   
      let dias = result.map((lancamento) => {
        return lancamento.DATA
      });

      dias = dias.filter(function(este, i) {
        return dias.indexOf(este) === i;
      });

      setDiasComLancamentos(dias);
      setLancamentos(result);
    } catch (e:any){
      console.log(e.message);
    }
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }}/>
      <SafeAreaView style={[styles.container, { backgroundColor: backgroundHard }]}>
        <StatusBar
              backgroundColor={backgroundHard}
              barStyle={ useThemeColor({}, 'barStyle') == 'dark' ? 'dark-content' : 'light-content'}
              translucent={false}
          />

        <FlatList
          data={diasComLancamentos}
          renderItem={(dia) => 
              <ThemedView style={{marginBottom: 20}}>
                <ThemedText style={{ fontSize: 18, borderTopWidth: 1, borderColor: 'gray' }}>{dia.item}</ThemedText>
                <ThemedView style={{gap: 15}}>
                  {lancamentos.filter((lancamento) => {return dia.item == lancamento.DATA}).map((lancamento) => {
                    return (
                      <> 
                        <ThemedView style={{borderLeftWidth: 1, borderColor: lancamento.TIPO == 'Débito' ? 'red' : 'green' }}>
                          <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 5, borderTopLeftRadius: 5, borderTopRightRadius: 5}}>
                              
                              <ThemedView style={{ flexDirection: 'column' }}>
                                <ThemedText type='subtitle'>{lancamento.TITULO}</ThemedText>

                                <ThemedView style={{ flexDirection: 'row' }}>
                                  <ThemedText>{lancamento.CATEGORIA} | </ThemedText> 
                                  <ThemedText>{lancamento.CONTA}</ThemedText>
                                </ThemedView>

                              </ThemedView>
                              
                              <ThemedView style={{ flexDirection: 'column' }}>
                                <ThemedText>{lancamento.VALOR}</ThemedText>
                                <ThemedText>{lancamento.EFETIVADA}</ThemedText>
                              </ThemedView>
                          </ThemedView> 
                        </ThemedView>
                      </>
                    )
                  })}
                </ThemedView>
              </ThemedView>
          }
          
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

