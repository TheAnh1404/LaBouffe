import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";

type FavoritesContextType = {
  favorites: string[]; // Array of food/restaurant IDs
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  loading: boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid || null);
    });
    return unsubscribe;
  }, []);

  // Fetch favorites when user changes
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userId) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      try {
        const querySnapshot = await getDocs(
          collection(db, "users", userId, "favorites")
        );
        const ids: string[] = [];
        querySnapshot.forEach((doc) => {
          ids.push(doc.id);
        });
        setFavorites(ids);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [userId]);

  const isFavorite = (id: string) => favorites.includes(id);

  const toggleFavorite = async (id: string) => {
    if (!userId) return;

    try {
      const favRef = doc(db, "users", userId, "favorites", id);

      if (isFavorite(id)) {
        // Remove from favorites
        await deleteDoc(favRef);
        setFavorites((prev) => prev.filter((fid) => fid !== id));
      } else {
        // Add to favorites
        await setDoc(favRef, { addedAt: new Date() });
        setFavorites((prev) => [...prev, id]);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used within a FavoritesProvider");
  return context;
};
