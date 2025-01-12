import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CreateQuizScreen from './createQuiz';

type Answer = {
  text: string;
  isCorrect: boolean;
};

type Question = {
  question: string;
  answers: Answer[];
};

type Quiz = {
  id: number;
  title: string;
  questions: Question[];
};

export default function MyQuizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);

  const addQuiz = (newQuiz: Quiz) => {
    setQuizzes((prev) => [...prev, newQuiz]); // Add the new quiz to the list
    setModalVisible(false); // Close the modal
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Quizzes</Text>

      {quizzes.length > 0 ? (
        <FlatList
          data={quizzes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.quizItem}>
              <Text style={styles.quizTitle}>{item.title}</Text>
              {item.questions.map((q, index) => (
                <View key={index}>
                  <Text style={styles.questionText}>Q: {q.question}</Text>
                  {q.answers.map((ans, idx) => (
                    <Text key={idx} style={styles.answerText}>
                      {ans.text} - {ans.isCorrect ? 'Correct' : 'Incorrect'}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          )}
        />
      ) : (
        <Text style={styles.errorText}>No quizzes created yet!</Text>
      )}

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Icon name="add-circle" size={56} color="#007BFF" />
      </TouchableOpacity>

      <Modal visible={isModalVisible} animationType="slide">
        <CreateQuizScreen
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
  },
  quizItem: {
    padding: 16,
    marginTop: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  quizTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0056b3',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#444',
    marginTop: 8,
  },
  answerText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  errorText: {
    fontSize: 18,
    color: '#d9534f',
    textAlign: 'center',
    marginTop: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});
