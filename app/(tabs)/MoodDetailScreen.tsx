import React, { useState } from 'react';
import {
  View, Text, Image, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, KeyboardAvoidingView,
  Platform, ScrollView, Keyboard, TouchableWithoutFeedback
} from 'react-native';

const MoodDetailsScreen = ({ route }) => {
  const [reason, setReason] = useState('');
  const { photoUri } = route.params;
  const { mood } = route.params || 'happy';

  // Add current date formatting
  const getCurrentDate = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const now = new Date();
    const dayName = days[now.getDay()];
    return dayName;
  };

  const date = getCurrentDate();

  const handleSave = () => {
    // Here you would save the mood data
    console.log('Saving mood:', { mood, reason, photoUri });
    // Navigate back or to another screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >

            <View style={styles.header}>
              <Text style={styles.dayText}>{date}</Text>
            </View>
            <View style={styles.content}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: photoUri }}
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.moodSection}>
                <Text style={styles.moodTitle}>
                  Today you're {mood},
                </Text>
                <Text style={styles.moodQuestion}>
                  What is the reason?
                </Text>
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Type here.."
                  multiline
                  value={reason}
                  onChangeText={setReason}
                  placeholderTextColor="#999"
                />
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSave}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
  },
  dayText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100, // Add extra padding at bottom
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  imageContainer: {
    width: '80%',
    height: 200, // Fixed height instead of percentage
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  moodSection: {
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
  },
  moodTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  moodQuestion: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  inputContainer: {
    marginTop: 20,
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  input: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
    minHeight: 100,
  },
  saveButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#A5EEB8',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#333',
  },
});

export default MoodDetailsScreen;