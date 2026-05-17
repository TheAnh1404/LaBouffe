/**
 * LaBouffe — Cloud Functions Service Layer
 *
 * Centralized API service for placing and managing orders.
 *
 * Strategy:
 * - PRIMARY: Call Firebase Cloud Functions (requires Blaze plan)
 * - FALLBACK: Write directly to Firestore (works on Spark plan)
 *
 * When upgrading to Blaze plan, set USE_CLOUD_FUNCTIONS = true
 * to enable server-side price validation and idempotency.
 */

import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";
import { collection, addDoc, doc, getDoc, updateDoc, query, where, getDocs, limit, serverTimestamp, documentId } from "firebase/firestore";
import { app } from "../config/firebase";
import { db, auth } from "../config/firebase";
import {
  CreateOrderRequest,
  CreateOrderResponse,
  CancelOrderRequest,
  CancelOrderResponse,
} from "../types/order";

// ═══════════════════════════════════════════════════════════════
// CONFIGURATION: Set to true when Firebase project is on Blaze plan
// ═══════════════════════════════════════════════════════════════
const USE_CLOUD_FUNCTIONS = false;

// Initialize Functions (used only when USE_CLOUD_FUNCTIONS = true)
const functions = getFunctions(app);

// ─── Uncomment the line below for local development with Firebase Emulator ───
// connectFunctionsEmulator(functions, "localhost", 5001);

// ─── Fee Constants (must match processOrder.ts) ──────────────
const DISCOUNT_THRESHOLD = 50; // AED
const DISCOUNT_AMOUNT = 5;     // AED
const DELIVERY_FEE = 2.0;      // AED
const SERVICE_FEE = 1.5;       // AED

/**
 * Place an order.
 *
 * PRIMARY (Cloud Functions): Client sends only foodId + quantity.
 * Server validates prices, calculates fees, and creates the order.
 *
 * FALLBACK (Direct Firestore): Client reads food prices from Firestore,
 * calculates total, and writes the order document directly.
 * Less secure but works on Spark plan.
 */
export async function placeOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
  if (USE_CLOUD_FUNCTIONS) {
    return placeOrderViaCloudFunction(orderData);
  }
  return placeOrderDirectly(orderData);
}

/**
 * Cancel an order.
 * Only orders with status 'placed' (not yet confirmed) can be cancelled.
 */
export async function cancelOrder(data: CancelOrderRequest): Promise<CancelOrderResponse> {
  if (USE_CLOUD_FUNCTIONS) {
    return cancelOrderViaCloudFunction(data);
  }
  return cancelOrderDirectly(data);
}


// ═══════════════════════════════════════════════════════════════
// Cloud Function Implementations (Blaze plan required)
// ═══════════════════════════════════════════════════════════════

async function placeOrderViaCloudFunction(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
  const processOrder = httpsCallable<CreateOrderRequest, CreateOrderResponse>(
    functions,
    "processOrder"
  );
  const result = await processOrder(orderData);
  return result.data;
}

async function cancelOrderViaCloudFunction(data: CancelOrderRequest): Promise<CancelOrderResponse> {
  const cancel = httpsCallable<CancelOrderRequest, CancelOrderResponse>(
    functions,
    "cancelOrder"
  );
  const result = await cancel(data);
  return result.data;
}


// ═══════════════════════════════════════════════════════════════
// Direct Firestore Implementations (Spark plan fallback)
// ═══════════════════════════════════════════════════════════════

async function placeOrderDirectly(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("You must be logged in to place an order.");
  }

  const { items, note, idempotencyKey } = orderData;

  // ─── 1. Idempotency Check ──────────────────────────────────
  if (idempotencyKey) {
    const existingQuery = query(
      collection(db, "orders"),
      where("userId", "==", user.uid),
      where("idempotencyKey", "==", idempotencyKey),
      limit(1)
    );
    const existingSnap = await getDocs(existingQuery);
    if (!existingSnap.empty) {
      const existingDoc = existingSnap.docs[0];
      const data = existingDoc.data();
      return {
        success: true,
        orderId: existingDoc.id,
        totalAmount: data.totalAmount,
        message: "Order already placed successfully!",
      };
    }
  }

  // ─── 2. Batch Fetch Food Prices ────────────────────────────
  const foodIds = items.map(i => i.foodId);
  const orderItems: Array<{
    foodId: string;
    name: string;
    desc: string;
    price: number;
    imageUrl: string;
    quantity: number;
  }> = [];

  let subtotal = 0;

  // Fetch each food document to get server prices
  for (const item of items) {
    const foodDoc = await getDoc(doc(db, "foods", item.foodId));

    if (!foodDoc.exists()) {
      throw new Error(`Food item "${item.foodId}" not found. It may have been removed from the menu.`);
    }

    const foodData = foodDoc.data();
    const price = foodData.price as number;

    if (typeof price !== "number" || price <= 0) {
      throw new Error(`Invalid price for food item "${item.foodId}".`);
    }

    orderItems.push({
      foodId: item.foodId,
      name: foodData.name || "Unknown",
      desc: foodData.desc || "",
      price: price,
      imageUrl: foodData.imageUrl || "",
      quantity: item.quantity,
    });

    subtotal += price * item.quantity;
  }

  // ─── 3. Calculate Fees ─────────────────────────────────────
  const discount = subtotal > DISCOUNT_THRESHOLD ? DISCOUNT_AMOUNT : 0;
  const totalAmount = subtotal - discount + DELIVERY_FEE + SERVICE_FEE;

  // ─── 4. Create Order Document ──────────────────────────────
  const orderDoc: Record<string, any> = {
    userId: user.uid,
    items: orderItems,
    subtotal: Math.round(subtotal * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    deliveryFee: DELIVERY_FEE,
    serviceFee: SERVICE_FEE,
    totalAmount: Math.round(totalAmount * 100) / 100,
    status: "placed",
    note: note || "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (idempotencyKey) {
    orderDoc.idempotencyKey = idempotencyKey;
  }

  const orderRef = await addDoc(collection(db, "orders"), orderDoc);

  return {
    success: true,
    orderId: orderRef.id,
    totalAmount: orderDoc.totalAmount,
    message: "Order placed successfully!",
  };
}

async function cancelOrderDirectly(data: CancelOrderRequest): Promise<CancelOrderResponse> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("You must be logged in to cancel an order.");
  }

  const { orderId, reason } = data;

  // Fetch order
  const orderRef = doc(db, "orders", orderId);
  const orderSnap = await getDoc(orderRef);

  if (!orderSnap.exists()) {
    throw new Error("Order not found.");
  }

  const orderData = orderSnap.data();

  // Verify ownership
  if (orderData.userId !== user.uid) {
    throw new Error("You can only cancel your own orders.");
  }

  // Status check
  if (orderData.status !== "placed") {
    throw new Error(`Cannot cancel order with status "${orderData.status}".`);
  }

  // Cancel
  await updateDoc(orderRef, {
    status: "cancelled",
    cancellationReason: reason || "Cancelled by customer",
    cancelledAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return {
    success: true,
    message: "Order cancelled successfully.",
  };
}
