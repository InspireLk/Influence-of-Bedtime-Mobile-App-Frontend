import { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, Button, TextInput } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import StatBox from '../../components/StatBox';
import StressDash from '@/components/StressDash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthContext } from '@/context/hooks';
import Toast from 'react-native-toast-message';

interface SleepData {
  name: string;
  hours: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}
interface UserType {
  _id: string;
  email: string;
  fullName: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  survay_completed: string;
  sleepingDisorder: string,
  sleepingDisorderNote: string,
  physicalDisability: string,
  physicalDisabilityNote: string,
  workEnvironmentImpact: string,
}
const fetchUserName = async (): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve('Pabasara'), 1000); // Simulate a 1-second delay
  });
};

export default function HomeScreen() {

    const { submitSurvay, submit_survay_state } = useAuthContext()
  
  const [userName, setUserName] = useState<string>('Loading...');
  const { colors } = useTheme();
  const [sleepData, setSleepData] = useState<SleepData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();  // Use the router for navigation
  const [showSurveyModal, setShowSurveyModal] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0); // Track current question
  const [surveyResponses, setSurveyResponses] = useState<any>({
    sleepingDisorder: null,
    sleepingDisorderNote: '',
    physicalDisability: null,
    physicalDisabilityNote: '',
    workEnvironmentImpact: null,
    wakeup_time: {
      Monday: '',
      Tuesday: '',
      Wednesday: '',
      Thursday: '',
      Friday: '',
      Saturday: '',
      Sunday: ''
    },
  });

  const [user, setUser] = useState<any>(null);

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDay, setSelectedDay] = useState<any>(null); 
  const [selectedTime, setSelectedTime] = useState<any>(null);

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

  const handleNextQuestion = () => {
    if (currentQuestion < 3) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // const handleResponseChange = (question: string, value: any) => {
  //   if (question === 'wakeup_time') {
  //     setSurveyResponses({
  //       ...surveyResponses,
  //       wakeup_time: {
  //         ...surveyResponses.wakeup_time,
  //         [value.day]: value.time,
  //       },
  //     });
  //   }
  //   else{
  //     setSurveyResponses({ ...surveyResponses, [question]: value });
  //   }
  // };

  const handleResponseChange = (key:any, value:any) => {
    if (key === 'wakeup_time') {
      setSurveyResponses((prev:any) => ({
        ...prev,
        wakeup_time: {
          ...prev.wakeup_time, 
          [value.day]: value.time, 
        }
      }));
    } else {
      setSurveyResponses((prev:any) => ({
        ...prev,
        [key]: value
      }));
    }
  };
  
  
  

  const handleTimeChange = (event:any, selectedDate:any) => {
    if (selectedDate) {
      const time = selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      handleResponseChange('wakeup_time', { day: selectedDay, time });
      setSelectedTime(time);
    }
    setShowTimePicker(false);
  };

  const renderQuestion = () => {
    switch (currentQuestion) {
      case 0:
        return (
          <View>
            <Text style={styles.modalTitle}>Question 1/4</Text>
            <Text style={styles.modalText}>Are you suffering any sleeping disorders?</Text>
            <View style={styles.radioContainer}>
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => handleResponseChange('sleepingDisorder', true)}
              >
                <View style={styles.radioCircle}>
                  {surveyResponses.sleepingDisorder === true && <View style={styles.selectedRb} />}
                </View>
                <Text style={styles.radioText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => handleResponseChange('sleepingDisorder', false)}
              >
                <View style={styles.radioCircle}>
                  {surveyResponses.sleepingDisorder === false && <View style={styles.selectedRb} />}
                </View>
                <Text style={styles.radioText}>No</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Add note (optional)"
              value={surveyResponses.sleepingDisorderNote}
              onChangeText={(text) => handleResponseChange('sleepingDisorderNote', text)}
            />
          </View>
        );
      case 1:
        return (
          <View>
            <Text style={styles.modalTitle}>Question 2/4</Text>
            <Text style={styles.modalText}>Are you having any physical disabilities?</Text>
            <View style={styles.radioContainer}>
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => handleResponseChange('physicalDisability', true)}
              >
                <View style={styles.radioCircle}>
                  {surveyResponses.physicalDisability === true && <View style={styles.selectedRb} />}
                </View>
                <Text style={styles.radioText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => handleResponseChange('physicalDisability', false)}
              >
                <View style={styles.radioCircle}>
                  {surveyResponses.physicalDisability === false && <View style={styles.selectedRb} />}
                </View>
                <Text style={styles.radioText}>No</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Add note (optional)"
              value={surveyResponses.physicalDisabilityNote}
              onChangeText={(text) => handleResponseChange('physicalDisabilityNote', text)}
            />
          </View>
        );
      case 2:
        return (
          <View>
            <Text style={styles.modalTitle}>Question 3/4</Text>
            <Text style={styles.modalText}>How is your working environment affecting your mental health?</Text>
            <Text style={styles.modalText}>Rate 1-10 (1 for very low, 10 for too high)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Enter a number between 1 and 10"
              value={surveyResponses.workEnvironmentImpact ? surveyResponses.workEnvironmentImpact.toString() : ''}
              onChangeText={(text) => handleResponseChange('workEnvironmentImpact', parseInt(text, 10))}
            />
          </View>
        );
        case 3:
          return (
            <View>
              <Text style={styles.modalTitle}>Question 4/4</Text>
              <Text style={styles.modalText}>Please provide your wake-up times for the following days of the week:</Text>

              {/* Container for days of the week */}
              <View style={styles.wakeUpTimeRowContainer}>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                  <View key={index} style={styles.dayContainer}>
                    <Text style={styles.dayText}>{day}</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Time"
                      value={surveyResponses.wakeup_time[day] || ''}
                      onChangeText={(text) => handleResponseChange('wakeup_time', { day, time: text })}
                    />
                  </View>
                ))}
              </View>

            </View>
          );

        
      default:
        return null;
    }
  };

  const handleSurveySubmit = async() => {
    
    try {
      
      await submitSurvay?.(surveyResponses,user._id);

    } catch (error) {
      Toast.show({type:'error',text1:'Failed to submit survay',position:'bottom', swipeable:true})
    }
  };

  const fetchUser = async () => {
      
    try {
      
      const userString = await AsyncStorage.getItem('user');
      
      if (userString) {
        const user = JSON.parse(userString);
        setUser(user);

        if (!user.survay_completed) {
          setShowSurveyModal(true);
        }
        else{
          setShowSurveyModal(false)
        }

      }
    } catch (error) {
      console.error('Error fetching user:', error);
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
    fetchUser();
    fetchDummySleepData();
  }, []);

  useEffect(() => {
    
    if(submit_survay_state && submit_survay_state.success){
      fetchUser();
      Toast.show({type:'success',text1:'Survay completed',position:'bottom', swipeable:true})
    }

  }, [submit_survay_state])
  

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

      <StressDash />

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

      <Modal
        visible={showSurveyModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSurveyModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {renderQuestion()}
            <View style={styles.buttonContainer}>
              {currentQuestion > 0 && (
                <Button title="Previous" onPress={handlePreviousQuestion} />
              )}
              {currentQuestion < 3 ? (
                <Button title="Next" onPress={handleNextQuestion} />
              ) : (
                <Button title="Submit" onPress={handleSurveySubmit} />
              )}
            </View>
            <View style={styles.closeButton}>
              <Button title="Close" onPress={()=>setShowSurveyModal(false)} />
            </View>
            
          </View>
        </View>
      </Modal>
      
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
    borderRadius: 15,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  closeButton:{
    flexDirection: 'row',
    justifyContent:'flex-end',
    width: '100%',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007BFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007BFF',
  },
  radioText: {
    fontSize: 16,
  },
  wakeUpTimeRowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  dayContainer: {
    alignItems: 'center',
    marginHorizontal: 5,
    marginVertical: 5,
  },
  dayText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  timeText: {
    fontSize: 16,
    color: '#333',
  },
});