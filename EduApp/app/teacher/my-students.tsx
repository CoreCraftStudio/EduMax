import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import {
  getStudentOfClassroom,
  addStudentToClassroom,
  deleteStudentFromClassroom,
} from '@/utilities/classroom/classroomApi';
import Icon from 'react-native-vector-icons/FontAwesome';

type Student = {
  id: number;
  name: string;
};

export default function MyStudents() {
  const local = useLocalSearchParams();
  const classroomId = parseInt(local.classroomId as string, 10);

  const [students, setStudents] = useState<Student[]>([]);
  const [newStudentUsername, setNewStudentUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch students initially and when students are added or removed
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await getStudentOfClassroom(classroomId);

      if (data?.students) {
        const studentList = data.students.map((student: any) => ({
          id: Date.now() + Math.random(), // Temporary ID for now
          name: student.username,
        }));
        setStudents(studentList);
      } else {
        setError('No students found for this classroom.');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching students.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch students on page load
  useEffect(() => {
    fetchStudents(); // Fetch students when the page loads
  }, [classroomId]); // Re-fetch if classroomId changes

  // Handle adding a student
  const handleAddStudent = async () => {
    if (newStudentUsername) {
      try {
        setLoading(true);
        const response = await addStudentToClassroom(newStudentUsername, classroomId);
        const newStudent: Student = {
          id: Date.now(),
          name: response.username,
        };
        setStudents((prevStudents) => [...prevStudents, newStudent]);
        setNewStudentUsername('');
        setError(null);
        Alert.alert('Success', 'Student added successfully!');
        // Refetch students after adding
        fetchStudents();
      } catch (error: any) {
        setError(error.message || 'Error adding student.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle removing a student
  const handleRemoveStudent = async (username: string) => {
    try {
      setLoading(true);
      await deleteStudentFromClassroom(username, classroomId);
      setStudents((prevStudents) => prevStudents.filter((student) => student.name !== username));
      setError(null);
      Alert.alert('Success', 'Student removed successfully!');
      // Refetch students after removing
      fetchStudents();
    } catch (error: any) {
      setError(error.message || 'Error removing student.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Students for Classroom ID: {classroomId}</Text>

      {/* Add Student Section */}
      <View style={styles.addContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter student username to add"
          value={newStudentUsername}
          onChangeText={setNewStudentUsername}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddStudent}>
          <Icon name="plus-circle" size={30} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : students.length ? (
        <FlatList
          data={students}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.studentItem}>
              <Text style={styles.studentName}>{item.name}</Text>
              <TouchableOpacity
                onPress={() => handleRemoveStudent(item.name)}
                style={styles.removeButton}
              >
                <Icon name="trash" size={24} color="#d9534f" />
              </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  addButton: {
    marginLeft: 12,
  },
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginTop: 8,
    backgroundColor: '#f0f4f8',
    borderRadius: 8,
  },
  studentName: {
    fontSize: 18,
    color: '#333',
  },
  removeButton: {
    padding: 8,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
