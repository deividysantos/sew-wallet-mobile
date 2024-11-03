import { StyleSheet, StatusBar, SafeAreaView, View, FlatList, TouchableOpacity, Alert} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useNavigation, useRouter } from 'expo-router';
import { useEffect, useState, useCallback  } from 'react';
import { AddDownButton } from '@/components/AddDownButton';
import { ThemedText } from '@/components/ThemedText';
import { ContaDescrita } from '@/types/conta';
import { ContaRepository, SaldoContaType, SaldoFuturoType } from '@/repositories/ContaRespoitory';
import { useAuth } from '@/contexts/AuthContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { getLastDayOfCurrentMonth } from '../../../utils/dateUtils'
import { formatCurrency } from '@/utils/currency';

export default function ContasScreen() {
  const backgroundHard = useThemeColor({}, 'backgroundHard');
  const backgroundSoft = useThemeColor({}, 'backgroundSoft');
  const primaryColor = useThemeColor({}, 'primary');
  const text = useThemeColor({}, 'text');

  const router = useRouter();
  const navigation = useNavigation();

  const [contas, setContas] = useState< {contas: ContaDescrita, saldo: number, saldoFuturo: number }[] >([]);

  const { user } = useAuth();

  useEffect(() => {
    navigation.setOptions({ title: 'Contas', headerTintColor: text, headerStyle: { backgroundColor: backgroundSoft } })
  }, [navigation])

  const atualizaDados = () => {
    const fn = async () => {
      
      const contaRepository = new ContaRepository;
      const [saldos, contas, saldosFuturos] = await Promise.all([
        contaRepository.getSaldoContas(user.USUARIO_ID, new Date()),
        contaRepository.getAllByUser(user.USUARIO_ID),
        contaRepository.getSaldoFuturo(user.USUARIO_ID, undefined, getLastDayOfCurrentMonth())
      ]);

      const contasSaldo = contas?.map(( conta ) => {
        let saldo = saldos
          ?.filter( (saldo) => { 
              return saldo.conta_id == conta.CONTA_ID 
          })
          .reduce( (currentValue: number, actualValue: SaldoContaType ) => {
            return currentValue + actualValue.saldo
          }, 0)

        if (!saldo) {
          saldo = 0;
        }

        let saldoFuturo = saldosFuturos
          ?.filter((saldoFuturo) => {
            return saldoFuturo.conta_id = conta.CONTA_ID
          })
          .reduce( (currentValue: number, actualValue: SaldoFuturoType) => {
            return currentValue + actualValue.saldo
          }, 0)

          if (!saldoFuturo) {
            saldoFuturo = 0
          }
 
        return { contas: conta, saldo: saldo,saldoFuturo: saldoFuturo }
      });

      if (contasSaldo){
        setContas( contasSaldo );
      }
    }

    fn();
  }

  useEffect(() => {
    atualizaDados();  
  }, []);

  useFocusEffect(
    useCallback(() => {
      atualizaDados();
    }, [])
  );

  async function handleDelete (conta_id : number):Promise<void> {
    const excluiConta = async () => {
      try{
        const contaRepository = new ContaRepository;
        await contaRepository.deleteConta(conta_id);
  
        atualizaDados()
  
      } catch (error: any) {
        Alert.alert('Erro ao apagar a conta!', error.message, [{text: 'Ok', style: 'cancel'}])
      }
    }
    
    Alert.alert('Atenção!', 'Deseja realmente apagar a conta?', [{text: 'Sim', style: 'default', onPress: () => { excluiConta() }}, {text: 'Não', style: 'cancel'}])
  }

  
  return (
    
    <SafeAreaView style={[styles.container, { backgroundColor: backgroundHard }]}>
        <StatusBar
            backgroundColor={backgroundSoft}
            barStyle={ useThemeColor({}, 'barStyle') == 'dark' ? 'dark-content' : 'light-content' }
            translucent={false}
        /> 

        <FlatList
          data={contas}
          renderItem={(conta) => 
          
          <View style={{ margin: 10, backgroundColor: backgroundSoft, borderRadius: 5, padding: 15, shadowColor: "#ccc", shadowOffset: { width: 5, height: 3, }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 4 }}>            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <ThemedText type='subtitle' > { conta.item.contas.NOME_CONTA } </ThemedText>
              <TouchableOpacity onPress={() => handleDelete(conta.item.contas.CONTA_ID)}>
                <Ionicons size={20} name="trash" style={{color: '#fff'}} />
              </TouchableOpacity>
            </View> 

            <View style={{ paddingHorizontal: 7, paddingVertical: 5, gap: 5 }}>
              <ThemedText>Banco: {conta.item.contas.NOME_BANCO}</ThemedText>
              <ThemedText>Saldo inicial: { formatCurrency(conta.item.contas.SALDO_INICIAL, 'BRL') } </ThemedText>
              <ThemedText style={{ fontWeight: '800' }} >Saldo Atual: { formatCurrency(conta.item.saldo, 'BRL') } </ThemedText>
              <ThemedText style={{ fontWeight: '800' }} >Saldo Futuro: { formatCurrency(conta.item.saldoFuturo, 'BRL') } </ThemedText>
            </View>
          </View>}
        >

        </FlatList>
        <AddDownButton onPress={() => router.push('/cadastros/contas/criar')} />
    </SafeAreaView>
  
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 25,
      
    },
    cardConfig: {
      paddingHorizontal: 15,
      paddingBottom: 10,
      borderRadius: 8,
      marginTop: 15,
      gap: 5,
    },
    link: {
      paddingVertical: 5,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5
    },
    titleCard: {
      marginTop: 15
    },
    cardConta: {

    }
});
