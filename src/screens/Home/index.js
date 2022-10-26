import React, {useState, useCallback, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import {Picker} from '@react-native-picker/picker';
import AsyncStorate from '@react-native-async-storage/async-storage';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

export default function Home() {
  const [listaAmostra, setListaAmostra] = useState([]);
  const [amostraSelecionada, setAmostraSelecionada] = useState(0);
  const [intervalo, setInvervalo] = useState(0);
  const [distancia, setDistancia] = useState(0);
  const [umidade, setUmidade] = useState(0);
  const [temperatura, setTemperatura] = useState(0);

  const [ladoEsquerdo, setLadoEsquerdo] = useState(0);
  const [ladoDireito, setLadoDireito] = useState(0);
  const [temperaturaConst, setTemperaturaConst] = useState(0);
  const [umidadeConst, setUmidadeConst] = useState(0);

  var valoresAleatorios;

  //  const {getItem, setItem} = useAsyncStorage('@savePulverizador:cultivo');

  useFocusEffect(
    useCallback(() => {
      handleData();
    }, []),
  );

  /*useEffect(() => {
    handleData();
  }, []);*/

  async function handleData() {
    const response = await AsyncStorate.getItem('@savePulverizador:amostra');

    const responseData = response ? JSON.parse(response) : [];

    setListaAmostra(responseData);
  }

  function handleAtualizaValores(id) {}

  function handleValores() {
    valoresAleatorios = setInterval(() => {
      console.log('passou 3 segundos');
      setLadoEsquerdo(Math.floor(Math.random() * 70));
      setLadoDireito(Math.floor(Math.random() * 70));
      setTemperaturaConst(Math.floor(Math.random() * 100));
      setUmidadeConst(Math.floor(Math.random() * 100));
    }, 3000);
  }

  function handleParar() {
    console.log('pausando loop');
    clearInterval(valoresAleatorios);
  }

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <View style={styles.boxCabecalho}>
          <View style={styles.boxCultivo}>
            <Text style={styles.texto}>Cultivo</Text>
            <Picker
              selectedValue={amostraSelecionada}
              onValueChange={(itemValue, itemIndex) => {
                console.log(listaAmostra);
                console.log('indice cultivo selecionado: ' + itemValue);
                setCultivoSelecionado(itemValue);
                setDistancia(listaAmostra[itemValue].altura);
                setUmidade(listaAmostra[itemValue].umidade);
                setTemperatura(listaAmostra[itemValue].temperatura);
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
          <View style={styles.boxCultivo}>
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
          <View style={styles.boxCultivo}>
            <Text style={styles.texto}> Esquerdo {distancia} </Text>
            <Text style={styles.texto}> Direito {distancia} </Text>
          </View>

          <View style={styles.boxCultivo}>
            <Text style={styles.texto}> {ladoEsquerdo} </Text>
            <Text style={styles.texto}>{ladoDireito} </Text>
          </View>
        </View>

        <View style={[styles.boxContainer, {height: 170}]}>
          <View>
            <Text style={styles.texto}>Temperatura ideal: {temperatura} </Text>
            <Text style={styles.texto}> {temperaturaConst} </Text>
            <Text style={styles.texto}>Umidade do Ar ideal: {umidade} </Text>
            <Text style={styles.texto}> {umidadeConst} </Text>
          </View>
        </View>

        <View style={{flexDirection: 'row', width: '80%'}}>
          <TouchableOpacity style={styles.button} onPress={handleValores}>
            <Text style={styles.textButton}>Iniciar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleParar}>
            <Text style={styles.textButton}>Parar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  boxCabecalho: {
    backgroundColor: '#C0C0C0',
    borderRadius: 10,
    margin: '5%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  boxCultivo: {
    flexDirection: 'row',
  },
  texto: {
    fontSize: 20,
    padding: 10,
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
    margin: '5%',
    borderRadius: 10,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  button: {
    marginVertical: 30,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: 40,
    width: '50%',
    marginLeft: '5%',
  },
  textButton: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});
