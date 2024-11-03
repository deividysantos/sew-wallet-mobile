import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, StatusBar, SafeAreaView, View, TouchableOpacity, Switch } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { ParametroRepository } from '@/repositories/ParametroRepository';
import { useFocusEffect } from '@react-navigation/native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState, useCallback } from 'react';
import { Parametro, parametrosPadroes} from '@/types/parametro';

export default function ConfiguracoesScreen() {
  const parametroRepository = new ParametroRepository();
  const { user } = useAuth();

  const backgroundHard = useThemeColor({}, 'backgroundHard');
  const backgroundSoft = useThemeColor({}, 'backgroundSoft');
  const primaryColor = useThemeColor({}, 'primary');
  const text = useThemeColor({}, 'text');

  const router = useRouter();
  const { logout } = useAuth();
  
  function makeLogout() {
    logout();
    router.replace('/');
  }

  const [parametros, setParametros] = useState<Parametro[]>([]);

  useEffect(() => {
    atualizaDados();
  }, [])

  useFocusEffect(
    useCallback(() => {
      atualizaDados();
    }, [])
  );

  const atualizaDados = async () => {
    const parametros = await Promise.all(
      parametrosPadroes.map(async (parametroPadrao) => {
        const valor = await parametroRepository.getParametro(user.USUARIO_ID, parametroPadrao.nome, parametroPadrao.valor)
        return { nome: parametroPadrao.nome, valor: valor }
      })
    );

    setParametros(parametros)
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: backgroundHard }]}>
        <StatusBar
            backgroundColor={backgroundSoft}
            barStyle={ useThemeColor({}, 'barStyle') == 'dark' ? 'dark-content' : 'light-content'}
            translucent={false}
        /> 
      <TouchableOpacity 
        style={{flexDirection: 'row', alignItems: 'center', gap: 8}}
        onPress={() => { makeLogout() }}
      >
        <Ionicons size={40} name="person-circle-outline" style={{color: primaryColor}} />
        <ThemedText>Deividy Santos</ThemedText>
      </TouchableOpacity>

      <View style={[styles.cardConfig, {backgroundColor: backgroundSoft}]}>
        <ThemedText type='subtitle' style={styles.titleCard}>Configurações</ThemedText>
        <View style={{borderBottomColor: text, borderBottomWidth: StyleSheet.hairlineWidth}}/>
          <View style={{gap: 10, marginTop: 15}}>
            <ThemedText >Tema Escuro</ThemedText>
            <ThemedText >Saldo oculto ao acessar</ThemedText>
            <ThemedView style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <ThemedText >Alerta de gastos por categoría</ThemedText>
              <Switch 
                    style={{height: 30}}
                    trackColor={{false: '#ccc', true: primaryColor}}
                    onChange={() => {
                      const novoParametros = parametros.map( (parametro) => {
                        return parametro.nome == 'aviso_gasto_categoria' ? {nome: parametro.nome, valor: parametro.valor == 'S' ? 'N' : 'S'} : parametro
                      })

                      let valorAtualizado = novoParametros.find( parametro => parametro.nome == 'aviso_gasto_categoria' )?.valor;

                      if (!valorAtualizado) {
                        valorAtualizado = parametrosPadroes.find( parametro => parametro.nome == 'aviso_gasto_categoria')?.valor

                        if (!valorAtualizado) {
                          valorAtualizado = 'N'
                        }
                      }
                      
                      parametroRepository.atualizarParametro(user.USUARIO_ID, 'aviso_gasto_categoria', valorAtualizado)

                      setParametros(novoParametros)
                    }}
                    value={ parametros.find( parametro => parametro.nome == 'aviso_gasto_categoria' )?.valor == 'S' }
                  />
            </ThemedView>
          </View>
      </View>

      <View style={[styles.cardConfig, {backgroundColor: backgroundSoft}]}>
        <ThemedText type='subtitle' style={styles.titleCard}>Cadastros</ThemedText>
        <View style={{borderBottomColor: text, borderBottomWidth: StyleSheet.hairlineWidth}}/>
          <View style={{gap: 10}}>
            <TouchableOpacity style={styles.option} onPress={() => router.push('/cadastros/categorias/lista')}>
              <Ionicons size={20} name="albums-outline" style={{color: primaryColor}} />
              <ThemedText>Categorías</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={() => router.push('/cadastros/contas/lista')}>
              <MaterialCommunityIcons size={20} name="bank-outline" style={{color: primaryColor}} />
              <ThemedText>Contas</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={() => router.push('/cadastros/cartoes/lista')}>
              <Ionicons size={20} name="card-outline" style={{color: primaryColor}} />
              <ThemedText>Cartões</ThemedText>
            </TouchableOpacity>
          </View>
      </View>      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 20,
    },
    cardConfig: {
      paddingHorizontal: 15,
      paddingBottom: 10,
      borderRadius: 8,
      marginTop: 15,
      gap: 5,
    },
    option: {
      paddingVertical: 5,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5
    },
    titleCard: {
      marginTop: 15
    }
});
