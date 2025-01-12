import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Modal, FlatList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { addStudentToClassroom, dropStudentFromClassroom } from '@/utilities/classroom/classroomApi';

type Student = {
  id: number;
  name: string;
  classroomId: number;
  email?: string;
};

export default function MyStudents() {
  const local = useLocalSearchParams();
  const classroomId = parseInt(local.classroomId as string, 10);

  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentUsername, setNewStudentUsername] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch students for the classroom
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/classrooms/${classroomId}/students`);
      const data = await response.json();

      // Transform the response to match the Student type
      const students = data.students.map((student: any) => ({
        id: Date.now(), // Temporary unique ID
        name: student.username,
        classroomId: classroomId,
        email: student.email,
      }));

      setFilteredStudents(students);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(); // Fetch students when component mounts or classroomId changes
  }, [classroomId]);

  const handleAddStudent = async () => {
    if (newStudentUsername) {
      try {
        setLoading(true);
        const response = await addStudentToClassroom(newStudentUsername, classroomId); // Call API to add student

        // Extract the username from the response and update the state
        const addedStudent = response.students[0];
        const newStudent: Student = {
          id: Date.now(), // Generate a temporary unique ID
          name: addedStudent.username,
          classroomId: classroomId,
          email: addedStudent.email, // Optional field if available
        };

        // Update the list of students
        setFilteredStudents(prevStudents => [...prevStudents, newStudent]);

        setNewStudentUsername('');
        setShowAddStudentModal(false);
      } catch (error) {
        console.error('Error adding student:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRemoveStudent = async (studentUsername: string) => {
    try {
      setLoading(true);
      await dropStudentFromClassroom(studentUsername, classroomId); // Call API to remove student
      fetchStudents(); // Fetch all students after removing a student
    } catch (error) {
      console.error('Error removing student:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Students for Classroom ID: {classroomId}</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddStudentModal(true)}
      >
        <Ionicons name="add-circle-outline" size={24} color="#007BFF" />
        <Text style={styles.addButtonText}>Add Student</Text>
      </TouchableOpacity>

      {loading ? (
        <Text>Loading...</Text>
      ) : filteredStudents.length ? (
        <FlatList
          data={filteredStudents}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.studentItem}>
              <Text style={styles.studentName}>
                {item.name} (Email: {item.email || 'N/A'})
              </Text>
              <TouchableOpacity onPress={() => handleRemoveStudent(item.email || '')} style={styles.removeButton}>
                <Ionicons name="trash-outline" size={24} color="#d9534f" />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text style={styles.errorText}>No students found for this classroom.</Text>
      )}

      <Modal
        visible={showAddStudentModal}
        animationType="slide"
        onRequestClose={() => setShowAddStudentModal(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add New Student</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter student username"
            value={newStudentUsername}
            onChangeText={setNewStudentUsername}
          />
          <Button title="Add Student" onPress={handleAddStudent} />
          <Button
            title="Cancel"
            color="#d9534f"
            onPress={() => setShowAddStudentModal(false)}
          />
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    width: '100%',
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginLeft: -19,
  },
  removeButton: {
    padding: 8,
  },
});
