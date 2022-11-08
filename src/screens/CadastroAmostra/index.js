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

export default function CadastroAmostra() {
  const [amostra, setAmostra] = useState('');
  const [altura, setAltura] = useState(0);
  const [temperatura, setTemperatura] = useState(0);
  const [umidade, setUmidade] = useState(0);

  useEffect(() => {
    Alert.alert(
      'Atenção!',
      'Separar números decimais com ponto. Exemplo: (30.15)',
    );
  }, []);

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
        setAltura(0);
        setTemperatura(0);
        setUmidade(0);
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
            keyboardType="phone-pad"
          />
          <Text style={styles.texto}>Temperatura máxima recomendada (°C)</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={text => setTemperatura(text)}
            value={temperatura}
            keyboardType="phone-pad"
          />
          <Text style={styles.texto}>Umidade máxima recomendada (%)</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={text => setUmidade(text)}
            value={umidade}
            keyboardType="phone-pad"
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
    margin: '3%',
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
    margin: '5%',
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
