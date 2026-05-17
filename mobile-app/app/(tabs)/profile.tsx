import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { auth, db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useAuth } from "../../context/AuthContext";

import { COLORS } from "../../constants/theme";

export default function Profile() {
  const [userName, setUserName] = useState("Guest");
  const [userPhone, setUserPhone] = useState("Please login");
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const { signOut } = useAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserName(user.displayName || "User");
        setUserPhone(user.phoneNumber || user.email || "No contact info");
        setUserAvatar(user.photoURL);
        
        // Try fetching from users collection if exists
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.fullName) setUserName(data.fullName);
            if (data.phoneNumber) setUserPhone(data.phoneNumber);
            if (data.avatarUrl) setUserAvatar(data.avatarUrl);
          }
        } catch (e) {
          console.log("Error fetching user profile", e);
        }
      } else {
        setUserName("Guest User");
        setUserPhone("Login to sync orders");
      }
    });
    return unsubscribe;
  }, []);

  const menuItems = [
    { id: 1, name: "Wallet", icon: "wallet-outline", library: Ionicons, route: "/wallet" },
    { id: 2, name: "Order", icon: "format-list-bulleted", library: MaterialCommunityIcons, route: "/order-history" },
    { id: 3, name: "Favourite", icon: "bookmark-outline", library: Ionicons, route: "/favourite" },
    { id: 4, name: "Track", icon: "file-clock-outline", library: MaterialCommunityIcons, route: "/track" },
    { id: 5, name: "Get Help", icon: "help-circle-outline", library: MaterialCommunityIcons, route: "/get-help" },
    { id: 6, name: "About", icon: "information-outline", library: MaterialCommunityIcons, route: "/about" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* --- NEW HEADER SECTION --- */}
        <View style={styles.headerContainer}>
          {/* Hàng 1: Các nút chức năng điều hướng */}
          <View style={styles.navRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={30} color={COLORS.textPrimary} />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => router.push('/seed' as any)}>
              <Ionicons name="settings-outline" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Hàng 2: Tiêu đề lớn Profile đẩy xuống dưới */}
          <View style={styles.titleRow}>
            <Text style={styles.largeTitle}>Profile</Text>
            <MaterialCommunityIcons 
              name="account" 
              size={32} 
              color={COLORS.primary} 
              style={{ marginLeft: 8, marginTop: 6 }} 
            />
          </View>
        </View>

        {/* User Info Section */}
        <View style={styles.userInfoSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={userAvatar ? { uri: userAvatar } : require("../../assets/images/user_avatar.jpg")} 
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editIconContainer}>
              <MaterialCommunityIcons name="pencil-box-outline" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userPhone}>{userPhone}</Text>
        </View>

        {/* Grid Menu */}
        <View style={styles.gridContainer}>
          {menuItems.map((item) => {
            const IconLib = item.library;
            return (
              <TouchableOpacity 
                key={item.id} 
                style={styles.gridItem} 
                activeOpacity={0.8}
                onPress={() => item.route && router.push(item.route as any)}
              >
                <IconLib name={item.icon as any} size={48} color="#FFF" />
                <Text style={styles.gridText}>{item.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* LOGOUT BUTTON */}
        <TouchableOpacity 
          style={styles.logoutBtn} 
          onPress={async () => {
            await signOut();
            router.replace('/(auth)/welcome');
          }}
        >
           <MaterialCommunityIcons name="logout" size={24} color={COLORS.primary} />
           <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        
        <View style={{height: 100}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 44,
  },
  backBtn: {
    marginLeft: -10, // Giúp icon căn lề sát bên trái hơn
    padding: 10,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  largeTitle: {
    fontSize: 34,
    fontWeight: "900",
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  userInfoSection: {
    alignItems: "center",
    marginTop: 25,
    marginBottom: 35,
  },
  avatarContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: COLORS.primary,
    padding: 4, 
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 70,
  },
  editIconContainer: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: COLORS.primary,
    padding: 5,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  userName: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  userPhone: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 5,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 25,
  },
  gridItem: {
    width: "46%", 
    aspectRatio: 1, 
    backgroundColor: COLORS.primary,
    borderRadius: 22, 
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
  },
  gridText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 12,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryLight,
    marginHorizontal: 25,
    marginTop: 10,
    height: 60,
    borderRadius: 20,
  },
  logoutText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '800',
    marginLeft: 10,
  }
});