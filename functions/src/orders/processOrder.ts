/**
 * processOrder — Callable Cloud Function
 *
 * CRITICAL: This is the ONLY way orders are created.
 * The client sends ONLY { items: [{ foodId, quantity }] }.
 * The server looks up actual prices from Firestore, calculates totals,
 * and creates the order document. This prevents price manipulation.
 *
 * Security: Requires authenticated user (Firebase Auth).
 */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

interface OrderItemRequest {
  foodId: string;
  quantity: number;
}

interface ProcessOrderData {
  items: OrderItemRequest[];
  note?: string;
}

export const processOrder = functions.https.onCall(
  async (data: ProcessOrderData, context: functions.https.CallableContext) => {
    // ─── 1. Authentication Check ─────────────────────────────────
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "You must be logged in to place an order."
      );
    }

    const userId = context.auth.uid;
    const { items, note } = data;

    // ─── 2. Input Validation ─────────────────────────────────────
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Order must contain at least one item."
      );
    }

    // Validate each item
    for (const item of items) {
      if (!item.foodId || typeof item.foodId !== "string") {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "Each item must have a valid foodId."
        );
      }
      if (!item.quantity || typeof item.quantity !== "number" || item.quantity < 1 || item.quantity > 99) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          `Invalid quantity for item ${item.foodId}. Must be between 1 and 99.`
        );
      }
    }

    // ─── 3. Fetch Actual Prices from Database ────────────────────
    const orderItems: Array<{
      foodId: string;
      name: string;
      desc: string;
      price: number;
      imageUrl: string;
      quantity: number;
    }> = [];

    let subtotal = 0;

    for (const item of items) {
      const foodDoc = await db.collection("foods").doc(item.foodId).get();

      if (!foodDoc.exists) {
        throw new functions.https.HttpsError(
          "not-found",
          `Food item "${item.foodId}" not found. It may have been removed from the menu.`
        );
      }

      const foodData = foodDoc.data()!;
      const serverPrice = foodData.price as number;

      if (typeof serverPrice !== "number" || serverPrice <= 0) {
        throw new functions.https.HttpsError(
          "internal",
          `Invalid price for food item "${item.foodId}".`
        );
      }

      orderItems.push({
        foodId: item.foodId,
        name: foodData.name || "Unknown",
        desc: foodData.desc || "",
        price: serverPrice,
        imageUrl: foodData.imageUrl || "",
        quantity: item.quantity,
      });

      subtotal += serverPrice * item.quantity;
    }

    // ─── 4. Calculate Fees (Server-side only) ────────────────────
    const discount = subtotal > 50 ? 5 : 0; // AED 5 discount for orders over AED 50
    const deliveryFee = 2.0;
    const serviceFee = 1.5;
    const totalAmount = subtotal - discount + deliveryFee + serviceFee;

    // ─── 5. Create Order Document ────────────────────────────────
    const orderData = {
      userId,
      items: orderItems,
      subtotal: Math.round(subtotal * 100) / 100,
      discount: Math.round(discount * 100) / 100,
      deliveryFee,
      serviceFee,
      totalAmount: Math.round(totalAmount * 100) / 100,
      status: "placed",
      note: note || "",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const orderRef = await db.collection("orders").add(orderData);

    functions.logger.info(`Order ${orderRef.id} created for user ${userId}. Total: AED ${totalAmount.toFixed(2)}`);

    // ─── 6. Return Response ──────────────────────────────────────
    return {
      success: true,
      orderId: orderRef.id,
      totalAmount: orderData.totalAmount,
      message: "Order placed successfully!",
    };
  }
);
