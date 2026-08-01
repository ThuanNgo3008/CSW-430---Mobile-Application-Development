import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, ActivityIndicator, IconButton } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { BASE_URL } from '../api/api';

export default function ServiceDetailScreen({ route, navigation }) {
    const { id } = route.params;
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDetail = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/services/${id}`);
            setService(res.data);
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
                            onSelect={() => navigation.navigate('EditService', { id })}
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
            'Are you sure you want to remove this service? This operation cannot be returned',
            [
                { text: 'CANCEL', style: 'cancel' },
                {
                    text: 'DELETE',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem('token');
                            await axios.delete(`${BASE_URL}/services/${id}`, {
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

    if (loading || !service) {
        return <ActivityIndicator style={{ marginTop: 40 }} color="#e94867" />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.line}>
                <Text style={styles.bold}>Service name: </Text>
                {service.name}
            </Text>
            <Text style={styles.line}>
                <Text style={styles.bold}>Price: </Text>
                {Number(service.price).toLocaleString()} đ
            </Text>
            <Text style={styles.line}>
                <Text style={styles.bold}>Creator: </Text>
                {service.createdBy}
            </Text>
            <Text style={styles.line}>
                <Text style={styles.bold}>Time: </Text>
                {new Date(service.createdAt).toLocaleString()}
            </Text>
            <Text style={styles.line}>
                <Text style={styles.bold}>Final update: </Text>
                {new Date(service.updatedAt).toLocaleString()}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    line: { marginBottom: 10, fontSize: 14 },
    bold: { fontWeight: 'bold' },
});