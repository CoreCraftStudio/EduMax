import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store'; // Import SecureStore
import { login, AuthRequest, AuthResponse } from '@/utilities/authApi';

const LoginScreen: React.FC = () => {
  const [formData, setFormData] = useState<AuthRequest>({
    username: '',
    profileName: '',
    email: '',
    phone: '',
    type: '',
    password: '',
  });

  const router = useRouter();

  const handleInputChange = (field: keyof AuthRequest, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateForm = (): boolean => {
    const { username, password } = formData;
    if (!username || !password) {
      Alert.alert('Error', 'Username and password are required.');
      return false;
    }
    return true;
  };

  const storeToken = async (token: string) => {
    try {
      await SecureStore.setItemAsync('userToken', token);
      console.log('Token stored successfully!');
    } catch (error) {
      console.error('Error storing token:', error);
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      const response: AuthResponse = await login(formData);

      if (!response.member) {
        throw new Error('User not found. Please sign up first.');
      }

      const { member, type, token } = response;

      // Save token to SecureStore
      await storeToken(token);

      Alert.alert('Success', `Welcome back, ${member.profileName || member.username}!`);

      // Navigate to dynamic route with username and type
      router.push({
        pathname: '/(tabs)',
        params: { username: member.username, type }, // Pass type as a parameter
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please try again.';
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/icon.png')} // Replace with your image path
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={formData.username}
          onChangeText={(value) => handleInputChange('username', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={formData.password}
          onChangeText={(value) => handleInputChange('password', value)}
        />
        <Button title="Login" onPress={handleLogin} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    fontSize: 16,
  },
});

export default LoginScreen;
