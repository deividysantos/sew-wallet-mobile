import { StyleSheet, StatusBar, SafeAreaView, View, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useNavigation, useRouter } from 'expo-router';
import { useEffect } from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedTextInput } from '@/components/ThemedTextInput';

export default function ContasScreen() {
  const backgroundHard = useThemeColor({}, 'backgroundHard');
  const backgroundSoft = useThemeColor({}, 'backgroundSoft');
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const text = useThemeColor({}, 'text');

  const router = useRouter();
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ title: 'Cadastrar Conta', headerTintColor: text, headerStyle: { backgroundColor: backgroundSoft } })
  }, [navigation])
  
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
            <ThemedText style={styles.label}>Nome da conta</ThemedText>  
            <ThemedTextInput 
              
              placeholder='Senha' 
              //value={ 'teste' }
              onChangeText={() => {}}/> 
          </View>

          <View>
            <ThemedText style={styles.label}>Banco</ThemedText>  
            <ThemedTextInput 
              
              placeholder='Senha' 
              //value={ 'teste' }
              onChangeText={() => {}}/> 
          </View>

          <View>
            <ThemedText style={styles.label}>Valor Inicial</ThemedText>  
            <ThemedTextInput 
              keyboardType = 'numeric'
              placeholder='Senha' 
              //value={ 'teste' }
              onChangeText={() => {}}/> 
          </View>
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          <TouchableOpacity style={[styles.button, styles.buttonCancel]}>
            <ThemedText style={{ color: 'red' }}>
              Cancelar
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.buttonConfirm, { backgroundColor: secondaryColor, borderColor: primaryColor }]}>
            <ThemedText style={{color: primaryColor
              git commit - ''wip'' 
              git push origin main
            }}>
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
    }
    
});
