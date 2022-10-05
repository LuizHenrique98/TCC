import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

import {Picker} from '@react-native-picker/picker';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

export default function Home() {
  const [cultivo, setCultivo] = useState('');
  const [intervalo, setInvervalo] = useState(0);
  const [distancia, setDistancia] = useState(0);

  const listaCultivo = [
    {
      id: '1',
      nome: 'Soja',
    },

    {
      id: '2',
      nome: 'melancia',
    },
  ];

  async function handleNew() {
    const id = uuid.v4;

    const newData = {
      id,
      cultivo,
      intervalo,
    };

    const response = await AsyncStorage.removeItem('@savePulverizador:cultivo');
    const responseData = response ? JSON.parse(response) : [];

    const data = [...responseData, newData];

    await AsyncStorage.setItem(
      '@savePulverizador:cultivo',
      JSON.stringify(data),
    );

    console.log(data);
    Toast.show({
      type: 'sucess',
      text1: 'Dados salvos com sucesso!',
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.boxCabecalho}>
        <View style={styles.boxCultivo}>
          <Text style={styles.texto}>Cultivo</Text>
          <Picker
            selectedValue={cultivo}
            onValueChange={(itemValue, itemIndex) => setCultivo(itemValue)}
            style={styles.picker}>
            {listaCultivo.map(index => {
              return (
                <Picker.Item
                  label={index.nome}
                  value={index.id}
                  key={index.id}
                  style={{fontSize: 20}}
                />
              );
            })}
          </Picker>
        </View>
        <View style={styles.boxCultivo}>
          <Text style={styles.texto}>Coleta de dados em minutos:</Text>
          <Picker
            selectedValue={intervalo}
            onValueChange={(itemValue, itemIndex) => setInvervalo(itemValue)}
            style={styles.picker}>
            <Picker.Item label="0" value={0} key={0} style={{fontSize: 20}} />
            <Picker.Item label="1" value={1} key={1} style={{fontSize: 20}} />
            <Picker.Item label="2" value={2} key={2} />
            <Picker.Item label="3" value={3} key={3} />
            <Picker.Item label="4" value={4} key={4} />
            <Picker.Item label="5" value={5} key={5} />
            <Picker.Item label="10" value={10} key={10} />
            <Picker.Item label="15" value={15} key={15} />
            <Picker.Item label="20" value={20} key={20} />
            <Picker.Item label="25" value={25} key={25} />
            <Picker.Item label="30" value={30} key={30} />
            <Picker.Item label="60" value={60} key={60} />
          </Picker>
        </View>
      </View>

      <View style={styles.boxContainer}>
        <View style={styles.boxCultivo}>
          <Text style={styles.texto}> Esquerdo</Text>
          <Text style={styles.texto}> Direito</Text>
        </View>

        <View style={styles.boxCultivo}>
          <Text style={styles.texto}>0</Text>
          <Text style={styles.texto}>0</Text>
        </View>
      </View>

      <View style={{marginTop: 50}}>
        <Text>Temperatura</Text>
        <Text>Umidade do Ar</Text>
      </View>

      <TouchableOpacity onPress={handleNew}>
        <Text>Ok</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  boxCabecalho: {
    backgroundColor: '#4F4F4F',
    borderRadius: 10,
    margin: '5%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  boxCultivo: {
    flexDirection: 'row',
  },
  texto: {
    fontSize: 20,
    padding: 10,
    width: '60%',
    color: 'white',
  },
  picker: {
    width: '40%',
    color: 'white',
  },
  boxSensores: {
    flexDirection: 'row',
  },
  boxContainer: {
    backgroundColor: '#4F4F4F',
    margin: '5%',
    borderRadius: 10,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
});
