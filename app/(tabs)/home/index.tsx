import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, SafeAreaView, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation, useRouter, Stack } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

import { useAuth } from '@/contexts/AuthContext';

import { ContaRepository, SaldoContaType } from '@/repositories/ContaRespoitory';
import { LancamentoRepository, DespesasPendentesType } from '@/repositories/LancamentoRepository';

export default function Index() {
  const router = useRouter();
  const { user } = useAuth();

  const text = useThemeColor({}, 'text');
  const backgroundSoft = useThemeColor({}, 'backgroundSoft');
  const backgroundHard = useThemeColor({}, 'backgroundHard');

  const [saldoContas, setSaldoContas] = useState<SaldoContaType[]|null>(null);
  const [despesasPendentes, setDepespesasPendentes] = useState<DespesasPendentesType[]|null>(null);

  useFocusEffect(
    useCallback(() => {
      atualizaDados();
    }, [])
  );

  async function atualizaDados(){
    const contaRepository = new ContaRepository();

    const saldos = await contaRepository.getSaldoContas(user.USUARIO_ID, new Date());
    setSaldoContas(saldos);

    const lancamentoRepository = new LancamentoRepository();

    const dataNow = new Date();
    const mes = dataNow.getMonth() + 1;
    const ano = dataNow.getFullYear();

    const despesas = await lancamentoRepository.getDespesasPendentes(user.USUARIO_ID, mes, ano);
    setDepespesasPendentes(despesas);
  }

  function getTotalSaldoContas(): string {
    const total = saldoContas?.reduce( (accumulator: number, currentValue: SaldoContaType) => {
      return accumulator + currentValue.saldo;
    }, 0)

    if (total) {
      return 'R$ ' + total.toFixed(2).replace('.',',')
    }

    return ''
  }
  
  
  return (
    <>
      <Stack.Screen/>
      <SafeAreaView style={[styles.container, { backgroundColor: backgroundHard }]}>
        <StatusBar
              backgroundColor={backgroundSoft}
              barStyle={ useThemeColor({}, 'barStyle') == 'dark' ? 'dark-content' : 'light-content'}
              translucent={false}
        />

        <ThemedView style={{padding: 15, gap: 10}}>

          <ThemedView>
            <ThemedText type='subtitle'>Despesas Pendentes</ThemedText>
          </ThemedView>

          <ScrollView
            horizontal
          >
            <ThemedView style={{gap: 15, flexDirection: 'row'}}>
            {despesasPendentes ?
              despesasPendentes.map( (despesa, i) => {
                return (
                  <ThemedView key={i} style={{flexDirection: 'column', backgroundColor: backgroundSoft, padding: 7, borderRadius: 8, width: 150}}>
                    <ThemedText>{despesa.nome}</ThemedText>
                    <ThemedText style={{color: 'red'}}>{despesa.valorFormatado}</ThemedText>
                    <ThemedText>{ new Date(despesa.data).toLocaleDateString('pt-br') }</ThemedText>
                  </ThemedView>
                )
              } ) :
              <><ThemedText>Não existem despesas pendentes</ThemedText></>
            }           
            </ThemedView> 
          </ScrollView>

        </ThemedView>

        <ThemedView style={{gap: 15}}>

          <ThemedView style={{ padding: 15, backgroundColor: backgroundSoft, marginTop: 10, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
            <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <ThemedText style={{fontSize: 18}}>Saldo em contas </ThemedText>
              <TouchableOpacity onPress={() => {
                router.push('/cadastros/contas/criar')
              }}>
                <Ionicons name='add' size={30} color={text} />
              </TouchableOpacity>
            </ThemedView>

            <ThemedView >
              {saldoContas?.map( (saldo, i) => {
                return (
                  <ThemedView key={i} style={{flexDirection: 'row', marginVertical: 5, justifyContent: 'space-between'}}>
                    <ThemedText>
                      {saldo.conta} 
                    </ThemedText>
                    <ThemedText>
                      {saldo.saldoFormatado}
                    </ThemedText>
                  </ThemedView>
                )
              })}
            </ThemedView>

            <ThemedView style={{flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, marginTop: 10, borderTopColor: 'gray', paddingTop: 15}}>
              <ThemedText type='subtitle'>Total</ThemedText>
              <ThemedText> {getTotalSaldoContas()} </ThemedText>
            </ThemedView>
          </ThemedView>
          


        </ThemedView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
    }
});