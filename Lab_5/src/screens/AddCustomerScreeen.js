import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../api/api';

const AddCustomerScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    const handlePhoneChange = (value) => {
        const numeric = value.replace(/[^0-9]/g, '');
        setPhone(numeric);
    };

    const handleAdd = async () => {
        if (!name.trim()) {
            Alert.alert('Thông báo', 'Vui lòng nhập tên khách hàng');
            return;
        }

        if (!/^0\d{9}$/.test(phone)) {
            Alert.alert(
                'Thông báo',
                'Số điện thoại không hợp lệ. Vui lòng nhập lại'
            );
            return;
        }

        setLoading(true);

        try {
            const token = await AsyncStorage.getItem('token');

            await axios.post(
                `${BASE_URL}/customers`,
                {
                    name: name.trim(),
                    phone: phone,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            navigation.goBack();

        } catch (err) {
            console.log(err.response?.data || err.message);
            Alert.alert('Lỗi', 'Thêm khách hàng thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Text style={styles.title1}>Customer name *</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setName}
                    value={name}
                    placeholder="Input your customer's name"
                />
                <Text style={styles.title2}>Phone *</Text>
                <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={handlePhoneChange}
                    keyboardType="numeric"
                    placeholder="Input phone number"
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

export default AddCustomerScreen;