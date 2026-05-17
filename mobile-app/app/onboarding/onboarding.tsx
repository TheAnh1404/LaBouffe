import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

const { width } = Dimensions.get('window');

export default function Onboarding1() {
  return (
    <View style={styles.container}>

      {/* Skip Button — Top Right */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => router.replace('/(auth)/welcome')}
        activeOpacity={0.7}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Top Card — Image */}
      <View style={styles.card}>
        <Image
          source={require('../../assets/images/onboard1.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Content Area */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>
          Don't Starve,{'\n'}Just Order
        </Text>

        <Text style={styles.description}>
          Just order for your favorite food anytime, anywhere and receive your
          meal within a few minutes
        </Text>
      </View>

      {/* Page Indicator Dots */}
      <View style={styles.dotsContainer}>
        <View style={[styles.dot, styles.activeDot]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>

      {/* Next Button */}
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => router.push('/onboarding/onboarding2')}
        activeOpacity={0.7}
      >
        <Text style={styles.nextText}>Next</Text>
        <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // Skip — Top Right
  skipButton: {
    position: 'absolute',
    top: 55,
    right: 25,
    zIndex: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  skipText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
    fontSize: 16,
  },
  // Card
  card: {
    backgroundColor: COLORS.primaryLight,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    height: '55%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  image: {
    width: width * 0.7,
    height: width * 0.7,
  },
  // Content
  contentContainer: {
    paddingHorizontal: 40,
    alignItems: 'center',
    marginTop: 35,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: 40,
  },
  description: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 15,
    lineHeight: 24,
  },
  // Page Dots
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 5,
  },
  activeDot: {
    width: 24,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  // Next Button
  nextButton: {
    position: 'absolute',
    bottom: 50,
    right: 30,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  nextText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 16,
    marginRight: 8,
  },
});