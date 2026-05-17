import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFirestoreCollection, usePopularFoods } from "../../hooks/useFirestoreData";
import { router } from "expo-router";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";

import { COLORS, SHADOWS } from "../../constants/theme";
import SearchBar from "../../components/SearchBar";
import FoodCard from "../../components/FoodCard";
import RestaurantCard from "../../components/RestaurantCard";

const { width } = Dimensions.get("window");

export default function Home() {
  const { data: categories, loading: catLoading } = useFirestoreCollection<any>("categories");
  const { data: restaurants, loading: resLoading } = useFirestoreCollection<any>("restaurants");
  const { data: popularFoods, loading: popLoading } = usePopularFoods<any>();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

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
          
          <SearchBar placeholder="Search" />
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
                     <Ionicons name="fast-food-outline" size={28} color={COLORS.primary} />
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
                <View key={res.id} style={styles.resCardWrapper}>
                  <RestaurantCard restaurant={res} />
                </View>
              )) : (
                <Text style={styles.emptyText}>No restaurants featured here yet.</Text>
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

            <View style={styles.popularList}>
              {popularFoods.map((food) => (
                <FoodCard
                  key={food.id}
                  food={food}
                  onPress={() => router.push({ pathname: '/food-detail', params: { foodId: food.id } } as any)}
                  onAddToCart={() => addToCart({
                    id: food.id,
                    name: food.name,
                    desc: food.desc,
                    price: food.price,
                    imageUrl: food.imageUrl,
                  })}
                  isFavorite={isFavorite(food.id)}
                  onFavorite={() => toggleFavorite(food.id)}
                />
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
  locationLabel: { fontSize: 16, fontWeight: "500", color: COLORS.textSecondary, marginHorizontal: 5 },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.primary, marginLeft: 4 },

  // Categories
  sectionMargin: { marginTop: 20 },
  categoryItem: { alignItems: "center", marginRight: 20 },
  categoryIconBox: {
    width: 65, height: 65,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    justifyContent: "center", alignItems: "center",
    ...SHADOWS.card,
    marginBottom: 8,
  },
  categoryLabel: { fontSize: 13, color: COLORS.textSecondary, fontWeight: "500" },

  // Restaurants
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginTop: 25 },
  sectionTitle: { fontSize: 20, fontWeight: "800", color: COLORS.textPrimary },
  restaurantList: { marginTop: 15 },
  resCardWrapper: { 
    width: width * 0.75,
    marginRight: 15,
  },
  emptyText: { color: COLORS.textSecondary, paddingVertical: 20 },

  // Banner
  bannerContainer: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    marginTop: 25, 
    marginBottom: 15,
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4, 
    shadowColor: COLORS.primary, 
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  bannerContent: { 
    alignItems: "center",
  },
  bannerBadge: { 
    color: COLORS.white, 
    fontWeight: "900", 
    fontSize: 16, 
    letterSpacing: 1,
    textTransform: "uppercase", 
    marginBottom: 8,
  },
  bannerBadgeDot: {
    fontSize: 16,
    fontWeight: "400",
  },
  bannerDesc: { 
    color: COLORS.white, 
    fontSize: 13, 
    lineHeight: 22,
    textAlign: "center", 
    marginBottom: 18,
    fontWeight: "600",
    opacity: 0.95,
  },
  orderNowButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderNowText: { 
    color: COLORS.primary,
    fontWeight: "800", 
    fontSize: 15,
  },

  // Popular Section
  seeAllText: { color: COLORS.primary, fontWeight: "600" },
  popularList: { marginTop: 15 },
});