import { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import StatBox from '../../components/StatBox';
import StressDash from '@/components/StressDash';

interface SleepData {
  name: string;
  hours: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

const fetchUserName = async (): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve('Pabasara'), 1000); // Simulate a 1-second delay
  });
};

export default function HomeScreen() {
  const [userName, setUserName] = useState<string>('Loading...');
  const { colors } = useTheme();
  const [sleepData, setSleepData] = useState<SleepData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();  // Use the router for navigation

  const fetchDummySleepData = async () => {
    try {
      const mockSleepData: SleepData[] = [
        { name: 'Bad Sleep', hours: 0.5, color: 'red', legendFontColor: '#333', legendFontSize: 12 },
        { name: 'Okay Sleep', hours: 4, color: '#F4B400', legendFontColor: '#333', legendFontSize: 12 },
        { name: 'Good Sleep', hours: 3, color: '#A0C4FF', legendFontColor: '#333', legendFontSize: 12 },
        { name: 'Excellent Sleep', hours: 2.5, color: '#00C853', legendFontColor: '#333', legendFontSize: 12 },
      ];
      setSleepData(mockSleepData);
    } catch (error) {
      console.error('Error fetching sleep data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getUserName = async () => {
      try {
        const name = await fetchUserName();
        setUserName(name);
      } catch (error) {
        console.error('Error fetching name:', error);
        setUserName('Guest');
      }
    };

    getUserName();
    fetchDummySleepData();
  }, []);

  if (loading) return <ActivityIndicator size="large" color={colors.primary} />;

  const totalHours = sleepData.reduce((sum, item) => sum + item.hours, 0);

  return (
    <View style={styles.container}>
      <Text>{userName}</Text>
      <Text style={styles.greeting}>Good Morning!</Text>

      {/* Sleep Stats */}
      <View style={styles.statsContainer}>
        <StatBox icon={require('@/assets/images/moon.png')} value="3" label="Nights Recorded" />
        <StatBox icon={require('@/assets/images/award1.png')} value="6.2" label="Avg. Sleep Quality" />
        <StatBox icon={require('@/assets/images/clock.png')} value="6.76" label="Avg. Sleep Time" />
        <StatBox icon={require('@/assets/images/cloud.png')} value="ON" label="Cloud Backup" />
      </View> 

      <StressDash/>

      <View style={styles.cont}>
{/* Sleep Data Chart */}
<Text style={styles.sectionTitle}>Your Sleep at a Glance</Text>
      <View style={styles.chartContainer}>
        <PieChart
          data={sleepData}
          width={200}
          height={180}
          chartConfig={{
            backgroundColor: colors.background,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="hours"
          backgroundColor="transparent"
          paddingLeft="50"
          hasLegend={false}
        />
      </View>

      {/* Sleep Summary (Below Pie Chart) */}
      <View style={styles.legendContainer}>
        {sleepData.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            {/* Color Dot */}
            <View style={[styles.dot, { backgroundColor: item.color }]} />
            <View>
              {/* Sleep Category */}
              <Text style={styles.legendText}>{item.name}</Text>
              {/* Hours & Percentage */}
              <Text style={styles.legendDetails}>
                {item.hours.toFixed(2)} hours ({((item.hours / totalHours) * 100).toFixed(0)}%)
              </Text>
            </View>
          </View>
        ))}
      </View>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  greeting: { fontSize: 24, fontWeight: 'bold' },
  statsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },


  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  cont: {
    backgroundColor: 'white',
    padding: 10,
    marginTop: 10,
    borderRadius: 15
  },
  chartContainer: {
    alignItems: 'center',

  },
  legendItem: {
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 5,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  legendDetails: {
    fontSize: 10,
    color: '#666',
  },
});
