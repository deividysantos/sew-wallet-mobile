import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState, useRef, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, Keyboard, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import BottomSheet from "@gorhom/bottom-sheet";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useAuth } from '@/contexts/AuthContext';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { useThemeColor } from '@/hooks/useThemeColor';
import { FieldResult, LookUpComboBox } from '@/components/LookUpComboBox';
import { ThemedButton } from '@/components/ThemedButton';

import { Lancamento } from '@/types/lancamentos';
import { ContaRepository } from '@/repositories/ContaRespoitory';
import { LancamentoRepository } from '@/repositories/LancamentoRepository';
import { CategoriaRepository } from '@/repositories/CategoriaRepository';

export type LancamentosCreateModal = {
  visible: boolean,
  setVisible: (e:boolean) => void
}

const LancamentoZerado = {
  CATEGORIA_ID: 0, 
  CONTA_ID: 0, 
  DESCRICAO: '', 
  LANCAMENTO_ID: 0, 
  TITULO: '', 
  VALOR: 0, 
  DATA: new Date, 
  EFETIVADA: 'N'
};

export default function LancamentosCreateModal( { visible, setVisible } : LancamentosCreateModal ) {
  function Close(){
    setVisible(false); 
    setTipoLancamento('');
    setExibeLookUpContas(false);
    setContaSelecionada(null);
    setFomulario(LancamentoZerado);
    setExibeLookUpCategorias(false);
    setCategoriaSelecionada(null);
  }

  const router = useRouter();
  const { user } = useAuth();

  const text = useThemeColor({}, 'text');
  const backgroundSoft = useThemeColor({}, 'backgroundSoft');
  const backgroundHard = useThemeColor({}, 'backgroundHard');

  const [tipoLancamento, setTipoLancamento] = useState('');
  useEffect(() => {
    if (tipoLancamento === ''){
      return;
    }      

    CarregaContas();
    CarregaCategorias();
  }, [tipoLancamento]);

  const [ formulario, setFomulario ] = useState<Lancamento>(LancamentoZerado);

  const sheetRefConta = useRef<BottomSheet>(null);
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

  useEffect(()=>{
    if (contaSelecionada?.value){
      setFomulario( (prev) => ({...prev, CONTA_ID: contaSelecionada.value}) )
    }
  }, [contaSelecionada]);

  const openLookUpContas = useCallback(() => {
    setExibeLookUpContas(true);
    sheetRefConta.current?.expand();
  }, []);

  const sheetRefCategoria = useRef<BottomSheet>(null);
  const [categorias, setCategorias] = useState<FieldResult[]|null>(null);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<FieldResult|null>(null);
  const [exibeLookUpCategorias, setExibeLookUpCategorias] = useState(false);
  
  async function CarregaCategorias (){
    const categoriaRepository = new CategoriaRepository;

    const categoriasResult = await categoriaRepository.getAll(user.USUARIO_ID);

    if (!categoriasResult) {
      setCategorias(null);
      return
    }

    const categoriasFiled = categoriasResult.filter((categoria) => {
      return categoria.TIPO == tipoLancamento
    }).map( (categoria) => {
      return { text: categoria.CATEGORIA_NOME, value: categoria.CATEGORIA_ID }
    });

    setCategorias(categoriasFiled);
  }

  useEffect(()=>{
    if (categoriaSelecionada?.value){
      setFomulario( (prev) => ({...prev, CATEGORIA_ID: categoriaSelecionada.value}) )
    }
  }, [categoriaSelecionada]);

  const openLookUpCategorias = useCallback(() => {
    setExibeLookUpCategorias(true);
    sheetRefCategoria.current?.expand();
  }, []);

  const [exibeDatePicker, setExibeDatePicker] = useState(false);

  const selecionaData = (event: DateTimePickerEvent, date?: Date | undefined) => {
    setExibeDatePicker(false);

    if (!date) {
      return;
    }

    setFomulario( (prev) => ({...prev, DATA: date}) );
  };

  async function handleCadastrar(){
    const lancamentoRepository = new LancamentoRepository;
    console.log(formulario)
    try {
      await lancamentoRepository.createLancamento(formulario);
    } catch (e: any) {
      Alert.alert('Erro ao gravar lançamento!', e.message);
      return;
    }
    
    Close();
  }
  
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
                onPress={() => { setTipoLancamento('R') }}
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

        {tipoLancamento === 'R' && <>
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
              <ThemedTextInput 
                style={{marginBottom: 7}} 
                value={formulario.TITULO}
                onChangeText={ (novoTitulo => setFomulario( (prev) => ({...prev, TITULO: novoTitulo}) ) ) }
              />

              <View style={{flexDirection: 'row', gap: 10, marginBottom: 7}}>
                <View style={{flex: 1}}>
                  <ThemedText >Valor</ThemedText>  
                  <ThemedTextInput 
                    keyboardType = 'numeric'
                    style={{marginBottom: 7}}
                    value={formulario.VALOR.toString()}
                    onChangeText={ (novoValor => setFomulario( (prev) => ({...prev, VALOR: Number(novoValor)}) )) }
                  />
                </View>

                <View style={{flex: 2}}>
                  <ThemedText> Categoria </ThemedText>
                  <ThemedTextInput 
                    value={ categoriaSelecionada?.text }
                    onPress={ () => {
                      Keyboard.dismiss();
                      openLookUpCategorias();
                    }} 
                    showSoftInputOnFocus={false}
                  />
                </View>
              </View>          

              <View style={{flexDirection: 'row', gap: 10, marginBottom: 7}}>
                <View style={{flex: 2}}>
                  <ThemedText> Conta </ThemedText>
                  <ThemedTextInput 
                    value={ contaSelecionada?.text }
                    onPress={ () => {
                      Keyboard.dismiss();
                      openLookUpContas();
                    }} 
                    showSoftInputOnFocus={false}
                  />
                </View>


                <View style={{flex: 1}}>
                  <ThemedText> Data </ThemedText>
                  <ThemedTextInput
                    value={formulario.DATA.toLocaleDateString()}
                    onPress={ () => {
                      setExibeDatePicker(true);
                    }}
                    showSoftInputOnFocus={false}
                  />
                </View>
              </View>           

              <ThemedText> Descrição </ThemedText>
              <ThemedTextInput 
                value={formulario.DESCRICAO.toString()}
                onChangeText={ (novaDesc => setFomulario( (prev) => ({...prev, DESCRICAO: novaDesc}) )) }
                style={{marginBottom: 7, height: 100}} 
                multiline
              />

              <ThemedButton 
                style={{alignItems: 'center', marginTop: 10}} 
                text='Cadastrar' 
                onPress={handleCadastrar}
              />

            {contas && exibeLookUpContas &&
              <LookUpComboBox 
                children 
                dataList={contas} 
                sheetRef={sheetRefConta} 
                selectedValue={setContaSelecionada} 
                title='Contas'
              /> 
            }

            {categorias && exibeLookUpCategorias &&
              <LookUpComboBox 
                children 
                dataList={categorias} 
                sheetRef={sheetRefCategoria} 
                selectedValue={setCategoriaSelecionada} 
                title='Contas'
              /> 
            }            

            {exibeDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={formulario.DATA}
                mode='date'
                onChange={selecionaData}
              />
            )}            

            </TouchableOpacity>
        </>}

        {tipoLancamento === 'D' && <>
            <TouchableOpacity  style={[styles.receber, {backgroundColor: backgroundSoft}]} activeOpacity={1}>
              
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <ThemedText type='subtitle' style={{marginBottom: 10}}> Despesa </ThemedText>
                <TouchableOpacity
                  onPress={() => { Close() }}
                >
                  <Ionicons size={40} name="close" style={{ color: text }} />
                </TouchableOpacity>
                
              </View>

              <ThemedText> Título </ThemedText>
              <ThemedTextInput 
                style={{marginBottom: 7, borderColor: 'red'}} 
                value={formulario.TITULO}
                onChangeText={ (novoTitulo => setFomulario( (prev) => ({...prev, TITULO: novoTitulo}) ) ) }
              />

              <View style={{flexDirection: 'row', gap: 10, marginBottom: 7}}>
                <View style={{flex: 1}}>
                  <ThemedText >Valor</ThemedText>  
                  <ThemedTextInput 
                    keyboardType = 'numeric'
                    style={{marginBottom: 7, borderColor: 'red'}}
                    value={formulario.VALOR.toString()}
                    onChangeText={ (novoValor => setFomulario( (prev) => ({...prev, VALOR: Number(novoValor)}) )) }
                  />
                </View>

                <View style={{flex: 2}}>
                  <ThemedText> Categoria </ThemedText>
                  <ThemedTextInput 
                    value={ categoriaSelecionada?.text }
                    onPress={ () => {
                      Keyboard.dismiss();
                      openLookUpCategorias();
                    }} 
                    style={{borderColor: 'red'}}
                    showSoftInputOnFocus={false}
                  />
                </View>
              </View>          

              <View style={{flexDirection: 'row', gap: 10, marginBottom: 7}}>
                <View style={{flex: 2}}>
                  <ThemedText> Conta </ThemedText>
                  <ThemedTextInput 
                    value={ contaSelecionada?.text }
                    onPress={ () => {
                      Keyboard.dismiss();
                      openLookUpContas();
                    }} 
                    showSoftInputOnFocus={false}
                    style={{borderColor: 'red'}}
                  />
                </View>


                <View style={{flex: 1}}>
                  <ThemedText> Data </ThemedText>
                  <ThemedTextInput
                    value={formulario.DATA.toLocaleDateString()}
                    onPress={ () => {
                      setExibeDatePicker(true);
                    }}
                    showSoftInputOnFocus={false}
                    style={{borderColor: 'red'}}
                  />
                </View>
              </View>           

              <ThemedText> Descrição </ThemedText>
              <ThemedTextInput 
                value={formulario.DESCRICAO.toString()}
                onChangeText={ (novaDesc => setFomulario( (prev) => ({...prev, DESCRICAO: novaDesc}) )) }
                style={{marginBottom: 7, height: 100, borderColor: 'red'}}
                multiline
              />

              <ThemedButton 
                style={{alignItems: 'center', marginTop: 10, borderColor: 'red'}} 
                text='Cadastrar'
                onPress={handleCadastrar}
              />

            {contas && exibeLookUpContas &&
              <LookUpComboBox 
                children 
                dataList={contas} 
                sheetRef={sheetRefConta} 
                selectedValue={setContaSelecionada} 
                title='Contas'
              /> 
            }

            {categorias && exibeLookUpCategorias &&
              <LookUpComboBox 
                children 
                dataList={categorias} 
                sheetRef={sheetRefCategoria} 
                selectedValue={setCategoriaSelecionada} 
                title='Contas'
              /> 
            }            

            {exibeDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={formulario.DATA}
                mode='date'
                onChange={selecionaData}
              />
            )}

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

