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
