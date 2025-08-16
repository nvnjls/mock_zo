// src/Admin/components/Primitives.tsx
import React from "react";
import { CompanyKind } from "../types";

export function Gate({ children }: { children: React.ReactNode }) {
    return <div className="min-h-[60vh] grid place-items-center text-white" > {children} </div>;
}
export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return <div className={`w-full max-w-md space-y-4 rounded-2xl border border-white/10 bg-white/[0.04] p-6 ${className}`}> {children} </div>;
}
export function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="block" >
            <div className="mb-1 text-xs font-medium text-white/80" > {label} </div>
            {children}
        </label>
    );
}

export function chipClass(p: CompanyKind) {
    const base = "rounded-full px-2 py-0.5 text-[10px] font-medium";
    if (p === "service") return `${base} bg-rose-500/15 text-rose-300`;
    if (p === "product") return `${base} bg-emerald-500/15 text-emerald-300`;
    return `${base} bg-amber-500/15 text-amber-300`;
}
export function labelForPackage(p: CompanyKind) {
    if (p === "service") return "Service";
    if (p === "product") return "Product";
    return "MAANG";
}

// pill checkbox helpers
export const chipBase = "rounded-full px-2 py-0.5 text-[10px] font-medium";
export const chipColors: Record<string, string> = {
    rose: "bg-rose-500/15 text-rose-300 ring-rose-400/30",
    emerald: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/30",
    amber: "bg-amber-500/15 text-amber-300 ring-amber-400/30",
};
export const chipOff = "bg-white/[0.06] text-white/80 border border-white/15";
export const chipCommon = "inline-flex items-center gap-2 cursor-pointer select-none";