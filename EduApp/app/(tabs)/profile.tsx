import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity, Image } from 'react-native';

const Tab: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: 'https://your-profile-image-url.com' }} // Replace with your profile image URL
          style={styles.profileImage}
        />
        <Text style={styles.name}>Rashmika Rathnayaka</Text>
        <Text style={styles.title}>Computer Science Engineer</Text>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.infoTitle}>Email:</Text>
        <Text style={styles.infoText}>rashmikarathnayaka01@gmail.com</Text>

        <Text style={styles.infoTitle}>LinkedIn:</Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.linkedin.com/in/rashmikarathnayaka/')}>
          <Text style={styles.link}>View Profile</Text>
        </TouchableOpacity>

        <Text style={styles.infoTitle}>GitHub:</Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://github.com/rashG1')}>
          <Text style={styles.link}>View Repository</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  title: {
    fontSize: 16,
    color: '#666',
  },
  detailsContainer: {
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 5,
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  link: {
    fontSize: 16,
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
});

export default Tab;
