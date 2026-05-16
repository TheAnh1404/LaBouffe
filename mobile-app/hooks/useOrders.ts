import { useState, useEffect } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db, auth } from "../config/firebase";

export type OrderItem = {
  id: string;
  name: string;
  desc: string;
  price: number;
  imageUrl: string;
  quantity: number;
};

export type Order = {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  serviceFee: number;
  totalAmount: number;
  status: "placed" | "preparing" | "delivering" | "delivered";
  createdAt: any; // Firestore Timestamp
};

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const user = auth.currentUser;
      if (!user) {
        setOrders([]);
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const items: Order[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as Order);
        });
        setOrders(items);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const refetch = async () => {
    setLoading(true);
    const user = auth.currentUser;
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, "orders"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const items: Order[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as Order);
      });
      setOrders(items);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  return { orders, loading, refetch };
}
