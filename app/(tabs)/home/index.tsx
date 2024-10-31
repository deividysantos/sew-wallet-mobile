import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, SafeAreaView, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter, Stack } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

import { useAuth } from '@/contexts/AuthContext';

import { ContaRepository, SaldoContaType } from '@/repositories/ContaRespoitory';
import { LancamentoRepository, DespesasPorCategoriaType } from '@/repositories/LancamentoRepository';
import DespesasPendentes from '@/components/Home/DespesasPendentes';

export default function Index() {
  const router = useRouter();
  const { user } = useAuth();

  const text = useThemeColor({}, 'text');
  const backgroundSoft = useThemeColor({}, 'backgroundSoft');
  const backgroundHard = useThemeColor({}, 'backgroundHard');

  const [key, setKey] = useState(Date.now());
  const [mesAtual, setMesAtual] = useState<{ mes: number, ano: number }>({ mes: 0, ano: 0 });
  const [saldoContas, setSaldoContas] = useState<SaldoContaType[]|null>(null);
  const [lancamentosPorCategoria, setLancamentosPorCategoria] = useState<{ totalDespesas: number , despesas: DespesasPorCategoriaType[]} |null>(null);

  useFocusEffect(
    useCallback(() => {
      setKey(Date.now());
      atualizaDados();
    }, [])
  );

  async function atualizaDados(){

    const dataNow = new Date();
    const mes = dataNow.getMonth() + 1;
    const ano = dataNow.getFullYear();
    
    if(mes != mesAtual.mes) {
      setMesAtual( {mes, ano} )
    }

    const contaRepository = new ContaRepository();

    const saldos = await contaRepository.getSaldoContas(user.USUARIO_ID, new Date());
    setSaldoContas(saldos);

    getLancamentosPorCategoria();
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
  
  async function getLancamentosPorCategoria(){
    const lancamentoRepository = new LancamentoRepository();

    const lancamentos = await lancamentoRepository.getLancamentosPorCategoria(user.USUARIO_ID, mesAtual.mes, mesAtual.ano);

    const totalDesp = lancamentos.reduce( (accumulator: number, currentValue: DespesasPorCategoriaType) => {
      return accumulator + currentValue.valor
    }, 0)

    setLancamentosPorCategoria( { totalDespesas: totalDesp, despesas: lancamentos } );
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
        <ScrollView>
          <DespesasPendentes usuario_id={user.USUARIO_ID} mes={mesAtual.mes} ano={mesAtual.ano} key={key}/>

          <ThemedView style={{padding: 12,backgroundColor: backgroundSoft, margin: 10, borderRadius: 5, shadowColor: "#ccc", shadowOffset: { width: 5, height: 3, }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 4 }}>
            <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <ThemedText type='subtitle'>Gastos por categoria</ThemedText>
              <TouchableOpacity onPress={() => {
                router.push('/cadastros/categorias/criar')
              }}>
                <Ionicons name='add' size={30} color={text} />
              </TouchableOpacity>
            </ThemedView>

            <ThemedView style={{gap: 10, paddingVertical: 10}}>
            {lancamentosPorCategoria ?
              lancamentosPorCategoria.despesas.map((categoria, i) => {
                return (
                  <ThemedView key={i} style={{flexDirection: 'row', justifyContent: 'space-between' }}>
                    <ThemedText>{categoria.categoria}</ThemedText>
                    <ThemedText>{categoria.valorFormatado}</ThemedText>
                  </ThemedView>
              )})
              :
                <></>
            }
            </ThemedView>

            <ThemedView style={{flexDirection:'row', justifyContent:'space-between', paddingTop: 12, borderTopWidth: 1, borderColor: 'gray'}}>
              <ThemedText type='subtitle'>Total</ThemedText>
              <ThemedText>{'R$ ' + lancamentosPorCategoria?.totalDespesas.toFixed(2).replace('.',',')}</ThemedText> 
            </ThemedView>
          </ThemedView>

          <ThemedView style={{ padding: 15, backgroundColor: backgroundSoft, marginTop: 10, borderRadius: 10, margin: 10, shadowColor: "#ccc", shadowOffset: { width: 5, height: 3, }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 4 }}>
            <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <ThemedText type='subtitle'>Saldo em contas </ThemedText>
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
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
    }
});