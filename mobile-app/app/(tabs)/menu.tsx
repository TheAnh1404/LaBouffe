import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  ToastAndroid,
  Platform,
  Alert
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useFirestoreCollection } from "../../hooks/useFirestoreData";
import { useCart } from "../../context/CartContext";

export default function Menu() {
  const { data: categories, loading: catLoading } = useFirestoreCollection<any>("categories");
  const { data: foods, loading: foodLoading } = useFirestoreCollection<any>("foods");
  
  const [activeTab, setActiveTab] = useState<string>("All");
  const { addToCart } = useCart();

  const isLoading = catLoading || foodLoading;

  // Add "All" to categories list at runtime for the UI
  const tabs = [{ id: "all", name: "All", iconUrl: "" }, ...categories];
  
  // Filter foods
  const filteredFoods = activeTab === "All" 
    ? foods 
    : foods.filter(f => categories.find((c: any) => c.name === activeTab)?.id === f.categoryId);

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
          <ActivityIndicator size="large" color="#FF6332" style={{ marginTop: 50 }} />
        ) : (
          <>
            {/* Category Tabs */}
            <View style={styles.tabContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {tabs.map((item, i) => (
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
              {filteredFoods.map((item) => (
                <TouchableOpacity key={item.id} style={styles.card} activeOpacity={0.9}>
                  {/* Heart Icon */}
                  <TouchableOpacity style={styles.heartIcon}>
                    <Ionicons name="heart-outline" size={16} color="#FF6332" />
                  </TouchableOpacity>

                  <Image source={item.imageUrl ? { uri: item.imageUrl } : require("../../assets/images/f1.png")} style={styles.foodImage} resizeMode="cover" />

                  <View style={styles.infoContainer}>
                    <Text style={styles.foodName}>{item.name}</Text>
                    <Text style={styles.foodDesc} numberOfLines={1}>{item.desc}</Text>
                    
                    <View style={styles.ratingRow}>
                      <Ionicons name="star" size={14} color="#FF6332" />
                      <Text style={styles.ratingText}>{item.rating}</Text>
                    </View>

                    <View style={styles.priceRow}>
                      <Text style={styles.priceText}>AED {item.price}</Text>
                      <TouchableOpacity style={styles.addButton} onPress={() => handleAddToCart(item)}>
                        <Ionicons name="add" size={24} color="#FFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
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