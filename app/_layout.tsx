import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '../context/auth/index';
import { useAuthContext } from '../context/hooks/use-auth-context';
import Toast  from 'react-native-toast-message';
import LoadingScreen from '@/components/LoadingScreen';
import { createDrawerNavigator } from '@react-navigation/drawer'; // Import Drawer
import AsyncStorage from '@react-native-async-storage/async-storage';
import SleepRecommendationScreen from './(tabs)/SleepRecommendationScreen';

SplashScreen.preventAutoHideAsync()
const Drawer = createDrawerNavigator(); // Drawer instance

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isReady, setIsReady] = useState(false);
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [user, setUser] = useState(AsyncStorage.getItem('user'));

  const router = useRouter();

  useEffect(() => {
    
    if (loaded) {
      SplashScreen.hideAsync();
      setIsReady(true);
      setUser(AsyncStorage.getItem('user'))
    }
  }, [loaded]);

  return (
    <AuthProvider>
      <AuthLayout user={user} isReady={isReady} router={router} colorScheme={colorScheme} />
      <Toast/>
    </AuthProvider>
  );
}

interface AuthLayoutProps {
  isReady: boolean;
  router: ReturnType<typeof useRouter>;
  colorScheme: any;
  user:any
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ user, isReady, router, colorScheme }) => {
  const { loading } = useAuthContext();

  

  useEffect(() => {
    
    if (isReady && !loading) {
      // if (user) {
        router.replace('/(tabs)');
      // } else {
      //   router.replace('/(auth)');
      // }
    }
  }, [isReady, user,loading,router]);

  if (!isReady && loading) {
    return <LoadingScreen/>
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name='(auth)' options={{headerTitle:"AUthentication", headerTitleAlign:'center'}}/>
        <Stack.Screen name="(tabs)" options={{ headerShown:false}}/>
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
};
