import React from 'react';
import { Button } from 'react-native-paper';

export default function PrimaryButton({ title, onPress, loading }) {
    return (
        <Button
            mode="contained"
            onPress={onPress}
            loading={loading}
            buttonColor="#e94867"
            style={{ borderRadius: 8, marginTop: 8 }}
        >
            {title}
        </Button>
    );
}