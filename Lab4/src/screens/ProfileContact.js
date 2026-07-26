import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from "react-native";
import ContactThum from "../components/ContactThum";
import DetailListIt from "../components/DetailListIt";
import { IconButton } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { toggleFavorite } from '../Store';

const ProfileContact = ({ route }) => {
    const { contact } = route.params;
    const dispatch = useDispatch();
    const [currentContact, setCurrentContact] = useState(null);
    useEffect(() => {
        const loadContact = async () => {
            const storedContacts = await AsyncStorage.getItem('contacts');
            const contacts = JSON.parse(storedContacts);

            const foundContact = contacts.find(
                item => item.id === contact.id
            );

            setCurrentContact(foundContact);
        };

        loadContact();
    }, [contact.id]);

    if (!currentContact) {
        return null;
    }

    const { avatar, name, email, phone, cell, favorite } = currentContact;

    const handleToggleFavorite = async () => {
        const updatedContacts = await AsyncStorage.getItem('contacts');

        const contacts = JSON.parse(updatedContacts);

        const updated = contacts.map(item =>
            item.id === contact.id
                ? { ...item, favorite: !item.favorite }
                : item
        );

        await AsyncStorage.setItem(
            'contacts',
            JSON.stringify(updated)
        );

        dispatch(toggleFavorite(contact.id));
        
        setCurrentContact(prev => ({
            ...prev,
            favorite: !prev.favorite,
        }));
    };

    return (
        <View style={styles.container}>
            <View style={styles.avatarSection}>
                <ContactThum avatar={avatar} name={name} phone={phone} />
            </View>
            <View style={styles.detailsSelection}>
                <DetailListIt icon="mail" title="Email" subtitle={email} />
                <DetailListIt icon="phone" title="Work" subtitle={phone} />
                <DetailListIt icon="smartphone" title="Personal" subtitle={cell} />
                <View style={{ alignItems: 'center' }}>
                    <IconButton
                        icon={favorite ? "star-check" : "star-check-outline"}
                        iconColor="#000"
                        size={30}
                        onPress={handleToggleFavorite}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    avatarSection: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'blue',
    },
    detailsSelection: {
        flex: 1,
        backgroundColor: 'white',
    }
})

export default ProfileContact;