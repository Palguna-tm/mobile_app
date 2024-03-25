import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const ProfileScreen = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await fetch('http://192.168.0.60:3001/ahp/profile?email=AHPA05@gmail.com');
      const data = await response.json();
      console.log('Profile data:', data); // Log the response data
      setProfileData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Screen</Text>
      {loading ? (
        <Text>Loading profile...</Text>
      ) : profileData ? (
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: profileData.user_image }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.info}>{profileData.user_name}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.info}>{profileData.user_email}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.label}>Family Members:</Text>
            <Text style={styles.info}>{profileData.user_family_members}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.label}>Average Consumption:</Text>
            <Text style={styles.info}>{profileData.project_avg_consumption} kWh</Text>
          </View>
        
        </View>
      ) : (
        <Text>No profile data available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileContainer: {
    alignItems: 'center',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  info: {
    fontSize: 18,
  },
});

export default ProfileScreen;
