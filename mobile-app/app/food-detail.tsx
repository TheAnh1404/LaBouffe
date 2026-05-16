import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  ToastAndroid,
  Platform,
  Alert,
} from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useCart } from "../context/CartContext";
import { COLORS } from "../constants/theme";

const { width } = Dimensions.get("window");

export default function FoodDetail() {
  const { foodId } = useLocalSearchParams<{ foodId: string }>();
  const [food, setFood] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFood = async () => {
      if (!foodId) return;
      try {
        const docRef = doc(db, "foods", foodId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFood({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching food detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFood();
  }, [foodId]);

  const handleAddToCart = () => {
    if (!food) return;
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: food.id,
        name: food.name,
        desc: food.desc,
        price: food.price,
        imageUrl: food.imageUrl,
      });
    }
    if (Platform.OS === "android") {
      ToastAndroid.show(`${food.name} x${quantity} added to cart!`, ToastAndroid.SHORT);
    } else {
      Alert.alert("Success", `${food.name} x${quantity} added to cart!`);
    }
    router.back();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 100 }} />
      </SafeAreaView>
    );
  }

  if (!food) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Food not found</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Back button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detail</Text>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="heart-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Food Image */}
        <View style={styles.imageContainer}>
          <Image
            source={food.imageUrl ? { uri: food.imageUrl } : require("../assets/images/f1.png")}
            style={styles.foodImage}
            resizeMode="contain"
          />
        </View>

        {/* Food Info */}
        <View style={styles.infoSection}>
          <View style={styles.nameRow}>
            <Text style={styles.foodName}>{food.name}</Text>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={16} color={COLORS.secondary} />
              <Text style={styles.ratingText}>{food.rating}</Text>
            </View>
          </View>

          <Text style={styles.foodDesc}>{food.desc}</Text>

          <View style={styles.divider} />

          {/* Price + Quantity Row */}
          <View style={styles.priceQuantityRow}>
            <View>
              <Text style={styles.priceLabel}>Price</Text>
              <Text style={styles.priceValue}>AED {food.price}</Text>
            </View>

            <View style={styles.quantitySelector}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <AntDesign name="minus" size={18} color={COLORS.white} />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQuantity(quantity + 1)}
              >
                <AntDesign name="plus" size={18} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Total */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>AED {(food.price * quantity).toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Add to Cart Button (Fixed Bottom) */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCart}>
          <Ionicons name="cart" size={22} color={COLORS.white} />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  // Image
  imageContainer: {
    width: width,
    height: width * 0.7,
    backgroundColor: COLORS.primaryLight,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },
  foodImage: {
    width: "70%",
    height: "85%",
  },
  // Info
  infoSection: {
    paddingHorizontal: 25,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  foodName: {
    fontSize: 26,
    fontWeight: "900",
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: 10,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginLeft: 4,
  },
  foodDesc: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 24,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 25,
  },
  // Price + Quantity
  priceQuantityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  priceLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "500",
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.primary,
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
  },
  qtyBtn: {
    backgroundColor: COLORS.primary,
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyText: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginHorizontal: 20,
  },
  // Total
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    padding: 18,
    borderRadius: 15,
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.textPrimary,
  },
  // Bottom bar
  bottomBar: {
    paddingHorizontal: 25,
    paddingVertical: 15,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  addToCartBtn: {
    backgroundColor: COLORS.primary,
    height: 60,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  addToCartText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "800",
    marginLeft: 10,
  },
  // Error state
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  backBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
