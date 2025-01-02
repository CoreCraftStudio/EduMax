import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const ClassroomPage: React.FC = () => {
  const { username, type } = useLocalSearchParams(); // Retrieve params

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {username}!</Text>
      <Text style={styles.subtitle}>Role: {type}</Text>

      <Text style={styles.header}>Your Classrooms:</Text>
      {type === 'teacher' ? (
        <View>
          <Text>- Math Class</Text>
          <Text>- Science Class</Text>
          <Text>- History Class</Text>
        </View>
      ) : (
        <View>
          <Text>- Algebra Class</Text>
          <Text>- Physics Class</Text>
          <Text>- World History Class</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default ClassroomPage;
