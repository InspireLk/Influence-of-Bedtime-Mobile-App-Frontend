import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useNavigation } from "@react-navigation/native";
import { Camera } from "expo-camera";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";

// Define types for mood images and data
type MoodType = "Happy" | "Surprise" | "Neutral" | "Sad" | "Stressed" | "Angry";

const moodImages: Record<MoodType, any> = {
  Happy: require("@/assets/images/happyEmoji.png"),
  Surprise: require("@/assets/images/surpriseEmoji.png"),
  Neutral: require("@/assets/images/neutralEmoji.png"),
  Sad: require("@/assets/images/sadEmoji.png"),
  Stressed: require("@/assets/images/stressEmoji.png"),
  Angry: require("@/assets/images/angryEmoji.png"),
};

const moodData: Record<string, { mood: MoodType; color: string; image: any }> = {
  "2025-02-01": { mood: "Happy", color: "#17C3B2", image: moodImages.Happy },
  "2025-02-02": { mood: "Surprise", color: "#FFA500", image: moodImages.Surprise },
  "2025-02-04": { mood: "Neutral", color: "#FFD700", image: moodImages.Neutral },
  "2025-02-07": { mood: "Sad", color: "#6495ED", image: moodImages.Sad },
  "2025-02-08": { mood: "Stressed", color: "#8A2BE2", image: moodImages.Stressed },
  "2025-02-10": { mood: "Angry", color: "#E63946", image: moodImages.Angry },
};

const getMarkedDates = () => {
  let markedDates: Record<string, any> = {};
  Object.keys(moodData).forEach((date) => {
    markedDates[date] = {
      selected: true,
      selectedColor: moodData[date].color,
    };
  });
  return markedDates;
};

export default function ScanMyFaceScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, "ScanMyFaceScreen">>();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const openCamera = () => {
    if (hasPermission) {
      navigation.navigate("CameraScreen"); // Navigate to the camera screen
    } else {
      alert("Camera permission is required to use this feature.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Calendar */}
      <Calendar
        markedDates={getMarkedDates()}
        style={styles.calendar}
        theme={{
          todayTextColor: "#ff5722",
          arrowColor: "#ff9800",
        }}
        onDayPress={(day) => {
          // Navigate to the mood details page with the selected date
          navigation.navigate("MoodDetailScreen", { date: day.dateString });
        }}
      />

      {/* Check Mood Button */}
      <TouchableOpacity style={styles.cameraButton} onPress={openCamera}>
        <Image source={require("@/assets/images/moon.png")} style={styles.cameraIcon} />
        <Text style={styles.cameraText}>Check my Mood</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 10,
  },
  calendar: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
  },
  cameraButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF9800",
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
  },
  cameraIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  cameraText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
