/**
 * LaBouffe — Push Notification Service
 *
 * Handles FCM token registration, permission requests,
 * and notification handling for order updates.
 */

import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../config/firebase";

// ─── Configure Notification Behavior ─────────────────────────────
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Request notification permissions and get the Expo push token.
 * Saves the FCM token to the user's Firestore document.
 */
export async function registerForPushNotifications(userId: string): Promise<string | null> {
  try {
    // 1. Request permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Push notification permission denied");
      return null;
    }

    // 2. Get the token
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: undefined, // Uses the project ID from app.json
    });

    const token = tokenData.data;
    console.log("FCM Token:", token);

    // 3. Save token to Firestore
    await updateDoc(doc(db, "users", userId), {
      fcmTokens: arrayUnion(token),
    });

    // 4. Set up Android notification channel
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("orders", {
        name: "Order Updates",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF6332",
        sound: "default",
      });
    }

    return token;
  } catch (error) {
    console.error("Error registering for push notifications:", error);
    return null;
  }
}

/**
 * Unregister push notifications when user logs out.
 * Removes the FCM token from the user's Firestore document.
 */
export async function unregisterPushNotifications(
  userId: string,
  token: string | null
): Promise<void> {
  if (!token) return;

  try {
    await updateDoc(doc(db, "users", userId), {
      fcmTokens: arrayRemove(token),
    });
    console.log("FCM token removed for user:", userId);
  } catch (error) {
    console.error("Error unregistering push notifications:", error);
  }
}

/**
 * Add a listener for incoming notifications.
 * Returns a cleanup function.
 */
export function addNotificationListener(
  callback: (notification: Notifications.Notification) => void
): () => void {
  const subscription = Notifications.addNotificationReceivedListener(callback);
  return () => subscription.remove();
}

/**
 * Add a listener for when user taps on a notification.
 * Returns a cleanup function.
 */
export function addNotificationResponseListener(
  callback: (response: Notifications.NotificationResponse) => void
): () => void {
  const subscription = Notifications.addNotificationResponseReceivedListener(callback);
  return () => subscription.remove();
}
