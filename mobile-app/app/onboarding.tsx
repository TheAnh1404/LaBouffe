import { View, Text, FlatList, Dimensions, Image, TouchableOpacity } from 'react-native';
import { useRef, useState } from 'react';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Don’t Starve, Just Order',
    desc: 'Order your favorite food anytime',
    image: require('../assets/images/onboard1.png'), // thay ảnh của bạn
  },
  {
    id: '2',
    title: 'Fast Delivery',
    desc: 'Get your food in minutes',
    image: require('../assets/images/onboard2.png'),
  },
  {
    id: '3',
    title: 'Best Food App',
    desc: 'Enjoy delicious meals',
    image: require('../assets/images/onboard3.png'),
  },
];

export default function Onboarding() {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>

      {/* SLIDER */}
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={{
            width,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
          }}>
            <Image
              source={item.image}
              style={{ width: 250, height: 250, marginBottom: 30 }}
              resizeMode="contain"
            />

            <Text style={{
              fontSize: 22,
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: 10
            }}>
              {item.title}
            </Text>

            <Text style={{
              fontSize: 14,
              color: '#666',
              textAlign: 'center'
            }}>
              {item.desc}
            </Text>
          </View>
        )}
      />

      {/* DOTS */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20
      }}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={{
              width: currentIndex === index ? 20 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: currentIndex === index ? '#FF7622' : '#ccc',
              margin: 5
            }}
          />
        ))}
      </View>

      {/* BUTTON */}
      <TouchableOpacity
        onPress={handleNext}
        style={{
          backgroundColor: '#FF7622',
          marginHorizontal: 20,
          padding: 15,
          borderRadius: 10,
          alignItems: 'center',
          marginBottom: 40
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>
          {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
        </Text>
      </TouchableOpacity>

    </View>
  );
}