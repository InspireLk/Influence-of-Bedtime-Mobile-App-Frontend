import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MoodTrackerScreen from '@/app/(tabs)/scan_my_face';
import MoodDetailsScreen from '@/app/(tabs)/MoodDetailScreen';
import MoodCamera from '@/app/(tabs)/MoodCamera';
import MoodHistory from '@/app/(tabs)/MoodHistory';

const Stack = createNativeStackNavigator();

const MoodStackParamList = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MoodTracker"
          component={MoodTrackerScreen}
        // options={{ title: 'Welcome' }}
        />
        <Stack.Screen
          name="MoodCamera"
          component={MoodCamera}
        />
        <Stack.Screen
          name="MoodDetails"
          component={MoodDetailsScreen}
        />
        <Stack.Screen
          name="MoodHistory"
          component={MoodHistory}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};