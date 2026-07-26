import React, { useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContactsSuccess, mapContacts } from '../Store';
import ContactListItem from '../components/ContactListItem';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const keyExtractor = ({ id }) => id;
const fetchContacts = async () => {
    const storedContacts = await AsyncStorage.getItem('contacts');

    if (storedContacts) {
        return JSON.parse(storedContacts);
    }

    const data = await fetch("https://randomuser.me/api/?results=50");
    const ContactData = await data.json();

    const contacts = ContactData.results.map(mapContacts);

    await AsyncStorage.setItem(
        'contacts',
        JSON.stringify(contacts)
    );

    return contacts;
};
const Contacts = () => {
    const navigation = useNavigation();
    const { contacts } = useSelector((state) => state);
    const dispatch = useDispatch();
    useEffect(() => {
        fetchContacts().then(
            contacts => {
                dispatch(fetchContactsSuccess(contacts));
            }
        ).catch(e => { console.error(e); })
    }, [dispatch])

    const renderContacts = ({ item }) => {
        const { name, avatar, phone } = item;
        return <ContactListItem
            name={name}
            avatar={avatar}
            phone={phone}
            onPress={() => navigation.navigate("ProfileContact", { contact: item })} />;
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={contacts}
                keyExtractor={keyExtractor}
                renderItem={renderContacts}
            />
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
    }
});

export default Contacts;