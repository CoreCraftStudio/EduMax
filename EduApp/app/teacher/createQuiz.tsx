import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from 'react-native';
import { createquiz, Question, QuizRequestDTO } from '../../utilities/classroom/quizzApi';

type Answer = {
  text: string;
  isCorrect: boolean;
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
  const [currentAnswers, setCurrentAnswers] = useState<Answer[]>([]);
  const [directAnswer, setDirectAnswer] = useState('');
  const [matchAnswers, setMatchAnswers] = useState<string[]>([]); // Store correct answers dynamically

  useEffect(() => {
    resetAnswers();
  }, [currentQuestionType]);

  const resetAnswers = () => {
    if (['multiple-choice', 'multiple-response'].includes(currentQuestionType)) {
      setCurrentAnswers([
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
      ]);
    } else {
      setCurrentAnswers([{ text: '', isCorrect: true }]);
    }
    setMatchAnswers([]); // Reset matchAnswers when the question type changes
  };

  const isInputValid = (input: string) => input.trim().length > 0;

  const addQuestion = () => {
    if (!isInputValid(currentQuestion)) {
      Alert.alert('Error', 'Please enter a valid question.');
      return;
    }

    if (['multiple-choice', 'multiple-response'].includes(currentQuestionType)) {
      if (currentAnswers.some((ans) => !isInputValid(ans.text))) {
        Alert.alert('Error', 'Please complete all answers.');
        return;
      }
      if (
        currentQuestionType === 'multiple-response' &&
        currentAnswers.filter((ans) => ans.isCorrect).length < 2
      ) {
        Alert.alert('Error', 'Multiple-response questions require at least 2 correct answers.');
        return;
      }
      if (
        currentQuestionType === 'multiple-choice' &&
        currentAnswers.filter((ans) => ans.isCorrect).length !== 1
      ) {
        Alert.alert('Error', 'Multiple-choice questions require exactly one correct answer.');
        return;
      }
    }

    const questionToAdd: Question = {
      id: 1,
      question: currentQuestion,
      type: currentQuestionType,
      answers: currentAnswers.map((ans) => ans.text),
      matchAnswers: matchAnswers, // Use the updated matchAnswers array
      selectedAnswers: [],
      mark: 0, // Default mark set to 0
    };

    setQuestions((prev) => [...prev, questionToAdd]);
    resetInputs();
    Alert.alert('Success', 'Question added successfully!');
  };

  const handleMarkCorrect = (idx: number) => {
    setCurrentAnswers((prev) => {
      // For multiple-choice questions, only allow one correct answer at a time
      if (currentQuestionType === 'multiple-choice') {
        const updatedAnswers = prev.map((answer, i) => ({
          ...answer,
          isCorrect: i === idx ? !answer.isCorrect : false, // Only one correct answer allowed
        }));
        setCurrentAnswers(updatedAnswers);
        setMatchAnswers([updatedAnswers[idx].text]); // Set matchAnswers with the correct answer only
        return updatedAnswers;
      }

      // For other question types, toggle the correctness of the selected answer
      const updatedAnswers = prev.map((answer, i) =>
        i === idx ? { ...answer, isCorrect: !answer.isCorrect } : answer
      );
      const updatedMatchAnswers = updatedAnswers
        .filter((ans) => ans.isCorrect)
        .map((ans) => ans.text);

      setCurrentAnswers(updatedAnswers);
      setMatchAnswers(updatedMatchAnswers);
      return updatedAnswers;
    });
  };

  const handleSubmit = async () => {
    if (!isInputValid(quizName) || questions.length === 0) {
      Alert.alert('Error', 'Quiz must have a name and at least one question.');
      return;
    }

    const QuizRequestDTO: QuizRequestDTO = {
      name: quizName,
      classroomId,
      description: 'A quiz created in the classroom',
      questions: questions.map((q) => ({
        type: q.type,
        question: q.question,
        answers: q.answers,
        matchAnswers: q.matchAnswers,
        mark: q.mark,
        selectedAnswers: q.selectedAnswers,
      })),
    };

    try {
      const response = await createquiz(QuizRequestDTO);
      Alert.alert('Success', 'Quiz created successfully!');
      onSubmit(response?.quizzes[0]);
    } catch (error) {
      console.error('Error creating quiz:', error);
      Alert.alert('Error', 'Unable to create quiz. Please try again.');
    }
  };

  const canAddAnswer =
    currentQuestionType === 'multiple-response' &&
    currentAnswers.length < 10 &&
    currentAnswers[currentAnswers.length - 1]?.text.trim() !== '';

  const resetInputs = () => {
    setCurrentQuestion('');
    setDirectAnswer('');
    resetAnswers();
  };

  return (
    <ImageBackground
      source={require('../../assets/images/5.jpg')} // Add the path to your image
      style={styles.backgroundImage}
    >
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
            {canAddAnswer && (
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    padding: 16,
  },
  scrollContainer: {
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
