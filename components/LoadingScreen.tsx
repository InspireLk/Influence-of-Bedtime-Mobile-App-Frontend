import React from 'react'
import { ActivityIndicator, View, StyleSheet } from 'react-native';

function LoadingScreen() {
  return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size='large'/>
      </View>
  )
}

export default LoadingScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});