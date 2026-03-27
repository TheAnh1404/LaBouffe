import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { useEffect } from 'react';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function Splash() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/onboarding/onboarding');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/Logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>La Bouffe</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF7622',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.35, 
    height: width * 0.35,
    marginBottom: height * 0.02,
  },
  title: {
    color: '#fff',
    fontSize: width * 0.08,
    fontWeight: 'bold',
  },
});