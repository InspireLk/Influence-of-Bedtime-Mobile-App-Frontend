import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { Calendar } from "react-native-calendars";

// Dummy data simulating recorded sleep dates
const recordedSleepData = [
  "2025-02-01",
  "2025-02-02",
  "2025-02-04",
  "2025-02-07",
  "2025-02-08",
  "2025-02-10",
  "2025-02-11",
  "2025-02-12",
  "2025-02-14",
  "2025-02-15",
  "2025-02-16",
  "2025-02-17",
  "2025-02-18",
  "2025-02-19",
  "2025-02-20",
  "2025-02-21",
  "2025-02-22",
];

// Function to mark dates in the calendar
const getMarkedDates = (dates: string[]) => {
  let markedDates: { [date: string]: any } = {};
  dates.forEach((date) => {
    markedDates[date] = {
      selected: true,
      selectedColor: "#fbc02d", // Yellow for recorded sleep
    };
  });
  return markedDates;
};



// Function to count how many times sleep has been recorded this month
const getCurrentMonthSleepCount = (dates: string[]): number => {
  const today = new Date();
  const currentMonth = today.getMonth(); // 0-11 (January = 0)
  const currentYear = today.getFullYear();

  // Filter dates that belong to the current month and year
  const filteredDates = dates.filter(date => {
    const recordedDate = new Date(date);
    return recordedDate.getMonth() === currentMonth && recordedDate.getFullYear() === currentYear;
  });

  return filteredDates.length; // Return the count of sleep records for this month
};

export default function StakeSociety() {
  const [streak, setStreak] = useState<number>(0);
  const [sleepCount, setSleepCount] = useState<number>(0);

  useEffect(() => {
    setSleepCount(getCurrentMonthSleepCount(recordedSleepData));
  }, []);

  return (
    <View style={styles.container}>
      {/* Streak Display */}
      <Image source={require('@/assets/images/fire.png')} style={styles.icon} />
      <Text style={styles.title}>You are going strong for</Text>
      <Text style={styles.streakText}>{sleepCount} days</Text>
      <Text style={styles.subtitle}>Record a sleep not to lose your streak</Text>



      {/* Calendar */}
      <Calendar 
  markedDates={getMarkedDates(recordedSleepData)}
  style={{
    width: 350,  // Adjust width
    height: 350, // Adjust height
    borderRadius: 10, // Optional: rounded corners
    padding: 50, // Add padding inside
    backgroundColor: "white", // Background color
  }}
  theme={{
    todayTextColor: "#ff5722",
    arrowColor: "#ff5722",
    textDayFontSize: 16,  // Resize day numbers
    textMonthFontSize: 18, // Resize month title
    textDayHeaderFontSize: 14, // Resize day names (Mon, Tue, etc.)
  }}
/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  icon: {
    width: 60,
    height: 70,
    marginTop: 15,
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "500",
  },
  streakText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#ff9800",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 15,
    color: "#666",
    marginBottom: 10,
  },
  sleepCountText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
    marginTop: 10,
  },
});

