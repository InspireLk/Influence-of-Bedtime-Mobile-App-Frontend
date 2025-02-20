<<<<<<< HEAD
import { StyleSheet, View, Platform } from 'react-native';
=======
import { StyleSheet, Image, Platform } from 'react-native';
>>>>>>> ccce282 (drawer and bottom navigation impl with pages routing)

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
<<<<<<< HEAD
import SleepPredictionScreen from './SleepPredictionScreen';

export default function MySleepPredictionsScreen() {
  return (
    <View style={styles.container}>
      <SleepPredictionScreen /> {/* Call the SleepPredictionScreen */}
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
=======

export default function MySleepPredictionsScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">My Sleep Predictions</ThemedText>
      </ThemedView>
      <ThemedText>This app includes example code to help you get started.</ThemedText>
      
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
>>>>>>> ccce282 (drawer and bottom navigation impl with pages routing)
  },
});
