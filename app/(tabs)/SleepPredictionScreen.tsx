import React, { useState } from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions, ScrollView } from "react-native";
import tw from "twrnc";
import axios, { endpoints } from "@/utils/axios";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { predictSleepDuration } from "@/utils/helper";
import { useRouter } from "expo-router";

export type SleepRecord = {
  date: string;
  sleepDuration: number;
};

const getSleepQuality = (averageSleep: number) => {
  if (averageSleep >= 7) return { label: "Good", color: "green" };
  if (averageSleep >= 5) return { label: "Warning", color: "yellow" };
  return { label: "Bad", color: "red" };
};

const SleepPredictionScreen = () => {
  const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>([]);
  const [predictedSleep, setPredictedSleep] = useState<number[]>([]);
  const [predictedDates, setPredictedDates] = useState<string[]>([]);
  const navigation = useNavigation();
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      const fetchSleepRecords = async () => {
        const response = await axios.get(
          endpoints.sleepPrediction.getAllRecords
        );
        const data = await response.data;

        const records: SleepRecord[] = data.map((item: any) => ({
          date: item.date,
          sleepDuration: item.sleepDuration,
        }));

        const sortedRecords = records
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(0, 5);

        setSleepRecords(sortedRecords);

        const lastRecordDate = new Date(sortedRecords[0].date);
        const predictedDatesData = [
          new Date(
            lastRecordDate.setDate(lastRecordDate.getDate() + 1)
          ).toLocaleDateString(),
          new Date(
            lastRecordDate.setDate(lastRecordDate.getDate() + 1)
          ).toLocaleDateString(),
        ];

        const predictedSleepData = predictSleepDuration(sortedRecords);

        setPredictedSleep(predictedSleepData);
        setPredictedDates(predictedDatesData);
      };

      fetchSleepRecords();
    }, [])
  );

  const averageSleep =
    [...sleepRecords.map((r) => r.sleepDuration), ...predictedSleep].reduce(
      (a, b) => a + b,
      0
    ) /
    (sleepRecords.length + predictedSleep.length);
  const sleepQuality = getSleepQuality(averageSleep);

  return (
    <ScrollView
      style={tw`flex-1 mt-5`}
      contentContainerStyle={tw`items-center`}
    >
      <Text style={tw`text-xl font-bold mb-4`}>
        Your Predicted Sleep Pattern
      </Text>

      {sleepRecords.length > 0 && predictedSleep.length > 0 ? (
        <>
          <LineChart
            verticalLabelRotation={90}
            xLabelsOffset={0}
            data={{
              labels: [
                ...sleepRecords.map((record) =>
                  new Date(record.date).toLocaleDateString()
                ),
                ...predictedDates,
              ],
              datasets: [
                {
                  data: [
                    ...sleepRecords.map((record) => record.sleepDuration),
                    ...new Array(predictedDates.length).fill(null),
                  ],
                  strokeWidth: 2,
                  color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
                },
                {
                  data: [
                    ...new Array(sleepRecords.length).fill(null),
                    ...predictedSleep,
                  ],
                  strokeWidth: 2,
                  color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
                },
              ],
            }}
            width={Dimensions.get("window").width}
            height={400}
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726",
              },
            }}
            bezier
          />

          <View style={tw`mt-5 p-4 bg-gray-100 rounded-lg w-11/12`}>
            <Text style={tw`text-lg font-semibold`}>Sleep Habit Analysis</Text>
            <Text style={tw`text-base mt-2`}>
              Your average sleep duration is{" "}
              <Text style={tw`font-bold`}>{averageSleep.toFixed(1)} hours</Text>
              .
            </Text>
            <View
              style={tw`mt-3 px-4 py-2 rounded-full self-start bg-${sleepQuality.color}-500`}
            >
              <Text style={tw`text-white font-semibold`}>
                {sleepQuality.label} Sleep
              </Text>
            </View>
          </View>

          <View style={tw`mt-10 w-11/12`}>
            {/* <Button
              title="View Detailed Analysis"
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/SleepRecommendationScreen",
                  params: { sleepQualityColor: sleepQuality.color },
                })
              }
            /> */}
            <TouchableOpacity
              style={tw`bg-blue-500 rounded-lg py-3`}
              onPress={() =>
                navigation.navigate("SleepRecommendation" as never)
              }
            >
              <Text style={tw`text-white text-lg font-semibold text-center`}>
                View Sleep Recommendations
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text style={tw`text-lg text-gray-500`}>Loading...</Text>
      )}
    </ScrollView>
  );
};

export default SleepPredictionScreen;
