import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator, View } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../api/api';

const EditCustomerScreen = ({ route, navigation }) => {
    const { id } = route.params;
    const [fetching, setFetching] = useState(true);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    const fetchDetail = async () => {
        setFetching(true);
        try {
            const res = await axios.get(`${BASE_URL}/Customers/${id}`);
            setName(res.data.name);
            setPhone(res.data.phone);
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

    const handlePhoneChange = (value) => {
        const numeric = value.replace(/[^0-9]/g, '');
        setPhone(numeric);
    };

    const handleEdit = async () => {
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

            await axios.put(
                `${BASE_URL}/Customers/${id}`,
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
            Alert.alert('Lỗi', 'Cập nhật khách hàng thất bại');
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

export default EditCustomerScreen;