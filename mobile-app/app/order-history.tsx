import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { COLORS } from "../constants/theme";
import { useOrders, Order } from "../hooks/useOrders";
import { cancelOrder } from "../services/api";

const STATUS_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  placed:     { bg: "#FFF3E0", text: "#E65100", icon: "time-outline" },
  confirmed:  { bg: "#E8F5E9", text: "#2E7D32", icon: "checkmark-circle-outline" },
  preparing:  { bg: "#E3F2FD", text: "#1565C0", icon: "restaurant-outline" },
  delivering: { bg: "#F3E5F5", text: "#7B1FA2", icon: "bicycle-outline" },
  delivered:  { bg: "#E8F5E9", text: "#2E7D32", icon: "checkmark-done-outline" },
  cancelled:  { bg: "#FFEBEE", text: "#C62828", icon: "close-circle-outline" },
};

function OrderCard({ order, onCancel }: { order: Order; onCancel: (id: string) => void }) {
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

  const canCancel = order.status === "placed";

  return (
    <View style={styles.orderCard}>
      {/* Header */}
      <View style={styles.orderHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.orderDate}>{date}</Text>
          <Text style={styles.orderId}>#{order.id.slice(-8).toUpperCase()}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
          <Ionicons name={statusStyle.icon as any} size={14} color={statusStyle.text} />
          <Text style={[styles.statusText, { color: statusStyle.text }]}>
            {" "}{order.status.charAt(0).toUpperCase() + order.status.slice(1)}
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

      {/* Order Note */}
      {order.note ? (
        <View style={styles.noteRow}>
          <Ionicons name="chatbubble-ellipses-outline" size={14} color={COLORS.textMuted} />
          <Text style={styles.noteText} numberOfLines={2}>{order.note}</Text>
        </View>
      ) : null}

      {/* Cancellation Reason */}
      {order.status === "cancelled" && order.cancellationReason ? (
        <View style={styles.cancelReasonRow}>
          <Ionicons name="information-circle-outline" size={14} color={COLORS.error} />
          <Text style={styles.cancelReasonText}>{order.cancellationReason}</Text>
        </View>
      ) : null}

      {/* Fee Breakdown */}
      <View style={styles.breakdownContainer}>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Subtotal</Text>
          <Text style={styles.breakdownValue}>AED {order.subtotal.toFixed(2)}</Text>
        </View>
        {order.discount > 0 && (
          <View style={styles.breakdownRow}>
            <Text style={[styles.breakdownLabel, { color: COLORS.primary }]}>Discount</Text>
            <Text style={[styles.breakdownValue, { color: COLORS.primary }]}>
              -AED {order.discount.toFixed(2)}
            </Text>
          </View>
        )}
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Delivery</Text>
          <Text style={styles.breakdownValue}>AED {order.deliveryFee.toFixed(2)}</Text>
        </View>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Service</Text>
          <Text style={styles.breakdownValue}>AED {order.serviceFee.toFixed(2)}</Text>
        </View>
      </View>

      {/* Total + Cancel */}
      <View style={styles.orderFooter}>
        <View>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>AED {order.totalAmount.toFixed(2)}</Text>
        </View>

        {canCancel && (
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => onCancel(order.id)}
            activeOpacity={0.7}
          >
            <Ionicons name="close-outline" size={18} color={COLORS.error} />
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default function OrderHistory() {
  const { orders, loading } = useOrders();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleCancelOrder = (orderId: string) => {
    Alert.alert(
      "Cancel Order",
      "Are you sure you want to cancel this order? This action cannot be undone.",
      [
        { text: "No, Keep It", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            setCancellingId(orderId);
            try {
              const result = await cancelOrder({ orderId });
              if (result.success) {
                Alert.alert("Cancelled", "Your order has been cancelled successfully.");
              } else {
                Alert.alert("Error", result.message || "Failed to cancel order.");
              }
            } catch (error: any) {
              const msg = error?.message || "Failed to cancel order. Please try again.";
              Alert.alert("Error", msg);
            } finally {
              setCancellingId(null);
            }
          },
        },
      ]
    );
  };

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
          <Ionicons name="receipt-outline" size={80} color={COLORS.dotInactive} />
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
            <OrderCard
              key={order.id}
              order={order}
              onCancel={handleCancelOrder}
            />
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
  orderId: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: "600",
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
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
  // Note
  noteRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.surface,
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  noteText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontStyle: "italic",
    marginLeft: 8,
    flex: 1,
  },
  // Cancel Reason
  cancelReasonRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.errorBg,
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.errorLight,
  },
  cancelReasonText: {
    fontSize: 13,
    color: COLORS.error,
    marginLeft: 8,
    flex: 1,
  },
  // Breakdown
  breakdownContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
    marginBottom: 10,
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  breakdownLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: "500",
  },
  breakdownValue: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "600",
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
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textSecondary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.primary,
  },
  // Cancel button
  cancelBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.errorBg,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.errorLight,
  },
  cancelBtnText: {
    color: COLORS.error,
    fontWeight: "700",
    fontSize: 14,
    marginLeft: 4,
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
