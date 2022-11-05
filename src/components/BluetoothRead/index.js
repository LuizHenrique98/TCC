import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import Bluetooth from 'react-native-bluetooth-serial-next';
import AsyncStorate from '@react-native-async-storage/async-storage';

export default function BluetoothRead(props) {
  const [alturaSensor1, setAlturaSensor1] = useState(0);
  const [alturaSensor2, setAlturaSensor2] = useState(0);
  const [alturaSensor3, setAlturaSensor3] = useState(0);
  const [temperaturaSensor, setTemperaturaSensor] = useState(0);
  const [umidadeSensor, setUmidadeSensor] = useState(0);

  var interval = 0;

  useEffect(() => {
    Bluetooth.readEvery(
      async (data, intervalId) => {
        const resp = await AsyncStorate.getItem('@savePulverizador:data');
        const respData = resp ? JSON.parse(resp) : [];

        const dataString = data.replace(/@/g, '"');

        const newDatas = await JSON.parse(dataString);

        setAlturaSensor1(newDatas.Distancia);
        setTemperaturaSensor(newDatas.Temperatura);
        setUmidadeSensor(newDatas.Umidade);
        console.log(newDatas);

        interval = intervalId;

        const datas = [...respData, newDatas];

        await AsyncStorate.setItem(
          '@savePulverizador:data',
          JSON.stringify(datas),
        );

        /*   const response = await getItem();
  
        const responseData = response ? JSON.parse(response) : [];
  
        const lastId = responseData.length - 1;
  
        const id = lastId + 1;
  
        
  
        const data = [...responseData, newData];*/

        /*   if (stop) {
          console.log('pausa');
          setEfeito(true);
        }*/

        /* const newData = {
            id,
            amostra,
            altura,
            temperatura,
            umidade,
          };*/
      },
      5000,
      '\r\n',
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.boxContainer}>
      <View style={styles.boxCultivo}>
        <Text style={styles.texto}> Sensor 1 </Text>
        <Text style={styles.texto}> Sensor 2 </Text>
        <Text style={styles.texto}> Sensor 3 </Text>
      </View>

      <View style={styles.boxCultivo}>
        <Text style={styles.texto}> {alturaSensor1} M </Text>
        <Text style={styles.texto}> {alturaSensor2} M</Text>
        <Text style={styles.texto}> {alturaSensor3} M</Text>
      </View>

      <Text style={styles.texto}> Sensor Umid. {umidadeSensor} </Text>
      <Text style={styles.texto}> Sensor. Temp. {temperaturaSensor} </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  boxCabecalho: {
    backgroundColor: '#C0C0C0',
    borderRadius: 10,
    marginTop: '3%',
    marginHorizontal: '3%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  boxCultivo: {
    flexDirection: 'row',
    width: '50%',
  },
  texto: {
    fontSize: 20,
    padding: 6,
    width: '60%',
    color: 'black',
    fontWeight: 'bold',
  },
  picker: {
    width: '40%',
    color: 'black',
    fontWeight: 'bold',
  },
  boxSensores: {
    flexDirection: 'row',
  },
  boxContainer: {
    backgroundColor: '#C0C0C0',
    marginTop: '3%',
    marginHorizontal: '3%',
    borderRadius: 10,
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: 40,
    width: '50%',
    marginLeft: '5%',
  },
  textButton: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  texto2: {
    fontSize: 20,
    padding: 6,
    width: '100%',
    color: 'black',
    fontWeight: 'bold',
  },
});