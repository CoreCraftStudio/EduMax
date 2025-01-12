import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

type Classroom = {
  id: number;
  name: string;
  subject: string;
  students: number;
};

const classrooms: Classroom[] = [
  { id: 1, name: 'Math 101', subject: 'Mathematics', students: 25 },
  { id: 4924, name: 'Physics 201', subject: 'Physics', students: 20 },
  { id: 4923, name: 'History 101', subject: 'History', students: 18 },
];

export default function ClassroomDetail() {
  const local = useLocalSearchParams();
  console.log(local.id);

  const classroomId = parseInt(local.id as string, 10);
  const classroom = classrooms.find((c) => c.id === classroomId);

  if (!classroom) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Classroom not found</Text>
      </View>
    );
  }

  // Navigate to the quizzes screen and pass classroomId
  const handleQuizzes = (id: number) => {
    router.push({
      pathname: `/my-quizzes`,
      params: { classroomId: id }, // Pass classroomId as a query parameter
    });
  };

  // Navigate to the students screen and pass classroomId
  const handleStudents = (id: number) => {
    router.push({
      pathname: `/my-students`,
      params: { classroomId: id }, // Pass classroomId as a query parameter
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to {classroom.name}</Text>
      <Text style={styles.subtitle}>Subject: {classroom.subject}</Text>
      <Text style={styles.text}>Number of Students: {classroom.students}</Text>

      {/* Buttons with styles */}
      <View style={styles.buttonContainer}>
        <Text style={styles.button} onPress={() => handleQuizzes(classroomId)}>
          My Quizzes
        </Text>
        <Text style={styles.button} onPress={() => handleStudents(classroomId)}>
          My Students
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    marginTop: 8,
  },
  text: {
    fontSize: 16,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    color: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});
