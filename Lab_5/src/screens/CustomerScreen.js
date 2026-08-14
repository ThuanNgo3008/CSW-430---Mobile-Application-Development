import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Image } from 'react-native';
import { Appbar, FAB, ActivityIndicator, Avatar, Text } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import CustomerItem from '../components/CustomerItem';
import { BASE_URL } from '../api/api';

export default function CustomerScreen({ navigation }) {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/customers`);
            setCustomers(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchCustomers();
        }, [])
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <Appbar.Header style={{ backgroundColor: '#e94867', marginRight: 15 }}>
                <Appbar.Content title="Customer" titleStyle={{ color: '#fff', fontWeight: 'bold' }} />
            </Appbar.Header>



            <View style={styles.body}>
                {loading ? (
                    <ActivityIndicator style={{ marginTop: 40 }} color="#e94867" />
                ) : (
                    <FlatList
                        data={customers}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <CustomerItem
                                customer={item}
                                onPress={() => navigation.navigate('CustomerDetail', { id: item._id })}
                            />
                        )}
                    />
                )}

                <FAB
                    icon="plus"
                    size="large"
                    style={styles.fab}
                    color="#fff"
                    onPress={() => navigation.navigate('AddCustomer')}
                />
            </View>


        </View>
    );
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        padding: 16,
    },

    
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        borderRadius: '50%',
        backgroundColor: '#e94867',
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 0,
        shadowColor: 'transparent',

    },

});