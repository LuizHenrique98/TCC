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

  const [conectado, setConectado] = useState(false);
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

    //    device(deviceId);
    // device = await Bluetooth.connect(deviceId);
    //  mydevice.connect();

    // console.log('device' + JSON.stringify(device));

    //const data = await Bluetooth.readOnce();
    // console.log(data);
    /*  await Bluetooth.read((data, subscription) => {
      console.log('aqui');
      console.log('Your data:' + data);
      console.log('teste: ' + subscription);
    });

    console.log(dados);*/

    /*  console.log('teste');
    mydevice.readEvery(
      (data, intervalId) => {
        console.log(data);

        if (this.imBoredNow && intervalId) {
          clearInterval(intervalId);
        }
      },
      5000,
      '\r\n',
    );*/

    //  const teste = mydevice.readFromDevice();
    //  console.log(teste);
    //   mydevice.readOnce;
    // mydevice.readUntilDelimiter
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
      <FlatList
        style={styles.lista}
        data={listaDevicesPareados}
        keyExtractor={device => device.id}
        ListEmptyComponent={
          <Text
            style={{
              marginTop: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            Clique no botão para exibir {'\n'} os dispositivos pareados
          </Text>
        }
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
    margin: 20,
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
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 30,
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
});
