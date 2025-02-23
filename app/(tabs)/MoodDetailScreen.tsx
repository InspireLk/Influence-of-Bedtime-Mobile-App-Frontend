import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { moodImages, moodData, MoodType } from "./scan_my_face";

export default function MoodDetailScreen() {
  const route = useRoute();
  const { date } = route.params;

  const [note, setNote] = useState<string>("");

  const moodDetails = moodData[date];
  const moodImage = moodDetails ? moodDetails.image : null;
  const mood = moodDetails ? moodDetails.mood : "No Mood";

  const handleSaveNote = () => {
    // Logic to save note
    console.log("Note saved:", note);
    alert("Note saved!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mood Detail</Text>

      {/* Display Mood Image */}
      {moodImage && <Image source={moodImage} style={styles.moodImage} />}

      <Text style={styles.moodText}>{mood}</Text>
      <Text style={styles.dateText}>Date: {date}</Text>

      {/* Add a Note */}
      <TextInput
        style={styles.textInput}
        placeholder="Add a note"
        value={note}
        onChangeText={setNote}
        multiline
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveNote}>
        <Text style={styles.saveButtonText}>Save Note</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  moodImage: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 20,
  },
  moodText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    textAlign: "center",
    color: "#888",
    marginBottom: 20,
  },
  textInput: {
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#FF9800",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
