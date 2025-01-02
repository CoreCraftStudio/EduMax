import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { signup, AuthRequest, AuthResponse } from '@/utilities/authApi';

const SignupScreen: React.FC = () => {
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

  const handleSignup = async () => {
    try {
      const response: AuthResponse = await signup(formData); // Ensure response matches AuthResponse type
      const { member } = response; // Extract the member object from the response
      Alert.alert('Success', `Signup successful! Welcome, ${member.username || formData.username}.`);
      
      // Navigate to login screen after successful signup
      router.push('./login');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.';
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
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
        placeholder="Type (teacher/student)"
        value={formData.type}
        onChangeText={(value) => handleInputChange('type', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={formData.password}
        onChangeText={(value) => handleInputChange('password', value)}
      />
      <Button title="Sign Up" onPress={handleSignup} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 },
});

export default SignupScreen;
