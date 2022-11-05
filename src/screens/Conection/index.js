import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  PermissionsAndroid,
  FlatList,
  Alert,
  ToastAndroid,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import Bluetooth from 'react-native-bluetooth-serial-next';

export default function Conection() {
  const navigation = useNavigation();

  const [listaDevicesPareados, setListaDevicesPareados] = useState([]);

  useEffect(() => {
    async function init() {
      try {
        PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ).then(result => {
          if (!result) {
            PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            );
          }
        });
      } catch (error) {
        console.log(error);
        Alert.alert('Ops... Parece que algo deu errado :(');
      }
    }
    init();
  }, []);

  async function handleProcurarDispositivos() {
    try {
      var granted;
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ).then(result => {
        if (!result) {
          granted = PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          );
        }
      });

      if (granted !== PermissionsAndroid.RESULTS.granted) {
        return;
      }
      await Bluetooth.requestEnable();

      const enabled = await Bluetooth.isEnabled();

      if (enabled && granted === PermissionsAndroid.RESULTS.granted) {
        const devicesPareados = await Bluetooth.list();
        setListaDevicesPareados(devicesPareados);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Ops... Algo deu errado, verifique as permissões do APP!');
    }
  }

  async function handleConectar(deviceId) {
    try {
      await Bluetooth.connect(deviceId);

      const conectado = await Bluetooth.isConnected();

      if (conectado) {
        ToastAndroid.showWithGravity(
          'Conectado com sucesso!',
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
        );
        navigation.navigate('Home');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Ops... Algo deu errado ao se conectar com o dispositivo');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lista de dispositivos pareados</Text>
        <TouchableOpacity onPress={handleProcurarDispositivos}>
          <Icon
            name="refresh-ccw"
            size={20}
            color={'black'}
            style={styles.emoji}
          />
        </TouchableOpacity>
      </View>
      <Text
        style={{
          marginTop: '3%',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'black',
        }}>
        Clique no botão para exibir {'\n'} os dispositivos pareados
      </Text>
      {listaDevicesPareados.length > 0 && (
        <FlatList
          style={styles.lista}
          data={listaDevicesPareados}
          keyExtractor={device => device.id}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                style={styles.buttonLista}
                onPress={() => handleConectar(item.id)}>
                <Text style={styles.textoLista}>{item.name}</Text>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '3%',
  },
  title: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  emoji: {
    fontSize: 25,
    color: 'green',
    marginLeft: 15,
  },
  button: {
    backgroundColor: 'green',
    height: 20,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    marginTop: 100,
    marginLeft: 150,
  },
  text: {
    fontSize: 15,
    color: 'black',
  },
  lista: {
    width: '90%',
    backgroundColor: '#C0C0C0',
    borderRadius: 6,
    marginTop: '3%',
    marginBottom: '5%',
    padding: '2%',
  },
  textoLista: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    height: 50,
    marginTop: '5%',
    marginLeft: '5%',
  },
  buttonLista: {
    backgroundColor: 'white',
    marginVertical: '4%',
    marginHorizontal: '2%',
    borderRadius: 10,
    justifyContent: 'center',
  },
});
