// import React, { useState, useEffect, useRef } from 'react';
// import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
// import axios from 'axios';

// type Message = {
//   text: string;
//   isBot: boolean;
// };

// interface ApiResponse {
//   stress_level: string;
//   emotion: string;
//   intervention: string;
// }

// // Define multiple question sets with type (text or yes/no) and answers
// const questionSets = [
//   [
//     { question: "Hello! How are you feeling at this moment?", type: "text" },
//     { question: "Can you share what might be causing this?", type: "text" },
//     { question: "How has this been affecting your day so far?", type: "text" },
//     { question: "What is your current preference for spending your time?", type: "text" },
//   ],
//   [
//     { question: "Can you describe any physical symptoms you are experiencing, such as headaches, tension, or fatigue?", type: "text" },
//     { question: "Have you noticed any recent changes in your sleep patterns or appetite?", type: "yesno", positiveAnswer: "I have noticed changes in my sleep patterns or appetite.", negativeAnswer: "I have not noticed changes in my sleep patterns or appetite." },
//     { question: "How do you usually cope with stress or emotional difficulties?", type: "text" },
//     { question: "Is there anything specific that has been on your mind frequently?", type: "yesno", positiveAnswer: "I have had specific thoughts on my mind frequently.", negativeAnswer: "I have not had specific thoughts on my mind frequently." },
//   ],
//   [
//     { question: "When was the last time you felt completely relaxed, and what were you doing?", type: "text" },
//     { question: "Do you find it difficult to concentrate or make decisions lately?", type: "yesno", positiveAnswer: "I have been finding it difficult to concentrate or make decisions.", negativeAnswer: "I have not been finding it difficult to concentrate or make decisions." },
//     { question: "How often do you feel overwhelmed by your daily tasks and responsibilities?", type: "text" },
//     { question: "Have you noticed any recent changes in your interactions with family, friends, or colleagues?", type: "text" },
//   ],
//   [
//     { question: "Have you been feeling more irritable or impatient than usual?", type: "yesno", positiveAnswer: "I have been feeling more irritable or impatient than usual.", negativeAnswer: "I have not been feeling more irritable or impatient than usual." },
//     { question: "Do you often feel drained or exhausted, even after resting?", type: "yesno", positiveAnswer: "I often feel drained or exhausted, even after resting.", negativeAnswer: "I do not feel drained or exhausted, even after resting." },
//     { question: "How do you usually react to unexpected challenges or stressful situations?", type: "text" },
//     { question: "Have you recently felt a loss of interest in activities you used to enjoy?", type: "yesno", positiveAnswer: "I have recently felt a loss of interest in activities I used to enjoy.", negativeAnswer: "I have not felt a loss of interest in activities I used to enjoy." },
//   ]
// ];

// const SleepInterventionScreen: React.FC = () => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [userInput, setUserInput] = useState<string>('');
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
//   const [currentQuestionSet, setCurrentQuestionSet] = useState<any[]>([]);
//   const [answers, setAnswers] = useState<string[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const flatListRef = useRef<FlatList>(null);

//   // Randomly select a question set when the component mounts
//   useEffect(() => {
//     const randomSet = questionSets[Math.floor(Math.random() * questionSets.length)];
//     setCurrentQuestionSet(randomSet);
//   }, []);

//   useEffect(() => {
//     if (currentQuestionSet.length > 0) {
//       addMessage(currentQuestionSet[currentQuestionIndex].question, true);
//     }
//   }, [currentQuestionSet, currentQuestionIndex]);

//   const addMessage = (text: string, isBot: boolean) => {
//     setMessages((prevMessages) => [...prevMessages, { text, isBot }]);

//     setTimeout(() => {
//       flatListRef.current?.scrollToEnd({ animated: true });
//     }, 200);
//   };

