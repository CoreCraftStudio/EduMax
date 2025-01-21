import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
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
  const [loading, setLoading] = useState(false); // State to handle button disabling/loading
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

    setLoading(true); // Set loading to true to disable the button
    try {
      const response: AuthResponse = await login(formData);

      if (!response.token) {
        throw new Error('Invalid credentials or user not found.');
      }

      const { username, profileName, type, token } = response;

      await storeToken(token);
      Alert.alert('Success', `Welcome back, ${profileName || username}!`);

      router.push({
        pathname: '/(tabs)',
        params: { username, type },
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Login failed. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false); // Reset loading state after completion
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholderTextColor="black"
          placeholder="Username"
          value={formData.username}
          onChangeText={(value) => handleInputChange('username', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="black"
          secureTextEntry
          value={formData.password}
          onChangeText={(value) => handleInputChange('password', value)}
        />
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading} // Disable button when loading
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
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
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#9E9E9E',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default LoginScreen;
