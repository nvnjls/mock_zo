import React from "react";

export function Pill({ tone = "ok", children }: { tone?: "ok" | "warn"; children: React.ReactNode }) {
    const classes = tone === "ok" ? "bg-[#60f0c3]/15 text-[#9bf2da]" : "bg-yellow-500/10 text-yellow-300";
    return <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${classes}`}>{children}</span>;
}