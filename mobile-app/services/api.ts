/**
 * LaBouffe — Cloud Functions Service Layer
 *
 * Centralized API service for calling Firebase Cloud Functions.
 * The mobile app should NEVER write directly to sensitive collections
 * like 'orders'. All business logic goes through these functions.
 */

import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";
import { app } from "../config/firebase";
import { CreateOrderRequest, CreateOrderResponse } from "../types/order";

// Initialize Functions
const functions = getFunctions(app);

// ─── Uncomment the line below for local development with Firebase Emulator ───
// connectFunctionsEmulator(functions, "localhost", 5001);

/**
 * Place an order through the server.
 * Client sends only foodId + quantity.
 * Server validates prices, calculates fees, and creates the order.
 *
 * @param orderData - Only contains { items: [{ foodId, quantity }], note? }
 * @returns Promise with order ID and total amount
 */
export async function placeOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
  const processOrder = httpsCallable<CreateOrderRequest, CreateOrderResponse>(
    functions,
    "processOrder"
  );

  const result = await processOrder(orderData);
  return result.data;
}

/**
 * Cancel an order (future feature).
 * Only orders with status 'placed' can be cancelled.
 */
export async function cancelOrder(orderId: string): Promise<{ success: boolean; message: string }> {
  const cancel = httpsCallable<{ orderId: string }, { success: boolean; message: string }>(
    functions,
    "cancelOrder"
  );

  const result = await cancel({ orderId });
  return result.data;
}
