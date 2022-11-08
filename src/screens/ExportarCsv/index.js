import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  Alert,
} from 'react-native';

import AsyncStorate from '@react-native-async-storage/async-storage';
import {jsonToCSV} from 'react-native-csv';
import * as RNFS from 'react-native-fs';

export default function ExportarCSV() {
  const [listaAmostra, setListaAmostra] = useState([]);

  useEffect(() => {
    handleData();
  }, []);

  async function handleData() {
    try {
      const response = await AsyncStorate.getItem('@savePulverizador:amostra');

      const responseData = response ? JSON.parse(response) : [];

      setListaAmostra(responseData);
    } catch (error) {
      console.log(error);
      Alert.alert('Ops...', 'Parece que algo deu errado, tente novamente!');
    }
  }

  async function gerarCsv(id, amostra) {
    try {
      var granted;
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ).then(result => {
        if (!result) {
          granted = PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          );
        }
      });

      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ).then(result => {
        if (!result) {
          granted = PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          );
        }
      });

      if (granted !== PermissionsAndroid.RESULTS.granted) {
        return;
      }

      const response = await AsyncStorate.getItem(
        `@savePulverizador:dataIdAmostra${id}`,
      );

      const responseData = response ? await JSON.parse(response) : [];

      const data = await responseData.filter(item => item.idAmostra == id);

      const dataCadastro = await AsyncStorate.getItem(
        '@savePulverizador:amostra',
      );
      const dataCadastroResponse = dataCadastro
        ? await JSON.parse(dataCadastro)
        : [];

      const dataCadastroFiltro = dataCadastroResponse.filter(
        item => item.id == id,
      );

      const dataSave = [...data, ...dataCadastroFiltro];

      const results = jsonToCSV(dataSave);
      console.log(dataSave);

      var path =
        RNFS.DownloadDirectoryPath + `DadosAmostra_${id}_${amostra}.csv`;

      RNFS.writeFile(path, results, 'utf8')
        .then(success => {
          Alert.alert('Sucesso!', 'Dados salvos em: ' + path);
        })
        .catch(err => {
          console.log(err.message);
          Alert.alert('Ops...', 'Algo deu errado ao salvar o arquivo!');
        });
    } catch (error) {
      console.log(error);
      Alert.alert('Ops...', 'Algo deu errado!');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.texto}>Lista de amostras</Text>
      <FlatList
        ListEmptyComponent={
          <Text style={{color: 'black', fontSize: 20}}>
            Nenhuma amostra cadastrada
          </Text>
        }
        data={listaAmostra}
        keyExtractor={item => item.id}
        style={styles.lista}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.buttonLista}
            onPress={() => gerarCsv(item.id, item.amostra)}>
            <Text style={styles.textoLista}> {item.amostra} </Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  lista: {
    width: '95%',
    backgroundColor: '#C0C0C0',
    borderRadius: 5,
    margin: '3%',
    padding: '3%',
    marginBottom: '5%',
  },
  buttonLista: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '100%',
    marginBottom: '5%',
    alignItems: 'flex-start',
  },
  textoLista: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    height: 40,
    marginTop: 10,
    marginLeft: 10,
  },
  texto: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    marginTop: '2%',
  },
});
