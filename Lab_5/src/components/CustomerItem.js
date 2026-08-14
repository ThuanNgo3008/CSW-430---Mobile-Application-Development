import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Text, Icon } from 'react-native-paper';

export default function CustomerItem({ customer, onPress }) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styles.cardInner}>
                <View style={styles.content}>
                    <Text style={styles.text}>Customer: <Text style={styles.context}>{customer.name}</Text> </Text>
                    <Text style={styles.text}>Phone: <Text style={styles.context}>{customer.phone}</Text></Text>
                    <Text style={styles.text}>Total money: <Text style={styles.money}>{Number(customer.totalSpent).toLocaleString('vi-VN')}</Text> <Text style={styles.price}>đ</Text></Text>
                </View>
                <View style={styles.type}>
                    <Icon
                        source="chess-queen"
                        size={24}
                        color="#e94867"
                    />

                    <Text style={styles.loyalty}>
                        {customer.loyalty === 'member' ? 'Member' : 'Guest'}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    cardInner: {
        flexDirection: 'row',
        borderRadius: 10,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#eee',
        padding: 16,
        marginBottom: 16,
    },
    appbar: {
        backgroundColor: '#e94867',
    },

    appbarTitle: {
        color: '#fff',
        fontWeight: 'bold',
    },

    body: {
        flex: 1,
        padding: 16,
    },

    card: {
        marginBottom: 12,
        borderRadius: 10,
    },

    content: {
        width: 270,
    },

    text: {
        fontSize: 15,
        color: '#808080',
        fontWeight: 'bold',
    },

    money: {
        color: '#e94867',
        fontWeight: 'bold',
    },
    price: {
        color: '#e94867',
        fontWeight: 'bold',
        textDecorationLine: 'underline'
    },


    type: {
        width: 55,
        justifyContent: 'center',
        alignItems: 'center',
    },

    loyalty: {
        color: '#e94867',
        fontWeight: 'bold',
    },

});