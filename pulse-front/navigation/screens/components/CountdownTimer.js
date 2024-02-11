import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';

const CountdownTimer = ({ duration }) => {
  const [timer, setTimer] = useState(duration);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (time) => {
    const seconds = time;
    return `${seconds.toString().padStart(1, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{formatTime(timer)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'white',
    width:'20%',
    borderRadius: '50%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop:15,
    float: 'center',
  },
  timerText: {
    fontSize: 40,
    color: 'red',
  },
});

export default CountdownTimer;
