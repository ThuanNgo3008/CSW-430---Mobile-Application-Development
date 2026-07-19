import React, { useState, useEffect } from 'react';
import { ScrollView, FlatList, StyleSheet, View, Image } from 'react-native';
import { Card, Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const Detail = ({ jumpTo }) => {
    const [data, setData] = useState([]);
    const filePath = 'https://dummyjson.com/products/2';

    useEffect(() => {
        fetch(filePath)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((d) => {
                setData([d]);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const renderItem = ({ item }) => (
        <Card style={styles.card}>
            <Card.Content style={styles.cardProduct}>
                <Text style={styles.headerDetail}>Product Detail</Text>
                <View style={styles.cardInner}>
                    {item.images && (
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
                </View>

                <View style={styles.actionsCustom}>
                    <Button buttonColor="#674FA2" style={styles.button} labelStyle={styles.buttonText} onPress={() => jumpTo('detail')}>
                        Delete
                    </Button>
                    <Button buttonColor="#674FA2" style={styles.button2} labelStyle={styles.buttonText} onPress={() => jumpTo('detail')}>
                        Cancel
                    </Button>
                </View>
            </Card.Content>
        </Card>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                    scrollEnabled={false}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    cardProduct: {
        borderRadius: 30,
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
        marginTop: 8,
        marginBottom: 8,
        marginLeft: 8,
        fontSize: 20,
        color: '#000',
    },
    cardImageCustom: {
        width: 400,
        height: 400,
        marginTop: -80,

    },
    cardInner: {
        backgroundColor: '#F8F3F9',
        flexDirection: 'column',
        alignItems: 'center',
    },
    title: {
        fontSize: 30,
        color: '#000',

    },
    text: {
        fontSize: 15,
        color: '#000',
    },

    actionsCustom: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    button: {
        marginLeft: 10,
        width: 100,
        height: 46,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
    },
    button2: {
        marginLeft: 10,
        width: 100,
        height: 46,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
    },
});

export default Detail;