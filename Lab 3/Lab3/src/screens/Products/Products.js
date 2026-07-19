import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, View, Image } from 'react-native';
import { Card, Surface, Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const Products = ({ jumpTo }) => {
    const [data, setData] = useState([]);
    const filePath = 'https://dummyjson.com/products/';

    useEffect(() => {
        fetch(filePath)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((d) => {
                setData(d.products);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const renderItem = ({ item }) => (
        <Card style={styles.card} mode="contained">
            <Card.Content style={styles.cardInner}>
                {item.images && item.images.length > 0 && (
                    <Image source={{ uri: item.images[0] }} style={styles.cardImageCustom} />
                )}

                <View style={styles.rightContent}>
                    <View style={styles.content}>
                        <Text variant="titleMedium" style={styles.title}>Title: {item.title}</Text>
                        <Text style={styles.text} numberOfLines={7}>Description: {item.description}</Text>
                        <Text style={styles.text}>Price: {item.price}</Text>
                        <Text style={styles.discount}>Discount: {item.discountPercentage}% off</Text>
                        <Text style={styles.text}>Rating: {item.rating}</Text>
                        <Text style={styles.text}>Stock: {item.stock}</Text>
                        <Text style={styles.text}>Brand: {item.brand}</Text>
                        <Text style={styles.text}>Category: {item.category}</Text>
                    </View>

                    <View style={styles.actionsCustom}>
                        <Surface style={styles.surface} elevation={3}>
                            <Button buttonColor="#4994EC" style={styles.button} labelStyle={styles.buttonText} onPress={() => jumpTo('detail')}>
                                DETAIL
                            </Button>
                        </Surface>
                        <Surface style={styles.surface} elevation={3}>
                            <Button buttonColor="#4994EC" style={styles.button} labelStyle={styles.buttonText} onPress={() => jumpTo('add')}>
                                ADD
                            </Button>
                        </Surface>
                        <Surface style={styles.surface} elevation={3}>
                            <Button buttonColor="#4994EC" style={styles.button} labelStyle={styles.buttonText} onPress={() => { }}>
                                DELETE
                            </Button>
                        </Surface>
                    </View>
                </View>
            </Card.Content>
        </Card>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text variant="headlineMedium" style={styles.headerTitle}>Product list</Text>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    headerTitle: {
        marginLeft: 18,
        color: '#757375',
        fontWeight: 900,

    },
    card: {
        flexDirection: 'column',
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 25,
    },
    cardInner: {
        flexDirection: 'row',
        backgroundColor: '#F9F9F9',
        width: 360,
        borderRadius: 3,


    },
    cardImageCustom: {
        width: 108,
        height: 100,
        marginLeft: -18,
    },

    rightContent: {
        width: 240,
    },
    title: {
        color: '#757375',
    },
    text: {
        color: '#8F8F8F',
    },
    discount: {
        color: 'green',
    },

    // -----------------------------------
    actionsCustom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buttonCustom: {
        borderRadius: 0,
        width: 10,
    },
    button: {
        borderRadius: 3,

    },
    buttonText: {
        color: '#fff',
    },
});

export default Products;