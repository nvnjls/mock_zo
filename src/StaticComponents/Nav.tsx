import React, { useEffect, useState, useRef, useMemo, ReactElement } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../Lib/Firebase";
import { openAuthModal } from "./AuthModal";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { HiHome, HiUserGroup, HiBriefcase, HiAcademicCap, HiChatAlt2, HiQuestionMarkCircle, HiMail } from "react-icons/hi";

const db = getFirestore();

const Navbar = () => {
    const [activeId, setActiveId] = useState<
        | "home"
        | "mockInterview"
        | "internship"
        | "workshop"
        | "stories"
        | "faq"
        | "contact"
    >("home");
    const [user, setUser] = useState<User | null>(null);

    const navRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

    const INDICATOR_WIDTH = 48;

    // Map labels to actual section IDs
    const navLinks = [
        { id: "home", label: "Home", icon: HiHome },
        { id: "mockInterview", label: "Mock Interviews", icon: HiUserGroup },
        { id: "internship", label: "Internships", icon: HiBriefcase },
        { id: "workshop", label: "Workshops", icon: HiAcademicCap },
        { id: "stories", label: "Stories", icon: HiChatAlt2 },
        { id: "faq", label: "FAQ", icon: HiQuestionMarkCircle },
        { id: "contact", label: "Contact", icon: HiMail },
    ];

    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

    useEffect(() => {
        const handleResizeOrScroll = () => {
            const el = navRefs.current[activeId];
            if (el) {
                const rect = el.getBoundingClientRect();
                const containerRect = el.parentElement?.getBoundingClientRect();
                if (containerRect) {
                    setIndicatorStyle({
                        left: rect.left - containerRect.left,
                        width: rect.width,
                    });
                }
            }
        };

        handleResizeOrScroll();
        window.addEventListener("resize", handleResizeOrScroll);
        return () => window.removeEventListener("resize", handleResizeOrScroll);
    }, [activeId]);

    useEffect(() => {
        const sections = [
            "home",
            "mockInterview",
            "internship",
            "workshop",
            "stories",
            "faq",
            "contact",
        ]
            .map((id) => document.getElementById(id))
            .filter(Boolean) as Element[];

        const observer = new IntersectionObserver(
            (entries) => {
                const mostVisible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
                if (mostVisible && mostVisible.target.id !== activeId) {
                    setActiveId(mostVisible.target.id as any);
                }
            },
            {
                root: document.getElementById("content"),
                threshold: [0.4, 0.6, 0.9],
            }
        );

        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, [activeId]);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => setUser(u));
        return () => unsub();
    }, []);

    const handleNavClick = (id: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const handleCtaClick = async () => {
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
    };

    const island = "flex items-center ";

    return (
        <>
            <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between w-full shadow-sm">
                <div className="flex items-center gap-x-6">
                    <div className="flex items-center gap-x-2 font-bold text-lg text-black">
                        <img src={process.env.PUBLIC_URL + "/images/svg/logo.svg"} alt="Logo" className="h-6 w-6" />
                        MockZo
                    </div>

                    {/* Navigation */}
                    <div className="relative flex items-center gap-x-3 bg-gray-100 rounded-full px-2 py-1">
                        {/* Moving background indicator */}
                        <div
                            className="absolute h-[36px] rounded-full bg-white shadow transition-all duration-300 ease-in-out"
                            style={{
                                left: `${indicatorStyle.left}px`,
                                width: `${indicatorStyle.width}px`,
                            }}
                        ></div>
                        {navLinks.map((link) => {
                            const isActive = activeId === link.id;
                            const isContact = link.id === "contact";
                            // Only show Contact on small screens; others hidden until md+
                            const visibility = "hidden lg:flex";
                            return (
                                <button
                                    key={link.id}
                                    onClick={handleNavClick(link.id)}
                                    className={`${visibility} px-4 py-1.5 rounded-full text-sm font-medium transition-all items-center gap-1.5 ${isActive ? "text-black" : "text-gray-500 hover:text-black"}`}
                                    ref={(el) => { navRefs.current[link.id] = el; }}
                                    style={{ position: "relative", zIndex: 10 }}
                                >
                                    {React.createElement(link.icon as React.ElementType, { className: "w-4 h-4" })}
                                    <span>{link.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Small-screen actions (FAQ + Contact) */}
                <div className="md:hidden flex items-center gap-x-2">
                    <button
                        onClick={handleNavClick("faq")}
                        className="px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
                    >
                        FAQ
                    </button>
                    <button
                        onClick={handleNavClick("contact")}
                        className="px-3 py-1.5 rounded-full text-sm font-medium text-white bg-black hover:bg-gray-900 transition"
                    >
                        Contact
                    </button>
                </div>
                {/* Medium+ actions (Dashboard / Sign In) */}
                <div className="hidden md:flex items-center gap-x-2">
                    <button
                        onClick={handleCtaClick}
                        className="px-4 py-1.5 rounded-full text-sm font-semibold text-white bg-black hover:bg-gray-900 transition"
                    >
                        {user ? "Dashboard ↗" : "Sign In / Up ↗"}
                    </button>
                </div>
            </div>

            {/* Persistent Footer Navigation Bar for Mobile */}
            <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-background2 shadow-t-lg flex justify-center py-2 z-40 border-t border-gray-200">
                <button
                    onClick={handleCtaClick}
                    className="mx-auto px-5 py-2 rounded-full text-sm font-semibold text-white bg-black hover:bg-gray-900 transition"
                >
                    {user ? "Dashboard ↗" : "Sign In / Up ↗"}
                </button>
            </nav>
        </>
    );
};

export default Navbar;
