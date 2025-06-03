import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    const handleLogin = () => {
        setError('');
        setSuccess('');
        if (!email || !password) {
            setError('Please enter email and password');
            return;
        }
        // Allow any email and password for now
        setSuccess('Login successful!');
        setTimeout(() => {
            router.replace('/(tabs)/home');
        }, 600);
    };

    // To hide the nav bar, set headerShown: false in navigation config for this screen
    // If using Expo Router, you can add: export const options = { headerShown: false, tabBarStyle: { display: 'none' } }
    // Or for React Navigation: options={{ headerShown: false, tabBarStyle: { display: 'none' } }}

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#111', marginBottom: 32, textAlign: 'center' }}>Sign In</Text>
            <View style={{ width: '100%', maxWidth: 340, paddingHorizontal: 12 }}>
                <TextInput
                    placeholder="Email"
                    placeholderTextColor="#888"
                    style={{ borderWidth: 1, borderColor: '#eee', borderRadius: 12, padding: 14, marginBottom: 16, color: '#111', fontSize: 16 }}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <TextInput
                    placeholder="Password"
                    placeholderTextColor="#888"
                    style={{ borderWidth: 1, borderColor: '#eee', borderRadius: 12, padding: 14, marginBottom: 16, color: '#111', fontSize: 16 }}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                {error ? <Text style={{ color: '#e53935', marginBottom: 16, textAlign: 'center' }}>{error}</Text> : null}
                {success ? <Text style={{ color: '#4caf50', marginBottom: 16, textAlign: 'center' }}>{success}</Text> : null}
                <TouchableOpacity
                    style={{ backgroundColor: '#4caf50', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 16 }}
                    onPress={handleLogin}
                >
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Sign In</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Text style={{ color: '#111' }}>Don't have an account yet? </Text>
                    <TouchableOpacity onPress={() => router.push('/signup')}>
                        <Text style={{ color: '#4caf50', fontWeight: 'bold' }}>Sign up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

// For Expo Router, you can add:
export const options = { headerShown: false, tabBarStyle: { display: 'none' } };