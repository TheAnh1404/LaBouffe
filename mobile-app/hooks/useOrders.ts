/**
 * useOrders — Realtime Order Listener Hook
 *
 * Uses Firestore onSnapshot for REALTIME order updates.
 * When the restaurant changes order status (e.g., "preparing" → "delivering"),
 * the UI updates instantly without manual refresh.
 *
 * Previous version used getDocs (one-time fetch) which required manual refetch.
 */

import { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { Order } from "../types/order";

export type { Order };
export type { OrderItem } from "../types/order";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    // ─── Realtime Listener ─────────────────────────────────────
    // This replaces the old getDocs() one-time fetch.
    // Now orders update automatically when status changes.
    const q = query(
      collection(db, "orders"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const items: Order[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as Order);
        });
        setOrders(items);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error listening to orders:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  return { orders, loading, error };
}
