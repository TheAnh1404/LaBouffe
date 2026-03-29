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
  Modal
} from "react-native";
import { router } from "expo-router";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { auth } from "../../config/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

const COLORS = {
  primary: '#FF6332',
  bg: '#FFFFFF',
  textMain: '#333333',
  textSub: '#888888',
  inputBg: '#FFF',
  iconColor: '#FF6332',
};

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);

  const handleResetPassword = async () => {
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      Alert.alert("Missing Information", "Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      // Hiển thị Custom Modal cực xịn thay vì Alert mặc định
      setSuccessModalVisible(true);
    } catch (error: any) {
      console.log("Firebase Reset Password Error:", error);
      let errorMessage = error.message || "An error occurred. Please try again.";
      if (error.code === 'auth/user-not-found') {
        errorMessage = "User not found with this email.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "That email address is invalid.";
      }
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header Row with Back Button */}
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.topWelcomeText}></Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        {/* Title Section */}
        <View style={styles.header}>
          <View style={styles.dotsContainer}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={[styles.dot, styles.activeDot]} />
          </View>

          <Text style={styles.title}>Forgotten Password</Text>
          <Text style={styles.subtitle}>Please enter your email to receive a link</Text>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="email-outline" size={20} color={COLORS.iconColor} style={styles.inputIcon} />
            <TextInput 
              placeholder="Email address" 
              style={styles.input} 
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#AFAFAF" 
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Reset Button */}
          <TouchableOpacity 
            style={[styles.resetButton, loading && { opacity: 0.7 }]}
            onPress={handleResetPassword} 
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.resetButtonText}>Send Reset Link</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* SUCCESS MODAL */}
      <Modal
        visible={isSuccessModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            
            {/* Circle Checkmark Icon */}
            <View style={styles.modalIconContainer}>
               <View style={styles.modalIconRing}>
                  <Feather name="check" size={40} color={COLORS.primary} />
               </View>
            </View>

            <Text style={styles.modalText}>Reset Link Sent Successfully</Text>

            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={() => {
                setSuccessModalVisible(false);
                router.replace("/(auth)/otp-verification");
              }}
            >
              <Text style={styles.modalButtonText}>Proceed</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
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
    color: COLORS.textMain,
  },
  content: {
    flex: 1,
    paddingTop: 15,
  },
  header: {
    alignItems: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.textMain,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSub,
    marginTop: 8,
    marginBottom: 40,
  },
  form: {
    paddingHorizontal: 25,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.inputBg,
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 55,
    marginBottom: 35,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F9F9F9',
  },
  inputIcon: {
    marginRight: 15,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textMain,
    fontWeight: '500',
  },
  resetButton: {
    backgroundColor: COLORS.primary,
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  resetButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#FFF',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  modalIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFEBE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  modalIconRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textMain,
    marginBottom: 35,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: COLORS.primary,
    width: '100%',
    height: 55,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
