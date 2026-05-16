/**
 * OTP Verification Screen — DEPRECATED
 *
 * This screen has been removed from the password reset flow.
 *
 * Firebase Auth uses a secure email link for password resets,
 * which is the industry-standard approach. Custom OTP flows
 * would require a separate backend service and introduce security risks.
 *
 * This file redirects to the forgot-password screen if accessed directly.
 */

import { useEffect } from "react";
import { router } from "expo-router";

export default function OTPVerification() {
  useEffect(() => {
    // Redirect to the proper forgot password flow
    router.replace("/(auth)/forgot-password");
  }, []);

  return null;
}
