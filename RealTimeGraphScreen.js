import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const RealTimeGraph = () => {
  const [data, setData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{ data: [45, 55, 50, 60, 55, 65, 70] }],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Real Time Data</Text>
      <Text style={styles.subText}>Welcome to Real Time Graphs...!</Text>
      
      <View style={styles.graphContainer}>
        <Text style={styles.graphHeading}>Daily</Text>
        <LineChart
          data={data}
          width={350}
          height={220}
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: '#000',
            backgroundGradientFrom: '#333',
            backgroundGradientTo: '#555',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  graphContainer: {
    alignItems: 'center',
    width: 350,
  },
  graphHeading: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
  },
});

export default RealTimeGraph;
