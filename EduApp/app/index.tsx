import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image } from 'react-native';
import LoginScreen from './login';
import SignupScreen from './signup';

const AuthLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [slideAnimation] = useState(new Animated.Value(0));

  const toggleTab = (tab: 'login' | 'signup') => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      Animated.timing(slideAnimation, {
        toValue: tab === 'signup' ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/icon.png')} // Replace with your image path
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <View style={styles.sliderContainer}>
          <Animated.View
            style={[
              styles.slider,
              {
                left: slideAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '50%'],
                }),
              },
            ]}
          />
          <TouchableOpacity style={styles.tab} onPress={() => toggleTab('login')}>
            <Text style={styles.tabText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} onPress={() => toggleTab('signup')}>
            <Text style={styles.tabText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.formContainer}>
          {activeTab === 'login' ? <LoginScreen /> : <SignupScreen />}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject, // Full image coverage
    opacity: 1, // Fully show the image
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent overlay to make text visible
  },
  sliderContainer: {
    flexDirection: 'row',
    width: '80%',
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ccc',
    overflow: 'hidden',
    marginBottom: 20,
    marginTop: 70,
    position: 'relative',
  },
  slider: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '50%',
    backgroundColor: '#007bff',
    borderRadius: 25,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});

export default AuthLayout;
