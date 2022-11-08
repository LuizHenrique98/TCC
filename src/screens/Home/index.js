import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

import AsyncStorate from '@react-native-async-storage/async-storage';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';
import Bluetooth from 'react-native-bluetooth-serial-next';

import BluetoothRead from '../../components/BluetoothRead';

export default function Home() {
  const [listaAmostra, setListaAmostra] = useState([]);
  const [idAmostraSelecionada, setIdAmostraSelecionada] = useState(null);
  const [intervaloColeta, setInvervaloColeta] = useState(0);
  const [alturaIdeal, setAlturaIdeal] = useState(0);
  const [umidadeIdeal, setUmidadeIdeal] = useState(0);
  const [temperaturaIdeal, setTemperaturaIdeal] = useState(0);
  const [enable, setEnable] = useState(false);
  const [stopRead, setStopRead] = useState(false);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);

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
      setAlturaIdeal(amostra[0].altura);
      setTemperaturaIdeal(amostra[0].temperatura);
      setUmidadeIdeal(amostra[0].umidade);
    }
  }, [idAmostraSelecionada]);

  useEffect(() => {
    async function verificaConexao() {
      const conectado = await Bluetooth.isConnected();

      setButtonsDisabled(!conectado);
    }
    verificaConexao();
  }, []);

  async function handleData() {
    const response = await AsyncStorate.getItem('@savePulverizador:amostra');

    const responseData = response ? await JSON.parse(response) : [];

    setListaAmostra(responseData);
  }

  function handleStopRead() {
    setEnable(false);
    setStopRead(true);
    //
  }

  function handleRead() {
    setStopRead(false);
    setEnable(true);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.boxCabecalho}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.texto}> Amostra </Text>

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
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.texto}>Coleta de dados em segundos:</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={text => setInvervaloColeta(text)}
              value={intervaloColeta}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.boxContainer}>
          <Text style={styles.texto2}>Altura ideal: {alturaIdeal}M </Text>
          <Text style={styles.texto2}>
            Temperatura ideal: {temperaturaIdeal}°C
          </Text>
          <Text style={styles.texto2}>
            Umidade do Ar ideal: {umidadeIdeal}%
          </Text>
        </View>

        {enable && (
          <BluetoothRead
            amostra={idAmostraSelecionada}
            intervalo={intervaloColeta}
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
          style={styles.button}
          onPress={handleRead}
          disabled={buttonsDisabled}>
          <Text style={styles.textButton}>Iniciar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleStopRead}
          disabled={buttonsDisabled}>
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
        <TouchableOpacity style={styles.button} onPress={handleStopRead}>
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  boxCultivo: {
    flexDirection: 'row',
    width: '50%',
  },
  texto: {
    fontSize: 20,
    padding: 6,
    width: '60%',
    color: 'black',
    fontWeight: 'bold',
  },
  picker: {
    width: '40%',
    color: 'black',
    fontWeight: 'bold',
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
});
