import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, StatusBar, SafeAreaView, View, Alert, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Link, Stack, useRouter } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UsuarioRepository } from '@/repositories/UsuarioRespository';
import { UsuarioLogin } from '@/types/usuario';
import { ThemedButton } from '@/components/ThemedButton';

import { initDataBase } from '@/database/database';

export default function Index() {
  const router = useRouter();
  const backgroundColorButton = useThemeColor({}, 'secondary');
  const primaryColor = useThemeColor({}, 'primary');
  const backgroundHard = useThemeColor({}, 'backgroundHard');
  const { login } = useAuth();

  useEffect( () => {
    initDataBase()
  }, [])

  const [ formLogin, setformLogin ] = useState<UsuarioLogin>({email: 'admin@admin.com', senha: 'senha123'});
  const [ senhaVisivel, setSenhaVisivel ] = useState(false);
  async function handleLogin () {

    try {
      const usuarioRepository = new UsuarioRepository;
      const usuario_id = await usuarioRepository.verificaCredenciais(formLogin);

      if (usuario_id) {
        const dadosUsuario = await usuarioRepository.buscaDadosUsuario(usuario_id)

        if (dadosUsuario){
          login(dadosUsuario);
          router.replace('/(tabs)/home');
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
      <Stack.Screen options={{ headerShown: false }} />    
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

            <View
              style={{flexDirection: 'row'}}
            >
              <ThemedTextInput 
                style={styles.textInput} 
                placeholder='Senha' 
                value={ formLogin.senha }
                secureTextEntry={!senhaVisivel}
                onChangeText={novaSenha => setformLogin({email: formLogin.email, senha: novaSenha})}/>
                <TouchableOpacity
                  style={{position: 'absolute', right: 3, top: 5, width: 40, height: 40, justifyContent: 'center', }}
                  onPress={ () => {
                    setSenhaVisivel(!senhaVisivel)
                  } }
                >
                  <Ionicons size={30} name={senhaVisivel ? "eye" : "eye-off"} style={{color: primaryColor}} />
                </TouchableOpacity>
            </View>
          </View>

          <ThemedButton 
            text='Entrar'
            type='primary'
            onPress={ handleLogin }
          />

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
