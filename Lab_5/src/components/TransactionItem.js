import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export default function TransactionItem({ transaction, onPress }) {

    const formatDate = (date) => {
        const d = new Date(date);

        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = String(d.getFullYear()).slice(-2);

        const hour = String(d.getHours()).padStart(2, '0');
        const minute = String(d.getMinutes()).padStart(2, '0');

        return `${day}/${month}/${year} ${hour}:${minute}`;
    };


    return (
        <TouchableOpacity style={styles.item} onPress={onPress}>
            <View style={styles.body}>
                <View style={styles.content}>
                    <Text style={styles.title}>
                        {transaction.id} - {formatDate(transaction.createdAt)}

                        {transaction.status === 'cancelled' && (
                            <Text style={styles.cancelled}>  - Cancelled</Text>
                        )}
                    </Text>

                    {transaction.services?.map((service, index) => (
                        <Text key={service._id || index} style={styles.products}>
                            - {service.name}
                        </Text>
                    ))}
                    <Text style={styles.name}>Customer: {transaction.customer?.name || ''}</Text>
                </View>

                <View style={styles.money}>
                    <Text style={styles.price}>{Number(transaction.price).toLocaleString('vi-VN')} đ</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
        width: 200,
    },
    money: {
        width: 150,
        justifyContent: 'center',
        alignItems: 'flex-end',

    },
    title: {
        fontWeight: 'bold',
        fontSize: 9,
    },
    cancelled: {
        color: '#FF4F4F',
        fontWeight: 'bold',
    },
    products: {
        fontSize: 11,

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