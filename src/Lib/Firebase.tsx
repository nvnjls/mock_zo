// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
/**
 * Single source of truth for Firebase config.
 * Uses your known-good config; replace with envs later if needed.
 */
const firebaseConfig = {
    apiKey: "AIzaSyAqkjaKotQE89Zd8yv_rxJL1wI109qMwtM",
    authDomain: "mockzo-india.firebaseapp.com",
    projectId: "mockzo-india",
    storageBucket: "mockzo-india.firebasestorage.app",
    messagingSenderId: "760173279071",
    appId: "1:760173279071:web:fe12279b446b43e912a8ea",
    measurementId: "G-7QC6JY24J7",
};

// Initialize (idempotent)
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Auth (LOCAL persistence keeps users logged in)
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch(() => {
    /* ignore */
});