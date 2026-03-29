import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAR9an0pC5SKFHpfJ_NfAxbY9WncTZGqqA",
  authDomain: "labouffe-1404.firebaseapp.com",
  projectId: "labouffe-1404",
  storageBucket: "labouffe-1404.firebasestorage.app",
  messagingSenderId: "1037371659704",
  appId: "1:1037371659704:web:3c64e76cd7fbb0da406b4d",
  measurementId: "G-D958BMNWWY"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
