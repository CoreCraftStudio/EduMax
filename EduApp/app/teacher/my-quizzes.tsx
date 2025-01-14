import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CreateQuizScreen from './createQuiz';
import { useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native'; // Import for component focus
import { getQuizzes, deleteQuiz } from '../../utilities/classroom/quizzApi'; // Adjust the path if necessary

export default function MyQuizzes() {
  const [quizzes, setQuizzes] = useState([]); // Holds the list of quizzes
  const [isModalVisible, setModalVisible] = useState(false); // Modal visibility state
  const [loading, setLoading] = useState(true); // Loading state

  const local = useLocalSearchParams();
  const classroomId = parseInt(local.classroomId as string, 10);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await getQuizzes(classroomId); // Fetch quizzes
      setQuizzes(response.quizzes); // Update the quizzes arrayA
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false); // Stop loading after fetch
    }
  };

  // Fetch quizzes when the component gains focus
  useFocusEffect(
    useCallback(() => {
      fetchQuizzes(); // Poll quizzes when the screen is focused
    }, [classroomId])
  );

  const addQuiz = async (newQuiz) => {
    setQuizzes((prev) => [...prev, newQuiz]); // Optimistically update quizzes
    setModalVisible(false); // Close the modal
    await fetchQuizzes(); // Fetch quizzes after adding a new one
  };

  const handleDelete = async (quizId) => {
    Alert.alert(
      'Delete Quiz',
      'Are you sure you want to delete this quiz?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteQuiz(quizId); // Call the deleteQuiz function
              setQuizzes((prev) => prev.filter((quiz) => quiz.id !== quizId)); // Optimistically update UI
              await fetchQuizzes(); // Fetch quizzes after deletion
            } catch (error) {
              console.error('Error deleting quiz:', error);
              Alert.alert('Error', 'Failed to delete quiz. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Quizzes</Text>

      {/* Refresh Button */}
      <TouchableOpacity style={styles.refreshButton} onPress={fetchQuizzes}>
        <Icon name="refresh" size={24} color="#007BFF" />
        <Text style={styles.refreshText}>Refresh</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : quizzes.length > 0 ? (
        <FlatList
          data={quizzes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.quizItem}>
              <Text style={styles.quizName}>{item.name}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)}
              >
                <Icon name="trash" size={24} color="#FF0000" />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noQuizzes}>No quizzes available.</Text>
      )}

      {/* Only show the plus sign for creating a quiz */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Icon name="add-circle" size={56} color="#007BFF" />
      </TouchableOpacity>

      {/* Modal for creating a quiz */}
      <Modal visible={isModalVisible} animationType="slide">
        <CreateQuizScreen
          classroomId={classroomId} // Passing classroomId as a prop
          onSubmit={(quiz) => addQuiz(quiz)}
          onCancel={() => setModalVisible(false)}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center', // Center the title
  },
  quizItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quizName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
    flex: 1, // Take available space
    marginRight: 16, // Space between text and delete icon
  },
  deleteButton: {
    backgroundColor: '#FFCCCC', // Light red background for visibility
    padding: 10,
    borderRadius: 50, // Circular button
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF0000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  noQuizzes: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20, // Add spacing above
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  refreshText: {
    fontSize: 16,
    color: '#007BFF',
    marginLeft: 8,
  },
});
