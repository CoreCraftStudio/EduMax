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
  ImageBackground, // Import ImageBackground
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CreateQuizScreen from './createQuiz';
import { useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getQuizzes, deleteQuiz } from '../../utilities/classroom/quizzApi';

export default function MyQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const local = useLocalSearchParams();
  const classroomId = parseInt(local.classroomId as string, 10);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await getQuizzes(classroomId);
      setQuizzes(response.quizzes);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchQuizzes();
    }, [classroomId])
  );

  const addQuiz = async (newQuiz) => {
    setQuizzes((prev) => [...prev, newQuiz]);
    setModalVisible(false);
    await fetchQuizzes();
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
              await deleteQuiz(quizId);
              setQuizzes((prev) => prev.filter((quiz) => quiz.id !== quizId));
              await fetchQuizzes();
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
    <ImageBackground
      source={require('../../assets/images/5.jpg')} // Path to your background image
      style={[styles.backgroundImage, { opacity: 0.9 }]} // Adjust opacity for transparency
      resizeMode="cover" // Ensures the image covers the entire screen
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Icon name="cube-outline" size={40} color="#007BFF" />
          <Text style={styles.title}>Quizzes</Text>
        </View>

        {/* Refresh Button */}
        <TouchableOpacity style={styles.refreshButton} onPress={fetchQuizzes}>
          <Icon name="refresh" size={24} color="#007BFF" />
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>

        {/* Quizzes List */}
        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" />
        ) : quizzes.length > 0 ? (
          <FlatList
            data={quizzes}
            keyExtractor={(item) => item.id.toString()}
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

        {/* Add Quiz Floating Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setModalVisible(true)}
        >
          <Icon name="create-outline" size={64} color="black" />
        </TouchableOpacity>

        {/* Create Quiz Modal */}
        <Modal visible={isModalVisible} animationType="slide">
          <CreateQuizScreen
            classroomId={classroomId}
            onSubmit={(quiz) => addQuiz(quiz)}
            onCancel={() => setModalVisible(false)}
          />
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  backgroundImage: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#000',
    textAlign: 'center',
  },
  quizItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quizName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    marginRight: 16,
  },
  deleteButton: {
    padding: 10,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noQuizzes: {
    textAlign: 'center',
    fontSize: 16,
    color: '#000',
    marginTop: 20,
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
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#E6F2FF',
  },
  refreshText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 8,
  },
});
