import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

import { COLORS } from "../../constants/theme";

export default function Welcome() {
  return (
    <View style={styles.container}>
      {/* Top half: Orange background with Logo */}
      <View style={styles.topSection}>
        <Image
          source={require('../../assets/images/Logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>La bouffe</Text>
        <Text style={styles.subtitle}>The point is your satisfaction</Text>
      </View>

      {/* Bottom half: White card with rounded corners */}
      <View style={styles.bottomCard}>
        <TouchableOpacity 
          style={styles.createBtn}
          onPress={() => router.push('/(auth)/register')}
          activeOpacity={0.8}
        >
          <Text style={styles.createBtnText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.loginBtn}
          onPress={() => router.push('/(auth)/login')}
          activeOpacity={0.8}
        >
          <Text style={styles.loginBtnText}>Log In</Text>
        </TouchableOpacity>

        {/* Social Connect */}
        <View style={styles.connectSection}>
          <Text style={styles.connectText}>Connect with</Text>
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn}>
              <Ionicons name="logo-facebook" size={28} color="#1877F2" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}>
              <Ionicons name="logo-apple" size={28} color="#000000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}>
              <Ionicons name="logo-google" size={28} color="#DB4437" />
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
    backgroundColor: COLORS.primary,
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#FFF',
    marginTop: 5,
    fontWeight: '500',
  },
  bottomCard: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingHorizontal: 25,
    paddingTop: 40,
    paddingBottom: 50,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    alignItems: 'center',
  },
  createBtn: {
    backgroundColor: COLORS.primary,
    width: '100%',
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  createBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  loginBtn: {
    backgroundColor: COLORS.success, // Xanh lá theo design
    width: '100%',
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 35,
  },
  loginBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  connectSection: {
    alignItems: 'center',
    width: '100%',
  },
  connectText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
  },
  socialBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F7F7F7', // Khung nền xám nhạt cho icon
    justifyContent: 'center',
    alignItems: 'center',
  }
});
