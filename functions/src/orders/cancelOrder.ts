/**
 * cancelOrder — Callable Cloud Function
 *
 * Allows a user to cancel their own order, but ONLY if the order
 * status is still "placed" (not yet confirmed by restaurant).
 *
 * Security:
 * - Requires authenticated user
 * - User must be the owner of the order
 * - Only "placed" status orders can be cancelled
 *
 * The status change to "cancelled" will trigger onOrderStatusChange,
 * which automatically sends a push notification to the user.
 */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

interface CancelOrderData {
  orderId: string;
  reason?: string;
}

export const cancelOrder = functions.https.onCall(
  async (data: CancelOrderData, context: functions.https.CallableContext) => {
    // ─── 1. Authentication Check ─────────────────────────────────
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "You must be logged in to cancel an order."
      );
    }

    const userId = context.auth.uid;
    const { orderId, reason } = data;

    // ─── 2. Input Validation ─────────────────────────────────────
    if (!orderId || typeof orderId !== "string") {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "A valid order ID is required."
      );
    }

    // ─── 3. Fetch Order & Verify Ownership ───────────────────────
    const orderRef = db.collection("orders").doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      throw new functions.https.HttpsError(
        "not-found",
        "Order not found."
      );
    }

    const orderData = orderDoc.data()!;

    // Verify the user owns this order
    if (orderData.userId !== userId) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "You can only cancel your own orders."
      );
    }

    // ─── 4. Status Check ─────────────────────────────────────────
    // Only orders with status "placed" can be cancelled
    // Once confirmed/preparing/delivering, cancellation is not allowed
    if (orderData.status !== "placed") {
      const statusMessages: Record<string, string> = {
        confirmed: "This order has already been confirmed by the restaurant.",
        preparing: "This order is already being prepared.",
        delivering: "This order is already out for delivery.",
        delivered: "This order has already been delivered.",
        cancelled: "This order has already been cancelled.",
      };

      const message = statusMessages[orderData.status] ||
        `Cannot cancel order with status "${orderData.status}".`;

      throw new functions.https.HttpsError(
        "failed-precondition",
        message
      );
    }

    // ─── 5. Cancel the Order ─────────────────────────────────────
    await orderRef.update({
      status: "cancelled",
      cancellationReason: reason || "Cancelled by customer",
      cancelledAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    functions.logger.info(
      `Order ${orderId} cancelled by user ${userId}. Reason: ${reason || "No reason provided"}`
    );

    // The onOrderStatusChange trigger will automatically
    // send a push notification about the cancellation.

    return {
      success: true,
      message: "Order cancelled successfully.",
    };
  }
);
