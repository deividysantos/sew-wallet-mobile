import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState, useRef, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, Keyboard, Alert, Switch, TextInput  } from 'react-native';
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
import { ParametroRepository } from '@/repositories/ParametroRepository';
import { formatCurrency } from '@/utils/currency';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

export type LancamentosCreateModal = {
  visible: boolean,
  setVisible: (e:boolean) => void,
  onClose: () => void
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

export default function LancamentosCreateModal( { visible, setVisible, onClose } : LancamentosCreateModal ) {

  const parametroRepository = new ParametroRepository;

  const inputValor = useRef<TextInput>(null);
  const inputDescricao = useRef<TextInput>(null);

  function Close(){
    setVisible(false); 
    setTipoLancamento('');
    setExibeLookUpContas(false);
    setContaSelecionada(null);
    setFomulario(LancamentoZerado);
    setExibeLookUpCategorias(false);
    setCategoriaSelecionada(null);
    setValorString('0');
    onClose();
  }

  const router = useRouter();
  const { user } = useAuth();

  const text = useThemeColor({}, 'text');
  const backgroundSoft = useThemeColor({}, 'backgroundSoft');
  const backgroundHard = useThemeColor({}, 'backgroundHard');
  const primaryColor = useThemeColor({}, 'primary');
  const redColor = useThemeColor({}, 'red');
  const grennColor = useThemeColor({}, 'green');

  const [tipoLancamento, setTipoLancamento] = useState('');
  useEffect(() => {
    if (tipoLancamento === ''){
      return;
    }      

    CarregaContas();
    CarregaCategorias();
  }, [tipoLancamento]);

  const [ formulario, setFomulario ] = useState<Lancamento>(LancamentoZerado);
  const [ valorString, setValorString ] = useState<string>('0');

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

  async function handleCadastrar(){const lancamentoRepository = new LancamentoRepository;

    if (inputValor.current && inputValor.current.isFocused() ) {
      inputDescricao.current?.focus();
      return
    }
    
    const gerarLancamento = async () => {
      try {
        await lancamentoRepository.createLancamento(formulario);
      } catch (e: any) {
        Alert.alert('Erro ao gravar lançamento!', e.message);
        return;
      }
      
      Close();
    }    

    if (tipoLancamento == 'D'){
      const usaAvisoPorCategoria = await parametroRepository.getParametro(user.USUARIO_ID, 'aviso_gasto_categoria')

      if (usaAvisoPorCategoria == 'S') {
        const valorMedio = await lancamentoRepository.getMediaPorCategoria(user.USUARIO_ID, formulario.CATEGORIA_ID)
      
        if ((formulario.VALOR > (valorMedio + (valorMedio * 0.2)))  && (valorMedio > 0)) {
          Alert.alert('Alerta de valor do lançamento!', 
                      'Valor do lançamento atual ultrapassa o valor da média da categoria, deseja continuar?', 
                      [
                        {
                          text: 'Sim', 
                          style: 'default', 
                          onPress: () => { gerarLancamento() }
                        }, 
                        {
                          text: 'Não', 
                          style: 'cancel'
                        }
                      ])
          return;
        }  
      }
    }

    gerarLancamento()
  }

  function handleExitValue(){
    
    let formattedText = valorString.replace('.', '').replace(',','.').replace(/[^0-9.]/g, '');
    if ((formattedText.match(/\./g) || []).length > 1) {
      formattedText = formattedText.slice(0, -1);
    }

    const formattedNumber = parseFloat(formattedText)

    if (!isNaN(formattedNumber)){
      setValorString( formatCurrency(formattedNumber, 'BRL') )
      setFomulario( (prev) => ({...prev, VALOR: formattedNumber}) )
    } else {
      setValorString('0');
      setFomulario( (prev) => ({...prev, VALOR: 0}) )
    }
    
  }
  
  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={visible}
    >
      <GestureHandlerRootView>
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
              <TouchableOpacity  style={[styles.receber, {backgroundColor: backgroundSoft, borderColor: grennColor, borderTopWidth: 2}]} activeOpacity={1}>
                
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <ThemedView style={{flexDirection: 'row', justifyContent: 'space-between' }}>
                    <ThemedText type='subtitle' style={{marginBottom: 10}}> Receita </ThemedText>
                    <Switch 
                      style={{height: 30}}
                      trackColor={{false: '#ccc', true: primaryColor}}
                      thumbColor={ formulario.EFETIVADA == 'S' ? primaryColor : '#ccc' }
                      onChange={() => {
                        setFomulario( (prev) => ( {...prev, EFETIVADA: formulario.EFETIVADA == 'S' ? 'N' : 'S'} ) )
                      }}
                      value={ formulario.EFETIVADA == 'S' }
                    />
                  </ThemedView>
                  <TouchableOpacity
                    onPress={() => { Close() }}
                  >
                    <Ionicons size={40} name="close" style={{ color: text }} />
                  </TouchableOpacity>
                  
                </View>

                <ThemedText> Título </ThemedText>
                <ThemedTextInput 
                  style={{marginBottom: 7,borderColor: backgroundHard, borderWidth: 2}} 
                  value={formulario.TITULO}
                  onChangeText={ (novoTitulo => setFomulario( (prev) => ({...prev, TITULO: novoTitulo}) ) ) }
                />

                <View style={{flexDirection: 'row', gap: 10, marginBottom: 7}}>
                  <View style={{flex: 1}}>
                    <ThemedText >Valor</ThemedText>  
                    <ThemedTextInput 
                      keyboardType = 'numeric'
                      style={{marginBottom: 7,borderColor: backgroundHard, borderWidth: 2}}
                      value={ valorString }
                      onChangeText={ (value) => setValorString(value) }
                      onBlur={ handleExitValue }
                      ref={inputValor}
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
                      style={{borderColor: backgroundHard, borderWidth: 2}}
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
                      style={{borderColor: backgroundHard, borderWidth: 2}}
                    />
                  </View>


                  <View style={{flex: 1}}>
                    <ThemedText> Data </ThemedText>
                    <ThemedTextInput
                      value={formulario.DATA.toLocaleDateString('pt-br')}
                      onPress={ () => {
                        setExibeDatePicker(true);
                      }}
                      showSoftInputOnFocus={false}
                      style={{borderColor: backgroundHard, borderWidth: 2}}
                    />
                  </View>
                </View>

                <ThemedText> Descrição </ThemedText>
                <ThemedTextInput 
                  value={formulario.DESCRICAO.toString()}
                  onChangeText={ (novaDesc => setFomulario( (prev) => ({...prev, DESCRICAO: novaDesc}) )) }
                  style={{marginBottom: 7, height: 100, borderColor: backgroundHard, borderWidth: 2}} 
                  multiline
                  ref={inputDescricao}
                />

                <ThemedButton 
                  style={{alignItems: 'center', marginTop: 10, borderColor: backgroundHard, borderWidth: 2, backgroundColor: backgroundHard}} 
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
              <TouchableOpacity  style={[styles.receber, {backgroundColor: backgroundSoft, borderColor: redColor, borderTopWidth: 2}]} activeOpacity={1}>
                
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                  <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
                    <ThemedText type='subtitle' style={{marginBottom: 10,}}> Despesa </ThemedText>
                    <Switch 
                        style={{height: 30}}
                        trackColor={{false: '#ccc', true: primaryColor}}
                        thumbColor={ formulario.EFETIVADA == 'S' ? primaryColor : '#ccc' }
                        onChange={() => {
                          setFomulario( (prev) => ( {...prev, EFETIVADA: formulario.EFETIVADA == 'S' ? 'N' : 'S'} ) )
                        }}
                        value={ formulario.EFETIVADA == 'S' }
                      />
                  </ThemedView>
                  <TouchableOpacity
                    onPress={() => { Close() }}
                  >
                    <Ionicons size={40} name="close" style={{ color: text }} />
                  </TouchableOpacity>
                  
                </View>

                <ThemedText> Título </ThemedText>
                <ThemedTextInput 
                  style={{marginBottom: 7, borderColor: backgroundHard, borderWidth: 2}} 
                  value={formulario.TITULO}
                  onChangeText={ (novoTitulo => setFomulario( (prev) => ({...prev, TITULO: novoTitulo}) ) ) }
                />

                <View style={{flexDirection: 'row', gap: 10, marginBottom: 7}}>
                  <View style={{flex: 1}}>
                    <ThemedText >Valor</ThemedText>  
                    <ThemedTextInput 
                      keyboardType = 'numeric'
                      style={{marginBottom: 7, borderColor: backgroundHard, borderWidth: 2}}
                      value={ valorString }
                      onChangeText={ (value) => setValorString(value) }
                      onBlur={ handleExitValue }
                      ref={inputValor}
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
                      style={{borderColor: backgroundHard, borderWidth: 2}}
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
                      style={{borderColor: backgroundHard, borderWidth: 2}}
                    />
                  </View>


                  <View style={{flex: 1}}>
                    <ThemedText> Data </ThemedText>
                    <ThemedTextInput
                      value={formulario.DATA.toLocaleDateString('pt-br')}
                      onPress={ () => {
                        setExibeDatePicker(true);
                      }}
                      showSoftInputOnFocus={false}
                      style={{borderColor: backgroundHard, borderWidth: 2}}
                    />
                  </View>
                </View>           

                <ThemedText> Descrição </ThemedText>
                <ThemedTextInput 
                  value={formulario.DESCRICAO.toString()}
                  onChangeText={ (novaDesc => setFomulario( (prev) => ({...prev, DESCRICAO: novaDesc}) )) }
                  style={{marginBottom: 7, height: 100, borderColor: backgroundHard, borderWidth: 2}}
                  multiline
                  ref={inputDescricao}
                />

                <ThemedButton 
                  style={{alignItems: 'center', marginTop: 10, borderColor: backgroundHard, borderWidth: 2, backgroundColor: backgroundHard}} 
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
      </GestureHandlerRootView>
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
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
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
