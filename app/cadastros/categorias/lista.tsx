import { StyleSheet, StatusBar, SafeAreaView, View, FlatList, TouchableOpacity, Alert} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useNavigation, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Seeds } from '@/database/seeds';
import { AddDownButton } from '@/components/AddDownButton';
import { ThemedText } from '@/components/ThemedText';
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

  const [categorias, setCategorias] = useState<CategoriaDescrita[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    navigation.setOptions({ title: 'Categorias', headerTintColor: text, headerStyle: { backgroundColor: backgroundSoft } })
  }, [navigation])

  useEffect(() => {
    const seed = new Seeds;
    seed
      .bancosSeed()
      .then(() => {
        
        if (user?.USUARIO_ID) {
          const categoriaRepository = new CategoriaRepository;
          
          categoriaRepository
            .getAll(user.USUARIO_ID)
            .then((categorias) => {
              if (categorias){
        
                setCategorias(categorias);
              }                 
            });
        }
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
          data={categorias}
          renderItem={(conta) => 
          <View style={{ marginBottom: 15}}>
            <View style={{ backgroundColor: primaryColor, flexDirection: 'row', justifyContent: 'space-between', padding: 5, borderTopLeftRadius: 5, borderTopRightRadius: 5}}>
              <ThemedText>{conta.item.CATEGORIA_NOME}</ThemedText>
              <TouchableOpacity>
                <Ionicons size={20} name="trash" style={{color: 'red'}} />
              </TouchableOpacity>
              
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
