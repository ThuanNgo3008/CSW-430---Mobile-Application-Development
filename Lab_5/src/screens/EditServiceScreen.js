import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator, View } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../api/api';

const EditServiceScreen = ({ route, navigation }) => {
    const { id } = route.params;
    const [fetching, setFetching] = useState(true);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('0');

    const fetchDetail = async () => {
        setFetching(true);
        try {
            const res = await axios.get(`${BASE_URL}/services/${id}`);
            setName(res.data.name);
            setPrice(String(res.data.price));
        } catch (err) {
            console.log(err.message);
        } finally {
            setFetching(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchDetail();
        }, [id])
    );

    const formatPrice = (value) => {
        const numeric = value.replace(/[^0-9]/g, '');
        if (!numeric) return '';
        return Number(numeric).toLocaleString('vi-VN');
    };

    const handlePriceChange = (value) => {
        const numeric = value.replace(/[^0-9]/g, '');
        setPrice(numeric || '0');
    };

    const handleEdit = async () => {
        if (!name.trim()) {
            Alert.alert('Thông báo', 'Vui lòng nhập tên dịch vụ');
            return;
        }
        if (!price.trim() || Number(price) <= 0 || isNaN(Number(price))) {
            Alert.alert('Thông báo', 'Vui lòng nhập giá hợp lệ');
            return;
        }
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            await axios.put(
                `${BASE_URL}/services/${id}`,
                { name, price: Number(price) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            navigation.goBack();
        } catch (err) {
            console.log(err.response?.data || err.message);
            Alert.alert('Lỗi', 'Cập nhật thất bại');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <View style={styles.center}>
                <ActivityIndicator color="#E94867" />
            </View>
        );
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Text style={styles.title1}>Service name *</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setName}
                    value={name}
                />
                <Text style={styles.title2}>Price *</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={handlePriceChange}
                    value={price === '0' ? '' : formatPrice(price)}
                    keyboardType="numeric"
                    onFocus={() => {
                        if (price === '0') setPrice('');
                    }}
                    onBlur={() => {
                        if (price.trim() === '') setPrice('0');
                    }}
                />
                <TouchableOpacity style={styles.button} onPress={handleEdit} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Update</Text>
                    )}
                </TouchableOpacity>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title1: { fontWeight: 'bold', marginTop: 15, marginBottom: 8 },
    title2: { fontWeight: 'bold', marginTop: 15, marginBottom: 8 },
    input: {
        height: 50,
        padding: 10,
        backgroundColor: '#F2F2F6',
        borderRadius: 8,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E94867',
        padding: 10,
        borderRadius: 8,
        marginTop: 30,
        height: 40,
    },
});

export default EditServiceScreen;