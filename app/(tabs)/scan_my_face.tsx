<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image  } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Map emotions to images
const emotionImages = {
  Happy: require('@/assets/images/happyEmoji.png'),
  Surprise: require('@/assets/images/surpriseEmoji.png'),
  Neutral: require('@/assets/images/neutralEmoji.png'),
  Sad: require('@/assets/images/sadEmoji.png'),
  Stressed: require('@/assets/images/stressEmoji.png'),
  Angry: require('@/assets/images/angryEmoji.png'),
};

// Dummy data for emotions
const dummyEmotions = {
  '2025-02-14': 'Surprise',
  '2025-02-15': 'Surprise',
  '2025-02-16': 'Neutral',
  '2025-02-17': 'Sad',
  '2025-02-18': 'Stressed',
  '2025-02-19': 'Angry',
  '2025-02-20': 'Angry',
  '2025-02-21': 'Happy',
  '2025-02-22': 'Happy',
  '2025-02-23': 'Neutral',
  '2025-02-24': 'Sad',
  '2025-02-25': 'Stressed',
  '2025-02-26': 'Angry',
  '2025-02-27': 'Happy'
};

const emotionColors = {
  Happy: '#FFA500',
  Surprise: '#87CEEB',
  Neutral: '#FFD700',
  Sad: '#00CED1',
  Stressed: '#9370DB',
  Angry: '#FF6B6B'
};

// Helper functions for date manipulation
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const Calendar = ({ onMonthChange }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 1)); // November 2025
  const [selectedDate, setSelectedDate] = useState(null);

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
    setCurrentDate(newDate);
    onMonthChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
    setCurrentDate(newDate);
    onMonthChange(newDate);
  };

  useEffect(() => {
    onMonthChange(currentDate);
  }, []);

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    // Get days from previous month
    const daysInPrevMonth = getDaysInMonth(year, month - 1);
    const prevMonthDays = Array.from({ length: firstDay }, (_, i) => ({
      day: daysInPrevMonth - firstDay + i + 1,
      month: 'prev',
      full: new Date(year, month - 1, daysInPrevMonth - firstDay + i + 1)
    }));

    // Current month days
    const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      month: 'current',
      full: new Date(year, month, i + 1)
    }));

    // Calculate remaining days needed for next month
    const totalDays = prevMonthDays.length + currentMonthDays.length;
    const remainingDays = 40 - totalDays; // 6 rows × 7 days = 42

    // Next month days
    const nextMonthDays = Array.from({ length: remainingDays }, (_, i) => ({
      day: i + 1,
      month: 'next',
      full: new Date(year, month + 1, i + 1)
    }));

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  const formatDateForEmotion = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const getEmotionColor = (date: Date) => {
    const dateStr = formatDateForEmotion(date);
    const emotion = dummyEmotions[dateStr];
    return emotion ? emotionColors[emotion] : '#F0F0F0';
  };

  const renderDay = (dayInfo: { day: number; month: string; full: Date }) => {
    const isCurrentMonth = dayInfo.month === 'current';
    const dayStyle = [
      styles.dayButton,
      { 
        backgroundColor: isCurrentMonth ? getEmotionColor(dayInfo.full) : '#F0F0F0',
        opacity: isCurrentMonth ? 1 : 0.3
      }
    ];

    

    return (
      <TouchableOpacity
        key={`${dayInfo.month}-${dayInfo.day}`}
        style={dayStyle}
        onPress={() => isCurrentMonth && setSelectedDate(dayInfo.full)}
      >
        <Text style={[styles.dayText, !isCurrentMonth && styles.dayTextFaded]}>
          {dayInfo.day}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    
    <View style={styles.calendarContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrevMonth}>
          <Text style={styles.headerButton}>&lt;</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </Text>
        <TouchableOpacity onPress={handleNextMonth}>
          <Text style={styles.headerButton}>&gt;</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.weekDays}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <Text key={day} style={styles.weekDay}>{day}</Text>
        ))}
      </View>
      
      <View style={styles.daysGrid}>
        {generateCalendarDays().map(dayInfo => renderDay(dayInfo))}
      </View>
    </View>
  );
};

