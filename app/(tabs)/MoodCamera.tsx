import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import React, { useState, useRef, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import { io } from 'socket.io-client';

// API URL configuration - using your specific IP address
const SERVER_URL = 'http://192.168.8.152:5000';

export default function MoodCamera() {
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState('Unknown');
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  const cameraRef = useRef<CameraView>(null);
  const socketRef = useRef<any>(null);
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const navigation = useNavigation();

  // Set up socket connection
  useEffect(() => {
    // Initialize socket
    socketRef.current = io(SERVER_URL);

    // Socket event listeners
    socketRef.current.on('connect', () => {
      console.log('Connected to server');
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsStreaming(false);
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
        streamIntervalRef.current = null;
      }
    });

    socketRef.current.on('emotion_result', (data) => {
      setCurrentEmotion(data.emotion);
      setProcessedImage(data.processed_image);
    });

    socketRef.current.on('error', (data) => {
      setError(data.message);
    });

    // Clean up on unmount
    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const convertToBase64 = async (uri: string) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw error;
    }
  };

  const captureFrame = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.2,  // Lower quality for faster streaming
          exif: false,   // Reduce file size
        });

        if (photo) {
          const base64Image = await convertToBase64(photo.uri);
          return base64Image;
        }
      } catch (error: any) {
        console.error('Failed to capture frame:', error);
        setError(error.message || 'Error capturing frame');
        return null;
      }
    }
    return null;
  };

  const toggleStreaming = async () => {
    if (isStreaming) {
      // Stop streaming
      setIsStreaming(false);
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
        streamIntervalRef.current = null;
      }
    } else {
      // Start streaming
      setIsStreaming(true);
      setError(null);

      // Stream frames at a rate of 5 frames per second
      streamIntervalRef.current = setInterval(async () => {
        const base64Image = await captureFrame();
        if (base64Image && socketRef.current?.connected) {
          socketRef.current.emit('frame', { image: base64Image });
        }
      }, 200);  // 200ms interval = 5fps
    }
  };

  const takeSinglePicture = async () => {
    if (cameraRef.current) {
      try {
        setLoading(true);
        setError(null);

        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.5,
          exif: false,
        });

        if (photo) {
          console.log('Photo captured:', photo.uri);

          // Convert image to base64
          const base64Image = await convertToBase64(photo.uri);
          console.log('Image converted to base64, length:', base64Image.length);

          // Navigate to details screen with the captured photo
          navigation.navigate('MoodDetailScreen', {
            photoUri: photo.uri,
            mood: currentEmotion,
            processedImageBase64: processedImage
          });
        }
      } catch (error: any) {
        console.error('Failed to process image:', error);
        setError(error.message || 'Error processing image. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
      >
        {processedImage && (
          <View style={styles.overlayContainer}>
            <Image
              source={{ uri: `data:image/jpeg;base64,${processedImage}` }}
              style={styles.overlay}
              resizeMode="contain"
            />
          </View>
        )}

        <View style={styles.emotionContainer}>
          <Text style={styles.emotionText}>Current Emotion: {currentEmotion}</Text>
        </View>

        <View style={styles.controlsContainer}>
          <TouchableOpacity style={styles.controlButton} onPress={toggleCameraFacing}>
            <Ionicons name="camera-reverse" size={32} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.streamButton, isStreaming ? styles.streamingActive : {}]}
            onPress={toggleStreaming}
          >
            <Text style={styles.streamButtonText}>
              {isStreaming ? 'Stop Stream' : 'Start Stream'}
            </Text>
          </TouchableOpacity>

          {loading ? (
            <View style={styles.captureButton}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          ) : (
            <TouchableOpacity
              style={styles.captureButton}
              onPress={takeSinglePicture}
              disabled={loading}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          )}
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  emotionContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
  },
  emotionText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  streamButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  streamingActive: {
    backgroundColor: 'rgba(255, 0, 0, 0.6)',
  },
  streamButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 50,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  errorContainer: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 5,
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
  },
});