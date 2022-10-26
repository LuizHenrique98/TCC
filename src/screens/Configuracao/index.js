import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Configuracao() {
  const navigation = useNavigation();
  const [data, setData] = useState([]);

  const {getItem, setItem} = useAsyncStorage('@savePulverizador:amostra');

  useFocusEffect(
    useCallback(() => {
      handleData();
    }, []),
  );

  async function handleData() {
    const response = await getItem();

    const responseData = response ? JSON.parse(response) : [];

    setData(responseData);
  }

  async function handleRemove(id) {
    const response = await getItem();
    const previousData = response ? JSON.parse(response) : [];

    const data = previousData.filter(item => item.id !== id);

    setItem(JSON.stringify(data));
    setData(data);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.boxCabecalho}>
        <Text style={styles.texto}>Amostras cadastradas</Text>

        {data.length > 0 && (
          <FlatList
            data={data}
            keyExtractor={item => item.id}
            style={styles.lista}
            renderItem={({item}) => (
              <View style={styles.boxButtonLista}>
                <TouchableOpacity style={styles.buttonLista}>
                  <Text style={styles.textoLista}> {item.amostra} </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.buttonRemove}
                  onPress={() => handleRemove(item.id)}>
                  <Icon name="trash-o" size={30} />
                </TouchableOpacity>
              </View>
            )}
          />
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('CadastroAmostra')}>
          <Text style={styles.texoButton}>Inserir</Text>
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
    borderRadius: 5,
    margin: 10,
    padding: 15,
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
    marginTop: 20,
    borderRadius: 10,
    width: '100%',
    justifyContent: 'center',
  },
  button: {
    marginVertical: 30,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: 40,
    width: '100%',
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
    height: 60,
    borderRadius: 10,
    position: 'absolute',
    marginLeft: '85%',
    paddingTop: 10,
  },
});
