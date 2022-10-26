import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Keyboard,
  TextInput,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  ScrollView,
} from 'react-native';

import {useAsyncStorage} from '@react-native-async-storage/async-storage';

export default function CadastroAmostra(param) {
  const [amostra, setAmostra] = useState('');
  const [altura, setAltura] = useState(0);
  const [temperatura, setTemperatura] = useState(0);
  const [umidade, setUmidade] = useState(0);

  const {getItem, setItem} = useAsyncStorage('@savePulverizador:amostra');

  async function handleSalvar() {
    if (
      amostra.length == 0 ||
      altura <= 0 ||
      temperatura <= 0 ||
      umidade <= 0
    ) {
      Alert.alert('Atenção!', 'Todos os campos devem ser preenchidos');
    } else {
      try {
        const response = await getItem();

        const responseData = response ? JSON.parse(response) : [];

        const lastId = responseData.length - 1;

        const id = lastId + 1;

        const newData = {
          id,
          amostra,
          altura,
          temperatura,
          umidade,
        };

        const data = [...responseData, newData];

        await setItem(JSON.stringify(data));

        Alert.alert('Mensagem', 'Dados gravados com sucesso!');

        setAmostra('');
        setAltura(0);
        setTemperatura(0);
        setUmidade(0);
      } catch (error) {
        Alert.alert('Ops...', 'Não foi possível cadastrar. Tente novamente');
      }
    }
  }

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.boxCadastro}>
            <Text style={styles.texto}>Amostra</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={text => setAmostra(text)}
              value={amostra}
            />
            <Text style={styles.texto}>Altura ideal (M)</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={text => setAltura(text)}
              value={altura}
              keyboardType="numeric"
            />
            <Text style={styles.texto}>
              Temperatura máxima recomendada (°C)
            </Text>
            <TextInput
              style={styles.textInput}
              onChangeText={text => setTemperatura(text)}
              value={temperatura}
              keyboardType="numeric"
            />
            <Text style={styles.texto}>Umidade máxima recomendada (%)</Text>
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
    </ScrollView>
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
