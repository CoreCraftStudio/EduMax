import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

export default function ClassroomDetail() {
  const local = useLocalSearchParams();
  const classroomId = parseInt(local.id as string, 10); // Get classroomId from the URL params
  console.log('classroomId:', classroomId);
  // Navigate to the quizzes screen and pass classroomId
  const handleQuizzes = (id: number) => {
    router.push('./my-quizzes', );
    router.setParams({classroomId: id})
  };

  // Navigate to the students screen and pass classroomId
  const handleStudents = (id: number) => {
    router.push('./my-students', );
    router.setParams({classroomId: id})
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Classroom {classroomId}</Text>

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
});
