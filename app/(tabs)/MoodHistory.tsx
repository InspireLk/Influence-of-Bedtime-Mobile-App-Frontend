import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Dummy data for history
const moodHistoryData = [
    { id: '1', date: '2025-02-01', emotion: 'Happy', image: require('@/assets/images/girl.jpg') },
    { id: '2', date: '2025-02-02', emotion: 'Sad', image: require('@/assets/images/girl.jpg') },
    { id: '3', date: '2025-02-03', emotion: 'Angry', image: require('@/assets/images/girl.jpg') },
    { id: '4', date: '2025-02-04', emotion: 'Neutral', image: require('@/assets/images/girl.jpg')},
    { id: '5', date: '2025-02-05', emotion: 'Surprise', image: require('@/assets/images/girl.jpg') },
    { id: '6', date: '2025-02-06', emotion: 'Stressed', image: require('@/assets/images/girl.jpg') },
    { id: '7', date: '2025-02-07', emotion: 'Happy', image: require('@/assets/images/girl.jpg') },
    { id: '8', date: '2025-02-08', emotion: 'Sad', image: require('@/assets/images/girl.jpg')},
    { id: '9', date: '2025-02-09', emotion: 'Angry', image: require('@/assets/images/girl.jpg') },
    { id: '10', date: '2025-02-10', emotion: 'Neutral', image: require('@/assets/images/girl.jpg') },
    { id: '11', date: '2025-02-11', emotion: 'Surprise', image: require('@/assets/images/girl.jpg') },
    { id: '12', date: '2025-02-12', emotion: 'Stressed', image: require('@/assets/images/girl.jpg') },
    { id: '13', date: '2025-02-13', emotion: 'Happy', image: require('@/assets/images/girl.jpg') },
    { id: '14', date: '2025-02-14', emotion: 'Sad', image: require('@/assets/images/girl.jpg')},
    { id: '15', date: '2025-02-15', emotion: 'Angry', image: require('@/assets/images/girl.jpg')},
    { id: '16', date: '2025-02-16', emotion: 'Neutral', image: require('@/assets/images/girl.jpg') },
    { id: '17', date: '2025-02-17', emotion: 'Surprise', image: require('@/assets/images/girl.jpg') },
    { id: '18', date: '2025-02-18', emotion: 'Stressed', image: require('@/assets/images/girl.jpg') },
    { id: '19', date: '2025-02-19', emotion: 'Happy', image: require('@/assets/images/girl.jpg') },
    { id: '20', date: '2025-02-20', emotion: 'Sad', image: require('@/assets/images/girl.jpg') },
    { id: '21', date: '2025-02-21', emotion: 'Angry', image: require('@/assets/images/girl.jpg') },
    { id: '22', date: '2025-02-22', emotion: 'Neutral', image: require('@/assets/images/girl.jpg') },
    { id: '23', date: '2025-02-23', emotion: 'Surprise', image: require('@/assets/images/girl.jpg') },
    { id: '24', date: '2025-02-24', emotion: 'Stressed', image: require('@/assets/images/girl.jpg')},
    { id: '25', date: '2025-02-25', emotion: 'Happy', image: require('@/assets/images/girl.jpg')},
    { id: '26', date: '2025-02-26', emotion: 'Sad', image: require('@/assets/images/girl.jpg') },
    { id: '27', date: '2025-02-27', emotion: 'Angry', image: require('@/assets/images/girl.jpg') },
    { id: '28', date: '2025-02-28', emotion: 'Neutral', image: require('@/assets/images/girl.jpg') },
  ];
  
export default function MoodHistory() {
  const navigation = useNavigation();
  const [history, setHistory] = useState(moodHistoryData);

  // Function to delete a mood entry
  const deleteMood = (id) => {
    Alert.alert('Delete Entry', 'Are you sure you want to delete this mood entry?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', onPress: () => setHistory(history.filter(item => item.id !== id)) }
    ]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.moodTile} 
            onPress={() => navigation.navigate('MoodDetailScreen', { moodData: item })}
          >
            <Image source={item.image} style={styles.moodImage} />
            <View style={styles.textContainer}>
              <Text style={styles.moodText}>{item.emotion}</Text>
              <Text style={styles.dateText}>{item.date}</Text>
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteMood(item.id)}>
              <Text style={styles.deleteText}>X</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5F5F5',
      padding: 16,
    },
    moodTile: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white',
      padding: 12,
      borderRadius: 10,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    moodImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 12,
    },
    textContainer: {
      flex: 1,
    },
    moodText: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    dateText: {
      fontSize: 14,
      color: '#666',
    },
    deleteButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: '#FF6B6B',
      justifyContent: 'center',
      alignItems: 'center',
    },
    deleteText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
  