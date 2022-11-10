import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';

import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';
import Bluetooth from 'react-native-bluetooth-serial-next';
import AsyncStorate from '@react-native-async-storage/async-storage';

import BluetoothRead from '../../components/BluetoothRead';

export default function Home() {
  const [listaAmostra, setListaAmostra] = useState([]);
  const [idAmostraSelecionada, setIdAmostraSelecionada] = useState(null);
  const [descAmostra, setDescAmostra] = useState('');
  const [intervaloColeta, setInvervaloColeta] = useState(0);
  const [altura, setAltura] = useState(0);
  const [umidade, setUmidade] = useState(0);
  const [temperatura, setTemperatura] = useState(0);
  const [connected, setConnected] = useState(false);
  const [read, setRead] = useState(false);
  const [buttonIniciarDisabled, setButtonIniciarDisabled] = useState(false);
  const [buttonPararDisabled, setButtonPararDisabled] = useState(false);
  const [intervaloColetaProps, setInvervalorColetaProps] = useState(0);

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      handleData();
    }, []),
  );

  useEffect(() => {
    if (listaAmostra.length > 0) {
      const amostra = listaAmostra.filter(
        item => item.id == idAmostraSelecionada,
      );
      setAltura(amostra[0].altura);
      setTemperatura(amostra[0].temperatura);
      setUmidade(amostra[0].umidade);
      setDescAmostra(amostra[0].amostra);
    }
  }, [idAmostraSelecionada]);

  useEffect(() => {
    async function verificaConexao() {
      const conectado = await Bluetooth.isConnected();

      setConnected(conectado);
      if (conectado) {
        setButtonPararDisabled(true);
        setButtonIniciarDisabled(false);
      } else {
        setButtonIniciarDisabled(true);
        setButtonPararDisabled(true);
      }
    }
    verificaConexao();
  }, []);

  async function handleData() {
    const response = await AsyncStorate.getItem('@savePulverizador:amostra');

    const responseData = response ? await JSON.parse(response) : [];

    setListaAmostra(responseData);
  }

  function handleRead(acao) {
    if (connected) {
      console.log(acao);
      if (acao == 'R') {
        if (
          idAmostraSelecionada === undefined ||
          idAmostraSelecionada === null
        ) {
          Alert.alert('Alerta.', 'Selecione uma amostra');
          return;
        }
        if (intervaloColeta < 1) {
          Alert.alert(
            'Alerta.',
            'Informe um intervalor maior ou igual a 1 segundo',
          );
          return;
        }
        setInvervalorColetaProps(intervaloColeta * 1000);
        setButtonIniciarDisabled(true);
        setButtonPararDisabled(false);
        setRead(true);
      } else {
        setButtonPararDisabled(true);
        setButtonIniciarDisabled(false);
        setRead(false);
      }
    } else {
      Alert.alert('Ops..', 'Parece que você não está conectado');
      return;
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {!read && (
          <View style={styles.boxCabecalho}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.texto}> Amostra: </Text>

              <Picker
                selectedValue={idAmostraSelecionada}
                onValueChange={(itemValue, itemIndex) => {
                  setIdAmostraSelecionada(itemValue);
                }}
                style={styles.picker}>
                {listaAmostra.map(index => {
                  return (
                    <Picker.Item
                      label={index.amostra}
                      value={index.id}
                      key={index.id}
                      style={{fontSize: 20}}
                    />
                  );
                })}
              </Picker>
            </View>
            <View style={styles.itensCabecalho}>
              <Text style={styles.texto}>Tempo em segundos:</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={text => setInvervaloColeta(text)}
                value={intervaloColeta}
                keyboardType="numeric"
              />
            </View>
          </View>
        )}

        <View style={styles.boxContainer}>
          <Text style={styles.texto2}>Parâmetros ideais</Text>
          <Text style={styles.texto2}>Altura: {altura}M </Text>
          <Text style={styles.texto2}>Temperatura: {temperatura}°C</Text>
          <Text style={styles.texto2}>Umidade do Ar: {umidade}%</Text>
        </View>

        {read && (
          <BluetoothRead
            amostra={idAmostraSelecionada}
            descAmostra={descAmostra}
            alturaIdeal={altura}
            temperaturaIdeal={temperatura}
            umidadeIdeal={umidade}
            intervalo={intervaloColetaProps}
          />
        )}
      </ScrollView>

      <View
        style={{
          flexDirection: 'row',
          width: '75%',
          marginHorizontal: '3%',
          marginBottom: '1%',
        }}>
        <TouchableOpacity
          style={[
            styles.button,
            buttonIniciarDisabled && {backgroundColor: 'grey'},
          ]}
          onPress={() => handleRead('R')}
          disabled={buttonIniciarDisabled}>
          <Text style={styles.textButton}>Iniciar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            buttonPararDisabled && {backgroundColor: 'grey'},
          ]}
          onPress={() => handleRead('S')}
          disabled={buttonPararDisabled}>
          <Text style={styles.textButton}>Parar</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          width: '75%',
          marginHorizontal: '3%',
          marginBottom: '3%',
        }}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.textButton}>Gráfico</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ExportarCSV')}>
          <Text style={styles.textButton}>Exportar CSV</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  boxCabecalho: {
    backgroundColor: '#C0C0C0',
    borderRadius: 10,
    marginTop: '3%',
    marginHorizontal: '3%',
    width: '95%',
  },
  boxCultivo: {
    flexDirection: 'row',
    width: '50%',
  },
  texto: {
    fontSize: 20,
    padding: 6,
    //  width: '65%',
    color: 'black',
    fontWeight: 'bold',
    marginBottom: '5%',
    height: 50,
  },
  picker: {
    width: 200,
    color: 'black',
    fontWeight: 'bold',
    //marginRight: '80%',
    //height: ,
  },
  boxSensores: {
    flexDirection: 'row',
  },
  boxContainer: {
    backgroundColor: '#C0C0C0',
    marginTop: '3%',
    marginHorizontal: '3%',
    borderRadius: 10,
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: 40,
    width: '60%',
    marginHorizontal: '1%',
  },
  textButton: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  texto2: {
    fontSize: 20,
    padding: 6,
    width: '100%',
    color: 'black',
    fontWeight: 'bold',
  },
  textInput: {
    backgroundColor: 'white',
    width: 100,
    height: 40,
    borderRadius: 10,
  },
  itensCabecalho: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'center',
  },
});
