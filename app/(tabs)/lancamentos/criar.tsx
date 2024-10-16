import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Modal } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

import { useRouter } from 'expo-router';

export type LancamentosCreateModal = {
  visible: boolean,
  setVisible: (e:boolean) => void
}

export default function LancamentosCreateModal( { visible, setVisible } : LancamentosCreateModal ) {
  const router = useRouter();

  const text = useThemeColor({}, 'text');
  const backgroundSoft = useThemeColor({}, 'backgroundSoft');
  const backgroundHard = useThemeColor({}, 'backgroundHard');

  const [tipoLancamento, setTipoLancamento] = useState('');

  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={visible}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={[styles.container]}
        onPress={ 
          () => { 
            setVisible(false); 
            setTipoLancamento('') 
          }
        }
      >

        {tipoLancamento === '' &&
          <TouchableOpacity  style={[styles.options, {backgroundColor: backgroundSoft}]} activeOpacity={1} >
            <ThemedText type='subtitle'>
              Selecione o tipo do lançamento
            </ThemedText>

            <View style={{ flexDirection: 'row', gap: 50 }}>
              <TouchableOpacity
                onPress={() => { setTipoLancamento('C') }}
                style={styles.btnTipoLancamento}
              >
                <Ionicons size={40} name="arrow-up-outline" style={{ color: 'green' }} />
                <ThemedText>
                  Crédito
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => { setTipoLancamento('D') }}
                style={styles.btnTipoLancamento}
              >
                <Ionicons size={40} name="arrow-down-outline" style={{ color: 'red' }} />
                <ThemedText>
                  Débito
                </ThemedText>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        }

        {tipoLancamento === 'C' && <>
            <ThemedText>
              agora vai
            </ThemedText>
        </>}

        {tipoLancamento === 'D' && <>
            <ThemedText>
              agora vai
            </ThemedText>
        </>}
      </TouchableOpacity>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    
    flex: 1
  },

  options: {
    marginTop: 'auto',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30,
    padding: 20,
    marginHorizontal: 15
  },

  
  btnTipoLancamento: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    borderColor: 'white',
    padding: 20,
    width: 100,
    height: 100,
    borderRadius: 100,
  }
});

