import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
} from "react-native";
import { router } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";

const COLORS = {
  primary: '#FF6332',
  bg: '#FFFFFF',
  textMain: '#333333',
  textSub: '#888888',
  inputBg: '#FFF',
  iconColor: '#FF6332'
};

export default function NewPassword() {
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);

  const handleSave = () => {
    // Mock save logic
    setSuccessModalVisible(true);
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

          <Text style={styles.title}>Create New Password</Text>
          <Text style={styles.subtitle}>Create a new secure password</Text>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
          
          <View style={styles.inputContainer}>
            <Feather name="lock" size={20} color={COLORS.iconColor} style={styles.inputIcon} />
            <TextInput 
              placeholder="New password" 
              style={styles.input} 
              secureTextEntry={!showPassword1} 
              placeholderTextColor="#AFAFAF"
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword1(!showPassword1)}>
              <Text style={styles.showText}>{showPassword1 ? "Hide" : "Show"}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Feather name="lock" size={20} color={COLORS.iconColor} style={styles.inputIcon} />
            <TextInput 
              placeholder="Confirm New Password" 
              style={styles.input} 
              secureTextEntry={!showPassword2} 
              placeholderTextColor="#AFAFAF"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword2(!showPassword2)}>
              <Text style={styles.showText}>{showPassword2 ? "Hide" : "Show"}</Text>
            </TouchableOpacity>
          </View>

          {/* Proceed Button */}
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSave} 
          >
             <Text style={styles.submitButtonText}>Change Password</Text>
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

            <Text style={styles.modalText}>Password Changed Successfully</Text>

            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={() => {
                setSuccessModalVisible(false);
                router.replace("/(auth)/login");
              }}
            >
              <Text style={styles.modalButtonText}>Log In</Text>
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
    marginBottom: 20,
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
  showText: {
    color: "#CCC",
    fontWeight: "600",
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  submitButtonText: {
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
    paddingHorizontal: 10,
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
