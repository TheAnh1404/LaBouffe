import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Alert,
  ActivityIndicator
} from "react-native";
import { router } from "expo-router";
import { Ionicons, Feather, FontAwesome, AntDesign } from "@expo/vector-icons";
import { auth } from "../../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const { width } = Dimensions.get("window");

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Information", "Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Chuyển hướng vào app chính
      router.replace("/(tabs)");
    } catch (error: any) {
      let errorMessage = "An error occurred during login. Please try again.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        errorMessage = "Invalid email or password!";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "That email address is invalid!";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many attempts. Please try again later.";
      }
      Alert.alert("Login Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER SECTION */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>

        <View style={styles.dotsContainer}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
        </View>

        <Text style={styles.title}>Welcome Back !</Text>
        <Text style={styles.subtitle}>Please log in to your account</Text>
      </View>

      {/* FORM SECTION */}
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Feather name="mail" size={20} color="#FF7A50" style={styles.inputIcon} />
          <TextInput 
            placeholder="Email" 
            style={styles.input} 
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#AFAFAF" 
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Feather name="lock" size={20} color="#FF7A50" style={styles.inputIcon} />
          <TextInput
            placeholder="Choose password"
            style={styles.input}
            secureTextEntry={!showPassword}
            placeholderTextColor="#AFAFAF"
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.showText}>{showPassword ? "Hide" : "Show"}</Text>
          </TouchableOpacity>
        </View>

        {/* LOG IN BUTTON */}
        <TouchableOpacity 
          style={[styles.loginButton, loading && { opacity: 0.7 }]}
          onPress={handleLogin} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.loginButtonText}>Log in</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.forgotButton}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>
      </View>

      {/* SOCIAL SECTION */}
      <View style={styles.socialSection}>
        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.connectText}>Connect with</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.socialIcons}>
          <TouchableOpacity style={styles.iconCircle}>
            <FontAwesome name="facebook" size={30} color="#1877F2" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconCircle}>
            <FontAwesome name="apple" size={30} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconCircle}>
            <AntDesign name="google" size={30} color="#DB4437" />
          </TouchableOpacity>
        </View>
      </View>
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
  dotsContainer: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 20,
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
    fontSize: 30,
    fontWeight: "800",
    color: "#333",
  },
  subtitle: {
    fontSize: 15,
    color: "#888",
    marginTop: 5,
    marginBottom: 40,
  },
  form: {
    paddingHorizontal: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 65,
    marginBottom: 20,
    // Shadow cho iOS & Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
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
    color: "#D0D0D0",
    fontWeight: "600",
  },
  loginButton: {
    backgroundColor: "#FF6332",
    height: 60,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  loginButtonText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "700",
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginTop: 15,
  },
  forgotText: {
    color: "#AFAFAF",
    fontSize: 14,
    fontWeight: "600",
  },
  socialSection: {
    position: "absolute",
    bottom: 50,
    width: "100%",
    paddingHorizontal: 30,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#EEEEEE",
  },
  connectText: {
    marginHorizontal: 15,
    color: "#888",
    fontSize: 15,
  },
  socialIcons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 40,
  },
  iconCircle: {
    padding: 5,
  },
});