import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { fetchClassrooms } from '@/utilities/classroom/classroomApi';

const Tab = createBottomTabNavigator();

type Classroom = {
  id: number;
  name: string;
};

const ClassroomsTab = ({ token }: { token: string }) => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadClassrooms = async () => {
      try {
        const fetchedClassrooms = await fetchClassrooms(token);
        setClassrooms(fetchedClassrooms);
      } catch (err) {
        setError('Failed to fetch classrooms.');
      } finally {
        setLoading(false);
      }
    };
    loadClassrooms();
  }, [token]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Loading classrooms...</Text>
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
    <FlatList
      data={classrooms}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.classroomItem}>
          <Text style={styles.classroomText}>ID: {item.id}</Text>
          <Text style={styles.classroomText}>Name: {item.name}</Text>
        </View>
      )}
      contentContainerStyle={styles.classroomList}
    />
  );
};

const NotificationsTab = () => (
  <View style={styles.centeredContainer}>
    <Text style={styles.title}>Notifications</Text>
    <Text style={styles.subtitle}>This tab displays notifications.</Text>
  </View>
);

export default function HomeScreen({ token }: { token: string }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = route.name === 'Classrooms' ? 'ios-school' : 'ios-notifications';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007BFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Classrooms">
        {() => <ClassroomsTab token={token} />}
      </Tab.Screen>
      <Tab.Screen name="Notifications" component={NotificationsTab} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#007BFF' },
  errorText: { color: 'red', fontSize: 16 },
  classroomList: { padding: 16 },
  classroomItem: {
    padding: 16,
    backgroundColor: '#f0f4f8',
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  classroomText: { fontSize: 16, color: '#333' },
  centeredContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#555' },
});
