import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function Onboarding1() {
  return (
    <View style={styles.container}>
      
      {/* Top Card - Phần chứa ảnh */}
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

      {/* Bottom Action - Nút Skip */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => router.push('/onboarding/onboarding2')}
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
    backgroundColor: '#FFF0ED', // Màu hồng nhạt sát với ảnh
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    height: '55%', // Chiếm khoảng hơn nửa màn hình trên
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  image: {
    width: width * 0.7,
    height: width * 0.7,
  },
  contentContainer: {
    paddingHorizontal: 40,
    alignItems: 'center', // Căn giữa nội dung text
    marginTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800', // Đậm hơn một chút
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
    backgroundColor: '#E95322', // Màu cam đậm đặc trưng của các app đồ ăn
    borderRadius: 4,
    marginRight: 8,
  },
  skipText: {
    color: '#E95322',
    fontWeight: '700',
    fontSize: 18,
  },
});