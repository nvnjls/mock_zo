// src/StaticComponents/AuthModal.tsx
import React, { useEffect, useState, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import {
    sendSignInLinkToEmail,
    isSignInWithEmailLink,
    signInWithEmailLink,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
} from "firebase/auth";
import { auth } from "../Lib/Firebase";

let openModalCallback: (() => void) | null = null;
export function openAuthModal() {
    if (openModalCallback) openModalCallback();
}

export default function AuthModal() {
    const [authOpen, setAuthOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const [sent, setSent] = useState(false);

    useEffect(() => {
        openModalCallback = () => {
            setError("");
            setSent(false);
            setAuthOpen(true);
        };
        return () => {
            openModalCallback = null;
        };
    }, []);

    useEffect(() => {
        getRedirectResult(auth).catch(() => { });
    }, []);

    // Complete email-link sign-in if user opened via magic link
    useEffect(() => {
        if (isSignInWithEmailLink(auth, window.location.href)) {
            const stored = window.localStorage.getItem("mockzo_email_for_signin") || "";
            (async () => {
                try {
                    const finalEmail = stored || window.prompt("Confirm your email for sign-in") || "";
                    if (!finalEmail) return;
                    await signInWithEmailLink(auth, finalEmail, window.location.href);
                    window.localStorage.removeItem("mockzo_email_for_signin");
                    window.location.href = "/onboarding";
                } catch (e) {
                    console.warn("Email link completion failed", e);
                }
            })();
        }
    }, []);

    const handleSendLink = useCallback(async () => {
        setError("");
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Enter a valid email address");
            return;
        }
        setSending(true);
        try {
            // If you configured Firebase Dynamic Links for email link auth, expose the domain via env
            const dynamicLinkDomain = (import.meta as any)?.env?.VITE_FIREBASE_DYNAMIC_LINK_DOMAIN || "";
            const actionCodeSettings: any = {
                url: window.location.origin + "/",
                handleCodeInApp: true,
            };
            if (dynamicLinkDomain) {
                actionCodeSettings.dynamicLinkDomain = dynamicLinkDomain; // e.g. "mockzo.page.link" or "links.mockzo.com"
            }
            await sendSignInLinkToEmail(auth, email, actionCodeSettings);
            window.localStorage.setItem("mockzo_email_for_signin", email);
            setSent(true);
        } catch (e: any) {
            const code = (e && (e.code || e.name)) || "unknown";
            const message = e?.message || "Could not send link. Try again.";
            setError(`${code}: ${message}`);
            console.warn("sendSignInLinkToEmail failed", e);
        } finally {
            setSending(false);
        }
    }, [email]);

    const signInWithGoogle = useCallback(async () => {
        const provider = new GoogleAuthProvider();
        provider.addScope("email");
        provider.addScope("profile");
        try {
            await signInWithPopup(auth, provider);
            window.location.href = "/onboarding";
            setAuthOpen(false);
        } catch {
            await signInWithRedirect(auth, provider);
        }
    }, []);

    const isOpen = authOpen;

    if (!isOpen) return null;

    return (
        <div id="auth-modal" role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <button aria-label="Close" className="absolute inset-0 bg-black/50" onClick={() => setAuthOpen(false)} />

            {/* Panel */}
            <div className="relative mx-4 w-full max-w-3xl overflow-hidden rounded-2xl bg-white text-indigo-900 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Left: Email Link (Passwordless) */}
                    <div className="p-6 md:p-8">
                        <h2 className="text-lg font-semibold">Sign in with Email (No password)</h2>
                        <p className="mt-1 text-sm text-indigo-600">We’ll email you a magic link to sign in.</p>

                        <label className="mt-5 block text-sm font-medium">Email address</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="mt-2 w-full rounded-xl border border-indigo-200 bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-600"
                            inputMode="email"
                            autoComplete="email"
                        />
                        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                        {sent ? (
                            <p className="mt-3 text-sm text-green-700">Magic link sent to <span className="font-semibold">{email}</span>! Check Inbox/Spam and open the link on this device.</p>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSendLink}
                                disabled={sending}
                                className="mt-4 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 disabled:opacity-60"
                            >
                                {sending ? "Sending…" : "Email me a sign-in link"}
                            </button>
                        )}
                        <p className="mt-3 text-xs text-indigo-600">By continuing you agree to our Terms and Privacy Policy.</p>
                    </div>

                    {/* Right: Google */}
                    <div className="bg-indigo-50 p-6 md:p-8">
                        <h3 className="text-base font-semibold">Or continue with Google</h3>
                        <p className="mt-1 text-sm text-indigo-700">Fastest option. We’ll keep you signed in on this device.</p>
                        <button
                            type="button"
                            onClick={signInWithGoogle}
                            className="mt-5 w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-indigo-900 shadow hover:shadow-md ring-1 ring-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                            data-testid="oauth-google"
                            aria-label="Continue with Google"
                        >
                            Continue with Google
                        </button>

                        <div className="mt-6 text-xs text-indigo-700">
                            <p>No password required. Your session stays active until you log out.</p>
                        </div>
                    </div>
                </div>

                {/* Modal footer */}
                <div className="flex items-center justify-between border-t border-indigo-100 bg-white px-6 py-3 text-xs text-indigo-600">
                    <span>Secure login powered by Firebase</span>
                    <button onClick={() => setAuthOpen(false)} className="underline">Close</button>
                </div>
            </div>
        </div>
    );
}