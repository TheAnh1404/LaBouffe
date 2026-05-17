import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { COLORS } from "../constants/theme";
import { useAuth } from "../context/AuthContext";

const { width } = Dimensions.get("window");

const MOCK_TRANSACTIONS = [
  { id: "1", type: "topup", title: "Top Up Wallet", amount: 100, date: "May 15, 2026", icon: "arrow-down-circle" },
  { id: "2", type: "payment", title: "Biryani Order", amount: -45, date: "May 14, 2026", icon: "cart" },
  { id: "3", type: "payment", title: "Jollof Rice Order", amount: -45.9, date: "May 12, 2026", icon: "cart" },
  { id: "4", type: "refund", title: "Order Refund", amount: 20, date: "May 10, 2026", icon: "refresh-circle" },
  { id: "5", type: "topup", title: "Top Up Wallet", amount: 200, date: "May 8, 2026", icon: "arrow-down-circle" },
];

const TOP_UP_AMOUNTS = [10, 25, 50, 100, 200, 500];

export default function Wallet() {
  const { user } = useAuth();
  const [balance] = useState(229.10);
  const [selectedTopUp, setSelectedTopUp] = useState<number | null>(null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={28} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Wallet</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceCardOverlay} />
          <View style={styles.balanceContent}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceAmount}>AED {balance.toFixed(2)}</Text>
            <View style={styles.balanceActions}>
              <TouchableOpacity style={styles.balanceBtn}>
                <Ionicons name="add-circle" size={20} color={COLORS.white} />
                <Text style={styles.balanceBtnText}>Top Up</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.balanceBtn, styles.balanceBtnOutline]}>
                <Ionicons name="send" size={18} color={COLORS.white} />
                <Text style={styles.balanceBtnText}>Transfer</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Decorative circles */}
          <View style={[styles.decorCircle, { top: -30, right: -30 }]} />
          <View style={[styles.decorCircle, { bottom: -20, left: -20, width: 80, height: 80 }]} />
        </View>

        {/* Quick Top Up */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Quick Top Up</Text>
          <View style={styles.topUpGrid}>
            {TOP_UP_AMOUNTS.map((amount) => (
              <TouchableOpacity
                key={amount}
                style={[
                  styles.topUpChip,
                  selectedTopUp === amount && styles.topUpChipActive,
                ]}
                onPress={() => setSelectedTopUp(amount)}
              >
                <Text
                  style={[
                    styles.topUpChipText,
                    selectedTopUp === amount && styles.topUpChipTextActive,
                  ]}
                >
                  AED {amount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {selectedTopUp && (
            <TouchableOpacity style={styles.confirmTopUpBtn}>
              <Ionicons name="wallet" size={20} color={COLORS.white} />
              <Text style={styles.confirmTopUpText}>Add AED {selectedTopUp} to Wallet</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Payment Methods */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          <View style={styles.paymentMethod}>
            <View style={[styles.paymentIcon, { backgroundColor: "#E3F2FD" }]}>
              <Ionicons name="card" size={22} color="#1565C0" />
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentName}>Visa •••• 4582</Text>
              <Text style={styles.paymentSub}>Default card</Text>
            </View>
            <Ionicons name="checkmark-circle" size={22} color={COLORS.success} />
          </View>
          <View style={styles.paymentMethod}>
            <View style={[styles.paymentIcon, { backgroundColor: "#FFF3E0" }]}>
              <MaterialCommunityIcons name="cash" size={22} color="#E65100" />
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentName}>Cash on Delivery</Text>
              <Text style={styles.paymentSub}>Pay when you receive</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </View>
          <TouchableOpacity style={styles.addMethodBtn}>
            <Ionicons name="add" size={20} color={COLORS.primary} />
            <Text style={styles.addMethodText}>Add Payment Method</Text>
          </TouchableOpacity>
        </View>

        {/* Transaction History */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          {MOCK_TRANSACTIONS.map((tx) => (
            <View key={tx.id} style={styles.txRow}>
              <View style={[
                styles.txIcon,
                { backgroundColor: tx.amount > 0 ? "#E8F5E9" : COLORS.primaryLight }
              ]}>
                <Ionicons
                  name={tx.icon as any}
                  size={20}
                  color={tx.amount > 0 ? COLORS.success : COLORS.primary}
                />
              </View>
              <View style={styles.txInfo}>
                <Text style={styles.txTitle}>{tx.title}</Text>
                <Text style={styles.txDate}>{tx.date}</Text>
              </View>
              <Text
                style={[
                  styles.txAmount,
                  { color: tx.amount > 0 ? COLORS.success : COLORS.textPrimary }
                ]}
              >
                {tx.amount > 0 ? "+" : ""}AED {Math.abs(tx.amount).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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

  // Balance Card
  balanceCard: {
    marginHorizontal: 20, borderRadius: 24, padding: 28,
    backgroundColor: COLORS.primary, overflow: "hidden",
    elevation: 10, shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16,
  },
  balanceCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.05)", borderRadius: 24,
  },
  balanceContent: { zIndex: 1 },
  balanceLabel: { color: "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: "600" },
  balanceAmount: { color: COLORS.white, fontSize: 38, fontWeight: "900", marginTop: 4, letterSpacing: -1 },
  balanceActions: { flexDirection: "row", marginTop: 20, gap: 12 },
  balanceBtn: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 18, paddingVertical: 10,
    borderRadius: 12,
  },
  balanceBtnOutline: { backgroundColor: "rgba(255,255,255,0.1)", borderWidth: 1, borderColor: "rgba(255,255,255,0.3)" },
  balanceBtnText: { color: COLORS.white, fontWeight: "700", fontSize: 14, marginLeft: 6 },
  decorCircle: {
    position: "absolute", width: 100, height: 100, borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  // Section
  sectionContainer: { paddingHorizontal: 20, marginTop: 28 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: COLORS.textPrimary, marginBottom: 15 },
  sectionHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  seeAllText: { color: COLORS.primary, fontWeight: "600", fontSize: 14 },

  // Top Up
  topUpGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  topUpChip: {
    paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12,
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
  },
  topUpChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  topUpChipText: { fontSize: 14, fontWeight: "700", color: COLORS.textPrimary },
  topUpChipTextActive: { color: COLORS.white },
  confirmTopUpBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    backgroundColor: COLORS.primary, height: 52, borderRadius: 14, marginTop: 18,
    elevation: 4, shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8,
  },
  confirmTopUpText: { color: COLORS.white, fontWeight: "700", fontSize: 16, marginLeft: 8 },

  // Payment Methods
  paymentMethod: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: COLORS.white, padding: 16, borderRadius: 14, marginBottom: 10,
    elevation: 2, shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6,
  },
  paymentIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  paymentInfo: { flex: 1, marginLeft: 14 },
  paymentName: { fontSize: 15, fontWeight: "700", color: COLORS.textPrimary },
  paymentSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  addMethodBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    borderWidth: 1.5, borderColor: COLORS.primary, borderStyle: "dashed",
    height: 48, borderRadius: 14, marginTop: 5,
  },
  addMethodText: { color: COLORS.primary, fontWeight: "700", fontSize: 14, marginLeft: 6 },

  // Transactions
  txRow: {
    flexDirection: "row", alignItems: "center", paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  txIcon: { width: 42, height: 42, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  txInfo: { flex: 1, marginLeft: 14 },
  txTitle: { fontSize: 14, fontWeight: "600", color: COLORS.textPrimary },
  txDate: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  txAmount: { fontSize: 15, fontWeight: "800" },
});
