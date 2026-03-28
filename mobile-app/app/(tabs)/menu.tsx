import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";

const foods = [
  {
    name: "White Rice",
    desc: "Basmati rice with Vegetable",
    price: "AED 45",
    rating: "4.5",
    image: require("../../assets/images/rice1.png"), // Nên dùng ảnh local để có shadow đẹp như hình
  },
  {
    name: "Biryani",
    desc: "Chicken Biryani India",
    price: "AED 45",
    rating: "3.5",
    image: require("../../assets/images/biryani.png"),
  },
  {
    name: "White Rice",
    desc: "Vegetable Salad, Thai Cuisine",
    price: "AED 35.9",
    rating: "4.5",
    image: require("../../assets/images/salad.png"),
  },
  {
    name: "Jollof Rice",
    desc: "Nigerian Jollof Rice",
    price: "AED 45.9",
    rating: "4.5",
    image: require("../../assets/images/jollof.png"),
  },
  {
    name: "Rice And Plantain",
    desc: "Fried Rice With Plantain",
    price: "AED 65.9",
    rating: "5.5",
    image: require("../../assets/images/plantain.png"),
  },
];

export default function Menu() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Title */}
        <Text style={styles.menuTitle}>Menu</Text>

        {/* Category Tabs */}
        <View style={styles.tabContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {["Dishes", "Pizza", "Burger", "Drinks", "Dessert"].map((item, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.tab, i === 0 && styles.activeTab]}
              >
                <Text style={[styles.tabText, i === 0 && styles.activeTabText]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBox}>
            <Feather name="search" size={20} color="#CBCBCB" />
            <TextInput
              placeholder="Search for today's meal"
              placeholderTextColor="#CBCBCB"
              style={styles.searchInput}
            />
            <TouchableOpacity>
               <Ionicons name="options-outline" size={20} color="#CBCBCB" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Food List */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 100}}>
          {foods.map((item, index) => (
            <TouchableOpacity key={index} style={styles.card} activeOpacity={0.9}>
              {/* Heart Icon */}
              <TouchableOpacity style={styles.heartIcon}>
                <Ionicons name="heart-outline" size={16} color="#FF6332" />
              </TouchableOpacity>

              <Image source={item.image} style={styles.foodImage} resizeMode="contain" />

              <View style={styles.infoContainer}>
                <Text style={styles.foodName}>{item.name}</Text>
                <Text style={styles.foodDesc} numberOfLines={1}>{item.desc}</Text>
                
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={14} color="#FF6332" />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                </View>

                <View style={styles.priceRow}>
                  <Text style={styles.priceText}>{item.price}</Text>
                  <TouchableOpacity style={styles.addButton}>
                    <Ionicons name="add" size={24} color="#FFF" />
                  </TouchableOpacity>
                </View>
              </View>
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
  menuTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#333",
    marginTop: 20,
    marginBottom: 20,
  },
  tabContainer: {
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginRight: 12,
    // Shadow cho tab
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  activeTab: {
    backgroundColor: "#FF6332",
  },
  tabText: {
    fontSize: 15,
    color: "#777",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#FFF",
    fontWeight: "700",
  },
  searchSection: {
    marginBottom: 20,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 55,
    borderWidth: 1,
    borderColor: "#F2F2F2",
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#333",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 12,
    marginBottom: 18,
    alignItems: "center",
    // Shadow chuyên nghiệp
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  heartIcon: {
    position: "absolute",
    top: 12,
    left: 12,
    zIndex: 1,
  },
  foodImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 15,
  },
  foodName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#333",
  },
  foodDesc: {
    fontSize: 13,
    color: "#999",
    marginVertical: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FF6332",
    marginLeft: 4,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#333",
  },
  addButton: {
    backgroundColor: "#FF6332",
    width: 38,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});