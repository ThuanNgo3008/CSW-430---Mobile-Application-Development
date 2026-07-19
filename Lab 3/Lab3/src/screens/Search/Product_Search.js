import React, { useState } from 'react';
import { FlatList, StyleSheet, TextInput, View, Image } from 'react-native';
import { Card, Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const Search = ({ jumpTo }) => {
    const [data, setData] = useState([]);
    const [value, setValue] = useState('');
    let filePath = 'https://dummyjson.com/products/';

    const searchProduct = () => {
        if (value != '')
            filePath = 'https://dummyjson.com/products/search?q=' + value;
        fetch(filePath)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network respone was not ok');
                }
                return response.json();
            })
            .then((d) => {
                setData(d.products)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };

    const renderItem = ({ item }) => (
        <Card style={styles.card}>
            <Card.Content elevation={2} style={styles.cardInner}>
                <Text style={styles.headerDetail}>Product Detail</Text>

                {item.images && item.images.length > 0 && (
                    <Image source={{ uri: item.images[0] }} style={styles.cardImageCustom} />
                )}

                <View style={styles.ProductDetail}>
                    <View style={styles.content}>
                        <Text style={styles.title}>Title: {item.title}</Text>
                        <Text style={styles.text} numberOfLines={7}>Description: {item.description}</Text>
                        <Text style={styles.text}>Price: ${item.price}</Text>
                        <Text style={styles.text}>Discount: {item.discountPercentage}%</Text>
                        <Text style={styles.text}>Rating: {item.rating} stars</Text>
                        <Text style={styles.text}>Stock: {item.stock} units</Text>
                        <Text style={styles.text}>Brand: {item.brand}</Text>
                        <Text style={styles.text}>Category: {item.category}</Text>
                    </View>
                </View>
            </Card.Content>
        </Card>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headerTitle}>Search Products</Text>
            <TextInput
                style={styles.input}
                onChangeText={setValue}
                value={value}
            />
            <Button buttonColor="#2296F3" style={styles.button} labelStyle={styles.buttonText} onPress={searchProduct}>
                SEARCH
            </Button>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    value.trim() !== '' ? (  
                        <Text style={styles.emptyText}></Text>
                    ) : null
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F3F9',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 900,
        color: '#807E81',
    },
    input: {
        fontSize: 17,
    },
    button: {
        borderRadius: 3,
    },
    buttonText: {
        color: '#fff',
        fontSize: 17,
    },
    headerDetail: {
        fontSize: 19,
        marginTop: 8,
        marginBottom: 8,
    },
    cardImageCustom: {
        width: 400,
        height: 400,

    },
    cardInner: {
        borderRadius: 15,
        backgroundColor: '#F8F3F9',
    },
    title: {
        fontSize: 25,
        color: '#767177',

    },
    text: {
        fontSize: 15,
        color: '#777278',
    },
});

export default Search;