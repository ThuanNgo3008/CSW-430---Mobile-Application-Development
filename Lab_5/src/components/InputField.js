import React from 'react';
import { TextInput } from 'react-native-paper';

export default function InputField(props) {
    return <TextInput mode="outlined" style={{ marginBottom: 16 }} {...props} />;
}