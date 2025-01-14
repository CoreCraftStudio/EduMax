import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { fetchQuizDetails } from '../../utilities/classroom/quizzApi';
import { QuizResponseDTO } from '../../utilities/classroom/quizzApi';

export default function DoQuizzes() {
  const { quizId } = useLocalSearchParams();
  const [quiz, setQuiz] = useState<QuizResponseDTO['quiz'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getQuizDetails = async () => {
      try {
        if (!quizId) {
          throw new Error('Quiz ID is missing.');
        }

        setLoading(true);
        const quizDetails = await fetchQuizDetails(Number(quizId));
        setQuiz(quizDetails.quiz);
      } catch (error) {
        console.error('Error fetching quiz details:', error);
        Alert.alert('Error', 'Unable to fetch quiz details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getQuizDetails();
  }, [quizId]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (!quiz) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Unable to load the quiz details.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{quiz.name}</Text>
      <Text style={styles.subtitle}>Total Marks: {quiz.totalMark}</Text>
      <Text style={styles.subtitle}>Maximum Marks: {quiz.maxMarks}</Text>

      <View style={styles.questionsContainer}>
        {quiz.questions.map((question, index) => (
          <View key={index} style={styles.questionCard}>
            <Text style={styles.questionText}>
              Q{index + 1}: {question.question}
            </Text>
            <Text style={styles.questionType}>Type: {question.type}</Text>

            {(question.answers || []).length > 0 && (
  <View style={styles.answersContainer}>
    <Text style={styles.answersTitle}>Answers:</Text>
    {(question.answers || []).map((answer, idx) => (
      <Text key={idx} style={styles.answerText}>
        - {answer}
      </Text>
    ))}
  </View>
)}

{(question.matchAnswers || []).length > 0 && (
  <View style={styles.matchAnswersContainer}>
    <Text style={styles.answersTitle}>Matching Answers:</Text>
    {(question.matchAnswers || []).map((matchAnswer, idx) => (
      <Text key={idx} style={styles.answerText}>
        - {matchAnswer}
      </Text>
    ))}
  </View>
)}

{(question.selectedAnswers || []).length > 0 && (
  <View style={styles.selectedAnswersContainer}>
    <Text style={styles.answersTitle}>Selected Answers:</Text>
    {(question.selectedAnswers || []).map((selected, idx) => (
      <Text key={idx} style={styles.answerText}>
        - {selected}
      </Text>
    ))}
  </View>
)}

            <Text style={styles.markText}>Marks Scored: {question.mark}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#FF0000',
    textAlign: 'center',
  },
  questionsContainer: {
    marginTop: 16,
  },
  questionCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  questionType: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  answersContainer: {
    marginTop: 8,
  },
  matchAnswersContainer: {
    marginTop: 8,
  },
  selectedAnswersContainer: {
    marginTop: 8,
  },
  answersTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  answerText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  markText: {
    fontSize: 14,
    color: '#007BFF',
    marginTop: 8,
  },
});
