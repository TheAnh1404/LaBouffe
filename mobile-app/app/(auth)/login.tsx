import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import SuccessModal from "../../components/SuccessModal";
import { router } from "expo-router";
import { Ionicons, Feather, FontAwesome, AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { auth } from "../../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

import { COLORS } from "../../constants/theme";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);

  const handleLogin = async () => {
    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ Email và Mật khẩu.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, cleanEmail, password);
      setSuccessModalVisible(true);
    } catch (error: any) {
      console.log("Firebase Login Error:", error);
      let errorMessage = error.message || "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.";
      
      if (
        error.code === 'auth/user-not-found' || 
        error.code === 'auth/invalid-credential' || 
        error.code === 'auth/wrong-password'
      ) {
        errorMessage = "Sai mật khẩu hoặc địa chỉ email!";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Định dạng Email không hợp lệ!";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Bạn đã thử quá nhiều lần. Vui lòng thử lại sau.";
      }
      Alert.alert("Đăng nhập thất bại", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header Row with Back Button */}
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.topWelcomeText}>Welcome to La bouffe</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}>
        {/* Title Section */}
        <View style={styles.header}>
          <View style={styles.dotsContainer}>
            <View style={styles.dot} />
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
          </View>

          <Text style={styles.title}>Welcome Back !</Text>
          <Text style={styles.subtitle}>Please log in to your account</Text>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="email-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
            <TextInput 
              placeholder="Email" 
              style={styles.input} 
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={COLORS.textMuted} 
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputContainer}>
            <Feather name="lock" size={20} color={COLORS.primary} style={styles.inputIcon} />
            <TextInput
              placeholder="Password"
              style={styles.input}
              secureTextEntry={!showPassword}
              placeholderTextColor={COLORS.textMuted}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.showText}>{showPassword ? "Hide" : "Show"}</Text>
            </TouchableOpacity>
          </View>

          {/* Forgot Password Link */}
          <TouchableOpacity 
            style={styles.forgotContainer}
            onPress={() => router.push('/(auth)/forgot-password')}
          >
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          {/* Log in Button */}
          <TouchableOpacity 
            style={[styles.loginButton, loading && { opacity: 0.7 }]}
            onPress={handleLogin} 
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.loginButtonText}>Log In</Text>
            )}
          </TouchableOpacity>

          {/* Connect With Section */}
          <View style={styles.socialSection}>
            <View style={styles.dividerContainer}>
              <View style={styles.line} />
              <Text style={styles.connectText}>Connect with</Text>
              <View style={styles.line} />
            </View>

            <View style={styles.socialIcons}>
              <TouchableOpacity style={styles.iconCircle}>
                <Ionicons name="logo-facebook" size={30} color="#1877F2" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconCircle}>
                <Ionicons name="logo-apple" size={30} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconCircle}>
                <Ionicons name="logo-google" size={30} color="#DB4437" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Bottom register link (Like screen 9) */}
        <View style={styles.bottomRegister}>
          <View style={styles.bottomRegisterRow}>
             <Text style={styles.bottomRegisterText}>Don't have an account? </Text>
             <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                 <Text style={styles.bottomRegisterLink}>Create an account</Text>
             </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <SuccessModal
        visible={isSuccessModalVisible}
        message="Login Successful"
        onPress={() => {
          setSuccessModalVisible(false);
          router.replace("/(tabs)/home");
        }}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
    height: 50,
  },
  backButton: {
    padding: 5,
    marginLeft: -5,
  },
  topWelcomeText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textPrimary,
  },
  header: {
    alignItems: "center",
    marginTop: 15,
  },
  dotsContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.dotInactive,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
    marginBottom: 40,
  },
  form: {
    paddingHorizontal: 25,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 55,
    marginBottom: 15,
    // Shadow cho iOS & Android
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  inputIcon: {
    marginRight: 15,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  showText: {
    color: COLORS.disabled,
    fontWeight: "600",
    fontSize: 14,
  },
  forgotContainer: {
    alignSelf: 'flex-end',
    marginBottom: 25,
    marginRight: 5,
  },
  forgotText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  socialSection: {
    alignItems: 'center',
    width: "100%",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: '80%',
    alignSelf: 'center',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.borderMedium,
  },
  connectText: {
    marginHorizontal: 15,
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '500',
  },
  socialIcons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 35,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomRegister: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 50,
  },
  bottomRegisterRow: {
    flexDirection: 'row',
  },
  bottomRegisterText: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  bottomRegisterLink: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 13,
  },
});