import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { addStudentToClassroom, deleteStudentFromClassroom } from '@/utilities/classroom/classroomApi';

type Student = {
  id: number;
  name: string;
  classroomId: number;
  email?: string;
};

export default function MyStudents() {
  const local = useLocalSearchParams();
  const classroomId = parseInt(local.classroomId as string, 10);

  const [students, setStudents] = useState<Student[]>([]);
  const [newStudentUsername, setNewStudentUsername] = useState('');
  const [removeStudentUsername, setRemoveStudentUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddStudent = async () => {
    if (newStudentUsername) {
      try {
        setLoading(true);
        const response = await addStudentToClassroom(newStudentUsername, classroomId);

        const newStudent: Student = {
          id: Date.now(), // Temporary unique ID
          name: response.username,
          classroomId,
        };

        setStudents(prevStudents => [...prevStudents, newStudent]);
        setNewStudentUsername('');
      } catch (error) {
        console.error('Error adding student:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRemoveStudent = async () => {
    if (removeStudentUsername) {
      try {
        setLoading(true);

        // Call API to delete student
        await deleteStudentFromClassroom(removeStudentUsername, classroomId);

        // Remove student from local state
        setStudents(prevStudents =>
          prevStudents.filter(student => student.name !== removeStudentUsername)
        );
        setRemoveStudentUsername('');
      } catch (error: any) {
        console.error('Error:', error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Students for Classroom ID: {classroomId}</Text>

      <View style={styles.addContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter student username to add"
          value={newStudentUsername}
          onChangeText={setNewStudentUsername}
        />
        <Button title="Add Student" onPress={handleAddStudent} />
      </View>

      <View style={styles.removeContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter student username to remove"
          value={removeStudentUsername}
          onChangeText={setRemoveStudentUsername}
        />
        <Button title="Remove Student" color="#d9534f" onPress={handleRemoveStudent} />
      </View>

      {loading ? (
        <Text>Loading...</Text>
      ) : students.length ? (
        <FlatList
          data={students}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.studentItem}>
              <Text style={styles.studentName}>
                {item.name} (Email: {item.email || 'N/A'})
              </Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.errorText}>No students in this classroom.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  addContainer: {
    marginBottom: 16,
  },
  removeContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    width: '100%',
    marginBottom: 8,
    fontSize: 16,
  },
  studentItem: {
    padding: 16,
    marginTop: 8,
    backgroundColor: '#f0f4f8',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  studentName: {
    fontSize: 18,
    color: '#333',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
