import React, { useEffect, useState } from "react";
import { auth, db } from "../Lib/Firebase";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const provider = new GoogleAuthProvider();

/**
 * Login page used when user is not authenticated.
 * After login:
 *  - if email in admins -> redirects to /admin
 *  - else -> shows Unauthorized, stays here, leaves session signed-in for clarity
 */
const AdminLogin: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [unauthorizedEmail, setUnauthorizedEmail] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            setUnauthorizedEmail(null);
            if (!user?.email) return;
            const email = user.email.toLowerCase();
            const snap = await getDoc(doc(db, "admins", email));
            if (snap.exists()) {
                navigate("/admin", { replace: true });
            } else {
                setUnauthorizedEmail(user.email);
                setErr("Not authorized. Your email is not in the admins list.");
                // Keep the user signed in so they can sign out or switch account
            }
        });
        return () => unsub();
    }, [navigate]);

    const loginWithGoogle = async () => {
        setErr(null);
        setUnauthorizedEmail(null);
        setLoading(true);
        try {
            await signInWithPopup(auth, provider);
            // onAuthStateChanged handles redirect / unauthorized messaging
        } catch (e: any) {
            setErr(e?.message ?? "Google sign-in failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0b1120] via-[#111827] to-[#0f172a] flex items-center justify-center p-4 text-slate-100">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/30 p-6 space-y-5">
                <div className="space-y-1">
                    <h1 className="text-xl font-semibold">Admin Sign In</h1>
                    <p className="text-sm text-slate-300/80">Sign in with your admin Google account.</p>
                </div>

                {err && (
                    <div className="text-sm text-red-300 bg-red-900/30 border border-red-500/30 px-3 py-2 rounded-lg">
                        {err}
                        {unauthorizedEmail && (
                            <div className="mt-1 text-xs text-slate-300/80">
                                Unauthorized email: <span className="font-mono">{unauthorizedEmail}</span>
                            </div>
                        )}
                    </div>
                )}

                <button
                    onClick={loginWithGoogle}
                    disabled={loading}
                    className="w-full py-2 rounded-xl bg-emerald-400 text-slate-900 font-semibold hover:bg-emerald-300 transition-colors disabled:opacity-50"
                >
                    {loading ? "Signing in…" : "Continue with Google"}
                </button>

                <div className="text-xs text-slate-400/80">
                    if you are not an admin, <a href="https://www.mockzo.com" className="underline hover:text-emerald-400">click here</a>
                </div>

                <div className="text-xs text-slate-400/80">
                    {unauthorizedEmail ? (
                        <button
                            onClick={() => signOut(auth)}
                            className="mt-2 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 transition-colors px-3 py-2"
                        >
                            Use a different account
                        </button>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;