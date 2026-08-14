import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Appbar, FAB, ActivityIndicator } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import TransactionItem from '../components/TransactionItem';
import { BASE_URL } from '../api/api';

export default function TransactionScreen({ navigation }) {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/transactions`);
            setTransactions(res.data);
        } catch (err) {
            console.log(err.message);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchTransactions();
        }, [])
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <Appbar.Header style={{ backgroundColor: '#e94867', marginRight: 15 }}>
                <Appbar.Content title="Transaction" titleStyle={{ color: '#fff', fontWeight: 'bold' }} />
            </Appbar.Header>



            <View style={styles.body}>
                {loading ? (
                    <ActivityIndicator style={{ marginTop: 40 }} color="#e94867" />
                ) : (
                    <FlatList
                        data={transactions}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TransactionItem
                                transaction={item}
                                onPress={() => navigation.navigate('TransactionDetail', { id: item._id })}
                            />
                        )}
                    />
                )}

                <FAB
                    icon="plus"
                    size="large"
                    style={styles.fab}
                    color="#fff"
                    onPress={() => navigation.navigate('AddTransaction')}
                />
            </View>


        </View>
    );
}

const styles = StyleSheet.create({
    body: { flex: 1, padding: 16 },
    
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