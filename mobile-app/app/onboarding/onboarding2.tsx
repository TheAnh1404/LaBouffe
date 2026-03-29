import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';

// Lấy kích thước màn hình để ảnh hiển thị cân đối
const { width } = Dimensions.get('window');

export default function Onboarding2() {
  return (
    <View style={styles.container}>
      
      {/* Top Card - Phần chứa ảnh với bo góc dưới */}
      <View style={styles.card}>
        <Image
          source={require('../../assets/images/onboard2.png')} 
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Content Area - Phần nội dung văn bản */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>
          Fast Delivery
        </Text>

        <Text style={styles.description}>
          Find a Restaurant place your order and get it deliver to your location
          within few minutes.
        </Text>
      </View>

      {/* Bottom Action - Nút Skip điều hướng sang trang 3 */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => router.push('/(auth)/welcome')}
        activeOpacity={0.7}
      >
        <View style={styles.dot} />
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  card: {
    backgroundColor: '#FFF0ED', // Màu hồng nhạt đồng bộ trang 1
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    height: '55%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  image: {
    width: width * 0.75, // Ảnh shipper/delivery thường cần to hơn một chút để rõ chi tiết
    height: width * 0.75,
  },
  contentContainer: {
    paddingHorizontal: 40,
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#333333',
    textAlign: 'center',
    lineHeight: 40,
  },
  description: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
    marginTop: 15,
    lineHeight: 24,
  },
  skipButton: {
    position: 'absolute',
    bottom: 50,
    right: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: '#E95322',
    borderRadius: 4,
    marginRight: 8,
  },
  skipText: {
    color: '#E95322',
    fontWeight: '700',
    fontSize: 18,
  },
});