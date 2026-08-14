import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, ActivityIndicator, IconButton, Icon } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { BASE_URL } from '../api/api';

export default function CustomerDetailScreen({ route, navigation }) {
    const { id } = route.params;
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDetail = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/Customers/${id}`);
            setCustomer(res.data);
        } catch (err) {
            console.log(err.message);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchDetail();
        }, [id])
    );


    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Menu>
                    <MenuTrigger>
                        <IconButton icon="dots-vertical" iconColor="#fff" />
                    </MenuTrigger>

                    <MenuOptions>
                        <MenuOption
                            onSelect={() => navigation.navigate('EditCustomer', { id })}
                        >
                            <View style={styles.menuItem}>
                                <Icon
                                    source="pencil"
                                    size={20}
                                    color="#8F8F8F"
                                />
                                <Text style={styles.menuText}>Edit</Text>
                            </View>
                        </MenuOption>

                        <MenuOption onSelect={handleDelete}>
                            <View style={styles.menuItem}>
                                <Icon
                                    source="delete"
                                    size={20}
                                    color="#8F8F8F"
                                />
                                <Text style={styles.menuText}>Delete</Text>
                            </View>
                        </MenuOption>
                    </MenuOptions>
                </Menu>
            ),
        });
    }, [navigation]);

    const handleDelete = () => {
        Alert.alert(
            'Alert',
            'Are you sure you want to remove this client? This will not be possible to return',
            [
                {
                    text: 'DELETE',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem('token');
                            await axios.delete(`${BASE_URL}/customers/${id}`, {
                                headers: { Authorization: `Bearer ${token}` },
                            });
                            navigation.goBack();
                        } catch (err) {
                            console.log(err.response?.data || err.message);
                            Alert.alert('Lỗi', 'Xóa thất bại');
                        }
                    },
                },
                { text: 'CANCEL', style: 'cancel' },
            ]
        );
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        const d = new Date(date);
        if (isNaN(d.getTime())) return 'N/A';

        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();

        const hour = String(d.getHours()).padStart(2, '0');
        const minute = String(d.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hour}:${minute}`;
    };


    if (loading || !customer) {
        return <ActivityIndicator style={{ marginTop: 40 }} color="#e94867" />;
    }

    const totalSpent = customer.transactions?.reduce(
        (sum, transaction) => sum + Number(transaction.price || 0),
        0
    ) || 0;

    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 10 }}>
            <View style={styles.first}>
                <Text style={styles.title}>General information</Text>
                <View style={styles.smallTitle}>
                    <Text style={styles.small}>Name: <Text>{customer.name}</Text></Text>
                    <Text style={styles.small}>Phone: <Text>{customer.phone}</Text></Text>
                    <Text style={styles.small}>Total spent: <Text style={styles.text}>{totalSpent.toLocaleString('vi-VN')} <Text style={{ textDecorationLine: 'underline', fontWeight: 'bold', color: '#e94867' }}>đ</Text></Text></Text>
                    <Text style={styles.small}>Time: <Text>{formatDate(customer.createdAt)}</Text></Text>
                    <Text style={styles.small}>Last update: <Text>{formatDate(customer.updatedAt)}</Text></Text>
                </View>
            </View>

            <View style={styles.first}>
                <Text style={styles.title}>Transaction history</Text>

                {customer.transactions?.map((transaction) => (
                    <View key={transaction._id} style={styles.item}>
                        <Text style={styles.title2}>
                            {transaction.id} - {formatDate(transaction.createdAt)}
                        </Text>
                        <View style={styles.body}>
                            <View style={styles.content}>
                                {transaction.services?.map((service, index) => (
                                    <Text numberOfLines={1}
                                        key={service._id || index}
                                        style={styles.products}
                                    >
                                        - {service.name}
                                    </Text>
                                ))}
                            </View>

                            <View style={styles.money}>
                                <Text style={styles.price}>
                                    {Number(transaction.price).toLocaleString('vi-VN')} đ
                                </Text>
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    first: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        marginBottom: 15,
    },
    title: {
        color: '#e94867',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    smallTitle: {
        marginTop: 5,
    },
    small: {
        fontWeight: 'bold',
        marginTop: 5,
        marginBottom: 5,
    },
    text: {
        color: '#e94867',
        fontWeight: 'bold',
    },

    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
    },

    menuText: {
        marginLeft: 5,
        fontSize: 15,
        color: '#e94867',
    },

    item: {
        padding: 14,
        borderWidth: 2,
        borderColor: '#eee',
        borderRadius: 8,
        marginBottom: 10,
    },
    body: {
        flexDirection: 'row',
    },
    content: {
        width: 240,
    },
    money: {
        width: 100,
        justifyContent: 'center',
        alignItems: 'flex-end',

    },
    title2: {
        fontWeight: 'bold',
        fontSize: 10,
    },

    products: {
        fontSize: 12,

    },
    name: {
        color: '#808080',
        fontSize: 11,
    },
    price: {
        color: '#e94867',
        fontSize: 14,
        fontWeight: 'bold',

    },


});