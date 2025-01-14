import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { getQuizzes } from '../../utilities/classroom/quizzApi';

export default function MyQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter(); // Hook to navigate between pages
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

  const handleQuizClick = (quizId) => {
    // Navigate to the do-quizzes page with the quizId as a parameter
    router.push({
      pathname: './do-quizzes', // Path to the do-quizzes.tsx file
      params: { quizId }, // Pass the quizId as a parameter
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Quizzes</Text>

      <TouchableOpacity style={styles.refreshButton} onPress={fetchQuizzes}>
        <Icon name="refresh" size={24} color="#007BFF" />
        <Text style={styles.refreshText}>Refresh</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : quizzes.length > 0 ? (
        <View style={styles.buttonContainer}>
          {quizzes.map((quiz) => (
            <TouchableOpacity
              key={quiz.id}
              style={styles.quizButton}
              onPress={() => handleQuizClick(quiz.id)}
            >
              <Text style={styles.buttonText}>{quiz.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <Text style={styles.noQuizzes}>No quizzes available.</Text>
      )}
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
    textAlign: 'center',
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
  noQuizzes: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quizButton: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
