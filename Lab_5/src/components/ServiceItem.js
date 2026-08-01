import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export default function ServiceItem({ service, onPress }) {
    return (
        <TouchableOpacity style={styles.item} onPress={onPress}>
            <Text style={styles.name} numberOfLines={1}>{service.name}</Text>
            <Text style={styles.price}>{Number(service.price).toLocaleString('vi-VN')} đ</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 14,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 8,
        marginBottom: 10,
    },
    name: {
        fontWeight: 'bold',
        flex: 1,
        marginRight: 8,
    },
    price: {
        color: '#333',
    },
});