import { StyleSheet, StatusBar, SafeAreaView, View, FlatList, TouchableOpacity, Alert} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useNavigation, useRouter } from 'expo-router';
import { useEffect, useState, useCallback  } from 'react';
import { AddDownButton } from '@/components/AddDownButton';
import { ThemedText } from '@/components/ThemedText';
import { ContaDescrita } from '@/types/conta';
import { ContaRepository } from '@/repositories/ContaRespoitory';
import { useAuth } from '@/contexts/AuthContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';

export default function ContasScreen() {
  const backgroundHard = useThemeColor({}, 'backgroundHard');
  const backgroundSoft = useThemeColor({}, 'backgroundSoft');
  const primaryColor = useThemeColor({}, 'primary');
  const text = useThemeColor({}, 'text');

  const router = useRouter();
  const navigation = useNavigation();

  const [contas, setContas] = useState<ContaDescrita[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    navigation.setOptions({ title: 'Contas', headerTintColor: text, headerStyle: { backgroundColor: backgroundSoft } })
  }, [navigation])

  const atualizaDados = () => {
    const contaRepository = new ContaRepository;
    contaRepository
      .getAllByUser(user?.USUARIO_ID ?? null)
      .then((contas) => {
        if (contas){
          setContas(contas);
        }                 
      });
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
    Alert.alert('Atenção!', 'Deseja realmente apagar a conta?', [{text: 'Sim', style: 'default'}, {text: 'Não', style: 'cancel'}])
    try{
      await  (new ContaRepository).deleteConta(conta_id);
      const contaRepository = new ContaRepository;
        contaRepository
          .getAllByUser(user?.USUARIO_ID ?? null)
          .then((contas) => {
            if (contas){
              setContas(contas);
            }                 
          });
    } catch (error: any) {
      Alert.alert('Erro ao apagar a conta!', error.message, [{text: 'Ok', style: 'cancel'}])
    }
    
  }
  
  return (
    
    <SafeAreaView style={[styles.container, { backgroundColor: backgroundHard }]}>
        <StatusBar
            backgroundColor={backgroundHard}
            barStyle={ useThemeColor({}, 'barStyle') == 'dark' ? 'dark-content' : 'light-content'}
            translucent={false}
        /> 

        <FlatList
          data={contas}
          renderItem={(conta) => 
          <View style={{ marginBottom: 15}}>
            <View style={{ backgroundColor: primaryColor, flexDirection: 'row', justifyContent: 'space-between', padding: 5, borderTopLeftRadius: 5, borderTopRightRadius: 5}}>
              <ThemedText>{conta.item.NOME_CONTA}</ThemedText>
              <TouchableOpacity onPress={() => handleDelete(conta.item.CONTA_ID)}>
                <Ionicons size={20} name="trash" style={{color: 'red'}} />
              </TouchableOpacity>
              
            </View> 
            <View style={{backgroundColor: backgroundSoft, padding: 15, borderBottomEndRadius: 5, borderBottomLeftRadius: 5 }}>
              <ThemedText>Banco: {conta.item.NOME_BANCO}</ThemedText>
              <ThemedText>Saldo inicial: {conta.item.SALDO_INICIAL?.toString() ?? '0,00'}</ThemedText>
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
