import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";

const restaurants = [
  {
    name: "Al Halbi Restaurant",
    desc: "Grills, Kebab, Sandwiches",
    rating: "4.5 (100+)",
    time: "20 mins",
    price: "AED 2.50",
    image: require("../../assets/images/res_alhalbi.png"),
  },
  {
    name: "Chikiki Restaurant",
    desc: "Burgers, Wraps, Sandwiches",
    rating: "4.5 (100+)",
    time: "15 mins",
    price: "AED 1.50",
    image: require("../../assets/images/res_chikiki.png"),
  },
  {
    name: "La Rosana Restaurant",
    desc: "Pasta, Desserts, Drinks",
    rating: "4.6 (100+)",
    time: "25 mins",
    price: "AED 3.50",
    image: require("../../assets/images/res_larosana.png"),
  },
  {
    name: "Al Shary Restaurant",
    desc: "Grills, Kebab, Egyptian",
    rating: "4.5 (100+)",
    time: "20 mins",
    price: "AED 2.50",
    image: require("../../assets/images/res_alshary.png"),
  },
  {
    name: "Sizzler Restaurant",
    desc: "Pizza, Burger, Sandwiches",
    rating: "4.7 (100+)",
    time: "20 mins",
    price: "AED 3.50",
    image: require("../../assets/images/res_sizzler.png"),
  },
];

export default function RestaurantList() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Back Button */}
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 100}}>
          {/* Filter Row */}
          <View style={styles.filterRow}>
            <TouchableOpacity style={styles.filterBox}>
              <Feather name="sliders" size={18} color="#888" />
              <Text style={styles.filterText}>Filters</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.filterBox}>
              <MaterialCommunityIcons name="silverware-fork-knife" size={18} color="#888" />
              <Text style={styles.filterText}>Cuisines</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.filterBox}>
              <Feather name="search" size={18} color="#888" />
              <Text style={styles.filterText}>Search</Text>
            </TouchableOpacity>
          </View>

          {/* Section Title */}
          <View style={styles.titleRow}>
            <Text style={styles.title}>All restaurants</Text>
            <MaterialCommunityIcons name="food-outline" size={24} color="#FF6332" />
          </View>

          {/* List of Restaurants */}
          {restaurants.map((item, index) => (
            <TouchableOpacity key={index} style={styles.card} activeOpacity={0.9}>
              <Image source={item.image} style={styles.resImage} />

              <View style={styles.infoContainer}>
                <Text style={styles.resName}>{item.name}</Text>
                <Text style={styles.resDesc}>{item.desc}</Text>

                <View style={styles.metaRow}>
                  <Ionicons name="star" size={14} color="#FF6332" />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                </View>

                <View style={styles.metaRow}>
                  <Feather name="clock" size={12} color="#AAA" />
                  <Text style={styles.metaText}>{item.time}</Text>
                  <View style={styles.dotSeparator} />
                  <MaterialCommunityIcons name="moped" size={16} color="#555" />
                  <Text style={styles.metaText}>{item.price}</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.heartIcon}>
                <Ionicons name="heart-outline" size={20} color="#FF6332" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
    marginBottom: 25,
  },
  filterBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    paddingVertical: 12,
    borderRadius: 10,
    // Shadow tinh tế cho Filter
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: "#F2F2F2",
  },
  filterText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#888",
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
    color: "#333",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  resImage: {
    width: 85,
    height: 85,
    borderRadius: 12,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 15,
  },
  resName: {
    fontSize: 17,
    fontWeight: "800",
    color: "#444",
  },
  resDesc: {
    fontSize: 12,
    color: "#999",
    marginVertical: 3,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#666",
    marginLeft: 4,
  },
  metaText: {
    fontSize: 12,
    color: "#777",
    marginLeft: 4,
  },
  dotSeparator: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#DDD",
    marginHorizontal: 8,
  },
  heartIcon: {
    position: "absolute",
    top: 15,
    right: 15,
  },
});