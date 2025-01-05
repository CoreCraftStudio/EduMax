import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
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
    const { username, profileName, email, phone, type, password } = formData;
    if (!username || !profileName || !email || !phone || !password) {
      Alert.alert('Error', 'All fields are required.');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      const response: AuthResponse = await login(formData);

      // Check if the user exists
      if (!response.member) {
        throw new Error('User not found. Please sign up first.');
      }

      const { member, type, token } = response;

      console.log(`Member: ${member}`); // Example logging
      console.log(`Type: ${type}`);    // Example logging
      console.log(`Token: ${token}`);  // Example logging

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
          placeholder="Profile Name"
          value={formData.profileName}
          onChangeText={(value) => handleInputChange('profileName', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={formData.email}
          onChangeText={(value) => handleInputChange('email', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={formData.phone}
          onChangeText={(value) => handleInputChange('phone', value)}
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
