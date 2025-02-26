import { Image, StyleSheet, Platform, View } from 'react-native';
import HomePage from '../(tabs)/HomePage';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <HomePage/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
});
