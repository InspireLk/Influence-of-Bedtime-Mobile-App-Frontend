import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Provider, DefaultTheme } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios, { endpoints } from "@/utils/axios";

const SleepRecordScreen = () => {
  const [hoursSlept, setHoursSlept] = useState("");
  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [stepCount, setStepCount] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = async () => {
    const response = await axios.post(endpoints.sleepPrediction.addRecord, {
      date: date,
      sleepDuration: hoursSlept,
      dailyStepCount: stepCount,
    });
    if (response.status === 201) {
      Alert.alert("Success", "Record saved successfully");
    } else {
      Alert.alert("Error", "Failed to save record");
    }
  };

  return (
    <Provider theme={DefaultTheme}>
      <View style={styles.container}>
        <Text style={styles.title}>Sleep Record</Text>

        {/* Hours Slept Input */}
        <TextInput
          style={styles.input}
          placeholder="Hours Slept"
          keyboardType="numeric"
          value={hoursSlept}
          onChangeText={setHoursSlept}
        />

        <TextInput
          style={styles.input}
          placeholder="Ho many steps did you walk"
          keyboardType="numeric"
          value={stepCount}
          onChangeText={setStepCount}
        />

        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          activeOpacity={0.7}
        >
          <TextInput
            style={styles.input}
            value={date.toDateString()}
            editable={false} // Prevent manual editing
          />
        </TouchableOpacity>

        {/* Date Picker (Hidden by default) */}
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        {/* Description Input */}
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe your day..."
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />

        {/* Save Button */}
        <Button title="Save" onPress={handleSave} />
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
});

export default SleepRecordScreen;
