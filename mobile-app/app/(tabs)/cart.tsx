import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { Ionicons, AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";

const COLORS = {
  primary: "#FF6332",
  textMain: "#333333",
  textSecondary: "#888888",
  bg: "#FFFFFF",
};

export default function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Pizza Pepperoni",
      desc: "Round Sliced Pepperoni Pizza",
      price: 36.9,
      quantity: 2,
      rating: 4.5,
      image: require("../../assets/images/cart1.png"),
    },
    {
      id: 2,
      name: "Coca Cola",
      desc: "Can Coke",
      price: 3.9,
      quantity: 2,
      rating: 5.0,
      image: require("../../assets/images/cart2.png"),
    },
  ]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Cart <MaterialCommunityIcons name="cart-outline" size={28} color={COLORS.textMain} /></Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
          {/* Cart Items List */}
          {cartItems.map((item) => (
            <View key={item.id} style={styles.cartCard}>
              <TouchableOpacity style={styles.heartIcon}>
                <Ionicons name="heart-outline" size={16} color={COLORS.primary} />
              </TouchableOpacity>
              
              <Image source={item.image} style={styles.itemImage} resizeMode="contain" />

              <View style={styles.infoContainer}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDesc}>{item.desc}</Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={12} color={COLORS.primary} />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                </View>

                <View style={styles.priceRow}>
                  <Text style={styles.itemPrice}>AED {item.price}</Text>
                  
                  {/* Quantity Selector */}
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity style={styles.qtyBtn}>
                      <AntDesign name="minus" size={16} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <TouchableOpacity style={styles.qtyBtn}>
                      <AntDesign name="plus" size={16} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}

          {/* Payment Summary */}
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Payment summary</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>AED 81.60</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, {color: COLORS.primary}]}>Discount</Text>
              <Text style={[styles.summaryValue, {color: COLORS.primary}]}>- AED 5.00</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery fee</Text>
              <Text style={styles.summaryValue}>AED 2.00</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Service fee</Text>
              <Text style={styles.summaryValue}>AED 1.50</Text>
            </View>

            <View style={[styles.summaryRow, {marginTop: 10}]}>
              <Text style={styles.totalLabel}>Total amount</Text>
              <Text style={styles.totalValue}>AED 80.10</Text>
            </View>
          </View>

          {/* Bottom Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.addItemsBtn}>
              <Text style={styles.addItemsText}>Add items</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.checkoutBtn}>
              <Text style={styles.checkoutText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  container: { flex: 1, paddingHorizontal: 20 },
  header: { marginTop: 20, marginBottom: 30 },
  headerTitle: { fontSize: 32, fontWeight: "800", color: COLORS.textMain },
  
  // Cart Card
  cartCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  heartIcon: { position: "absolute", top: 12, left: 12 },
  itemImage: { width: 80, height: 80 },
  infoContainer: { flex: 1, marginLeft: 15 },
  itemName: { fontSize: 16, fontWeight: "700", color: COLORS.textMain },
  itemDesc: { fontSize: 12, color: COLORS.textSecondary, marginVertical: 2 },
  ratingRow: { flexDirection: "row", alignItems: "center" },
  ratingText: { fontSize: 11, fontWeight: "700", color: COLORS.primary, marginLeft: 4 },
  priceRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  itemPrice: { fontSize: 16, fontWeight: "800", color: COLORS.textMain },
  
  // Quantity Buttons
  quantityContainer: { flexDirection: "row", alignItems: "center" },
  qtyBtn: { 
    backgroundColor: COLORS.primary, 
    width: 28, height: 20, 
    borderRadius: 4, 
    justifyContent: "center", alignItems: "center" 
  },
  qtyText: { marginHorizontal: 12, fontSize: 16, fontWeight: "700" },

  // Summary
  summaryContainer: { marginTop: 30 },
  summaryTitle: { fontSize: 22, fontWeight: "800", color: COLORS.textMain, marginBottom: 20 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  summaryLabel: { fontSize: 15, color: "#555", fontWeight: "500" },
  summaryValue: { fontSize: 15, color: "#333", fontWeight: "600" },
  totalLabel: { fontSize: 18, fontWeight: "600", color: COLORS.textMain },
  totalValue: { fontSize: 18, fontWeight: "800", color: COLORS.textMain },

  // Buttons Row
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 40, marginBottom: 20 },
  addItemsBtn: { 
    width: "46%", height: 55, 
    borderRadius: 12, borderWidth: 1, borderColor: COLORS.primary,
    justifyContent: "center", alignItems: "center" 
  },
  addItemsText: { color: COLORS.primary, fontSize: 16, fontWeight: "700" },
  checkoutBtn: { 
    width: "46%", height: 55, 
    borderRadius: 12, backgroundColor: COLORS.primary,
    justifyContent: "center", alignItems: "center" 
  },
  checkoutText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
});