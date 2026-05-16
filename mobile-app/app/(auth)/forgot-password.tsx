/**
 * Forgot Password Screen
 *
 * Production-grade password reset flow using Firebase Auth.
 *
 * HOW IT WORKS:
 * 1. User enters their email address
 * 2. Firebase sends a password reset link to their email
 * 3. User opens the link → resets password on Firebase's secure page
 * 4. User returns to app → logs in with new password
 *
 * WHY NO OTP SCREEN:
 * Firebase Auth handles password reset via a secure email link.
 * Custom OTP flows would require a separate backend service
 * and introduce security risks. Firebase's approach is industry-standard
 * (used by Google, Uber, Airbnb, etc.)
 *
 * SECURITY NOTES:
 * - We show "Instructions sent" even for non-existent emails
 *   to prevent user enumeration attacks.
 * - Rate limiting is handled by Firebase automatically.
 * - Cooldown timer prevents spam-clicking the send button.
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
} from "react-native";
import { router } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { auth } from "../../config/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { COLORS, RADIUS } from "../../constants/theme";

type ScreenState = "input" | "sent";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [screenState, setScreenState] = useState<ScreenState>("input");
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Animation for the success state
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));

  // ─── Cooldown Timer ──────────────────────────────────────────────
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // ─── Animate success state ───────────────────────────────────────
  const animateSuccess = useCallback(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  // ─── Email Validation ────────────────────────────────────────────
  const isValidEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value.trim());
  };

  // ─── Send Reset Email ────────────────────────────────────────────
  const handleSendResetEmail = async () => {
    const cleanEmail = email.trim();
    setError(null);

    // Client-side validation
    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, cleanEmail);

      // SECURITY: Always show success, even if email doesn't exist.
      // This prevents user enumeration attacks where attackers
      // can discover which emails are registered.
      setScreenState("sent");
      setCooldown(60); // 60 second cooldown before allowing resend
      animateSuccess();
    } catch (err: any) {
      console.log("Firebase Reset Password Error:", err);

      // Handle specific Firebase errors
      switch (err.code) {
        case "auth/too-many-requests":
          setError("Too many attempts. Please wait a few minutes and try again.");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        case "auth/user-not-found":
          // SECURITY: Don't reveal that the user doesn't exist!
          // Show the same success screen to prevent enumeration.
          setScreenState("sent");
          setCooldown(60);
          animateSuccess();
          break;
        default:
          setError("Something went wrong. Please try again.");
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── Resend Email ────────────────────────────────────────────────
  const handleResend = async () => {
    if (cooldown > 0) return;
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setCooldown(60);
    } catch (err: any) {
      if (err.code === "auth/too-many-requests") {
        setError("Too many attempts. Please wait a few minutes.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── Masked Email Display ────────────────────────────────────────
  const getMaskedEmail = (): string => {
    const clean = email.trim();
    const [localPart, domain] = clean.split("@");
    if (!localPart || !domain) return clean;

    const visible = localPart.length <= 3
      ? localPart[0] + "***"
      : localPart.substring(0, 3) + "***";

    return `${visible}@${domain}`;
  };

  // ═══════════════════════════════════════════════════════════════════
  // RENDER: Input State — User enters their email
  // ═══════════════════════════════════════════════════════════════════
  if (screenState === "input") {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          {/* Header */}
          <View style={styles.topRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={28} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Icon */}
            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="lock-reset" size={40} color={COLORS.primary} />
              </View>
            </View>

            {/* Title */}
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Enter the email associated with your account and we'll send you a link to reset your password.
            </Text>

            {/* Email Input */}
            <View style={styles.form}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={[styles.inputContainer, error ? styles.inputError : null]}>
                <MaterialCommunityIcons
                  name="email-outline"
                  size={20}
                  color={error ? "#E53935" : COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="your@email.com"
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  placeholderTextColor={COLORS.textMuted}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (error) setError(null); // Clear error on type
                  }}
                  returnKeyType="send"
                  onSubmitEditing={handleSendResetEmail}
                />
                {email.length > 0 && (
                  <TouchableOpacity onPress={() => setEmail("")}>
                    <Ionicons name="close-circle" size={20} color={COLORS.textMuted} />
                  </TouchableOpacity>
                )}
              </View>

              {/* Error Message */}
              {error && (
                <View style={styles.errorRow}>
                  <Ionicons name="alert-circle" size={16} color="#E53935" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* Send Button */}
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (loading || !email.trim()) && styles.sendButtonDisabled,
                ]}
                onPress={handleSendResetEmail}
                disabled={loading || !email.trim()}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <>
                    <MaterialCommunityIcons name="email-fast-outline" size={20} color="#FFF" />
                    <Text style={styles.sendButtonText}>Send Reset Link</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Back to login link */}
            <TouchableOpacity
              style={styles.backToLogin}
              onPress={() => router.replace("/(auth)/login")}
            >
              <Ionicons name="arrow-back" size={16} color={COLORS.primary} />
              <Text style={styles.backToLoginText}>Back to Login</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // RENDER: Sent State — Confirmation & instructions
  // ═══════════════════════════════════════════════════════════════════
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <Animated.View
        style={[
          styles.sentContainer,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Success Icon */}
        <View style={styles.successIconOuter}>
          <View style={styles.successIconInner}>
            <MaterialCommunityIcons name="email-check-outline" size={48} color={COLORS.primary} />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.sentTitle}>Check Your Email</Text>
        <Text style={styles.sentSubtitle}>
          We've sent a password reset link to
        </Text>
        <Text style={styles.sentEmail}>{getMaskedEmail()}</Text>

        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <View style={styles.instructionRow}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepNumber}>1</Text>
            </View>
            <Text style={styles.instructionText}>Open the email we just sent</Text>
          </View>
          <View style={styles.instructionRow}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepNumber}>2</Text>
            </View>
            <Text style={styles.instructionText}>Tap the reset link inside</Text>
          </View>
          <View style={styles.instructionRow}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepNumber}>3</Text>
            </View>
            <Text style={styles.instructionText}>Create your new password</Text>
          </View>
          <View style={[styles.instructionRow, { borderBottomWidth: 0, marginBottom: 0, paddingBottom: 0 }]}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepNumber}>4</Text>
            </View>
            <Text style={styles.instructionText}>Come back here and log in</Text>
          </View>
        </View>

        {/* Resend Button */}
        <TouchableOpacity
          style={[styles.resendButton, cooldown > 0 && styles.resendButtonDisabled]}
          onPress={handleResend}
          disabled={cooldown > 0 || loading}
          activeOpacity={0.7}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.primary} size="small" />
          ) : (
            <Text
              style={[styles.resendText, cooldown > 0 && styles.resendTextDisabled]}
            >
              {cooldown > 0
                ? `Resend in ${cooldown}s`
                : "Didn't receive it? Resend"}
            </Text>
          )}
        </TouchableOpacity>

        {/* Error after resend */}
        {error && (
          <View style={[styles.errorRow, { marginTop: 10 }]}>
            <Ionicons name="alert-circle" size={16} color="#E53935" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Go to Login */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.replace("/(auth)/login")}
          activeOpacity={0.8}
        >
          <Ionicons name="log-in-outline" size={20} color="#FFF" />
          <Text style={styles.loginButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

// ═══════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
    height: 50,
  },
  backButton: {
    padding: 5,
    marginLeft: -5,
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingBottom: 40,
  },

  // ─── Input State ─────────────────────────────────────────────────
  iconContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 25,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 35,
    paddingHorizontal: 10,
  },
  form: {
    width: "100%",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 10,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    paddingHorizontal: 15,
    height: 55,
    marginBottom: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
  },
  inputError: {
    borderColor: "#FFCDD2",
    backgroundColor: "#FFF8F8",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: "500",
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    marginLeft: 4,
  },
  errorText: {
    fontSize: 13,
    color: "#E53935",
    fontWeight: "500",
    marginLeft: 6,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: RADIUS.pill,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
    elevation: 0,
    shadowOpacity: 0,
  },
  sendButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
  backToLogin: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    gap: 6,
  },
  backToLoginText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },

  // ─── Sent State ──────────────────────────────────────────────────
  sentContainer: {
    flex: 1,
    paddingHorizontal: 25,
    alignItems: "center",
  },
  successIconOuter: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 25,
  },
  successIconInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  sentTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 10,
  },
  sentSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  sentEmail: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 30,
    marginTop: 4,
  },

  // ─── Instructions ────────────────────────────────────────────────
  instructionsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: 20,
    width: "100%",
    marginBottom: 25,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  instructionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  stepNumber: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "800",
  },
  instructionText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: "500",
    flex: 1,
  },

  // ─── Resend ──────────────────────────────────────────────────────
  resendButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: RADIUS.md,
    marginBottom: 15,
  },
  resendButtonDisabled: {
    opacity: 0.6,
  },
  resendText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
    textAlign: "center",
  },
  resendTextDisabled: {
    color: COLORS.textSecondary,
  },

  // ─── Login Button ────────────────────────────────────────────────
  loginButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: RADIUS.pill,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  loginButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
});
