import { useEffect, useState } from "react";
import { auth, db } from "../Lib/Firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

/**
 * Returns: "checking" | "ok" | "deny"
 * ok = user is logged in AND admins/{lowercasedEmail} exists
 * deny = not logged in OR email missing in admins
 */
export const AdminGate = () => {
    const [status, setStatus] = useState<"checking" | "ok" | "deny">("checking");

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            const email = user?.email?.toLowerCase() || null;
            if (!user || !email) {
                setStatus("deny");
                return;
            }
            try {
                const snap = await getDoc(doc(db, "admins", email));
                setStatus(snap.exists() ? "ok" : "deny");
            } catch (e) {
                console.error("AdminGate check failed:", e);
                setStatus("deny");
            }
        });
        return () => unsub();
    }, []);

    return status;
};