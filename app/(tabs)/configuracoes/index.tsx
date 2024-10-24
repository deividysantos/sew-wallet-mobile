import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, StatusBar, SafeAreaView, View, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

import { ThemedText } from '@/components/ThemedText';

export default function ConfiguracoesScreen() {
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
            <ThemedText >Aviso de elevação de gastos por categoría</ThemedText>
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
