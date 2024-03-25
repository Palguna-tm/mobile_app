import React from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Easing, ImageBackground, Image } from 'react-native';

const AboutUsScreen = () => {
  const fadeInAnim = new Animated.Value(0);

  const startAnimation = () => {
    Animated.timing(fadeInAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  React.useEffect(() => {
    startAnimation();
  }, []);

  return (
    <ImageBackground
      source={require('./images/c.jpg')} // Change the image source to your desired background image
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Animated.View style={[styles.content, { opacity: fadeInAnim }]}>
          <View style={styles.logoContainer}>
            <Image source={require('./images/logo.png')} style={styles.logo} />
          </View>
          <Text style={styles.header}>EXOZEN</Text>
          <Text style={styles.subHeader}>Create, Build, Develop IoT Solutions</Text>
          <Text style={styles.description}>
            Operating in Canada, UAE, UK, MENA, & India, EXOZEN is a leading Smart Society Service Provider & Product company, offering IoT solutions for Smart City, Water, Power, and Infrastructure Development.
          </Text>
          <Text style={styles.sectionHeader}>Our Mission</Text>
          <Text style={styles.sectionContent}>
            To deliver sustainable and innovative facilities management services that are scalable while ensuring safe and efficient performance of the built environment.
          </Text>
          <Text style={styles.sectionHeader}>Our Vision</Text>
          <Text style={styles.sectionContent}>
            To be a regional leader in providing integrated, quality facilities management solutions and deliver sustainable and innovative facilities management services.
          </Text>
          <Text style={styles.sectionHeader}>Our Values</Text>
          <Text style={styles.sectionContent}>
            We make a difference to our customers by using our management experience and applying expert knowledge through proven integrated management systems.
          </Text>
        </Animated.View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  content: {
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 18,
    marginBottom: 20,
    color: '#666',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    color: '#333',
    textAlign: 'justify',
    lineHeight: 24,
  },
  sectionHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  sectionContent: {
    fontSize: 16,
    marginBottom: 20,
    color: '#555',
    textAlign: 'justify',
    lineHeight: 24,
  },
});

export default AboutUsScreen;
