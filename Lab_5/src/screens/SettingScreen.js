import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingScreen({ navigation }) {
    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await AsyncStorage.removeItem('token');
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Login' }],
                            });

                        } catch (error) {
                            console.log(error);
                        }
                    },
                },
            ]
        );
    };


    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <Appbar.Header style={{ backgroundColor: '#e94867', marginRight: 15 }}>
                <Appbar.Content title="Setting" titleStyle={{ color: '#fff', fontWeight: 'bold' }} />
            </Appbar.Header>
            <View style={styles.container}>
                <Button
                    mode="contained"
                    onPress={handleLogout}
                    buttonColor="#e94867"
                    style={{ borderRadius: 8,  height: 50, justifyContent: 'center', top: -310}}> Logout

                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#fff',
    },

});