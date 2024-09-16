import { SafeAreaView, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import React from 'react';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const HomePage = () => {

    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

  return (
    <SafeAreaView style={backgroundStyle}>
        <ScrollView contentInsetAdjustmentBehavior="automatic" style={backgroundStyle}>
            <View style={styles.sectionContainer}>
                <Text>HomePage</Text>
            </View>
        </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
      },
});

export default HomePage;

