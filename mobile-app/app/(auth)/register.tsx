import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#000" />
          </TouchableOpacity>

          <Text style={styles.welcomeText}>Welcome to La bouffe</Text>

          <View style={styles.dotsContainer}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

          <Text style={styles.title}>Create an account</Text>
          <Text style={styles.subtitle}>Please fill in your accurate information</Text>
        </View>

        {/* FORM */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Feather name="user" size={20} color="#FF7A50" style={styles.inputIcon} />
            <TextInput placeholder="First name" style={styles.input} placeholderTextColor="#AFAFAF" />
          </View>

          <View style={styles.inputContainer}>
            <Feather name="user" size={20} color="#FF7A50" style={styles.inputIcon} />
            <TextInput placeholder="Last name" style={styles.input} placeholderTextColor="#AFAFAF" />
          </View>

          <View style={styles.inputContainer}>
            <Feather name="phone" size={20} color="#FF7A50" style={styles.inputIcon} />
            <TextInput placeholder="Phone number" style={styles.input} keyboardType="phone-pad" placeholderTextColor="#AFAFAF" />
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="email-outline" size={20} color="#FF7A50" style={styles.inputIcon} />
            <TextInput placeholder="Email" style={styles.input} keyboardType="email-address" placeholderTextColor="#AFAFAF" />
          </View>

          <View style={styles.inputContainer}>
            <Feather name="lock" size={20} color="#FF7A50" style={styles.inputIcon} />
            <TextInput 
              placeholder="Choose password" 
              style={styles.input} 
              secureTextEntry={!showPassword} 
              placeholderTextColor="#AFAFAF"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.showText}>{showPassword ? "Hide" : "Show"}</Text>
            </TouchableOpacity>
          </View>

          {/* CHECKBOX SECTION */}
          <TouchableOpacity style={styles.checkboxRow} onPress={() => setAgree(!agree)}>
            <MaterialCommunityIcons 
              name={agree ? "checkbox-marked" : "checkbox-blank-outline"} 
              size={24} 
              color={agree ? "#FF6332" : "#AFAFAF"} 
            />
            <Text style={styles.checkboxText}>Yes, I want to receive offers and discounts</Text>
          </TouchableOpacity>

          {/* SUBMIT BUTTON */}
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Create account</Text>
          </TouchableOpacity>

          {/* FOOTER TEXT */}
          <Text style={styles.footerText}>
            By Creating an account you agree to the <Text style={styles.linkText}>privacy policy</Text> and to the <Text style={styles.linkText}>terms of use</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 20,
  },
  backButton: {
    alignSelf: "flex-start",
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
    marginBottom: 10,
  },
  dotsContainer: {
    flexDirection: "row",
    marginBottom: 30,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#FF6332",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
    marginBottom: 30,
  },
  form: {
    paddingHorizontal: 25,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 60,
    marginBottom: 18,
    // Shadow cho iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    // Shadow cho Android
    elevation: 3,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  showText: {
    color: "#DDD",
    fontWeight: "600",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  checkboxText: {
    marginLeft: 10,
    color: "#555",
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: "#FF6332",
    height: 60,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
  footerText: {
    textAlign: "center",
    fontSize: 13,
    color: "#AAA",
    lineHeight: 20,
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  linkText: {
    color: "#FFBDAD",
  },
});