import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import {Redirect, useRouter} from 'expo-router';
import { useAuth } from '@/context/AuthContex'


export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {session, signin} = useAuth()

  const handleSignin = async () => {
    setError('');
    setSuccess('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      await signin({ email, password });
      setSuccess('Logged in successfully! 🎉');
    } catch (err) {
      setError( "Something went wrong. Please try again.");
    }
    setLoading(false);
  };



  if(session) return <Redirect href="/"/>
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
          onPress={handleSignin}
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