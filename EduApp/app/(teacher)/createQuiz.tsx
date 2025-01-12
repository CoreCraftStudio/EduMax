import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

type Answer = {
  text: string;
  isCorrect: boolean;
};

type Question = {
  question: string;
  questionType: string;
  answers: Answer[];
};

type Props = {
  onSubmit: (quiz: any) => void;
  onCancel: () => void;
};

export default function CreateQuizScreen({ onSubmit, onCancel }: Props) {
  const [quizName, setQuizName] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentQuestionType, setCurrentQuestionType] = useState('multiple-choice');
  const [currentAnswers, setCurrentAnswers] = useState<Answer[]>([
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ]);
  const [directAnswer, setDirectAnswer] = useState(''); // For direct answer questions

  const addQuestion = () => {
    if (!currentQuestion) {
      Alert.alert('Error', 'Please enter the question.');
      return;
    }

    if (
      currentQuestionType === 'multiple-choice' &&
      currentAnswers.some((ans) => ans.text === '')
    ) {
      Alert.alert('Error', 'Please complete all answers.');
      return;
    }

    if (currentQuestionType === 'type-answer' && !directAnswer) {
      Alert.alert('Error', 'Please provide the correct answer.');
      return;
    }

    const questionToAdd: Question = {
      question: currentQuestion,
      questionType: currentQuestionType,
      answers:
        currentQuestionType === 'multiple-choice'
          ? currentAnswers
          : [{ text: directAnswer, isCorrect: true }],
    };

    setQuestions((prev) => [...prev, questionToAdd]);

    // Reset fields for the next question
    setCurrentQuestion('');
    setCurrentAnswers([
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
    ]);
    setDirectAnswer('');
  };

  const handleSubmit = () => {
    if (!quizName || questions.length === 0) {
      Alert.alert('Error', 'Quiz must have a name and at least one question.');
      return;
    }
    onSubmit({
      id: Date.now(),
      title: quizName,
      questions,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Create a New Quiz</Text>
      <TextInput
        style={styles.input}
        placeholder="Quiz Name"
        value={quizName}
        onChangeText={setQuizName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Question"
        value={currentQuestion}
        onChangeText={setCurrentQuestion}
      />

      {/* Question Type Selection */}
      <View style={styles.typeSelector}>
        <TouchableOpacity
          onPress={() => setCurrentQuestionType('multiple-choice')}
          style={[
            styles.typeButton,
            currentQuestionType === 'multiple-choice' && styles.activeTypeButton,
          ]}
        >
          <Text
            style={[
              styles.typeButtonText,
              currentQuestionType === 'multiple-choice' && styles.activeTypeButtonText,
            ]}
          >
            Multiple Choice
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setCurrentQuestionType('type-answer')}
          style={[
            styles.typeButton,
            currentQuestionType === 'type-answer' && styles.activeTypeButton,
          ]}
        >
          <Text
            style={[
              styles.typeButtonText,
              currentQuestionType === 'type-answer' && styles.activeTypeButtonText,
            ]}
          >
            Type Answer
          </Text>
        </TouchableOpacity>
      </View>

      {/* Answer Input Section */}
      {currentQuestionType === 'multiple-choice' ? (
        currentAnswers.map((ans, idx) => (
          <View key={idx} style={styles.answerContainer}>
            <TextInput
              style={styles.input}
              placeholder={`Answer ${idx + 1}`}
              value={ans.text}
              onChangeText={(text) =>
                setCurrentAnswers((prev) => {
                  const updated = [...prev];
                  updated[idx].text = text;
                  return updated;
                })
              }
            />
            <TouchableOpacity
              onPress={() =>
                setCurrentAnswers((prev) => {
                  const updated = [...prev];
                  updated[idx].isCorrect = !updated[idx].isCorrect;
                  return updated;
                })
              }
              style={[
                styles.correctButton,
                ans.isCorrect && { backgroundColor: '#28a745' },
              ]}
            >
              <Text style={styles.buttonText}>
                {ans.isCorrect ? 'Correct' : 'Mark Correct'}
              </Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <TextInput
          style={styles.input}
          placeholder="Type the correct answer"
          value={directAnswer}
          onChangeText={setDirectAnswer}
        />
      )}

      <TouchableOpacity
        style={styles.addAnswerButton}
        onPress={() =>
          currentQuestionType === 'multiple-choice' && setCurrentAnswers((prev) => [...prev, { text: '', isCorrect: false }])
        }
        disabled={currentQuestionType !== 'multiple-choice'}
      >
        <Text style={styles.buttonText}>Add Answer</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={addQuestion}>
        <Text style={styles.buttonText}>Add Question</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Quiz</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  title: {
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
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  typeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#007BFF',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  activeTypeButton: {
    backgroundColor: '#007BFF',
  },
  typeButtonText: {
    fontSize: 16,
    color: '#007BFF',
  },
  activeTypeButtonText: {
    color: '#fff',
  },
  answerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  correctButton: {
    marginLeft: 8,
    padding: 8,
    backgroundColor: '#007BFF',
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  addAnswerButton: {
    backgroundColor: '#5bc0de',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#d9534f',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
});
