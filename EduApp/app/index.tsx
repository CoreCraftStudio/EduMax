import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import LoginScreen from './login';
import SignupScreen from './signup';

const AuthLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [slideAnimation] = useState(new Animated.Value(0));
  const [isLoading, setIsLoading] = useState(true); // Loading state

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
    <>
      {isLoading && (
        <View style={styles.splashContainer}>
          <ImageBackground
            source={require('../assets/images/background.png')}
            style={styles.backgroundImage}
            onLoadEnd={() => setIsLoading(false)} // Stop loading when the image is rendered
          >
            <View style={styles.centerContent}>
              <Text style={styles.splashText}>My App Logo</Text>
              <ActivityIndicator size="large" color="#00f" />
            </View>
          </ImageBackground>
        </View>
      )}

      {!isLoading && (
        <ImageBackground
          source={require('../assets/images/6.jpg')}
          style={styles.backgroundImage}
        >
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
            <KeyboardAvoidingView
              style={styles.formContainer}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} // Adjust if needed
            >
              {activeTab === 'login' ? <LoginScreen /> : <SignupScreen />}
            </KeyboardAvoidingView>
          </View>
        </ImageBackground>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
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
    backgroundColor: 'hsla(166, 52.50%, 88.40%, 0.50)',
  },
  slider: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '50%',
    backgroundColor: 'hsla(166, 52.50%, 88.40%, 0.50)',
    borderRadius: 25,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'hsla(166, 52.50%, 88.40%, 0.50)',
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
  splashContainer: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
});

export default AuthLayout;
