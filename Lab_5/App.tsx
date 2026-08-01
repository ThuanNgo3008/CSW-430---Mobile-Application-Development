import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MenuProvider } from 'react-native-popup-menu';

import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import AddServiceScreen from './src/screens/AddServiceScreen';
import ServiceDetailScreen from './src/screens/ServiceDetailScreen';
import EditServiceScreen from './src/screens/EditServiceScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <MenuProvider>

      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AddService"
              component={AddServiceScreen}
              options={{ title: 'Service', headerStyle: { backgroundColor: '#e94867' }, headerTintColor: '#fff' }}
            />
            <Stack.Screen
              name="ServiceDetail"
              component={ServiceDetailScreen}
              options={{ title: 'Service detail', headerStyle: { backgroundColor: '#e94867' }, headerTintColor: '#fff' }}
            />
            <Stack.Screen
              name="EditService"
              component={EditServiceScreen}
              options={{ title: 'Service', headerStyle: { backgroundColor: '#e94867' }, headerTintColor: '#fff' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </MenuProvider>
  );
}