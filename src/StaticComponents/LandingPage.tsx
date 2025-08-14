// src/StaticComponents/LandingPage.tsx
import React, { useCallback, useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import AuthModal, { openAuthModal } from "./AuthModal";
import { auth } from "../Lib/Firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const db = getFirestore();

export default function LandingPage() {
    // Gradient variable for easy testing
    const gradient = "bg-gradient-to-b from-primary to-secondary";

    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => setUser(u));
        return () => unsub();
    }, []);

    const openAuth = useCallback(async () => {
        if (user) {
            try {
                const userDocRef = doc(db, "users", user.uid);
                const snap = await getDoc(userDocRef);
                if (snap.exists() && snap.data()?.bookingDone) {
                    window.location.href = "/dashboard";
                } else {
                    window.location.href = "/onboarding";
                }
            } catch (e) {
                console.error("Failed to get booking status", e);
                window.location.href = "/onboarding";
            }
        } else {
            openAuthModal();
        }
    }, [user]);

    return (
        <section
            id="home"
            className={`relative isolate overflow-hidden ${gradient} text-white`}
            aria-label="MockZo interview prep hero"
        >
            {/* Decorative grid fade */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-15 [mask-image:radial-gradient(60%_60%_at_50%_30%,#000_40%,transparent_100%)]"
                style={{
                    backgroundImage:
                        "linear-gradient(transparent 0.75px, rgba(255,255,255,.08) 0.75px), linear-gradient(90deg, transparent 0.75px, rgba(255,255,255,.08) 0.75px)",
                    backgroundSize: "22px 22px",
                }}
            />

            <div className="mx-auto max-w-7xl px-4 py-20 sm:py-24 lg:py-28">
                <div className="grid items-center gap-10 lg:grid-cols-2">
                    {/* Copy */}
                    <div>
                        <p className="mb-3 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-medium tracking-wide backdrop-blur">
                            • Mock interviews • workshops • internships
                        </p>

                        <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
                            Crack Your Next <span className="text-accent">Interview</span>, <span className="whitespace-nowrap">Before It Even Happens</span>
                        </h1>

                        <p className="mt-4 max-w-prose text-indigo-100/90">
                            Practice with real interviewers, get instant feedback, and level up with
                            short workshops. Join MockZo and turn anxiety into muscle memory.
                        </p>

                        {/* CTAs */}
                        <div className="mt-8 flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={openAuth}
                                className="group inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-indigo-800 shadow-lg transition hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-700"
                                aria-haspopup="dialog"
                                aria-controls="auth-modal"
                            >
                                Get Started
                                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-0.5" />
                            </button>
                            <a
                                href="#how"
                                className="inline-flex items-center justify-center rounded-xl border border-white/70 bg-white/0 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-700"
                            >
                                Try a Mock in 3 min
                            </a>
                        </div>

                        {/* Trust row */}
                        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-indigo-100/80">
                            <span>◆ Avg. feedback in &lt; 10 min</span>
                            <span>◆ 50k+ practice questions</span>
                            <span>◆ Built for campus placements</span>
                        </div>
                    </div>

                    {/* Art / Screenshot */}
                    <div className="relative">
                        <div className="mx-auto max-w-md overflow-hidden rounded-2xl bg-white/5 p-2 shadow-2xl ring-1 ring-white/10">
                            <img
                                src="/images/jpg/student2.jpg"
                                srcSet="/images/jpg/student2.jpg 512w, /images/jpg/student2.jpg 768w, /images/jpg/student2.jpg 1280w"
                                sizes="(min-width: 1024px) 560px, (min-width: 640px) 70vw, 92vw"
                                alt="img"
                                className=" h-auto w-full rounded-xl"
                                loading="eager"
                                width={768}
                                height={528}
                            />
                        </div>

                        {/* Small stat badge */}
                        <div className="absolute -bottom-4 right-2 hidden rounded-xl bg-white/90 px-4 py-2 text-sm font-semibold text-indigo-900 shadow lg:block">
                            92% feel more confident after 2 mocks
                        </div>
                    </div>
                </div>
            </div>

            {/* Mount the shared AuthModal once (effects run even when closed) */}
            <AuthModal />
        </section>
    );
}

