import { StyleSheet, StatusBar, SafeAreaView, View, ScrollView, FlatList} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useNavigation, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Seeds } from '@/database/seeds';
import { AddDownButton } from '@/components/AddDownButton';
import { ThemedText } from '@/components/ThemedText';
import { ContaDescrita } from '@/types/conta';
import { ContaRepository } from '@/repositories/ContaRespoitory';
import { useAuth } from '@/contexts/AuthContext';
import { Banco } from '@/types/banco';

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

  useEffect(() => {
    const seed = new Seeds;
    seed
      .bancosSeed()
      .then(() => {
        const contaRepository = new ContaRepository;
        contaRepository
          .getAllByUser(user?.USUARIO_ID ?? null)
          .then((contas) => {
            if (contas){
              setContas(contas);
            }                 
          });
      });
  }, []);
  
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
            <ThemedText style={{ backgroundColor: primaryColor, padding: 5, borderTopLeftRadius: 5, borderTopRightRadius: 5}}>
              {conta.item.NOME_CONTA}
            </ThemedText> 
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
