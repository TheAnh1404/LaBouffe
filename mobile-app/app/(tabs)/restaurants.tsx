import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator
} from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useFirestoreCollection } from "../../hooks/useFirestoreData";
import { COLORS } from "../../constants/theme";
import RestaurantCard from "../../components/RestaurantCard";
import SearchBar from "../../components/SearchBar";

export default function RestaurantList() {
  const { data: restaurants, loading } = useFirestoreCollection<any>("restaurants");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter restaurants by search
  const filteredRestaurants = searchQuery.trim()
    ? restaurants.filter(
        (r: any) =>
          r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.desc?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : restaurants;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Back Button */}
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 100}}>
            {/* Filter Row */}
            <View style={styles.filterRow}>
              <TouchableOpacity style={styles.filterBox}>
                <Feather name="sliders" size={18} color={COLORS.textSecondary} />
                <Text style={styles.filterText}>Filters</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.filterBox}>
                <MaterialCommunityIcons name="silverware-fork-knife" size={18} color={COLORS.textSecondary} />
                <Text style={styles.filterText}>Cuisines</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.filterBox}>
                <Feather name="search" size={18} color={COLORS.textSecondary} />
                <Text style={styles.filterText}>Search</Text>
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={{ marginBottom: 20 }}>
              <SearchBar
                placeholder="Search restaurants..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Section Title */}
            <View style={styles.titleRow}>
              <Text style={styles.title}>All restaurants</Text>
              <MaterialCommunityIcons name="food-outline" size={24} color={COLORS.primary} />
            </View>

            {/* List of Restaurants */}
            {filteredRestaurants.length > 0 ? (
              filteredRestaurants.map((item: any) => (
                <RestaurantCard key={item.id} restaurant={item} />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {searchQuery ? `No results for "${searchQuery}"` : "No restaurants found"}
                </Text>
              </View>
            )}
          </ScrollView>
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
  backButton: {
    marginTop: 10,
    marginBottom: 15,
  },
  filterRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  filterBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    borderRadius: 10,
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.textPrimary,
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