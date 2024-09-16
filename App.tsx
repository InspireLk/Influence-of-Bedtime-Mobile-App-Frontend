/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  StatusBar,
  useColorScheme,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import LoginPage from './pages/auth/LoginPage';
import HomePage from './pages/main/HomePage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './context/auth/auth-provider';
import { AuthGuard } from './context/guard';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const Stack = createNativeStackNavigator();

  const isLoggedIn = false;

  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
              backgroundColor={backgroundStyle.backgroundColor}
            />
        <Stack.Navigator 
          initialRouteName={isLoggedIn ? 'Home' : 'Login'}
          screenOptions={{
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}>
          <Stack.Screen name="Login" component={LoginPage} options={{title: 'Login'}}/>
          <Stack.Screen name="Home" options={{title: 'Home'}}>
            {() => (
                <AuthGuard>
                  <HomePage />
                </AuthGuard>
              )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;
