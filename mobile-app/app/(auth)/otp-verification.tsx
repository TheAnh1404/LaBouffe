import React, { useState, useRef } from "react";
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
};

export default function OTPVerification() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  
  // Refs for the 4 inputs
  const inputRefs = [useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null)];

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto focus next input
    if (text.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = () => {
    // Mock Verify
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
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
          </View>

          <Text style={styles.title}>Enter your OTP</Text>
          <Text style={styles.subtitle}>Please enter the OTP sent to you</Text>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
          
          <View style={styles.otpRow}>
             {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={inputRefs[index]}
                  style={styles.otpInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                />
             ))}
          </View>

          {/* Verify Button */}
          <TouchableOpacity 
            style={styles.verifyButton}
            onPress={handleVerify} 
          >
             <Text style={styles.verifyButtonText}>Verify</Text>
          </TouchableOpacity>
          
          <Text style={styles.resendText}>Didn't receive the OTP? <Text style={{color: COLORS.primary}}>Resend OTP</Text></Text> 
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

            <Text style={styles.modalText}>Your Verification is Successful</Text>

            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={() => {
                setSuccessModalVisible(false);
                router.replace("/(auth)/new-password");
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
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 40,
  },
  otpInput: {
    width: 65,
    height: 65,
    backgroundColor: '#F9F9F9',
    borderRadius: 15,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textMain,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#EEEEEE'
  },
  verifyButton: {
    backgroundColor: COLORS.primary,
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  verifyButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  resendText: {
    textAlign: 'center',
    marginTop: 10,
    color: COLORS.textSub,
    fontSize: 13,
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
    paddingHorizontal: 20,
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
