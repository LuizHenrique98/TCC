import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Alert,
  FlatList,
  StyleSheet,
  ToastAndroid,
  SafeAreaView,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import Bluetooth from 'react-native-bluetooth-serial-next';
import LoadingModal from '../../components/LoadingModal';

export default function Conection() {
  const navigation = useNavigation();

  const [listaDevicesPareados, setListaDevicesPareados] = useState([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deviceIdconnected, setDeviceIdconnected] = useState('');

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

  async function handleListarDispositivos() {
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
      await Bluetooth.requestEnable();
      const enabled = await Bluetooth.isEnabled();
      const deviceConnected = await Bluetooth.isConnected();

      console.log('Enabled: ' + enabled + ' Conectado: ' + deviceConnected);

      if (enabled && deviceConnected) {
        if (deviceId != deviceIdconnected) {
          Alert.alert(
            'Atenção!',
            'Clique no dispositivo já conectado para avançar',
          );
          return;
        }

        Alert.alert('Informação', 'Dispositivo já conectado.');
        setConnected(true);
        setDeviceIdconnected(deviceId);
        navigation.navigate('Home');
        return;
      }

      setLoading(true);
      await Bluetooth.connect(deviceId);
      console.log('tá cehgnado aqui ');
      const conectado = await Bluetooth.isConnected();

      if (conectado) {
        ToastAndroid.showWithGravity(
          'Conectado com sucesso!',
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
        );
        setConnected(true);
        setDeviceIdconnected(deviceId);
        setLoading(false);

        navigation.navigate('Home');
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setConnected(false);
      setDeviceIdconnected('');
      Alert.alert('Ops... Algo deu errado ao se conectar com o dispositivo');
    }
  }

  async function handleDesconectar() {
    try {
      Alert.alert('Alerta!', 'Dispositivo desconectado');
      await Bluetooth.disconnectAll();
      setConnected(false);
      setDeviceIdconnected('');
    } catch (error) {
      console.log(error);
      Alert.alert('Ops...', 'Algo deu errado ao tentar desconectar.');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          disabled={connected}
          style={[styles.button, connected && {backgroundColor: 'grey'}]}
          onPress={() => navigation.navigate('Home')}>
          <Text style={styles.textButton}>Avançar sem conectar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={handleListarDispositivos}>
          <Text style={styles.textButton}> Listar dispositivos pareados </Text>
        </TouchableOpacity>
      </View>

      {listaDevicesPareados.length > 0 && (
        <FlatList
          style={styles.listDevices}
          data={listaDevicesPareados}
          keyExtractor={device => device.id}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                style={[
                  styles.buttonList,
                  connected &&
                    deviceIdconnected == item.id && {
                      backgroundColor: '#90ee90',
                    },
                ]}
                onLongPress={handleDesconectar}
                onPress={() => handleConectar(item.id)}>
                <Text style={styles.textoLista}>{item.name}</Text>
              </TouchableOpacity>
            );
          }}
        />
      )}
      {loading && <LoadingModal text="Conectando" />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '3%',
  },
  button: {
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    marginVertical: '3%',
    width: 300,
    height: 40,
  },
  textButton: {
    fontSize: 20,
    color: 'white',
  },
  listDevices: {
    width: '90%',
    backgroundColor: '#C0C0C0',
    borderRadius: 6,
    marginTop: '1%',
    marginBottom: '3%',
    padding: '2%',
  },
  buttonList: {
    backgroundColor: 'white',
    marginVertical: '2%',
    marginHorizontal: '2%',
    borderRadius: 10,
    marginBottom: '1%',
  },
  textoLista: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    height: 50,
    padding: '3%',
  },
});
