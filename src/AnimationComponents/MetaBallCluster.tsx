// src/Components/MetaballCluster.tsx
import React, { useEffect, useState } from "react";

interface MetaballClusterProps {
    opacity?: number;
    speed?: number;
    size?: number;
    position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center" | "top-center" | "bottom-center";
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
}

const MetaballCluster: React.FC<MetaballClusterProps> = ({
    opacity = 0.6,
    speed = 0.01,
    size = 240,
    position = "top-left",
    primaryColor = "bg-primary",
    secondaryColor = "bg-secondary",
    accentColor = "bg-accent",
}) => {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const positionClassMap: Record<string, string> = {
        "top-left": "top-0 left-0",
        "top-right": "top-0 right-0",
        "bottom-left": "bottom-8 left-0",
        "bottom-right": "bottom-8 right-0",
        "center": "top-1/2 left-1/2",
        "top-center": "top-0 left-1/2",
        "bottom-center": "bottom-8 left-1/2",
    };
    const wrapperClass = positionClassMap[position] || "top-0 left-0";
    const applyTransform = ["center", "top-center", "bottom-center"].includes(position);
    const translateY = position === "center" ? "-translate-y-1/2" : "";

    return (
        <div className={`absolute ${wrapperClass} z-0 overflow-visible pointer-events-none ${applyTransform ? "transform -translate-x-1/2" : ""} ${translateY}`}>
            <div
                className={`absolute top-0 left-0 ${primaryColor} rounded-full mix-blend-multiply filter blur-2xl animate-blob`}
                style={{ width: size, height: size, opacity, transform: `translateY(${scrollY * speed}px)` }}
            />
            <div
                className={`absolute top-24 left-36 ${secondaryColor} rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-2000`}
                style={{ width: size * 0.8, height: size * 0.8, opacity, transform: `translateY(${scrollY * speed * 1.2}px)` }}
            />
            <div
                className={`absolute top-40 left-12 ${accentColor} rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-4000`}
                style={{ width: size * 0.6, height: size * 0.6, opacity, transform: `translateY(${scrollY * speed * 0.8}px)` }}
            />
        </div>
    );
};

export default MetaballCluster;