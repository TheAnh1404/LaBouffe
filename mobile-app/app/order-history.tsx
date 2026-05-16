import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { COLORS } from "../constants/theme";
import { useOrders, Order } from "../hooks/useOrders";

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  placed: { bg: "#FFF3E0", text: "#E65100" },
  preparing: { bg: "#E3F2FD", text: "#1565C0" },
  delivering: { bg: "#F3E5F5", text: "#7B1FA2" },
  delivered: { bg: "#E8F5E9", text: "#2E7D32" },
};

function OrderCard({ order }: { order: Order }) {
  const statusStyle = STATUS_COLORS[order.status] || STATUS_COLORS.placed;
  const date = order.createdAt?.toDate
    ? order.createdAt.toDate().toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Just now";

  return (
    <View style={styles.orderCard}>
      {/* Header */}
      <View style={styles.orderHeader}>
        <Text style={styles.orderDate}>{date}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
          <Text style={[styles.statusText, { color: statusStyle.text }]}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Text>
        </View>
      </View>

      {/* Items preview */}
      <View style={styles.itemsPreview}>
        {order.items.slice(0, 3).map((item, idx) => (
          <View key={idx} style={styles.itemRow}>
            <Image
              source={item.imageUrl ? { uri: item.imageUrl } : require("../assets/images/f1.png")}
              style={styles.itemThumb}
            />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.itemQty}>x{item.quantity}</Text>
            </View>
            <Text style={styles.itemPrice}>AED {(item.price * item.quantity).toFixed(2)}</Text>
          </View>
        ))}
        {order.items.length > 3 && (
          <Text style={styles.moreItems}>+{order.items.length - 3} more items</Text>
        )}
      </View>

      {/* Total */}
      <View style={styles.orderFooter}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>AED {order.totalAmount.toFixed(2)}</Text>
      </View>
    </View>
  );
}

export default function OrderHistory() {
  const { orders, loading } = useOrders();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={{ width: 28 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={80} color="#DDD" />
          <Text style={styles.emptyText}>No orders yet</Text>
          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() => router.push("/(tabs)/menu")}
          >
            <Text style={styles.shopBtnText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30 }}
        >
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  backBtn: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  // Order Card
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  orderDate: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  // Items
  itemsPreview: {
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  itemThumb: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  itemQty: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  moreItems: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "600",
    marginTop: 4,
  },
  // Footer
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.primary,
  },
  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    marginTop: 20,
    fontSize: 18,
    color: COLORS.textSecondary,
  },
  shopBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 15,
    marginTop: 25,
  },
  shopBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
