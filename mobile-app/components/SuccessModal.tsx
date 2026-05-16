import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";

type SuccessModalProps = {
  visible: boolean;
  message: string;
  buttonText?: string;
  onPress: () => void;
};

export default function SuccessModal({
  visible,
  message,
  buttonText = "Proceed",
  onPress,
}: SuccessModalProps) {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContent}>
          {/* Circle Checkmark Icon */}
          <View style={styles.modalIconContainer}>
            <View style={styles.modalIconRing}>
              <Feather name="check" size={40} color={COLORS.primary} />
            </View>
          </View>

          <Text style={styles.modalText}>{message}</Text>

          <TouchableOpacity style={styles.modalButton} onPress={onPress}>
            <Text style={styles.modalButtonText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: COLORS.white,
    borderRadius: 30,
    padding: 30,
    alignItems: "center",
    elevation: 10,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  modalIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },
  modalIconRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    borderColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 35,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: COLORS.primary,
    width: "100%",
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  modalButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});
