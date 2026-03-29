import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFirestoreCollection, usePopularFoods } from "../../hooks/useFirestoreData";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

// --- MÀU SẮC CHỦ ĐẠO ---
const COLORS = {
  primary: "#FF6332",
  secondary: "#FFB01D",
  background: "#FFFFFF",
  grayText: "#888888",
  blackText: "#333333",
  cardBg: "#FFFFFF",
};

export default function Home() {
  const { data: categories, loading: catLoading } = useFirestoreCollection<any>("categories");
  const { data: restaurants, loading: resLoading } = useFirestoreCollection<any>("restaurants");
  const { data: popularFoods, loading: popLoading } = usePopularFoods<any>();

  // Filter only home specific restaurants or just show a few
  const homeRestaurants = restaurants.filter(r => r.id.includes("res_home") || r.km).slice(0, 3);

  const isLoading = catLoading || resLoading || popLoading;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* 1. Header & Location */}
        <View style={styles.header}>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={20} color={COLORS.primary} />
            <Text style={styles.locationLabel}>Your Location</Text>
            <Ionicons name="chevron-down" size={16} color={COLORS.primary} />
            <View style={styles.activeDot} />
          </View>
          
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#BBB" />
            <TextInput 
              placeholder="Search" 
              style={styles.searchInput} 
              placeholderTextColor="#BBB"
            />
          </View>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
        ) : (
          <>
            {/* 2. Categories */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sectionMargin}>
              {categories.map((item, i) => (
                <TouchableOpacity key={item.id} style={styles.categoryItem}>
                  <View style={styles.categoryIconBox}>
                     <Image source={item.iconUrl ? { uri: item.iconUrl } : require("../../assets/images/dishes.png")} style={styles.categoryIconImg} />
                  </View>
                  <Text style={styles.categoryLabel}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* 3. Restaurants Section */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Restaurants</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.restaurantList}>
              {homeRestaurants.length > 0 ? homeRestaurants.map((res) => (
                <TouchableOpacity key={res.id} style={styles.resCard}>
                  <Image source={res.imageUrl ? { uri: res.imageUrl } : require("../../assets/images/banner_bg.png")} style={styles.resImage} />
                  <TouchableOpacity style={styles.heartIcon}>
                     <Ionicons name="heart-outline" size={18} color={COLORS.primary} />
                  </TouchableOpacity>
                  <View style={styles.resInfoRow}>
                    <Text style={styles.resInfoText}>Location: <Text style={{color: COLORS.primary}}>{res.km}</Text></Text>
                    <Text style={styles.resInfoText}><Ionicons name="time-outline" size={12}/> {res.time}</Text>
                    <Text style={styles.resInfoText}><Ionicons name="star" size={12} color={COLORS.secondary}/> {res.rating}</Text>
                  </View>
                </TouchableOpacity>
              )) : (
                <Text style={{color: "#999", paddingVertical: 20}}>No restaurants featured here yet.</Text>
              )}
            </ScrollView>

            {/* 4. Promo Banner */}
            <View style={styles.bannerContainer}>
              <View style={styles.bannerContent}>
                <Text style={styles.bannerBadge}>New <Text style={styles.bannerBadgeDot}>•</Text> Limited time</Text>
                <Text style={styles.bannerDesc}>
                  California-style pizza Sicilian pizza{"\n"}
                  with Burger & French fries & 1 free Coca cola drink.
                </Text>
                <TouchableOpacity style={styles.orderNowButton}>
                  <Text style={styles.orderNowText}>Order Now</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 5. Popular Section */}
            <View style={[styles.sectionHeader, styles.sectionMargin]}>
              <Text style={styles.sectionTitle}>Popular</Text>
              <TouchableOpacity onPress={() => router.push('/menu')}><Text style={styles.seeAllText}>See all</Text></TouchableOpacity>
            </View>

            <View style={styles.popularGrid}>
              {popularFoods.map((food) => (
                <View key={food.id} style={styles.foodCard}>
                  <Image source={food.imageUrl ? { uri: food.imageUrl } : require("../../assets/images/f1.png")} style={styles.foodImg} />
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={12} color={COLORS.secondary} />
                    <Text style={styles.ratingText}>{food.rating}</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
        
        <View style={{height: 100}} /> 
      </ScrollView>
    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, paddingHorizontal: 20 },
  
  // Header
  header: { marginTop: 10 },
  locationRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  locationLabel: { fontSize: 16, fontWeight: "500", color: "#666", marginHorizontal: 5 },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.primary, marginLeft: 4 },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#FBFBFB",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },

  // Categories
  sectionMargin: { marginTop: 20 },
  categoryItem: { alignItems: "center", marginRight: 20 },
  categoryIconBox: {
    width: 65, height: 65,
    backgroundColor: "#FFF",
    borderRadius: 15,
    justifyContent: "center", alignItems: "center",
    elevation: 4, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10,
    marginBottom: 8,
  },
  categoryIconImg: { width: 40, height: 40, resizeMode: "contain" },
  categoryLabel: { fontSize: 13, color: "#666", fontWeight: "500" },

  // Restaurants
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginTop: 25 },
  sectionTitle: { fontSize: 20, fontWeight: "800", color: COLORS.blackText },
  restaurantList: { marginTop: 15 },
  resCard: { 
    width: width * 0.7, marginRight: 15, 
    backgroundColor: "#FFF", borderRadius: 20,
    elevation: 5, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10,
    overflow: "hidden", marginBottom: 10
  },
  resImage: { width: "100%", height: 140 },
  heartIcon: { position: "absolute", top: 10, right: 10, backgroundColor: "#FFF", padding: 6, borderRadius: 10 },
  resInfoRow: { flexDirection: "row", justifyContent: "space-between", padding: 12 },
  resInfoText: { fontSize: 11, color: "#888", fontWeight: "600" },

  // Banner
  bannerContainer: {
    backgroundColor: '#FF7D2C', // Màu nền cam tươi
    borderRadius: 20, // Bo góc cho mềm mại
    marginTop: 25, 
    marginBottom: 15,
    paddingVertical: 25, // Tăng khoảng trống bên trong
    paddingHorizontal: 20,
    alignItems: "center", // Trọng tâm căn giữa
    justifyContent: "center",
    // Đổ bóng cho Box thêm phần nổi bật
    elevation: 4, 
    shadowColor: "#FF7D2C", 
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  bannerContent: { 
    alignItems: "center",
  },
  bannerBadge: { 
    color: "#FFF", 
    fontWeight: "900", 
    fontSize: 16, 
    letterSpacing: 1, // Kéo giãn text một xíu tạo cảm giác sang trọng
    textTransform: "uppercase", 
    marginBottom: 8,
  },
  bannerBadgeDot: {
    fontSize: 16,
    fontWeight: "400",
  },
  bannerDesc: { 
    color: "#FFF", 
    fontSize: 13, 
    lineHeight: 22, // Tăng thêm khoảng cách dòng cho text dễ đọc
    textAlign: "center", 
    marginBottom: 18,
    fontWeight: "600",
    opacity: 0.95,
  },
  orderNowButton: {
    backgroundColor: "#FFF", // Nút bấm màu trắng tương phản
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30, // Chuyển thành dạng nút con nhộng (Pill button)
    // Đổ bóng xíu cho cả nút nhấn
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderNowText: { 
    color: "#FF7D2C", // Chữ bật màu cam giữa nền trắng
    fontWeight: "800", 
    fontSize: 15,
  },

  // Popular Grid
  seeAllText: { color: COLORS.primary, fontWeight: "600" },
  popularGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 15 },
  foodCard: {
    width: "31%", 
    aspectRatio: 1,
    backgroundColor: "#F9F9F9",
    borderRadius: 15,
    marginBottom: 15,
    justifyContent: "center", alignItems: "center",
    elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5
  },
  foodImg: { width: "80%", height: "80%", resizeMode: "contain" },
  ratingBadge: { 
    position: "absolute", bottom: 8, left: 8, 
    flexDirection: "row", alignItems: "center", 
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 5, borderRadius: 5
  },
  ratingText: { fontSize: 10, fontWeight: "bold", marginLeft: 2, color: "#444" },
});