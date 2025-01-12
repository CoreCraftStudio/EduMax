import * as SecureStore from 'expo-secure-store';
import api from '../api';

export interface QuizRequestDTO {
  title: string;
  description: string;
  // Add other fields as per your requirements
}

export interface AnswerSetRequestDTO {
  quizId: number;
  answers: string[];
  // Add other fields related to answers
}

export interface QuizResponseDTO {
  quizId: number;
  title: string;
  description: string;
  // Add other fields based on your response structure
}

// Function to get the token from Secure Store
const getToken = async (): Promise<string> => {
  const token = await SecureStore.getItemAsync('userToken');
  if (!token) {
    throw new Error('Token not found. Please login again.');
  }
  return token;
};

// Function to create a quiz
export const createquiz = async (quizRequestDTO: QuizRequestDTO): Promise<QuizResponseDTO> => {
  try {
    const token = await getToken(); // Get token from storage
    const response = await api.post<QuizResponseDTO>('/quizzes', quizRequestDTO, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass JWT token in the header
      },
    });
    console.log('Quiz created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating quiz:', error);
    throw new Error('Unable to create quiz.');
  }
};

// Function to delete a quiz
export const deleteQuiz = async (quizId: number): Promise<void> => {
  console.log('Deleting quiz with ID:', quizId);
  try {
    const token = await getToken(); // Get token from storage
    const response = await api.delete(`/quizzes?quizId=${quizId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass JWT token in the header
      },
    });
    console.log('Quiz deleted successfully:', response.status);
  } catch (error: any) {
    console.error('Error deleting quiz:', error?.response || error);
    throw new Error(error?.response?.data?.message || 'Failed to delete quiz.');
  }
};

// Function to create answers for a quiz
export const createAnswer = async (answerSetRequestDTO: AnswerSetRequestDTO): Promise<QuizResponseDTO> => {
  try {
    const token = await getToken(); // Get token from storage
    const response = await api.put<QuizResponseDTO>('/quizzes', answerSetRequestDTO, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass JWT token in the header
      },
    });
    console.log('Answers set successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating answer set:', error);
    throw new Error('Unable to create answer set.');
  }
};

// Function to get quizzes for a classroom
export const getQuizzes = async (classroomId: number): Promise<QuizResponseDTO[]> => {
  try {
    const token = await getToken(); // Get token from storage
    const response = await api.get<QuizResponseDTO[]>('/quizzes', {
      headers: {
        Authorization: `Bearer ${token}`, // Pass JWT token in the header
      },
      params: {
        classroomId, // Pass classroomId as a query parameter
      },
    });
    console.log('Quizzes fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    throw new Error('Unable to fetch quizzes.');
  }
};
