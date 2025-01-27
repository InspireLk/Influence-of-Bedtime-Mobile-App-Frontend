import React from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Link, Stack } from 'expo-router';
import { Image, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import LoginScreen from '@/components/auth/Login';

export default function AuthLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
        <Stack.Screen options={{ title: 'IBT Login',headerTitleAlign:'center' }} />
        <ThemedView style={styles.container}>
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
            
            headerImage={
                <Image
                source={require('@/assets/images/icon.png')}
                style={[
                  styles.reactLogo, 
                  { backgroundColor: colorScheme === 'dark' ? '#000000' : '#ffffff' }
                ]}
                />
        }>
                  <LoginScreen/> 
        </ParallaxScrollView>
        </ThemedView>
    </>
  );
}
const styles = StyleSheet.create({
  
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    link: {
      marginTop: 15,
      paddingVertical: 15,
    },
    reactLogo: {
      height:'100%',
      width:'100%',
      position:'relative',
      alignItems:'center',
      justifyContent:'center',
    },
  });
