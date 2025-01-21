import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons'; // Importing Ionicons for the school icon
import { SafeAreaView } from 'react-native-safe-area-context'; // SafeAreaView for better compatibility

export default function ClassroomDetail() {
  const local = useLocalSearchParams();
  const classroomId = parseInt(local.id as string, 10); // Get classroomId from the URL params
  console.log('classroomId:', classroomId);

  const handleNavigation = (path: string) => {
    router.push(path as any);
    router.setParams({ classroomId });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Image as background */}
      <ImageBackground
        source={require('../../assets/images/6.png')}
        style={styles.backgroundImage}
      >
        {/* Card-style options in a column layout */}
        <View style={styles.cardContainer}>
          <View style={styles.titleContainer}>
            <Ionicons name="school" size={40} color="black" /> {/* Classroom icon */}
            <Text style={styles.title}>Classroom</Text>
          </View>

          <TouchableOpacity
            style={styles.card}
            onPress={() => handleNavigation('./my-quizzes')}
          >
            <MaterialIcons name="quiz" size={40} color="#007BFF" />
            <Text style={styles.cardText}>My Quizzes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => handleNavigation('./my-students')}
          >
            <MaterialIcons name="group" size={40} color="#28A745" />
            <Text style={styles.cardText}>My Students</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgreen', // Fallback color in case image fails to load
  },
  backgroundImage: {
    position: 'absolute', // This makes sure the image stays in the background
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    resizeMode: 'cover', // Ensures the image covers the entire screen
    zIndex: -1, // Puts the image behind the content
  },
  titleContainer: {
    flexDirection: 'row', // Align icon and text in a row
    alignItems: 'center', // Vertically align items
    justifyContent: 'center', // Center horizontally
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8, // Space between icon and text
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center', // Centers the cards vertically
    alignItems: 'center', // Centers the cards horizontally
    marginTop: 16,
  },
  card: {
    width: '90%', // Ensures cards take up most of the screen width
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 12, // Adds space between cards
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
});
