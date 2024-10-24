import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState, useCallback } from 'react';
import { StyleSheet, StatusBar, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedButton } from '@/components/ThemedButton';
import { useThemeColor } from '@/hooks/useThemeColor';
import { AddDownButton } from '@/components/AddDownButton';

import  LancamentosCreateModal  from '@/app/(tabs)/lancamentos/criar'

import { useNavigation, useRouter, Stack } from 'expo-router';
import { LancamentoRepository, InfoMesType } from '@/repositories/LancamentoRepository';
import { LancamentoDescrito } from '@/types/lancamentos';

import { stringToDate } from '@/utils/dateUtils';

export default function LancamentosScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const text = useThemeColor({}, 'text');
  const backgroundSoft = useThemeColor({}, 'backgroundSoft');
  const backgroundHard = useThemeColor({}, 'backgroundHard');

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ title: 'Lançamentos', headerTintColor: text, headerStyle: { backgroundColor: backgroundSoft } })
  }, [navigation]);

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

  const [modal, setModal] = useState(false);
  const [mesSelecionado, setMesSelecionado] = useState<number>( new Date().getMonth() );
  const [infoMes, SetInfoMes] = useState<InfoMesType|null>();
  const [diasComLancamentos, setDiasComLancamentos] = useState<string[]>([]);
  const [lancamentos, setLancamentos] = useState<LancamentoDescrito[]>([]);

  useFocusEffect(
    useCallback(() => {
      atualizaDados();
    }, [])
  );

  useEffect( () => {
    atualizaDados();
  }, [])

  useEffect(()=> {

    if (mesSelecionado < 0) {
      setMesSelecionado(11);
      return;
    }
    
    if (mesSelecionado > 11) {
      setMesSelecionado(0);
      return;
    }

    const getInfo = async () => {
      const lancamentoRepository = new LancamentoRepository();
      const infoMes = await lancamentoRepository.getInfoMes(user.USUARIO_ID, mesSelecionado+1, 2024)
      SetInfoMes(infoMes);
    }
    
    getInfo();
  }, [mesSelecionado]);
  
  async function atualizaDados(){

    if (mesSelecionado !== new Date().getMonth()) {
      setMesSelecionado(new Date().getMonth())
      return;
    }

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

      setDiasComLancamentos(dias.map((dia) => {
        return new Date(dia).toLocaleDateString('pt-br')
      }));

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

        <ThemedView style={{paddingVertical: 10, backgroundColor: backgroundSoft, marginBottom: 10, gap: 20, borderBottomEndRadius: 15, borderBottomStartRadius: 15}}>
          <ThemedView style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center', gap: 15}}>
            
            <TouchableOpacity
              style={{ backgroundColor: 'gray', borderRadius: 50, width: 35, height: 35, alignItems: 'center', justifyContent: 'center' }}
              onPress={() => { setMesSelecionado(mesSelecionado - 1) }}
            >
              <Ionicons size={35} name="arrow-back-circle" color={'white'} />
            </TouchableOpacity>
            
            <ThemedText style={{width: 100, textAlign: 'center', fontSize: 20 }}>
              {meses[mesSelecionado]}
            </ThemedText>

            <TouchableOpacity
              style={{ backgroundColor: 'gray', borderRadius: 50, width: 35, height: 35, alignItems: 'center', justifyContent: 'center' }}
              onPress={() => { setMesSelecionado(mesSelecionado + 1) }}
            >
              <Ionicons size={35} name="arrow-forward-circle" color={'white'} />
            </TouchableOpacity>
          </ThemedView>

          <ThemedView style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15}}>
            <ThemedView style={{flex: 1, alignItems: 'flex-start'}}>
              <ThemedText style={{color: text}} >Entradas</ThemedText>
              <ThemedText style={{color: text}}>
                {infoMes?.entradas ?
                  <> {infoMes.entradas}</> :
                  <> 0</>
                }
              </ThemedText>
            </ThemedView>

            <ThemedView style={{flex: 1, alignItems: 'center'}}>
              <ThemedText>Balanço</ThemedText>
              <ThemedText>
                {infoMes?.balanco ? 
                  <> {infoMes.balanco}</> :
                  <> </>
                }
              </ThemedText>
            </ThemedView>

            <ThemedView style={{flex: 1, alignItems: 'flex-end'}}>
              <ThemedText>Saidas</ThemedText>
              <ThemedText>
                {infoMes?.saidas ? 
                  <> {infoMes.saidas}</> :
                  <> 0</>
                }
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        <ScrollView>
          {diasComLancamentos.filter((dia) => {
            return stringToDate(dia).getMonth() == mesSelecionado
          }).map((dia) => {
          return (
            <ThemedView key={dia} style={{marginBottom: 20, padding: 10}}>
              <ThemedText style={{ fontSize: 18, borderTopWidth: 1, borderColor: 'gray' }}>{dia}</ThemedText>
              <ThemedView style={{gap: 15}}>
                {lancamentos.filter((lancamento) => {return dia == new Date(lancamento.DATA).toLocaleDateString('pt-br') }).map((lancamento) => {
                  return ( 
                    <ThemedView key={lancamento.TITULO} style={{borderLeftWidth: 2, borderColor: lancamento.TIPO == 'Débito' ? 'red' : 'green' }}>
                      <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 5, borderTopLeftRadius: 5, borderTopRightRadius: 5}}>
                          
                          <ThemedView style={{ flexDirection: 'column' }}>
                            <ThemedText type='subtitle'>{lancamento.TITULO}</ThemedText>

                            <ThemedView style={{ flexDirection: 'row' }}>
                              <ThemedText>{lancamento.CATEGORIA} | </ThemedText> 
                              <ThemedText>{lancamento.CONTA}</ThemedText>
                            </ThemedView>

                          </ThemedView>
                          
                          <ThemedView style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
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

