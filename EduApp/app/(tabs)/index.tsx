import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, FlatList, Modal, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const { username, type } = useLocalSearchParams(); // Retrieve params from the previous page
  const router = useRouter();

  // Define userType dynamically based on the type param
  const userType = type === 'teacher' ? 'teacher' : 'student';

  type Classroom = {
    id: number;
    name: string;
    subject: string;
    students: number;
    teacher: string;
  };

  const [classrooms, setClassrooms] = useState<Classroom[]>([
    { id: 1, name: 'Math 101', subject: 'Mathematics', students: 25, teacher: 'Mr. Johnson' },
    { id: 2, name: 'Physics 201', subject: 'Physics', students: 20, teacher: 'Dr. Smith' },
    { id: 3, name: 'History 101', subject: 'History', students: 18, teacher: 'Ms. Taylor' },
  ]);

  const [newClassroomName, setNewClassroomName] = useState('');
  const [newClassroomSubject, setNewClassroomSubject] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

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

  const handleCreateClassroom = () => {
    if (newClassroomName && newClassroomSubject) {
      const newId = classrooms.length > 0 ? Math.max(...classrooms.map(c => c.id)) + 1 : 1;
      const newClassroom: Classroom = {
        id: newId,
        name: newClassroomName,
        subject: newClassroomSubject,
        students: 0,
        teacher: username || 'You', // Use username from params
      };
      setClassrooms([newClassroom, ...classrooms]);
      setNewClassroomName('');
      setNewClassroomSubject('');
      setShowCreateModal(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">
        {`Welcome, ${username}!`}
      </ThemedText>
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
              <ThemedText>Subject: {item.subject}</ThemedText>
              <ThemedText>Students: {item.students}</ThemedText>
              {userType === 'student' && <ThemedText>Teacher: {item.teacher}</ThemedText>}
            </ThemedView>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.classroomList}
      />

      {/* Floating Action Button for Teachers */}
      {userType === 'teacher' && (
        <TouchableOpacity
          style={styles.fabButton}
          onPress={() => setShowCreateModal(true)}
          accessibilityLabel="Create a new classroom"
        >
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Modal for Creating Classroom */}
      {userType === 'teacher' && (
        <Modal
          visible={showCreateModal}
          animationType="slide"
          onRequestClose={() => setShowCreateModal(false)}
        >
          <ScrollView style={styles.modalContainer}>
            <ThemedText style={styles.modalTitle}>Create New Classroom</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Classroom Name"
              value={newClassroomName}
              onChangeText={setNewClassroomName}
            />
            <TextInput
              style={styles.input}
              placeholder="Subject"
              value={newClassroomSubject}
              onChangeText={setNewClassroomSubject}
            />
            <TouchableOpacity style={styles.createButton} onPress={handleCreateClassroom}>
              <Ionicons name="checkmark-circle-outline" size={24} color="#fff" />
              <ThemedText style={styles.createButtonText}>Create Classroom</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowCreateModal(false)}
            >
              <Ionicons name="close-circle-outline" size={24} color="#d9534f" />
              <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
            </TouchableOpacity>
          </ScrollView>
        </Modal>
      )}
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
  fabButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#007BFF',
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  modalContainer: { flex: 1, padding: 16, backgroundColor: '#fff' },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
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
  createButton: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  createButtonText: { fontSize: 16, color: '#fff', fontWeight: '600', marginLeft: 8 },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  cancelButtonText: { fontSize: 16, color: '#d9534f', fontWeight: '600', marginLeft: 8 },
  subtitle: { marginBottom: 12 },
});
