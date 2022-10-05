import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Conection from '../screens/Conection';
import Home from '../screens/Home';
import Configuracao from '../screens/Configuracao';
import CadastroCultivo from '../screens/CadastroCultivo';

const Stack = createNativeStackNavigator();

function Routes() {
  const navigation = useNavigation();
  return (
    <Stack.Navigator
      screenOptions={{
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Configuracoes')}>
            <Text style={{color: 'white', fontSize: 20}}>Config</Text>
          </TouchableOpacity>
        ),
      }}>
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
        name="CadastroCultivo"
        component={CadastroCultivo}
        options={{
          headerTintColor: 'white',
          headerStyle: {backgroundColor: 'green'},
          title: 'Cadastro de Cultivo',
        }}
      />
      {/*  <Stack.Screen
        name="Detail"
        component={Detail}
        options={{
          title: 'Detalhes',
          headerTintColor: '#FFF',
          headerStyle: {
            backgroundColor: '#232630',
          },
        }}
      />
      <Stack.Screen
        name="CategoryPosts"
        component={CategoryPosts}
        options={{
          headerTintColor: '#FFF',
          headerStyle: {
            backgroundColor: '#232630',
          },
        }}
      />
      <Stack.Screen
        name="Search"
        component={Search}
        options={{
          title: 'Procurando algo?',
          headerTintColor: '#FFF',
          headerStyle: {
            backgroundColor: '#232630',
          },
        }}
      />*/}
    </Stack.Navigator>
  );
}

export default Routes;
