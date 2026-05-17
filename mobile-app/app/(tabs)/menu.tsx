import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  ToastAndroid,
  Platform,
  Alert
} from "react-native";
import { useFirestoreCollection } from "../../hooks/useFirestoreData";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import { COLORS } from "../../constants/theme";
import FoodCard from "../../components/FoodCard";
import SearchBar from "../../components/SearchBar";
import { router } from "expo-router";

export default function Menu() {
  const { data: categories, loading: catLoading } = useFirestoreCollection<any>("categories");
  const { data: foods, loading: foodLoading } = useFirestoreCollection<any>("foods");
  
  const [activeTab, setActiveTab] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const isLoading = catLoading || foodLoading;

  // Add "All" to categories list at runtime for the UI
  const tabs = [{ id: "all", name: "All", iconUrl: "" }, ...categories];
  
  // Filter foods by category
  let filteredFoods = activeTab === "All" 
    ? foods 
    : foods.filter(f => categories.find((c: any) => c.name === activeTab)?.id === f.categoryId);

  // Filter foods by search query
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredFoods = filteredFoods.filter(
      (f: any) =>
        f.name?.toLowerCase().includes(q) ||
        f.desc?.toLowerCase().includes(q)
    );
  }

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      desc: item.desc,
      price: item.price,
      imageUrl: item.imageUrl
    });
    if (Platform.OS === 'android') {
      ToastAndroid.show(`${item.name} added to cart!`, ToastAndroid.SHORT);
    } else {
      Alert.alert("Success", `${item.name} added to cart!`);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Title */}
        <Text style={styles.menuTitle}>Menu</Text>

        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
        ) : (
          <>
            {/* Category Tabs */}
            <View style={styles.tabContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {tabs.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.tab, activeTab === item.name && styles.activeTab]}
                    onPress={() => setActiveTab(item.name)}
                  >
                    <Text style={[styles.tabText, activeTab === item.name && styles.activeTabText]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Search Bar */}
            <View style={styles.searchSection}>
              <SearchBar
                placeholder="Search for today's meal"
                value={searchQuery}
                onChangeText={setSearchQuery}
                showFilter={true}
              />
            </View>

            {/* Food List */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 100}}>
              {filteredFoods.length > 0 ? (
                filteredFoods.map((item: any) => (
                  <FoodCard
                    key={item.id}
                    food={item}
                    onPress={() => router.push({ pathname: '/food-detail', params: { foodId: item.id } } as any)}
                    onAddToCart={() => handleAddToCart(item)}
                    isFavorite={isFavorite(item.id)}
                    onFavorite={() => toggleFavorite(item.id)}
                  />
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    {searchQuery ? `No results for "${searchQuery}"` : "No food items found"}
                  </Text>
                </View>
              )}
            </ScrollView>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  menuTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginTop: 20,
    marginBottom: 20,
  },
  tabContainer: {
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginRight: 12,
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  activeTabText: {
    color: COLORS.white,
    fontWeight: "700",
  },
  searchSection: {
    marginBottom: 20,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
});