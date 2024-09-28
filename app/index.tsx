import { StyleSheet, StatusBar, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Link, Redirect, Stack, useRouter } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { useState } from 'react';

export default function Index() {
  const router = useRouter();
  const backgroundColorButton = useThemeColor({}, 'secondary');
  const primaryColor = useThemeColor({}, 'primary');
  const backgroundHard = useThemeColor({}, 'backgroundHard');

  const [ login, setLogin ] = useState({email: '', senha: ''});

  const handleLogin = () => {    
    router.replace('/(tabs)');
    if ((login.email == 'teste@teste.com') && (login.senha == '123')) {     
      
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Login' }} />    
      <SafeAreaView style={{backgroundColor:backgroundHard, flex: 1}}>
        <StatusBar
            backgroundColor={backgroundHard}
            barStyle={'light-content'}
            translucent={false}
        />        
          
        <View style={styles.container}>
          <ThemedText type='title'>Sew Wallet</ThemedText>
          <View style={{ gap: 16, marginTop: 10 }}>        
            <ThemedTextInput 
              style={styles.textInput} 
              placeholder='Email' 
              value={login.email} 
              onChangeText={novoEmail => setLogin({ email: novoEmail, senha: login.senha })}/>

            <ThemedTextInput 
              style={styles.textInput} 
              placeholder='Senha' 
              value={login.senha}
              onChangeText={novaSenha => setLogin({email: login.email, senha: novaSenha})}/>
          </View>
          
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: backgroundColorButton, borderColor: primaryColor }]}
            onPress={ handleLogin }>
            <ThemedText style={{color: primaryColor}}>Entrar</ThemedText>
          </TouchableOpacity>

          <Link href="/cadastrar" style={{marginTop: 20, padding: 5}}>
            <ThemedText style={{color: primaryColor}}>Deseja criar uma conta?</ThemedText>
          </Link>
        </View>
        
      </SafeAreaView>
    </>
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
