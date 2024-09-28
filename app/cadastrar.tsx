import { StyleSheet, StatusBar, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Link } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedTextInput } from '@/components/ThemedTextInput';

export default function Index() {
  const backgroundColorButton = useThemeColor({}, 'secondary');
  const primaryColor = useThemeColor({}, 'primary');

  return (
    <SafeAreaView style={{backgroundColor:'#111B21', flex: 1}}>
      <StatusBar
          backgroundColor='#111B21'
          barStyle={'light-content'}
          translucent={false}
      />
      
        
      <View style={styles.container}>
        <ThemedText type='title'>Sew Wallet</ThemedText>
        <View style={{ gap: 16, marginTop: 10 }}>        
          <ThemedTextInput style={styles.textInput} placeholder='Nome'/>
          <ThemedTextInput style={styles.textInput} placeholder='Email'/>
          <ThemedTextInput style={styles.textInput} placeholder='Senha'/>
        </View>
        
        <TouchableOpacity style={[styles.button, { backgroundColor: backgroundColorButton, borderColor: primaryColor }]}>
          <ThemedText style={{color: primaryColor}}>Cadastrar</ThemedText>
        </TouchableOpacity>

        <Link href="/" style={{marginTop: 20, padding: 5}}>
            <ThemedText style={{color: primaryColor}}>Já tem uma conta?</ThemedText>
        </Link>
      </View>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  textInput: {
    width: 350
  },
  button: {
    width: 350,
    padding: 10,
    alignItems: 'center',
    borderRadius: 100,
    marginTop: 28,
    borderWidth: 1
  }
});
