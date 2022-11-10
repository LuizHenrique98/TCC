import React from 'react';
import {TouchableOpacity, StatusBar} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

import Conection from '../screens/Conection';
import Home from '../screens/Home';
import Configuracao from '../screens/Configuracao';
import CadastroAmostra from '../screens/CadastroAmostra';
import ExportarCSV from '../screens/ExportarCsv';

import Icon from 'react-native-vector-icons/FontAwesome';

const Stack = createNativeStackNavigator();

function Routes() {
  const navigation = useNavigation();
  return (
    <>
      <StatusBar barStyle={'light-content'} backgroundColor={'green'} />
      <Stack.Navigator>
        <Stack.Screen
          name="Conexão"
          component={Conection}
          options={{
            title: 'Conexão',
            headerTintColor: 'white',
            headerStyle: {backgroundColor: 'green'},
          }}
        />

        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerTintColor: 'white',
            headerStyle: {backgroundColor: 'green'},
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('Configuracoes')}>
                <Icon name="plus-circle" size={30} style={{color: 'white'}} />
              </TouchableOpacity>
            ),
          }}
        />

        <Stack.Screen
          name="Configuracoes"
          component={Configuracao}
          options={{
            headerTintColor: 'white',
            headerStyle: {backgroundColor: 'green'},
            title: 'Lista',
          }}
        />

        <Stack.Screen
          name="CadastroAmostra"
          component={CadastroAmostra}
          options={{
            headerTintColor: 'white',
            headerStyle: {backgroundColor: 'green'},
            title: 'Cadastro de Amostra',
          }}
        />

        <Stack.Screen
          name="ExportarCSV"
          component={ExportarCSV}
          options={{
            title: 'Exportar CSV',
            headerTintColor: 'white',
            headerStyle: {backgroundColor: 'green'},
          }}
        />
      </Stack.Navigator>
    </>
  );
}

export default Routes;
