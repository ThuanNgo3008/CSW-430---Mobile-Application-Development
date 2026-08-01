import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../api/api';

const AddServiceScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('0');

    const formatPrice = (value) => {
        const numeric = value.replace(/[^0-9]/g, '');
        if (!numeric) return '';
        return Number(numeric).toLocaleString('vi-VN');
    };

    const handlePriceChange = (value) => {
        const numeric = value.replace(/[^0-9]/g, '');
        setPrice(numeric || '0');
    };

    const handleAdd = async () => {
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
            await axios.post(
                `${BASE_URL}/services`,
                { name, price: Number(price) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            navigation.goBack();
        } catch (err) {
            console.log(err.response?.data || err.message);
            Alert.alert('Lỗi', 'Thêm dịch vụ thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Text style={styles.title1}>Service name *</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setName}
                    value={name}
                    placeholder="Input a service name"
                />
                <Text style={styles.title2}>Price *</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={handlePriceChange}
                    value={price === '0' ? '' : formatPrice(price)}
                    keyboardType="numeric"
                    placeholder="0"
                    onFocus={() => {
                        if (price === '0') setPrice('');
                    }}
                    onBlur={() => {
                        if (price.trim() === '') setPrice('0');
                    }}
                />
                <TouchableOpacity style={styles.button} onPress={handleAdd} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Add</Text>
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

export default AddServiceScreen;