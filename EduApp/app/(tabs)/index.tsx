import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, FlatList, Modal, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { fetchClassrooms } from '@/utilities/classroom/classroomApi'; // Import classroom API function

export default function HomeScreen() {
  const { username, type, token } = useLocalSearchParams(); // Retrieve params from the previous page
  const router = useRouter();
  const userType = type === 'teacher' ? 'teacher' : 'student';

  type Classroom = {
    id: number;
    name: string;
    subject?: string; // Optional, for mock data
    students?: number; // Optional, for mock data
    teacher?: string; // Optional, for mock data
  };

  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true); // Loading state for API call
  const [error, setError] = useState<string | null>(null);

  // Fetch classrooms from the API
  useEffect(() => {
    const loadClassrooms = async () => {
      try {
        if (token) {
          const fetchedClassrooms = await fetchClassrooms(token as string);
          setClassrooms(fetchedClassrooms);
        }
      } catch (err) {
        setError('Failed to fetch classrooms.');
      } finally {
        setLoading(false);
      }
    };
    loadClassrooms();
  }, [token]);

  const handleClassroomPress = (id: number) => {
    if (userType === 'teacher') {
      router.push({
        pathname: `/TeacherType/[id]/ClassroomDetail`,
        params: { id, username },
      });
    } else if (userType === 'student') {
      router.push({
        pathname: `/StudentType/[id]/StudentClassroomDetail`,
        params: { id, username },
      });
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color="#007BFF" />
        <ThemedText>Loading classrooms...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>{error}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">{`Welcome, ${username}!`}</ThemedText>
      <ThemedText type="subtitle">
        {userType === 'teacher' ? 'Your Classrooms' : 'Enrolled Classrooms'}
      </ThemedText>

      <FlatList
        data={classrooms}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item.id}
            style={styles.classButton}
            onPress={() => handleClassroomPress(item.id)}
          >
            <ThemedView style={styles.classroomDetails}>
              <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
            </ThemedView>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.classroomList}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  classroomsContainer: { marginTop: 16, gap: 12 },
  classroomList: { marginBottom: 16 },
  classButton: {
    backgroundColor: '#f0f4f8',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  classroomDetails: { gap: 4 },
  subtitle: { marginBottom: 12 },
});
