import React, { useState } from "react";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // List of components in Content.tsx
    const navLinks = [
        { id: "landing", label: "Landing" },
        { id: "about", label: "About" },
        { id: "services", label: "Services" },
        { id: "stats", label: "Stats" },
        { id: "contact", label: "Contact" },
    ];

    return (
        <div className="fixed top-2 left-2 right-2 h-16 bg-gray-100 shadow-lg rounded-lg z-50 flex items-center px-4 sm:px-8">
            {/* Logo */}
            <div className="flex items-center">
                <img
                    src={process.env.PUBLIC_URL + "/images/svg/logo.svg"}
                    alt="Logo"
                    className="h-8 w-8 sm:h-10 sm:w-10"
                />
                <span className="ml-2 text-lg sm:text-xl font-bold text-gray-700">
                    Mockzo
                </span>
            </div>

            {/* Navigation Links */}
            <div className="hidden sm:flex ml-auto space-x-6">
                {navLinks.map((link) => (
                    <a
                        key={link.id}
                        href={`#${link.id}`}
                        className="text-gray-600 hover:text-primary font-medium"
                    >
                        {link.label}
                    </a>
                ))}
            </div>

            {/* Hamburger Menu for Small Screens */}
            <div className="sm:hidden ml-auto">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-gray-600 focus:outline-none"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                        />
                    </svg>
                </button>
            </div>

            {/* Dropdown Menu for Small Screens */}
            {isMenuOpen && (
                <div className="absolute top-16 left-0 right-0 bg-gray-100 shadow-lg rounded-lg py-4 flex flex-col items-center space-y-4 sm:hidden">
                    {navLinks.map((link) => (
                        <a
                            key={link.id}
                            href={`#${link.id}`}
                            className="text-gray-600 hover:text-primary font-medium"
                            onClick={() => setIsMenuOpen(false)} // Close menu on click
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Navbar;