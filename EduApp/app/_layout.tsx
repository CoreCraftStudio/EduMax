import { Stack } from 'expo-router';
import { View, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, header: () => <CustomHeader /> }}> {/* Use custom header */}
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

function CustomHeader() {
  const navigation = useNavigation();

  const canGoBack = navigation.canGoBack(); // Check if navigation can go back

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground source={require('@/assets/images/6.jpg')} style={styles.headerContainer}>
        {/* Back Button */}
        {canGoBack && ( // Show the back button only if there is a previous screen
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
        )}

        {/* Logo */}
        <Image
          source={require('@/assets/images/icon.png')} // Replace with your logo path
          style={styles.logo}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'transparent', // Transparent to allow the image background to show
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    paddingHorizontal: 16,
    backgroundColor: 'transparent', // Ensure background is transparent for the image
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    padding: 8,
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
  },
});
