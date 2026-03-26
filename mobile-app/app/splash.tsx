import { View, Text, Image } from 'react-native';
import { useEffect } from 'react';
import { router } from 'expo-router';

export default function Splash() {
  useEffect(() => {
    setTimeout(() => {
      router.replace('/onboarding');
    }, 5000); // 2 giây
  }, []);

  return (
    <View style={{
      flex: 1,
      backgroundColor: '#FF7622',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      
      {/* LOGO */}
      <Image
        source={require('../assets/images/Logo.png')} // ảnh logo của bạn
        style={{ width: 120, height: 120, marginBottom: 20 }}
        resizeMode="contain"
      />

      <Text style={{
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold'
      }}>
        La Bouffe
      </Text>

    </View>
  );
}