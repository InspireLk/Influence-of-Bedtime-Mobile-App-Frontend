import React, { useState } from 'react';
import { View, Button, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
import { useAuthContext } from '@/context/hooks/use-auth-context';
import Toast from 'react-native-toast-message';
import { ThemedView } from '@/components/ThemedView';

export default function RegisterScreen() {
  const colorScheme = useColorScheme();
  const { sign_up } = useAuthContext();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [occupation, setOccupation] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [buttonLoading, setButtonLoading] = useState(false);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Passwords do not match', position: 'bottom', swipeable: true });
      return;
    }

    setButtonLoading(true);
    try {
      const userData = {
        fullName,
        email,
        age: parseInt(age),
        occupation,
        gender,
        height: parseFloat(height),
        weight: parseFloat(weight),
        password
      };

      await sign_up?.(userData);
      Toast.show({ type: 'success', text1: 'Registration successful!', position: 'bottom', swipeable: true });

    } catch (error) {
      Toast.show({ type: 'error', text1: 'Registration failed. Please try again.', position: 'bottom', swipeable: true });
    } finally {
      setButtonLoading(false);
    }
  };

  const inputStyle = [
    styles.input, 
    { 
      color: colorScheme === 'dark' ? '#ffffff' : '#000000',
      placeholderTextColor: colorScheme === 'dark' ? '#ffffff' : '#000000'
    }
  ];

  return (
    <ThemedView style={styles.container}>
      <TextInput
        style={inputStyle}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
        autoCapitalize="words"
      />

      <TextInput
        style={inputStyle}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={inputStyle}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <TextInput
        style={inputStyle}
        placeholder="Occupation"
        value={occupation}
        onChangeText={setOccupation}
      />

      <TextInput
        style={inputStyle}
        placeholder="Gender"
        value={gender}
        onChangeText={setGender}
      />

      <TextInput
        style={inputStyle}
        placeholder="Height (cm)"
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
      />

      <TextInput
        style={inputStyle}
        placeholder="Weight (kg)"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />

      <TextInput
        style={inputStyle}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={inputStyle}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {buttonLoading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
      ) : (
        <Button 
          title="Register" 
          onPress={handleRegister} 
          disabled={buttonLoading}
        />
      )}
      
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 50,
    width: 250,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  loadingIndicator: {
    marginTop: 20,
  },
});