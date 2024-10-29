import { StyleSheet, StatusBar, SafeAreaView, View, SectionList, TouchableOpacity, Alert} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useNavigation, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { AddDownButton } from '@/components/AddDownButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CategoriaRepository } from '@/repositories/CategoriaRepository';
import { useAuth } from '@/contexts/AuthContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { CategoriaDescrita } from '@/types/categoria';

export default function CategoriasScreen() {
  const backgroundHard = useThemeColor({}, 'backgroundHard');
  const backgroundSoft = useThemeColor({}, 'backgroundSoft');
  const primaryColor = useThemeColor({}, 'primary');
  const text = useThemeColor({}, 'text');

  const router = useRouter();
  const navigation = useNavigation();

  const [categorias, setCategorias] = useState<{ title: string, data: string[] }[]>([{ title: '', data: [] }]);
  const { user } = useAuth();

  useEffect(() => {
    navigation.setOptions({ title: 'Categorias', headerTintColor: text, headerStyle: { backgroundColor: backgroundSoft } })
  }, [navigation])

  useEffect(() => {
    const fn = async () => {
      const categoriaRepository = new CategoriaRepository;

      const allCat = await categoriaRepository.getAll(user.USUARIO_ID);

      const categorias = [
        {
          title: 'Despesas',
          data: allCat? allCat.filter( (categoria) => { return categoria.TIPO == 'D' } ).map( (categoria) => categoria.CATEGORIA_NOME ) : []
        },
        {
          title: 'Receitas',
          data: allCat ? allCat.filter(  (categoria) => { return categoria.TIPO == 'R' } ).map( (categoria) => categoria.CATEGORIA_NOME ) : []
        }
      ]

      if (categorias) {
        setCategorias(categorias)
      }
    }

    fn()
    
  }, []);

  
  return (
    
    <SafeAreaView style={[styles.container, { backgroundColor: backgroundHard }]}>
        <StatusBar
            backgroundColor={backgroundSoft}
            barStyle={ useThemeColor({}, 'barStyle') == 'dark' ? 'dark-content' : 'light-content'}
            translucent={false}
        /> 

        <SectionList
          sections={categorias}
          keyExtractor={ (item, index) => item + index }

          renderSectionHeader={({section: { title }}) => (
          <ThemedText type='subtitle' style={{marginBottom: 5}} >{ title }</ThemedText>
        )}

          renderItem={( {item} ) => (
            <ThemedView style={{ marginBottom: 15}}>
              <ThemedView style={{ backgroundColor: primaryColor, flexDirection: 'row', justifyContent: 'space-between', padding: 5, borderRadius: 5}}>
                <ThemedText>{ item }</ThemedText>
              </ThemedView> 
            </ThemedView>
          )}
        >

        </SectionList>
        <AddDownButton onPress={() => router.push('/cadastros/categorias/criar')} />
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
