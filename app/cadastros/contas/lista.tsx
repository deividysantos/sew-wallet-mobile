import { StyleSheet, StatusBar, SafeAreaView, } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useNavigation, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Seeds } from '@/database/seeds';
import { AddDownButton } from '@/components/AddDownButton';
import { ThemedText } from '@/components/ThemedText';
import { ContaDescrita } from '@/types/conta';
import { ContaRepository } from '@/repositories/ContaRespoitory';
import { useAuth } from '@/contexts/AuthContext';

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
          .getAllByUser(user?.usuario_id ?? null)
          .then((bancos) => {
            if (bancos){
              setContas(bancos);
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
            
        
        <AddDownButton onPress={() => router.push('/cadastros/contas/criar')} />

        {contas.length > 0 ? (
          contas.map( (contas) => <ThemedText>{contas.NOME_CONTA}</ThemedText> )
        ) : (
          <ThemedText style={{textAlign: 'center'}} >Ainda não existem contas cadastradas!</ThemedText>
        )}

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
    }
});
