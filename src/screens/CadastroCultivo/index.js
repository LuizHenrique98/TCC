import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ToastAndroid,
} from 'react-native';

import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

export default function CadastroCultivo(param) {
  // const [data, setData] = useState([]);
  const [cultivo, setCultivo] = useState('');
  const [altura, setAltura] = useState(0);
  const [temperatura, setTemperatura] = useState(0);
  const [umidade, setUmidade] = useState(0);

  const {getItem, setItem} = useAsyncStorage('@savePulverizador:cultivo');

  /* useEffect(() => {
    handleData();
  }, []);

  async function handleData() {
    const response = await AsyncStorage.getItem('@savePulverizador:cultivo');
    setData(data);
  }*/

  async function handleSalvar() {
    if (
      cultivo.length == 0 ||
      altura <= 0 ||
      temperatura <= 0 ||
      umidade <= 0
    ) {
      ToastAndroid.showWithGravity(
        'Por favor preencha todos os campos.',
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
      );
    } else {
      try {
        const id = uuid.v4;

        const newData = {
          id,
          cultivo,
          altura,
          temperatura,
          umidade,
        };

        const response = await getItem();

        const responseData = response ? JSON.parse(response) : [];

        const data = [...responseData, newData];

        await setItem(JSON.stringify(data));
        console.log(data);

        ToastAndroid.showWithGravity(
          'Dados salvos com sucesso!',
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
        );
      } catch (error) {
        ToastAndroid.showWithGravity(
          'Ops....Não foi possível cadastrar. Tente novamente',
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
        );
        console.log(error);
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.boxCadastro}>
          <Text style={styles.texto}>Cultivo</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={text => setCultivo(text)}
            value={cultivo}
          />

          <Text style={styles.texto}>Altura ideal</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={text => setAltura(text)}
            value={altura}
            keyboardType="numeric"
          />

          <Text style={styles.texto}>Temperatura máxima recomendada</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={text => setTemperatura(text)}
            value={temperatura}
            keyboardType="numeric"
          />

          <Text style={styles.texto}>Umidade máxima recomendada</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={text => setUmidade(text)}
            value={umidade}
            keyboardType="numeric"
          />

          <TouchableOpacity style={styles.button} onPress={handleSalvar}>
            <Text style={styles.textoBotao}> Salvar</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  boxCadastro: {
    margin: 25,
    padding: 20,
    backgroundColor: '#C0C0C0',
    borderRadius: 10,
  },
  texto: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  textInput: {
    backgroundColor: 'white',
    marginVertical: 10,
    borderRadius: 10,
  },
  button: {
    marginVertical: 30,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: 40,
  },
  textoBotao: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});
