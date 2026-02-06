import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AppTest = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>App Test - Si ves esto, React Native funciona!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});

export default AppTest;
