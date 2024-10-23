import { useEffect, useState, useCallback } from 'react';
import { StyleSheet, StatusBar, SafeAreaView, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedButton } from '@/components/ThemedButton';
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

  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
  ];

  const [mesSelecionado, setMesSelecionado] = useState<number>( new Date().getMonth() );

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
              backgroundColor={backgroundSoft}
              barStyle={ useThemeColor({}, 'barStyle') == 'dark' ? 'dark-content' : 'light-content'}
              translucent={false}
          />

        <ThemedView style={{paddingVertical: 10, backgroundColor: backgroundSoft, marginBottom: 10, gap: 10}}>
          <ThemedView style={{flexDirection: 'row', justifyContent: 'space-around', alignItems:'center'}}>
            <ThemedButton text='<' />
            
            <ThemedText>
              {meses[mesSelecionado]}
            </ThemedText>

            <ThemedButton text='>' />
          </ThemedView>

          <ThemedView style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            <ThemedText>Entradas: $2000</ThemedText>
            <ThemedText>Saidas: $1800</ThemedText>
          </ThemedView>
        </ThemedView>

        <ScrollView>
          {diasComLancamentos.filter((dia) => {


            //return diaDate.getMonth() == mesSelecionado
            return true
          }).map((dia) => {
          return (
            <ThemedView key={dia} style={{marginBottom: 20}}>
              <ThemedText style={{ fontSize: 18, borderTopWidth: 1, borderColor: 'gray' }}>{dia}</ThemedText>
              <ThemedView style={{gap: 15}}>
                {lancamentos.filter((lancamento) => {return dia == lancamento.DATA}).map((lancamento) => {
                  return ( 
                    <ThemedView key={lancamento.TITULO} style={{borderLeftWidth: 1, borderColor: lancamento.TIPO == 'Débito' ? 'red' : 'green' }}>
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
                  )
                })}
              </ThemedView>
            </ThemedView>
          )
          })}
        </ScrollView>
        <AddDownButton onPress={() => { setModal(true) } }/>

        <LancamentosCreateModal  visible={modal} setVisible={setModal}/>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
      }
});

