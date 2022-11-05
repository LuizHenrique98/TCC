import React, {useState, useCallback, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';

import {Picker} from '@react-native-picker/picker';
import AsyncStorate from '@react-native-async-storage/async-storage';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

import BluetoothRead from '../../components/BluetoothRead';

export default function Home() {
  const [listaAmostra, setListaAmostra] = useState([]);
  const [amostraSelecionada, setAmostraSelecionada] = useState(null);
  const [intervalo, setInvervalo] = useState(0);
  const [alturaIdeal, setAlturaIdeal] = useState(0);
  const [umidadeIdeal, setUmidadeIdeal] = useState(0);
  const [temperaturaIdeal, setTemperaturaIdeal] = useState(0);
  const [enable, setEnable] = useState(false);
  const [stopRead, setStopRead] = useState(false);

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      handleData();
    }, []),
  );

  useEffect(() => {
    if (listaAmostra.length > 0) {
      setAlturaIdeal(listaAmostra[amostraSelecionada].altura);
      setTemperaturaIdeal(listaAmostra[amostraSelecionada].temperatura);
      setUmidadeIdeal(listaAmostra[amostraSelecionada].umidade);
    }
  }, [amostraSelecionada]);

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
              selectedValue={amostraSelecionada}
              onValueChange={(itemValue, itemIndex) => {
                setAmostraSelecionada(itemValue);
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
            <Picker
              selectedValue={intervalo}
              onValueChange={(itemValue, itemIndex) => setInvervalo(itemValue)}
              style={styles.picker}>
              <Picker.Item label="0" value={0} key={0} />
              <Picker.Item label="1" value={1} key={1} />
              <Picker.Item label="2" value={2} key={2} />
              <Picker.Item label="3" value={3} key={3} />
              <Picker.Item label="4" value={4} key={4} />
              <Picker.Item label="5" value={5} key={5} />
              <Picker.Item label="10" value={10} key={10} />
              <Picker.Item label="15" value={15} key={15} />
              <Picker.Item label="20" value={20} key={20} />
              <Picker.Item label="25" value={25} key={25} />
              <Picker.Item label="30" value={30} key={30} />
              <Picker.Item label="60" value={60} key={60} />
            </Picker>
          </View>
        </View>

        <View style={styles.boxContainer}>
          <Text style={styles.texto2}>Altura ideal: {alturaIdeal} M </Text>
          <Text style={styles.texto2}>Temp. ideal: {temperaturaIdeal} °C</Text>
          <Text style={styles.texto2}>Umi. do Ar ideal: {umidadeIdeal} %</Text>
        </View>

        {enable && (
          <BluetoothRead amostra={amostraSelecionada} intervalo={intervalo} />
        )}
      </ScrollView>

      <View
        style={{
          flexDirection: 'row',
          width: '75%',
          marginHorizontal: '3%',
          marginBottom: '1%',
        }}>
        <TouchableOpacity style={styles.button} onPress={handleRead}>
          <Text style={styles.textButton}>Iniciar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleStopRead}>
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
});
