import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, ActivityIndicator, IconButton } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { BASE_URL } from '../api/api';

export default function TransactionDetailScreen({ route, navigation }) {
    const { id } = route.params;
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDetail = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/transactions/${id}`);
            setTransaction(res.data);
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
                            onSelect={() => navigation.navigate('Edittransaction', { id })}
                            text="Edit"
                        />
                        <MenuOption onSelect={handleDelete} text="Delete" />
                    </MenuOptions>
                </Menu>
            ),
        });
    }, [navigation]);

    const handleDelete = () => {
        Alert.alert(
            'Warning',
            'Are you sure you want to remove this transaction? This operation cannot be returned',
            [
                { text: 'CANCEL', style: 'cancel' },
                {
                    text: 'DELETE',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem('token');
                            await axios.delete(`${BASE_URL}/transactions/${id}`, {
                                headers: { Authorization: `Bearer ${token}` },
                            });
                            navigation.navigate('Home');
                        } catch (err) {
                            console.log(err.response?.data || err.message);
                            Alert.alert('Lỗi', 'Xóa thất bại');
                        }
                    },
                },
            ]
        );
    };

    const formatDate = (date) => {
        const d = new Date(date);

        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = String(d.getFullYear()).slice(-2);

        const hour = String(d.getHours()).padStart(2, '0');
        const minute = String(d.getMinutes()).padStart(2, '0');

        return `${day}/${month}/${year} ${hour}:${minute}`;
    };

    if (loading || !transaction) {
        return <ActivityIndicator style={{ marginTop: 40 }} color="#e94867" />;
    }

    const amount = Number(transaction.priceBeforePromotion);
    const total = Number(transaction.price);
    const discount = total - amount;


    return (
        <View style={{ flex: 1 }}>
            <View style={{ padding: 10 }}>
                <View style={styles.first}>
                    <Text style={styles.title}>General information</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.smallTitle}>
                            <Text style={styles.small}>Transaction code</Text>
                            <Text style={styles.small}>Customer</Text>
                            <Text style={styles.small}>Creation time</Text>
                        </View>
                        <View style={styles.content}>
                            <Text style={styles.text}>{transaction.id}</Text>
                            <Text style={styles.text}>{transaction.customer?.name || ''} - {transaction.customer?.phone || ''}</Text>
                            <Text style={styles.text}>{formatDate(transaction.createdAt)}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.first}>
                    <Text style={styles.title}>Services list</Text>
                    <View>
                        {transaction.services?.map((service, index) => (
                            <View key={service._id || index} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                                <Text style={{ marginTop: 5, marginBottom: 5, }}>{service.name} </Text>
                                <Text style={{ color: '#808080' }}>x{service.quantity}</Text>
                                <Text style={{ fontWeight: 'bold' }}>{Number(service.price).toLocaleString('vi-VN')} <Text style={{ textDecorationLine: 'underline', fontWeight: 'bold' }}>đ</Text></Text>
                            </View>

                        ))}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderColor: '#eee', marginTop: 20 }}>
                            <Text style={{ marginTop: 10, marginBottom: 10, color: '#808080', fontWeight: 'bold', }}>Total</Text>
                            <Text style={{ marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>{Number(transaction.price).toLocaleString('vi-VN')} <Text style={{ textDecorationLine: 'underline', fontWeight: 'bold' }}>đ</Text></Text>
                        </View>
                    </View>
                </View>

                <View style={styles.first}>
                    <Text style={styles.title}>Cost</Text>

                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                            <Text style={{ marginTop: 10, marginBottom: 10, color: '#808080', fontWeight: 'bold', }}>Amount of money </Text>

                            <Text style={{ marginTop: 10, marginBottom: 10, fontWeight: 'bold', }}>
                                {Number(transaction.priceBeforePromotion || 0).toLocaleString('vi-VN')} <Text style={{ textDecorationLine: 'underline', fontWeight: 'bold' }}>đ</Text>
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                            <Text style={{ marginTop: 10, marginBottom: 10, color: '#808080', fontWeight: 'bold', }}>Discount</Text>

                            <Text style={{ marginTop: 10, marginBottom: 10, fontWeight: 'bold', }}>
                                {(Number(transaction.price) - Number(transaction.priceBeforePromotion || 0)).toLocaleString('vi-VN')} <Text style={{ textDecorationLine: 'underline', fontWeight: 'bold' }}>đ</Text>
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderColor: '#eee', marginTop: 20, }}>
                            <Text style={{ marginTop: 10, marginBottom: 10, fontWeight: 'bold', }}>Total payment </Text>

                            <Text style={{ marginTop: 10, marginBottom: 10, fontWeight: 'bold', color: '#e94867', fontSize: 18, }}>
                                {Number(transaction.price).toLocaleString('vi-VN')} <Text style={{ textDecorationLine: 'underline', fontWeight: 'bold', color: '#e94867' }}>đ</Text>
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
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
    },
    smallTitle: {
        width: 140,
    },
    small: {
        color: '#808080',
        fontWeight: 'bold',
        marginTop: 5,
        marginBottom: 5,
    },
    content: {
        width: 230,
        alignItems: 'flex-end',
    },
    text: {
        fontWeight: 'bold',
        marginTop: 5,
        marginBottom: 5,
    },

});