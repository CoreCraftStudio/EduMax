import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { fetchQuizDetails, createAnswer } from '../../utilities/classroom/quizzApi';
import { QuizResponseDTO, AnswerSetRequestDTO, Question } from '../../utilities/classroom/quizzApi';

export default function DoQuizzes() {
  const { quizId } = useLocalSearchParams();
  const [quiz, setQuiz] = useState<QuizResponseDTO['quiz'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<any>({}); // Store selected answers

  useEffect(() => {
    const getQuizDetails = async () => {
      try {
        if (!quizId) {
          throw new Error('Quiz ID is missing.');
        }

        setLoading(true);
        const quizDetails = await fetchQuizDetails(Number(quizId));
        console.log('Quiz details:', quizDetails.quiz.questions);
        console.log('Quiz details:', quizDetails.quiz.questions.map((Question) => (Question.id)));
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

  const handleAnswerSelect = (questionId: number, answer: string, type: string) => {
    setSelectedAnswers((prev) => {
      const updatedAnswers = { ...prev };
      if (type === 'multiple-choice') {
        updatedAnswers[questionId] = [answer]; // For multiple-choice, only one answer
      } else if (type === 'multiple-response') {
        if (updatedAnswers[questionId]) {
          updatedAnswers[questionId].includes(answer)
            ? updatedAnswers[questionId].splice(updatedAnswers[questionId].indexOf(answer), 1)
            : updatedAnswers[questionId].push(answer);
        } else {
          updatedAnswers[questionId] = [answer];
        }
      }
      return updatedAnswers;
    });
  };
  
  const handleSubmit = async () => {
    try {
      // Create the AnswerSetRequestDTO based on the selected answers
      const answerSetRequestDTO: AnswerSetRequestDTO = {
        quizId: Number(quizId),
        answerSet: quiz?.questions.map((question) => ({
          questionId: question.id, // Use the questionId directly
          answers: selectedAnswers[question.id] || [], // Send the selected answer text, not the ID
        })) || [],
      };
  
      // Log the answer set for debugging purposes
      console.log('AnswerSetRequestDTO:', answerSetRequestDTO.answerSet.map((answer) => answer.answers));
  
      // Make the API call to submit answers
      const response = await createAnswer(answerSetRequestDTO);
      Alert.alert('Success', 'Your answers were submitted successfully.');
      console.log('Response from API:', response);
    } catch (error) {
      Alert.alert('Error', 'There was an issue submitting your answers.');
      console.error('Error submitting answers:', error);
    }
  };
  
  

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

            {/* Display answers as buttons */}
            {question.answers && question.answers.length > 0 && (
              <View style={styles.answersContainer}>
                {question.type === 'multiple-choice' ? (
                  question.answers.map((answer, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={[
                        styles.answerButton,
                        selectedAnswers[question.id]?.[0] === answer && styles.selectedAnswer,
                      ]}
                      onPress={() => handleAnswerSelect(question.id, answer, question.type)}
                    >
                      <Text>{answer}</Text>
                    </TouchableOpacity>
                  ))
                ) : question.type === 'multiple-response' ? (
                  question.answers.map((answer, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={[
                        styles.answerButton,
                        selectedAnswers[question.id]?.includes(answer) && styles.selectedAnswer,
                      ]}
                      onPress={() => handleAnswerSelect(question.id, answer, question.type)}
                    >
                      <Text>{answer}</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.errorText}>Unsupported question type</Text>
                )}
              </View>
            )}

            <Text style={styles.markText}>Marks Scored: {question.mark}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Answers</Text>
      </TouchableOpacity>
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
  answerButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  selectedAnswer: {
    backgroundColor: '#007BFF',
    color: '#fff',
  },
  markText: {
    fontSize: 14,
    color: '#007BFF',
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
