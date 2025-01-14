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
  description: string;
  questionType: string;
  answers: Answer[];
};

type Props = {
  classroomId: number;
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
    if (currentQuestionType === 'multiple-choice' || currentQuestionType === 'multiple-response') {
      setCurrentAnswers([
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
      ]);
    } else {
      setCurrentAnswers([{ text: '', isCorrect: true }]);
    }
  }, [currentQuestionType]);

  const isInputValid = (input: string) => input.trim().length > 0;

  const addQuestion = () => {
    if (!isInputValid(currentQuestion)) {
      Alert.alert('Error', 'Please enter a valid question.');
      return;
    }

    if (currentQuestionType === 'multiple-response') {
      const correctAnswersCount = currentAnswers.filter((ans) => ans.isCorrect).length;
      if (correctAnswersCount < 2) {
        Alert.alert('Error', 'Multiple-response questions require at least 2 correct answers.');
        return;
      }
    }

    if (currentAnswers.some((ans) => !isInputValid(ans.text))) {
      Alert.alert('Error', 'Please complete all answers.');
      return;
    }

    const questionToAdd: Question = {
      description: currentQuestion,
      questionType: currentQuestionType,
      answers:
        currentQuestionType === 'short-answer'
          ? [{ text: directAnswer, isCorrect: true }]
          : currentAnswers,
    };

    setQuestions((prev) => [...prev, questionToAdd]);
    resetInputs();
    Alert.alert('Success', 'Question added successfully!');
  };

  const resetInputs = () => {
    setCurrentQuestion('');
    setDirectAnswer('');
    if (currentQuestionType === 'multiple-choice' || currentQuestionType === 'multiple-response') {
      setCurrentAnswers([
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
      ]);
    } else {
      setCurrentAnswers([{ text: '', isCorrect: true }]);
    }
  };

  const handleMarkCorrect = (idx: number) => {
    if (currentQuestionType === 'multiple-choice') {
      setCurrentAnswers((prev) =>
        prev.map((answer, i) => ({
          ...answer,
          isCorrect: i === idx,
        }))
      );
    } else if (currentQuestionType === 'multiple-response') {
      setCurrentAnswers((prev) =>
        prev.map((answer, i) =>
          i === idx ? { ...answer, isCorrect: !answer.isCorrect } : answer
        )
      );
    }
  };

  const handleSubmit = async () => {
    if (!isInputValid(quizName) || questions.length === 0) {
      Alert.alert('Error', 'Quiz must have a name and at least one question.');
      return;
    }

    const quizRequestDTO = {
      name: quizName,
      description: 'This is a sample quiz to test knowledge on various subjects.',
      classroomId,
      questions: questions.map((q) => ({
        questionType: q.questionType,
        description: q.description,
        answers: q.answers.map((answer) => answer.text),
        matchAnswers: q.answers
          .filter((answer) => answer.isCorrect)
          .map((answer) => answer.text),
      })),
    };

    try {
      const response = await createquiz(quizRequestDTO);
      Alert.alert('Success', 'Quiz created successfully!');
      onSubmit(response?.quizzes[0]);
    } catch (error) {
      Alert.alert('Error', 'Unable to create quiz. Please try again.');
    }
  };

  const canAddAnswer =
    currentQuestionType === 'multiple-response' &&
    currentAnswers.length < 10 &&
    currentAnswers[currentAnswers.length - 1]?.text.trim() !== '';

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
      {/* Question type selection */}
      <View style={styles.typeSelector}>
        {['multiple-choice', 'multiple-response', 'short-answer'].map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => setCurrentQuestionType(type)}
            style={[
              styles.typeButton,
              currentQuestionType === type && styles.activeTypeButton,
            ]}
          >
            <Text
              style={[
                styles.typeButtonText,
                currentQuestionType === type && styles.activeTypeButtonText,
              ]}
            >
              {type.replace('-', ' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Answers */}
      {['multiple-choice', 'multiple-response'].includes(currentQuestionType) ? (
        <>
          {currentAnswers.map((ans, idx) => (
            <View key={idx} style={styles.answerContainer}>
              <TextInput
                style={[
                  styles.input,
                  ans.isCorrect && { borderColor: '#28a745', borderWidth: 2 },
                ]}
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
                onPress={() => handleMarkCorrect(idx)}
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
          ))}
          {currentQuestionType === 'multiple-response' && canAddAnswer && (
            <TouchableOpacity
              style={styles.addAnswerButton}
              onPress={() =>
                setCurrentAnswers((prev) => [...prev, { text: '', isCorrect: false }])
              }
            >
              <Text style={styles.buttonText}>Add Answer</Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <TextInput
          style={styles.input}
          placeholder="Type the correct answer"
          value={directAnswer}
          onChangeText={setDirectAnswer}
        />
      )}
      {/* Buttons */}
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
    backgroundColor: '#F3F4F6',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTypeButton: {
    backgroundColor: '#3B82F6',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#1F2937',
  },
  activeTypeButtonText: {
    color: '#FFFFFF',
  },
  answerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  correctButton: {
    marginLeft: 8,
    padding: 8,
    backgroundColor: '#9CA3AF',
    borderRadius: 8,
  },
  addAnswerButton: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#10B981',
    borderRadius: 8,
    alignItems: 'center',
  },
  button: {
    padding: 12,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  cancelButton: {
    padding: 12,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
