import React from 'react';
import {TouchableOpacity, StatusBar} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

import Conection from '../screens/Conection';
import Home from '../screens/Home';
import Configuracao from '../screens/Configuracao';
import CadastroAmostra from '../screens/CadastroAmostra';

import Icon from 'react-native-vector-icons/Ionicons';

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
                <Icon name="options" size={25} />
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
            title: 'Configurações',
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
      </Stack.Navigator>
    </>
  );
}

export default Routes;
