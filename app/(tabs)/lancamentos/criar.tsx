import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState, useRef, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, Keyboard, text } from 'react-native';
import { useRouter } from 'expo-router';
import BottomSheet from "@gorhom/bottom-sheet";

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { useThemeColor } from '@/hooks/useThemeColor';
import { FieldResult, LookUpComboBox } from '@/components/LookUpComboBox';

import { ContaDescrita } from '@/types/conta';

import { useAuth } from '@/contexts/AuthContext';
import { ContaRepository } from '@/repositories/ContaRespoitory';
import { ThemedButton } from '@/components/ThemedButton';

export type LancamentosCreateModal = {
  visible: boolean,
  setVisible: (e:boolean) => void
}

export default function LancamentosCreateModal( { visible, setVisible } : LancamentosCreateModal ) {
  function Close(){
    setVisible(false); 
    setTipoLancamento('');
    setExibeLookUpContas(false);
    setContaSelecionada(null);
  }

  const router = useRouter();
  const { user } = useAuth();
  const sheetRef = useRef<BottomSheet>(null);

  const text = useThemeColor({}, 'text');
  const backgroundSoft = useThemeColor({}, 'backgroundSoft');
  const backgroundHard = useThemeColor({}, 'backgroundHard');

  const [tipoLancamento, setTipoLancamento] = useState('');

  const [contas, setContas] = useState<FieldResult[]|null>(null);
  const [contaSelecionada, setContaSelecionada] = useState<FieldResult|null>(null);
  const [exibeLookUpContas, setExibeLookUpContas] = useState(false);
  
  async function CarregaContas (){
    const contaRepository = new ContaRepository;

    const contasResult = await contaRepository.getAllByUser(user.USUARIO_ID);

    if (!contasResult) {
      setContas(null);
      return
    }

    const contasFiled = contasResult.map( (conta) => {
      return { text: conta.NOME_CONTA, value: conta.CONTA_ID }
    });

    setContas(contasFiled);
  }

  useEffect(() => {
    if (tipoLancamento === ''){
      return;
    }      

    CarregaContas();
  }, [tipoLancamento]);

  const openLookUpContas = useCallback((index: number) => {
    setExibeLookUpContas(true);
    sheetRef.current?.expand();
  }, []);

  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={visible}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={[styles.container]}
        onPress={Close}
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
            <TouchableOpacity  style={[styles.receber, {backgroundColor: backgroundSoft}]} activeOpacity={1}>
              
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <ThemedText type='subtitle' style={{marginBottom: 10}}> Receita </ThemedText>
                <TouchableOpacity
                  onPress={() => { Close() }}
                >
                  <Ionicons size={40} name="close" style={{ color: text }} />
                </TouchableOpacity>
                
              </View>

              <ThemedText> Título </ThemedText>
              <ThemedTextInput style={{marginBottom: 7}} ></ThemedTextInput>

              <ThemedText >Valor</ThemedText>  
              <ThemedTextInput 
                keyboardType = 'numeric'
                style={{marginBottom: 7}}
              />              

              <View style={{flexDirection: 'row', gap: 10, marginBottom: 7}}>
                <View style={{flex: 1}}>
                  <ThemedText> Conta </ThemedText>
                  <ThemedTextInput 
                    value={ contaSelecionada?.text }
                    onPress={ () => {
                      Keyboard.dismiss();
                      openLookUpContas(1);
                    }} 
                    showSoftInputOnFocus={false}
                  />
                </View>


                <View style={{flex: 1}}>
                  <ThemedText> Data </ThemedText>
                  <ThemedTextInput/>
                </View>
              </View>           

              <ThemedText> Descrição </ThemedText>
              <ThemedTextInput style={{marginBottom: 7, height: 100}} multiline></ThemedTextInput>

              <ThemedButton 
                style={{alignItems: 'center', marginTop: 10}} 
                text='Cadastrar' 
                onPress={Close}
              />

            {contas && exibeLookUpContas &&
              <LookUpComboBox 
                children 
                dataList={contas} 
                sheetRef={sheetRef} 
                selectedValue={setContaSelecionada} 
                title='Contas'
              /> 
            }

            </TouchableOpacity>
        </>}

        {tipoLancamento === 'D' && <>
            <TouchableOpacity  style={[styles.options, {backgroundColor: backgroundSoft}]} activeOpacity={1}>
            <ThemedText>agora vai</ThemedText>
            </TouchableOpacity>
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

  receber: {
    marginTop: 'auto',
    height: 'auto',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
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

