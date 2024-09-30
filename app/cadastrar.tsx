import { StyleSheet, StatusBar, SafeAreaView, TouchableOpacity, View, Alert } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Link, router } from 'expo-router';
import { initDataBase } from '@/database/database';

import { ThemedText } from '@/components/ThemedText';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { useEffect, useState } from 'react';
import { Usuario } from "@/types/usuario";
import { UsuarioRepository } from '@/repositories/UsuarioRespository';

export default function Index() {
  const backgroundColorButton = useThemeColor({}, 'secondary');
  const backgroundColorHard = useThemeColor({}, 'backgroundHard');
  const primaryColor = useThemeColor({}, 'primary');

  const [form, setForm] = useState<Usuario>({
    nome: '',
    email: '',
    senha: ''
  });

  useEffect(() => {
    initDataBase();
  });

  async function handleCreateUser() {
    try {
      const usuarioRepository = new UsuarioRepository;
      const usuario_id = await usuarioRepository.createUsuario(form);

      if (usuario_id) {
        Alert.alert('Sucesso!', 'Usuário cadastrado com sucesso.', [{text: 'Ok', style: 'cancel'}]);
        router.back();
      }

    } catch (error: any) {
      Alert.alert ( 'Dado inválido!' , error.message , [{text: 'Ok', style: 'cancel'}] );
    }
  }

  return (
    <SafeAreaView style={{backgroundColor:backgroundColorHard, flex: 1}}>
      <StatusBar
          backgroundColor = {backgroundColorHard}
          barStyle={ useThemeColor({}, 'barStyle') == 'dark' ? 'dark-content' : 'light-content'}
          translucent={false}
      />
        
      <View style={styles.container}>
        <ThemedText type='title'>Sew Wallet</ThemedText>
        <View style={{ gap: 16, marginTop: 10 }}>        
          
          <ThemedTextInput 
            style={styles.textInput} 
            placeholder='Nome' 
            value={form.nome} 
            onChangeText={(novoNome => setForm( (formAterior) => ({ ...formAterior, nome: novoNome }) ))} />

          <ThemedTextInput 
            style={styles.textInput} 
            placeholder='Email' 
            value={form.email} 
            onChangeText={(novoEmail => setForm( (formAterior) => ({ ...formAterior, email: novoEmail }) ))}/>
          
          <ThemedTextInput 
            style={styles.textInput} 
            placeholder='Senha' 
            value={form.senha} 
            onChangeText={(novaSenha => setForm( (formAterior) => ({ ...formAterior, senha: novaSenha }) ))}/>
        </View>
        
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: backgroundColorButton, borderColor: primaryColor }]}
          onPress={() => handleCreateUser()}
        >
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
