import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Linking,
  TextInput,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { COLORS } from "../constants/theme";

const FAQ_DATA = [
  {
    question: "How do I place an order?",
    answer: "Browse the menu, add items to your cart, and tap 'Checkout'. Your order will be confirmed by the restaurant within minutes.",
  },
  {
    question: "Can I cancel my order?",
    answer: "You can cancel an order only while it's in 'Placed' status (before the restaurant confirms it). Go to Order History and tap 'Cancel'.",
  },
  {
    question: "How long does delivery take?",
    answer: "Delivery typically takes 15-30 minutes depending on the restaurant's distance and order complexity.",
  },
  {
    question: "What payment methods are accepted?",
    answer: "We accept Visa, Mastercard, Apple Pay, and Cash on Delivery. You can manage your payment methods in the Wallet section.",
  },
  {
    question: "How do I get a refund?",
    answer: "If your order was cancelled or there was an issue, refunds are processed automatically within 3-5 business days to your original payment method.",
  },
  {
    question: "Can I change my delivery address?",
    answer: "Currently, delivery address is set per order. Make sure to verify your address before placing the order.",
  },
];

const CONTACT_OPTIONS = [
  {
    id: "chat",
    icon: "chatbubbles",
    title: "Live Chat",
    desc: "Chat with our support team",
    color: "#E3F2FD",
    iconColor: "#1565C0",
  },
  {
    id: "email",
    icon: "mail",
    title: "Email Us",
    desc: "support@labouffe.app",
    color: "#FFF3E0",
    iconColor: "#E65100",
  },
  {
    id: "phone",
    icon: "call",
    title: "Call Us",
    desc: "+971 4 123 4567",
    color: "#E8F5E9",
    iconColor: "#2E7D32",
  },
];

function FAQItem({ item }: { item: { question: string; answer: string } }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      style={styles.faqItem}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
    >
      <View style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{item.question}</Text>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={COLORS.textSecondary}
        />
      </View>
      {expanded && (
        <Text style={styles.faqAnswer}>{item.answer}</Text>
      )}
    </TouchableOpacity>
  );
}

export default function GetHelp() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFAQ = FAQ_DATA.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={28} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Get Help</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroIconContainer}>
            <MaterialCommunityIcons name="headset" size={48} color={COLORS.primary} />
          </View>
          <Text style={styles.heroTitle}>How can we help you?</Text>
          <Text style={styles.heroDesc}>
            Find answers in our FAQ or contact{"\n"}our support team directly
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for help..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Contact Options */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <View style={styles.contactGrid}>
            {CONTACT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.contactCard}
                onPress={() => {
                  if (option.id === "email") {
                    Linking.openURL("mailto:support@labouffe.app");
                  } else if (option.id === "phone") {
                    Linking.openURL("tel:+97141234567");
                  }
                }}
              >
                <View style={[styles.contactIcon, { backgroundColor: option.color }]}>
                  <Ionicons name={option.icon as any} size={24} color={option.iconColor} />
                </View>
                <Text style={styles.contactTitle}>{option.title}</Text>
                <Text style={styles.contactDesc}>{option.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* FAQ */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {filteredFAQ.length === 0 ? (
            <View style={styles.noResults}>
              <Ionicons name="search" size={40} color={COLORS.dotInactive} />
              <Text style={styles.noResultsText}>No matching questions found</Text>
            </View>
          ) : (
            filteredFAQ.map((item, idx) => <FAQItem key={idx} item={item} />)
          )}
        </View>

        {/* Still need help */}
        <View style={styles.bottomBanner}>
          <Text style={styles.bottomBannerTitle}>Still need help?</Text>
          <Text style={styles.bottomBannerDesc}>
            Our support team is available 24/7
          </Text>
          <TouchableOpacity style={styles.bottomBannerBtn}>
            <MaterialCommunityIcons name="message-text" size={18} color={COLORS.white} />
            <Text style={styles.bottomBannerBtnText}>Start a Conversation</Text>
          </TouchableOpacity>
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

  // Hero
  heroSection: { alignItems: "center", paddingVertical: 25, paddingHorizontal: 40 },
  heroIconContainer: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: COLORS.primaryLight, justifyContent: "center", alignItems: "center",
    marginBottom: 18,
  },
  heroTitle: { fontSize: 24, fontWeight: "900", color: COLORS.textPrimary, marginBottom: 8 },
  heroDesc: { fontSize: 14, color: COLORS.textSecondary, textAlign: "center", lineHeight: 22 },

  // Search
  searchContainer: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: COLORS.white, marginHorizontal: 20,
    paddingHorizontal: 16, height: 50, borderRadius: 14,
    borderWidth: 1, borderColor: COLORS.border,
    elevation: 2, shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: COLORS.textPrimary },

  // Sections
  sectionContainer: { paddingHorizontal: 20, marginTop: 28 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: COLORS.textPrimary, marginBottom: 15 },

  // Contact
  contactGrid: { flexDirection: "row", justifyContent: "space-between" },
  contactCard: {
    width: "31%", backgroundColor: COLORS.white, borderRadius: 16,
    paddingVertical: 18, alignItems: "center",
    elevation: 3, shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 8,
  },
  contactIcon: {
    width: 50, height: 50, borderRadius: 14, justifyContent: "center", alignItems: "center",
    marginBottom: 10,
  },
  contactTitle: { fontSize: 13, fontWeight: "700", color: COLORS.textPrimary },
  contactDesc: { fontSize: 10, color: COLORS.textSecondary, marginTop: 3, textAlign: "center", paddingHorizontal: 4 },

  // FAQ
  faqItem: {
    backgroundColor: COLORS.white, borderRadius: 14, padding: 16, marginBottom: 10,
    elevation: 2, shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6,
  },
  faqHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  faqQuestion: { fontSize: 14, fontWeight: "700", color: COLORS.textPrimary, flex: 1, marginRight: 10 },
  faqAnswer: {
    fontSize: 13, color: COLORS.textSecondary, lineHeight: 21,
    marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  noResults: { alignItems: "center", paddingVertical: 30 },
  noResultsText: { fontSize: 14, color: COLORS.textSecondary, marginTop: 10 },

  // Bottom Banner
  bottomBanner: {
    marginHorizontal: 20, marginTop: 30, backgroundColor: COLORS.primary,
    borderRadius: 20, padding: 24, alignItems: "center",
    elevation: 6, shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12,
  },
  bottomBannerTitle: { color: COLORS.white, fontSize: 18, fontWeight: "800" },
  bottomBannerDesc: { color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 4 },
  bottomBannerBtn: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 22, paddingVertical: 12,
    borderRadius: 12, marginTop: 18,
  },
  bottomBannerBtnText: { color: COLORS.white, fontWeight: "700", fontSize: 14, marginLeft: 8 },
});
