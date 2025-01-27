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

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isReady, setIsReady] = useState(false);
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const router = useRouter();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      setIsReady(true);
    }
  }, [loaded]);

  return (
    <AuthProvider>
      <AuthLayout isReady={isReady} router={router} colorScheme={colorScheme} />
      <Toast/>
    </AuthProvider>
  );
}

interface AuthLayoutProps {
  isReady: boolean;
  router: ReturnType<typeof useRouter>;
  colorScheme: any;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ isReady, router, colorScheme }) => {
  const { admin, loading } = useAuthContext();

  useEffect(() => {
    if (isReady && !loading) {
      if (admin) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)');
      }
    }
  }, [isReady, admin,loading,router]);

  if (!isReady && loading) {
    return <LoadingScreen/>
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name='(auth)' />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
};
