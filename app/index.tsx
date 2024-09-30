import { StyleSheet, StatusBar, SafeAreaView, TouchableOpacity, View, Alert } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Link, Stack, useRouter } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UsuarioRepository } from '@/repositories/UsuarioRespository';
import { UsuarioLogin } from '@/types/usuario';

export default function Index() {
  const router = useRouter();
  const backgroundColorButton = useThemeColor({}, 'secondary');
  const primaryColor = useThemeColor({}, 'primary');
  const backgroundHard = useThemeColor({}, 'backgroundHard');
  const { user, login, logout } = useAuth();

  const [ formLogin, setformLogin ] = useState<UsuarioLogin>({email: 'teste@teste.com', senha: 'senha123'});
  const [ verSenha, setVerSenha ] = useState(false);
  const hiddeChar = '*';
  async function handleLogin () {

    try {
      const usuarioRepository = new UsuarioRepository;
      const usuario_id = await usuarioRepository.verificaCredenciais(formLogin);

      if (usuario_id) {
        const dadosUsuario = await usuarioRepository.buscaDadosUsuario(usuario_id)

        if (dadosUsuario){
          login(dadosUsuario);
          router.replace('/(tabs)');
        }        
      } else {
        Alert.alert('Dados incorretos!', 'Não foi possível entrar com os dados informados, tente novamente.', [{text: 'Tentar Novamente', style: 'cancel'}])
      }
    } catch (error: any) {
      Alert.alert ( 'Dado inválido!' , error.message , [{text: 'Ok', style: 'cancel'}] );
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Login' }} />    
      <SafeAreaView style={{backgroundColor:backgroundHard, flex: 1}}>
        <StatusBar
            backgroundColor={backgroundHard}
            barStyle={ useThemeColor({}, 'barStyle') == 'dark' ? 'dark-content' : 'light-content'}
            translucent={false}
        />        
          
        <View style={styles.container}>
          <ThemedText type='title'>Sew Wallet</ThemedText>
          <View style={{ gap: 16, marginTop: 10 }}>        
            <ThemedTextInput 
              style={styles.textInput} 
              placeholder='Email' 
              value={formLogin.email} 
              onChangeText={novoEmail => setformLogin({ email: novoEmail, senha: formLogin.senha })}/>

            <ThemedTextInput 
              style={styles.textInput} 
              placeholder='Senha' 
              value={ formLogin.senha }
              onChangeText={novaSenha => setformLogin({email: formLogin.email, senha: novaSenha})}/>
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
