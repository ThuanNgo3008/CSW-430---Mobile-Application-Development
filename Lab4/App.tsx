import 'react-native-gesture-handler';
import 'react-native-get-random-values';

import React from 'react';
import { Provider } from 'react-redux';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';
import store from './src/Store';
import Contacts from './src/screens/Contact';
import Favorites from './src/screens/Favorites';
import ProfileContact from './src/screens/ProfileContact';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const MainDrawer = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="Contacts"
        component={Contacts}
      />

      <Drawer.Screen
        name="Favorites"
        component={Favorites}
      />
    </Drawer.Navigator>
  );
};


const App = () => {
  return (
    <Provider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="MainDrawer"
              component={MainDrawer}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="ProfileContact"
              component={ProfileContact}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
};

export default App;