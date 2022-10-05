import React, {useState, useCallback} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

export default function Configuracao() {
  const navigation = useNavigation();
  const [data, setData] = useState([]);

  const {getItem, setItem} = useAsyncStorage('@savePulverizador:cultivo');

  useFocusEffect(
    useCallback(() => {
      handleData();
    }, []),
  );

  async function handleData() {
    const response = await getItem();

    //  const response = await AsyncStorage.removeItem('@savePulverizador:cultivo');
    const responseData = response ? JSON.parse(response) : [];

    setData(responseData);
    console.log(responseData);
  }

  async function handleRemove(id) {
    const response = await getItem();
    const previousData = response ? JSON.parse(response) : [];

    const data = previousData.filter(item => item.cultivo !== id);

    setItem(JSON.stringify(data));
    setData(data);
    console.log(data);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.boxCabecalho}>
        <Text style={styles.texto}>Cultivos cadastrados</Text>
        <FlatList
          data={data}
          keyExtractor={item => String(item.cultivo)}
          style={styles.lista}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => handleRemove(item.cultivo)}>
              <Text style={styles.textoLista}> {item.cultivo} </Text>
            </TouchableOpacity>
          )}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate('CadastroCultivo')}>
          <Text>Inserir</Text>
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
    alignItems: 'center',
    margin: 10,
  },
  texto: {
    fontSize: 25,
    color: 'black',
    fontWeight: 'bold',
  },
  lista: {
    width: '100%',
    backgroundColor: '#C0C0C0',
    borderRadius: 10,
    margin: 25,
    padding: 15,
  },
  textoLista: {
    fontSize: 20,
    marginVertical: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
});