//   const sendToBackend = async (updatedAnswers: string[]) => {
//     setLoading(true);
//     console.log("##############");
//     console.log(updatedAnswers.join(' '));
//     console.log("##############");
//     try {
//       const response = await axios.post<ApiResponse>(
//         'http://10.0.2.2:5001/predictIntervention',
//         {
//           answers: updatedAnswers.join(' '),
//           user_level: 2,
//         },
//         { headers: { 'Content-Type': 'application/json' } }
//       );

//       addMessage(
//         `Your current emotion is ${response.data.emotion}, and your stress level is ${response.data.stress_level}. Suggested intervention: ${response.data.intervention}`,
//         true
//       );
//     } catch (error) {
//       addMessage('Failed to submit answers. Please try again.', true);
//       console.error('Error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTextAnswer = () => {
//     if (!userInput.trim()) return;

//     setErrorMessage(null);

//     const updatedAnswers = [...answers, userInput];
//     setAnswers(updatedAnswers);
//     addMessage(userInput, false);
//     setUserInput('');

//     if (currentQuestionIndex < currentQuestionSet.length - 1) {
//       setCurrentQuestionIndex((prev) => prev + 1);
//     } else {
//       sendToBackend(updatedAnswers);
//     }
//   };

//   const handleYesNoAnswer = (answer: 'Yes' | 'No') => {
//     const question = currentQuestionSet[currentQuestionIndex];
//     const formattedAnswer = answer === 'Yes' ? question.positiveAnswer : question.negativeAnswer;

//     const updatedAnswers = [...answers, formattedAnswer];
//     setAnswers(updatedAnswers);
//     addMessage(formattedAnswer, false);
//     setUserInput('');

//     if (currentQuestionIndex < currentQuestionSet.length - 1) {
//       setCurrentQuestionIndex((prev) => prev + 1);
//     } else {
//       sendToBackend(updatedAnswers);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <FlatList
//         ref={flatListRef}
//         data={messages}
//         keyExtractor={(_, index) => index.toString()}
//         renderItem={({ item }) => (
//           <View style={item.isBot ? styles.botMessage : styles.userMessage}>
//             <Text>{item.text}</Text>
//           </View>
//         )}
//       />
//       {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

//       {currentQuestionSet.length > 0 && (
//         <>
//           {currentQuestionSet[currentQuestionIndex].type === 'text' && (
//             <>
//               <Text style={styles.question}>{currentQuestionSet[currentQuestionIndex].question}</Text>
//               <TextInput
//                 style={styles.input}
//                 value={userInput}
//                 onChangeText={setUserInput}
//                 placeholder="Type your answer..."
//               />
//               <Button title={loading ? 'Processing...' : 'Send'} onPress={handleTextAnswer} disabled={loading || userInput.trim() === ''} />
//             </>
//           )}

//           {currentQuestionSet[currentQuestionIndex].type === 'yesno' && (
//             <>
//               <Text style={styles.question}>{currentQuestionSet[currentQuestionIndex].question}</Text>

//               <View style={styles.buttonContainer}>
//                 <TouchableOpacity
//                   style={styles.button}
//                   onPress={() => handleYesNoAnswer('Yes')}
//                 >
//                   <Text style={styles.buttonText}>Yes</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={styles.button}
//                   onPress={() => handleYesNoAnswer('No')}
//                 >
//                   <Text style={styles.buttonText}>No</Text>
//                 </TouchableOpacity>
//               </View>
//             </>
//           )}
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16 },
//   botMessage: { alignSelf: 'flex-start', backgroundColor: '#f1f1f1', padding: 8, borderRadius: 8, marginBottom: 8 },
//   userMessage: { alignSelf: 'flex-end', backgroundColor: '#007bff', padding: 8, borderRadius: 8, marginBottom: 8 },
//   input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 8 },
//   errorText: { color: 'red', marginBottom: 8, textAlign: 'center' },
//   buttonContainer: { flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20 },
//   button: { backgroundColor: '#007bff', padding: 10, borderRadius: 8, marginHorizontal: 10 },
//   buttonText: { color: 'white', fontSize: 16 },
//   question: { marginBottom: 20, fontSize: 18, textAlign: 'center' },
// });

