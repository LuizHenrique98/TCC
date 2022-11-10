import React, {useState, useEffect} from 'react';
import {
  Alert,
  Text,
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

import AsyncStorate from '@react-native-async-storage/async-storage';
import MaskInput, {createNumberMask, Masks} from 'react-native-mask-input';

const numberMask = createNumberMask({
  prefix: [],
  delimiter: '',
  separator: '.',
  precision: 2,
});

export default function CadastroAmostra() {
  const [amostra, setAmostra] = useState('');
  const [altura, setAltura] = useState();
  const [temperatura, setTemperatura] = useState();
  const [umidade, setUmidade] = useState();

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
        var novoId = 0;
        var id = 0;

        const response = await AsyncStorate.getItem(
          '@savePulverizador:amostra',
        );
        const responseData = response ? await JSON.parse(response) : [];

        const responseUltimoId = await AsyncStorate.getItem(
          '@savePulverizador:ultimoId',
        );
        const responseUltimoIdParse = responseUltimoId
          ? await JSON.parse(responseUltimoId)
          : [];

        if (typeof responseUltimoIdParse != 'undefined') {
          novoId = Number(responseUltimoIdParse.ultimoId) + 1;
        } else {
          novoId = 0;
        }

        id = novoId > 0 ? novoId : 0;

        const newData = {
          id,
          amostra,
          altura,
          temperatura,
          umidade,
        };

        const data = [...responseData, newData];
        const newDataId = {ultimoId: id};

        await AsyncStorate.setItem(
          '@savePulverizador:amostra',
          JSON.stringify(data),
        );

        await AsyncStorate.setItem(
          '@savePulverizador:ultimoId',
          JSON.stringify(newDataId),
        );

        Alert.alert('Mensagem', 'Dados gravados com sucesso!');

        setAmostra('');
        setAltura('');
        setTemperatura('');
        setUmidade('');
      } catch (error) {
        console.log(error);
        Alert.alert('Ops...', 'Não foi possível cadastrar. Tente novamente');
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.boxCadastro}>
          <Text style={styles.texto}>Descrição da amostra</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={text => setAmostra(text)}
            value={amostra}
          />
          <Text style={styles.texto}>Altura ideal (M)</Text>
          <MaskInput
            mask={numberMask}
            style={styles.textInput}
            onChangeText={(masked, unMasked) => setAltura(masked)}
            value={altura}
            keyboardType="numeric"
          />
          <Text style={styles.texto}>Temperatura máxima recomendada (°C)</Text>
          <MaskInput
            mask={numberMask}
            style={styles.textInput}
            onChangeText={(masked, unMasked) => setTemperatura(masked)}
            value={temperatura}
            keyboardType="numeric"
          />
          <Text style={styles.texto}>Umidade máxima recomendada (%)</Text>
          <MaskInput
            style={styles.textInput}
            mask={numberMask}
            onChangeText={(masked, unMasked) => setUmidade(masked)}
            value={umidade}
            keyboardType="numeric"
          />
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.button} onPress={handleSalvar}>
        <Text style={styles.textoBotao}> Salvar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  boxCadastro: {
    margin: '2%',
    padding: '5%',
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
    marginVertical: '3%',
    borderRadius: 10,
  },
  button: {
    margin: '3%',
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
