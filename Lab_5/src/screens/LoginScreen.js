import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { BASE_URL } from '../api/api';

export default function LoginScreen({ navigation }) {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!phone || !password) {
            Alert.alert('Thông báo', 'Vui lòng nhập đủ Phone và Password');
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post(`${BASE_URL}/auth`, { phone, password });
            const token = res.data.token || res.data.accessToken || res.data;
            await AsyncStorage.setItem('token', typeof token === 'string' ? token : JSON.stringify(token));
            navigation.replace('Home');
        } catch (err) {
            console.log(err.response?.data || err.message);
            Alert.alert('Lỗi', 'Đăng nhập thất bại. Kiểm tra lại phone/password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <InputField
                label="Phone"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
            />
            <TextInput
                mode="outlined"
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                right={
                    <TextInput.Icon
                        icon={showPassword ? 'eye-off' : 'eye'}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }
                style={{ marginBottom: 16 }}
            />
            <PrimaryButton title="Login" onPress={handleLogin} loading={loading} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
    title: { fontSize: 36, fontWeight: 'bold', color: '#e94867', textAlign: 'center', marginBottom: 32 },
});