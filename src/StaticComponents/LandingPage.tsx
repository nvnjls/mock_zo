// src/StaticComponents/LandingPage.tsx
import React, { useCallback, useState, useEffect } from "react";
import { ArrowBigDownDash, ArrowDown01, ArrowDown10, ArrowDownZA, ArrowRight, ArrowUpCircle, AtomIcon, BadgeHelpIcon, BadgeInfo, BoldIcon, BotIcon, BugIcon, ClockArrowDown, CpuIcon, EyeIcon, GitCompareArrows, HelpCircle, HelpingHand, InfoIcon, List, ListCheck, ListChecks, ListCollapse, ListEnd, ListFilter, ListMusicIcon, ListRestart, ListTodo, LucideArrowDownAz, LucideArrowsUpFromLine, LucideBanknoteArrowUp, LucideListX, ReplyIcon, RssIcon, SquareArrowLeft, SquareSplitVerticalIcon } from "lucide-react";
import AuthModal, { openAuthModal } from "./AuthModal";
import { auth } from "../Lib/Firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { Button } from "@headlessui/react";

const db = getFirestore();


type ExperienceType = "mock" | "internship" | "workshop";

const CTACard = ({
    title,
    description,
    buttonText,
    type,
    onClick,
}: {
    title: string;
    description: string;
    buttonText: string;
    type: ExperienceType;
    onClick: (type: ExperienceType) => void;
}) => (
    <div className="rounded-lg bg-indigo-50 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-textTitle mb-2">{title}</h3>
        <p className="text-sm text-textPrimary mb-4">{description}</p>
        <Button
            onClick={() => onClick(type)}
            className="w-full rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-white hover:bg-secondary/80"
        >
            {buttonText}
        </Button>
    </div>
);

export default function LandingPage() {
    const gradient = "bg-gradient-to-r from-primary to-secondary";

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => setUser(u));
        return () => unsub();
    }, []);

    const openAuth = useCallback(async (type: ExperienceType) => {
        if (user) {
            try {
                const userDocRef = doc(db, "users", user.uid);
                const snap = await getDoc(userDocRef);
                if (snap.exists() && snap.data()?.bookingDone) {
                    window.location.href = "/dashboard";
                } else {
                    window.location.href = `/onboarding?type=${type}`;
                }
            } catch (e) {
                console.error("Failed to get booking status", e);
                window.location.href = `/onboarding?type=${type}`;
            }
        } else {
            openAuthModal();
            // optional: can store `type` in localStorage/sessionStorage if needed later
        }
    }, [user]);

    return (
        <div className="pb-8">
            <section
                id="home"
                className={`relative isolate overflow-hidden w-full ${gradient} text-white min-h-[75vh] rounded-2xl flex items-center`}
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

                <div className="mx-auto max-w-7xl py-20 sm:py-24 lg:py-28">
                    <div className="grid items-center gap-10 lg:grid-cols-2">
                        {/* Copy */}
                        <div>
                            <p className="mb-3 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-medium tracking-wide backdrop-blur">
                                • Mock interviews • workshops • internships
                            </p>

                            <h1 className="text-4xl sm:text-4xl md:text-4xl font-bold leading-tight">
                                We bridge the  <span className="text-accent">gap</span>, <span className="whitespace-nowrap">between college and career</span>
                            </h1>

                            <p className="mt-6 text-lg text-indigo-100/90 max-w-prose">
                                Mock interviews that don’t feel fake, AI workshops that actually teach, and internships that flex.
                                Skip the stress, level up, show up, and glow up
                            </p>

                            {/* Trust row */}
                            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-indigo-100/80">
                                <span>◆ Avg. feedback in &lt; 10 min</span>
                                <span>◆ 50k+ practice questions</span>
                                <span>◆ Built for campus placements</span>
                            </div>
                        </div>

                        {/* Art / Screenshot */}
                        <div className="relative">
                            <div className="mx-auto max-w-lg overflow-hidden scale-[1.15] drop-shadow-lg">
                                <img

                                    srcSet="/images/jpg/student2.png 512w, /images/jpg/student2.png 768w, /images/jpg/student2.png 1280w"
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
                                You’re here. That’s the first step.
                            </div>
                        </div>
                    </div>
                </div>

                <AuthModal />
            </section>
            <div className="relative z-10 -mt-20 mx-auto w-[90%] max-w-6xl rounded-3xl bg-gray-100 px-6 py-6 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        title: "Mock Interviews",
                        description: "Crack your next interview before it even happens.",
                        buttonText: "Book Now",
                        type: "mock" as ExperienceType,
                    },
                    {
                        title: "Internships",
                        description: "Experience work. Elevate your future.",
                        buttonText: "Apply Now",
                        type: "internship" as ExperienceType,
                    },
                    {
                        title: "Workshops",
                        description: "Bridging knowledge gaps to career success.",
                        buttonText: "Join Workshop",
                        type: "workshop" as ExperienceType,
                    },
                ].map(({ title, description, buttonText, type }, idx) => (
                    <div
                        key={idx}
                        // className="z-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl shadow-lg p-6 flex flex-col items-center text-center transition-transform duration-300 hover:translate-y-3 mt-12"

                        className={`relative rounded-2xl overflow-hidden shadow-xl ring-1 ring-gray-200  min-h-[180px] backdrop-blur-xl p-6 flex flex-col justify-between gap-4  ${type === "mock"
                            ? "bg-primary"
                            : type === "internship"
                                ? "bg-tertiary"
                                : "bg-secondary"
                            }`}
                    >
                        <div className="absolute bottom-[50px] left-[60%] -translate-x-1/2 w-[120%] h-60 bg-white rounded-3xl -z-10"></div>
                        <h3 className="text-lg font-semibold text-neutral">{title}</h3>
                        <p className="text-sm text-muted">{description}</p>
                        <div className="mt-auto flex items-center gap-3">
                            <Button
                                onClick={() => openAuth(type)}
                                className="flex-grow rounded-full bg-gray-600 shadow-lg min-h-14 px-8 py-3 text-sm font-semibold text-white hover:bg-black"
                            >
                                {buttonText}
                            </Button>
                            <Button
                                onClick={() => openAuth(type)}
                                className={`h-12 w-12 flex items-center justify-center rounded-full ${type === "mock"
                                    ? "bg-primary"
                                    : type === "internship"
                                        ? "bg-tertiary"
                                        : "bg-secondary"
                                    } text-white hover:bg-black shadow-lg`}
                                aria-label="Learn More"
                            >
                                <ListEnd size={24} />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}