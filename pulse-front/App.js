import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useState, useEffect } from 'react';

import client from './api/client';

export default function App() {
  const [data, setData] = useState("none");

  //this can be removed, just to show how client works
  useEffect(() => {
    client.get("test").then((response) => {
      setData(response.data);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Text>Test backend call: {data}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera:{
    width: Dimensions.get('window').width / 1.5,
    height: Dimensions.get('window').height / 1.5,
    borderRadius: 20,
  },
  buttonContainer: {
    backgroundColor: "#fff",
    alignSelf: "flex-end",

  }
});
