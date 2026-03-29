import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert
} from "react-native";
import { Ionicons, AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useCart } from "../../context/CartContext";
import { router } from "expo-router";

const COLORS = {
  primary: "#FF6332",
  textMain: "#333333",
  textSecondary: "#888888",
  bg: "#FFFFFF",
};

export default function Cart() {
  const { cartItems, updateQuantity, cartTotal, clearCart } = useCart();

  const discount = cartItems.length > 0 ? 5 : 0;
  const deliveryFee = cartItems.length > 0 ? 2 : 0;
  const serviceFee = cartItems.length > 0 ? 1.5 : 0;

  const totalAmount = cartTotal > 0 ? cartTotal - discount + deliveryFee + serviceFee : 0;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    // Tạm thời Clear Cart cho Checkout - Phần push DB Order có thể đặt ở hàm riêng
    Alert.alert("Order Placed", "Your order has been placed successfully!", [
      { text: "OK", onPress: () => clearCart() }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Cart <MaterialCommunityIcons name="cart-outline" size={28} color={COLORS.textMain} /></Text>
        </View>

        {cartItems.length === 0 ? (
          <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <Ionicons name="cart-outline" size={80} color="#DDD" />
            <Text style={{marginTop: 20, fontSize: 18, color: "#888"}}>Your cart is empty</Text>
            <TouchableOpacity 
              style={[styles.checkoutBtn, {width: 200, marginTop: 30}]} 
              onPress={() => router.push('/menu')}
            >
              <Text style={styles.checkoutText}>Go to Menu</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
            {/* Cart Items List */}
            {cartItems.map((item) => (
              <View key={item.id} style={styles.cartCard}>
                <TouchableOpacity style={styles.heartIcon}>
                  <Ionicons name="heart-outline" size={16} color={COLORS.primary} />
                </TouchableOpacity>
                
                <Image source={item.imageUrl ? { uri: item.imageUrl } : require("../../assets/images/f1.png")} style={styles.itemImage} resizeMode="contain" />

                <View style={styles.infoContainer}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemDesc} numberOfLines={1}>{item.desc}</Text>
                  
                  <View style={styles.priceRow}>
                    <Text style={styles.itemPrice}>AED {item.price}</Text>
                    
                    {/* Quantity Selector */}
                    <View style={styles.quantityContainer}>
                      <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.id, -1)}>
                        <AntDesign name="minus" size={16} color="#FFF" />
                      </TouchableOpacity>
                      <Text style={styles.qtyText}>{item.quantity}</Text>
                      <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.id, 1)}>
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
                <Text style={styles.summaryValue}>AED {cartTotal.toFixed(2)}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, {color: COLORS.primary}]}>Discount</Text>
                <Text style={[styles.summaryValue, {color: COLORS.primary}]}>- AED {discount.toFixed(2)}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery fee</Text>
                <Text style={styles.summaryValue}>AED {deliveryFee.toFixed(2)}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Service fee</Text>
                <Text style={styles.summaryValue}>AED {serviceFee.toFixed(2)}</Text>
              </View>

              <View style={[styles.summaryRow, {marginTop: 10}]}>
                <Text style={styles.totalLabel}>Total amount</Text>
                <Text style={styles.totalValue}>AED {totalAmount.toFixed(2)}</Text>
              </View>
            </View>

            {/* Bottom Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.addItemsBtn} onPress={() => router.push('/menu')}>
                <Text style={styles.addItemsText}>Add items</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
                <Text style={styles.checkoutText}>Checkout</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
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
  itemImage: { width: 80, height: 80, borderRadius: 10 },
  infoContainer: { flex: 1, marginLeft: 15 },
  itemName: { fontSize: 16, fontWeight: "700", color: COLORS.textMain },
  itemDesc: { fontSize: 12, color: COLORS.textSecondary, marginVertical: 2 },
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