const MoodCount = ({ currentDate }) => {
  const [counts, setCounts] = useState({
    Happy: 0,
    Surprise: 0,
    Neutral: 0,
    Sad: 0,
    Stressed: 0,
    Angry: 0
  });
  const navigation = useNavigation();
  const [totalMoods, setTotalMoods] = useState(0);

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    
    // Count emotions for the current month
    const monthCounts = Object.entries(dummyEmotions).reduce((acc, [date, emotion]) => {
      const [emotionYear, emotionMonth] = date.split('-').map(Number);
      if (emotionYear === year && emotionMonth === month) {
        acc[emotion] = (acc[emotion] || 0) + 1;
      }
      return acc;
    }, {});

    // Update the counts state
    setCounts(prev => ({
      Happy: monthCounts.Happy || 0,
      Surprise: monthCounts.Surprise || 0,
      Neutral: monthCounts.Neutral || 0,
      Sad: monthCounts.Sad || 0,
      Stressed: monthCounts.Stressed || 0,
      Angry: monthCounts.Angry || 0
    }));

    // Calculate total moods
    const total = Object.values(monthCounts).reduce((sum, count) => sum + count, 0);
    setTotalMoods(total);
  }, [currentDate]);

  // Calculate width for a single emotion
  const calculateWidth = (emotion) => {
    return totalMoods > 0 ? `${(counts[emotion] / totalMoods) * 100}%` : '0%';
  };

  return (
    <View style={styles.moodCountContainer}>
      <View style={styles.moodCountHeader}>
        <Text style={styles.moodCountTitle}>Mood Count</Text>
        <TouchableOpacity onPress={() => navigation.navigate('MoodHistory')}>
          <Text style={styles.historyButton}>History</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.gaugeContainer}>
        <View style={styles.gauge}>
          {Object.keys(emotionColors).map((emotion) => {
            const width = calculateWidth(emotion);
            return width !== '0%' ? (
              <View 
                key={emotion}
                style={[
                  styles.gaugeSegment, 
                  { 
                    backgroundColor: emotionColors[emotion],
                    width: width
                  }
                ]} 
              />
            ) : null;
          })}
        </View>
        <Text style={styles.gaugeNumber}>{totalMoods}</Text>
      </View>
      
      {/* Replace Emotion Dots with Images */}
      <View style={styles.emotionsGrid}>
        {Object.entries(counts).map(([emotion, count]) => (
          <View key={emotion} style={styles.emotionItem}>
            <Image source={emotionImages[emotion]} style={styles.emotionImage} />
            <Text style={styles.emotionText}>{emotion} ({count})</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default function MoodTrackerScreen() {
  const [currentViewDate, setCurrentViewDate] = useState(new Date(2025, 1));

      // Get today's date in YYYY-MM-DD format
  const today = new Date();
  const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // Get today's emotion or default to "Neutral"
  const todayEmotion = dummyEmotions[formattedToday] || 'Neutral';
  

  return (
    <ScrollView style={styles.container}>
       {/* Emotion Display with Dynamic Styling */}
      <View style={[styles.todayEmotionContainer, { backgroundColor: emotionColors[todayEmotion] || '#FFD700' }]}>
        <Text style={styles.todayEmotionText}>
          Today you're {todayEmotion} 😊
        </Text>
      </View>
      <Calendar onMonthChange={setCurrentViewDate} />
      <MoodCount currentDate={currentViewDate} />
      <TouchableOpacity style={styles.checkMoodButton}>
        <Text style={styles.checkMoodText}>Check my Mood</Text>
      </TouchableOpacity>
    </ScrollView>
=======
import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function ScanMyFaceScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Scan My Face</ThemedText>
      </ThemedView>
      <ThemedText>This app includes example code to help you get started.</ThemedText>
      
    </ParallaxScrollView>
>>>>>>> ccce282 (drawer and bottom navigation impl with pages routing)
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  todayEmotionContainer: {
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  todayEmotionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff', // Text color should contrast the background
  },
  calendarContainer: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 12,
    padding: 12, // Reduced padding
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  headerButton: {
    fontSize: 18,
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
  },
  weekDay: {
    color: '#666',
    fontSize: 12,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center', // Center items
    gap: 4, // Add spacing between days
    marginHorizontal: 4,
  },
  dayButton: {
    width: 27, // Decreased from 32
    height: 27, // Decreased from 32
    borderRadius: 20, // Keep circular
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2, // Reduce margin for tighter layout
  },
  
  dayText: {
    fontSize: 12, // Smaller text
  },
  
  dayTextFaded: {
    color: '#999',
  },
  moodCountContainer: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moodCountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  moodCountTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  historyButton: {
    color: '#2196F3',
  },
  gaugeContainer: {
    height: 48,
    marginBottom: 16,
    position: 'relative',
  },
  gauge: {
    flexDirection: 'row',
    height: '100%',
    backgroundColor: '#E0E0E0',
    borderRadius: 24,
    overflow: 'hidden',
  },
  gaugeSegment: {
    height: '100%',
  },
  gaugeNumber: {
    position: 'absolute',
    alignSelf: 'center',
    top: '25%',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666',
  },
  emotionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emotionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '30%',
    marginBottom: 2,
  },
  emotionImage: {
    width: 35,  // Adjust image size
    height: 35, // Adjust image size
    marginRight: 2,
    resizeMode: 'contain',
  },
  emotionText: {
    fontSize: 12,
  },
  checkMoodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5fddf3',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  checkMoodText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
=======
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
>>>>>>> ccce282 (drawer and bottom navigation impl with pages routing)
