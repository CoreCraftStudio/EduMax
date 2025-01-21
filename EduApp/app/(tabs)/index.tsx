import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
  ImageBackground,
} from 'react-native';
import * as Animatable from 'react-native-animatable'; // For animations
import { fetchClassrooms, createClassroom, deleteClassroom } from '@/utilities/classroom/classroomApi';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HeaderAdderBar from '@/components/HeaderAdderBar';

type Classroom = {
  id: number;
  name: string;
};

export default function Tab({ token }: { token: string }) {
  const local = useLocalSearchParams();
  const type = local.type;
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newClassroomName, setNewClassroomName] = useState<string>('');

  const loadClassrooms = async () => {
    setLoading(true);
    try {
      const fetchedClassrooms = await fetchClassrooms();
      setClassrooms(fetchedClassrooms);
      setError(null);
    } catch (err) {
      setError('Failed to fetch classrooms.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClassrooms();
  }, []);

  const handleClassroomPress = (classroom: Classroom) => {
    if (type === 'teacher') {
      router.push({
        pathname: '/teacher/[classroomId]',
        params: { id: classroom.id },
      });
    } else if (type === 'student') {
      router.push({
        pathname: '/student/[classroomId]',
        params: { id: classroom.id },
      });
    }
  };

  const handleCreateClassroom = async () => {
    if (!newClassroomName.trim()) {
      Alert.alert('Invalid Input', 'Please provide a classroom name.');
      return;
    }

    try {
      const createdClassroom = await createClassroom({ name: newClassroomName });
      Alert.alert('Classroom Created', `Classroom ${createdClassroom.name} created successfully.`);
      setNewClassroomName('');
      loadClassrooms();
    } catch (error) {
      setError('Failed to create classroom.');
    }
  };

  const handleDeleteClassroom = async (classroomId: number) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this classroom?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              await deleteClassroom(classroomId);
              Alert.alert('Classroom Deleted', 'Classroom deleted successfully.');
              loadClassrooms();
            } catch (error) {
              setError('Failed to delete classroom.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ImageBackground
          source={require('@/assets/images/load.jpg')}
          style={styles.loadingImage}
        >
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.loadingText}>Loading classrooms...</Text>
        </ImageBackground>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('@/assets/images/4.jpg')}
      style={styles.background}
    >
      <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        {type === 'teacher' && (
         <HeaderAdderBar
         value={newClassroomName}
         onChangeText={setNewClassroomName}
         onSubmit={handleCreateClassroom}
         placeholder="Enter classroom name"
         animation="fadeIn"
         duration={1000}
         iconSize={28}
         iconColor="#333"
         containerStyle={{ 
           backgroundColor: 'rgba(223, 239, 223, 0.5)', 
           marginTop: 16 ,
         
         }}
         inputStyle={{ 
          //  borderColor: 'black', 
           
           backgroundColor: 'rgba(223, 239, 223, 0.5)', 
         }}
         buttonStyle={{ 
           padding: 1 
         }}
       />
       
        )}

        <ScrollView contentContainerStyle={styles.classroomList}>
          {classrooms.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.classroomButton}
              onPress={() => handleClassroomPress(item)}
            >
              <Text style={styles.classroomButtonText}>{item.name}</Text>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => handleDeleteClassroom(item.id)}
              >
                <MaterialIcons name="delete" size={24} color="#FF4D4D" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Animatable.View animation="fadeInUp" duration={800} style={styles.refreshButton}>
          <TouchableOpacity style={styles.refreshButton} onPress={loadClassrooms}>
         
          <Ionicons name="refresh" size={35} color="black" />
          </TouchableOpacity>
        </Animatable.View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 2,
    paddingHorizontal: 16,
   
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: 'Black',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  classroomList: {
    marginTop: 20,
    paddingBottom: 16,
  },
  classroomButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'hsla(120, 11.10%, 96.50%, 0.50)',
    marginBottom: 12,
    borderRadius: 8,
  },
  classroomButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  iconButton: {
    padding: 4,
  },
  refreshButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginVertical: 10,
  },
});
