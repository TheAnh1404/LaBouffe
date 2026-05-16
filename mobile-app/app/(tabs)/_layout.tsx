import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 5,
          backgroundColor: COLORS.white,
          borderTopWidth: 0,
          elevation: 10, // Android shadow
        },

        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,

        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      {/* Ẩn index.tsx (WelcomeScreen) vì user đã authenticated rồi */}
      <Tabs.Screen
        name="index"
        options={{
          href: null, // Ẩn khỏi tab bar
        }}
      />

      {/* HOME - Tab chính */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />

      {/* MENU */}
      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          tabBarIcon: ({ color }) => (
            <Ionicons name="fast-food" size={22} color={color} />
          ),
        }}
      />

      {/* CART */}
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color }) => (
            <Ionicons name="cart" size={22} color={color} />
          ),
        }}
      />

      {/* RESTAURANTS */}
      <Tabs.Screen
        name="restaurants"
        options={{
          title: "Restaurants",
          tabBarIcon: ({ color }) => (
            <Ionicons name="restaurant" size={22} color={color} />
          ),
        }}
      />

      {/* PROFILE */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}