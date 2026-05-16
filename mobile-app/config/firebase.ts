/**
 * LaBouffe — Firebase Configuration
 *
 * Firebase services are initialized here.
 * In a production environment, these values should be loaded from
 * environment variables via app.config.js → Constants.expoConfig.extra
 *
 * For development simplicity with Expo, we keep the config here but
 * the .env.example file documents what values are needed.
 */

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import Constants from "expo-constants";

// Load from Expo Constants (set in app.config.js) or use defaults
const extra = Constants.expoConfig?.extra || {};

const firebaseConfig = {
  apiKey: extra.FIREBASE_API_KEY || "AIzaSyAR9an0pC5SKFHpfJ_NfAxbY9WncTZGqqA",
  authDomain: extra.FIREBASE_AUTH_DOMAIN || "labouffe-1404.firebaseapp.com",
  projectId: extra.FIREBASE_PROJECT_ID || "labouffe-1404",
  storageBucket: extra.FIREBASE_STORAGE_BUCKET || "labouffe-1404.firebasestorage.app",
  messagingSenderId: extra.FIREBASE_MESSAGING_SENDER_ID || "1037371659704",
  appId: extra.FIREBASE_APP_ID || "1:1037371659704:web:3c64e76cd7fbb0da406b4d",
  measurementId: extra.FIREBASE_MEASUREMENT_ID || "G-D958BMNWWY",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
