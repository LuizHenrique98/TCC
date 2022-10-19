import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  PermissionsAndroid,
  FlatList,
  LogBox,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import {BleManager} from 'react-native-ble-plx';

import base64 from 'react-native-base64';

LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

const bleManager = new BleManager();
export default function Conection() {
  const navigation = useNavigation();

  const [conected, setConected] = useState(false);
  const [listDevices, setListDevices] = useState();

  async function scanDevices() {
    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ).then(result => {
      if (!result) {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        );
      } else {
        console.log('oioioi');
        // display the Activityindicator

        bleManager.startDeviceScan(null, null, (error, scannedDevice) => {
          if (error) {
            console.log('erro');
            console.warn(error);
            return;
          }

          // bleManager.stopDeviceScan();
          console.log('teste');
          connectDevice(scannedDevice);
        });

        // stop scanning devices after 5 seconds
        setTimeout(() => {
          bleManager.stopDeviceScan();
        }, 10);
      }
    });
  }

  async function connectDevice(device) {
    console.log('connecting to Device:', device.name);

    device
      .connect()
      .then(device => {
        setListDevices(device);
        setConected(true);
        return device.discoverAllServicesAndCharacteristics();
      })
      .then(device => {
        //  Set what to do when DC is detected
        bleManager.onDeviceDisconnected(device.id, (error, device) => {
          console.log('Device DC');
          setConected(false);
        });

        //Read inital values

        //Message
        device
          .readCharacteristicForService(SERVICE_UUID, MESSAGE_UUID)
          .then(valenc => {
            setMessage(base64.decode(valenc?.value));
          });

        //BoxValue
        device
          .readCharacteristicForService(SERVICE_UUID, BOX_UUID)
          .then(valenc => {
            setBoxValue(StringToBool(base64.decode(valenc?.value)));
          });

        //monitor values and tell what to do when receiving an update

        //Message
        device.monitorCharacteristicForService(
          SERVICE_UUID,
          MESSAGE_UUID,
          (error, characteristic) => {
            if (characteristic?.value != null) {
              setMessage(base64.decode(characteristic?.value));
              console.log(
                'Message update received: ',
                base64.decode(characteristic?.value),
              );
            }
          },
          'messagetransaction',
        );

        //BoxValue
        device.monitorCharacteristicForService(
          SERVICE_UUID,
          BOX_UUID,
          (error, characteristic) => {
            if (characteristic?.value != null) {
              setBoxValue(StringToBool(base64.decode(characteristic?.value)));
              console.log(
                'Box Value update received: ',
                base64.decode(characteristic?.value),
              );
            }
          },
          'boxtransaction',
        );

        console.log('Connection established');
      });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Buscar dispositivos</Text>
        <TouchableOpacity onPress={scanDevices}>
          <Text style={styles.emoji}>🔎</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.text}>Lista de dispositivos</Text>
      {conected && (
        <FlatList
          data={listDevices}
          keyExtractor={device => device.name}
          renderItem={({item}) => <Text>{item.name} teste</Text>}
        />
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Home')}>
        <Text>Próximo</Text>
      </TouchableOpacity>
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
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    color: '#000',
  },
  emoji: {
    fontSize: 20,
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
  text: {},
});
