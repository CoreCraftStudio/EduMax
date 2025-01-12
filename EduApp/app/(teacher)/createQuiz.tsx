import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { createquiz } from '../../utilities/classroom/quizzApi';

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
  classroomId: number; // Receiving classroomId as a prop
  onSubmit: (quiz: any) => void;
  onCancel: () => void;
};

export default function CreateQuizScreen({ classroomId, onSubmit, onCancel }: Props) {
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
  const [directAnswer, setDirectAnswer] = useState('');

  useEffect(() => {
    if (!classroomId) {
      Alert.alert('Error', 'Classroom ID is required to create a quiz.');
    }
  }, [classroomId]);

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

  const handleSubmit = async () => {
    if (!quizName || questions.length === 0) {
      Alert.alert('Error', 'Quiz must have a name and at least one question.');
      return;
    }

    const QuizRequestDTO = {
      title: quizName,
      name: quizName,
      description: 'This is a sample quiz to test knowledge on various subjects.',
      classroomId: classroomId, // Use the classroomId passed as prop
      questions: questions.map((q) => ({
        questionType: q.questionType,
        description: q.question,
        answers: q.answers.map((answer) => answer.text),
        matchAnswers: q.answers
          .filter((answer) => answer.isCorrect)
          .map((answer) => answer.text),
      })),
    };

    try {
      const createdQuiz = await createquiz(QuizRequestDTO);
      Alert.alert('Success', 'Quiz created successfully!');
      console.log('Created Quiz:', createdQuiz);
    } catch (error) {
      Alert.alert('Error', 'Unable to create quiz. Please try again.');
      console.error('Error creating quiz:', error);
    }
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
    borderRadius: 8,
    backgroundColor: '#ddd',
    alignItems: 'center',
  },
  activeTypeButton: {
    backgroundColor: '#007BFF',
  },
  typeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  activeTypeButtonText: {
    color: '#fff',
  },
  answerContainer: {
    marginBottom: 12,
  },
  correctButton: {
    marginTop: 8,
    backgroundColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  addAnswerButton: {
    backgroundColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
});
