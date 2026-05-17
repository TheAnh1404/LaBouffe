/**
 * LaBouffe — Order Type Definitions
 * Server-validated order types. Price calculation is done server-side only.
 */

export type OrderStatus = 'placed' | 'confirmed' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';

export interface OrderItem {
  foodId: string;
  name: string;
  desc: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  serviceFee: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: any; // Firestore Timestamp
  updatedAt?: any;
  /** Delivery address — future feature */
  deliveryAddress?: string;
  /** Optional notes from customer */
  note?: string;
  /** Idempotency key to prevent duplicate orders */
  idempotencyKey?: string;
  /** Reason for cancellation (if cancelled) */
  cancellationReason?: string;
  /** Timestamp when order was cancelled */
  cancelledAt?: any;
}

/**
 * Payload sent FROM the mobile app TO the Cloud Function.
 * Only contains item references — server will look up actual prices.
 */
export interface CreateOrderRequest {
  items: Array<{
    foodId: string;
    quantity: number;
  }>;
  note?: string;
  /** Client-generated UUID to prevent duplicate orders on double-tap */
  idempotencyKey?: string;
}

/**
 * Response returned FROM the Cloud Function TO the mobile app.
 */
export interface CreateOrderResponse {
  success: boolean;
  orderId: string;
  totalAmount: number;
  message?: string;
}

/**
 * Payload sent to cancelOrder Cloud Function.
 */
export interface CancelOrderRequest {
  orderId: string;
  reason?: string;
}

/**
 * Response from cancelOrder Cloud Function.
 */
export interface CancelOrderResponse {
  success: boolean;
  message: string;
}
