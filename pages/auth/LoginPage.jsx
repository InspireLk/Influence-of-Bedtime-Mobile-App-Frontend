import { View, Text, StyleSheet, SafeAreaView, useColorScheme, ScrollView, Button, TextInput } from 'react-native';
import React, { useState } from 'react';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useAuthContext } from '../../context/hooks/use-auth-context';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { useNavigation } from '@react-navigation/native';

const LoginPage = () => {

  const {login, loading} = useAuthContext();

  const navigator = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async() => {

    try {
      await login?.(email, password);
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Success',
        textBody: 'Login success!',
      });
      navigator.navigate('Home');
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Login failed!',
      });
    }

  };

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={[backgroundStyle, styles.container]}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={backgroundStyle}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Welcome to the Bedtime Tracker</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Login" onPress={handleLogin} disabled={loading} />
          </View>
          {loading && <Text style={styles.loadingText}>Loading...</Text>}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  sectionContainer: {
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop:130,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 40,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  buttonContainer: {
    width: '80%',
    marginTop: 20,
  },
  loadingText: {
    marginTop: 20,
  },
});

export default LoginPage;
