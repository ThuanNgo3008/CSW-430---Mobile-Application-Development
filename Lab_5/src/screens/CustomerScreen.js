import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Appbar, ActivityIndicator, Text, Card, FAB, Icon } from 'react-native-paper';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { BASE_URL } from '../api/api';

export default function CustomerScreen() {
    const navigation = useNavigation();
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

    const renderItem = ({ item }) => (
        <Card style={styles.card} mode="contained">
            <Card.Content style={styles.cardInner}>
                <View style={styles.content}>
                    <Text style={styles.text}>Customer: <Text style={styles.context}>{item.name}</Text> </Text>
                    <Text style={styles.text}>Phone: <Text style={styles.context}>{item.phone}</Text></Text>
                    <Text style={styles.text}>Total money: <Text style={styles.money}>{Number(item.totalSpent).toLocaleString('vi-VN')}</Text> <Text style={styles.price}>đ</Text></Text>
                </View>
                <View style={styles.type}>
                    <Icon
                        source="chess-queen"
                        size={24}
                        color="#e94867"
                    />

                    <Text style={styles.loyalty}>
                        {item.loyalty === 'member' ? 'Member' : 'Guest'}
                    </Text>
                </View>
            </Card.Content>
        </Card>
    );

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.appbar}>
                <Appbar.Content
                    title="Customer"
                    titleStyle={styles.appbarTitle}
                />
            </Appbar.Header>

            <View style={styles.body}>
                {loading ? (
                    <ActivityIndicator
                        animating={true}
                        color="#e94867"
                        style={{ marginTop: 30 }}
                    />
                ) : (
                    <FlatList
                        data={customers}
                        keyExtractor={(item) => item._id}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>

            <FAB
                icon="plus"
                size="large"
                style={styles.fab}
                color="#fff"
                onPress={() => navigation.navigate('AddCustomer')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    cardInner: {
        flexDirection: 'row',
        borderRadius: 10,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#eee',
    },
    appbar: {
        backgroundColor: '#e94867',
    },

    appbarTitle: {
        color: '#fff',
        fontWeight: 'bold',
    },

    body: {
        flex: 1,
        padding: 16,
    },

    card: {
        marginBottom: 12,
        borderRadius: 10,
    },

    content: {
        width: 270,
    },

    text: {
        fontSize: 15,
        color: '#808080',
        fontWeight: 'bold',
    },

    money: {
        color: '#e94867',
        fontWeight: 'bold',
    },
    price: {
        color: '#e94867',
        fontWeight: 'bold',
        textDecorationLine: 'underline'
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

    type: {
        width: 55,
        justifyContent: 'center',
        alignItems: 'center',
    },

    loyalty: {
        color: '#e94867',
        fontWeight: 'bold',
    },

});