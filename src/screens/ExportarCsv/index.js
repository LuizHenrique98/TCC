import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import AsyncStorate from '@react-native-async-storage/async-storage';

export default function ExportarCSV() {
  const [listData, setListaData] = useState([]);

  useEffect(() => {
    handleData();
  }, []);

  async function handleData() {
    const response = await AsyncStorate.getItem('@savePulverizador:data');
    const responseData = response ? JSON.parse(response) : [];

    setListaData(responseData);
    console.log(responseData);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text>Lista</Text>
      <FlatList
        ListEmptyComponent={
          <Text style={{color: 'black', fontSize: 20}}>
            Nenhuma amostra cadastrada {'\n'} Clique no botão "Inserir" para
            cadastrar
          </Text>
        }
        data={listData}
        keyExtractor={item => item.Distancia}
        style={styles.lista}
        renderItem={({item}) => (
          <View style={styles.boxButtonLista}>
            <TouchableOpacity style={styles.buttonLista}>
              <Text style={styles.textoLista}>
                {' '}
                Distancia: {item.Distancia}{' '}
              </Text>
              <Text style={styles.textoLista}>
                {' '}
                Temperatura {item.Temperatura}{' '}
              </Text>
              <Text style={styles.textoLista}> Umidade {item.Umidade} </Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Text>tteste</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  boxCabecalho: {
    alignItems: 'center',
    margin: '3%',
    marginBottom: '1%',
  },
  texto: {
    fontSize: 25,
    color: 'black',
    fontWeight: 'bold',
  },
  lista: {
    width: '100%',
    backgroundColor: '#C0C0C0',
    borderRadius: 5,
    margin: '2%',
    padding: '3%',
    marginBottom: '5%',
    height: '75%',
  },
  textoLista: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    height: 50,
    marginTop: 10,
    marginLeft: 10,
  },
  buttonLista: {
    backgroundColor: 'white',
    marginTop: '3%',
    borderRadius: 10,
    width: '100%',
    marginBottom: '5%',
  },
  button: {
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: 40,
    width: '90%',
  },
  texoButton: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  boxButtonLista: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },

  buttonRemove: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    position: 'absolute',
    marginLeft: '85%',
  },
  buttonTeste: {
    alignItems: 'center',
    backgroundColor: 'green',
    justifyContent: 'center',
    borderRadius: 10,
    height: 40,
    width: '42%',
    marginTop: '2%',
  },
});
