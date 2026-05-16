import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";

export type FoodItemData = {
  id: string;
  name: string;
  desc: string;
  price: number;
  rating: string;
  imageUrl?: string;
  categoryId?: string;
  isPopular?: boolean;
};

type FoodCardProps = {
  food: FoodItemData;
  onPress?: () => void;
  onAddToCart?: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
};

export default function FoodCard({ food, onPress, onAddToCart, onFavorite, isFavorite }: FoodCardProps) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
      {/* Heart Icon */}
      <TouchableOpacity style={styles.heartIcon} onPress={onFavorite}>
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={16}
          color={COLORS.primary}
        />
      </TouchableOpacity>

      <Image
        source={food.imageUrl ? { uri: food.imageUrl } : require("../assets/images/f1.png")}
        style={styles.foodImage}
        resizeMode="cover"
      />

      <View style={styles.infoContainer}>
        <Text style={styles.foodName}>{food.name}</Text>
        <Text style={styles.foodDesc} numberOfLines={1}>{food.desc}</Text>

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={14} color={COLORS.primary} />
          <Text style={styles.ratingText}>{food.rating}</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceText}>AED {food.price}</Text>
          {onAddToCart && (
            <TouchableOpacity style={styles.addButton} onPress={onAddToCart}>
              <Ionicons name="add" size={24} color="#FFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 12,
    marginBottom: 18,
    alignItems: "center",
    elevation: 5,
    shadowColor: COLORS.shadow,
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
    color: COLORS.textPrimary,
  },
  foodDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
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
    color: COLORS.primary,
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
    color: COLORS.textPrimary,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 38,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
