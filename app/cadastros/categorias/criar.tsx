import { StyleSheet, StatusBar, SafeAreaView, View, TouchableOpacity, Alert } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useNavigation, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

import { CategoriaRepository } from '@/repositories/CategoriaRepository';

import { ThemedText } from '@/components/ThemedText';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { Categoria } from '@/types/categoria';

export default function CategoriasScreen() {
  const backgroundHard = useThemeColor({}, 'backgroundHard');
  const backgroundSoft = useThemeColor({}, 'backgroundSoft');
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const text = useThemeColor({}, 'text');

  const router = useRouter();
  const navigation = useNavigation();
  const { user } = useAuth();

  useEffect(() => {
    navigation.setOptions({ title: 'Cadastrar Categoria', headerTintColor: text, headerStyle: { backgroundColor: backgroundSoft } })
  }, [navigation])
  
  const [form, setForm] = useState<Categoria>({
      CATEGORIA_ID: 0,
      USUARIO_ID: user?.USUARIO_ID,
      NOME: '',
      TIPO: ''
    });

  const handleCriaCategoria = async () => {
    try {
      const categoria_id = await (new CategoriaRepository).create(form);
      if (categoria_id) {
        router.back();
      }
    } catch (error: any) {
      Alert.alert('Erro ao cadastrar categoria!', error.message, [{text: 'Ok', style: 'cancel'}])
    }  
  };

  return (
  
    <SafeAreaView style={[styles.container, { backgroundColor: backgroundHard }]}>
      <StatusBar
          backgroundColor={backgroundHard}
          barStyle={ useThemeColor({}, 'barStyle') == 'dark' ? 'dark-content' : 'light-content'}
          translucent={false}
      />
      

      <View style={{flex: 1, justifyContent: 'space-between'}}>
        <View style={{ gap: 15 }}>    
          <View>
            <ThemedText style={styles.label}>Nome da categoria</ThemedText>  
            <ThemedTextInput 
              value={ form?.NOME }
              onChangeText={ (newValue => setForm( (formAterior) => ({ ...formAterior, NOME: newValue }) )) }/> 
          </View>

          <View style={{gap: 10}}>
            <ThemedText>
                Tipo da categoria
            </ThemedText>
           
            <View style={{flexDirection: 'row', gap: 50}}>
                
                <View style={{flexDirection: 'row',  alignItems: 'center', gap: 10}}>
                    <TouchableOpacity 
                      style={[styles.radioButton, {backgroundColor: backgroundSoft}, form.TIPO == 'D' ? { backgroundColor: primaryColor} : {} ]}
                      onPress={() => setForm( (formAnteiror) => ({...formAnteiror, TIPO: 'D'}) )} 
                    >
                        
                    </TouchableOpacity>
                    <ThemedText>
                        Despesa
                    </ThemedText>
                </View>

                <View style={{flexDirection: 'row',  alignItems: 'center', gap: 10}}>
                    <TouchableOpacity 
                      style={[styles.radioButton, {backgroundColor: backgroundSoft}, form.TIPO == 'R' ? { backgroundColor: primaryColor} : {}]}
                      onPress={() => setForm( (formAnteiror) => ({...formAnteiror, TIPO: 'R'}) )}
                    >
                        
                    </TouchableOpacity>
                    <ThemedText>
                        Receita
                    </ThemedText>
                </View>

            </View>
          </View>
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          <TouchableOpacity 
            style={[styles.button, styles.buttonCancel]}
            onPress={() => router.back()}
          >
            <ThemedText style={{ color: 'red' }}>
              Cancelar
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.buttonConfirm, { backgroundColor: secondaryColor, borderColor: primaryColor }]}
            onPress={() => handleCriaCategoria()}
          >
            <ThemedText style={{color: primaryColor}}>
              Cadastrar
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
        
    </SafeAreaView>
  
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 25,
      
    },
    label: {
      marginLeft: 5,
      marginBottom: 2
    },
    button: {
      paddingHorizontal: 35,
      paddingVertical: 10,
      borderRadius: 8,
      borderWidth: 1
    },
    buttonConfirm: {      
    },
    buttonCancel:{
      borderColor: 'red',      
    },
    radioButton: {
        width: 30,
        height: 30,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: 'white'
    }
    
});
