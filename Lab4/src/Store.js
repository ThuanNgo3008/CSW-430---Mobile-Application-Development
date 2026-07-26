import { createSlice, configureStore } from '@reduxjs/toolkit';

export const mapContacts = (contact) => {
    const { name, picture, phone, cell, email } = contact;

    return {
        id: contact.login.uuid,
        name: name.first + ' ' + name.last,
        avatar: picture.large,
        phone,
        cell,
        email,
        favorite: Math.random() < 0.1,
    };
};

const contactsSlice = createSlice({
    name: 'contacts',
    initialState: {
        contacts: [],
    },
    reducers: {
        fetchContactsSuccess: (state, action) => {
            state.contacts = action.payload;
        },

        toggleFavorite: (state, action) => {
            const contact = state.contacts.find(
                contact => contact.id === action.payload
            );

            if (contact) {
                contact.favorite = !contact.favorite;
            }
        },
    },
});

export const { fetchContactsSuccess, toggleFavorite } = contactsSlice.actions;

const store = configureStore({
    reducer: contactsSlice.reducer,
});

export default store;