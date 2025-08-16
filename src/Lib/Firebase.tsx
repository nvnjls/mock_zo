// src/Lib/Firebase.ts
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import {
    getAuth,
    RecaptchaVerifier,
    Auth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAqkjaKotQE89Zd8yv_rxJL1wI109qMwtM",
    authDomain: "mockzo-india.firebaseapp.com",
    projectId: "mockzo-india",
    storageBucket: "mockzo-india.firebasestorage.app",
    messagingSenderId: "760173279071",
    appId: "1:760173279071:web:fe12279b446b43e912a8ea",
    measurementId: "G-7QC6JY24J7",
};

/// --- Single Firebase app ---
let app: FirebaseApp;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0]!;
}

// --- Single Auth + Firestore ---
export const auth: Auth = getAuth(app);
export const db = getFirestore(app);

// OPTIONAL: enable test numbers bypass in dev (NO effect in prod)
// Set your test numbers in Firebase Console → Auth → Phone → Test numbers
if (typeof window !== "undefined") {
    const isLocalhost = /^(localhost|127\.0\.0\.1)/.test(window.location.hostname);
    try {
        // Only affect dev; in prod this does nothing harmful if left on false
        (auth as any).settings = (auth as any).settings || {};
        (auth as any).settings.appVerificationDisabledForTesting = isLocalhost;
    } catch { }
}

// --- Recaptcha management ---
let recaptcha: RecaptchaVerifier | null = null;

// internal guard that the container exists and we are in browser
function assertEnv() {
    if (typeof window === "undefined") {
        throw new Error("reCAPTCHA requires a browser environment.");
    }
    if (!document.getElementById("recaptcha-container")) {
        throw new Error("reCAPTCHA container #recaptcha-container is missing in the DOM.");
    }
}

export const ensureRecaptcha = async (visibleFallback = false): Promise<RecaptchaVerifier> => {
    assertEnv();

    // Destroy broken or mismatched instances
    const anyRec = recaptcha as any;
    if (anyRec?.destroyed) recaptcha = null;

    if (!recaptcha) {
        recaptcha = new RecaptchaVerifier(auth, "recaptcha-container", {
            size: visibleFallback ? "normal" : "invisible",
            callback: () => { },
            "expired-callback": () => {
                try { (recaptcha as any)?.reset?.(); } catch { }
            },
        });
        // MUST render once
        try { await recaptcha.render(); } catch { }
    }
    return recaptcha!;
};

export const resetRecaptcha = () => {
    try { (recaptcha as any)?.clear?.(); } catch { }
    recaptcha = null;
};