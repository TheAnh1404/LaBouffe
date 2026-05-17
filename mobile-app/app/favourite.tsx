import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { COLORS } from "../constants/theme";
import { useFavorites } from "../context/FavoritesContext";
import { useCart } from "../context/CartContext";
import FoodCard from "../components/FoodCard";

interface FoodItem {
  id: string;
  name: string;
  desc: string;
  price: number;
  rating: string;
  imageUrl: string;
  categoryId: string;
}

export default function Favourite() {
  const { favorites, isFavorite, toggleFavorite, loading: favLoading } = useFavorites();
  const { addToCart } = useCart();
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch food details for each favorite ID
  useEffect(() => {
    const fetchFavoriteFoods = async () => {
      if (favLoading) return;
      if (favorites.length === 0) {
        setFoods([]);
        setLoading(false);
        return;
      }

      try {
        const foodPromises = favorites.map(async (foodId) => {
          const foodDoc = await getDoc(doc(db, "foods", foodId));
          if (foodDoc.exists()) {
            return { id: foodDoc.id, ...foodDoc.data() } as FoodItem;
          }
          return null;
        });

        const results = await Promise.all(foodPromises);
        setFoods(results.filter(Boolean) as FoodItem[]);
      } catch (error) {
        console.error("Error fetching favorite foods:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteFoods();
  }, [favorites, favLoading]);

  const isLoading = loading || favLoading;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favourites</Text>
        <View style={{ width: 28 }} />
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
      ) : foods.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="heart-outline" size={60} color={COLORS.primary} />
          </View>
          <Text style={styles.emptyTitle}>No Favourites Yet</Text>
          <Text style={styles.emptyDesc}>
            Tap the heart icon on any food item{"\n"}to add it to your favourites
          </Text>
          <TouchableOpacity
            style={styles.browseBtn}
            onPress={() => router.push("/(tabs)/menu")}
          >
            <Ionicons name="restaurant" size={20} color={COLORS.white} />
            <Text style={styles.browseBtnText}>Browse Menu</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30 }}
        >
          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statChip}>
              <Ionicons name="heart" size={16} color={COLORS.primary} />
              <Text style={styles.statText}>{foods.length} items saved</Text>
            </View>
          </View>

          {/* Food Cards */}
          {foods.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
              onPress={() =>
                router.push({ pathname: "/food-detail", params: { foodId: food.id } } as any)
              }
              onAddToCart={() =>
                addToCart({
                  id: food.id,
                  name: food.name,
                  desc: food.desc,
                  price: food.price,
                  imageUrl: food.imageUrl,
                })
              }
              isFavorite={isFavorite(food.id)}
              onFavorite={() => toggleFavorite(food.id)}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15,
  },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: "800", color: COLORS.textPrimary },

  // Stats
  statsRow: { flexDirection: "row", marginBottom: 15, marginTop: 5 },
  statChip: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: COLORS.primaryLight, paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 10,
  },
  statText: { fontSize: 13, fontWeight: "600", color: COLORS.primary, marginLeft: 6 },

  // Empty State
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 40 },
  emptyIconContainer: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: COLORS.primaryLight, justifyContent: "center", alignItems: "center",
    marginBottom: 25,
  },
  emptyTitle: { fontSize: 22, fontWeight: "800", color: COLORS.textPrimary, marginBottom: 10 },
  emptyDesc: { fontSize: 14, color: COLORS.textSecondary, textAlign: "center", lineHeight: 22 },
  browseBtn: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: COLORS.primary, paddingHorizontal: 28, paddingVertical: 14,
    borderRadius: 14, marginTop: 30,
    elevation: 4, shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8,
  },
  browseBtnText: { color: COLORS.white, fontWeight: "700", fontSize: 16, marginLeft: 8 },
});
