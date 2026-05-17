import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { COLORS } from "../constants/theme";
import { useOrders, Order } from "../hooks/useOrders";

const TRACKING_STEPS = [
  { status: "placed", label: "Order Placed", desc: "Your order has been received", icon: "receipt-outline" },
  { status: "confirmed", label: "Confirmed", desc: "Restaurant accepted your order", icon: "checkmark-circle-outline" },
  { status: "preparing", label: "Preparing", desc: "Chef is cooking your meal", icon: "restaurant-outline" },
  { status: "delivering", label: "On the Way", desc: "Driver is heading to you", icon: "bicycle-outline" },
  { status: "delivered", label: "Delivered", desc: "Enjoy your meal!", icon: "checkmark-done-outline" },
];

const STATUS_ORDER = ["placed", "confirmed", "preparing", "delivering", "delivered"];

function getStepIndex(status: string): number {
  const idx = STATUS_ORDER.indexOf(status);
  return idx >= 0 ? idx : 0;
}

function TrackingTimeline({ order }: { order: Order }) {
  const currentIdx = getStepIndex(order.status);
  const isCancelled = order.status === "cancelled";

  const date = order.createdAt?.toDate
    ? order.createdAt.toDate().toLocaleDateString("en-US", {
        day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
      })
    : "Just now";

  return (
    <View style={styles.trackCard}>
      {/* Order Header */}
      <View style={styles.trackHeader}>
        <View>
          <Text style={styles.trackOrderId}>Order #{order.id.slice(-8).toUpperCase()}</Text>
          <Text style={styles.trackDate}>{date}</Text>
        </View>
        <Text style={styles.trackTotal}>AED {order.totalAmount.toFixed(2)}</Text>
      </View>

      {/* Items Summary */}
      <View style={styles.trackItemsSummary}>
        <Ionicons name="fast-food" size={16} color={COLORS.textSecondary} />
        <Text style={styles.trackItemsText}>
          {order.items.map(i => `${i.name} x${i.quantity}`).slice(0, 2).join(", ")}
          {order.items.length > 2 ? ` +${order.items.length - 2} more` : ""}
        </Text>
      </View>

      {/* Cancelled State */}
      {isCancelled ? (
        <View style={styles.cancelledBanner}>
          <Ionicons name="close-circle" size={20} color={COLORS.error} />
          <Text style={styles.cancelledText}>This order was cancelled</Text>
        </View>
      ) : (
        /* Timeline */
        <View style={styles.timeline}>
          {TRACKING_STEPS.map((step, idx) => {
            const isCompleted = idx <= currentIdx;
            const isCurrent = idx === currentIdx;
            const isLast = idx === TRACKING_STEPS.length - 1;

            return (
              <View key={step.status} style={styles.timelineRow}>
                {/* Dot + Line */}
                <View style={styles.timelineIndicator}>
                  <View style={[
                    styles.timelineDot,
                    isCompleted && styles.timelineDotActive,
                    isCurrent && styles.timelineDotCurrent,
                  ]}>
                    {isCompleted && (
                      <Ionicons
                        name={isCurrent ? step.icon as any : "checkmark"}
                        size={isCurrent ? 16 : 12}
                        color={COLORS.white}
                      />
                    )}
                  </View>
                  {!isLast && (
                    <View style={[
                      styles.timelineLine,
                      isCompleted && idx < currentIdx && styles.timelineLineActive,
                    ]} />
                  )}
                </View>

                {/* Label */}
                <View style={styles.timelineContent}>
                  <Text style={[
                    styles.timelineLabel,
                    isCompleted && styles.timelineLabelActive,
                    isCurrent && styles.timelineLabelCurrent,
                  ]}>
                    {step.label}
                  </Text>
                  <Text style={[
                    styles.timelineDesc,
                    isCurrent && { color: COLORS.textSecondary },
                  ]}>
                    {step.desc}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

export default function Track() {
  const { orders, loading } = useOrders();

  // Show only active orders (not delivered/cancelled)
  const activeOrders = orders.filter(o =>
    ["placed", "confirmed", "preparing", "delivering"].includes(o.status)
  );
  // Recent completed/cancelled
  const pastOrders = orders.filter(o =>
    ["delivered", "cancelled"].includes(o.status)
  ).slice(0, 3);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Track Orders</Text>
        <View style={{ width: 28 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
      ) : activeOrders.length === 0 && pastOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <MaterialCommunityIcons name="map-marker-path" size={60} color={COLORS.primary} />
          </View>
          <Text style={styles.emptyTitle}>No Active Orders</Text>
          <Text style={styles.emptyDesc}>
            When you place an order, you can{"\n"}track its progress here in real-time
          </Text>
          <TouchableOpacity
            style={styles.orderBtn}
            onPress={() => router.push("/(tabs)/menu")}
          >
            <Text style={styles.orderBtnText}>Order Now</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30 }}
        >
          {/* Active Orders */}
          {activeOrders.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <View style={[styles.activeBadge]}>
                  <View style={styles.liveDot} />
                  <Text style={styles.activeBadgeText}>
                    {activeOrders.length} Active
                  </Text>
                </View>
              </View>
              {activeOrders.map((order) => (
                <TrackingTimeline key={order.id} order={order} />
              ))}
            </>
          )}

          {/* Past Orders */}
          {pastOrders.length > 0 && (
            <>
              <Text style={styles.pastTitle}>Recently Completed</Text>
              {pastOrders.map((order) => (
                <TrackingTimeline key={order.id} order={order} />
              ))}
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15,
  },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: "800", color: COLORS.textPrimary },

  // Sections
  sectionHeader: { marginBottom: 15, marginTop: 5 },
  activeBadge: {
    flexDirection: "row", alignItems: "center", alignSelf: "flex-start",
    backgroundColor: "#E8F5E9", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10,
  },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.success, marginRight: 8 },
  activeBadgeText: { fontSize: 13, fontWeight: "700", color: "#2E7D32" },
  pastTitle: { fontSize: 18, fontWeight: "800", color: COLORS.textPrimary, marginTop: 25, marginBottom: 15 },

  // Track Card
  trackCard: {
    backgroundColor: COLORS.white, borderRadius: 18, padding: 18, marginBottom: 16,
    elevation: 4, shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 10,
  },
  trackHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10,
  },
  trackOrderId: { fontSize: 15, fontWeight: "800", color: COLORS.textPrimary },
  trackDate: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  trackTotal: { fontSize: 16, fontWeight: "800", color: COLORS.primary },
  trackItemsSummary: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: COLORS.surface, padding: 10, borderRadius: 10, marginBottom: 16,
  },
  trackItemsText: { fontSize: 13, color: COLORS.textSecondary, marginLeft: 8, flex: 1 },

  // Cancelled
  cancelledBanner: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: COLORS.errorBg, padding: 12, borderRadius: 10,
    borderWidth: 1, borderColor: COLORS.errorLight,
  },
  cancelledText: { fontSize: 14, color: COLORS.error, fontWeight: "600", marginLeft: 8 },

  // Timeline
  timeline: { marginTop: 5 },
  timelineRow: { flexDirection: "row", minHeight: 56 },
  timelineIndicator: { alignItems: "center", width: 32 },
  timelineDot: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: COLORS.dotInactive, justifyContent: "center", alignItems: "center",
  },
  timelineDotActive: { backgroundColor: COLORS.success },
  timelineDotCurrent: { backgroundColor: COLORS.primary, width: 30, height: 30, borderRadius: 15 },
  timelineLine: { width: 2, flex: 1, backgroundColor: COLORS.dotInactive, marginVertical: 3 },
  timelineLineActive: { backgroundColor: COLORS.success },
  timelineContent: { flex: 1, marginLeft: 14, paddingBottom: 16 },
  timelineLabel: { fontSize: 14, fontWeight: "600", color: COLORS.textMuted },
  timelineLabelActive: { color: COLORS.textPrimary },
  timelineLabelCurrent: { color: COLORS.primary, fontWeight: "800", fontSize: 15 },
  timelineDesc: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },

  // Empty
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 40 },
  emptyIconContainer: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: COLORS.primaryLight, justifyContent: "center", alignItems: "center", marginBottom: 25,
  },
  emptyTitle: { fontSize: 22, fontWeight: "800", color: COLORS.textPrimary, marginBottom: 10 },
  emptyDesc: { fontSize: 14, color: COLORS.textSecondary, textAlign: "center", lineHeight: 22 },
  orderBtn: {
    backgroundColor: COLORS.primary, paddingHorizontal: 30, paddingVertical: 14, borderRadius: 14, marginTop: 30,
    elevation: 4, shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8,
  },
  orderBtnText: { color: COLORS.white, fontWeight: "700", fontSize: 16 },
});
