import axios, { endpoints } from "@/utils/axios";
import { useFocusEffect } from "expo-router";
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { Calendar } from "react-native-calendars";
import { SleepRecord } from "./SleepPredictionScreen";

const getMarkedDates = (dates: string[]) => {
  let markedDates: { [date: string]: any } = {};

  dates.forEach((date) => {
    markedDates[date] = {
      selected: true,
      selectedColor: "#fbc02d",
    };
  });

  return markedDates;
};

const getConsecutiveDays = (sleepDates: string[]) => {
  const today = new Date().toISOString().split("T")[0];
  let consecutiveDays = 0;

  const sortedDates = sleepDates.sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  for (let i = 0; i < sortedDates.length; i++) {
    const current = new Date(sortedDates[i]);
    const next = new Date(current);
    next.setDate(current.getDate() + 1);

    if (
      next.toISOString().split("T")[0] === today ||
      (i < sortedDates.length - 1 &&
        next.toISOString().split("T")[0] === sortedDates[i + 1])
    ) {
      consecutiveDays++;
    } else {
      break;
    }
  }

  return consecutiveDays;
};

export default function StakeSociety() {
  const [streak, setStreak] = useState<number>(0);
  const [sleepCount, setSleepCount] = useState<number>(0);
  const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>([]);
  const [streakLost, setStreakLost] = useState<boolean>(false);
  const [consecutiveDays, setConsecutiveDays] = useState<number>(0);

  useFocusEffect(
    React.useCallback(() => {
      const fetchSleepRecords = async () => {
        try {
          const response = await axios.get(
            endpoints.sleepPrediction.getAllRecords
          );
          const data = await response.data;

          const records: SleepRecord[] = data.map((item: any) => ({
            date: item.date.split("T")[0],
            sleepDuration: item.sleepDuration,
          }));

          const sortedRecords = records
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .slice(0, 5);

          setSleepRecords(sortedRecords);
          setStreak(sortedRecords.length);
          setSleepCount(getCurrentMonthSleepCount(sortedRecords));
          setStreakLost(
            sortedRecords.length === 0 ||
            !isStreakBroken(sortedRecords.map((rec) => rec.date))
          );
          setConsecutiveDays(
            getConsecutiveDays(sortedRecords.map((rec) => rec.date))
          );
        } catch (error) {
          console.error("Error fetching sleep records", error);
        }
      };

      fetchSleepRecords();
    }, [])
  );

  const getCurrentMonthSleepCount = (records: SleepRecord[]): number => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const filteredRecords = records.filter((record) => {
      const recordedDate = new Date(record.date);
      return (
        recordedDate.getMonth() === currentMonth &&
        recordedDate.getFullYear() === currentYear
      );
    });

    return filteredRecords.length;
  };

  const isStreakBroken = (sleepDates: string[]) => {
    const today = new Date().toISOString().split("T")[0];
    let streakLost = false;

    for (let i = 0; i < sleepDates.length - 1; i++) {
      const current = new Date(sleepDates[i]);
      const next = new Date(sleepDates[i + 1]);

      const diffInDays =
        (next.getTime() - current.getTime()) / (1000 * 3600 * 24);
      if (diffInDays > 1) {
        streakLost = true;
        break;
      }
    }

    return streakLost;
  };

  return (
    <View style={styles.container}>
      {/* Streak Display */}
      <Image source={require("@/assets/images/fire.png")} style={styles.icon} />
      <Text style={styles.title}></Text>
      {!streakLost ? (
        <Text style={styles.streakText}>
          You are going strong for {consecutiveDays} consecutive days
        </Text>
      ) : (
        <Text style={styles.streakText}>
          Start recording to begin your streak
        </Text>
      )}
      <Text style={styles.subtitle}>
        Record a sleep not to lose your streak
      </Text>

      {/* Calendar */}
      <Calendar
        markedDates={getMarkedDates(sleepRecords.map((record) => record.date))}
        style={{
          width: 350,
          height: 350,
          borderRadius: 10,
          padding: 50,
          backgroundColor: "white",
        }}
        theme={{
          todayTextColor: "#ff5722",
          arrowColor: "#ff5722",
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
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

    textAlign: "center",
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
