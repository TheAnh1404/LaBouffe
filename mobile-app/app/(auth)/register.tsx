import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal
} from "react-native";
import { router } from "expo-router";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { auth, db } from "../../config/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const COLORS = {
  primary: '#FF6332',
  bg: '#FFFFFF',
  textMain: '#333333',
  textSub: '#888888',
  inputBg: '#FFF',
  iconColor: '#FF6332', // Orange icon
};

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(true);
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert("Missing Information", "Please fill in all required fields.");
      return;
    }
    if (!agree) {
      Alert.alert("Terms", "You must agree to the Terms & Conditions.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`.trim()
      });

      // Save additional user data to firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`.trim(),
        email,
        createdAt: new Date()
      });

      // Sign out so they have to login manually as per workflow
      await auth.signOut();
      
      // Show custom success modal
      setSuccessModalVisible(true);
    } catch (error: any) {
      console.log("Firebase Register Error:", error);
      let errorMessage = error.message || "An error occurred during registration. Please try again.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "That email address is already in use!";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "That email address is invalid!";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "The password is too weak. Please use at least 6 characters.";
      } else if (error.code?.includes("permission-denied")) {
        errorMessage = "Firestore permission denied! Please set Firestore Rules to Test Mode.";
      }
      Alert.alert("Registration Failed", errorMessage);
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
        <Text style={styles.topWelcomeText}>Welcome to La bouffe</Text>
        <View style={{ width: 28 }} /> {/* Placeholder to balance title */}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Title Section */}
        <View style={styles.header}>
          <View style={styles.dotsContainer}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

          <Text style={styles.title}>Create an account</Text>
          <Text style={styles.subtitle}>Please fill in your details to continue</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Feather name="user" size={20} color={COLORS.iconColor} style={styles.inputIcon} />
            <TextInput 
              placeholder="First name" 
              style={styles.input} 
              placeholderTextColor="#AFAFAF" 
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Feather name="user" size={20} color={COLORS.iconColor} style={styles.inputIcon} />
            <TextInput 
              placeholder="Last name" 
              style={styles.input} 
              placeholderTextColor="#AFAFAF" 
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="email-outline" size={20} color={COLORS.iconColor} style={styles.inputIcon} />
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
            <Feather name="lock" size={20} color={COLORS.iconColor} style={styles.inputIcon} />
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

          {/* Checkbox Section */}
          <TouchableOpacity style={styles.checkboxRow} onPress={() => setAgree(!agree)}>
            <MaterialCommunityIcons 
              name={agree ? "checkbox-marked" : "checkbox-blank-outline"} 
              size={24} 
              color={agree ? COLORS.primary : "#AFAFAF"} 
            />
            <Text style={styles.checkboxText}>Yes, I agree to Terms & Conditions</Text>
          </TouchableOpacity>

          {/* Submit Button */}
          <TouchableOpacity 
            style={[styles.submitButton, loading && { opacity: 0.7 }]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.submitButtonText}>Create account</Text>
            )}
          </TouchableOpacity>

          {/* Footer Text */}
          <Text style={styles.footerText}>
            By creating an account you agree to the <Text style={styles.linkText}>Terms of use</Text> and <Text style={styles.linkText}>Privacy policy</Text>
          </Text>
        </View>
      </ScrollView>

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

            <Text style={styles.modalText}>Account Created Successfully</Text>

            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={() => {
                setSuccessModalVisible(false);
                router.replace("/(auth)/login");
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
    marginBottom: 35,
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
    marginBottom: 18,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    // Shadow for Android
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
  showText: {
    color: "#CCC",
    fontWeight: "600",
    fontSize: 14,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 25,
  },
  checkboxText: {
    marginLeft: 10,
    color: COLORS.textMain,
    fontSize: 13,
    fontWeight: '500'
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerText: {
    textAlign: "center",
    fontSize: 12,
    color: COLORS.textSub,
    lineHeight: 20,
    paddingHorizontal: 15,
  },
  linkText: {
    color: COLORS.primary,
    fontWeight: '500'
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dim background
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