import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const ReportScreen = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('http://192.168.0.60:3001/ahp/data/allday/AHPA5*');
      if (!response.ok) {
        throw new Error('Failed to fetch reports: ' + response.statusText);
      }
      const data = await response.json();
  
      // Format the date to remove the time part
      const formattedData = data.map(item => {
        return {
          ...item,
          consumption_date: item.consumption_date.substring(0, 10) // Extract date part only
        };
      });
  
      setReports(formattedData);
    } catch (error) {
      console.error(error.message);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Consumption Report</Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerText}>Date</Text>
          <Text style={styles.headerText}>Consumption(ltrs)</Text>
        </View>
        <FlatList
          data={reports}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <Text style={styles.date}>{item.consumption_date}</Text>
              <Text style={styles.consumption}>{item.daily_consumption}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f0f0f0',
  },
  headerText: {
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  date: {
    flex: 1,
  },
  consumption: {
    flex: 1,
    textAlign: 'right',
  },
});

export default ReportScreen;
