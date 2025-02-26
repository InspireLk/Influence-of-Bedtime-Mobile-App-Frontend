import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import { Ionicons, FontAwesome } from '@expo/vector-icons';

// Define sleep prediction data type
type SleepPrediction = {
  bestSleepDay: string;
  totalSleepHours: number;
  sleepIssue: string;
};

// Dummy API function (simulates fetching sleep predictions)
const fetchSleepPredictions = async (): Promise<SleepPrediction> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        bestSleepDay: 'Saturdays',
        totalSleepHours: 41.23,
        sleepIssue: 'Long hours of screentime before bed seems to be the toughest battle you have',
      });
    }, 1500); // Simulate network delay
  });
};

const SleepPredictionScreen = () => {
  const [data, setData] = useState<SleepPrediction | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Use useFocusEffect to refetch data when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      setLoading(true); // Reset loading state
      fetchSleepPredictions().then((response) => {
        setData(response);
        setLoading(false);
      });
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Here’s what your sleep might look like ahead</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4A90E2" />
      ) : (
        <>
          {/* Best Sleep Day Box */}
          <View style={styles.bestSleepContainer}>
            <FontAwesome name="calendar" size={50} color="#FFD700" />
            <Text style={styles.bestSleepText}>
              In terms of day of the week, {'\n'}
              <Text style={styles.boldText}>You will have best sleep on {data?.bestSleepDay}</Text>
            </Text>
          </View>

          {/* Two Cards Section */}
          <View style={styles.cardContainer}>
            <View style={styles.sleepHoursCard}>
              <Ionicons name="time-outline" size={50} color="black" />
              <Text style={styles.sleepHoursText}>
                You will most likely sleep {'\n'}
                <Text style={styles.boldText}>{data?.totalSleepHours} hours next week</Text>
              </Text>
            </View>

            <View style={styles.issueCard}>
              <Ionicons name="phone-portrait-outline" size={50} color="black"/>
              <Text style={styles.sleepIssueText}>{data?.sleepIssue}</Text>
            </View>
          </View>

          {/* Button to navigate to SleepRecommendationScreen */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('SleepRecommendation' as never)}
          >
            <Text style={styles.buttonText}>Show sleep recommendations</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default SleepPredictionScreen;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
    
  },
  header: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 20,
  },
  bestSleepContainer: {
    backgroundColor: '#4f6179',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    height: '25%'
  },
  bestSleepText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
  },
  boldText: {
    fontWeight: 'bold',
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '30%',
    
  },
  sleepHoursCard: {
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
    
  },
  issueCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  sleepHoursText: {
    marginTop: 40,
    fontSize: 12,
  },
  sleepIssueText: {
    marginTop: 40,
    fontSize: 12,
  },
  button: {
    backgroundColor: '#a2c4f2',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 150,
    alignItems: 'center',
  },
  buttonText: {

    fontSize: 16,
    fontWeight: 'bold',
  },
});