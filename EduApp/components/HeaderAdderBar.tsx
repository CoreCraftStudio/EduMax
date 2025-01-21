import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, TextInputProps, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

interface HeaderAdderBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  animation?: Animatable.Animation;
  duration?: number;
  iconSize?: number;
  iconColor?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  buttonStyle?: ViewStyle;
}

const HeaderAdderBar: React.FC<HeaderAdderBarProps> = ({
  value,
  onChangeText,
  onSubmit,
  placeholder = "Enter text",
  animation = "zoomIn",
  duration = 800,
  iconSize = 32,
  iconColor = "black",
  containerStyle,
  inputStyle,
  buttonStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        style={[styles.input, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor="black"
        value={value}
        onChangeText={onChangeText}
        textAlign="center"
      />
      <Animatable.View animation={animation} duration={duration} style={[styles.addButton, buttonStyle]}>
        <TouchableOpacity onPress={onSubmit}>
          <Ionicons name="paper-plane-outline" size={iconSize} color={iconColor} />
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius:10
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
   
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HeaderAdderBar;
