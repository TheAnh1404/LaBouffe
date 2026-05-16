/**
 * New Password Screen — DEPRECATED
 *
 * This screen has been removed from the password reset flow.
 *
 * Firebase Auth handles the "create new password" step via a secure
 * web page that the user accesses through the email reset link.
 * The app does NOT need to handle this step — Firebase does it securely.
 *
 * This file redirects to the login screen if accessed directly.
 */

import { useEffect } from "react";
import { router } from "expo-router";

export default function NewPassword() {
  useEffect(() => {
    // Redirect to login — password is reset via Firebase's secure page
    router.replace("/(auth)/login");
  }, []);

  return null;
}
