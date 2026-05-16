/**
 * AuthContext — Authentication State Manager
 *
 * Provides global auth state (user, isAuthenticated, loading) and
 * authentication actions (signOut with cleanup).
 *
 * Upgraded to include:
 * - FCM push notification token registration on login
 * - FCM token cleanup on logout
 * - Exposed signOut function for proper logout flow
 */

import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut, User } from 'firebase/auth';
import { auth } from '../config/firebase';
import {
  registerForPushNotifications,
  unregisterPushNotifications,
} from '../services/notifications';

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  /** Sign out and clean up FCM tokens */
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        // Register for push notifications after login
        try {
          const token = await registerForPushNotifications(firebaseUser.uid);
          setFcmToken(token);
        } catch (error) {
          console.log("Push notification registration failed (non-critical):", error);
        }
      }
    });

    return unsubscribe;
  }, []);

  /**
   * Sign out with proper cleanup:
   * 1. Unregister FCM token from Firestore
   * 2. Sign out from Firebase Auth
   */
  const signOut = useCallback(async () => {
    try {
      if (user) {
        await unregisterPushNotifications(user.uid, fcmToken);
      }
      await firebaseSignOut(auth);
      setFcmToken(null);
    } catch (error) {
      console.error("Sign out error:", error);
      // Force sign out even if cleanup fails
      await firebaseSignOut(auth);
    }
  }, [user, fcmToken]);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
