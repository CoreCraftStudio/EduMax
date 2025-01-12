import * as SecureStore from 'expo-secure-store';
import api from '../api';

export interface Classroom {
  id: number;
  name: string;
}

export interface StudentResponseDTO {

  username: string;
  classroomId: number;
}

export interface ClassroomsResponse {
  classrooms: Classroom[];
}

export interface CreateClassroomRequest {
  name: string;
}

export interface CreateClassroomResponse {
  id: number;
  name: string;
}

// Function to get the token from Secure Store
const getToken = async (): Promise<string> => {
  const token = await SecureStore.getItemAsync('userToken');
  if (!token) {
    throw new Error('Token not found. Please login again.');
  }
  return token;
};

// Function to fetch classrooms
export const fetchClassrooms = async (): Promise<Classroom[]> => {
  try {
    const token = await getToken(); // Get token from storage
    console.log('Fetching classrooms with token:', token);
    const response = await api.get<ClassroomsResponse>('/classrooms', {
      headers: {
        Authorization: `Bearer ${token}`, // Pass JWT token in the header
      },
    });
    return response.data.classrooms;
  } catch (error) {
    console.error('Error fetching classrooms:', error);
    throw new Error('Unable to fetch classrooms.');
  }
};

// Function to create a classroom
export const createClassroom = async (
  data: CreateClassroomRequest
): Promise<CreateClassroomResponse> => {
  try {
    const token = await getToken(); // Get token from storage
    const response = await api.post<CreateClassroomResponse>('/classrooms', data, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass JWT token in the header
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating classroom:', error);
    throw new Error('Unable to create classroom.');
  }
};

// Function to delete a classroom
export const deleteClassroom = async (classroomId: number): Promise<void> => {
  console.log('Deleting classroom with ID:', classroomId);
  try {
    const token = await getToken(); // Get token from storage
    const response = await api.delete(`/classrooms?classroomId=${classroomId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Classroom deleted successfully:', response.status);
  } catch (error: any) {
    console.error('Error deleting classroom:', error?.response || error);
    throw new Error(
      error?.response?.data?.message || 'Failed to delete classroom.'
    );
  }
};



export const addStudentToClassroom = async (studentUsername: string, classroomId: number): Promise<StudentResponseDTO> => {
  try {
    const token = await getToken(); // Get token from storage
    const response = await api.put<StudentResponseDTO>(
      `/classrooms/${classroomId}`, // Endpoint with classroomId in the path
      null, // No request body for this PUT request
      {
        headers: {
          Authorization: `Bearer ${token}`, // Pass JWT token in the header
        },
        params: {
          studentUsername, // Add studentUsername as a query parameter
        },
      }
    );
    console.log("Success full in delete:", response.data); // Log success if the request works
    return response.data;
    
  } catch (error) {
    console.error('Error adding student to classroom:', error);
    throw new Error('Unable to add student to classroom.');
  }
};


export const dropStudentFromClassroom = async (studentUsername: string, classroomId: number): Promise<StudentResponseDTO> => {
  try {
    const token = await getToken(); // Get token from storage
    const response = await api.delete<StudentResponseDTO>(`/classrooms/${classroomId}`,  {
      headers: {
        Authorization: `Bearer ${token}`, // Pass JWT token in the header
      },
      params: {
        studentUsername, // Pass the student username as a query parameter
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error dropping student from classroom:', error);
    throw new Error('Unable to drop student from classroom.');
  }
};


export const updateParentInClassroom = async (
  studentUsername: string,
  classroomId: number,
  parentUsername?: string
): Promise<StudentResponseDTO> => {
  try {
    const token = await getToken(); // Get token from storage
    const response = await api.patch<StudentResponseDTO>(
      `/classrooms/${classroomId}`,
      null, // No body required
      {
        headers: {
          Authorization: `Bearer ${token}`, // Pass JWT token in the header
        },
        params: {
          studentUsername, // Pass the student username as a path variable
          parentUsername, // Pass the parent username as a query parameter (if provided)
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating parent in classroom:', error);
    throw new Error('Unable to update parent in classroom.');
  }
};
