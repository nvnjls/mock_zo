import React from "react";

/**
 * Material-style surface card.
 * - Light theme friendly
 * - Elevation (shadow) instead of glass blur
 * - `highlight` adds an indigo accent border & subtle elevated shadow
 */
export function GlassCard({
    children,
    highlight = false,
}: {
    children: React.ReactNode;
    highlight?: boolean;
}) {
    return (
        <section
            className={
                "relative rounded-2xl border p-5 bg-white text-slate-900 " +
                (highlight
                    ? "border-indigo-300 shadow-[0_6px_20px_-2px_rgba(79,70,229,0.25)]"
                    : "border-slate-200 shadow-sm hover:shadow-md transition-shadow")
            }
            aria-live="polite"
        >
            {children}
        </section>
    );
}