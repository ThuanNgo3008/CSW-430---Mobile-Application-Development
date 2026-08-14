import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MenuProvider } from 'react-native-popup-menu';

import LoginScreen from './src/screens/LoginScreen';
import MyBottomNavigation from './src/navigation/BottomNavigation';

import AddServiceScreen from './src/screens/AddServiceScreen';
import ServiceDetailScreen from './src/screens/ServiceDetailScreen';
import EditServiceScreen from './src/screens/EditServiceScreen';
import TransactionDetailScreen from './src/screens/TransactionDetailScreen';
import AddTransactionScreen from './src/screens/AddTransactionScreen';
import AddCustomerScreeen from './src/screens/AddCustomerScreeen';
import CustomerDetailScreen from './src/screens/CustomerDetailScreen';
import EditCustomerScreen from './src/screens/EditCustomerScreen';

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
              component={MyBottomNavigation}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="Customer"
              component={MyBottomNavigation}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="AddService"
              component={AddServiceScreen}
              options={{
                title: 'Service',
                headerStyle: { backgroundColor: '#e94867' },
                headerTintColor: '#fff',
              }}
            />

            <Stack.Screen
              name="AddCustomer"
              component={AddCustomerScreeen}
              options={{
                title: 'Add customer',
                headerStyle: { backgroundColor: '#e94867' },
                headerTintColor: '#fff',
              }}
            />

            <Stack.Screen
              name="AddTransaction"
              component={AddTransactionScreen}
              options={{
                title: 'Add transaction',
                headerStyle: { backgroundColor: '#e94867' },
                headerTintColor: '#fff',
              }}
            />

            <Stack.Screen
              name="ServiceDetail"
              component={ServiceDetailScreen}
              options={{
                title: 'Service detail',
                headerStyle: { backgroundColor: '#e94867' },
                headerTintColor: '#fff',
              }}
            />

            <Stack.Screen
              name="TransactionDetail"
              component={TransactionDetailScreen}
              options={{
                title: 'Transaction Detail',
                headerStyle: { backgroundColor: '#e94867' },
                headerTintColor: '#fff',
              }}
            />

            <Stack.Screen
              name="CustomerDetail"
              component={CustomerDetailScreen}
              options={{
                title: 'Customer Detail',
                headerStyle: { backgroundColor: '#e94867' },
                headerTintColor: '#fff',
              }}
            />

            <Stack.Screen
              name="EditService"
              component={EditServiceScreen}
              options={{
                title: 'Service',
                headerStyle: { backgroundColor: '#e94867' },
                headerTintColor: '#fff',
              }}
            />

            <Stack.Screen
              name="EditCustomer"
              component={EditCustomerScreen}
              options={{
                title: 'Customer',
                headerStyle: { backgroundColor: '#e94867' },
                headerTintColor: '#fff',
              }}
            />

          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </MenuProvider>
  );
}