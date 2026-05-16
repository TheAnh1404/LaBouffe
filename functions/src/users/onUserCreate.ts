/**
 * onUserCreate — Auth Trigger
 *
 * Fires when a new user registers via Firebase Auth.
 * Creates a default user profile document in Firestore
 * with the role set to 'customer'.
 *
 * This ensures every user has a profile document, even if they
 * registered via social login (Google, Facebook, Apple).
 */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  const { uid, email, displayName, photoURL, phoneNumber } = user;

  functions.logger.info(`New user created: ${uid} (${email || "no email"})`);

  // Check if profile already exists (created during registration flow)
  const existingDoc = await db.collection("users").doc(uid).get();
  if (existingDoc.exists) {
    functions.logger.info(`Profile already exists for ${uid}, updating role.`);
    // Ensure role field exists
    if (!existingDoc.data()?.role) {
      await db.collection("users").doc(uid).update({
        role: "customer",
      });
    }
    return;
  }

  // Parse display name into first/last
  const nameParts = (displayName || "").split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  // Create default profile document
  const userProfile = {
    uid,
    firstName,
    lastName,
    fullName: displayName || "",
    email: email || "",
    phoneNumber: phoneNumber || "",
    avatarUrl: photoURL || "",
    role: "customer",
    fcmTokens: [],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await db.collection("users").doc(uid).set(userProfile);

  functions.logger.info(`Profile created for user ${uid}`);
});
