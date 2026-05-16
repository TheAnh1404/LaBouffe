/**
 * onOrderStatusChange — Firestore Trigger
 *
 * Fires whenever an order document is updated.
 * When the `status` field changes, sends a push notification
 * to the user's registered FCM tokens.
 */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

const STATUS_MESSAGES: Record<string, string> = {
  confirmed: "Your order has been confirmed! 🎉",
  preparing: "Your order is being prepared by the restaurant 👨‍🍳",
  delivering: "Your order is on the way! 🚗",
  delivered: "Your order has been delivered! Enjoy your meal 😋",
  cancelled: "Your order has been cancelled ❌",
};

export const onOrderStatusChange = functions.firestore
  .document("orders/{orderId}")
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    // Only trigger if status actually changed
    if (before.status === after.status) {
      return null;
    }

    const newStatus = after.status as string;
    const userId = after.userId as string;
    const orderId = context.params.orderId;

    functions.logger.info(
      `Order ${orderId} status changed: ${before.status} → ${newStatus}`
    );

    // Update the updatedAt timestamp
    await change.after.ref.update({
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Get user's FCM tokens
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      functions.logger.warn(`User ${userId} not found, skipping notification.`);
      return null;
    }

    const userData = userDoc.data()!;
    const fcmTokens: string[] = userData.fcmTokens || [];

    if (fcmTokens.length === 0) {
      functions.logger.info(`No FCM tokens for user ${userId}, skipping notification.`);
      return null;
    }

    // Build notification message
    const message = STATUS_MESSAGES[newStatus] || `Order status updated to: ${newStatus}`;

    const notification: admin.messaging.MulticastMessage = {
      tokens: fcmTokens,
      notification: {
        title: "LaBouffe — Order Update",
        body: message,
      },
      data: {
        orderId,
        status: newStatus,
        type: "order_status",
      },
      android: {
        priority: "high",
        notification: {
          sound: "default",
          channelId: "orders",
        },
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
            badge: 1,
          },
        },
      },
    };

    try {
      const response = await admin.messaging().sendEachForMulticast(notification);
      functions.logger.info(
        `Notifications sent: ${response.successCount} success, ${response.failureCount} failures`
      );

      // Clean up invalid tokens
      const tokensToRemove: string[] = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          const errorCode = resp.error?.code;
          if (
            errorCode === "messaging/invalid-registration-token" ||
            errorCode === "messaging/registration-token-not-registered"
          ) {
            tokensToRemove.push(fcmTokens[idx]);
          }
        }
      });

      if (tokensToRemove.length > 0) {
        await db.collection("users").doc(userId).update({
          fcmTokens: admin.firestore.FieldValue.arrayRemove(...tokensToRemove),
        });
        functions.logger.info(`Removed ${tokensToRemove.length} invalid FCM tokens.`);
      }
    } catch (error) {
      functions.logger.error("Error sending notifications:", error);
    }

    return null;
  });
