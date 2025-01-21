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
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { signup, AuthRequest, AuthResponse } from '@/utilities/authApi';

const SignupScreen: React.FC = () => {
  const [formData, setFormData] = useState<AuthRequest>({
    username: '',
    profileName: '',
    email: '',
    phone: '',
    type: '', // Will be set from Picker
    password: '',
  });
  const [loading, setLoading] = useState(false); // State to handle button disabling/loading
  const router = useRouter();

  const handleInputChange = (field: keyof AuthRequest, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSignup = async () => {
    setLoading(true); // Set loading to true to disable the button
    try {
      const response: AuthResponse = await signup(formData);
      const { username, profileName } = response;

      Alert.alert('Success', `Signup successful! Welcome, ${profileName || username}.`);
      router.push('/login'); // Redirect to login screen
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Signup failed. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false); // Reset loading state after completion
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Sign Up</Text>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="black"
          value={formData.username}
          onChangeText={(value) => handleInputChange('username', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Profile Name"
          placeholderTextColor="black"
          value={formData.profileName}
          onChangeText={(value) => handleInputChange('profileName', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="black"
          value={formData.email}
          onChangeText={(value) => handleInputChange('email', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          placeholderTextColor="black"
          value={formData.phone}
          onChangeText={(value) => handleInputChange('phone', value)}
        />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.type}
            onValueChange={(itemValue) => handleInputChange('type', itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Type" value="" />
            <Picker.Item label="Student" value="student" />
            <Picker.Item label="Teacher" value="teacher" />
            <Picker.Item label="Parent" value="parent" />
          </Picker>
        </View>
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
          onPress={handleSignup}
          disabled={loading} // Disable button when loading
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'black',
  },
  formContainer: {
    width: '100%',
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    fontSize: 16,
    height: 55,
    color: 'black',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 55,
    width: '100%',
    color: 'black',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#81C784', // Light green when button is disabled
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default SignupScreen;
