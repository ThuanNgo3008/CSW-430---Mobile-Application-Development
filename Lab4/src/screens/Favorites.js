import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import ContactThum from '../components/ContactThum';

const keyExtractor = ({ id }) => String(id);

const Favorites = ({ navigation }) => {
    const { contacts } = useSelector((state) => state);

    const favorites = contacts.filter((contact) => contact.favorite);

    const renderFavoriteThumbnail = ({ item }) => {
        const { name, phone, avatar } = item;

        return (
            <ContactThum
                name={name}
                phone={phone}
                avatar={avatar}
                onPress={() =>
                    navigation.navigate('ProfileContact', {
                        contact: item,
                    })
                }
            />
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={favorites}
                keyExtractor={keyExtractor}
                numColumns={3}
                contentContainerStyle={styles.list}
                renderItem={renderFavoriteThumbnail}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        justifyContent: 'center',
        flex: 1,
    },
    list: {
        alignItems: 'center',

    },
});

export default Favorites;