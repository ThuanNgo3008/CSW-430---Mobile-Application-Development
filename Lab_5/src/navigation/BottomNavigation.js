import React, { useState } from 'react';
import { BottomNavigation, Icon } from 'react-native-paper';

import HomeScreen from '../screens/HomeScreen';
import TransactionScreen from '../screens/TransactionScreen';
import CustomerScreen from '../screens/CustomerScreen';
import SettingScreen from '../screens/SettingScreen'
import { transparent } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

export default function MyBottomNavigation({ navigation }) {
    const [index, setIndex] = useState(0);

    const [routes] = useState([
        { key: 'home', title: 'Home', focusedIcon: 'home-outline' },
        { key: 'transaction', title: 'Transaction', focusedIcon: 'cash-multiple' },
        { key: 'customer', title: 'Customer', focusedIcon: 'account-multiple' },
        { key: 'setting', title: 'Setting', focusedIcon: 'cog-outline' },
    ]);


    const renderScene = ({ route, jumpTo }) => {
        switch (route.key) {
            case 'home':
                return (
                    <HomeScreen
                        navigation={navigation}
                        jumpTo={jumpTo}
                    />
                );
            case 'transaction':
                return (
                    <TransactionScreen
                        navigation={navigation}
                        jumpTo={jumpTo}
                    />
                );
            case 'customer':
                return <CustomerScreen />;
            case 'setting':
                return (
                    <SettingScreen
                        navigation={navigation}
                        jumpTo={jumpTo}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
            renderIcon={({ route, color }) => (
                <Icon
                    source={route.focusedIcon}
                    size={28}
                    color={color}
                />
            )}
            barStyle={{
                height: 100,
                backgroundColor: '#fff',
                borderTopWidth: 1,
                borderTopColor: '#eee',
            }}
            theme={{
                fonts: {
                    labelMedium: {
                        fontSize: 12,
                    }
                },
                colors: {
                    secondaryContainer: 'transparent'
                }
            }}

            activeColor='#DD5C6D'
            inactiveColor='#808080'
        />
    );
}