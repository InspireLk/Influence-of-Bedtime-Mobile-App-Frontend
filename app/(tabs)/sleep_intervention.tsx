import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

// Define types for messages
type Message = {
  text: string;
  isBot: boolean;
};

interface ApiResponse {
  stress_level: string;
  emotion: string;
  intervention: string;
}

const SleepInterventionScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const flatListRef = useRef<FlatList>(null);

  const questions = [
    "Hello Name! How are you feeling at this moment?",
    "Can you share what might be causing this?",
    "How has this been affecting your day so far?",
    "What is your current preference for spending your time?",
  ];

  useEffect(() => {
    if (currentQuestionIndex < questions.length) {
      addMessage(questions[currentQuestionIndex], true);
    }
  }, [currentQuestionIndex]);

  const addMessage = (text: string, isBot: boolean) => {
    setMessages((prevMessages) => [...prevMessages, { text, isBot }]);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 200);
  };

  const sendToBackend = async (updatedAnswers: string[]) => {
    setLoading(true);
    try {
      const response = await axios.post<ApiResponse>(
        'http://10.0.2.2:5001/predictIntervention',
        {
          answers: updatedAnswers.join(' '),
          user_level: 2,
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      addMessage(
        `Your current emotion is ${response.data.emotion}, and your stress level is ${response.data.stress_level}. Suggested intervention: ${response.data.intervention}`,
        true
      );
    } catch (error) {
      addMessage('Failed to submit answers. Please try again.', true);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (!userInput.trim()) return;

    const updatedAnswers = [...answers, userInput];
    setAnswers(updatedAnswers);
    addMessage(userInput, false);
    setUserInput('');

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      sendToBackend(updatedAnswers);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={item.isBot ? styles.botMessage : styles.userMessage}>
            <Text>{item.text}</Text>
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        value={userInput}
        onChangeText={setUserInput}
        placeholder="Type your answer..."
      />
      <Button title={loading ? 'Processing...' : 'Send'} onPress={handleSend} disabled={loading || userInput.trim() === ''} />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  botMessage: { alignSelf: 'flex-start', backgroundColor: '#f1f1f1', padding: 8, borderRadius: 8, marginBottom: 8 },
  userMessage: { alignSelf: 'flex-end', backgroundColor: '#007bff', padding: 8, borderRadius: 8, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 8 },
});

export default SleepInterventionScreen;
