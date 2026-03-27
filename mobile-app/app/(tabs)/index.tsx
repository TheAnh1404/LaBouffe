import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome, AntDesign } from '@expo/vector-icons'; // Sử dụng thư viện icon có sẵn của Expo

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      {/* Upper Section: Orange background with Logo */}
      <View style={styles.topSection}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/Logo.png')} // Thay bằng logo cái dĩa/thìa của bạn
            style={styles.logoIcon}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.brandName}>La bouffe</Text>
        <Text style={styles.slogan}>Our goal is your Satisfaction</Text>
      </View>

      {/* Lower Section: White card with Buttons */}
      <View style={styles.bottomSection}>
        <TouchableOpacity 
          style={[styles.button, styles.createAccountBtn]}
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={styles.createAccountText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.loginBtn]}
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={styles.loginText}>Log in</Text>
        </TouchableOpacity>

        {/* Social Connect Section */}
        <View style={styles.socialContainer}>
          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.connectText}>Connect with</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.socialIcons}>
            <TouchableOpacity style={styles.iconCircle}>
              <FontAwesome name="facebook" size={24} color="#1877F2" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconCircle}>
              <FontAwesome name="apple" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconCircle}>
              <AntDesign name="google" size={24} color="#DB4437" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF6332', // Màu cam chủ đạo của phần trên
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  logoContainer: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Hiệu ứng vòng tròn mờ nhẹ quanh logo
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoIcon: {
    width: 80,
    height: 80,
  },
  brandName: {
    fontSize: 40,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  slogan: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: -5,
  },
  bottomSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 80, // Bo góc lớn ở phía trên bên trái
    borderTopRightRadius: 80, // Bo góc lớn ở phía trên bên phải (nếu muốn cân đối)
    paddingHorizontal: 40,
    paddingTop: 60,
    alignItems: 'center',
  },
  button: {
    width: '100%',
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  createAccountBtn: {
    backgroundColor: '#FF6332',
  },
  createAccountText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginBtn: {
    backgroundColor: '#2E8B1F', // Màu xanh lá giống trong ảnh
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  socialContainer: {
    marginTop: 40,
    width: '100%',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#EEEEEE',
  },
  connectText: {
    marginHorizontal: 10,
    color: '#888',
    fontSize: 14,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30, // Khoảng cách giữa các icon
  },
  iconCircle: {
    padding: 10,
  },
});