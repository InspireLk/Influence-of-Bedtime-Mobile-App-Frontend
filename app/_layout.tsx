import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '../context/auth/index';
import Toast  from 'react-native-toast-message';
import LoadingScreen from '@/components/LoadingScreen';
import { createDrawerNavigator } from '@react-navigation/drawer'; // Import Drawer
import AsyncStorage from '@react-native-async-storage/async-storage';
import SleepRecommendationScreen from './(tabs)/SleepRecommendationScreen';
import { useAuthContext } from '@/context/hooks/use-auth-context';
import { PermissionsAndroid, Platform, } from 'react-native';

SplashScreen.preventAutoHideAsync()
const Drawer = createDrawerNavigator(); // Drawer instance

export default function RootLayout() {

  const colorScheme = useColorScheme();
  const [isReady, setIsReady] = useState(false);
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [user, setUser] = useState<any>(null);
  const [usagePermissionGranted, setUsagePermissionGranted] = useState(false);

  const router = useRouter();

  const requestUsageStatsPermission = async () => {
  
    try {
      const granted = await PermissionsAndroid.request(
        'android.permission.READ_PHONE_STATE' as any, 
        {
          title: 'Usage Stats Permission',
          message: 'This app needs access to your usage stats to calculate screen time.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
  
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Toast.show({type:'success',text1:'Usage stats permission granted',position:'bottom', swipeable:true})
          setUsagePermissionGranted(true);
      } else {
        console.log('Usage stats permission denied');
      }
    } catch (err) {
      console.error('Error requesting usage stats permission:', err);
    }
  };

  const fetchUser = async () => {
      
    try {
      
      const userString = await AsyncStorage.getItem('user');
  
      if (userString !== null) {
        const user = JSON.parse(userString);
        setUser(user);
      }
      else{
        setUser(null)
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  // useEffect(() => {
  //   requestUsageStatsPermission()
  // }, [])
  

  useEffect(() => {
    
    if (loaded) {
      SplashScreen.hideAsync();
      setIsReady(true);
      fetchUser();
    }
  }, [loaded]);

  return (
    <AuthProvider>
      <AuthLayout  isReady={isReady} router={router} colorScheme={colorScheme} />
      <Toast/>
    </AuthProvider>
  );
}

interface AuthLayoutProps {
  isReady: boolean;
  router: ReturnType<typeof useRouter>;
  colorScheme: any;
  // user:any
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ isReady, router, colorScheme }) => {
  const { loading, user } = useAuthContext();

  

  useEffect(() => {
    
    if (isReady && !loading) {
      if (user) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)');
      }
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
