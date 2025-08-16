import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../Lib/Firebase";
import AdminLogin from "./AdminLogin";

/**
 * Wrap /admin with this:
 * <AdminRoute><AdminPanel/></AdminRoute>
 * Handles 3 states:
 * - Not logged in -> show Google login
 * - Logged in & admin -> render children (AdminPanel)
 * - Logged in & NOT admin -> show unauthorized email screen
 */
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [checking, setChecking] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (u) => {
            setUser(u);
            const email = u?.email?.toLowerCase() || null;
            if (!u || !email) {
                setIsAdmin(false);
                setChecking(false);
                return;
            }
            try {
                const snap = await getDoc(doc(db, "admins", email));
                setIsAdmin(snap.exists());
            } catch {
                setIsAdmin(false);
            } finally {
                setChecking(false);
            }
        });
        return () => unsub();
    }, []);

    if (checking) {
        return (
            <div className="min-h-screen grid place-items-center bg-gradient-to-br from-[#0b1120] via-[#111827] to-[#0f172a] text-slate-100">
                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-6 py-4">Checking access…</div>
            </div>
        );
    }

    if (!user) {
        // Not logged in -> Google login
        return <AdminLogin />;
    }

    if (isAdmin) {
        // Logged in & admin -> show panel
        return <>{children}</>;
    }

    // Logged in but NOT admin -> unauthorized screen
    return (
        <div className="min-h-screen grid place-items-center bg-gradient-to-br from-[#0b1120] via-[#111827] to-[#0f172a] text-slate-100 p-4">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/30 p-6 text-center">
                <h2 className="text-lg font-semibold mb-2">Unauthorized email</h2>
                <p className="text-sm text-slate-300/80 mb-4">
                    <span className="font-mono">{user.email}</span> is not authorized.
                </p>
                <button
                    onClick={() => signOut(auth)}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 transition-colors px-4 py-2 text-sm"
                >
                    Sign out
                </button>
            </div>
        </div>
    );
};

export default AdminRoute;