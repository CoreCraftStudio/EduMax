import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  Button,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { fetchClassrooms, createClassroom, deleteClassroom } from '@/utilities/classroom/classroomApi';
import { useLocalSearchParams, useRouter } from 'expo-router';

type Classroom = {
  id: number;
  name: string;
};

export default function ClassroomsTab({ token }: { token: string }) {
  const local = useLocalSearchParams();
  const type = local.type; // Retrieve local search params
  const router = useRouter(); // Initialize the router for navigation
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newClassroomName, setNewClassroomName] = useState<string>('');

  console.log('User Type:', type); // Log user type for debugging

  // Fetch classrooms when the component mounts
  useEffect(() => {
    const loadClassrooms = async () => {
      try {
        const fetchedClassrooms = await fetchClassrooms();
        setClassrooms(fetchedClassrooms);
      } catch (err) {
        setError('Failed to fetch classrooms.');
      } finally {
        setLoading(false);
      }
    };
    loadClassrooms();
  }, [token]);

  // Handle classroom press with navigation
  const handleClassroomPress = (classroom: Classroom) => {
    router.push(`/${classroom.id}`); // Navigate to the respective route
    router.setParams({id:classroom.id}) // Log classroom name for debugging
  };
  
  // Handle create classroom (restricted to teacher type)
  const handleCreateClassroom = async () => {
    if (!newClassroomName.trim()) {
      Alert.alert('Invalid Input', 'Please provide a classroom name.');
      return;
    }

    try {
      const createdClassroom = await createClassroom({ name: newClassroomName });
      setClassrooms((prevClassrooms) => [...prevClassrooms, createdClassroom]);
      setNewClassroomName(''); // Clear input after successful creation
      Alert.alert('Classroom Created', `Classroom ${createdClassroom.name} created successfully.`);
    } catch (error) {
      setError('Failed to create classroom.');
    }
  };

  // Handle delete classroom (available for all types)
  const handleDeleteClassroom = async (classroomId: number) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this classroom?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              await deleteClassroom(classroomId);
              setClassrooms((prevClassrooms) => prevClassrooms.filter((classroom) => classroom.id !== classroomId));
              Alert.alert('Classroom Deleted', 'Classroom deleted successfully.');
            } catch (error) {
              setError('Failed to delete classroom.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Loading and error states
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Loading classrooms...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {type === 'teacher' && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter classroom name"
            value={newClassroomName}
            onChangeText={setNewClassroomName}
          />
          <Button title="Add Classroom" onPress={handleCreateClassroom} />
        </View>
      )}
      <SafeAreaView>
        <ScrollView contentContainerStyle={styles.classroomList}>
          {classrooms.map((item) => (
            <View key={item.id} style={styles.classroomItem}>
              <TouchableOpacity
                style={styles.classroomButton}
                onPress={() => handleClassroomPress(item)}
              >
                <Text style={styles.classroomButtonText}>{item.name}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteClassroom(item.id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#007BFF',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  classroomList: {
    marginTop: 20,
    paddingBottom: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  classroomButton: {
    padding: 16,
    backgroundColor: '#007BFF',
    marginBottom: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  classroomButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  classroomItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF4D4D',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
