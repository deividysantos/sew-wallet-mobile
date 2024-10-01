import { StyleSheet, StatusBar, SafeAreaView, View, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useNavigation, useRouter } from 'expo-router';
import { useEffect, useRef, useCallback, useState } from 'react';
import BottomSheet from "@gorhom/bottom-sheet";
import { useAuth } from '@/contexts/AuthContext';

import { BancoRepository } from '@/repositories/BancoRepository';
import { ContaRepository } from '@/repositories/ContaRespoitory';

import { ThemedText } from '@/components/ThemedText';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { LookUpComboBox, FieldResult } from '@/components/LookUpComboBox';
import { Conta } from '@/types/conta';

export default function ContasScreen() {
  const backgroundHard = useThemeColor({}, 'backgroundHard');
  const backgroundSoft = useThemeColor({}, 'backgroundSoft');
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const text = useThemeColor({}, 'text');

  const router = useRouter();
  const navigation = useNavigation();
  const { user } = useAuth();

  useEffect(() => {
    navigation.setOptions({ title: 'Cadastrar Conta', headerTintColor: text, headerStyle: { backgroundColor: backgroundSoft } })
  }, [navigation])

  const [bancoList, setBancoList] = useState<FieldResult[]|null>(null)
  const [banco, setBanco] = useState<FieldResult>({ text: '', value: '' });
  const [showLookup, setShowLookup] = useState<boolean>(false);
  const sheetRef = useRef<BottomSheet>(null);
  useEffect( () => {
    if (bancoList !== null) 
      return;

    const getDataListPromise = async () => {
      const dataList = (await (new BancoRepository).getAll())?.map((banco) => {
        return {text: banco.NOME, value: banco.BANCO_ID.toString() }
      });

      if (dataList) {
        setBancoList(dataList);
      }
    }

    getDataListPromise();
  }, [bancoList]);
    
  const openLoopUp = useCallback((index: number) => {
    setShowLookup(true);
    sheetRef.current?.expand();
  }, []); 
  
  const [form, setForm] = useState<Conta>({
      BANCO_ID: 0,
      USUARIO_ID: user?.usuario_id,
      NOME: '',
      SALDO_INICIAL: 0,
    });

  const handleCriaConta = async () => {
    console.log('teste');
    
    const conta_id = await (new ContaRepository).createConta(form);

    if (conta_id) {
      router.back();
    }

    console.log(form);
  };

  return (
  
    <SafeAreaView style={[styles.container, { backgroundColor: backgroundHard }]}>
      <StatusBar
          backgroundColor={backgroundHard}
          barStyle={ useThemeColor({}, 'barStyle') == 'dark' ? 'dark-content' : 'light-content'}
          translucent={false}
      />
      

      <View style={{flex: 1, justifyContent: 'space-between'}}>
        <View style={{ gap: 15 }}>    
          <View>
            <ThemedText style={styles.label}>Nome da conta</ThemedText>  
            <ThemedTextInput 
              placeholder='minha conta' 
              value={ form?.NOME }
              onChangeText={ (newValue => setForm( (formAterior) => ({ ...formAterior, NOME: newValue }) )) }/> 
          </View>

          <View>
            <ThemedText style={styles.label}>Banco</ThemedText>  
            <ThemedTextInput 
              placeholder='Selecione' 
              value={ banco.text }
              onPressIn={() => openLoopUp(1)}
              showSoftInputOnFocus={false}
              onChangeText={() => {}}/> 
          </View>

          <View>
            <ThemedText style={styles.label}>Valor Inicial</ThemedText>  
            <ThemedTextInput 
              keyboardType = 'numeric'
              placeholder='Senha' 
              value={ form?.SALDO_INICIAL.toString() }
              onChangeText={ (newValue => setForm( (formAterior) => ({ ...formAterior, SALDO_INICIAL: Number(newValue) }) )) }/> 
          </View>
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          <TouchableOpacity style={[styles.button, styles.buttonCancel]}>
            <ThemedText style={{ color: 'red' }}>
              Cancelar
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.buttonConfirm, { backgroundColor: secondaryColor, borderColor: primaryColor }]}
            onPress={() => handleCriaConta()}
          >
            <ThemedText style={{color: primaryColor}}>
              Cadastrar
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {bancoList && showLookup &&
        <LookUpComboBox children dataList={bancoList} sheetRef={sheetRef} selectedValue={setBanco} /> 
      }
        
    </SafeAreaView>
  
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 25,
      
    },
    label: {
      marginLeft: 5,
      marginBottom: 2
    },
    button: {
      paddingHorizontal: 35,
      paddingVertical: 10,
      borderRadius: 8,
      borderWidth: 1
    },
    buttonConfirm: {      
    },
    buttonCancel:{
      borderColor: 'red',      
    }
    
});
