import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";

export type RestaurantData = {
  id: string;
  name: string;
  desc: string;
  rating: string;
  time: string;
  price?: string;
  km?: string;
  imageUrl?: string;
};

type RestaurantCardProps = {
  restaurant: RestaurantData;
  onPress?: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
};

export default function RestaurantCard({ restaurant, onPress, onFavorite, isFavorite }: RestaurantCardProps) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
      <Image
        source={restaurant.imageUrl ? { uri: restaurant.imageUrl } : require("../assets/images/res_alhalbi.png")}
        style={styles.resImage}
      />

      <View style={styles.infoContainer}>
        <Text style={styles.resName}>{restaurant.name}</Text>
        <Text style={styles.resDesc}>{restaurant.desc}</Text>

        <View style={styles.metaRow}>
          <Ionicons name="star" size={14} color={COLORS.primary} />
          <Text style={styles.ratingText}>{restaurant.rating}</Text>
        </View>

        <View style={styles.metaRow}>
          <Feather name="clock" size={12} color="#AAA" />
          <Text style={styles.metaText}>{restaurant.time}</Text>
          <View style={styles.dotSeparator} />
          <MaterialCommunityIcons name="moped" size={16} color="#555" />
          <Text style={styles.metaText}>{restaurant.price || "Free"}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.heartIcon} onPress={onFavorite}>
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={20}
          color={COLORS.primary}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
    alignItems: "center",
    elevation: 4,
    shadowColor: COLORS.shadow,
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
    color: COLORS.textPrimary,
  },
  resDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
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
