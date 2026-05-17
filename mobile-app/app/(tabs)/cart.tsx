import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons, AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { router } from "expo-router";
import { placeOrder } from "../../services/api";
import { COLORS } from "../../constants/theme";
import SuccessModal from "../../components/SuccessModal";

export default function Cart() {
  const { cartItems, updateQuantity, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [checkingOut, setCheckingOut] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Display-only fee estimates (actual fees calculated server-side)
  const estimatedDiscount = cartTotal > 50 ? 5 : 0;
  const estimatedDeliveryFee = cartItems.length > 0 ? 2 : 0;
  const estimatedServiceFee = cartItems.length > 0 ? 1.5 : 0;
  const estimatedTotal = cartTotal > 0
    ? cartTotal - estimatedDiscount + estimatedDeliveryFee + estimatedServiceFee
    : 0;

  /**
   * SECURE CHECKOUT FLOW:
   * 1. Client sends ONLY { foodId, quantity } to Cloud Function
   * 2. Server looks up real prices from database
   * 3. Server calculates fees, discounts, and total
   * 4. Server creates the order document
   *
   * This prevents any client-side price manipulation.
   */
  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    if (!isAuthenticated || !user) {
      Alert.alert(
        "Login Required",
        "You need to login to place an order.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Login", onPress: () => router.push("/(auth)/login") },
        ]
      );
      return;
    }

    setCheckingOut(true);
    try {
      // Send ONLY item references to the server — NO prices from client
      const result = await placeOrder({
        items: cartItems.map((item) => ({
          foodId: item.id,
          quantity: item.quantity,
        })),
      });

      if (result.success) {
        clearCart();
        setShowSuccessModal(true);
      } else {
        Alert.alert("Error", result.message || "Failed to place order.");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      const errorMessage =
        error?.message || "Failed to place order. Please try again.";
      Alert.alert("Error", errorMessage);
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Cart <MaterialCommunityIcons name="cart-outline" size={28} color={COLORS.textPrimary} />
          </Text>
        </View>

        {cartItems.length === 0 ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Ionicons name="cart-outline" size={80} color={COLORS.dotInactive} />
            <Text style={{ marginTop: 20, fontSize: 18, color: COLORS.textSecondary }}>
              Your cart is empty
            </Text>
            <TouchableOpacity
              style={[styles.checkoutBtn, { width: 200, marginTop: 30 }]}
              onPress={() => router.push("/menu")}
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

                <Image
                  source={item.imageUrl ? { uri: item.imageUrl } : require("../../assets/images/f1.png")}
                  style={styles.itemImage}
                  resizeMode="contain"
                />

                <View style={styles.infoContainer}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemDesc} numberOfLines={1}>
                    {item.desc}
                  </Text>

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

            {/* Payment Summary (estimated — actual is calculated server-side) */}
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>Payment summary</Text>
              <Text style={styles.estimateNote}>* Final amount calculated at checkout</Text>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>AED {cartTotal.toFixed(2)}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: COLORS.primary }]}>Discount</Text>
                <Text style={[styles.summaryValue, { color: COLORS.primary }]}>
                  - AED {estimatedDiscount.toFixed(2)}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery fee</Text>
                <Text style={styles.summaryValue}>AED {estimatedDeliveryFee.toFixed(2)}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Service fee</Text>
                <Text style={styles.summaryValue}>AED {estimatedServiceFee.toFixed(2)}</Text>
              </View>

              <View style={[styles.summaryRow, { marginTop: 10 }]}>
                <Text style={styles.totalLabel}>Estimated total</Text>
                <Text style={styles.totalValue}>AED {estimatedTotal.toFixed(2)}</Text>
              </View>
            </View>

            {/* Bottom Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.addItemsBtn} onPress={() => router.push("/menu")}>
                <Text style={styles.addItemsText}>Add items</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.checkoutBtn, checkingOut && { opacity: 0.7 }]}
                onPress={handleCheckout}
                disabled={checkingOut}
              >
                {checkingOut ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.checkoutText}>Checkout</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        message="Order Placed Successfully!"
        buttonText="View Orders"
        onPress={() => {
          setShowSuccessModal(false);
          router.push("/(tabs)/profile");
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, paddingHorizontal: 20 },
  header: { marginTop: 20, marginBottom: 30 },
  headerTitle: { fontSize: 32, fontWeight: "800", color: COLORS.textPrimary },

  // Cart Card
  cartCard: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    alignItems: "center",
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  heartIcon: { position: "absolute", top: 12, left: 12 },
  itemImage: { width: 80, height: 80, borderRadius: 10 },
  infoContainer: { flex: 1, marginLeft: 15 },
  itemName: { fontSize: 16, fontWeight: "700", color: COLORS.textPrimary },
  itemDesc: { fontSize: 12, color: COLORS.textSecondary, marginVertical: 2 },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  itemPrice: { fontSize: 16, fontWeight: "800", color: COLORS.textPrimary },

  // Quantity Buttons
  quantityContainer: { flexDirection: "row", alignItems: "center" },
  qtyBtn: {
    backgroundColor: COLORS.primary,
    width: 28,
    height: 20,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyText: { marginHorizontal: 12, fontSize: 16, fontWeight: "700" },

  // Summary
  summaryContainer: { marginTop: 30 },
  summaryTitle: { fontSize: 22, fontWeight: "800", color: COLORS.textPrimary, marginBottom: 8 },
  estimateNote: { fontSize: 12, color: COLORS.textSecondary, fontStyle: "italic", marginBottom: 16 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  summaryLabel: { fontSize: 15, color: COLORS.textSecondary, fontWeight: "500" },
  summaryValue: { fontSize: 15, color: COLORS.textPrimary, fontWeight: "600" },
  totalLabel: { fontSize: 18, fontWeight: "600", color: COLORS.textPrimary },
  totalValue: { fontSize: 18, fontWeight: "800", color: COLORS.textPrimary },

  // Buttons Row
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
    marginBottom: 20,
  },
  addItemsBtn: {
    width: "46%",
    height: 55,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  addItemsText: { color: COLORS.primary, fontSize: 16, fontWeight: "700" },
  checkoutBtn: {
    width: "46%",
    height: 55,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  checkoutText: { color: COLORS.white, fontSize: 16, fontWeight: "700" },
});