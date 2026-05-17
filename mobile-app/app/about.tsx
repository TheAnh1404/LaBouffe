import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Linking,
  Image,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { COLORS } from "../constants/theme";

const APP_VERSION = "1.0.0";
const BUILD_NUMBER = "2026.05";

const FEATURES = [
  { icon: "restaurant", label: "100+ Restaurants", color: "#E3F2FD", iconColor: "#1565C0" },
  { icon: "time", label: "Fast Delivery", color: "#FFF3E0", iconColor: "#E65100" },
  { icon: "shield-checkmark", label: "Secure Payments", color: "#E8F5E9", iconColor: "#2E7D32" },
  { icon: "star", label: "Top Rated", color: "#F3E5F5", iconColor: "#7B1FA2" },
];

const LINKS = [
  { icon: "document-text-outline", label: "Terms of Service", url: "https://labouffe.app/terms" },
  { icon: "lock-closed-outline", label: "Privacy Policy", url: "https://labouffe.app/privacy" },
  { icon: "code-slash-outline", label: "Open Source Licenses", url: "https://labouffe.app/licenses" },
];

const SOCIALS = [
  { icon: "logo-instagram", url: "https://instagram.com/labouffe", color: "#E1306C" },
  { icon: "logo-twitter", url: "https://twitter.com/labouffe", color: "#1DA1F2" },
  { icon: "logo-facebook", url: "https://facebook.com/labouffe", color: "#1877F2" },
  { icon: "logo-github", url: "https://github.com/TheAnh1404/LaBouffe", color: "#333" },
];

export default function About() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={28} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>About</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* App Logo & Info */}
        <View style={styles.appInfoSection}>
          <View style={styles.logoContainer}>
            <MaterialCommunityIcons name="food-fork-drink" size={50} color={COLORS.primary} />
          </View>
          <Text style={styles.appName}>LaBouffe</Text>
          <Text style={styles.appTagline}>Delicious food, delivered fast</Text>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>v{APP_VERSION} ({BUILD_NUMBER})</Text>
          </View>
        </View>

        {/* Features Grid */}
        <View style={styles.featuresGrid}>
          {FEATURES.map((feat, idx) => (
            <View key={idx} style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: feat.color }]}>
                <Ionicons name={feat.icon as any} size={24} color={feat.iconColor} />
              </View>
              <Text style={styles.featureLabel}>{feat.label}</Text>
            </View>
          ))}
        </View>

        {/* About Text */}
        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>Our Story</Text>
          <Text style={styles.aboutText}>
            LaBouffe was born from a passion for great food and seamless technology. 
            We connect food lovers with the best local restaurants, ensuring every meal 
            is a delightful experience — from browsing the menu to the moment it arrives at your door.
          </Text>
          <Text style={styles.aboutText}>
            Built with React Native & Firebase, LaBouffe is designed to deliver not just 
            food, but a premium mobile experience with secure checkout, real-time tracking, 
            and personalized recommendations.
          </Text>
        </View>

        {/* Links */}
        <View style={styles.linksSection}>
          <Text style={styles.linksSectionTitle}>Legal</Text>
          {LINKS.map((link, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.linkRow}
              onPress={() => Linking.openURL(link.url)}
            >
              <View style={styles.linkIconContainer}>
                <Ionicons name={link.icon as any} size={20} color={COLORS.textSecondary} />
              </View>
              <Text style={styles.linkText}>{link.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Social Media */}
        <View style={styles.socialSection}>
          <Text style={styles.socialTitle}>Follow Us</Text>
          <View style={styles.socialRow}>
            {SOCIALS.map((social, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.socialBtn}
                onPress={() => Linking.openURL(social.url)}
              >
                <Ionicons name={social.icon as any} size={24} color={social.color} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tech Stack Badge */}
        <View style={styles.techSection}>
          <Text style={styles.techTitle}>Built With</Text>
          <View style={styles.techRow}>
            {["React Native", "Expo", "Firebase", "TypeScript"].map((tech, idx) => (
              <View key={idx} style={styles.techBadge}>
                <Text style={styles.techBadgeText}>{tech}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with ❤️ in UAE</Text>
          <Text style={styles.footerCopy}>© 2026 LaBouffe. All rights reserved.</Text>
        </View>

        <View style={{ height: 30 }} />
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

  // App Info
  appInfoSection: { alignItems: "center", paddingTop: 15, paddingBottom: 25 },
  logoContainer: {
    width: 100, height: 100, borderRadius: 28,
    backgroundColor: COLORS.primaryLight, justifyContent: "center", alignItems: "center",
    marginBottom: 16,
    elevation: 4, shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10,
  },
  appName: { fontSize: 32, fontWeight: "900", color: COLORS.textPrimary, letterSpacing: -0.5 },
  appTagline: { fontSize: 15, color: COLORS.textSecondary, marginTop: 4 },
  versionBadge: {
    backgroundColor: COLORS.surface, paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 10, marginTop: 12,
  },
  versionText: { fontSize: 12, color: COLORS.textMuted, fontWeight: "600" },

  // Features
  featuresGrid: {
    flexDirection: "row", justifyContent: "space-around",
    paddingHorizontal: 15, marginBottom: 10,
  },
  featureItem: { alignItems: "center", width: "22%" },
  featureIcon: {
    width: 52, height: 52, borderRadius: 16,
    justifyContent: "center", alignItems: "center", marginBottom: 8,
  },
  featureLabel: { fontSize: 11, fontWeight: "600", color: COLORS.textSecondary, textAlign: "center" },

  // About
  aboutSection: { paddingHorizontal: 25, marginTop: 25 },
  aboutTitle: { fontSize: 20, fontWeight: "800", color: COLORS.textPrimary, marginBottom: 12 },
  aboutText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 23, marginBottom: 12 },

  // Links
  linksSection: { paddingHorizontal: 20, marginTop: 25 },
  linksSectionTitle: { fontSize: 18, fontWeight: "800", color: COLORS.textPrimary, marginBottom: 12 },
  linkRow: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: COLORS.white, padding: 16, borderRadius: 14, marginBottom: 8,
    elevation: 2, shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6,
  },
  linkIconContainer: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: COLORS.surface, justifyContent: "center", alignItems: "center",
  },
  linkText: { flex: 1, fontSize: 14, fontWeight: "600", color: COLORS.textPrimary, marginLeft: 14 },

  // Social
  socialSection: { alignItems: "center", marginTop: 30 },
  socialTitle: { fontSize: 16, fontWeight: "700", color: COLORS.textSecondary, marginBottom: 16 },
  socialRow: { flexDirection: "row", gap: 20 },
  socialBtn: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: COLORS.white, justifyContent: "center", alignItems: "center",
    elevation: 3, shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6,
  },

  // Tech Stack
  techSection: { alignItems: "center", marginTop: 30 },
  techTitle: { fontSize: 14, fontWeight: "600", color: COLORS.textMuted, marginBottom: 12 },
  techRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8 },
  techBadge: {
    backgroundColor: COLORS.primaryLight, paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 8,
  },
  techBadgeText: { fontSize: 12, fontWeight: "700", color: COLORS.primary },

  // Footer
  footer: { alignItems: "center", marginTop: 30, paddingBottom: 10 },
  footerText: { fontSize: 14, color: COLORS.textSecondary },
  footerCopy: { fontSize: 11, color: COLORS.textMuted, marginTop: 4 },
});
