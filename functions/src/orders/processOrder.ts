/**
 * processOrder — Callable Cloud Function
 *
 * CRITICAL: This is the ONLY way orders are created.
 * The client sends ONLY { items: [{ foodId, quantity }], note?, idempotencyKey }.
 * The server looks up actual prices from Firestore, calculates totals,
 * and creates the order document. This prevents price manipulation.
 *
 * Security: Requires authenticated user (Firebase Auth).
 *
 * Upgrades (v2):
 * - Idempotency key prevents duplicate orders from double-tap
 * - Batch read (getAll) replaces N+1 individual queries
 * - Order size limits enforced (max 20 items, max 200 total qty)
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
  /** Client-generated UUID to prevent duplicate orders */
  idempotencyKey?: string;
}

// ─── Constants ─────────────────────────────────────────────
const MAX_ITEMS_PER_ORDER = 20;
const MAX_TOTAL_QUANTITY = 200;
const DISCOUNT_THRESHOLD = 50; // AED
const DISCOUNT_AMOUNT = 5;     // AED
const DELIVERY_FEE = 2.0;      // AED
const SERVICE_FEE = 1.5;       // AED

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
    const { items, note, idempotencyKey } = data;

    // ─── 2. Idempotency Check ────────────────────────────────────
    // If client sends an idempotencyKey, check if an order with this key
    // already exists. If so, return the existing order instead of creating a duplicate.
    if (idempotencyKey && typeof idempotencyKey === "string") {
      const existingOrders = await db
        .collection("orders")
        .where("userId", "==", userId)
        .where("idempotencyKey", "==", idempotencyKey)
        .limit(1)
        .get();

      if (!existingOrders.empty) {
        const existingOrder = existingOrders.docs[0];
        const existingData = existingOrder.data();
        functions.logger.info(
          `Idempotent request: Order ${existingOrder.id} already exists for key ${idempotencyKey}`
        );
        return {
          success: true,
          orderId: existingOrder.id,
          totalAmount: existingData.totalAmount,
          message: "Order already placed successfully!",
        };
      }
    }

    // ─── 3. Input Validation ─────────────────────────────────────
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Order must contain at least one item."
      );
    }

    if (items.length > MAX_ITEMS_PER_ORDER) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        `Order cannot contain more than ${MAX_ITEMS_PER_ORDER} different items.`
      );
    }

    let totalQuantity = 0;

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
      totalQuantity += item.quantity;
    }

    if (totalQuantity > MAX_TOTAL_QUANTITY) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        `Total quantity cannot exceed ${MAX_TOTAL_QUANTITY} items per order.`
      );
    }

    // ─── 4. Batch Fetch Actual Prices from Database ──────────────
    // Using getAll() for a single round-trip instead of N individual reads
    const foodRefs = items.map((item) =>
      db.collection("foods").doc(item.foodId)
    );

    const foodDocs = await db.getAll(...foodRefs);

    const orderItems: Array<{
      foodId: string;
      name: string;
      desc: string;
      price: number;
      imageUrl: string;
      quantity: number;
    }> = [];

    let subtotal = 0;

    for (let i = 0; i < items.length; i++) {
      const foodDoc = foodDocs[i];
      const item = items[i];

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

    // ─── 5. Calculate Fees (Server-side only) ────────────────────
    const discount = subtotal > DISCOUNT_THRESHOLD ? DISCOUNT_AMOUNT : 0;
    const totalAmount = subtotal - discount + DELIVERY_FEE + SERVICE_FEE;

    // ─── 6. Create Order Document ────────────────────────────────
    const orderData: Record<string, any> = {
      userId,
      items: orderItems,
      subtotal: Math.round(subtotal * 100) / 100,
      discount: Math.round(discount * 100) / 100,
      deliveryFee: DELIVERY_FEE,
      serviceFee: SERVICE_FEE,
      totalAmount: Math.round(totalAmount * 100) / 100,
      status: "placed",
      note: note || "",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Store idempotency key if provided
    if (idempotencyKey) {
      orderData.idempotencyKey = idempotencyKey;
    }

    const orderRef = await db.collection("orders").add(orderData);

    functions.logger.info(
      `Order ${orderRef.id} created for user ${userId}. ` +
      `Items: ${orderItems.length}, Total: AED ${totalAmount.toFixed(2)}`
    );

    // ─── 7. Return Response ──────────────────────────────────────
    return {
      success: true,
      orderId: orderRef.id,
      totalAmount: orderData.totalAmount,
      message: "Order placed successfully!",
    };
  }
);
