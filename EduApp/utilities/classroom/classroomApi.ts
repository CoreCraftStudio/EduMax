import api from '../api';

export interface Classroom {
  id: number;
  name: string;
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

// Function to fetch classrooms
export const fetchClassrooms = async (token: string): Promise<Classroom[]> => {
  try {
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



export const createClassroom = async (
  token: string,
  data: CreateClassroomRequest
): Promise<CreateClassroomResponse> => {
  try {
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