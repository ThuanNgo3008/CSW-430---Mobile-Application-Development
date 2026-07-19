import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Alert } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const Add = ({ jumpTo }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [discountPercentage, setDiscountPercentage] = useState('');
    const [rating, setRating] = useState('');
    const [stock, setStock] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [images, setImages] = useState('');
    const handleSubmit = () => {
        fetch('https://dummyjson.com/products/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: title,
                description: description,
                price: price,
                discountPercentage: discountPercentage,
                rating: rating,
                stock: stock,
                brand: brand,
                category: category,
                images: images,
            }),
        })
            .then((res) => res.json()).then(console.log);
        Alert.alert("Add sucessfull")
    }


    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headerTitle}>Add a Product</Text>
            <Text style={styles.text}>Title</Text>
            <TextInput
                style={styles.input}
                onChangeText={setTitle}
                value={title}
                placeholder="Enter title"
            />

            <Text style={styles.text}>Description</Text>
            <TextInput
                style={styles.input}
                onChangeText={setDescription}
                value={description}
                placeholder="Enter description"
            />

            <Text style={styles.text}>Price</Text>
            <TextInput
                style={styles.input}
                onChangeText={setPrice}
                value={price}
                placeholder="Enter price"
                keyboardType="numeric"
            />

            <Text style={styles.text}>Discount Percentage</Text>
            <TextInput
                style={styles.input}
                onChangeText={setDiscountPercentage}
                value={discountPercentage}
                placeholder="Enter discount percentage"
                keyboardType="numeric"
            />

            <Text style={styles.text}>Rating</Text>
            <TextInput
                style={styles.input}
                onChangeText={setRating}
                value={rating}
                placeholder="Enter rating"
                keyboardType="numeric"
            />

            <Text style={styles.text}>Stock</Text>
            <TextInput
                style={styles.input}
                onChangeText={setStock}
                value={stock}
                placeholder="Enter stock"
                keyboardType="numeric"
            />

            <Text style={styles.text}>Brand</Text>
            <TextInput
                style={styles.input}
                onChangeText={setBrand}
                value={brand}
                placeholder="Enter brand"
            />

            <Text style={styles.text}>Category</Text>
            <TextInput
                style={styles.input}
                onChangeText={setCategory}
                value={category}
                placeholder="Enter category"
            />

            <Text style={styles.text}>Images</Text>
            <TextInput
                style={styles.input}
                onChangeText={setImages}
                value={images}
                placeholder="Enter images URL(s)"
            />

            <Button buttonColor="#2296F3" style={styles.button} labelStyle={styles.buttonText} onPress={handleSubmit}>
                SUBMIT
            </Button>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    headerTitle: {
        fontSize: 18,
        fontWeight: 800,
        color: '#0202FF',
    },

    text: {
        fontWeight: 700,
        color: '#7D7B7D',
        fontSize: 16,
    },
    input: {
        color: '#908E90',
        fontSize: 15,
        marginTop: 4,
        marginBottom: 4,
    },
    button: {
        borderRadius: 0,
    },
    buttonText: {
        color: '#fff',
    },

});

export default Add;