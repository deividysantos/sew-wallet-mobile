import { StyleSheet, StatusBar, SafeAreaView, View, SectionList, TouchableOpacity, Alert} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useNavigation, useRouter } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import { AddDownButton } from '@/components/AddDownButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CategoriaRepository } from '@/repositories/CategoriaRepository';
import { useAuth } from '@/contexts/AuthContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { CategoriaDescrita } from '@/types/categoria';
import { useFocusEffect } from '@react-navigation/native';

export default function CategoriasScreen() {
  const backgroundHard = useThemeColor({}, 'backgroundHard');
  const backgroundSoft = useThemeColor({}, 'backgroundSoft');
  const primaryColor = useThemeColor({}, 'primary');
  const text = useThemeColor({}, 'text');

  const router = useRouter();
  const navigation = useNavigation();

  const [categorias, setCategorias] = useState<{ title: string, data: CategoriaDescrita[] }[]>([{ title: '', data: [] }]);
  const { user } = useAuth();

  useEffect(() => {
    navigation.setOptions({ title: 'Categorias', headerTintColor: text, headerStyle: { backgroundColor: backgroundSoft } })
  }, [navigation])

  const atualizaDados = async () => {
    const categoriaRepository = new CategoriaRepository;

    const allCat = await categoriaRepository.getAll(user.USUARIO_ID);

    const categorias = [
      {
        title: 'Despesas',
        data: allCat? allCat.filter( (categoria) => { return categoria.TIPO == 'D' } ).map( (categoria) => categoria ) : []
      },
      {
        title: 'Receitas',
        data: allCat ? allCat.filter(  (categoria) => { return categoria.TIPO == 'R' } ).map( (categoria) => categoria ) : []
      }
    ]

    if (categorias) {
      setCategorias(categorias)
    }
  }

  useEffect(() => {
    atualizaDados();  
  }, []);

  useFocusEffect(
    useCallback(() => {
      atualizaDados();
    }, [])
  );  

  async function handleDeleteCategoria(categoria_id: number){
    
    const excluirCategoria = async (categoria_id: number) => {
      try {
        const categoriaRepository = new CategoriaRepository()
        await categoriaRepository.delete(categoria_id)
        atualizaDados()
      } catch (error: any) {
        Alert.alert('Erro ao apagar a categoria!', error.message, [{text: 'Ok', style: 'cancel'}])
      }
    }
    
    Alert.alert('Atenção!', 'Deseja realmente apagar a categoria?', [{text: 'Sim', style: 'default', onPress: () => { excluirCategoria(categoria_id) }}, {text: 'Não', style: 'cancel'}])
  }

  return (

    <SafeAreaView style={[styles.container, { backgroundColor: backgroundHard }]}>
        <StatusBar
            backgroundColor={backgroundSoft}
            barStyle={ useThemeColor({}, 'barStyle') == 'dark' ? 'dark-content' : 'light-content'}
            translucent={false}
        /> 

        <SectionList
          sections={categorias}
          keyExtractor={ (item, index) => item.CATEGORIA_NOME+ index }
          showsVerticalScrollIndicator={false}

          renderSectionHeader={({section: { title }}) => (
          <ThemedText type='subtitle' style={{marginBottom: 5}} >{ title }</ThemedText>
        )}

          renderItem={( {item} ) => (
            <ThemedView style={{ marginBottom: 15}}>
              <ThemedView style={{ backgroundColor: primaryColor, flexDirection: 'row', justifyContent: 'space-between', padding: 5, borderRadius: 5, alignItems: 'center'}}>
                <ThemedText>{ item.CATEGORIA_NOME }</ThemedText>
                <TouchableOpacity
                  onPress={ () => {handleDeleteCategoria(item.CATEGORIA_ID)} }
                >
                  <Ionicons name='trash' size={20} style={{ color: '#ccc' }} />
                </TouchableOpacity>
                
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
