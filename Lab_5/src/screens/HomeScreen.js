import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Image } from 'react-native';
import { Appbar, FAB, ActivityIndicator, Avatar, Text } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import ServiceItem from '../components/ServiceItem';
import { BASE_URL } from '../api/api';

export default function HomeScreen({ navigation }) {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/services`);
            setServices(res.data);
        } catch (err) {
            console.log(err.message);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchServices();
        }, [])
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <Appbar.Header style={{ backgroundColor: '#e94867', marginRight: 15 }}>
                <Appbar.Content title="HUYỀN TRINH" titleStyle={{ color: '#fff', fontWeight: 'bold' }} />
                <Avatar.Icon size={30} icon="account" style={{ backgroundColor: '#fff' }} color="#e94867" />
            </Appbar.Header>

            <Image
                source={require('../assets/Kami_Logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />

            <View style={styles.body}>
                <View style={styles.header}>
                    <Text style={styles.title}>Danh sách dịch vụ</Text>
                    <FAB
                        icon="plus"
                        size="small"
                        style={styles.fab}
                        color="#fff"
                        onPress={() => navigation.navigate('AddService')}
                    />
                </View>

                {loading ? (
                    <ActivityIndicator style={{ marginTop: 40 }} color="#e94867" />
                ) : (
                    <FlatList
                        data={services}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <ServiceItem
                                service={item}
                                onPress={() => navigation.navigate('ServiceDetail', { id: item._id })}
                            />
                        )}
                    />
                )}
            </View>


        </View>
    );
}

const styles = StyleSheet.create({
    body: { flex: 1, padding: 16 },
    logo: {
        width: '100%',
        height: 85,
        marginTop: 12,
        marginBottom: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    fab: {
        marginRight: 4,
        borderRadius: '50%',
        backgroundColor: '#e94867',
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 0,
        shadowColor: 'transparent',
    },

});