import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useColorScheme } from '@/hooks/useColorScheme';
import LoginScreen from '@/components/auth/Login';
import RegisterScreen from '@/components/auth/Register';

const Tab = createMaterialTopTabNavigator();

export default function AuthLayout() {
  const colorScheme = useColorScheme();

  return (
      <Tab.Navigator
          screenOptions={{
            tabBarLabelStyle: { fontSize: 16, fontWeight: 'bold' },
            tabBarIndicatorStyle: { 
              backgroundColor: colorScheme === 'dark' ? '#fff' : '#000',
              height: 3,
            },
            tabBarStyle: {
              backgroundColor: colorScheme === 'dark' ? '#1D3D47' : '#A1CEDC',
            },
            tabBarActiveTintColor: colorScheme === 'dark' ? '#fff' : '#000',
            tabBarInactiveTintColor: colorScheme === 'dark' ? '#888' : '#666',
          }}
        >
          <Tab.Screen name="Login" component={LoginScreen} />
          <Tab.Screen name="Register" component={RegisterScreen} />
      </Tab.Navigator>
  );
}
