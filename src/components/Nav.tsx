import React, { useEffect, useState } from "react";

const Navbar = () => {
    const [activeId, setActiveId] = useState<"home" | "how" | "contact">("home");

    const handleNavClick = (id: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
        setActiveId(id as any);
    };

    // Map labels to actual section IDs
    const navLinks = [
        { id: "home", label: "About" },       // landing / hero
        { id: "how", label: "Register" },    // how it works
        { id: "contact", label: "Contact" }, // contact us
    ];

    useEffect(() => {
        // Observe sections inside the scrollable content container
        const root = document.getElementById("content");
        if (!root) return;

        const monitored = ["home", "how", "contact"]
            .map((id) => document.getElementById(id))
            .filter(Boolean) as Element[];

        const obs = new IntersectionObserver(
            (entries) => {
                // Find the entry most in view
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
                if (visible && visible.target.id !== activeId) {
                    setActiveId(visible.target.id as any);
                }
            },
            { root, threshold: [0.25, 0.5, 0.75] }
        );

        monitored.forEach((el) => obs.observe(el));
        return () => obs.disconnect();
    }, [activeId]);

    const island = "flex items-center ";

    return (
        <>
            <div className="fixed top-1 left-1 right-1 h-16 bg-background2 shadow-lg rounded-xl z-50 flex items-center px-4 sm:px-8">
                {/* Logo */}
                <div className={island}>
                    <div className="flex items-center gap-x-4">
                        <img
                            src={process.env.PUBLIC_URL + "/images/svg/logo.svg"}
                            alt="Logo"
                            className="h-8 w-8 sm:h-10 sm:w-10 "
                        />
                        <span className=" text-lg sm:text-xl font-bold text-primary">
                            MockZo
                        </span>
                    </div>
                </div>

                {/* Navigation Links Container */}
                <div className="hidden md:flex flex-1 justify-center">
                    <div className={`${island} px-4 space-x-8`}>
                        {navLinks.map((link) => (
                            <a
                                key={link.id}
                                href={`#${link.id}`}
                                onClick={handleNavClick(link.id)}
                                aria-current={activeId === link.id ? "page" : undefined}
                                className={`font-medium px-2 transition-colors ${activeId === link.id
                                    ? "text-primary"
                                    : "text-textTitle hover:text-primary"
                                    }`}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Buttons Container */}
                <div className={`${island} ml-auto p-0 px-4 py-2 space-x-4 overflow-hidden`}>
                    <button
                        className="flex-1 h-full flex items-center justify-center rounded-2xl bg-primary text-white font-medium"
                    >
                        <div className="px-3 py-1 bg-primary rounded-md">
                            Sign In / Up
                        </div>
                    </button>
                </div>
            </div>

            {/* Persistent Footer Navigation Bar for Mobile */}
            <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-background2 shadow-t-lg flex justify-around py-2 z-40 border-t border-gray-200">
                {navLinks.map((link) => (
                    <div key={link.id} className="flex-1 flex justify-center">
                        <a
                            href={`#${link.id}`}
                            onClick={handleNavClick(link.id)}
                            aria-current={activeId === link.id ? "page" : undefined}
                            className={`flex flex-col items-center justify-center text-xs transition-colors ${activeId === link.id
                                ? "text-primary font-semibold"
                                : "text-textTitle hover:text-primary"
                                }`}
                        >
                            <div className={`w-5 h-5 rounded-full mb-1 ${activeId === link.id ? "bg-primary/80" : "bg-primary/20"
                                }`}></div>
                            {link.label}
                        </a>
                    </div>
                ))}
            </nav>
        </>
    );
};

export default Navbar;