// export default SleepInterventionScreen;

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native'; // For resetting state when screen comes into focus

type Message = {
  text: string;
  isBot: boolean;
};

interface ApiResponse {
  stress_level: string;
  emotion: string;
  intervention: string;
}

const questionSets = [
  [
    { question: "Hello! How are you feeling at this moment?", type: "text" },
    { question: "Can you share what might be causing this?", type: "text" },
    { question: "How has this been affecting your day so far?", type: "text" },
    { question: "What is your current preference for spending your time?", type: "text" },
  ],
  [
    { question: "Can you describe any physical symptoms you are experiencing, such as headaches, tension, or fatigue?", type: "text" },
    { question: "Have you noticed any recent changes in your sleep patterns or appetite?", type: "yesno", positiveAnswer: "I have noticed changes in my sleep patterns or appetite.", negativeAnswer: "I have not noticed changes in my sleep patterns or appetite." },
    { question: "How do you usually cope with stress or emotional difficulties?", type: "text" },
    { question: "Is there anything specific that has been on your mind frequently?", type: "yesno", positiveAnswer: "I have had specific thoughts on my mind frequently.", negativeAnswer: "I have not had specific thoughts on my mind frequently." },
  ],
  [
    { question: "When was the last time you felt completely relaxed, and what were you doing?", type: "text" },
    { question: "Do you find it difficult to concentrate or make decisions lately?", type: "yesno", positiveAnswer: "I have been finding it difficult to concentrate or make decisions.", negativeAnswer: "I have not been finding it difficult to concentrate or make decisions." },
    { question: "How often do you feel overwhelmed by your daily tasks and responsibilities?", type: "text" },
    { question: "Have you noticed any recent changes in your interactions with family, friends, or colleagues?", type: "text" },
  ],
  [
    { question: "Have you been feeling more irritable or impatient than usual?", type: "yesno", positiveAnswer: "I have been feeling more irritable or impatient than usual.", negativeAnswer: "I have not been feeling more irritable or impatient than usual." },
    { question: "Do you often feel drained or exhausted, even after resting?", type: "yesno", positiveAnswer: "I often feel drained or exhausted, even after resting.", negativeAnswer: "I do not feel drained or exhausted, even after resting." },
    { question: "How do you usually react to unexpected challenges or stressful situations?", type: "text" },
    { question: "Have you recently felt a loss of interest in activities you used to enjoy?", type: "yesno", positiveAnswer: "I have recently felt a loss of interest in activities I used to enjoy.", negativeAnswer: "I have not felt a loss of interest in activities I used to enjoy." },
  ]
];



const SleepInterventionScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [currentQuestionSet, setCurrentQuestionSet] = useState<any[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [questionVisible, setQuestionVisible] = useState<boolean>(true);
  const [interventionResponse, setInterventionResponse] = useState<ApiResponse | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const randomSet = questionSets[Math.floor(Math.random() * questionSets.length)];
    setCurrentQuestionSet(randomSet);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Reset all states when the screen is focused
      setMessages([]);
      setUserInput('');
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setInterventionResponse(null);
      setModalVisible(false);
      setQuestionVisible(true);
    }, [])
  );

  useEffect(() => {
    if (currentQuestionSet.length > 0) {
      addMessage(currentQuestionSet[currentQuestionIndex].question, true);
    }
  }, [currentQuestionSet, currentQuestionIndex]);

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

      setInterventionResponse(response.data);
      if(response.data){
        setQuestionVisible(false);
      }
      setModalVisible(true); // Show the modal with suggestions
    } catch (error) {
      addMessage('Failed to submit answers. Please try again.', true);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTextAnswer = () => {
    if (!userInput.trim()) return;

    const isValid = isValidInput(userInput);
    if (!isValid) {
      setErrorMessage('Please enter a valid answer');
      return;
    }

    setErrorMessage(null);

    const updatedAnswers = [...answers, userInput];
    setAnswers(updatedAnswers);
    addMessage(userInput, false);
    setUserInput('');

    if (currentQuestionIndex < currentQuestionSet.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      sendToBackend(updatedAnswers);
    }
  };

  const handleYesNoAnswer = (answer: 'Yes' | 'No') => {
    const question = currentQuestionSet[currentQuestionIndex];
    const formattedAnswer = answer === 'Yes' ? question.positiveAnswer : question.negativeAnswer;

    const updatedAnswers = [...answers, formattedAnswer];
    setAnswers(updatedAnswers);
    addMessage(formattedAnswer, false);
    setUserInput('');

    if (currentQuestionIndex < currentQuestionSet.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      sendToBackend(updatedAnswers);
    }
  };

  const handleRestart = () => {
    // Reset the state to clear previous answers and data
    setMessages([]);
    setUserInput('');
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setInterventionResponse(null);
    setModalVisible(false);
  
    // Randomly select a new question set
    const randomSet = questionSets[Math.floor(Math.random() * questionSets.length)];
    setCurrentQuestionSet(randomSet);
    setQuestionVisible(true);  // Ensure the questions are visible
  };
  

  const isValidInput = (text: string): boolean => {
    const words = text.split(' ');
    const isValid = words.every(word => /^[a-zA-Z]{3,}$/.test(word) && !/^([a-zA-Z])\1+$/.test(word));
    const hasDuplicates = new Set(words).size !== words.length;
    return isValid && !hasDuplicates;
  };

  const handleCloseModal = () => {
    setModalVisible(false);
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

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      {currentQuestionSet.length > 0 && questionVisible ? (
        <>
          {currentQuestionSet[currentQuestionIndex].type === 'text' && (
            <>
              <Text style={styles.question}>{currentQuestionSet[currentQuestionIndex].question}</Text>
              <TextInput
                style={styles.input}
                value={userInput}
                onChangeText={setUserInput}
                placeholder="Type your answer..."
              />
              <Button title={loading ? 'Processing...' : 'Send'} onPress={handleTextAnswer} disabled={loading || userInput.trim() === ''} />
            </>
          )}

          {currentQuestionSet[currentQuestionIndex].type === 'yesno' && (
            <>
              <Text style={styles.question}>{currentQuestionSet[currentQuestionIndex].question}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleYesNoAnswer('Yes')}
                >
                  <Text style={styles.buttonText}>Yes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleYesNoAnswer('No')}
                >
                  <Text style={styles.buttonText}>No</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </>
      ):
      (
        <View style={styles.resetContainer}>
        <Text style={styles.informationText}>
          You have completed all the questions or there's an issue with the questions.
        </Text>
        <Button 
          title="Restart and Get New Questions" 
          onPress={() => handleRestart()}
        />
      </View>
      )
      }

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {interventionResponse && (
              <>
                <Text style={styles.modalText}>Emotion: {interventionResponse.emotion}</Text>
                <Text style={styles.modalText}>Stress Level: {interventionResponse.stress_level}</Text>
                <Text style={styles.modalText}>Suggested Intervention: {interventionResponse.intervention}</Text>
                <Button title="Close" onPress={handleCloseModal} />
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  botMessage: { alignSelf: 'flex-start', backgroundColor: '#f1f1f1', padding: 8, borderRadius: 8, marginBottom: 8 },
  userMessage: { alignSelf: 'flex-end', backgroundColor: '#007bff', padding: 8, borderRadius: 8, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 8 },
  errorText: { color: 'red', marginBottom: 8, textAlign: 'center' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20 },
  button: { backgroundColor: '#007bff', padding: 10, borderRadius: 8, marginHorizontal: 10 },
  buttonText: { color: 'white', fontSize: 16 },
  question: { marginBottom: 20, fontSize: 18, textAlign: 'center' },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '80%',
  },
  modalText: { fontSize: 18, marginBottom: 10 },
  resetContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  informationText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default SleepInterventionScreen;
